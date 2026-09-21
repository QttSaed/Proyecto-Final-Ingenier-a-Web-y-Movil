# Plataforma E-commerce Especializada en Trading Card Games (TCG)

**🚀 Proyecto en Vivo (Vercel):** [https://proyecto-web-y-movil.vercel.app/](https://proyecto-web-y-movil.vercel.app/)


# Presentado por:
- Alfonso Duran Araya   
- Joaquin Alegria Vargas
- Martín Albarrán Alcorta

## Índice
1. [Justificación del problema](#justificación-del-problema)
2. [Usuarios](#usuarios-objetivo-quién-usará-la-aplicación)
    - [Roles](#roles-del-sistema)
    - [Proto-personas](#proto-personas)
3. [Requerimientos](#requerimientos)
4. [Arquitectura de la Información / UX](#arquitectura-de-navegación)
    - [Diferenciación x roles](#diferenciación-de-acceso-según-roles)
    - [Flujos principales Tareas](#flujos-de-tareas)
    - [Puntos críticos de interacción](#puntos-críticos-de-interacción)
    - [Justificación Técnica](#justificación-técnica)
5. [Bocetos UX/UI](#bocetos-uiux)
6. [Frontend con Ionic-React](#tecnologías)

---

## Justificación del problema
En el mercado local de juegos de cartas coleccionables (TCG como Pokémon, Yu-Gi-Oh!, Magic: The Gathering, etc.), los jugadores y coleccionistas enfrentan dificultades para encontrar un inventario centralizado y confiable de cartas sueltas ("singles") y productos sellados.

A menudo, las transacciones se realizan a través de redes sociales sin garantías de seguridad, o en tiendas físicas que carecen de un catálogo digital actualizado. Esto obliga al usuario a cotizar presencialmente o a lidiar con múltiples vendedores dispersos, lo que dificulta la selección de los productos adecuados y la comparación de precios.

Además, los sistemas de comercio electrónico tradicionales no están diseñados para manejar los atributos específicos y vitales de una carta coleccionable, tales como la edición, rareza, condición (Mint, Near Mint, Damaged), si es "Foil" o el idioma.

En este contexto, el problema abordado por el proyecto corresponde a la necesidad de **gestionar, organizar y comercializar artículos de TCG mediante una plataforma optimizada que entienda las particularidades de estos productos**.

Por lo tanto, el desarrollo de una plataforma web y móvil permitiría centralizar el inventario de la tienda, facilitar la búsqueda estructurada para los clientes desde diferentes dispositivos y proporcionar herramientas de gestión especializadas para los administradores del negocio.

---

## Usuarios objetivo (Quién usará la aplicación)
La aplicación considera principalmente dos grupos de usuarios: **clientes (jugadores/coleccionistas) y administradores**.

### Clientes
Corresponden a los principales usuarios de la plataforma. Son un grupo diverso compuesto tanto por jugadores competitivos como por coleccionistas, cada uno con necesidades de compra distintas.

Dentro de este grupo pueden existir usuarios que:
- buscan una carta muy específica para completar una estrategia de juego;
- buscan cartas antiguas o raras en perfecto estado de conservación;
- desean comprar accesorios (protectores, carpetas) o productos sellados;
- compran desde sus dispositivos móviles mientras están en un torneo;
- necesitan saber si una carta está en idioma español o inglés.

#### Necesidades principales
- encontrar cartas rápidamente usando filtros avanzados (color, costo, tipo, rareza);
- conocer el estado real de la carta y el stock exacto antes de comprar;
- un proceso de compra rápido (checkout) y seguro;
- disponer de un historial de compras;
- acceso a la tienda desde el móvil de forma fluida.

### Administradores
Constituyen el segundo grupo de usuarios del sistema. Su función principal es administrar la tienda física y su reflejo digital en la plataforma. A diferencia del cliente, el administrador tendrá acceso a funcionalidades de back-office.

---

## Roles del Sistema
- **Cliente**: Usuario registrado que puede navegar, buscar productos, agregar al carrito y realizar compras.
- **Administrador**: Usuario encargado de gestionar el inventario, los precios y procesar las órdenes de los clientes.

### Definición de conceptos
**Rol**: Define qué puede hacer un usuario dentro del sistema.
**Proto-persona**: Describe quién podría ser ese usuario, sus características, necesidades, objetivos, dificultades y contexto de uso.

---

## Proto-personas
Las siguientes proto-personas corresponden a **perfiles hipotéticos** construidos a partir del análisis del problema y de las características esperadas de los usuarios de la plataforma.

---

### Proto-persona 1: Jugador Competitivo
**Nombre ficticio:** Martín
**Tipo de usuario o rol:** Cliente

#### Características generales
Martín es un joven universitario de 22 años que asiste semanalmente a torneos locales de TCG. Conoce muy bien las reglas de su juego y sabe exactamente qué cartas necesita para mejorar su mazo. Utiliza principalmente su teléfono móvil.

#### Necesidades principales
- Búsqueda rápida y precisa de cartas individuales.
- Conocer la disponibilidad real de stock.
- Proceso de pago ágil.
- Filtrado por atributos específicos del juego.

#### Objetivos de uso
Comprar cartas sueltas ("singles") rápidamente el día jueves para que alcancen a llegar antes de su torneo del fin de semana, o para retirarlas en la tienda.

#### Dificultades o puntos de frustración
Puede presentar dificultades cuando:
- el buscador de una tienda no le permite filtrar por la edición exacta de la carta;
- llega a la tienda y la carta que aparecía en la web ya se había vendido;
- el proceso de pago es engorroso desde el móvil.

#### Funcionalidades de la aplicación que utilizaría
- Buscador avanzado y filtros especializados.
- Visualización de detalles de la carta (estado y rareza).
- Carrito de compras.
- Historial de pedidos.

#### Dispositivo y contexto probable de acceso
Utilizaría principalmente un **teléfono móvil**. Podría acceder durante traslados en transporte público, o en medio de un torneo mientras revisa estrategias con sus amigos.

---

### Proto-persona 2: Administrador de Tienda
**Nombre ficticio:** Rodrigo
**Tipo de usuario o rol:** Administrador

#### Características generales
Rodrigo tiene 35 años y es el dueño de una tienda local de juegos de mesa y TCG. Maneja un gran volumen de inventario que cambia a diario debido a las ventas físicas y la compra de cartas a los mismos jugadores. 

#### Necesidades principales
- Crear y modificar productos de manera ágil.
- Actualizar el stock rápidamente.
- Procesar las órdenes web (cambiar estado a "Enviado" o "Entregado").

#### Objetivos de uso
Mantener el stock web sincronizado con su tienda física y gestionar los envíos a los clientes para aumentar sus ventas.

#### Dificultades o puntos de frustración
Puede presentar frustración cuando:
- el sistema de inventario genérico no tiene campos para "Idioma" o "Estado de conservación", obligándolo a escribirlo en el título;
- agregar una nueva carta al sistema requiere demasiados clics;
- no se le notifica claramente cuando entra un nuevo pedido.

#### Funcionalidades de la aplicación que utilizaría
- Panel de control de órdenes.
- CRUD (Crear, Leer, Actualizar, Eliminar) de inventario.
- Cambio de estados de pedidos.

#### Dispositivo y contexto probable de acceso
Utilizaría principalmente un **computador de escritorio** desde el mostrador de su tienda física durante su jornada laboral.

---

## Requerimientos

### Requerimientos Funcionales por Rol
Un requerimiento funcional (RF) describe qué debe hacer el sistema. 

| ID | Requerimiento funcional | Rol |
|---|---|---|
| **RF-01** | El sistema deberá permitir al cliente buscar productos utilizando filtros avanzados especializados (categoría, juego, edición, rareza). | Cliente |
| **RF-02** | El sistema deberá mostrar el detalle del producto, incluyendo imagen, precio, cantidad en stock y estado de conservación (Condición). | Cliente |
| **RF-03** | El sistema deberá permitir al cliente agregar, editar cantidades y eliminar productos dentro de un carrito de compras. | Cliente |
| **RF-04** | El sistema deberá permitir al cliente finalizar su compra (checkout) generando un número de orden. | Cliente |
| **RF-05** | El sistema deberá permitir al cliente consultar su historial de órdenes pasadas y verificar su estado actual. | Cliente |
| **RF-06** | El sistema deberá permitir al administrador gestionar el catálogo (crear, modificar y eliminar productos) con atributos propios de TCG. | Administrador |
| **RF-07** | El sistema deberá permitir al administrador visualizar todas las órdenes recibidas y actualizar su estado (Pendiente, Pagado, Enviado). | Administrador |

---

### Funcionalidades Transversales
Las siguientes funcionalidades son necesarias para el funcionamiento general de la aplicación.
- **FT-01:** El sistema deberá permitir el registro de nuevos usuarios clientes.
- **FT-02:** El sistema deberá permitir iniciar sesión mediante credenciales.
- **FT-03:** El sistema deberá permitir cerrar la sesión activa.
- **FT-04:** El sistema deberá restringir funcionalidades de administración a usuarios sin el rol correspondiente.

---

## Requerimientos No Funcionales

### UX y Usabilidad
- **RNF-UX-01 (Diseño adaptable):** La interfaz deberá adaptarse a dispositivos móviles y de escritorio, optimizando la visualización de las cartas en grillas.
- **RNF-UX-02 (Feedback de Carrito):** Al agregar un producto al carrito, el sistema debe proveer una respuesta visual inmediata (como un "Toast" o notificación) para confirmar la acción.
- **RNF-UX-03 (Imágenes claras):** Las imágenes de los productos deben contar con una vista ampliada (modal o zoom) para que los coleccionistas puedan ver detalles de la carta.

### Accesibilidad
- **RNF-ACC-01:** Los textos de los precios y condiciones de las cartas deben tener alto contraste visual.
- **RNF-ACC-02:** Los botones de "Comprar" y navegación deben tener un área táctil lo suficientemente grande para dispositivos móviles.

### Seguridad
- **RNF-SEG-01 (Protección de contraseñas):** Las contraseñas se almacenarán mediante hashes seguros (ej. bcrypt).
- **RNF-SEG-02 (Autorización por roles):** Un usuario con rol Cliente no podrá acceder bajo ninguna circunstancia a las rutas o endpoints de la API de administración.
- **RNF-SEG-03 (Protección de inyecciones):** Todas las entradas de los buscadores de cartas deben estar parametrizadas para evitar ataques XSS o inyección SQL.

### Rendimiento
- **RNF-REN-01 (Carga de imágenes):** Las imágenes de las cartas deben cargarse de manera asíncrona ("lazy loading") para no bloquear la navegación del catálogo.
- **RNF-REN-02 (Tiempo de respuesta):** Las búsquedas filtradas del catálogo no deben superar los 2 segundos de tiempo de respuesta para mantener una experiencia ágil.

---

## Arquitectura de Navegación

### 1. Rutas principales y secundarias
La aplicación considera rutas públicas, rutas de cliente y rutas de administración.

#### Rutas públicas
| Ruta | Vista | Descripción |
|---|---|---|
| `/` | Home | Novedades, expansiones destacadas. |
| `/catalogo` | Catálogo de productos | Grilla de cartas con filtros. |
| `/producto/:id` | Detalle del producto | Información detallada de una carta o producto. |
| `/login` | Inicio de sesión | Ingreso al sistema. |
| `/registro` | Registro | Creación de cuenta de cliente. |

#### Rutas protegidas del Cliente
| Ruta | Vista | Descripción |
|---|---|---|
| `/carrito` | Carrito de Compras | Revisión de productos seleccionados y checkout. |
| `/perfil` | Perfil y Órdenes | Historial de compras y estado de pedidos. |

#### Rutas protegidas del Administrador
| Ruta | Vista | Descripción |
|---|---|---|
| `/admin` | Dashboard | Resumen general de ventas y alertas. |
| `/admin/inventario` | Gestión de Inventario | CRUD de productos. |
| `/admin/ordenes` | Gestión de Órdenes | Revisión y cambio de estado de pedidos. |

### 2. Relaciones jerárquicas entre vistas
```text
Aplicación
│
├── Rutas públicas
│   ├── Home
│   ├── Catálogo
│   │   └── Detalle Producto
│   ├── Login
│   └── Registro
│
└── Rutas protegidas
    │
    ├── Cliente
    │   ├── Carrito -> Checkout
    │   └── Perfil (Mis Órdenes)
    │
    └── Administrador
        ├── Dashboard
        ├── Inventario (Listar, Crear, Editar)
        └── Órdenes
```

---

## Diferenciación de acceso según roles

### Matriz de acceso por rol
| Funcionalidad | Usuario Anónimo | Cliente | Administrador |
|---|:---:|:---:|:---:|
| Explorar catálogo de cartas | ✓ | ✓ | ✓ |
| Ver detalles del producto | ✓ | ✓ | ✓ |
| Agregar productos al carrito | ✓ | ✓ | ✓ |
| Finalizar compra | — | ✓ | — |
| Ver historial de órdenes propio | — | ✓ | — |
| Agregar / Editar inventario | — | — | ✓ |
| Cambiar estado de órdenes globales| — | — | ✓ |

---

## Flujos de Tareas (Task Flows)

### Task Flow 1: Búsqueda y compra de una carta (Cliente)
**Objetivo:** Encontrar una carta específica, agregarla al carrito y generar el pedido.
```text
Inicio en Home
      ↓
Navegar a Catálogo
      ↓
Aplicar filtros (Juego, Rareza)
      ↓
Seleccionar carta (Detalle de Producto)
      ↓
Verificar estado y stock
      ↓
Agregar al carrito
      ↓
Ir al Carrito de compras
      ↓
Validar resumen de compra
      ↓
Checkout (Confirmar pedido)
      ↓
Visualizar "Orden Generada con Éxito"
```

### Task Flow 2: Actualización de Inventario (Administrador)
**Objetivo:** Ingresar una nueva carta que llegó a la tienda al catálogo web.
```text
Inicio de sesión como Admin
      ↓
Panel de Administración (Dashboard)
      ↓
Sección "Inventario"
      ↓
Seleccionar "Nuevo Producto"
      ↓
Llenar formulario (Nombre, Expansión, Condición, Stock, Precio)
      ↓
Subir imagen
      ↓
Guardar producto
      ↓
Visualizar confirmación de "Producto agregado"
```

---

## Puntos críticos de interacción
1. **Filtros del Catálogo:** Dada la cantidad de cartas en un TCG, los filtros son vitales. Si la interfaz de filtros en versión móvil ocupa demasiada pantalla o se recarga con cada toque, causará frustración. Se debe usar un menú lateral ocultable o filtros aplicables mediante un botón "Aplicar".
2. **Claridad del Estado de la Carta:** En el detalle del producto, si la información sobre si la carta está en buen estado o dañada no es clara, generará reclamos post-venta.
3. **El Carrito en Móviles:** El flujo desde el carrito hacia el checkout debe ser muy evidente y fluido, reduciendo el abandono de compra.
4. **Gestión de Stock Concurrente:** Si dos clientes intentan comprar la última copia de una carta al mismo tiempo, el sistema debe validar la disponibilidad final al momento del checkout para evitar sobreventas.

---

## Justificación Técnica
La arquitectura de navegación fue diseñada para cumplir con el estándar de un E-commerce eficiente. 
- **Usabilidad:** La ruta de descubrimiento (Home -> Catálogo -> Producto) es conocida universalmente por los usuarios, reduciendo la curva de aprendizaje.
- **Escalabilidad:** Separar las rutas de Cliente y Administrador bajo el prefijo `/admin` asegura que las lógicas de carga y componentes pesados de gestión (tablas, formularios complejos) no impacten el rendimiento de la vista del cliente.

---

## Bocetos UI/UX
(https://www.figma.com/proto/sfyPtwS7DZlxlQOimMfeaz/TCGStore-Web?node-id=2-3&p=f&t=TFggwOJHHyufxtOT-1&scaling=contain&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=2%3A3)

---

## Tecnologías y Herramientas

### Librerías principales usadas con React (Ionic)
| Librería | Propósito |
|---|---|
| `react` | Construcción de la interfaz mediante componentes. |
| `@ionic/react` | Proporciona los componentes UI base (`IonPage`, `IonContent`, `IonCard`, etc.) optimizados para móvil y web. |
| `react-router-dom` | Gestión del enrutamiento de la tienda (SPA). |
| `ionicons` | Biblioteca de iconos para botones y menús. |

### Stack Tecnológico del Proyecto
- **Frontend:** Ionic Framework (v7+), React, Vite.
- **Backend (Próximas fases):** Node.js, Express.
- **Base de Datos (Próximas fases):** PostgreSQL.

## 🌐 Acceso a la Plataforma
El proyecto se encuentra desplegado y accesible en línea a través de Vercel. No es necesario realizar instalación local.

👉 **Enlace del proyecto:** [proyecto-web-y-movil.vercel.app](https://proyecto-web-y-movil.vercel.app/)

### 🔑 Cuentas de Prueba (Mock Login)
Para evaluar las rutas protegidas y los distintos roles sin un backend conectado, el sistema cuenta con autenticación simulada. Utiliza las siguientes credenciales (la contraseña para ambas es `123456`):

- **Rol Cliente:** `cliente@tcgstore.com` (Habilita el Checkout y el perfil "Mi Cuenta" con historial de órdenes).
- **Rol Administrador:** `admin@tcgstore.com` (Da acceso exclusivo al Dashboard de gestión y bloquea vistas de cliente).
