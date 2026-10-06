# Panel de envíos Faroles Genius — puesta en marcha

Panel en Flask (Python) que crea órdenes en Skydropx, cotiza, genera las guías y
las arma en un PDF de media carta listo para imprimir.

## 1. Credenciales

Ningún dato sensible vive en el código. Todo sale del archivo `.env`, que **no se sube
al repositorio**.

```bash
cp .env.ejemplo .env
```

Luego llena el `.env`:

| Variable | Para qué sirve |
|---|---|
| `SKYDROPX_API_KEY` / `SKYDROPX_API_SECRET` | Credenciales de la API de Skydropx |
| `SKYDROPX_ORIGEN_ID` | Dirección de origen guardada (sucursal verificada con Interrapidísimo) |
| `OPENAI_API_KEY` | Lectura de los pedidos con IA |
| `PANEL_USUARIO` / `PANEL_PASSWORD_HASH` | Acceso al panel |
| `SECRET_KEY` | Firma de las sesiones |
| `IMPRESORA_URL` | Impresora de la bodega (solo red local) |

La contraseña se guarda cifrada. Genera el hash con:

```bash
python -c "from werkzeug.security import generate_password_hash as h; print(h(input('Contraseña: ')))"
```

> **Importante:** la dirección de origen debe ir por `SKYDROPX_ORIGEN_ID`. Si se manda
> escrita a mano, Skydropx no la reconoce como la sucursal verificada y **Interrapidísimo
> aparece como no disponible**.

## 2. En tu computador

```bash
pip install -r requirements.txt
python app.py
```

Queda en <http://127.0.0.1:5000>.

El bot de WhatsApp es aparte y solo corre local, porque abre un Chrome con tu sesión:

```bash
node whatsapp_bot.js
```

## 3. En un servidor

Requisitos: Python 3.10 o superior. El arranque es por WSGI, con `application` como
punto de entrada.

```bash
pip install -r requirements.txt
gunicorn app:application --bind 0.0.0.0:$PORT
```

En hostings con Passenger (Hostinger, cPanel), configura:

- Archivo de inicio: `app.py`
- Punto de entrada: `application`
- Las variables del `.env` se cargan desde el panel de control del hosting.

### Lo que NO funciona en un servidor

- **El bot de WhatsApp** (`whatsapp_bot.js`): necesita un Chrome con tu sesión.
- **La impresión directa** (`impresora.py`): la impresora está en la red de la bodega y
  no es alcanzable desde internet. Desde el servidor se descarga el PDF y se imprime a mano.

## 4. Antes de publicarlo en internet

- Cambia las claves de Skydropx y OpenAI si alguna vez estuvieron escritas en el código.
- Usa una contraseña larga: quien entre al panel puede generar guías con cargo a tu saldo.
- Publica siempre con HTTPS.

## Archivos

| Archivo | Qué hace |
|---|---|
| `app.py` | Servidor web y rutas de la API |
| `guias.py` | Cotización, armado del PDF, desglose de paquetes, media carta |
| `impresora.py` | Envío del PDF a la impresora por IPP (red local) |
| `templates/index.html` | El panel completo |
| `whatsapp_bot.js` | Bot que crea órdenes desde WhatsApp (solo local) |
