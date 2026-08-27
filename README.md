# Faroles Genius - Gestor de Envíos y Páginas Web

Este repositorio contiene el sistema de **Gestor de Envíos PRO** y la copia completa y autónoma (100% offline) de las páginas web de **Faroles Genius**.

---

## 📁 Estructura del Repositorio

- **`index.html`**: Panel principal del **Gestor de Envíos PRO** (Registro de pedidos con IA, control de empaque, generación de guías PDF, historial de pedidos y conexión Firebase / Webhook).
- **`server.js`**: Servidor local ligero en Node.js para previsualizar el gestor y las páginas en `http://localhost:5051`.
- **`paginas_web/`**: Todas las páginas web clonadas con sus imágenes, hojas de estilo CSS y recursos locales:
  - `index.html`: Menú y portal de navegación entre páginas.
  - `inicio.html`: Página Principal (Home).
  - `pagina-al-detal.html`: Catálogo y venta al detal.
  - `vendedor.html`: Página de Vende Sobre Pedido.
  - `farol.html`: Página de Faroles Genius.
  - `envios-2025.html`: Información de Envíos 2025.
  - `nuestros-productos.html`: Catálogo de Productos.
  - `material-publicitario.html`: Material y recursos publicitarios.
  - `pagina-de-producto-2025.html`: Página de Producto 2025.
  - `sorteo.html`: Página de Sorteo.
  - `cuadros.html`: Página de Cuadros.
  - `landing-page.html`: Landing Page promocional.
  - `wp-content/`: Todas las imágenes de faroles, banners, tipografías y CSS locales.

---

## 🚀 Cómo Ejecutar Localmente

1. Clona el repositorio o abre la carpeta en tu terminal.
2. Inicia el servidor local:
   ```bash
   node server.js
   ```
3. Abre tu navegador:
   - **Gestor de Envíos:** [http://localhost:5051/](http://localhost:5051/)
   - **Páginas Web Clonadas:** [http://localhost:5051/paginas_web/](http://localhost:5051/paginas_web/)
