# Requerimientos -> Subastas Bob

## Análisis del Problema

### 1. Descripción del Negocio

Subastas Bob es una empresa que utiliza su plataforma web ([somosbob.com](https://www.somosbob.com/)) para gestionar y administrar subastas. La operación se centra en la creación, seguimiento y conclusión de procesos de subasta, involucrando:

- **Registro de Subastas:**  
  Los usuarios pueden registrar subastas ingresando datos esenciales como:
  - Producto
  - Descripción
  - Monto
  - Moneda ( S/ || $ )
  - % de Comisión
  - Campo donde se muestra el total de la comisión

- **Control Interno:**  
  Cada subasta cuenta con un estado interno que puede ser:
  - **Ingresado**
  - **Cobrado**
  - **Anulado**  

  Además, se registra la siguiente información temporal:
  - `created_at`
  - `update_at`
  - `anulado_at`

- **Dashboard Integral:**  
  Un panel que consolida indicadores críticos del negocio:
  - Ingresos
  - Anulados
  - Cobrados
  - Comisiones

---

### 2. Dolor Actual (Pain Point)

Los problemas actuales a los que se enfrenta la empresa pueden resumirse de la siguiente forma:

- **Falta de Centralización y Transparencia:**
  - Sin un sistema integrado, consolidar la información en tiempo real y disponer de una visión clara del rendimiento financiero es complejo.

- **Gestión de Estados y Seguimiento del Proceso:**
  - El manejo manual o ineficiente de estados (ingresado, cobrado, anulado) puede generar errores y demoras en la actualización del estatus de cada subasta.

- **Cálculos y Actualización de Comisiones:**
  - La ausencia de automatización en el cálculo de comisiones a partir del monto y del porcentaje establecido puede dar lugar a errores humanos y discrepancias en el registro contable.

- **Informes y Toma de Decisiones:**
  - La falta de un dashboard consolidado impide una interpretación rápida y precisa de la situación financiera y operativa, dificultando la toma de decisiones estratégicas.

---

### 3. Beneficios Esperados

La implementación de las funcionalidades propuestas se espera que aporte los siguientes beneficios:

- **Automatización y Precisión en la Gestión:**
  - **Registro Automatizado:**  
    Minimiza errores manuales al capturar datos de producto, descripción, monto y % de comisión de forma automatizada.
  - **Actualización en Tiempo Real:**  
    La integración de estados (ingresado, cobrado, anulado) permite un seguimiento más preciso del proceso.

- **Transparencia y Control Financiero:**
  - **Cálculo Automático de Comisiones:**  
    Se fortalece el control sobre ingresos y egresos mediante la aplicación automática del porcentaje de comisión.
  - **Dashboard Informativo:**  
    El panel consolidado facilita la visualización de indicadores clave, permitiendo identificar tendencias y anomalías en la operación.

- **Mejora en la Toma de Decisiones:**
  - **Acceso a Datos en Tiempo Real:**  
    Los gestores pueden reaccionar de manera oportuna a cambios en el mercado o detectar errores operativos rápidamente.
  - **Optimización de Procesos Internos:**  
    Estandarizar el flujo de trabajo reduce la dependencia de procesos manuales, permitiendo una redistribución eficiente de los recursos.

- **Incremento en la Confianza de los Usuarios:**
  - **Mejora en la Experiencia de Usuario:**  
    Una interfaz bien estructurada y procesos automatizados generan una experiencia de usuario superior, lo que contribuye a la fidelización y a una reputación positiva para la plataforma.

## Definición del Alcance

### 1. Funcionalidades Core

Las características esenciales para el MVP son las siguientes:

- **Registro de Subastas:**  
  - Formulario web que permita capturar:
    - **Producto:** Nombre o identificador del producto.
    - **Descripción:** Detalle breve del producto.
    - **Monto:** Valor de la subasta.
    - **% de Comisión:** Porcentaje aplicado sobre el monto.
    - **Total de Comisión:** Campo que muestre el total calculado (resultado del monto multiplicado por el % de comisión).

- **Gestión de Estados:**  
  - Asignación de estados a cada subasta:
    - **Ingresado:** Registro recién creado.
    - **Cobrado:** Subasta con comisión ya cobrada.
    - **Anulado:** Subasta cancelada.
  - Actualización manual o automática de estados usando lógica básica en JavaScript.

- **Control de Tiempos:**  
  - Registro de fechas relevantes:
    - `created_at`: Fecha de creación.
    - `update_at`: Fecha de última modificación.
    - `anulado_at`: Fecha en la que la subasta es anulada (cuando corresponda).

- **Dashboard Básico:**  
  - Panel visual interactivo para mostrar indicadores clave:
    - **Ingresos Totales**
    - **Subastas Anuladas**
    - **Subastas Cobradas**
    - **Comisiones Generadas**
  - Visualización y actualización en tiempo real de los datos a través de JavaScript.

- **Interfaz de Usuario:**  
  - Diseño responsivo y moderno utilizando HTML y Tailwind CSS.
  - Experiencia de usuario simple pero efectiva para facilitar la interacción con el sistema.

---

### 2. Restricciones Técnicas

Debido a que se desarrollará un MVP limitado a HTML, CSS, Tailwind CSS y JavaScript, se consideran las siguientes restricciones:

- **Limitaciones Tecnológicas:**
  - **Tecnologías Frontend Únicamente:**  
    No se contempla el desarrollo de backend en esta fase, por lo que se utilizarán métodos de almacenamiento local (por ejemplo, LocalStorage) o simulación de datos para la demostración.
  - **Procesamiento en el Lado del Cliente:**  
    Toda la lógica del cálculo de comisiones, actualización de estados y presentación del dashboard se realizará en el navegador con JavaScript.
  - **Capacidad de Escalado:**  
    Dado el uso exclusivo de tecnologías client-side, el MVP estará limitado a una cantidad reducida de datos y transacciones, siendo ideal para demostraciones y pruebas de concepto.

- **Rendimiento y Optimización:**
  - El código JavaScript debe ser optimizado para evitar cargas excesivas y garantizar una experiencia fluida en navegadores modernos.
  - Uso cuidadoso de Tailwind CSS para mantener el diseño ligero y responsivo.

- **Seguridad y Persistencia:**
  - La seguridad se centrará en evitar vulnerabilidades básicas en el uso de datos locales, ya que no se gestionará información en servidores.
  - La persistencia temporal se basará en el almacenamiento local (LocalStorage o similar), dado el alcance limitado del MVP.

- **Compatibilidad y Mantenimiento:**
  - Asegurar la compatibilidad con los principales navegadores modernos.
  - La modularidad del código JavaScript permitirá futuras migraciones a un entorno con backend conforme el proyecto evolucione.

---

### 3. Entregables Mínimos

Para la versión MVP, se deberán presentar los siguientes entregables:

- **Código Fuente del MVP:**  
  - Archivos HTML, CSS (con Tailwind CSS) y JavaScript organizados y documentados.
  - Código comentado para facilitar la comprensión y futuras ampliaciones.

- **Documentación Básica:**  
  - Especificaciones técnicas y de diseño, incluyendo:
    - Diagrama de flujo de datos.
    - Descripción de la lógica de cálculo y gestión de estados.
    - Guía para la instalación y puesta en marcha del MVP.
  
- **Dashboard Funcional:**  
  - Una interfaz web que permita la creación de subastas y la visualización de indicadores clave (Ingresos, Subastas Anuladas, Subastas Cobradas, Comisiones).
  - Funcionalidades mínimas de filtrado y actualización dinámica de datos mediante JavaScript.

- **Plan de Pruebas Básico:**  
  - Escenarios de testeo para validar la funcionalidad de cada módulo del MVP.
  - Reporte con resultados y observaciones de las pruebas realizadas.

- **Demo Interactiva:**  
  - Una versión demostrable alojada de forma local o en un entorno de pruebas, que permita visualizar y evaluar la funcionalidad básica del sistema.

---

