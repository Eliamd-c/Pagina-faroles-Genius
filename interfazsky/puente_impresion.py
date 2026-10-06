"""Puente de impresión: imprime en la Toshiba cada guía nueva de Skydropx.

Corre en un equipo de la oficina (misma red que la impresora). Solo hace
conexiones de salida (a Skydropx y a la impresora), así que funciona con
CGNAT y sin abrir puertos en el router.

Uso:
    python puente_impresion.py                 # vigila y imprime guías nuevas
    python puente_impresion.py --simular       # muestra qué imprimiría, sin imprimir
    python puente_impresion.py --una-vez       # revisa una sola vez y termina

La primera vez marca como "ya impresas" las guías pendientes que existan,
para no imprimir de golpe todo lo viejo. Para imprimirlas igual, usa
--imprimir-pendientes.
"""
import argparse
import json
import os
import time
from datetime import datetime

import guias as guias_mod
from app import BASE_URL, obtener_token
from impresora import IMPRESORA_URL, imprimir_pdf

INTERVALO = int(os.getenv("INTERVALO_SEGUNDOS", "30"))
CIAN = os.getenv("GUIAS_CIAN", "0") == "1"

CARPETA = os.path.dirname(os.path.abspath(__file__))
ESTADO = os.path.join(CARPETA, "impresas.json")
LOG = os.path.join(CARPETA, "puente_impresion.log")


def log(msg):
    linea = f"[{datetime.now():%Y-%m-%d %H:%M:%S}] {msg}"
    print(linea, flush=True)
    with open(LOG, "a", encoding="utf-8") as f:
        f.write(linea + "\n")


def cargar_impresas():
    if not os.path.exists(ESTADO):
        return None
    with open(ESTADO, encoding="utf-8") as f:
        return set(json.load(f))


def guardar_impresas(ids):
    tmp = ESTADO + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(sorted(ids), f)
    os.replace(tmp, ESTADO)


def revisar(impresas, simular):
    token = obtener_token()
    if not token:
        log("No se pudo autenticar con Skydropx; reintento en la próxima vuelta.")
        return
    nuevas = [g for g in guias_mod.listar_guias(BASE_URL, token, estados=("created",))
              if g["id"] not in impresas]
    for g in reversed(nuevas):  # de la más antigua a la más reciente
        desc = f"guía {g['guia']} - {g['destinatario']} ({g['ciudad']})"
        if simular:
            log(f"[SIMULACIÓN] Imprimiría {desc}")
            continue
        pdf, errores = guias_mod.consolidar_pdf([g], cian=CIAN, resumen=False)
        if not pdf:
            log(f"No se pudo descargar la {desc}: {'; '.join(errores)}")
            continue
        try:
            imprimir_pdf(pdf, f"Guia {g['guia']}", color=CIAN)
        except Exception as e:
            log(f"Error imprimiendo la {desc}: {e}")
            continue
        impresas.add(g["id"])
        guardar_impresas(impresas)
        log(f"Impresa la {desc}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    p.add_argument("--simular", action="store_true", help="no imprime, solo muestra qué haría")
    p.add_argument("--una-vez", action="store_true", help="revisa una vez y termina")
    p.add_argument("--imprimir-pendientes", action="store_true",
                   help="en el primer arranque, imprime también las guías pendientes ya existentes")
    args = p.parse_args()

    impresas = cargar_impresas()
    if impresas is None:
        impresas = set()
        if not args.imprimir_pendientes and not args.simular:
            token = obtener_token()
            if not token:
                raise SystemExit("No se pudo autenticar con Skydropx.")
            existentes = guias_mod.listar_guias(BASE_URL, token, estados=("created",))
            impresas = {g["id"] for g in existentes}
            guardar_impresas(impresas)
            log(f"Primer arranque: {len(impresas)} guías pendientes marcadas como ya impresas.")

    log(f"Puente activo. Impresora: {IMPRESORA_URL}. Revisando cada {INTERVALO} s.")
    while True:
        try:
            revisar(impresas, args.simular)
        except Exception as e:
            log(f"Error en la revisión: {e}")
        if args.una_vez:
            break
        time.sleep(INTERVALO)


if __name__ == "__main__":
    main()
