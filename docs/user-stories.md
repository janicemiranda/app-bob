# Historias de usuarios

## HU1: Gestión de Lista de Clientes

- Como usuario del sistema Quiero ver una lista completa de clientes Para acceder a su información y realizar acciones sobre ellos

**Criterios de Aceptación:**

- Dado que accedo a la página principal Cuando la página carga completamente Entonces veo una tabla con todos los clientes y sus datos básicos
- Dado que estoy en la lista de clientes Cuando presiono el botón "Nuevo Cliente" Entonces se abre un modal con un formulario para registrar un nuevo cliente

**Notas Técnicas:**

- Tabla HTML con diseño responsivo usando Tailwind CSS
- Modal implementado con HTML, CSS y JavaScript vanilla
- Almacenamiento en localStorage

## HU2: Operaciones CRUD sobre Clientes

- Como administrador del sistema Quiero poder crear, editar y anular clientes Para mantener actualizada la información de los participantes

**Criterios de Aceptación:**

- Dado que estoy en la lista de clientes Cuando presiono el botón "Editar" de un cliente Entonces se abre un modal con un formulario pre-poblado con la información del cliente
- Dado que estoy en la lista de clientes Cuando presiono el botón "Anular" de un cliente Entonces se abre un modal de confirmación con los botones "Sí" y "No"
- Dado que estoy en el modal de confirmación de anulación Cuando presiono "Sí" Entonces el cliente es anulado y se actualiza la tabla

**Notas Técnicas:**

- Formularios con validación en JavaScript
- Modales de confirmación usando componentes de Tailwind CSS
- Persistencia de cambios en localStorage

## HU3: Detalles de Cliente

- Como usuario del sistema Quiero acceder a los detalles de un cliente específico Para ver sus ingresos y egresos

**Criterios de Aceptación:**

- Dado que estoy en la lista de clientes Cuando presiono el botón "Detalles" de un cliente Entonces soy redirigido a una nueva vista con la información de ingresos y egresos del cliente
- Dado que estoy en la vista de detalles Cuando veo la página Entonces puedo ver el título con el nombre del cliente y una tabla con sus ingresos y egresos

**Notas Técnicas:**

- Navegación entre páginas con JavaScript
- Tabla de transacciones con Tailwind CSS
- Recuperación de datos desde localStorage

## HU4: Gestión de Transacciones

- Como usuario de ventas/contabilidad Quiero poder registrar, editar y eliminar ingresos y egresos por cliente Para mantener actualizado su balance

**Criterios de Aceptación:**

- Dado que estoy en la vista de detalles de un cliente Cuando presiono el botón "Nuevo" Entonces se abre un modal con un formulario para registrar un nuevo ingreso o egreso
- Dado que estoy en la vista de detalles Cuando presiono el botón "Editar" de una transacción Entonces se abre un modal con un formulario para actualizar la transacción
- Dado que estoy en la vista de detalles Cuando presiono el botón "Eliminar" de una transacción Entonces se abre un modal de confirmación

**Notas Técnicas:**

- Formulario de transacciones con selección de tipo (ingreso/egreso)
- Validación de campos obligatorios con JavaScript
- Actualización dinámica de la tabla tras operaciones CRUD

## HU5: Dashboard de Estadísticas

- Como usuario administrativo Quiero ver un dashboard con indicadores clave Para tener una visión general del estado financiero

**Criterios de Aceptación:**

- Dado que accedo al dashboard Cuando la página carga completamente Entonces veo indicadores de total de ingresos, egresos, clientes, total en soles y total en dólares
- Dado que estoy en el dashboard Cuando se registran nuevas transacciones en el sistema Entonces los indicadores se actualizan automáticamente

**Notas Técnicas:**

- Tarjetas de estadísticas con Tailwind CSS
- Cálculos realizados con JavaScript
- Actualización dinámica al cargar la página

## Product Backlog Priorizado

| ID | Historia de Usuario | Descripción | Puntos de Historia | Prioridad | Sprint |
|----|---------------------|-------------|-------------------|-----------|--------|
| HU1 | Gestión de Lista de Clientes | Visualización y gestión de la lista completa de clientes | 5 | Alta | 1 |
| HU2 | Operaciones CRUD sobre Clientes | Crear, editar y anular clientes | 8 | Alta | 1 |
| HU3 | Detalles de Cliente | Acceso y visualización de ingresos/egresos de un cliente | 5 | Media | 2 |
| HU4 | Gestión de Transacciones | Registrar, editar y eliminar ingresos y egresos por cliente | 13 | Alta | 2 |
| HU5 | Dashboard de Estadísticas | Visualización de indicadores financieros clave | 8 | Media | 3 |
| BL1 | Configuración inicial del proyecto | Estructura base con HTML, Tailwind CSS y JavaScript | 3 | Alta | 1 |
| BL2 | Optimización responsive | Asegurar visualización correcta en todos los dispositivos | 5 | Baja | 3 |
| BL3 | Pruebas finales e integración | Validación completa del sistema | 3 | Media | 3 |

> **Nota:**
>-
> "Backlog Item" (Elemento de Backlog). Lo utilicé para diferenciar los elementos técnicos o tareas de configuración que no son propiamente historias de usuario (HU) pero que también son necesarios para el proyecto.
>-

## Planificación de Sprints (Enfoque MVP)

### Sprint 1 (1 - 3 días) - Estructura y gestión de clientes

- Objetivo: Implementar la estructura base y la gestión completa de clientes.

- Configuración del proyecto con HTML, Tailwind CSS y JavaScript
- Maquetación de la pantalla de lista de clientes
- Implementación de modales para crear, editar y anular clientes
- Almacenamiento en localStorage

### Sprint 2 (1 - 3 días) - Detalles y transacciones

- Objetivo: Implementar la vista de detalles y la gestión de transacciones.

- Desarrollo de la vista de detalles de cliente
- Implementación de la tabla de ingresos/egresos
- Desarrollo de modales para crear, editar y eliminar transacciones
- Cálculo de balance por cliente

### Sprint 3 (1 - 3 días) - Dashboard y finalización

- Objetivo: Completar el MVP con el dashboard y ajustes finales.

- Implementación del dashboard con los indicadores requeridos
- Desarrollo de los dos indicadores adicionales
- Ajustes responsive para visualización en dispositivos móviles
- Pruebas generales y correcciones