"""Envío directo de PDFs a la Toshiba por la red (IPP)."""
import os
import struct

import pymupdf
import requests

IMPRESORA_URL = os.getenv("IMPRESORA_URL", "http://192.168.1.17:631/ipp/print")


def _ipp_attr(tag, nombre, valor):
    n, v = nombre.encode(), valor.encode()
    return struct.pack(">BH", tag, len(n)) + n + struct.pack(">H", len(v)) + v


CARTA = (612, 792)


def a_hojas_carta(pdf):
    """La impresora solo tiene papel carta/oficio: si hay páginas media carta
    (5,5 x 8,5 pulgadas), las acomoda de a dos por hoja carta, giradas, para cortar a la mitad."""
    src = pymupdf.open("pdf", pdf)
    if all(min(p.rect.width, p.rect.height) > 500 for p in src):
        return pdf
    out = pymupdf.open()
    W, H = CARTA
    pagina = None
    for i, p in enumerate(src):
        if min(p.rect.width, p.rect.height) > 500:   # página grande (p. ej. resumen): va sola
            nueva = out.new_page(width=W, height=H)
            nueva.show_pdf_page(nueva.rect, src, i)
            pagina = None
            continue
        if pagina is None:
            pagina, mitad = out.new_page(width=W, height=H), 0
        caja = pymupdf.Rect(0, mitad * H / 2, W, (mitad + 1) * H / 2)
        pagina.show_pdf_page(caja, src, i, rotate=90 if p.rect.height > p.rect.width else 0)
        if mitad:
            pagina = None
        mitad = 1
    return out.tobytes(deflate=True)


def imprimir_pdf(pdf, nombre_trabajo, color=False):
    """Envía el PDF a la impresora con IPP Print-Job. Lanza RuntimeError si falla."""
    pdf = a_hojas_carta(pdf)
    uri = IMPRESORA_URL.replace("http://", "ipp://").replace(":631", "")
    cabecera = (struct.pack(">BBHI", 2, 0, 0x0002, 1) + b"\x01"
                + _ipp_attr(0x47, "attributes-charset", "utf-8")
                + _ipp_attr(0x48, "attributes-natural-language", "es")
                + _ipp_attr(0x45, "printer-uri", uri)
                + _ipp_attr(0x42, "job-name", nombre_trabajo[:60])
                + _ipp_attr(0x49, "document-format", "application/pdf")
                + b"\x02"  # atributos del trabajo
                + _ipp_attr(0x44, "print-color-mode", "color" if color else "monochrome")
                + b"\x03")
    try:
        r = requests.post(IMPRESORA_URL, data=cabecera + pdf,
                          headers={"Content-Type": "application/ipp"}, timeout=60)
        r.raise_for_status()
    except requests.RequestException as e:
        raise RuntimeError(f"No se pudo conectar con la impresora: {e}") from e
    estado = struct.unpack(">H", r.content[2:4])[0]
    if estado >= 0x0100:
        raise RuntimeError(f"La impresora rechazó el trabajo (código IPP 0x{estado:04x})")
