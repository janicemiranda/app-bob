# Historias de Usuario

### HU1: Registro de Subastas

Como usuario quiero registrar una subasta mediante un formulario para que se guarde la información necesaria y se inicie el proceso de subasta.

#### Criterios de Aceptación:

1. Dado que el usuario se encuentra en la página de registro
   Cuando complete los campos requeridos (Producto, Descripción, Monto, % de Comisión)
   Entonces se debe crear un registro de subasta con estado "Ingresado" y con la fecha `created_at` asignada

2. Dado que se ingresan el monto y el % de comisión
   Cuando se escriba en los campos correspondientes
   Entonces el sistema debe calcular y mostrar automáticamente el total de comisión

#### Notas Técnicas:

- Componentes necesarios: Formulario HTML, campos de entrada, botones de envío
- Modelos de datos: Objeto Subasta con atributos: id, producto, descripción, monto, % comisión, total comisión, estado, created_at, update_at, anulado_at
- Interacciones: Validación de formulario, evento JavaScript `oninput` o `onchange` para el cálculo en tiempo real

---

### HU2: Gestión de Estados de Subasta

Como Administrador, quiero actualizar el estado de las subastas (Ingresado, Cobrado, Anulado) para reflejar en el sistema el progreso y la situación real de cada subasta.

#### Criterios de Aceptación:

1. Dado que una subasta está registrada
   Cuando se seleccione la opción para marcarla como "Cobrado" o "Anulado"
   Entonces el sistema debe actualizar el estado y registrar la fecha correspondiente en `update_at` o `anulado_at`

2. Dado que se actualiza el estado de una subasta
   Cuando se visualice la información en el dashboard
   Entonces se debe reflejar claramente el estado actualizado de la subasta

#### Notas Técnicas:

- Componentes necesarios: Botones o dropdowns para la actualización de estado, lógica en JavaScript
- Modelos de datos: Atributo "estado" y campos de fecha actualizados según la acción
- Interacciones: Eventos de click para cambiar el estado y confirmación de acción previa (por ejemplo, ventana modal de confirmación)

---

### HU3: Cálculo Automático de Comisiones

Como Usuario, quiero que el sistema calcule automáticamente el total de comisión al ingresar el monto y el % de comisión, para obtener de manera inmediata el valor que representa la comisión.

#### Criterios de Aceptación:

1. Dado que el usuario está llenando el formulario de registro
   Cuando ingrese un valor en el campo Monto y % de Comisión
   Entonces el sistema debe realizar el cálculo y mostrar el total de comisión en el campo designado

2. Dado que se modifique el valor del monto o el %
   Cuando se detecte el cambio
   Entonces el total de comisión se actualice dinámicamente sin necesidad de recargar la página

#### Notas Técnicas:

- Componentes necesarios: Función JavaScript para el cálculo en tiempo real
- Modelos de datos: Campos "monto" y "% comisión" que determinan el campo derivado "total comisión"
- Interacciones: Eventos `onchange` o `oninput` aplicados a los campos de monto y % de comisión

---

### HU4: Dashboard de Indicadores

Como Administrador, quiero visualizar un dashboard con los indicadores clave de subastas (Ingresos, Subastas Anuladas, Subastas Cobradas, Comisiones Generadas) para monitorizar el desempeño de la plataforma en tiempo real.

#### Criterios de Aceptación:

1. Dado que existan varias subastas registradas
   Cuando se acceda al dashboard
   Entonces se deben mostrar los datos agregados de Ingresos Totales, cantidad de Subastas Anuladas, cantidad de Subastas Cobradas y Total de Comisiones Generadas

2. Dado que se actualice el estado de alguna subasta
   Cuando se realice el cambio
   Entonces los datos en el dashboard deben actualizarse para reflejar la nueva información

#### Notas Técnicas:

- Componentes necesarios: Sección de dashboard en la interfaz HTML, elementos de visualización de datos (tarjetas, tablas o gráficos simples)
- Modelos de datos: Agregados y totales calculados a partir de los registros de subastas
- Interacciones: Carga inicial de datos desde el almacenamiento local y actualización en tiempo real con JavaScript

---

### HU5: Persistencia de Datos Local

Como Desarrollador, quiero utilizar LocalStorage para guardar la información de las subastas, para mantener la persistencia de los datos en el MVP sin necesidad de un backend.

#### Criterios de Aceptación:

1. Dado que se registra una nueva subasta
   Cuando se guarda la información
   Entonces dicha información debe almacenarse en el LocalStorage del navegador

2. Dado que se refresque la página o se reinicie la aplicación
   Cuando se cargue el sistema
   Entonces se deben recuperar y mostrar las subastas registradas previamente desde el LocalStorage

#### Notas Técnicas:

- Componentes necesarios: API de LocalStorage mediante JavaScript
- Modelos de datos: Objetos JSON representando cada subasta
- Interacciones: Funciones para almacenar y recuperar la información desde LocalStorage, integradas en los eventos de registro y carga de la página

---

### HU6: Diseño Responsivo y Moderno

Como Usuario, quiero que la aplicación tenga un diseño responsivo y moderno utilizando HTML, CSS y Tailwind CSS, para asegurar una buena experiencia de usuario en cualquier dispositivo.

#### Criterios de Aceptación:

1. Dado que la aplicación se visualice en diferentes dispositivos (móvil, tablet, desktop)
   Cuando se ajuste el tamaño de la pantalla
   Entonces el diseño debe adaptarse manteniendo la legibilidad y usabilidad de la interfaz

2. Dado que se utilice Tailwind CSS
   Cuando se implemente el estilo
   Entonces el resultado debe cumplir con las pautas de diseño moderno, accesible y consistente visualmente

#### Notas Técnicas:

- Componentes necesarios: Framework Tailwind CSS, estructura semántica HTML
- Modelos de datos: No aplica en esta historia
- Interacciones: Uso de media queries y clases responsivas de Tailwind CSS para ajustar el diseño según el dispositivo

## Backlog

| ID de Historia de Usuario | Historia de Usuario                     | Nombre de Tarea                                                     | Propietario de Tarea | Estado    | Prioridad | Esfuerzo estimado (en días) |
|---------------------------|-----------------------------------------|---------------------------------------------------------------------|----------------------|-----------|-----------|-----------------------------|
| HU1                       | Registro de Subastas                    | Diseñar y maquetar formulario de registro                           | Janice               | Pendiente | Alta      | 2                           |
| HU3                       | Cálculo Automático de Comisiones        | Implementar validación y cálculo automático de comisión             | Alexander            | Pendiente | Alta      | 1                           |
| HU2                       | Gestión de Estados de Subasta           | Implementar cambio de estado mediante botones/dropdown              | Janice               | Pendiente | Alta      | 1                           |
| HU2                       | Gestión de Estados de Subasta           | Actualizar fechas (`update_at`, `anulado_at`) según cambio de estado| Alexander            | Pendiente | Media     | 1                           |
| HU4                       | Dashboard de Indicadores                | Crear dashboard e indicadores (Ingresos, Subastas Anuladas, etc.)   | Alexander            | Pendiente | Alta      | 2                           |
| HU5                       | Persistencia de Datos Local             | Implementar almacenamiento y recuperación de datos en LocalStorage  | Janice               | Pendiente | Media     | 2                           |
| HU6                       | Diseño Responsivo y Moderno             | Aplicar estilos responsivos con Tailwind CSS                        | Janice               | Pendiente | Alta      | 1                           |
