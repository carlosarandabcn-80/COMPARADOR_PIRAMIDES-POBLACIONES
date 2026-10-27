# Revisión del contenido y evaluación ampliada de accesibilidad

DemoLab 2.0.1 · 27 de octubre de 2026 · Suplemento a la entrega 2.0.0

## Alcance y naturaleza del dictamen

Se ha realizado una revisión técnica asistida por IA del cálculo, la procedencia, el razonamiento socioeducativo y los instrumentos, junto con nuevas pruebas de acceso. No han intervenido profesionales externos identificados ni se ha constituido un panel académico. Este documento no se firma en nombre de una profesión o institución. El resultado permite revisar una implementación y detectar defectos; no equivale a validación experta externa ni a certificación WCAG.

El piloto real se ha omitido por instrucción del promotor y se sustituye por un ensayo sintético documentado por separado. No se han recogido opiniones ni resultados de estudiantes, especialistas o personas con discapacidad.

## Revisión científica y socioeducativa

| Dimensión | Evidencia revisada | Conclusión y límite |
| --- | --- | --- |
| Procedencia | Raw Eurostat, dimensiones, metadatos y fechas | 144 celdas quinquenales por sexo contrastadas por una extracción independiente de la usada para construir los datos |
| Cálculo | Ocho indicadores, denominadores y comparación | 79 pruebas pasan; incluye cien distribuciones para invariancia de escala, intercambio de sexo, antisimetría y conservación de escenarios |
| Definiciones | 0-14, 15-64, 65+, sexo estadístico y 85+ | Límites de edad explícitos; ni población ocupada, dependencia funcional ni identidad de género se infieren de esas categorías |
| Inferencias | Tres reglas y seis casos completos | Las propuestas quedan condicionadas a contraste y participación; no hay diagnóstico automático de necesidades |
| Escenarios | Supervivencia uniforme, nacimientos y entradas | Modelo didáctico reproducible; sin calibración ni pronóstico válido |
| Enseñanza | Cinco preguntas y rúbrica de cinco competencias | Claves aritméticas comprobadas; no hay evidencia psicométrica ni ganancia de aprendizaje |
| Investigación | Formas A/B, tarea de transferencia y pérdidas | Procedimiento ensayable; deben concretarse anclajes y evitar confundir datos ausentes con cero |
| Ética | Casos de infancia, ruralidad, diversidad y participación | Formulación evita estereotipos y reclama voz comunitaria; no sustituye juicio profesional |

Las comprobaciones con cien distribuciones son datos de ensayo de software, no una muestra educativa. Las nuevas nueve pruebas se añaden a las setenta previas; los ciclos internos de cada prueba no se presentan como participantes ni como centenares de pruebas independientes.

## Defectos detectados y correcciones

La evaluación ampliada inicial tuvo doce comprobaciones correctas y seis fallidas. Se conservaron los resultados anteriores y posteriores. La versión 2.0.1 corrige los siguientes problemas observados:

| Problema reproducido | Corrección | Comprobación |
| --- | --- | --- |
| Foco perdido al elegir un caso | Restauración en el botón del caso seleccionado | Foco conserva el identificador del caso |
| Foco perdido al cargar datos de un caso | Restauración en el activador reconstruido | Foco vuelve a load-case-data |
| Texto grande no ampliaba textos en rem | Ampliación en la raíz del documento | Introducción pasa de 14,40 a 17,28 px, un 20 % |
| Borde de controles con contraste 1,92:1 | Borde más oscuro | Contraste calculado 4,42:1 contra blanco |
| Barras atenuadas con contraste 1,34:1 | Color gris oscuro y trazo, sin transparencia | Mínimo medido >=4,57:1 contra blanco |
| Borrado inmediato del cuaderno | Diálogo con cancelar por defecto y confirmación explícita | Cancelación, eliminación acotada y devolución de foco |

También se identificó el contenedor de casos con role=group, resolviendo la comprobación ARIA que axe dejaba incompleta. La modificación del contraste se aplica asimismo al informe HTML exportado. No se han cambiado las fórmulas demográficas ni la fuente de datos.

## Evidencia de acceso y limitaciones

La regresión final pasa 79 pruebas de cálculo y validación, 22 de integración en navegador y 21 de acceso ampliado. Son comprobaciones distintas y no se suman como si midieran aprendizaje. Las comprobaciones ampliadas cubren las siete rutas, formularios, mensajes, tablas, estados expandidos, resultados, diálogo, reducción de movimiento, reflujo a 320 px y espaciado prescrito. Se prueba además aumento del texto al 200 % mediante CSS; este procedimiento no se presenta como zoom real del navegador. Los resultados JSON acompañan el informe.

Axe-core 4.10.3 no detectó infracciones en los estados examinados. Las comprobaciones incompletas se conservaron en el registro. La medición adicional resuelve 244 apariciones de nodos que axe dejó pendientes de contraste, con un mínimo calculado de 4,86:1 en esa muestra. El registro conserva selectores y medidas. Usa colores calculados del navegador y compone fondos transparentes de los ancestros; no reproduce suavizado, pantallas físicas o preferencias de un lector. Las verificaciones que requieren tecnologías de apoyo o percepción de usuarios siguen identificadas como parciales.

El recorrido con teclas reales comprobó el orden inicial de diez enlaces/controles, activación de contraste, cierre con Escape y devolución de foco, cambio de territorio con flechas y selección del segundo caso. En el diálogo se registraron Tab y Escape; el foco volvió al activador al cancelar. Es un recorrido seleccionado, no toda combinación posible.

El entorno fue el navegador integrado de Codex sobre Windows. No se ha realizado una matriz Chrome/Firefox/Safari, pruebas en móviles físicos, una sesión con NVDA/JAWS/VoiceOver ni pruebas con personas. La exposición del árbol accesible no demuestra cómo se anuncia una interacción con un lector. La impresión y los PDF académicos no han pasado una auditoría de PDF etiquetado; para lectura estructurada se entregan también Markdown y HTML.

## Matriz completa de criterios A y AA

Se enumeran los 55 criterios vigentes A/AA de WCAG 2.2, según la recomendación W3C de 12 de diciembre de 2024. 4.1.1 figura en la página por razones históricas como obsoleto y eliminado; no se computa. Los nombres se conservan en inglés para identificar sin ambigüedad la norma. Fuente: https://www.w3.org/TR/WCAG22/

“Acotado” significa que la comprobación descrita fue favorable dentro del alcance; no es una declaración de conformidad del criterio en toda plataforma. “Parcial” identifica evidencia disponible y trabajo pendiente. “No aplica” expresa una justificación para la versión examinada, que debe revisarse si se añade la función.

Resumen de cobertura: 17 acotados, 21 parciales, 17 no aplicables y 0 sin verificar. No se calcula un porcentaje de conformidad a partir de estos estados.

| ID | Criterio | Estado | Evidencia y límite |
| --- | --- | --- | --- |
| 1.1.1 (A) | Non-text Content | Parcial | Gráficos con título, descripción y tablas; lectura real con AT pendiente. |
| 1.2.1 (A) | Audio-only and Video-only (Prerecorded) | No aplica | No hay audio/vídeo pregrabado. |
| 1.2.2 (A) | Captions (Prerecorded) | No aplica | No hay vídeo con audio. |
| 1.2.3 (A) | Audio Description or Media Alternative (Prerecorded) | No aplica | No hay contenido audiovisual pregrabado. |
| 1.2.4 (AA) | Captions (Live) | No aplica | No hay medios en directo. |
| 1.2.5 (AA) | Audio Description (Prerecorded) | No aplica | No hay vídeo pregrabado. |
| 1.3.1 (A) | Info and Relationships | Parcial | Tablas y grupos semánticos comprobados; AT pendiente. |
| 1.3.2 (A) | Meaningful Sequence | Acotado | Orden de lectura y DOM inspeccionados en las siete rutas. |
| 1.3.3 (A) | Sensory Characteristics | Acotado | Instrucciones por nombre, sin depender solo de posición o color. |
| 1.3.4 (AA) | Orientation | Parcial | Sin bloqueo de orientación en código; dispositivo físico pendiente. |
| 1.3.5 (AA) | Identify Input Purpose | No aplica | No se solicitan datos personales con propósitos enumerados. |
| 1.4.1 (A) | Use of Color | Acotado | Sexos por posición y etiquetas; B también por trazo discontinuo. |
| 1.4.2 (A) | Audio Control | No aplica | No hay audio automático; la voz se inicia por petición. |
| 1.4.3 (AA) | Contrast (Minimum) | Parcial | Paleta y nodos incompletos de axe medidos; combinaciones de plataforma pendientes. |
| 1.4.4 (AA) | Resize Text | Parcial | Texto 200 % y ajuste rem comprobados; zoom de navegador pendiente. |
| 1.4.5 (AA) | Images of Text | No aplica | No hay texto informativo presentado como imagen en la interfaz examinada. |
| 1.4.10 (AA) | Reflow | Parcial | 320 px sin desbordamiento de página; tablas desplazan en región propia. Zoom real/dispositivo pendiente. |
| 1.4.11 (AA) | Non-text Contrast | Parcial | Bordes 4,42:1 y barras >=4,57:1; representación del sistema pendiente. |
| 1.4.12 (AA) | Text Spacing | Acotado | Siete rutas a 320 px con espaciado prescrito sin desbordamiento de página. |
| 1.4.13 (AA) | Content on Hover or Focus | No aplica | No hay ventanas emergentes propias por hover; títulos nativos del navegador. |
| 2.1.1 (A) | Keyboard | Parcial | Controles nativos y recorridos específicos; todas las combinaciones de AT pendientes. |
| 2.1.2 (A) | No Keyboard Trap | Parcial | Diálogo nativo y panel comprobados; recorrido con AT pendiente. |
| 2.1.4 (A) | Character Key Shortcuts | No aplica | No se implementan atajos de carácter único. |
| 2.2.1 (A) | Timing Adjustable | No aplica | No hay tiempo límite para responder. |
| 2.2.2 (A) | Pause, Stop, Hide | Acotado | Pausa disponible; reducción de movimiento impide animación. |
| 2.3.1 (A) | Three Flashes or Below Threshold | Acotado | Inspección: sin destellos; transición de cuatro píxeles sin flashes. |
| 2.4.1 (A) | Bypass Blocks | Acotado | Enlace de salto operativo; foco principal comprobado. |
| 2.4.2 (A) | Page Titled | Acotado | Título identifica el laboratorio. |
| 2.4.3 (A) | Focus Order | Parcial | Foco en rutas, casos y diálogo comprobado; recorrido total pendiente. |
| 2.4.4 (A) | Link Purpose (In Context) | Parcial | Enlaces contextualizados inspeccionados; experiencia de lectura pendiente. |
| 2.4.5 (AA) | Multiple Ways | Parcial | SPA con navegación persistente y enlaces contextuales; aplicabilidad requiere evaluación formal. |
| 2.4.6 (AA) | Headings and Labels | Acotado | Encabezados, leyendas y etiquetas de controles examinados. |
| 2.4.7 (AA) | Focus Visible | Parcial | Outline 3 px; muestra visual con teclado. Otros modos de sistema pendientes. |
| 2.4.11 (AA) | Focus Not Obscured (Minimum) | Parcial | Foco comprobado en estados seleccionados; matrices completas de zoom/AT pendientes. |
| 2.5.1 (A) | Pointer Gestures | No aplica | No se requieren gestos multipunto o trayectorias. |
| 2.5.2 (A) | Pointer Cancellation | Acotado | Acciones se activan con click, no en pointerdown; botones nativos. |
| 2.5.3 (A) | Label in Name | Acotado | Controles examinados con nombre que contiene su etiqueta visible. |
| 2.5.4 (A) | Motion Actuation | No aplica | No se exige movimiento del dispositivo. |
| 2.5.7 (AA) | Dragging Movements | No aplica | No se requiere arrastrar. |
| 2.5.8 (AA) | Target Size (Minimum) | Parcial | Botones generales >=44 px; enlaces en línea con excepciones. Verificación completa de áreas y plataformas pendiente. |
| 3.1.1 (A) | Language of Page | Acotado | html lang=es verificado. |
| 3.1.2 (AA) | Language of Parts | Parcial | Referencias contienen títulos en inglés; revisar marcado de idioma por fragmento. |
| 3.2.1 (A) | On Focus | Acotado | Recibir foco no cambia contexto ni envía respuestas. |
| 3.2.2 (A) | On Input | Parcial | Selecciones actualizan análisis sin navegar; cambios dinámicos requieren prueba con AT. |
| 3.2.3 (AA) | Consistent Navigation | Acotado | Misma navegación en las siete secciones. |
| 3.2.4 (AA) | Consistent Identification | Acotado | Identificación consistente de acciones repetidas. |
| 3.2.6 (A) | Consistent Help | No aplica | No hay mecanismo de ayuda repetido del tipo descrito. |
| 3.3.1 (A) | Error Identification | Parcial | Campos inválidos y errores de importación identificados; anuncio AT pendiente. |
| 3.3.2 (A) | Labels or Instructions | Acotado | Campos y unidades explícitos; límites de importación indicados. |
| 3.3.3 (AA) | Error Suggestion | Parcial | Mensajes indican límites y grupos esperados; comprensión con usuarios pendiente. |
| 3.3.4 (AA) | Error Prevention (Legal, Financial, Data) | Acotado | Confirmación de borrado; cancelación y foco comprobados. |
| 3.3.7 (A) | Redundant Entry | No aplica | No hay flujo que exija volver a introducir información ya dada. |
| 3.3.8 (AA) | Accessible Authentication (Minimum) | No aplica | No hay autenticación. |
| 4.1.2 (A) | Name, Role, Value | Parcial | Axe sin infracciones y grupo de casos corregido; compatibilidad AT pendiente. |
| 4.1.3 (AA) | Status Messages | Parcial | Regiones vivas comprobadas en DOM; anuncio real pendiente. |

## Decisión de revisión

La versión corregida queda preparada para demostración técnica y revisión de contenidos, con evidencia más amplia que la primera entrega. No procede declarar revisión experta externa completada, accesibilidad integral o eficacia educativa. El ensayo sintético permite comprobar análisis y tratamiento de ausencias, sin resolver esos tres aspectos.

Para un dictamen externo, el expediente debe registrar nombre y experiencia real de quien revisa, fecha, conflicto de intereses, criterio, evidencia, observación, cambio solicitado y decisión. No se generan firmas, valoraciones profesionales ficticias ni índices de acuerdo inventados. Cualquier uso institucional deberá decidir sus condiciones a partir de la revisión real que acuerde.

## Referencias de evaluación

World Wide Web Consortium. (2024). Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/

World Wide Web Consortium, Web Accessibility Initiative. (s. f.). Easy Checks - A First Review of Web Accessibility. https://www.w3.org/WAI/test-evaluate/preliminary/

World Wide Web Consortium, Web Accessibility Initiative. (s. f.). Conformance Evaluation and Reports. https://www.w3.org/WAI/test-evaluate/conformance/
