<div align="center">

  <img src="frontend/public/assets/tcgstore-hero-banner.jpg" alt="TCGStore Banner" width="100%" style="max-width: 960px; border-radius: 12px; margin-bottom: 14px;" />
  <p><strong>Plataforma E-commerce Especializada en Trading Card Games (TCG)</strong></p>
  <p>Gestión centralizada de inventario, catálogo interactivo, compra segura de cartas coleccionables y productos sellados.</p>

  <p>
    <code>⚡ Pokémon</code> •
    <code>🔮 Magic: The Gathering</code> •
    <code>🏴‍☠️ One Piece</code> •
    <code>🦖 Digimon</code> •
    <code>🤖 Gundam</code> •
    <code>⚔️ Riftbound</code>
  </p>

  <br />

  <p>
    <a href="https://proyecto-web-y-movil.vercel.app/" target="_blank">
      <img src="https://img.shields.io/badge/🚀_PROYECTO_EN_VIVO-VERCEL-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel Live" />
    </a>
    <a href="#endpoints-de-la-api-rest">
      <img src="https://img.shields.io/badge/📡_API_REST-DOCS-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="API REST Docs" />
    </a>
    <a href="https://www.figma.com/proto/sfyPtwS7DZlxlQOimMfeaz/TCGStore-Web?node-id=2-3&p=f&t=TFggwOJHHyufxtOT-1&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A3" target="_blank">
      <img src="https://img.shields.io/badge/🎨_PROTOTIPO-FIGMA-F24E1E?style=for-the-badge&logo=figma&logoColor=white" alt="Figma" />
    </a>
    <a href="#requerimientos">
      <img src="https://img.shields.io/badge/📋_REQUERIMIENTOS-DOCS-1B1642?style=for-the-badge" alt="Requerimientos" />
    </a>
    <a href="#instalación-y-configuración-local">
      <img src="https://img.shields.io/badge/⚙️_INSTALACIÓN-LOCAL-2563EB?style=for-the-badge" alt="Instalación" />
    </a>
  </p>

  <br />

  <p>
    <img src="https://img.shields.io/badge/Ionic-3880FF?style=flat-square&logo=ionic&logoColor=white" alt="Ionic" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Node.js-43853D?style=flat-square&logo=node.js&logoColor=white" alt="Node.js" />
    <img src="https://img.shields.io/badge/Express.js-404D59?style=flat-square&logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
    <img src="https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white" alt="Vercel" />
    <img src="https://img.shields.io/badge/Render-46E3B7?style=flat-square&logo=render&logoColor=black" alt="Render" />
    <img src="https://img.shields.io/badge/Postman-FF6C37?style=flat-square&logo=postman&logoColor=white" alt="Postman" />
  </p>

</div>

---

### Presentado por:
- **Alfonso Durán Araya**
- **Joaquín Alegría Vargas**
- **Martín Albarrán Alcorta**

*Pontificia Universidad Católica de Valparaíso — Escuela de Ingeniería Informática*  
*Asignatura: Ingeniería Web y Móvil (INF3245-1)*

---

## Índice
1. [Acceso a la Plataforma en Producción](#-acceso-a-la-plataforma-en-producción)
2. [Cuentas de Demostración](#-cuentas-de-demostración)
3. [Vistas de la Aplicación en Producción](#-vistas-de-la-aplicación-en-producción)
4. [Estructura y Gestión de Ramas en GitHub](#-estructura-y-gestión-de-ramas-en-github)
5. [Justificación del Problema](#justificación-del-problema)
6. [Usuarios y Roles del Sistema](#usuarios-objetivo-quién-usará-la-aplicación)
7. [Proto-personas](#proto-personas)
8. [Requerimientos del Sistema](#requerimientos)
9. [Arquitectura de Información y UX](#arquitectura-de-navegación)
10. [Diferenciación de Acceso según Roles](#diferenciación-de-acceso-según-roles)
11. [Prototipo UI/UX en Figma](#bocetos-uiux)
12. [Stack Tecnológico](#tecnologías-y-herramientas)
13. [Endpoints de la API REST](#endpoints-de-la-api-rest)
14. [Instalación y Configuración Local](#instalación-y-configuración-local)
15. [Pruebas Automatizadas y Testing](#pruebas-y-testing)
    - [Evidencia de Pruebas de API en Postman](#-evidencia-de-pruebas-de-api-en-postman)

---

## 🌐 Acceso a la Plataforma en Producción

La plataforma se encuentra completamente desplegada y accesible en la nube:

* 🚀 **Aplicación Web en Vivo:**  
  👉 [https://proyecto-web-y-movil.vercel.app/](https://proyecto-web-y-movil.vercel.app/)

> [!NOTE]
> La aplicación web se comunica de forma integrada y segura con la API REST y la base de datos PostgreSQL en la nube. No es necesario realizar instalaciones locales para probar el funcionamiento completo del sistema.

### 🔑 Cuentas de Demostración

El esquema de base de datos incluye credenciales precargadas de prueba académica (contraseña universal: `123456`):

| Rol | Correo | Contraseña | Permisos y Acceso |
|---|---|---|---|
| **Administrador** | `admin@tcgstore.com` | `123456` | Acceso exclusivo al Dashboard de gestión (`/admin`, `/admin/inventario`, `/admin/ordenes`), métricas en vivo, semáforo de stock, edición de productos, notas privadas y cambio de estados con retorno de inventario. |
| **Cliente** | `cliente@tcgstore.com` | `123456` | Navegación de catálogo, carrito reactivo con persistencia, checkout con selector chileno de despacho (`/checkout`), visualización de historial de compras con acordeón de cartas en Mi Cuenta (`/perfil`) y recuperación de contraseña. |

---

## 📸 Vistas de la Aplicación en Producción

La plataforma cuenta con una interfaz web responsiva, interactiva y adaptada a las necesidades de la comunidad coleccionista de TCG:

| Vista | Captura de Pantalla | Descripción y Funcionalidad |
|---|---|---|
| **Página Principal (Landing)** | <img src="docs/screenshots/01-home.png" alt="Inicio" width="480" /> | **Exploración y Novedades:** Banner rotativo de colecciones destacadas, selector interactivo de franquicias (Pokémon, One Piece, Magic, Digimon, Gundam, Riftbound), productos recomendados y buscador en vivo con autocompletado en el encabezado. |
| **Catálogo Interactivo** | <img src="docs/screenshots/02-catalogo.png" alt="Catálogo" width="480" /> | **Filtros y Tarjetas de Producto:** Cuadrícula de cartas individuales, productos sellados y accesorios filtrados por categoría, buscador de texto, selector de elementos por página, etiquetas de precio en CLP y botón directo de adición al carrito. |
| **Panel de Administración** | <img src="docs/screenshots/03-admin-dashboard.png" alt="Dashboard" width="480" /> | **Control y Métricas de Negocio:** Tarjetas KPI en tiempo real (ventas totales, órdenes, stock en almacén, clientes), tabla de pedidos recientes con semáforo de estado, filtro por estado, notas internas y gestión CRUD de inventario. |
| **Flujo de Checkout** | <img src="docs/screenshots/04-checkout.png" alt="Checkout" width="480" /> | **Proceso de Compra Validado:** Formulario de despacho con selector jerárquico inteligente de Regiones y Comunas de Chile, validación de teléfono `+56 9`, selección de medios de pago y transacción SQL con descuento atómico de stock. |
| **Panel del Cliente (Mi Cuenta)** | <img src="docs/screenshots/05-perfil-ordenes.png" alt="Perfil" width="480" /> | **Historial y Seguimiento:** Perfil del usuario autenticado, botón de cambio de contraseña e historial de pedidos con acordeón interactivo que despliega el desglose detallado de cada carta adquirida (título, cantidad, precio unitario y subtotal). |

---

## 🌿 Estructura y Gestión de Ramas en GitHub

El repositorio implementa una estrategia de ramas estructurada según responsabilidades y buenas prácticas de ingeniería de software:

* **`main`:** Rama principal de producción. Contiene la versión definitiva, consolidada y estable, vinculada a los despliegues automáticos en la nube (Vercel y Render).
* **`backend`:** Rama de desarrollo del servidor y la base de datos. Aloja la API REST modular en Express, el esquema relacional reproducible [`database/esquema.sql`](database/esquema.sql), los servicios de autenticación (JWT, Google OAuth 2.0 y Nodemailer/Gmail) y las suites de pruebas automáticas de backend.
* **`frontend`:** Rama dedicada a la interfaz de usuario con Ionic Framework y React. Contiene las vistas responsivas, componentes de navegación, hooks de scroll, integración de servicios de cliente y pruebas unitarias con Vitest.

---

## Justificación del problema

En el mercado local de juegos de cartas coleccionables (TCG como Pokémon, Yu-Gi-Oh!, Magic: The Gathering, One Piece, etc.), los jugadores y coleccionistas enfrentan dificultades para encontrar un inventario centralizado y confiable de cartas sueltas ("singles") y productos sellados.

A menudo, las transacciones se realizan a través de redes sociales sin garantías de seguridad, o en tiendas físicas que carecen de un catálogo digital actualizado. Esto obliga al usuario a cotizar presencialmente o a lidiar con múltiples vendedores dispersos, lo que dificulta la selección de los productos adecuados y la comparación de precios.

Además, los sistemas de comercio electrónico tradicionales no están diseñados para manejar los atributos específicos y vitales de una carta coleccionable, tales como la edición, rareza, condición (Near Mint, Lightly Played, Moderately Played), si es "Foil" o el juego al que pertenece.

En este contexto, el problema abordado por el proyecto corresponde a la necesidad de **gestionar, organizar y comercializar artículos de TCG mediante una plataforma optimizada que entienda las particularidades de estos productos**.

Por lo tanto, el desarrollo de una plataforma web y móvil permite centralizar el inventario de la tienda, facilitar la búsqueda estructurada para los clientes desde diferentes dispositivos y proporcionar herramientas de gestión especializadas para los administradores del negocio.

---

## Usuarios objetivo (Quién usará la aplicación)

La aplicación considera principalmente dos grupos de usuarios: **clientes (jugadores/coleccionistas) y administradores**.

### Clientes
Corresponden a los principales usuarios de la plataforma. Son un grupo diverso compuesto tanto por jugadores competitivos como por coleccionistas, cada uno con necesidades de compra distintas.

Dentro de este grupo existen usuarios que:
- buscan una carta muy específica para completar una estrategia de juego;
- buscan cartas antiguas o raras en perfecto estado de conservación;
- desean comprar accesorios (protectores, carpetas, deck boxes) o productos sellados;
- compran desde sus dispositivos móviles mientras están en un torneo;
- necesitan conocer la condición física exacta y el stock en tiempo real antes de pagar.

#### Necesidades principales
- encontrar cartas rápidamente usando filtros avanzados (juego, edición, color, costo, tipo, rareza);
- conocer el estado real de la carta y el stock exacto antes de comprar;
- un proceso de compra rápido (checkout) y seguro adaptado a Chile (regiones y comunas);
- disponer de un historial de compras accesible desde su perfil con detalle ítem por ítem;
- acceso a la tienda desde el móvil de forma fluida.

### Administradores
Constituyen el segundo grupo de usuarios del sistema. Su función principal es administrar la tienda física y su reflejo digital en la plataforma. A diferencia del cliente, el administrador tiene acceso exclusivo a funcionalidades de back-office.

---

## Roles del Sistema

- **Cliente**: Usuario registrado que puede navegar, buscar productos, agregar al carrito, comprar y gestionar sus pedidos.
- **Administrador**: Usuario encargado de gestionar el inventario, los precios, supervisar métricas de negocio y procesar las órdenes de los clientes con trazabilidad interna.

### Definición de conceptos
- **Rol**: Define qué puede hacer un usuario dentro del sistema mediante permisos y rutas protegidas.
- **Proto-persona**: Describe quién podría ser ese usuario, sus características, necesidades, objetivos, dificultades y contexto de uso.

---

## Proto-personas

Las siguientes proto-personas corresponden a **perfiles hipotéticos** construidos a partir del análisis del problema y de las características esperadas de los usuarios de la plataforma.

---

### Proto-persona 1: Jugador Competitivo
* **Nombre ficticio:** Martín
* **Tipo de usuario o rol:** Cliente

#### Características generales
Martín es un joven universitario de 22 años que asiste semanalmente a torneos locales de TCG. Conoce muy bien las reglas de su juego y sabe exactamente qué cartas necesita para mejorar su mazo. Utiliza principalmente su teléfono móvil.

#### Necesidades principales
- Búsqueda rápida y precisa de cartas individuales.
- Conocer la disponibilidad real de stock.
- Proceso de pago ágil y confirmación inmediata.
- Filtrado por atributos específicos del juego.

#### Objetivos de uso
Comprar cartas sueltas ("singles") rápidamente el día jueves para que alcancen a llegar antes de su torneo del fin de semana, o para retirarlas en la tienda física.

#### Dificultades o puntos de frustración
Puede presentar dificultades cuando:
- el buscador de una tienda no le permite filtrar por la edición exacta de la carta;
- llega a la tienda y la carta que aparecía en la web ya se había vendido;
- el proceso de pago es engorroso o falla desde el móvil.

#### Funcionalidades de la aplicación que utilizaría
- Buscador avanzado y filtros especializados en tiempo real.
- Visualización de detalles de la carta (condición, rareza, imagen de alta resolución).
- Carrito de compras reactivo.
- Historial de pedidos con desglose de cartas y estado de entrega.

#### Dispositivo y contexto probable de acceso
Utilizaría principalmente un **teléfono móvil**. Podría acceder durante traslados en transporte público, o en medio de un torneo mientras revisa estrategias con sus compañeros.

---

### Proto-persona 2: Administrador de Tienda
* **Nombre ficticio:** Rodrigo
* **Tipo de usuario o rol:** Administrador

#### Características generales
Rodrigo tiene 35 años y es el dueño de una tienda local de juegos de mesa y TCG. Maneja un gran volumen de inventario que cambia a diario debido a las ventas físicas y la compra de cartas a los mismos jugadores. 

#### Necesidades principales
- Crear y modificar productos de manera ágil con atributos específicos de cartas.
- Visualizar métricas del negocio (ventas totales, pedidos, stock crítico).
- Procesar las órdenes web (cambiar estado a "Pagado", "Enviado", "Entregado" o "Cancelado").
- Agregar notas privadas a los pedidos para coordinar el despacho.

#### Objetivos de uso
Mantener el stock web sincronizado con su tienda física y gestionar los envíos a los clientes para aumentar sus ventas sin sobreventas accidentales.

#### Dificultades o puntos de frustración
Puede presentar frustración cuando:
- el sistema de inventario genérico no tiene campos para "Juego", "Condición" o "Rareza";
- agregar una nueva carta al sistema requiere demasiados pasos;
- los botones de acción en las tablas son poco claros o confusos.

#### Funcionalidades de la aplicación que utilizaría
- Dashboard con estadísticas y ventas acumuladas.
- Catálogo interactivo con semáforo de stock (Ok, Bajo stock, Agotado).
- Modal de alta y edición con selectores dinámicos y textos guía.
- Gestión de órdenes con filtros de estado y notas internas de administración.

#### Dispositivo y contexto probable de acceso
Utilizaría principalmente un **computador de escritorio o tablet** desde el mostrador de su tienda física durante su jornada laboral.

---

## Requerimientos

### Requerimientos Funcionales por Rol

| ID | Requerimiento funcional | Rol |
|---|---|---|
| **RF-01** | El sistema deberá permitir al cliente buscar productos utilizando filtros avanzados especializados (categoría, juego, edición, rareza, condición). | Cliente |
| **RF-02** | El sistema deberá mostrar el detalle completo del producto, incluyendo imagen, precio, stock disponible, edición y estado de conservación (Condición). | Cliente |
| **RF-03** | El sistema deberá permitir al cliente agregar, editar cantidades y eliminar productos dentro de un carrito de compras con persistencia local. | Cliente |
| **RF-04** | El sistema deberá permitir al cliente finalizar su compra (checkout) validando stock y seleccionando región y comuna con transacción SQL. | Cliente |
| **RF-05** | El sistema deberá permitir al cliente consultar su historial de compras en su perfil con desglose de ítems (título, cantidad, precio) y estado actualizado. | Cliente |
| **RF-06** | El sistema deberá permitir al administrador gestionar el catálogo (crear, modificar y eliminar productos) con validación de datos e integridad referencial. | Administrador |
| **RF-07** | El sistema deberá permitir al administrador consultar todas las órdenes recibidas, filtrar por estado, agregar notas internas y gestionar cancelaciones con retorno de stock. | Administrador |

### Funcionalidades Transversales
- **FT-01 (Registro y Activación de Cuenta):** El sistema permite el registro seguro de nuevos usuarios clientes con validación de formato de contraseña y envío de correo de activación de 24 horas mediante Nodemailer y Gmail SMTP.
- **FT-02 (Autenticación Híbrida y Segura):** Soporte para inicio de sesión mediante credenciales locales cifradas con bcrypt y mediante **Google OAuth 2.0** con 1 clic (asociación y registro automático de perfiles). Almacenamiento seguro en `sessionStorage`.
- **FT-03 (Recuperación de Contraseña):** Flujo de autoservicio para restablecer la contraseña mediante token temporal de 1 hora enviado por correo electrónico.
- **FT-04 (Control de Acceso y Rutas Protegidas):** Restricción de vistas y endpoints de administración mediante middleware JWT y componentes guard (`ProtectedRoute`) según el rol del usuario (`client` o `admin`).

---

## Requerimientos No Funcionales

### UX y Usabilidad
- **RNF-UX-01 (Diseño adaptable):** La interfaz se adapta de forma fluida a pantallas móviles pequeñas (360px+) y monitores de escritorio mediante Ionic Framework y CSS adaptativo.
- **RNF-UX-02 (Feedback visual interactivo):** Respuestas visuales inmediatas en botones de acción, notificaciones Toast, confirmaciones modales y badges de colores según estado de stock y pedidos.
- **RNF-UX-03 (Imágenes y Respaldo Visual):** Las cartas y artículos cuentan con contenedores optimizados con imagen de respaldo (*fallback*) ante URLs no disponibles.
- **RNF-UX-04 (Restauración de Scroll):** Componente de reseteo automático de scroll (`ScrollToTop`) al navegar entre rutas, compatible con el Shadow DOM de Ionic (`<ion-content>`).

### Seguridad
- **RNF-SEG-01 (Cifrado de Contraseñas):** Las contraseñas locales se almacenan aplicando hash con **bcryptjs** (10 rondas de salting).
- **RNF-SEG-02 (Autorización por Roles y Tokens JWT):** Rutas de API protegidas mediante verificación de firma JWT y middleware de autorización (`requireRole('admin')`).
- **RNF-SEG-03 (Protección contra Inyección SQL y XSS):** Todas las consultas en PostgreSQL son parametrizadas (`$1, $2, ...`) y las salidas de correo se escapan con filtros anti-XSS.
- **RNF-SEG-04 (Cabeceras y Rate Limiting):** Uso de **Helmet** para cabeceras HTTP defensivas y **express-rate-limit** para mitigar ataques de fuerza bruta en endpoints críticos.
- **RNF-SEG-05 (Protección de Secretos):** Exclusión estricta de variables de entorno y credenciales sensibles mediante `.gitignore`.

### Rendimiento
- **RNF-REN-01 (Carga eficiente):** Carga perezosa (*lazy loading*) de rutas e imágenes de cartas para mantener un inicio rápido de la aplicación.
- **RNF-REN-02 (Búsqueda reactiva):** Autocompletado en vivo en el encabezado y filtrado reactivo instantáneo en catálogos extensos.

---

## Arquitectura de Navegación

### 1. Rutas principales y secundarias

#### Rutas públicas
| Ruta | Vista | Descripción |
|---|---|---|
| `/` o `/home` | Home | Banners de colecciones, productos destacados, accesos a franquicias y pie de página institucional. |
| `/catalogo` o `/catalog/:category` | Catálogo | Catálogo completo con buscador, selector de productos por página y filtros por categoría (incluye Lotes de Cartas). |
| `/producto/:id` | Detalle | Ficha técnica de la carta, atributos de TCG, selector de cantidad y botón de adición al carrito. |
| `/login` | Iniciar Sesión | Autenticación con correo/contraseña o botón de Google OAuth 2.0, con enlace a recuperación y reenvío de activación. |
| `/registro` | Registro | Formulario de alta para nuevos clientes con validaciones de contraseña segura. |
| `/verificar-correo` | Verificación | Pantalla de activación de cuenta mediante token enviado por correo electrónico. |
| `/recuperar-contrasena` | Olvidé Clave | Solicitud de enlace temporal para restablecer la contraseña. |
| `/restablecer-contrasena` | Nueva Clave | Formulario de definición de nueva contraseña con medidor de requisitos de seguridad. |
| `/terminos`, `/privacidad`, `/envios-devoluciones`, `/contacto` | Institucional | Páginas informativas sobre condiciones de compra, privacidad de datos, políticas de despacho y canal de contacto. |

#### Rutas protegidas del Cliente
| Ruta | Vista | Acceso | Descripción |
|---|---|---|---|
| `/carrito` | Carrito | Cliente | Visualización de ítems seleccionados, control de cantidades, cálculo de subtotal y envío gratis sobre \$50.000. |
| `/checkout` | Checkout | Cliente | Formulario de despacho con selector de regiones/comunas de Chile, medios de pago y transacción SQL. |
| `/perfil` | Mi Cuenta | Cliente / Admin | Perfil de usuario, historial de compras con desglose desplegable de cartas y botón de cambio de contraseña. |

#### Rutas protegidas del Administrador
| Ruta | Vista | Acceso | Descripción |
|---|---|---|---|
| `/admin` | Resumen | Solo Admin | Métricas globales de la tienda (Ventas, Pedidos, Stock total, Clientes) y listado de órdenes recientes. |
| `/admin/inventario` | Catálogo | Solo Admin | Tabla de cartas con buscador en vivo, semáforo de stock, botón de nuevo producto y modal con selectores guiados. |
| `/admin/ordenes` | Órdenes | Solo Admin | Gestión de pedidos con selector de estados, filtro por estado, notas privadas de administración y retorno de inventario. |

### 2. Estructura Jerárquica de Vistas

```text
TCGStore
│
├── Rutas Públicas
│   ├── Home (Banners, Novedades, Franquicias)
│   ├── Catálogo (/catalog/:category)
│   │   └── Detalle de Producto (/producto/:id)
│   ├── Iniciar Sesión (/login)
│   ├── Registro (/registro)
│   ├── Verificación de Correo (/verificar-correo)
│   ├── Recuperación de Contraseña (/recuperar-contrasena, /restablecer-contrasena)
│   └── Páginas Institucionales (/terminos, /privacidad, /envios-devoluciones, /contacto)
│
└── Rutas Protegidas (ProtectedRoute)
    │
    ├── Cliente (Rol 'client')
    │   ├── Carrito (/carrito)
    │   ├── Checkout (/checkout)
    │   └── Mi Cuenta / Historial (/perfil)
    │
    └── Administrador (Rol 'admin')
        ├── Dashboard / Resumen (/admin)
        ├── Inventario y Catálogo (/admin/inventario)
        └── Gestión de Órdenes y Notas (/admin/ordenes)
```

---

## Diferenciación de acceso según roles

| Funcionalidad | Usuario Anónimo | Cliente | Administrador |
|---|:---:|:---:|:---:|
| Explorar catálogo de cartas | ✓ | ✓ | ✓ |
| Ver detalles de la carta | ✓ | ✓ | ✓ |
| Agregar productos al carrito | ✓ | ✓ | — |
| Iniciar sesión con Google OAuth | ✓ | ✓ | ✓ |
| Finalizar compra (Checkout) | Requiere inicio | ✓ | — |
| Ver historial de órdenes propio con desglose | — | ✓ | ✓ |
| Dashboard con métricas globales | — | — | ✓ |
| Crear, modificar y desactivar productos | — | — | ✓ |
| Cambiar estado de órdenes y agregar notas internas | — | — | ✓ |

---

## Bocetos UI/UX

El diseño de la interfaz y la experiencia de usuario (Wireframes y Prototipos interactivos) fue elaborado en **Figma**:

- 🎨 **Prototipo Interactivo:** [Ver diseño en Figma](https://www.figma.com/proto/sfyPtwS7DZlxlQOimMfeaz/TCGStore-Web?node-id=2-3&p=f&t=TFggwOJHHyufxtOT-1&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A3)
- 👥 **Accesibilidad:** El prototipo interactivo se encuentra disponible para navegación y pruebas de usabilidad.

---

## Tecnologías y Herramientas

### Frontend
* **Framework:** Ionic Framework (v8+) con React 19.
* **Lenguaje:** TypeScript 5.
* **Enrutador:** React Router v6 con componentes de redirección y protección por roles (`ProtectedRoute`).
* **Iconografía:** Ionicons v8.
* **Bundler & Tooling:** Vite con soporte de empaquetado optimizado.
* **Testing:** Vitest y React Testing Library (**32 pruebas unitarias automatizadas**).

### Backend
* **Runtime:** Node.js v20+.
* **Servidor HTTP:** Express.js modular con arquitectura de rutas, controladores y middlewares.
* **Base de Datos:** PostgreSQL con driver `pg` (Pool de conexiones transaccionales y soporte SSL).
* **Seguridad:** JSON Web Tokens (`jsonwebtoken`), hashing de contraseñas (`bcryptjs`), Google OAuth (`google-auth-library`), `helmet` y `express-rate-limit`.
* **Servicio de Correo:** Nodemailer configurado con Gmail SMTP para activación de cuenta y recuperación de clave.
* **Testing:** Módulo nativo `node:test` y `supertest` (**30 pruebas automáticas de endpoints e integración**).

### Infraestructura y Nube
* **Cloud Database:** Supabase PostgreSQL con SSL pooler activo.
* **Frontend Hosting:** Vercel con integración continua (CI/CD) desde GitHub.
* **Backend Hosting:** Render Web Service con HTTPS automático y despliegue continuo.

---

## Endpoints de la API REST

Las rutas protegidas requieren el encabezado `Authorization: Bearer <token>` obtenido al iniciar sesión.

| Método | Endpoint | Acceso / Rol | Descripción |
|---|---|---|---|
| **POST** | `/api/auth/register` | Público | Registra una cuenta de cliente, genera hash bcrypt y envía correo de activación con token de 24h. |
| **POST** | `/api/auth/verify` | Público | Valida el token de verificación y activa la cuenta para iniciar sesión. |
| **POST** | `/api/auth/resend-verification` | Público | Reenvía el correo de verificación con un nuevo token a cuentas no activadas. |
| **POST** | `/api/auth/login` | Público | Autentica credenciales con bcrypt y retorna el token JWT y datos de usuario (valida cuenta activa). |
| **POST** | `/api/auth/google` | Público | Autentica e inicia sesión con token de Google OAuth 2.0 (vinculación y registro automático). |
| **POST** | `/api/auth/forgot-password` | Público | Genera un token temporal de 1 hora y envía el correo con enlace de restablecimiento. |
| **POST** | `/api/auth/reset-password` | Público | Restablece la contraseña del usuario validando el token y la fortaleza de la nueva clave. |
| **GET** | `/api/auth/me` | Cliente / Admin | Retorna los datos del perfil del usuario autenticado. |
| **PUT** | `/api/auth/me` | Cliente / Admin | Actualiza los datos de perfil (nombre, teléfono, dirección). |
| **GET** | `/api/categories` | Público | Lista las categorías y franquicias disponibles. |
| **GET** | `/api/products` | Público / Admin | Lista y filtra productos; admin puede incluir productos inactivos. |
| **GET** | `/api/products/:id` | Público / Admin | Retorna el detalle de una carta por ID o código comercial. |
| **POST** | `/api/products` | Admin | Crea una nueva carta o artículo en la base de datos con atributos especializados. |
| **PUT** | `/api/products/:id` | Admin | Actualiza los datos (precio, stock, condición, atributos) de un producto. |
| **DELETE** | `/api/products/:id` | Admin | Desactiva o elimina un producto de catálogo con verificación de integridad. |
| **GET** | `/api/orders` | Cliente / Admin | Lista las órdenes del cliente autenticado o todas las órdenes para el administrador. |
| **GET** | `/api/orders/:id` | Cliente / Admin | Retorna el desglose de productos, cantidades y totales de una orden específica. |
| **POST** | `/api/orders` | Cliente | Crea un nuevo pedido con transacción SQL y descuento atómico de stock. |
| **PATCH** | `/api/orders/:id/status` | Admin | Actualiza el estado del pedido (Pendiente, Pagado, Enviado, Entregado, Cancelado con retorno de stock). |
| **PATCH** | `/api/orders/:id/notes` | Admin | Registra o actualiza notas internas y observaciones privadas de administración. |
| **GET** | `/api/admin/stats` | Admin | Retorna ventas totales, pedidos, stock consolidado y pedidos recientes. |
| **GET** | `/api/health` | Público | Endpoint de verificación de estado y salud del servidor. |

---

## Instalación y Configuración Local

Si deseas ejecutar el proyecto en tu entorno local sin depender de los servicios en la nube:

### 1. Prerrequisitos
* Node.js v18+ (recomendado v20+ o v22+).
* PostgreSQL v14+ instalado localmente (o base de datos en Supabase / Neon).
* Git instalado.

### 2. Base de Datos Local
Crea la base de datos e inicializa las tablas con el script oficial reproducible:
```bash
createdb -U postgres tcgstore
psql -U postgres -d tcgstore -f database/esquema.sql
```

### 3. Configuración y Ejecución del Backend
```bash
cd backend
cp .env.example .env
npm install
npm start
```

#### Variables de entorno del backend (`backend/.env`):
```ini
PORT=3000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173,https://proyecto-web-y-movil.vercel.app

JWT_SECRET=tu_secreto_seguro_minimo_32_caracteres
JWT_EXPIRES_IN=2h

# Conexión local a PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tu_password_local
DB_NAME=tcgstore
DB_SSL=false

# O conexión a la nube mediante URL:
# DATABASE_URL=postgresql://usuario:password@host:5432/tcgstore?sslmode=require
# DB_SSL=true

# Google OAuth 2.0 (obtenido en Google Cloud Console)
GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_google_client_secret

# Correo transaccional con Gmail (Nodemailer)
GMAIL_USER=tu_correo@gmail.com
GMAIL_APP_PASSWORD=tu_contraseña_de_aplicacion
```
*El servidor backend iniciará en `http://localhost:3000`.*

### 4. Configuración y Ejecución del Frontend
En otra terminal:
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

#### Variables de entorno del frontend (`frontend/.env`):
```ini
VITE_API_URL=http://localhost:3000/api
VITE_GOOGLE_CLIENT_ID=tu_google_client_id.apps.googleusercontent.com
```
*Vite abrirá la aplicación en `http://localhost:5173`, conectándose automáticamente al backend.*

---

## Pruebas y Testing

El proyecto cuenta con un conjunto integral de pruebas automatizadas en ambos extremos de la aplicación:

* **Pruebas de Backend (30 pruebas automáticas):**  
  ```bash
  cd backend && npm test
  ```
  *Ejecuta 30 pruebas automáticas nativas (`node:test`) cubriendo autenticación local con bcrypt, Google OAuth 2.0, verificación de correo, recuperación de contraseña, control de roles (RBAC), transacciones ACID de stock con rollback, endpoints de productos, órdenes, notas de administración y servicios de correo con Nodemailer.*

* **Pruebas Unitarias de Frontend (32 pruebas unitarias):**  
  ```bash
  cd frontend && npm run test.unit
  ```
  *Ejecuta 32 pruebas unitarias con Vitest verificando la capa de servicios (`authService`, `apiService`), guards de enrutamiento protegido (`ProtectedRoute`), buscador con autocompletado en el encabezado y componentes principales.*

* **Compilación de Producción:**  
  ```bash
  cd frontend && npm run build
  ```
  *Verifica la compilación estricta de TypeScript (`tsc`) y el empaquetado de producción con Vite sin errores.*

* **Colección de Postman:**  
  Ubicada en [`testing/TCGStore_EP2.postman_collection.json`](testing/TCGStore_EP2.postman_collection.json) junto a su entorno [`testing/TCGStore_Local.postman_environment.json`](testing/TCGStore_Local.postman_environment.json), cubriendo todos los endpoints de la API, flujos de autenticación, reglas de negocio y control de acceso por roles.

---

### 🧪 Evidencia de Pruebas de API en Postman

La API REST fue verificada exhaustivamente mediante una suite automatizada en Postman con **130 validaciones exitosas (130 Passed / 0 Failed)** ejecutadas en secuencia ordenada con el *Collection Runner*:

#### 1. Resumen General de Ejecución (Collection Runner)
![Resumen de Pruebas en Postman](docs/postman/01-runner-summary.png)

#### 2. Autenticación y Manejo Seguro de Tokens JWT
* **Inicio de Sesión de Administrador (`200 OK`):** Generación de token JWT y asignación de rol administrativo.  
  ![Login Admin](docs/postman/02-auth-login-admin.png)
* **Protección de Rutas Privadas (`401 Unauthorized`):** Bloqueo inmediato de solicitudes a endpoints protegidos sin token de autorización.  
  ![Perfil sin token](docs/postman/03-auth-sin-token-401.png)

#### 3. Reglas de Negocio y Control Transaccional de Stock
* **Validación de Inventario Insuficiente (`400 Bad Request`):** Bloqueo automático de pedidos que superan el stock físico disponible en PostgreSQL.  
  ![Pedido sin stock](docs/postman/04-pedido-sin-stock-400.png)
* **Creación Exitosa de Orden (`201 Created`):** Validación transaccional, cálculo de totales y descuento de inventario.  
  ![Crear pedido cliente](docs/postman/05-crear-pedido-cliente-201.png)

#### 4. Control de Acceso por Roles (RBAC)
* **Intento de Creación denegado a Cliente (`403 Forbidden`):** Un usuario autenticado con rol `cliente` intenta registrar un producto nuevo en el catálogo y el middleware de autorización bloquea la solicitud de forma inmediata.  
  ![Crear producto como cliente 403](docs/postman/06-rbac-crear-producto-403.png)
* **Intento de Eliminación denegado a Cliente (`403 Forbidden`):** La API impide que cuentas sin credenciales administrativas puedan dar de baja o suprimir productos del inventario.  
  ![Eliminar como cliente 403](docs/postman/07-rbac-eliminar-producto-403.png)
