# Dictamen de consultoría técnica y académica · Versión de desarrollo 2026-10-28

## Alcance y trazabilidad
Aplicación: Laboratorio de demografía aplicada a la Educación Social.
Base revisada: comparador clásico con cargador HTML comprimido, servicio sin conexión y documentos.
Evolución: nueva aplicación modular en index.html; sistema clásico preservado en /clasico.html.
Se han examinado el código nuevo y las pruebas de automatización. Las pruebas automáticas han sido ejecutadas por GitHub Actions en entornos de Node 22 y Chromium, con resultados correctos en las ejecuciones de la rama consultadas al elaborar este dictamen. El registro completo de GitHub Actions es la evidencia reproducible; una ejecución posterior puede tener otro resultado y debe revisarse en el commit publicado.

## Hallazgos con corrección implementada
| ID | Problema | Acción | Evidencia |
|---|---|---|---|
| T-01 | Caché antigua devolvía HTML para fallos en ficheros no HTML | Se elimina respuesta fallback indebida salvo navegación | diff sw.js |
| T-02 | Paquete legado no precargado | Se incluye paquete histórico y módulos actuales en caché | sw.js, instalación del worker |
| T-03 | Lógica comprimida opaca | Se preserva legado y se crea núcleo nuevo sin dependencias separado de UI | lab/core.mjs, lab/main.mjs |
| D-01 | Riesgo de dividir por cero | Las razones devuelven null y UI explica «No calculable» | tests/core.test.mjs |
| D-02 | Datos importados de procedencia incierta | Se exige estructura, valores enteros no negativos y etiquetado «aportados» | parseCSV/parseJSON |
| D-03 | Confundir muestra sintética y datos observados | Se bloquean comparaciones cuantitativas mixtas | comparable(), test E2E |
| D-04 | Falta de trazabilidad interpretativa | Reglas R01–R04 en formato observación, hipótesis, fuentes necesarias y límites | trace(), interfaz e informe |
| P-01 | Modelo sin medición educativa | Guía docente, rúbrica y protocolo de estudio piloto | docs/guia_docente.md, docs/protocolo_piloto.md |

## Pruebas implementadas y ejecutadas
- Unitarias: 10 pruebas de núcleo, con resultados conocidos, denominadores cero, cohortes incompatibles, importación CSV/JSON, conjuntos sintéticos, matriz JSON-stat de Eurostat y corrección de casos.
- Navegador: 4 pruebas Playwright de carga, pirámides, tablas, cambios de escala, comparación, fichas persistidas, importación local, bloqueo de comparaciones incorrectas y análisis automático con axe-core de criterios WCAG etiquetados.
- CI: verificación de sintaxis, existencia de recursos, pruebas de núcleo y Chromium en la rama. Consultar el estado del commit exacto en la pestaña Actions antes de declararlo satisfactorio.
- No se ha demostrado cobertura exhaustiva de líneas ni todos los estados posibles de cada componente.

## Datos y cálculos
Las fórmulas se fijan de modo explícito: juvenil (0–14 / 15–64) × 100; mayores (65+ / 15–64) × 100; dependencia total ((0–14 + 65+) / 15–64) × 100; envejecimiento (65+ / 0–14) × 100. Las sumas de efectivos se realizan sin redondear; los cocientes se redondean únicamente para mostrarlos. Una cohorte es un grupo de edades, no un diagnóstico de derechos, bienestar o dependencia funcional.

Se implementa un conector a Eurostat demo_pjan con validación del resultado JSON-stat. **Comprobación complementaria**: el 28-10-2026 se ejecutó una petición real a Eurostat (España, 2025; HTTP 200) y la normalización de grupos quinquenales obtuvo 49.128.297 personas, con fecha de actualización comunicada por el servicio 25-09-2026. Ver evidencia CI: https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/40667789782. Esta comprobación de un país y año no garantiza continuidad de servicio ni calidad de todas las series. No se han integrado aún datos del INE ni Idescat en el producto.

## Accesibilidad
Existe navegación semántica con salto al contenido, etiquetas, foco visible, reflujo, contraste previsto, preferencia de movimiento reducido, títulos y alternativas tabulares. La ejecución automatizada de axe-core en Chromium forma parte de CI. **Esta comprobación no certifica WCAG 2.2 AA**: quedan pendientes comprobaciones manuales en múltiples resoluciones, Zoom 200/400 %, funcionamiento con teclado en todo el flujo, VoiceOver/NVDA, lectura y contraste del comparador clásico y manejo de dispositivos táctiles.

## Ciberseguridad y protección de datos
No se usa backend nuevo ni almacenamiento remoto de fichas. El código nuevo no introduce analítica ni librerías remotas en producción; las consultas voluntarias a Eurostat son una excepción identificada. Los metadatos procedentes de importación se muestran mediante textContent o escapan caracteres HTML. Persistencia exclusivamente local con advertencia sobre dispositivos compartidos. Faltan, para una declaración de seguridad sólida, análisis de dependencias de pruebas, escáner de cabeceras HTTP de GitHub Pages, política CSP adecuada, pruebas de robustez del legado y revisión independiente.

## Matriz de autovaloración (sin puntuación ficticia)
| Dimensión (peso propuesto) | Evidencia verificable | Restricción para puntuar |
|---|---|---|
| Rigor científico (20 %) | Fórmulas, validaciones y tests | Falta contraste de estadísticas reales y revisión externa |
| Valor socioeducativo (20 %) | Motor de reglas y ficha participativa | Falta revisión experta y usuarios |
| Innovación (15 %) | Integración de razonamiento y representación | Falta matriz comparativa sistemática |
| Calidad técnica (15 %) | Código modular, CI y pruebas navegador | Pruebas E2E no exhaustivas, legado sin auditar |
| Utilidad didáctica (10 %) | Casos, guías, retroalimentación | No hay resultados de aprendizaje |
| Accesibilidad (10 %) | axe + diseño semántico | Evaluación manual pendiente |
| Reproducibilidad (5 %) | Tests y código versionado | Datos reales API pendientes de captura versionada |
| Transferencia (5 %) | Dosier y protocolo piloto | Sin adopción institucional |

No se asigna puntuación global por carecer de evidencias suficientes para todas las dimensiones. Los porcentajes son internos, no criterios UNIR.

## Dictamen
**Prototipo funcional con verificación automatizada parcial y documentación académica preliminar.** No es una herramienta validada científicamente. La posible transferencia a la enseñanza universitaria requiere revisión metodológica independiente, comprobaciones manuales de accesibilidad, evaluación con estudiantes y autorización institucional cuando corresponda.

### Riesgos prioritarios aún abiertos
1. Ampliar la comprobación de Eurostat (distintos países/años, banderas de calidad) y validar su funcionamiento en navegadores reales; existe una prueba satisfactoria desde Node para España 2025.
2. Revisión manual WCAG AA y comparador clásico.
3. Validación por expertos de reglas de razonamiento y adecuación profesional.
4. Estudios de usabilidad e impacto educativo antes de afirmar eficacia.
5. Extensión a evolución temporal, simulación formal y exportación PDF documental específica cuando exista justificación científica.
