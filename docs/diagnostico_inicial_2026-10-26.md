# Diagnóstico técnico y científico inicial · 26-10-2026

**Estado:** revisión parcial del repositorio; no constituye certificación, evaluación con usuarios ni auditoría exhaustiva de la aplicación desplegada.

## Evidencias inspeccionadas
- `index.html`: cargador que solicita `payload/index.html.gz.b64`, decodifica Base64, descomprime con `DecompressionStream('gzip')` y sustituye el documento mediante `document.write`.
- `sw.js`: service worker de caché, modificado en la rama de desarrollo.
- `README.md`, `metadata.json`, `docs/logica_metodologica.md` y `docs/control_interactividad.md`.
- Archivo comprimido localizado; **su lógica interna no se ha revisado ni probado íntegramente** en esta fase.

## Hallazgos y estado de confianza
| ID | Hallazgo | Evidencia | Prioridad | Estado |
| --- | --- | --- | --- | --- |
| T-01 | El service worker anterior devolvía `index.html` como alternativa ante el fallo de cualquier recurso, aunque no fuese una navegación. Ello podía producir errores de parseo y ocultar la causa real. | Inspección del código original de `sw.js`. | Alta | Corregido en rama; sin prueba E2E |
| T-02 | El paquete comprimido no figuraba entre los recursos precargados en la instalación del service worker; por tanto, la disponibilidad offline inicial no quedaba garantizada. | Comparación de `CORE_ASSETS` y `index.html`. | Alta | Corregido en rama; sin prueba en navegador |
| T-03 | El código real de la aplicación se distribuye dentro de un HTML empaquetado y comprimido; dificulta la inspección y el mantenimiento de la lógica y la accesibilidad. | Cargador `index.html` y archivo `payload/index.html.gz.b64`. | Alta | Pendiente: separar fuentes auditables y proceso de compilación reproducible |
| T-04 | Los modelos del README son **sintéticos**; no pueden describirse como datos territoriales oficiales. | Sección «Uso responsable» del README. | Crítica para la validez científica | Etiquetado declarado; comprobar todas las pantallas y exportaciones |
| T-05 | La documentación menciona indicadores y explicaciones socioeducativas, pero eso no demuestra ni su exactitud numérica ni su validez interpretativa. | README y documentación metodológica. | Alta | Pendiente de pruebas |
| T-06 | Se anuncia accesibilidad funcional, pero no consta en los documentos inspeccionados una matriz de conformidad WCAG 2.2 AA ni pruebas manuales documentadas. | README y documentación. | Alta | Pendiente de auditoría |
| T-07 | La página utiliza `document.write` tras la carga asíncrona: patrón que aumenta complejidad del ciclo de vida y perjudica mantenibilidad y análisis estático. | `index.html`. | Media | Pendiente de refactorización controlada |

## Requisitos metodológicos obligatorios
1. Diferenciar **datos observados, sintéticos, simulados y proyectados** mediante etiquetas persistentes también en exportaciones.
2. Presentar numerador, denominador, fórmula, unidad, grupos de edad y fuente de cada indicador.
3. En dependencia juvenil (0–14 / 15–64) y de mayores (65+ / 15–64), hacer explícito que se trata de razones **demográficas**, no de discapacidad ni dependencia funcional. Si se usan otros intervalos, identificarlos y no mezclar definiciones.
4. Envejecimiento: definir explícitamente si se utiliza (65+ / 0–14) × 100; comprobar que el denominador no sea cero.
5. Restringir comparaciones a definiciones, intervalos y fechas compatibles; cuando no lo sean, explicar la limitación.
6. Construir interpretaciones como reglas trazables, separando **observación → interpretación → hipótesis → información necesaria → propuesta condicionada → evaluación → crítica**.
7. Jamás inferir de un perfil por edades la existencia de soledad, pobreza, exclusión o necesidades concretas sin evidencia adicional.

## Matriz mínima de aceptación verificable
| Caso | Entrada / actuación | Resultado exigido |
| --- | --- | --- |
| D-01 | Total de efectivos por sexo y edad | Coincide con la suma de celdas sin redondeos intermedios |
| D-02 | Total de población 15–64 = 0 | No se muestra Infinity/NaN: resultado no calculable y explicación |
| D-03 | Población 0–14 = 0 | Índice de envejecimiento no calculable o convención expresamente declarada |
| D-04 | Valores negativos, NaN, texto | Rechazo validado antes de calcular |
| D-05 | Dos pirámides de población total diferente | Comparación normalizada con denominadores explícitos |
| I-01 | Pirámide con predominio de 65+ | Nunca se afirma por sí sola dependencia funcional ni necesidad de residencia |
| I-02 | Modelo sintético en pantalla/exportación | Etiqueta visible «datos sintéticos» |
| A-01 | Solo teclado y lector de pantalla | Todas las acciones disponibles; alternativas tabulares de los gráficos |
| S-01 | Fallo de red al solicitar recurso no HTML | Respuesta de error correcta; no se devuelve HTML con tipo de contenido incompatible |
| S-02 | Instalación en línea y posterior desconexión | El paquete principal sigue disponible offline, sujeto a prueba real |
| E-01 | Cambio territorial o temporal | Gráfico, indicadores, interpretación e informe se actualizan coherentemente |

## Siguiente fase antes de afirmar calidad acreditada
- Extraer a código fuente versionado el HTML/JS comprimido; identificar funciones puras de cálculo y reglas interpretativas.
- Añadir pruebas unitarias con casos de referencia independientes y E2E con navegador real.
- Verificar datos oficiales, permisos de reutilización y metadatos por territorio y año.
- Aplicar WCAG 2.2 AA con comprobación automática **y** evaluación manual.
- Crear casos didácticos con rúbricas, pretest/postest, consentimiento y protocolo de evaluación.
- Solo después preparar una memoria de resultados efectivos y la candidatura universitaria.

**Límite de esta fase:** inspección estática de archivos seleccionados y corrección del service worker en una rama no publicada. No se ha comprobado el comportamiento real del nuevo service worker ni se han calculado métricas de accesibilidad, seguridad o aprendizaje.
