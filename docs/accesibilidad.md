# Accesibilidad DemoLab 2.0.1

Objetivo WCAG 2.2 AA; sin declaración de conformidad integral. La interfaz incluye enlace de salto, regiones y encabezados, etiquetas de controles, foco visible, mensajes de estado, tablas de población, selección sin ratón, reducción de movimiento y ajustes visuales. Los contornos de comparación incorporan una diferencia de trazo, no solo color.

Resultados ejecutados: reflujo de siete secciones a 320, 768 y 1280 píxeles; cierre del panel con Escape y devolución de foco; consulta de controles en el árbol accesible; salto inicial con teclado hasta el selector A. Axe-core 4.10.3 no informó infracciones en los estados finales examinados con etiquetas A/AA hasta WCAG 2.2. Devolvió comprobaciones incompletas, sobre todo contraste en gráficos y una revisión ARIA en Aprender. Véase docs/research/browser-results.json.

Se corrigieron un desbordamiento de enlaces largos y una transición de opacidad que reducía temporalmente el contraste. No se afirma que todo criterio aplicable esté verificado. Faltan lectores de pantalla, recorrido completo con teclado, estados de error, zoom al 200 %, dispositivos físicos y pruebas con usuarios. La impresión PDF no garantiza etiquetado accesible.

La guía docente propone formatos de tabla y texto, medios alternativos de entrega y ajustes del tiempo. Los controles adicionales no sustituyen una base semántica o evaluación de acceso. La voz depende del sistema y no se ha certificado su disponibilidad o procesamiento local.

## Ampliación de la revisión

La evaluación inicial ampliada reprodujo seis barreras y registró doce comprobaciones favorables. Se corrigieron pérdida de foco en selección y carga de casos, texto grande sin efecto sobre rem, bordes con contraste 1,92:1, barras atenuadas con 1,34:1 y borrado sin confirmación. El contenedor de casos se identifica como grupo.

La versión corregida supera 21 comprobaciones en tests/accessibility.html. Incluye estados expandidos, formularios, diálogo, cancelación y borrado acotado, siete rutas con espaciado WCAG a 320 px y texto ampliado al 200 % mediante CSS. Este último control no es zoom real del navegador. Los bordes alcanzan 4,42:1 contra blanco y las barras al menos 4,57:1. Se midieron también 244 apariciones de nodos que axe dejó para revisar contraste, con mínimo 4,86:1 en esa muestra. Las mediciones no reproducen el suavizado ni pantallas físicas.

Recorridos de teclado real: diez primeros controles, panel, cambio de territorio con flechas, selección de caso y diálogo con Escape y devolución de foco. Se conservan resultados anteriores/posteriores y registro de teclado en docs/research. La exposición del árbol accesible no se presenta como sesión con lector de pantalla.

La matriz de 55 criterios y los límites se entregan en docs/academico/07_revision_contenido_y_accesibilidad.md. Los resultados históricos de 2.0.0 se conservan; no deben confundirse con las pruebas adicionales de 2.0.1. No existe declaración de conformidad integral.
