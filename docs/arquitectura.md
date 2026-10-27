# Arquitectura del laboratorio

DemoLab 2.0.0 es una aplicación estática compatible con GitHub Pages. No necesita servidor de aplicación, claves ni base de datos. La rama de desarrollo se conserva separada de main hasta revisión.

## Sustitución del cargador

La versión anterior dependía de fetch, Base64, DecompressionStream y document.write para ejecutar un único HTML comprimido. Se sustituye por HTML semántico, CSS y módulos ES legibles. El recurso de payload permanece como evidencia recuperable; ya no se ejecuta. La etiqueta base-auditada-20261027 permite volver a la revisión original. Los trece perfiles se conservan como formas normalizadas, con atribución y nombres didácticos, sin las atribuciones causales anteriores.

## Responsabilidades

- src/core.js: contrato de datos, ocho indicadores, comparación, tres reglas y escenario quinquenal. No utiliza DOM, red o almacenamiento.
- src/io.js: CSV y JSON, validación, protección de fórmulas de hojas de cálculo y errores de persistencia.
- src/learning.js: seis casos, cinco ejercicios formativos, once campos de planificación y referencias.
- src/app.js: interfaz, SVG, tablas, navegación, voz, cuaderno y exportación. Escapa el texto externo antes de incorporarlo al HTML.
- scripts/build-data.mjs: transforma la respuesta oficial, verifica totales por sexo y calcula su SHA-256.
- tests: pruebas unitarias y un ejecutor de integración en navegador con axe-core como dependencia exclusiva de desarrollo.

El flujo es fuente conservada → recuentos validados → indicadores → reglas trazables → hipótesis y trabajo del usuario → informe. Gráfico, tabla y cálculo parten de los mismos datos. Se redondea al presentar, no al calcular diferencias.

## Persistencia y privacidad

La clave demolab-v2 guarda versión, selecciones, cuaderno, casos, ejercicios y conjuntos importados. Se toleran almacenamiento bloqueado y JSON corrupto. El cuaderno conserva el conjunto de origen y advierte si cambia A. La aplicación no recoge participantes, no incluye analítica y no transmite respuestas. No deben escribirse nombres o datos sensibles en los campos libres. El navegador compartido y los archivos exportados requieren cuidado.

La lectura en voz alta utiliza el servicio del navegador o sistema operativo. La aplicación no controla si ese proveedor procesa voz mediante servicios remotos; debe revisarse en dispositivos con requisitos institucionales de privacidad.

## Red y recuperación

La sesión descarga archivos del mismo sitio. Las fuentes externas son enlaces voluntarios, no consultas automáticas. Las instantáneas evitan dependencia de CORS, disponibilidad o cambios de la API. No equivalen a actualización automática. Para actualizar: conservar nueva respuesta, revisar metadatos, regenerar y repetir pruebas.

sw.js migra las dos cachés históricas identificadas y se desregistra. No borra otras cachés del origen. No se declara funcionamiento sin conexión ni una PWA completa. Usuarios con la versión antigua pueden necesitar recargar después de la migración.

## Exportación y límites

TXT contiene el comentario; CSV, datos y metadatos; JSON, análisis y parámetros; HTML, informe autónomo con gráficos y fuentes. PDF utiliza la impresión del navegador. No se garantiza PDF etiquetado ni idéntica paginación entre motores.

El motor no es un sistema experto de diagnóstico. Las tres reglas muestran siete pasos sin umbrales clínicos ni decisiones de asignación. Los datos municipales requieren importación preparada. El escenario es una transición didáctica, no una proyección. No hay IA generativa, autenticación o recogida automática para investigación.
