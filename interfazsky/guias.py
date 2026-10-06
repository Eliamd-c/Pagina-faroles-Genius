"""Consolidación de guías de Skydropx en un solo PDF imprimible, con el número de paquetes."""
import io
import re
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from functools import lru_cache
from pathlib import Path

import numpy as np
import pymupdf
import requests
from PIL import Image

CIAN = (0, 0.6, 0.8)


def paquetes_de(package):
    """(total, paquete1, paquete2) de un envío.
    1) Si el contenido trae el desglose que escribe la app ("Faroles P1:11 P2:6"), se usa eso.
    2) Si no, el total sale del kit o de la altura de la caja (1 cm por paquete + 1 de empaque)
       y no se sabe el desglose por referencia."""
    contenido = f"{package.get('package_content') or ''} {package.get('consignment_note') or ''}".lower()
    p1 = re.search(r"p1\s*:\s*(\d+)", contenido)
    p2 = re.search(r"p2\s*:\s*(\d+)", contenido)
    if p1 or p2:
        a, b = int(p1.group(1)) if p1 else 0, int(p2.group(1)) if p2 else 0
        return a + b, a, b

    if "emprendedor" in contenido:
        total = 6
    elif "muestra" in contenido:
        total = 2
    else:
        m = re.search(r"x\s*(\d+)", contenido)
        if m:
            total = int(m.group(1))
        else:
            try:
                total = max(1, round(float(package.get("height") or 2)) - 1)
            except ValueError:
                total = 1
    return total, None, None


def listar_guias(base_url, token, estados=("created",), max_paginas=50):
    """Envíos con guía generada en los estados pedidos ('created' = pendiente de recoger).
    Skydropx pagina con ?page=N (20 por página, del más antiguo al más reciente),
    así que se recorren todas las páginas en paralelo."""
    headers = {"Authorization": f"Bearer {token}"}

    def pagina(n):
        r = requests.get(f"{base_url}/shipments", headers=headers, params={"page": n}, timeout=30)
        r.raise_for_status()
        return r.json()

    primera = pagina(1)
    total = min((primera.get("meta") or {}).get("total_pages") or 1, max_paginas)
    with ThreadPoolExecutor(max_workers=6) as ex:
        paginas = [primera] + list(ex.map(pagina, range(2, total + 1)))

    guias, vistos = [], set()
    for data in paginas:
        included = {(x["type"], x["id"]): x["attributes"] for x in data.get("included", [])}

        for s in data.get("data", []):
            attr = s["attributes"]
            rel = s.get("relationships", {})
            destino = included.get(("address", (rel.get("address_to", {}).get("data") or {}).get("id")), {})
            for ref in rel.get("packages", {}).get("data", []):
                pkg = included.get(("package", ref["id"]))
                if (not pkg or ref["id"] in vistos or not pkg.get("label_url")
                        or pkg.get("tracking_status") not in estados):
                    continue
                vistos.add(ref["id"])
                total, p1, p2 = paquetes_de(pkg)
                guias.append({
                    "id": ref["id"],
                    "guia": pkg.get("tracking_number") or attr.get("master_tracking_number"),
                    "transportadora": attr.get("carrier_name", ""),
                    "destinatario": destino.get("name") or "",
                    "ciudad": (destino.get("area_level2") or "").title(),
                    "paquetes": total,
                    "paquete1": p1,
                    "paquete2": p2,
                    "recaudo": float(attr.get("on_delivery_amount") or 0),
                    "creado": attr.get("created_at", ""),
                    "label_url": pkg["label_url"],
                })

    guias.sort(key=lambda g: g["creado"], reverse=True)
    return guias


def _a_cian(page, dpi=200, clip=None):
    """Rasteriza la página y pasa todo lo oscuro a cian (como descargar_guias_pendientes.py)."""
    pix = page.get_pixmap(colorspace=pymupdf.csRGB, dpi=dpi, alpha=False, clip=clip)
    arr = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, 3).copy()
    oscuro = (arr < 180).all(axis=2)
    arr[oscuro] = (0, 255, 255)
    return pymupdf.Pixmap(pymupdf.csRGB, pix.width, pix.height, arr.tobytes(), False)


def _analizar_etiqueta(page):
    """Devuelve (rect con contenido, rotación del texto en grados) de la etiqueta original."""
    pix = page.get_pixmap(dpi=36, colorspace=pymupdf.csGRAY, alpha=False)
    arr = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width)
    ys, xs = np.nonzero(arr < 240)
    k = page.rect.width / pix.width
    contenido = (pymupdf.Rect(xs.min() * k, ys.min() * k, (xs.max() + 1) * k, (ys.max() + 1) * k)
                 if len(xs) else pymupdf.Rect(0, 0, 0, 0))

    # Dirección dominante del texto: la guía de Interrapidísimo viene girada 90°
    votos = {0: 0, 90: 0, 180: 0, 270: 0}
    for b in page.get_text("dict")["blocks"]:
        for line in b.get("lines", []):
            dx, dy = line["dir"]
            rot = {(1, 0): 0, (0, -1): 90, (-1, 0): 180, (0, 1): 270}.get((round(dx), round(dy)), 0)
            votos[rot] += len("".join(s["text"] for s in line["spans"]))
    # El texto se mide sin la rotación de la página; se corrige para obtener cómo se ve
    return contenido, (max(votos, key=votos.get) - page.rotation) % 360


def _hueco_en_guia(src_page):
    """Espacio libre en la última línea de la guía de Interrapidísimo, entre
    'www.interrapidisimo.com' y el número de guía. Devuelve el Rect en coordenadas
    sin rotar de la página original, o None si la guía tiene otro formato."""
    web = src_page.search_for("www.interrapidisimo.com")
    if not web:
        return None
    web = web[0]
    # Palabras en la misma línea, a la derecha de la web
    derecha = [pymupdf.Rect(w[:4]) for w in src_page.get_text("words")
               if abs((w[1] + w[3]) / 2 - (web.y0 + web.y1) / 2) < 4 and w[0] > web.x1]
    fin = min((r.x0 for r in derecha), default=web.x1 + 130)
    if fin - web.x1 < 60:
        return None
    return pymupdf.Rect(web.x1 + 8, web.y0 - 2, fin - 8, web.y1 + 2)


def etiqueta_paquetes(g, corto=False):
    """Texto del desglose: 'PAQUETE 1: 11 · PAQUETE 2: 6' o, si no se sabe, 'PAQUETES: 17'."""
    if g.get("paquete1") is None and g.get("paquete2") is None:
        return f"PAQ: {g['paquetes']}" if corto else f"PAQUETES: {g['paquetes']}"
    etiqueta = "P" if corto else "PAQUETE "
    partes = [f"{etiqueta}{n}: {g[f'paquete{n}']}" for n in (1, 2) if g.get(f"paquete{n}")]
    return " · ".join(partes)


def _paquetes_integrado(page, src_page, g, color, rot):
    """Escribe el desglose de paquetes dentro de la guía, en el hueco de la última línea.
    Devuelve False si la guía no tiene ese hueco."""
    hueco = _hueco_en_guia(src_page)
    if hueco is None:
        return False
    texto = etiqueta_paquetes(g)
    fs = min(hueco.height * 0.95, 14)
    while pymupdf.get_text_length(texto, fontname="hebo", fontsize=fs) > hueco.width and fs > 6:
        fs -= 0.5
    if pymupdf.get_text_length(texto, fontname="hebo", fontsize=fs) > hueco.width:
        texto = etiqueta_paquetes(g, corto=True)   # versión corta si no cabe la larga
        fs = min(hueco.height * 0.95, 14)
        while pymupdf.get_text_length(texto, fontname="hebo", fontsize=fs) > hueco.width and fs > 5:
            fs -= 0.5
    # Se dibuja derecho en una hoja del tamaño del hueco y se pega girado como la guía
    sello = pymupdf.open()
    sp = sello.new_page(width=hueco.width, height=hueco.height)
    tw = pymupdf.get_text_length(texto, fontname="hebo", fontsize=fs)
    sp.insert_text(((hueco.width - tw) / 2, hueco.height / 2 + fs * 0.35), texto,
                   fontsize=fs, fontname="hebo", color=color)
    destino = hueco * src_page.rotation_matrix    # a coordenadas de la página tal como se ve
    page.show_pdf_page(destino, sello, 0, rotate=rot)
    sello.close()
    return True


def _sello_paquetes(page, g, color, contenido, rot):
    """Respaldo para guías de otro formato: recuadro pequeño en el espacio libre de la hoja."""
    W, H = page.rect.width, page.rect.height
    vertical = rot in (90, 270)
    largo, corto = 150, 40                         # tamaño del sello leído en su orientación
    bw, bh = (corto, largo) if vertical else (largo, corto)

    # Buscar hueco: debajo, a la derecha o encima del contenido; si no hay, esquina inferior derecha
    m = 16
    candidatos = [
        pymupdf.Rect(contenido.x0, contenido.y1 + m, contenido.x0 + bw, contenido.y1 + m + bh),
        pymupdf.Rect(contenido.x1 + m, contenido.y0, contenido.x1 + m + bw, contenido.y0 + bh),
        pymupdf.Rect(contenido.x0, contenido.y0 - m - bh, contenido.x0 + bw, contenido.y0 - m),
    ]
    caja = next((c for c in candidatos if page.rect.contains(c)),
                pymupdf.Rect(W - bw - m, H - bh - m, W - m, H - m))

    # El sello se dibuja derecho en una hoja aparte y se pega girado como la guía
    sello = pymupdf.open()
    sp = sello.new_page(width=largo, height=corto)
    sp.draw_rect(sp.rect + (1, 1, -1, -1), color=color, fill=(1, 1, 1), width=1.5)
    sp.insert_text((8, 26), etiqueta_paquetes(g), fontsize=12, fontname="hebo", color=color)
    page.show_pdf_page(caja, sello, 0, rotate=rot)
    sello.close()


def _pagina_resumen(doc, guias, color):
    page = doc.new_page(width=612, height=792)
    y = 50
    page.insert_text((40, y), "Resumen de guías para imprimir", fontsize=18, fontname="hebo", color=color)
    y += 20
    page.insert_text((40, y), datetime.now().strftime("Generado el %d/%m/%Y %H:%M"), fontsize=10, color=(0.4, 0.4, 0.4))
    y += 30

    cols = [(40, "#"), (62, "Guía"), (160, "Destinatario"), (330, "Ciudad"),
            (420, "Paq. 1"), (462, "Paq. 2"), (503, "Total"), (535, "Recaudo")]
    for x, t in cols:
        page.insert_text((x, y), t, fontsize=10, fontname="hebo")
    y += 6
    page.draw_line((40, y), (572, y), color=(0.7, 0.7, 0.7))
    y += 16

    for i, g in enumerate(guias, 1):
        if y > 740:
            page = doc.new_page(width=612, height=792)
            y = 50
        fila = [str(i), str(g["guia"] or "-"), g["destinatario"][:28], g["ciudad"][:16],
                "—" if g.get("paquete1") is None else str(g["paquete1"]),
                "—" if g.get("paquete2") is None else str(g["paquete2"]),
                str(g["paquetes"]),
                f"${g['recaudo']:,.0f}".replace(",", ".") if g["recaudo"] else "—"]
        for (x, _), t in zip(cols, fila):
            page.insert_text((x, y), t, fontsize=10, fontname="hebo" if x in (420, 462, 503) else "helv")
        y += 18

    y += 6
    page.draw_line((40, y), (572, y), color=(0.7, 0.7, 0.7))
    y += 22
    total_paq = sum(g["paquetes"] for g in guias)
    total_rec = sum(g["recaudo"] for g in guias)
    t1 = sum(g["paquete1"] or 0 for g in guias)
    t2 = sum(g["paquete2"] or 0 for g in guias)
    page.insert_text((40, y), f"{len(guias)} guías   ·   {total_paq} paquetes en total   ·   "
                              f"Recaudo contra entrega: ${total_rec:,.0f}".replace(",", "."),
                     fontsize=12, fontname="hebo", color=color)
    y += 20
    sin_desglose = sum(g["paquetes"] for g in guias if g.get("paquete1") is None and g.get("paquete2") is None)
    detalle = (f"Para empacar:   Paquete 1 (Devoción y Tradición): {t1}      "
               f"Paquete 2 (Fe y Esperanza): {t2}")
    if sin_desglose:
        detalle += f"      Sin desglose: {sin_desglose}"
    page.insert_text((40, y), detalle, fontsize=11, fontname="hebo", color=(0.2, 0.2, 0.2))


MEDIA_CARTA = (396, 612)        # 5,5 × 8,5 pulgadas en puntos
LOGO_PATH = Path(__file__).with_name("marca") / "logo.png"


@lru_cache(maxsize=4)
def _logo_marca(opacidad):
    """Logo en una sola tinta, muy claro, listo para usar como marca de agua.
    Devuelve (png, proporción ancho/alto) o None si no hay archivo de logo."""
    if not LOGO_PATH.exists():
        return None
    arr = np.array(Image.open(LOGO_PATH).convert("RGBA")).astype(float)
    tinta = 1 - arr[..., :3].min(axis=2) / 255
    figura = np.clip(tinta * (arr[..., 3] / 255), 0, 1)
    figura = figura[:int(figura.shape[0] * 0.70), :]          # solo el emblema, sin el lettering
    ys, xs = np.nonzero(figura > 0.03)
    if not len(ys):
        return None
    figura = figura[ys.min():ys.max() + 1, xs.min():xs.max() + 1]
    alto, ancho = figura.shape
    salida = np.zeros((alto, ancho, 4), np.uint8)
    salida[..., 3] = (figura * opacidad * 255).astype(np.uint8)
    buf = io.BytesIO()
    Image.fromarray(salida, "RGBA").save(buf, "PNG")
    return buf.getvalue(), ancho / alto


def _franja_marca(page, rect, g, color, marca=True):
    """Pie de la hoja: paquetes a la izquierda, identidad de marca a la derecha."""
    page.draw_line((rect.x0, rect.y0), (rect.x1, rect.y0), color=color, width=0.5, stroke_opacity=0.35)

    # Lo operativo: qué empacar
    page.insert_text((rect.x0, rect.y0 + 22), etiqueta_paquetes(g), fontsize=15, fontname="hebo", color=color)
    datos = " · ".join(x for x in [g.get("destinatario", "")[:24], g.get("ciudad", "")] if x)
    page.insert_text((rect.x0, rect.y0 + 38), datos, fontsize=8.5, color=(0.45, 0.45, 0.45))
    if g.get("recaudo"):
        page.insert_text((rect.x0, rect.y0 + 52), f"A cobrar ${g['recaudo']:,.0f}".replace(",", "."),
                         fontsize=9, fontname="hebo", color=color)

    if not marca:
        return
    # La identidad: emblema al 55% de la franja y el nombre en versalitas espaciadas
    logo = _logo_marca(0.55)
    base_y = rect.y1 - 6
    if logo:
        png, prop = logo
        alto = min(rect.height - 16, 46)
        caja = pymupdf.Rect(rect.x1 - alto * prop, rect.y0 + 8, rect.x1, rect.y0 + 8 + alto)
        page.insert_image(caja, stream=png)
        base_y = caja.y1 + 11
    texto, fs, esp = "FAROLES GENIUS", 7.5, 2.6
    anchos = [pymupdf.get_text_length(c, fontname="helv", fontsize=fs) for c in texto]
    x = rect.x1 - (sum(anchos) + esp * (len(texto) - 1))
    for c, w in zip(texto, anchos):
        page.insert_text((x, base_y), c, fontsize=fs, fontname="helv", color=color, fill_opacity=0.75)
        x += w + esp


def _pagina_media_carta(out, src_page, g, color, cian, marca):
    """Guía recortada, enderezada y escalada a media carta, con franja de marca abajo."""
    contenido, rot = _analizar_etiqueta(src_page)
    pix = _a_cian(src_page, dpi=300, clip=contenido) if cian else \
        src_page.get_pixmap(dpi=300, alpha=False, clip=contenido)

    W, H = MEDIA_CARTA
    page = out.new_page(width=W, height=H)
    margen, franja = 24, 76
    zona = pymupdf.Rect(margen, margen, W - margen, H - margen - franja)

    # Al enderezar la guía (rot 270 → girar 90°) se intercambian ancho y alto
    vertical = rot in (90, 270)
    ancho_real, alto_real = (pix.height, pix.width) if vertical else (pix.width, pix.height)
    escala = min(zona.width / ancho_real, zona.height / alto_real)
    w, h = ancho_real * escala, alto_real * escala
    destino = pymupdf.Rect(zona.x0 + (zona.width - w) / 2, zona.y0, zona.x0 + (zona.width - w) / 2 + w, zona.y0 + h)
    page.insert_image(destino, pixmap=pix, rotate=(360 - rot) % 360)

    _franja_marca(page, pymupdf.Rect(margen, H - margen - franja + 14, W - margen, H - margen), g, color, marca)


def consolidar_pdf(guias, cian=True, resumen=True, media_carta=False, marca=False):
    """Descarga las etiquetas y las une en un solo PDF. Devuelve (bytes, errores)."""
    color = CIAN if cian else (0, 0, 0)

    def bajar(g):
        try:
            r = requests.get(g["label_url"], timeout=30)
            r.raise_for_status()
            return g, r.content, None
        except Exception as e:
            return g, None, str(e)

    with ThreadPoolExecutor(max_workers=6) as ex:
        descargas = list(ex.map(bajar, guias))

    out = pymupdf.open()
    errores = []
    ok = [g for g, pdf, err in descargas if pdf]
    if resumen and ok:
        _pagina_resumen(out, ok, color)

    for g, pdf, err in descargas:
        if err:
            errores.append(f"{g['guia']}: {err}")
            continue
        src = pymupdf.open("pdf", io.BytesIO(pdf))
        for page in src:
            if media_carta:
                _pagina_media_carta(out, page, g, color, cian, marca)
                continue
            contenido, rot = _analizar_etiqueta(page)
            nueva = out.new_page(width=page.rect.width, height=page.rect.height)
            # Se rasteriza en ambos modos para que la guía quede exactamente como se ve
            # (show_pdf_page ignora la rotación de la página y descuadraba el sello)
            if cian:
                nueva.insert_image(nueva.rect, pixmap=_a_cian(page))
            else:
                nueva.insert_image(nueva.rect, pixmap=page.get_pixmap(dpi=300, alpha=False))
            if not _paquetes_integrado(nueva, page, g, color, rot):
                _sello_paquetes(nueva, g, color, contenido, rot)
        src.close()

    data = out.tobytes(garbage=3, deflate=True) if len(out) else b""
    out.close()
    return data, errores
