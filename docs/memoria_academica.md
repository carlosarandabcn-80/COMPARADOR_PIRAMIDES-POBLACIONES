# Demografía aplicada a la Educación Social: diseño, desarrollo y evaluación de una plataforma interactiva para el análisis territorial y la planificación socioeducativa

**Memoria académica preliminar — 26 de octubre de 2026.** Prototipo en rama de desarrollo. **No es un estudio con resultados educativos ni ha sido revisado institucionalmente.**

## 1. Resumen y palabras clave

Se presenta el desarrollo de un laboratorio web que vincula el análisis de pirámides poblacionales con el razonamiento estadístico, la interpretación crítica y el diseño condicionado de actuaciones socioeducativas. La contribución propuesta consiste en organizar una secuencia verificable de observación, formulación de hipótesis, investigación participativa, planificación y evaluación, evitando inferir causas o necesidades sociales a partir de distribuciones demográficas aisladas. El prototipo conserva la aplicación previa, incorpora fórmulas transparentes, conjuntos ficticios identificados, importación de datos, tablas accesibles, casos educativos y exportación de informes. Las pruebas del motor y de flujos clave en Chromium se han ejecutado satisfactoriamente en GitHub Actions. No existen todavía evaluaciones empíricas de aprendizaje, adopción institucional ni conformidad WCAG certificada.

**Palabras clave:** Educación Social; demografía; alfabetización estadística; diagnóstico territorial; tecnología educativa; investigación participativa; pensamiento crítico.

## 2. Introducción

Las pirámides permiten describir composiciones por edad y sexo de una población en un momento. Sin información adicional no permiten determinar pobreza, abandono escolar, discapacidad, aislamiento, expectativas ni funcionamiento de los servicios. El error fundamental que aborda este proyecto es la conversión de correlatos estructurales o patrones gráficos en conclusiones sociales categóricas. La aplicación propone un entorno de aprendizaje donde la pregunta por el significado de un indicador antecede a cualquier propuesta de intervención.

## 3. Justificación y necesidad educativa

Una herramienta con gráficos correctos puede fomentar respuestas equivocadas si interpreta automáticamente envejecimiento como dependencia funcional o base estrecha como emigración forzosa. Para futuros profesionales de Educación Social se requiere entrenamiento en incertidumbre, contraste de fuentes, escucha comunitaria, derechos humanos y evaluación. La visualización debe facilitar observación, pero también **delimitar aquello que no puede afirmarse**.

## 4. Problema de investigación

¿Una secuencia digital de análisis demográfico y razonamiento socioeducativo puede mejorar la competencia para justificar hipótesis y propuestas frente a materiales docentes convencionales? El prototipo no permite aún responder: su desarrollo y sus pruebas técnicas no constituyen evidencia de eficacia pedagógica.

## 5. Estado de la cuestión

El INE proporciona pirámides con datos oficiales y opciones de comparación; Idescat y Eurostat ofrecen fuentes estadísticas para análisis territorial. Estos recursos no se pueden describir como carentes de pedagogía sin una revisión sistemática. La comparación inicial del proyecto se encuentra en el [dosier institucional](dosier_institucional.md), y es **insuficiente para acreditar originalidad científica**.

En educación estadística, Garfield y Ben-Zvi (2008) sintetizan enfoques que conectan investigación sobre razonamiento con secuencias docentes y uso de tecnología. Freeman et al. (2014), en un metaanálisis de 225 estudios universitarios de disciplinas STEM, aportan evidencia sobre aprendizaje activo. Su hallazgo fundamenta la *plausibilidad pedagógica* de metodologías activas; **no demuestra** la eficacia de este laboratorio ni debe extrapolarse sin reservas a Educación Social.

## 6. Marco teórico interdisciplinar

**Demografía:** composición por edades, distribución por sexo de la fuente, cohortes, indicadores de dependencia e índice de envejecimiento, comparaciones territoriales y series temporales.

**Alfabetización estadística:** reconocimiento de denominadores, proporciones, unidades, diferencias en puntos porcentuales, incertidumbre y problemas de calidad de datos. La veracidad de una observación no valida de manera automática una explicación causal.

**Educación Social y desarrollo comunitario:** diagnóstico territorial participativo, acción socioeducativa orientada por derechos, autodeterminación y corresponsabilidad. El nuevo Código Deontológico de la Educación Social de 2026, publicado por el CGCEES, constituye un documento profesional que debe ser revisado de forma íntegra en el diseño definitivo de casos.

**Aprendizaje activo y diseño universal:** actividades exploratorias, decisiones argumentadas, retroalimentación y variedad de medios de representación y expresión. Las directrices DUA 3.0 de CAST (2024) respaldan el diseño inclusivo; WCAG 2.2 es el objetivo técnico de accesibilidad y no un certificado de cumplimiento.

## 7. Objetivo general y objetivos específicos

**General:** desarrollar y preparar la evaluación de un laboratorio digital que ayude a interpretar responsablemente estructuras poblacionales y a fundamentar propuestas de intervención socioeducativa.

**Específicos:** a) construir representaciones comparables con alternativas tabulares; b) implementar indicadores verificables; c) prevenir inferencias causales indebidas; d) articular una secuencia de investigación y diseño; e) proporcionar actividades y rúbrica; f) documentar arquitectura, limitaciones, seguridad y pruebas; g) proponer un estudio piloto reproducible.

## 8. Preguntas e hipótesis

¿Comprenden mejor los estudiantes los indicadores? ¿Reconocen limitaciones causales? ¿Formulan necesidades *por investigar* en lugar de necesidades supuestamente demostradas? ¿Diseñan objetivos e indicadores más coherentes? ¿Pueden usar la interfaz personas con necesidades diversas?

**Hipótesis no contrastada:** el alumnado que utilice el laboratorio mejorará más en una tarea equivalente de razonamiento demográfico-socioeducativo que el alumnado con recursos tradicionales, en condiciones comparables.

## 9. Diseño metodológico del proyecto

Desarrollo iterativo con auditoría estática del recurso existente, identificación de riesgos metodológicos, construcción de un motor de reglas, validación estructural de datos, programación de interfaz, tests de cálculo y smoke E2E con navegador, documentación y formulación de un protocolo de estudio de aprendizaje. Se distinguen **validación de software**, **validez de contenido**, **usabilidad**, **accesibilidad** y **eficacia pedagógica**: ninguna sustituye a las demás.

## 10. Arquitectura tecnológica

El comparador previo cargaba un HTML comprimido en base64/gzip mediante `DecompressionStream` y `document.write`. Su copia legible se conserva en `comparador-original.html`. La nueva portada se organiza con HTML semántico, CSS responsive, un núcleo funcional en `assets/demografia-core.js` y capa de interfaz en `assets/laboratorio.js`. La aplicación es estática, compatible con GitHub Pages y no precisa cuentas, backend ni bibliotecas remotas en tiempo de uso.

## 11. Datos, indicadores y restricciones

Los tres perfiles incluidos son **ficticios**. El usuario puede importar CSV/JSON de 36 registros: 18 tramos de edad por dos sexos H/M, enteros no negativos, combinaciones completas y metadatos declarados. Las comprobaciones estructurales no autentican las fuentes. El diccionario se encuentra en [diccionario_datos.md](diccionario_datos.md).

Se calcula `J = población 0–14`, `A = población 15–64` y `V = población 65+`. La dependencia juvenil es `100·J/A`, la de mayores `100·V/A`, la total `100·(J+V)/A` y el índice de envejecimiento `100·V/J`. Un denominador cero produce «No calculable». **Los indicadores oficiales básicos del INE emplean menores de 16 y 16–64**, de modo que los aquí implementados **no equivalen** a los del INE; los grupos quinquenales no permiten ubicar exactamente a los 15 años sin desagregación. Para detalles, véase [metodología](metodologia_laboratorio.md).

## 12. Modelo de razonamiento socioeducativo

Siete fases concatenadas: (1) observar datos, (2) interpretar magnitudes, (3) proponer hipótesis alternativas, (4) formular cuestiones sobre necesidades por investigar, (5) definir una estrategia de contraste participativa, (6) diseñar actuaciones condicionadas al diagnóstico y (7) evaluar y reflexionar sobre consecuencias y sesgos. Las dos reglas automáticas R-01 y R-02 describen proporciones y diferencias en puntos porcentuales: **no existe un diagnóstico causal automático**.

## 13. Aplicaciones didácticas

Se incorporan seis casos: envejecimiento y participación; infancia y recursos educativos; despoblación rural; transformaciones urbanas; convivencia; diagnóstico participativo. Cada caso contiene contexto, pregunta, error interpretativo, propuesta condicionada y criterio de revisión. La [guía docente](guia_docente.md) incluye una sesión orientativa de 90 minutos y rúbrica original de cinco competencias; esta rúbrica aún no ha sido validada psicométricamente.

## 14. Evaluación técnica realizada

Se añadieron 12 pruebas con `node:test` y un flujo de CI en GitHub Actions. Consta ejecución correcta de pruebas de cálculo, validación, comparación, carga, importación, persistencia, exportación y acceso al comparador original en Chromium. Un análisis axe-core de la vista inicial no informó violaciones en las etiquetas configuradas. Esta evidencia está documentada en el [informe de consultoría](consultoria_final.md) y no equivale a examen exhaustivo de seguridad o accesibilidad.

## 15. Propuesta de validación educativa

Se propone un estudio comparativo pretest/postest con rúbricas sobre tareas equivalentes y, si el contexto lo permite, grupo de comparación. Se prevén indicadores cuantitativos y cualitativos, registro de incidentes y control explícito de sesgos. Es indispensable obtener las autorizaciones pertinentes, justificar muestra, condiciones e instrumentos y cuidar la independencia entre participación y calificación académica. Detalles en el [protocolo de investigación](protocolo_investigacion.md).

## 16. Resultados efectivamente obtenidos

**Resultados técnicos:** arquitectura nueva creada; comparador anterior preservado; pruebas de núcleo y flujos seleccionados superadas en CI; documentación inicial producida. **Resultados académicos o educativos con participantes:** ninguno. **Resultados de valoración por expertos o certificaciones:** ninguno. No procede construir tablas de mejoras de aprendizaje, porcentajes de satisfacción ni hipótesis «confirmadas».

## 17. Discusión crítica

La fortaleza central es hacer visible el límite entre evidencia y juicio profesional. Como limitación, la falta de flujo integrado de datos oficiales reduce la transferibilidad inmediata a diagnósticos de territorios reales. Aun tras importar una tabla, la interfaz no valida cobertura, fiabilidad administrativa ni homogeneidad metodológica. Una ampliación precipitada a simulaciones causales podría agravar, en lugar de reducir, las inferencias indebidas.

## 18. Limitaciones y sesgos

Se reconocen selección de contenidos didácticos, definición de intervalos distinta de algunos indicadores oficiales, comparación temporal/territorial no autenticada, potencial sesgo en casos elegidos y ausencia de resultados empíricos. La interfaz necesita pruebas manuales de WCAG 2.2, dispositivos, lectores de pantalla, validación de expertos y análisis de amenazas. No se presume utilidad generalizable.

## 19. Transferibilidad a otros contextos

El despliegue estático y los datos declarativos facilitan adaptación a cursos, talleres y propuestas de investigación. Para adopción por centros docentes se requieren revisión de fuentes, licencias, formación del profesorado, adaptación lingüística cuando proceda y soporte accesible. El cumplimiento técnico en un navegador no implica adopción institucional.

## 20. Conclusiones

La versión disponible constituye un **prototipo digital verificable parcialmente** y diseñado para evaluar una hipótesis educativa. Sus cálculos y flujos básicos tienen evidencias de prueba; la mejora del aprendizaje, la originalidad científica y la acreditación universitaria permanecen **sin demostrar**. El valor de la propuesta debe juzgarse por claridad conceptual y potencial de investigación, no por la acumulación de funcionalidades.

## 21. Referencias verificadas (APA 7)

CAST. (2024). *CAST Universal Design for Learning Guidelines version 3.0*. https://udlguidelines.cast.org/

Consejo General de Colegios de Educadoras y Educadores Sociales. (2026). *Código deontológico de la Educación Social*. https://www.consejoeducacionsocial.net/

Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H., & Wenderoth, M. P. (2014). Active learning increases student performance in science, engineering, and mathematics. *Proceedings of the National Academy of Sciences, 111*(23), 8410–8415. https://doi.org/10.1073/pnas.1319030111

Garfield, J. B., & Ben-Zvi, D. (2008). *Developing students’ statistical reasoning: Connecting research and teaching practice*. Springer. https://doi.org/10.1007/978-1-4020-8383-9

Instituto Nacional de Estadística. (s. f.). *Indicadores demográficos básicos: metodología*. https://www.ine.es/metodologia/t20/metodologia_idb.pdf

Instituto Nacional de Estadística. (s. f.). *Pirámide de población en España*. https://www.ine.es/aplicaciones/piramides/piramides.htm

World Wide Web Consortium. (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

La bibliografía constituye un conjunto **selectivo**, no una revisión sistemática. Antes de su presentación definitiva se revisarán metadatos editoriales y guías APA institucionales.

## 22. Anexos técnicos y metodológicos

- [Auditoría inicial](auditoria_inicial.md)
- [Metodología y fórmulas](metodologia_laboratorio.md)
- [Diccionario de datos](diccionario_datos.md)
- [Guía docente y rúbrica](guia_docente.md)
- [Protocolo de investigación](protocolo_investigacion.md)
- [Consultoría final](consultoria_final.md)
- [Estado de validación](estado_validacion.md)
- [Dosier institucional](dosier_institucional.md)

**Criterio de rigor:** la memoria no debe presentarse como investigación concluida ni como recurso reconocido por UNIR mientras esas afirmaciones no puedan demostrarse.
