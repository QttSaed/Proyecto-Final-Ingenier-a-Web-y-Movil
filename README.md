# Plataforma E-commerce Especializada en Trading Card Games (TCG)

**🚀 Proyecto en Vivo (Vercel):** [https://proyecto-web-y-movil.vercel.app/](https://proyecto-web-y-movil.vercel.app/)


# Presentado por:
- Alfonso Duran Araya   
- Joaquin Alegria Vargas
- MartÃ­n AlbarrÃ¡n Alcorta

## Ãndice
1. [JustificaciÃ³n del problema](#justificaciÃ³n-del-problema)
2. [Usuarios](#usuarios-objetivo-quiÃ©n-usarÃ¡-la-aplicaciÃ³n)
    - [Roles](#roles-del-sistema)
    - [Proto-personas](#proto-personas)
3. [Requerimientos](#requerimientos)
4. [Arquitectura de la InformaciÃ³n / UX](#arquitectura-de-navegaciÃ³n)
    - [DiferenciaciÃ³n x roles](#diferenciaciÃ³n-de-acceso-segÃºn-roles)
    - [Flujos principales Tareas](#flujos-de-tareas)
    - [Puntos crÃ­ticos de interacciÃ³n](#puntos-crÃ­ticos-de-interacciÃ³n)
    - [JustificaciÃ³n TÃ©cnica](#justificaciÃ³n-tÃ©cnica)
5. [Bocetos UX/UI](#bocetos-uiux)
6. [Frontend con Ionic-React](#tecnologÃ­as)

---

## JustificaciÃ³n del problema
En el mercado local de juegos de cartas coleccionables (TCG como PokÃ©mon, Yu-Gi-Oh!, Magic: The Gathering, etc.), los jugadores y coleccionistas enfrentan dificultades para encontrar un inventario centralizado y confiable de cartas sueltas ("singles") y productos sellados.

A menudo, las transacciones se realizan a travÃ©s de redes sociales sin garantÃ­as de seguridad, o en tiendas fÃ­sicas que carecen de un catÃ¡logo digital actualizado. Esto obliga al usuario a cotizar presencialmente o a lidiar con mÃºltiples vendedores dispersos, lo que dificulta la selecciÃ³n de los productos adecuados y la comparaciÃ³n de precios.

AdemÃ¡s, los sistemas de comercio electrÃ³nico tradicionales no estÃ¡n diseÃ±ados para manejar los atributos especÃ­ficos y vitales de una carta coleccionable, tales como la ediciÃ³n, rareza, condiciÃ³n (Mint, Near Mint, Damaged), si es "Foil" o el idioma.

En este contexto, el problema abordado por el proyecto corresponde a la necesidad de **gestionar, organizar y comercializar artÃ­culos de TCG mediante una plataforma optimizada que entienda las particularidades de estos productos**.

Por lo tanto, el desarrollo de una plataforma web y mÃ³vil permitirÃ­a centralizar el inventario de la tienda, facilitar la bÃºsqueda estructurada para los clientes desde diferentes dispositivos y proporcionar herramientas de gestiÃ³n especializadas para los administradores del negocio.

---

## Usuarios objetivo (QuiÃ©n usarÃ¡ la aplicaciÃ³n)
La aplicaciÃ³n considera principalmente dos grupos de usuarios: **clientes (jugadores/coleccionistas) y administradores**.

### Clientes
Corresponden a los principales usuarios de la plataforma. Son un grupo diverso compuesto tanto por jugadores competitivos como por coleccionistas, cada uno con necesidades de compra distintas.

Dentro de este grupo pueden existir usuarios que:
- buscan una carta muy especÃ­fica para completar una estrategia de juego;
- buscan cartas antiguas o raras en perfecto estado de conservaciÃ³n;
- desean comprar accesorios (protectores, carpetas) o productos sellados;
- compran desde sus dispositivos mÃ³viles mientras estÃ¡n en un torneo;
- necesitan saber si una carta estÃ¡ en idioma espaÃ±ol o inglÃ©s.

#### Necesidades principales
- encontrar cartas rÃ¡pidamente usando filtros avanzados (color, costo, tipo, rareza);
- conocer el estado real de la carta y el stock exacto antes de comprar;
- un proceso de compra rÃ¡pido (checkout) y seguro;
- disponer de un historial de compras;
- acceso a la tienda desde el mÃ³vil de forma fluida.

### Administradores
Constituyen el segundo grupo de usuarios del sistema. Su funciÃ³n principal es administrar la tienda fÃ­sica y su reflejo digital en la plataforma. A diferencia del cliente, el administrador tendrÃ¡ acceso a funcionalidades de back-office.

---

## Roles del Sistema
- **Cliente**: Usuario registrado que puede navegar, buscar productos, agregar al carrito y realizar compras.
- **Administrador**: Usuario encargado de gestionar el inventario, los precios y procesar las Ã³rdenes de los clientes.

### DefiniciÃ³n de conceptos
**Rol**: Define quÃ© puede hacer un usuario dentro del sistema.
**Proto-persona**: Describe quiÃ©n podrÃ­a ser ese usuario, sus caracterÃ­sticas, necesidades, objetivos, dificultades y contexto de uso.

---

## Proto-personas
Las siguientes proto-personas corresponden a **perfiles hipotÃ©ticos** construidos a partir del anÃ¡lisis del problema y de las caracterÃ­sticas esperadas de los usuarios de la plataforma.

---

### Proto-persona 1: Jugador Competitivo
**Nombre ficticio:** MartÃ­n
**Tipo de usuario o rol:** Cliente

#### CaracterÃ­sticas generales
MartÃ­n es un joven universitario de 22 aÃ±os que asiste semanalmente a torneos locales de TCG. Conoce muy bien las reglas de su juego y sabe exactamente quÃ© cartas necesita para mejorar su mazo. Utiliza principalmente su telÃ©fono mÃ³vil.

#### Necesidades principales
- BÃºsqueda rÃ¡pida y precisa de cartas individuales.
- Conocer la disponibilidad real de stock.
- Proceso de pago Ã¡gil.
- Filtrado por atributos especÃ­ficos del juego.

#### Objetivos de uso
Comprar cartas sueltas ("singles") rÃ¡pidamente el dÃ­a jueves para que alcancen a llegar antes de su torneo del fin de semana, o para retirarlas en la tienda.

#### Dificultades o puntos de frustraciÃ³n
Puede presentar dificultades cuando:
- el buscador de una tienda no le permite filtrar por la ediciÃ³n exacta de la carta;
- llega a la tienda y la carta que aparecÃ­a en la web ya se habÃ­a vendido;
- el proceso de pago es engorroso desde el mÃ³vil.

#### Funcionalidades de la aplicaciÃ³n que utilizarÃ­a
- Buscador avanzado y filtros especializados.
- VisualizaciÃ³n de detalles de la carta (estado y rareza).
- Carrito de compras.
- Historial de pedidos.

#### Dispositivo y contexto probable de acceso
UtilizarÃ­a principalmente un **telÃ©fono mÃ³vil**. PodrÃ­a acceder durante traslados en transporte pÃºblico, o en medio de un torneo mientras revisa estrategias con sus amigos.

---

### Proto-persona 2: Administrador de Tienda
**Nombre ficticio:** Rodrigo
**Tipo de usuario o rol:** Administrador

#### CaracterÃ­sticas generales
Rodrigo tiene 35 aÃ±os y es el dueÃ±o de una tienda local de juegos de mesa y TCG. Maneja un gran volumen de inventario que cambia a diario debido a las ventas fÃ­sicas y la compra de cartas a los mismos jugadores. 

#### Necesidades principales
- Crear y modificar productos de manera Ã¡gil.
- Actualizar el stock rÃ¡pidamente.
- Procesar las Ã³rdenes web (cambiar estado a "Enviado" o "Entregado").

#### Objetivos de uso
Mantener el stock web sincronizado con su tienda fÃ­sica y gestionar los envÃ­os a los clientes para aumentar sus ventas.

#### Dificultades o puntos de frustraciÃ³n
Puede presentar frustraciÃ³n cuando:
- el sistema de inventario genÃ©rico no tiene campos para "Idioma" o "Estado de conservaciÃ³n", obligÃ¡ndolo a escribirlo en el tÃ­tulo;
- agregar una nueva carta al sistema requiere demasiados clics;
- no se le notifica claramente cuando entra un nuevo pedido.

#### Funcionalidades de la aplicaciÃ³n que utilizarÃ­a
- Panel de control de Ã³rdenes.
- CRUD (Crear, Leer, Actualizar, Eliminar) de inventario.
- Cambio de estados de pedidos.

#### Dispositivo y contexto probable de acceso
UtilizarÃ­a principalmente un **computador de escritorio** desde el mostrador de su tienda fÃ­sica durante su jornada laboral.

---

## Requerimientos

### Requerimientos Funcionales por Rol
Un requerimiento funcional (RF) describe quÃ© debe hacer el sistema. 

| ID | Requerimiento funcional | Rol |
|---|---|---|
| **RF-01** | El sistema deberÃ¡ permitir al cliente buscar productos utilizando filtros avanzados especializados (categorÃ­a, juego, ediciÃ³n, rareza). | Cliente |
| **RF-02** | El sistema deberÃ¡ mostrar el detalle del producto, incluyendo imagen, precio, cantidad en stock y estado de conservaciÃ³n (CondiciÃ³n). | Cliente |
| **RF-03** | El sistema deberÃ¡ permitir al cliente agregar, editar cantidades y eliminar productos dentro de un carrito de compras. | Cliente |
| **RF-04** | El sistema deberÃ¡ permitir al cliente finalizar su compra (checkout) generando un nÃºmero de orden. | Cliente |
| **RF-05** | El sistema deberÃ¡ permitir al cliente consultar su historial de Ã³rdenes pasadas y verificar su estado actual. | Cliente |
| **RF-06** | El sistema deberÃ¡ permitir al administrador gestionar el catÃ¡logo (crear, modificar y eliminar productos) con atributos propios de TCG. | Administrador |
| **RF-07** | El sistema deberÃ¡ permitir al administrador visualizar todas las Ã³rdenes recibidas y actualizar su estado (Pendiente, Pagado, Enviado). | Administrador |

---

### Funcionalidades Transversales
Las siguientes funcionalidades son necesarias para el funcionamiento general de la aplicaciÃ³n.
- **FT-01:** El sistema deberÃ¡ permitir el registro de nuevos usuarios clientes.
- **FT-02:** El sistema deberÃ¡ permitir iniciar sesiÃ³n mediante credenciales.
- **FT-03:** El sistema deberÃ¡ permitir cerrar la sesiÃ³n activa.
- **FT-04:** El sistema deberÃ¡ restringir funcionalidades de administraciÃ³n a usuarios sin el rol correspondiente.

---

## Requerimientos No Funcionales

### UX y Usabilidad
- **RNF-UX-01 (DiseÃ±o adaptable):** La interfaz deberÃ¡ adaptarse a dispositivos mÃ³viles y de escritorio, optimizando la visualizaciÃ³n de las cartas en grillas.
- **RNF-UX-02 (Feedback de Carrito):** Al agregar un producto al carrito, el sistema debe proveer una respuesta visual inmediata (como un "Toast" o notificaciÃ³n) para confirmar la acciÃ³n.
- **RNF-UX-03 (ImÃ¡genes claras):** Las imÃ¡genes de los productos deben contar con una vista ampliada (modal o zoom) para que los coleccionistas puedan ver detalles de la carta.

### Accesibilidad
- **RNF-ACC-01:** Los textos de los precios y condiciones de las cartas deben tener alto contraste visual.
- **RNF-ACC-02:** Los botones de "Comprar" y navegaciÃ³n deben tener un Ã¡rea tÃ¡ctil lo suficientemente grande para dispositivos mÃ³viles.

### Seguridad
- **RNF-SEG-01 (ProtecciÃ³n de contraseÃ±as):** Las contraseÃ±as se almacenarÃ¡n mediante hashes seguros (ej. bcrypt).
- **RNF-SEG-02 (AutorizaciÃ³n por roles):** Un usuario con rol Cliente no podrÃ¡ acceder bajo ninguna circunstancia a las rutas o endpoints de la API de administraciÃ³n.
- **RNF-SEG-03 (ProtecciÃ³n de inyecciones):** Todas las entradas de los buscadores de cartas deben estar parametrizadas para evitar ataques XSS o inyecciÃ³n SQL.

### Rendimiento
- **RNF-REN-01 (Carga de imÃ¡genes):** Las imÃ¡genes de las cartas deben cargarse de manera asÃ­ncrona ("lazy loading") para no bloquear la navegaciÃ³n del catÃ¡logo.
- **RNF-REN-02 (Tiempo de respuesta):** Las bÃºsquedas filtradas del catÃ¡logo no deben superar los 2 segundos de tiempo de respuesta para mantener una experiencia Ã¡gil.

---

## Arquitectura de NavegaciÃ³n

### 1. Rutas principales y secundarias
La aplicaciÃ³n considera rutas pÃºblicas, rutas de cliente y rutas de administraciÃ³n.

#### Rutas pÃºblicas
| Ruta | Vista | DescripciÃ³n |
|---|---|---|
| `/` | Home | Novedades, expansiones destacadas. |
| `/catalogo` | CatÃ¡logo de productos | Grilla de cartas con filtros. |
| `/producto/:id` | Detalle del producto | InformaciÃ³n detallada de una carta o producto. |
| `/login` | Inicio de sesiÃ³n | Ingreso al sistema. |
| `/registro` | Registro | CreaciÃ³n de cuenta de cliente. |

#### Rutas protegidas del Cliente
| Ruta | Vista | DescripciÃ³n |
|---|---|---|
| `/carrito` | Carrito de Compras | RevisiÃ³n de productos seleccionados y checkout. |
| `/perfil` | Perfil y Ãrdenes | Historial de compras y estado de pedidos. |

#### Rutas protegidas del Administrador
| Ruta | Vista | DescripciÃ³n |
|---|---|---|
| `/admin` | Dashboard | Resumen general de ventas y alertas. |
| `/admin/inventario` | GestiÃ³n de Inventario | CRUD de productos. |
| `/admin/ordenes` | GestiÃ³n de Ãrdenes | RevisiÃ³n y cambio de estado de pedidos. |

### 2. Relaciones jerÃ¡rquicas entre vistas
```text
AplicaciÃ³n
â
âââ Rutas pÃºblicas
â   âââ Home
â   âââ CatÃ¡logo
â   â   âââ Detalle Producto
â   âââ Login
â   âââ Registro
â
âââ Rutas protegidas
    â
    âââ Cliente
    â   âââ Carrito -> Checkout
    â   âââ Perfil (Mis Ãrdenes)
    â
    âââ Administrador
        âââ Dashboard
        âââ Inventario (Listar, Crear, Editar)
        âââ Ãrdenes
```

---

## DiferenciaciÃ³n de acceso segÃºn roles

### Matriz de acceso por rol
| Funcionalidad | Usuario AnÃ³nimo | Cliente | Administrador |
|---|:---:|:---:|:---:|
| Explorar catÃ¡logo de cartas | â | â | â |
| Ver detalles del producto | â | â | â |
| Agregar productos al carrito | â | â | â |
| Finalizar compra | â | â | â |
| Ver historial de Ã³rdenes propio | â | â | â |
| Agregar / Editar inventario | â | â | â |
| Cambiar estado de Ã³rdenes globales| â | â | â |

---

## Flujos de Tareas (Task Flows)

### Task Flow 1: BÃºsqueda y compra de una carta (Cliente)
**Objetivo:** Encontrar una carta especÃ­fica, agregarla al carrito y generar el pedido.
```text
Inicio en Home
      â
Navegar a CatÃ¡logo
      â
Aplicar filtros (Juego, Rareza)
      â
Seleccionar carta (Detalle de Producto)
      â
Verificar estado y stock
      â
Agregar al carrito
      â
Ir al Carrito de compras
      â
Validar resumen de compra
      â
Checkout (Confirmar pedido)
      â
Visualizar "Orden Generada con Ãxito"
```

### Task Flow 2: ActualizaciÃ³n de Inventario (Administrador)
**Objetivo:** Ingresar una nueva carta que llegÃ³ a la tienda al catÃ¡logo web.
```text
Inicio de sesiÃ³n como Admin
      â
Panel de AdministraciÃ³n (Dashboard)
      â
SecciÃ³n "Inventario"
      â
Seleccionar "Nuevo Producto"
      â
Llenar formulario (Nombre, ExpansiÃ³n, CondiciÃ³n, Stock, Precio)
      â
Subir imagen
      â
Guardar producto
      â
Visualizar confirmaciÃ³n de "Producto agregado"
```

---

## Puntos crÃ­ticos de interacciÃ³n
1. **Filtros del CatÃ¡logo:** Dada la cantidad de cartas en un TCG, los filtros son vitales. Si la interfaz de filtros en versiÃ³n mÃ³vil ocupa demasiada pantalla o se recarga con cada toque, causarÃ¡ frustraciÃ³n. Se debe usar un menÃº lateral ocultable o filtros aplicables mediante un botÃ³n "Aplicar".
2. **Claridad del Estado de la Carta:** En el detalle del producto, si la informaciÃ³n sobre si la carta estÃ¡ en buen estado o daÃ±ada no es clara, generarÃ¡ reclamos post-venta.
3. **El Carrito en MÃ³viles:** El flujo desde el carrito hacia el checkout debe ser muy evidente y fluido, reduciendo el abandono de compra.
4. **GestiÃ³n de Stock Concurrente:** Si dos clientes intentan comprar la Ãºltima copia de una carta al mismo tiempo, el sistema debe validar la disponibilidad final al momento del checkout para evitar sobreventas.

---

## JustificaciÃ³n TÃ©cnica
La arquitectura de navegaciÃ³n fue diseÃ±ada para cumplir con el estÃ¡ndar de un E-commerce eficiente. 
- **Usabilidad:** La ruta de descubrimiento (Home -> CatÃ¡logo -> Producto) es conocida universalmente por los usuarios, reduciendo la curva de aprendizaje.
- **Escalabilidad:** Separar las rutas de Cliente y Administrador bajo el prefijo `/admin` asegura que las lÃ³gicas de carga y componentes pesados de gestiÃ³n (tablas, formularios complejos) no impacten el rendimiento de la vista del cliente.

---

## Bocetos UI/UX
*(aqui va el el link de los prototipos de figma)*

---

## TecnologÃ­as y Herramientas

### LibrerÃ­as principales usadas con React (Ionic)
| LibrerÃ­a | PropÃ³sito |
|---|---|
| `react` | ConstrucciÃ³n de la interfaz mediante componentes. |
| `@ionic/react` | Proporciona los componentes UI base (`IonPage`, `IonContent`, `IonCard`, etc.) optimizados para mÃ³vil y web. |
| `react-router-dom` | GestiÃ³n del enrutamiento de la tienda (SPA). |
| `ionicons` | Biblioteca de iconos para botones y menÃºs. |

### Stack TecnolÃ³gico del Proyecto
- **Frontend:** Ionic Framework (v7+), React, Vite.
- **Backend (PrÃ³ximas fases):** Node.js, Express.
- **Base de Datos (PrÃ³ximas fases):** PostgreSQL.

## 🌐 Acceso a la Plataforma
El proyecto se encuentra desplegado y accesible en línea a través de Vercel. No es necesario realizar instalación local.

👉 **Enlace del proyecto:** [proyecto-web-y-movil.vercel.app](https://proyecto-web-y-movil.vercel.app/)

*(Para acceder a la vista de Administrador, inicia sesión en la app usando el correo `admin@tcgstore.com`).*
