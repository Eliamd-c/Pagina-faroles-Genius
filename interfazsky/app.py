from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import requests
import json
import time
import io
import os
import hmac
import secrets as _secrets
from datetime import datetime
from werkzeug.security import check_password_hash
from flask import send_file
import guias as guias_mod
import impresora

# Las credenciales viven en el archivo .env (que NO se sube al repositorio).
# Copia .env.ejemplo a .env y llénalo. Ver LEEME-DESPLIEGUE.md
try:
    from dotenv import load_dotenv
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))
except ImportError:
    pass


def _config(nombre, obligatoria=True):
    valor = os.getenv(nombre, "").strip()
    if not valor and obligatoria:
        raise RuntimeError(f"Falta la variable {nombre}. Créala en el archivo .env "
                           f"(usa .env.ejemplo como guía).")
    return valor


app = Flask(__name__)
# Sin SECRET_KEY definida se genera una al vuelo: sirve en local, pero cierra la
# sesión en cada reinicio, así que en el servidor conviene definirla.
app.secret_key = os.getenv("SECRET_KEY") or _secrets.token_hex(32)

# --- CREDENCIALES SKYDROPX ---
API_KEY = _config("SKYDROPX_API_KEY")
API_SECRET = _config("SKYDROPX_API_SECRET")
BASE_URL = os.getenv("SKYDROPX_BASE_URL", "https://api-pro.skydropx.com/api/v1")

# Dirección de origen guardada en Skydropx (sucursal 222609, verificada con Interrapidísimo).
# Cotizar y despachar usando este id es lo que hace que Interrapidísimo quede disponible.
ORIGEN_ID = os.getenv("SKYDROPX_ORIGEN_ID", "9a22a2b4-1f47-4e7f-876d-1532e3cc9fa6")

# --- CREDENCIAL OPENAI ---
OPENAI_API_KEY = _config("OPENAI_API_KEY")

# --- REFERENCIAS Y KITS ---
# Las dos referencias pesan y miden igual; solo cambia el contenido del paquete.
REFERENCIAS = {1: "Devoción y Tradición", 2: "Fe y Esperanza"}
PESO_PAQUETE = 0.195        # kg por paquete
PRECIO_SUGERIDO = 17000     # precio por paquete en pedidos personalizados

# precio[modalidad]: "contraentrega" = Pago Contra Entrega, "anticipado" = pago anticipado
KITS = {
    "emprendedor": {"nombre": "Kit Emprendedor", "paquetes": 6,
                    "precio": {"contraentrega": 120000, "anticipado": 114000}},
    "muestras": {"nombre": "Kit de Muestras", "paquetes": 2,
                 "precio": {"contraentrega": 55000, "anticipado": 50000}},
    "personalizado": {"nombre": "Pedido personalizado", "paquetes": None, "precio": None},
}

def calcular_pedido(kit, pago, paquete1=None, paquete2=None, precio_unitario=None, precio_total=None):
    """Resuelve un pedido a partir del kit, la modalidad de pago y las cantidades de cada
    referencia. Devuelve un dict con nombre, cantidades, total de paquetes, precio, peso y alto.
    Lanza ValueError si los datos no son válidos."""
    kit = (kit or "").strip().lower()
    pago = (pago or "").strip().lower()
    if kit not in KITS:
        raise ValueError(f"Kit no reconocido: '{kit}'. Usa 'emprendedor', 'muestras' o 'personalizado'.")
    if pago not in ("contraentrega", "anticipado"):
        raise ValueError(f"Modalidad de pago no reconocida: '{pago}'. Usa 'contraentrega' o 'anticipado'.")

    info = KITS[kit]
    try:
        p1 = max(0, int(paquete1 or 0))
        p2 = max(0, int(paquete2 or 0))
    except (TypeError, ValueError):
        raise ValueError("Las cantidades de paquetes deben ser números enteros.")

    if kit == "personalizado":
        total = p1 + p2
        if total < 1:
            raise ValueError("Indica cuántos paquetes lleva el pedido (Paquete 1 y/o Paquete 2).")
        # Se puede dar el precio por paquete o el total del pedido; manda el total si viene
        try:
            unitario = float(precio_unitario or 0)
            completo = float(precio_total or 0)
        except (TypeError, ValueError):
            raise ValueError("El precio debe ser un número.")
        if completo > 0:
            precio = round(completo)
            unitario = precio / total
        elif unitario > 0:
            precio = round(total * unitario)
        else:
            raise ValueError("Indica el precio por paquete o el total del pedido.")
    else:
        total = info["paquetes"]
        if p1 + p2 == 0:          # no dijo cómo se reparte: todo va de la referencia 1
            p1 = total
        elif p1 + p2 != total:
            raise ValueError(f"El {info['nombre']} son {total} paquetes, pero indicaste "
                             f"{p1} del Paquete 1 y {p2} del Paquete 2 ({p1 + p2} en total).")
        unitario = info["precio"][pago] / total
        precio = info["precio"][pago]

    return {
        "kit": kit,
        "nombre": info["nombre"],
        "pago": pago,
        "modalidad": "Contra entrega" if pago == "contraentrega" else "Pago anticipado",
        "paquete1": p1,
        "paquete2": p2,
        "paquetes": total,
        "precio_unitario": round(unitario),
        "precio": precio,
        # Regla de la casa: nunca se declara menos de 1 kg, aunque el paquete pese menos
        "peso": max(1.0, round(total * PESO_PAQUETE, 3)),
        "alto": total + 1,       # 1 cm por paquete + 1 cm de empaque
    }

def descripcion_pedido(pedido):
    """Texto que va en el contenido del paquete y que se imprime en la guía."""
    partes = [f"P{n}:{pedido[f'paquete{n}']}" for n in (1, 2) if pedido[f"paquete{n}"]]
    return "Faroles " + " ".join(partes)

# --- USUARIO DEL PANEL ---
# Usuario y contraseña salen del .env. La contraseña se guarda cifrada (hash):
# genera el tuyo con  python -c "from werkzeug.security import generate_password_hash as h; print(h(input('Contraseña: ')))"
USER_ADMIN = os.getenv("PANEL_USUARIO", "admin")
PASS_HASH = os.getenv("PANEL_PASSWORD_HASH", "").strip()
PASS_PLANA = os.getenv("PANEL_PASSWORD", "").strip()   # alternativa simple para uso local

if not PASS_HASH and not PASS_PLANA:
    raise RuntimeError("Falta PANEL_PASSWORD_HASH (o PANEL_PASSWORD) en el archivo .env. "
                       "Sin eso el panel quedaría abierto para cualquiera.")


def password_correcta(password):
    if PASS_HASH:
        return check_password_hash(PASS_HASH, password or "")
    return hmac.compare_digest(PASS_PLANA, password or "")

def obtener_token():
    payload = {
        "grant_type": "client_credentials",
        "client_id": API_KEY,
        "client_secret": API_SECRET
    }
    response = requests.post(f"{BASE_URL}/oauth/token", json=payload)
    if response.status_code == 200:
        return response.json().get("access_token")
    return None

def enviar_orden_skydropx(data):
    """Crea la orden en Skydropx. `data` usa las llaves del formulario del panel.
    Devuelve la respuesta JSON de Skydropx o lanza RuntimeError."""
    token = obtener_token()
    if not token:
        raise RuntimeError("No se pudo autenticar con Skydropx")

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    barrio = (data.get("referencia_direccion") or "").strip()
    payload = {
        "order": {
            "reference": data.get("referencia", "ORDEN"),
            # Sin dirección de origen: Skydropx usa la sucursal predeterminada (ID 222609),
            # que es la que Interrapidísimo tiene verificada.
            "recipient_address": {
                "country": "CO",
                "state": data.get("estado", ""),
                "city": data.get("ciudad", ""),
                "postal_code": data.get("codigo_postal", ""),
                "address": data.get("direccion", ""),
                "reference": barrio,
                "area_level3": barrio,
                "person_name": data.get("nombre", "Cliente"),
                "phone": data.get("telefono", ""),
                "email": data.get("email") or "eliam.se75@gmail.com"
            },
            "parcels": [{
                "weight": float(data.get("peso", 1)),
                "length": int(data.get("largo", 35)),
                "width": int(data.get("ancho", 31)),
                "height": int(data.get("alto", 1)),
                "declared_amount": float(data.get("valor_declarado", 50000)),
                "package_type": "5H4",
                "consignment_note": "Faroles",
                "package_content": data.get("contenido") or "Faroles",
                "dimension_unit": "cm",
                "mass_unit": "kg"
            }]
        }
    }

    response = requests.post(f"{BASE_URL}/orders", headers=headers, json=payload)
    if response.status_code not in (200, 201):
        raise RuntimeError(response.text)
    return response.json()

@app.route("/login", methods=["GET", "POST"])
def login():
    error = None
    if request.method == "POST":
        user = request.form.get("username")
        password = request.form.get("password")
        if user == USER_ADMIN and password_correcta(password):
            session["logged_in"] = True
            return redirect(url_for("index"))
        else:
            error = "Usuario o contraseña incorrectos."
    return render_template("login.html", error=error)

@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    return redirect(url_for("login"))

@app.route("/")
def index():
    if not session.get("logged_in"):
        return redirect(url_for("login"))
    return render_template("index.html")

@app.route("/api/parse_ai", methods=["POST"])
def parse_ai():
    if not session.get("logged_in"):
        return jsonify({"error": "No autorizado"}), 401

    data = request.json
    texto = data.get("texto", "")
    
    if not texto:
        return jsonify({"error": "No enviaste texto a analizar."}), 400
        
    try:
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = f"""
        Eres un asistente experto en logística colombiana que extrae datos de envíos.
        Extrae la siguiente información del texto y devuelve un JSON válido con las siguientes llaves.
        IMPORTANTE: Devuelve ÚNICAMENTE el JSON válido, sin formato markdown, sin comillas invertidas (```), sin explicaciones.
        Si no encuentras un dato, déjalo vacío o usa tu conocimiento geográfico (ej. si dice Cali, el estado es Valle del Cauca).
        
        {{
            "referencia": "Nombre del cliente o ID de la venta (ej. Venta Maria)",
            "kit": "'emprendedor' (Kit Emprendedor / 6 paquetes), 'muestras' (Kit de Muestras / 2 paquetes) o 'personalizado' si pide cantidades libres",
            "paquete1": "cuántos paquetes de la referencia 'Paquete 1' o 'Devoción y Tradición'. 0 si no menciona",
            "paquete2": "cuántos paquetes de la referencia 'Paquete 2' o 'Fe y Esperanza'. 0 si no menciona",
            "precio_unitario": "precio de venta por paquete si lo menciona (ej. '17 mil' = 17000). 0 si no lo dice",
            "precio_total": "precio total del pedido si lo menciona como monto único (ej. 'en total 289 mil' = 289000). 0 si no lo dice",
            "pago": "'contraentrega' si dice contra entrega / contraentrega / COD; 'anticipado' si dice pago anticipado / ya pagó / transferencia",
            "nombre": "nombre completo del destinatario",
            "telefono": "numero de telefono limpio",
            "email": "Correo electrónico si aparece, si no dejalo vacio",
            "estado": "Departamento en Colombia (ej: Antioquia)",
            "ciudad": "Ciudad destino",
            "codigo_postal": "Código postal estándar de 5 o 6 dígitos de la ciudad en Colombia (ej: 05001 para Medellín, 11001 para Bogotá). DEBES inferirlo según la ciudad si no está en el texto.",
            "direccion": "Calle, carrera, numero o avenida (ej: Tr 44 99-115 apto F1101)",
            "referencia_direccion": "Detalles adicionales como edificio, barrio, manzana, referencias (ej: Edificio Barcelona, Barrio Obrero)",
            "contenido": "que contiene el paquete"
        }}
        
        Texto a analizar:
        "{texto}"
        """
        
        payload = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.1
        }
        
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        
        if response.status_code == 200:
            res_data = response.json()
            content = res_data["choices"][0]["message"]["content"].strip()
            # Limpiar por si OpenAI envía markdown de JSON
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
                
            datos = json.loads(content.strip())
            return jsonify({"success": True, "data": datos})
        else:
            return jsonify({"success": False, "error": response.text}), response.status_code
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/parse_ai_image", methods=["POST"])
def parse_ai_image():
    if not session.get("logged_in"):
        return jsonify({"error": "No autorizado"}), 401
    
    data = request.json
    base64_image = data.get("image", "")
    
    if not base64_image:
        return jsonify({"error": "No enviaste una imagen."}), 400
        
    try:
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = """
        Eres un asistente experto en logística colombiana.
        Analiza la imagen adjunta y extrae la siguiente información para un envío.
        Devuelve ÚNICAMENTE un JSON válido, sin markdown ni explicaciones.
        
        {
            "referencia": "Nombre del cliente o ID de la venta",
            "kit": "'emprendedor' (Kit Emprendedor / 6 paquetes), 'muestras' (Kit de Muestras / 2 paquetes) o 'personalizado' si pide cantidades libres",
            "paquete1": "cuántos paquetes de la referencia 'Paquete 1' o 'Devoción y Tradición'. 0 si no menciona",
            "paquete2": "cuántos paquetes de la referencia 'Paquete 2' o 'Fe y Esperanza'. 0 si no menciona",
            "precio_unitario": "precio de venta por paquete si lo menciona (ej. '17 mil' = 17000). 0 si no lo dice",
            "precio_total": "precio total del pedido si lo menciona como monto único (ej. 'en total 289 mil' = 289000). 0 si no lo dice",
            "pago": "'contraentrega' si dice contra entrega / contraentrega / COD; 'anticipado' si dice pago anticipado / ya pagó / transferencia",
            "nombre": "nombre completo del destinatario",
            "telefono": "numero de telefono limpio",
            "email": "Correo electrónico si aparece, vacio si no",
            "estado": "Departamento en Colombia",
            "ciudad": "Ciudad destino",
            "codigo_postal": "Código postal estándar de 5 o 6 dígitos de la ciudad en Colombia (ej: 05001 para Medellín, 11001 para Bogotá). DEBES inferirlo según la ciudad si no está en la imagen.",
            "direccion": "Calle, carrera, numero o avenida",
            "referencia_direccion": "Detalles adicionales (edificio, barrio)",
            "contenido": "que contiene el paquete"
        }
        """
        
        payload = {
            "model": "gpt-4o-mini",
            "messages": [
                {
                    "role": "user",
                    "content": [
                        {"type": "text", "text": prompt},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{base64_image}"}}
                    ]
                }
            ],
            "max_tokens": 500,
            "temperature": 0.1
        }
        
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        
        if response.status_code == 200:
            res_data = response.json()
            content = res_data["choices"][0]["message"]["content"].strip()
            if content.startswith("```json"):
                content = content[7:]
            if content.startswith("```"):
                content = content[3:]
            if content.endswith("```"):
                content = content[:-3]
                
            datos = json.loads(content.strip())
            return jsonify({"success": True, "data": datos})
        else:
            return jsonify({"success": False, "error": response.text}), response.status_code
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/crear_orden", methods=["POST"])
def crear_orden():
    if not session.get("logged_in"):
        return jsonify({"error": "No autorizado"}), 401
    
    data = request.json

    # El precio y las cantidades se recalculan aquí, no se confía en lo que manda el navegador
    if data.get("kit"):
        try:
            pedido = calcular_pedido(data.get("kit"), data.get("pago"), data.get("paquete1"),
                                     data.get("paquete2"), data.get("precio_unitario"), data.get("precio_total"))
        except ValueError as e:
            return jsonify({"success": False, "error": str(e)}), 400
        data["cantidad"] = pedido["paquetes"]
        data["valor_declarado"] = pedido["precio"]
        data["peso"] = pedido["peso"]
        data["alto"] = pedido["alto"]
        data["contenido"] = descripcion_pedido(pedido)

    try:
        return jsonify({"success": True, "data": enviar_orden_skydropx(data)})
    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 502

def _headers(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}

def destino_de(data):
    """Dirección del cliente en el formato que pide Skydropx."""
    barrio = (data.get("referencia_direccion") or "").strip()
    return {
        "country_code": "CO",
        "postal_code": str(data.get("codigo_postal") or ""),
        "area_level1": (data.get("estado") or "").upper(),
        "area_level2": (data.get("ciudad") or "").upper(),
        "area_level3": barrio or "Centro",
        "street1": data.get("direccion") or "",
        "name": data.get("nombre") or "Cliente",
        "phone": str(data.get("telefono") or ""),
        "email": data.get("email") or "eliam.se75@gmail.com",
        "reference": barrio or "Sin referencia",
    }

def cotizar_envio(token, pedido, data):
    """Pide tarifas a Skydropx. Devuelve (quotation_id, tarifas disponibles)."""
    parcel = {"length": 35, "width": 31, "height": pedido["alto"],
              "weight": pedido["peso"], "declared_amount": pedido["precio"]}
    quotation = {
        # El origen va como dirección guardada: así Interrapidísimo reconoce la sucursal verificada
        "address_from": {"address_template_id": ORIGEN_ID},
        "address_to": destino_de(data),
        "parcel": parcel,
    }
    if pedido["pago"] == "contraentrega":
        quotation["cash_on_delivery"] = True

    r = requests.post(f"{BASE_URL}/quotations", headers=_headers(token), json={"quotation": quotation}, timeout=30)
    if r.status_code >= 300:
        raise RuntimeError(r.text)
    qid = r.json()["id"]

    for _ in range(15):                     # las tarifas llegan de forma asíncrona
        d = requests.get(f"{BASE_URL}/quotations/{qid}", headers=_headers(token), timeout=30).json()
        if d.get("is_completed"):
            break
        time.sleep(1.5)

    tarifas = [{
        "id": x["id"],
        "transportadora": x.get("provider_display_name") or x["provider_name"],
        "servicio": x.get("provider_service_name", ""),
        "precio": float(x.get("total") or 0),
        "dias": x.get("days"),
        "interrapidisimo": x["provider_name"] == "interrapidisimo",
    } for x in d.get("rates", []) if x.get("success")]
    tarifas.sort(key=lambda t: (not t["interrapidisimo"], t["precio"]))   # Interrapidísimo primero
    return qid, tarifas

def crear_envio_skydropx(token, rate_id, pedido, data):
    """Genera la guía con la tarifa elegida. ¡Esto descuenta saldo de la cuenta!"""
    envio = {
        "rate_id": rate_id,
        "address_from": {"address_template_id": ORIGEN_ID},
        "address_to": destino_de(data),
        # Protección Plus (seguro opcional de Skydropx) siempre apagada
        "package_protected": False,
        "packages": [{
            "package_number": 1,
            "package_protected": False,
            "package_type": "5H4",
            "package_content": descripcion_pedido(pedido),
            "consignment_note": descripcion_pedido(pedido),
            "weight": pedido["peso"],
            "length": 35,
            "width": 31,
            "height": pedido["alto"],
            "declared_amount": pedido["precio"],
        }],
    }
    if pedido["pago"] == "contraentrega":
        envio["on_delivery_amount"] = pedido["precio"]

    r = requests.post(f"{BASE_URL}/shipments", headers=_headers(token), json={"shipment": envio}, timeout=60)
    if r.status_code >= 300:
        raise RuntimeError(r.text)
    return r.json()

@app.route("/api/cotizar", methods=["POST"])
def cotizar():
    if not session.get("logged_in"):
        return jsonify({"error": "No autorizado"}), 401
    data = request.json or {}
    try:
        pedido = calcular_pedido(data.get("kit"), data.get("pago"), data.get("paquete1"),
                                 data.get("paquete2"), data.get("precio_unitario"), data.get("precio_total"))
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    if not data.get("codigo_postal") or not data.get("ciudad"):
        return jsonify({"success": False, "error": "Faltan la ciudad y el código postal del destino."}), 400

    token = obtener_token()
    if not token:
        return jsonify({"success": False, "error": "No se pudo autenticar con Skydropx"}), 502
    try:
        _, tarifas = cotizar_envio(token, pedido, data)
    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 502
    if not tarifas:
        return jsonify({"success": False, "error": "Ninguna transportadora cubre este destino con estos datos."}), 404
    return jsonify({"success": True, "pedido": pedido, "tarifas": tarifas})

@app.route("/api/crear_envio", methods=["POST"])
def crear_envio():
    """Genera la guía de verdad: descuenta saldo de Skydropx."""
    if not session.get("logged_in"):
        return jsonify({"error": "No autorizado"}), 401
    data = request.json or {}
    rate_id = data.get("rate_id")
    if not rate_id:
        return jsonify({"success": False, "error": "No elegiste la transportadora."}), 400
    try:
        pedido = calcular_pedido(data.get("kit"), data.get("pago"), data.get("paquete1"),
                                 data.get("paquete2"), data.get("precio_unitario"), data.get("precio_total"))
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400

    token = obtener_token()
    if not token:
        return jsonify({"success": False, "error": "No se pudo autenticar con Skydropx"}), 502
    try:
        resp = crear_envio_skydropx(token, rate_id, pedido, data)
    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 502

    attrs = (resp.get("data") or {}).get("attributes", {})
    paquete = next((x["attributes"] for x in resp.get("included", []) if x.get("type") == "package"), {})
    return jsonify({"success": True, "envio": {
        "guia": paquete.get("tracking_number") or attrs.get("master_tracking_number"),
        "transportadora": attrs.get("carrier_name"),
        "servicio": attrs.get("service_name"),
        "costo": attrs.get("total"),
        "label_url": paquete.get("label_url"),
        "recaudo": attrs.get("on_delivery_amount"),
        "estado": attrs.get("workflow_status"),
        "error": attrs.get("error_detail"),
    }})

@app.route("/api/guias")
def listar_guias():
    if not session.get("logged_in"):
        return jsonify({"error": "No autorizado"}), 401
    token = obtener_token()
    if not token:
        return jsonify({"success": False, "error": "No se pudo autenticar con Skydropx"}), 502
    # pendientes = guía generada y aún no recogida por la transportadora
    estados = ("created",) if request.args.get("estado", "pendientes") == "pendientes"         else ("created", "picked_up", "in_transit", "last_mile", "delivered", "exception")
    try:
        lista = guias_mod.listar_guias(BASE_URL, token, estados=estados)
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 502
    return jsonify({"success": True, "guias": [{k: v for k, v in g.items() if k != "label_url"} for g in lista]})

def _pdf_de_guias(body):
    """Arma el PDF de las guías pedidas en `body`. Devuelve (pdf, errores, cantidad) o lanza ValueError."""
    ids = set(body.get("ids") or [])
    if not ids:
        raise ValueError("No seleccionaste guías.")
    token = obtener_token()
    if not token:
        raise RuntimeError("No se pudo autenticar con Skydropx")

    todas = guias_mod.listar_guias(BASE_URL, token, estados=("created", "picked_up", "in_transit", "last_mile", "delivered", "exception"))
    elegidas = [g for g in todas if g["id"] in ids]
    pdf, errores = guias_mod.consolidar_pdf(elegidas,
                                            cian=bool(body.get("cian", True)),
                                            resumen=bool(body.get("resumen", True)),
                                            media_carta=bool(body.get("media_carta", True)),
                                            marca=bool(body.get("marca", False)))
    if not pdf:
        raise RuntimeError("No se pudo descargar ninguna guía. " + "; ".join(errores))
    return pdf, errores, len(elegidas)

@app.route("/api/guias/pdf", methods=["POST"])
def descargar_guias_pdf():
    if not session.get("logged_in"):
        return jsonify({"error": "No autorizado"}), 401
    try:
        pdf, errores, _ = _pdf_de_guias(request.json or {})
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 502

    nombre = datetime.now().strftime("guias_%Y-%m-%d_%H%M.pdf")
    resp = send_file(io.BytesIO(pdf), mimetype="application/pdf", as_attachment=True, download_name=nombre)
    if errores:
        resp.headers["X-Guias-Errores"] = str(len(errores))
    return resp

@app.route("/api/guias/imprimir", methods=["POST"])
def imprimir_guias():
    """Manda las guías elegidas directo a la Toshiba, sin descargar el PDF."""
    if not session.get("logged_in"):
        return jsonify({"error": "No autorizado"}), 401
    body = request.json or {}
    try:
        pdf, errores, cantidad = _pdf_de_guias(body)
        impresora.imprimir_pdf(pdf, datetime.now().strftime("Guias %Y-%m-%d %H:%M"),
                               color=bool(body.get("cian", True)))
    except ValueError as e:
        return jsonify({"success": False, "error": str(e)}), 400
    except RuntimeError as e:
        return jsonify({"success": False, "error": str(e)}), 502
    return jsonify({"success": True, "impresas": cantidad - len(errores), "errores": errores})

@app.route("/api/internal/whatsapp_order", methods=["POST"])
def whatsapp_order():
    data = request.json
    texto = data.get("texto", "")
    
    if not texto:
        return jsonify({"success": False, "error": "Texto vacío"}), 400
        
    try:
        # 1. PARSEAR CON IA
        headers = {
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json"
        }
        
        prompt = """
        Eres un asistente experto en logística colombiana.
        Analiza el texto y extrae la siguiente información para un envío.
        Devuelve ÚNICAMENTE un JSON válido, sin markdown ni explicaciones.
        
        {
            "referencia": "Nombre del cliente o ID de la venta",
            "kit": "'emprendedor' (Kit Emprendedor / 6 paquetes), 'muestras' (Kit de Muestras / 2 paquetes) o 'personalizado' si pide cantidades libres",
            "paquete1": "cuántos paquetes de la referencia 'Paquete 1' o 'Devoción y Tradición'. 0 si no menciona",
            "paquete2": "cuántos paquetes de la referencia 'Paquete 2' o 'Fe y Esperanza'. 0 si no menciona",
            "precio_unitario": "precio de venta por paquete si lo menciona (ej. '17 mil' = 17000). 0 si no lo dice",
            "precio_total": "precio total del pedido si lo menciona como monto único (ej. 'en total 289 mil' = 289000). 0 si no lo dice",
            "pago": "'contraentrega' si dice contra entrega / contraentrega / COD; 'anticipado' si dice pago anticipado / ya pagó / transferencia",
            "nombre": "nombre completo del destinatario",
            "telefono": "numero de telefono limpio",
            "email": "Correo electrónico si aparece, vacio si no",
            "estado": "Departamento en Colombia",
            "ciudad": "Ciudad destino",
            "codigo_postal": "Código postal estándar de 5 o 6 dígitos de la ciudad en Colombia. DEBES inferirlo según la ciudad.",
            "direccion": "Calle, carrera, numero o avenida",
            "referencia_direccion": "Detalles adicionales (edificio, barrio)",
            "contenido": "que contiene el paquete"
        }
        """
        
        payload_ia = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": f"{prompt}\n\nTEXTO:\n{texto}"}],
            "max_tokens": 500,
            "temperature": 0.1
        }
        
        res_ia = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload_ia)
        if res_ia.status_code != 200:
            return jsonify({"success": False, "error": "Error IA"}), 500
            
        content = res_ia.json()["choices"][0]["message"]["content"].strip()
        if content.startswith("```json"): content = content[7:]
        if content.startswith("```"): content = content[3:]
        if content.endswith("```"): content = content[:-3]
        
        datos = json.loads(content.strip())
        
        # 2. RESOLVER KIT, CANTIDADES Y PRECIO
        try:
            pedido = calcular_pedido(datos.get("kit"), datos.get("pago"), datos.get("paquete1"),
                                     datos.get("paquete2"), datos.get("precio_unitario"), datos.get("precio_total"))
        except ValueError as e:
            return jsonify({"success": False, "error": f"{e} Indica el kit (Emprendedor, Muestras o "
                                                       f"personalizado con cantidades y precio) y la modalidad "
                                                       f"(contraentrega o anticipado)."}), 400

        # 3. CREAR ORDEN EN SKYDROPX (misma función que el panel web)
        orden = {
            "referencia": datos.get("referencia") or f"Venta {datos.get('nombre', '')}",
            "nombre": datos.get("nombre", "Cliente"),
            "telefono": str(datos.get("telefono", "")),
            "email": datos.get("email", ""),
            "estado": datos.get("estado", ""),
            "ciudad": datos.get("ciudad", ""),
            "codigo_postal": str(datos.get("codigo_postal", "")),
            "direccion": datos.get("direccion", ""),
            "referencia_direccion": datos.get("referencia_direccion", ""),
            "cantidad": pedido["paquetes"],
            "valor_declarado": pedido["precio"],
            "peso": pedido["peso"],
            "largo": 35,
            "ancho": 31,
            "alto": pedido["alto"],
            "contenido": descripcion_pedido(pedido),
        }
        try:
            resp_data = enviar_orden_skydropx(orden)
        except RuntimeError as e:
            return jsonify({"success": False, "error": str(e)}), 502

        order_id = resp_data.get("data", {}).get("id", "Desconocido")
        precio_txt = f"${pedido['precio']:,}".replace(",", ".")
        detalle = " · ".join(f"Paquete {n}: {pedido[f'paquete{n}']}" for n in (1, 2) if pedido[f"paquete{n}"])
        mensaje_exito = (f"✅ ¡Orden creada exitosamente!\n\n📦 *Destino:* {datos.get('nombre')} ({datos.get('ciudad')})\n"
                         f"🎁 *{pedido['nombre']}:* {pedido['paquetes']} paquetes\n"
                         f"📋 {detalle}\n"
                         f"💰 *{pedido['modalidad']}:* {precio_txt}\n🆔 *Order ID:* {order_id}")
        return jsonify({"success": True, "message": mensaje_exito})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@app.route("/api/webhook/skydropx", methods=["POST"])
def webhook_skydropx():
    # Recibimos el evento de Skydropx
    evento = request.json
    print("\n[WEBHOOK RECIBIDO]:", json.dumps(evento, indent=2))
    
    # Extraemos el tipo de evento y los datos del paquete
    event_type = evento.get("event_type", "")
    
    if event_type.startswith("shipment_"):
        datos_paquete = evento.get("data", {})
        referencia = datos_paquete.get("reference", "Tu paquete")
        tracking_number = datos_paquete.get("tracking_number", "123456789")
        
        # Leemos el teléfono que venga en el Webhook de Skydropx,
        # Si no viene, usamos tu número personal por defecto para la prueba.
        telefono_cliente = datos_paquete.get("phone", "+573133288298")
        
        # Extraer el nombre del destinatario del webhook (si no viene, usamos una palabra genérica)
        nombre_cliente = "Cliente"
        # Extraer el nombre del destinatario del webhook
        nombre_cliente = "Cliente"
        if "address_to" in datos_paquete:
            nombre_cliente = datos_paquete["address_to"].get("name", "Cliente")
            
        # Obtenemos el link real usando nuestro robot invisible de Node
        link_rastreo = "https://siguetuenvio.interrapidisimo.com/"
        try:
            import subprocess
            result = subprocess.run(
                ["node", "get_tracking_url.js", tracking_number], 
                capture_output=True, text=True, timeout=10
            )
            out_url = result.stdout.strip()
            if "siguetuenvio.interrapidisimo.com/principal/" in out_url:
                link_rastreo = out_url
        except Exception as e:
            print("Error obteniendo link real:", e)
        
        mensaje = ""
        if event_type == "shipment_created":
            mensaje = (
                f"👋 ¡Hola {nombre_cliente}! Gracias por tu compra.\n\n"
                f"📦 Tu paquete ha sido empacado y la guía se generó con éxito.\n"
                f"🔢 *Guía:* {tracking_number}\n\n"
                f"Sigue tu paquete en tiempo real tocando este enlace directo:\n{link_rastreo}"
            )
        elif event_type == "shipment_in_transit":
            mensaje = (
                f"🚚 ¡Excelentes noticias {nombre_cliente}!\n\n"
                f"Tu paquete ya está en tránsito hacia su destino.\n"
                f"🔢 *Guía:* {tracking_number}\n\n"
                f"Rastréalo directamente aquí:\n{link_rastreo}"
            )
        elif event_type == "shipment_delivered":
            mensaje = (
                f"✅ ¡Entregado!\n\n"
                f"Hola {nombre_cliente}, nos alegra informarte que tu paquete "
                f"con guía *{tracking_number}* ha sido entregado exitosamente.\n\n"
                f"¡Esperamos que lo disfrutes!"
            )
            
        if mensaje:
            print(f"Bot de WhatsApp enviaria un mensaje a {telefono_cliente}")
            enviar_whatsapp_local(telefono_cliente, mensaje)
            
    return jsonify({"status": "recibido"}), 200

def enviar_whatsapp_local(destino, mensaje):
    import requests
    url = "http://127.0.0.1:5001/api/send_message"
    payload = {
        "number": destino,
        "message": mensaje
    }
    try:
        response = requests.post(url, json=payload, timeout=5)
        if response.status_code == 200:
            print("Mensaje enviado a través del bot local.")
        else:
            print(f"Error del bot local: {response.text}")
    except Exception as e:
        print("Atención: El bot de WhatsApp (Node.js) no está corriendo o falló. Inícialo con 'node whatsapp_bot.js'")

# --- VARIABLES GLOBALES ---
WEBHOOK_URL = ""

# Nombre que esperan los servidores de hosting (Passenger/Gunicorn/WSGI)
application = app

if __name__ == "__main__":
    print("\n" + "="*50)
    print("WEBHOOK ENDPOINT LOCAL: http://127.0.0.1:5000/api/webhook/skydropx")
    print("Para que Skydropx pueda enviar notificaciones aqui, necesitas un tunel.")
    print("Recomendamos usar Cloudflare Tunnels o Localtunnel.")
    print("="*50 + "\n")
        
    # En el servidor no se usa esto: allí arranca Gunicorn/Passenger con "application"
    app.run(debug=os.getenv("FLASK_DEBUG", "1") == "1",
            host=os.getenv("HOST", "127.0.0.1"),
            port=int(os.getenv("PORT", 5000)))
