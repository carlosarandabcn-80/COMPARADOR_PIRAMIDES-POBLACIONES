# Demografía aplicada a la Educación Social: diseño, desarrollo y evaluación de una plataforma interactiva para el análisis territorial y la planificación socioeducativa

Memoria de desarrollo e innovación educativa · DemoLab 2.0.0 · 27 de octubre de 2026

## 1 Resumen y palabras clave

Se presenta el diseño y desarrollo de un laboratorio web para relacionar análisis demográfico, razonamiento crítico y planificación socioeducativa. El trabajo parte de un comparador existente y corrige problemas de normalización, representación gráfica, procedencia e interpretación. La versión desarrollada incorpora cuatro conjuntos oficiales de Eurostat, trece modelos didácticos identificados, ocho indicadores reproducibles, comparación con escalas comunes, un motor de tres reglas explícitas que organiza siete niveles de razonamiento, seis casos y un cuaderno de intervención. La arquitectura permanece estática y compatible con GitHub Pages.

La aportación propuesta es la integración trazable entre datos, preguntas e intervención condicional. La revisión comparativa acredita que la visualización de pirámides, las animaciones y la comparación territorial ya existen. Por tanto, no se presentan como invenciones del proyecto. Se aportan pruebas técnicas y un protocolo de investigación, pero no resultados de aprendizaje de estudiantes. La eficacia educativa y la validez profesional del contenido requieren evaluación externa y un estudio posterior autorizado.

Palabras clave: demografía; Educación Social; alfabetización estadística; diagnóstico participativo; aprendizaje activo; tecnología educativa; evaluación de intervenciones.

## 2 Introducción

Las estructuras por edad y sexo ayudan a describir poblaciones y a situar preguntas sobre organización territorial y recursos. Su interpretación exige distinguir lo que puede calcularse de aquello que necesita información adicional. Una estructura envejecida no demuestra aislamiento, una concentración adulta no identifica migración y una base amplia no prueba dificultades escolares. El interés formativo del proyecto consiste en convertir esas distinciones en operaciones que el estudiante deba realizar y justificar.

El laboratorio se dirige a estudiantes y docentes de Educación Social, así como a profesionales que necesiten análisis exploratorio. No pretende sustituir investigación territorial, escucha comunitaria o valoración profesional. El usuario observa, interpreta, formula explicaciones alternativas, delimita cuestiones por investigar y construye una propuesta evaluable si el diagnóstico confirma necesidades. La documentación establece qué funciones se han implementado y qué afirmaciones permanecen como hipótesis.

## 3 Justificación del proyecto

Un comparador visual puede facilitar la lectura de distribuciones, pero también favorecer asociaciones automáticas entre edad, déficit y demanda de asistencia. La herramienta anterior incluía formulaciones prudentes junto a instrucciones que pedían una tesis causal y orientaciones sociales prefijadas. Esta tensión justificó revisar tanto la lógica como el contenido, en lugar de limitar la intervención al diseño de la pantalla.

La solución ofrece denominadores visibles, tablas equivalentes a los gráficos, fórmulas y límites vinculados a cada regla. El cuaderno exige expresar hipótesis alternativas, información faltante y participación. El estudiante conserva su decisión y su responsabilidad argumentativa. Las propuestas no se presentan como diagnósticos calculados por la aplicación. Este diseño permite observar productos de aprendizaje concretos: una interpretación escrita, una pregunta de contraste, un objetivo operativo o una evaluación con línea base y plazo.

## 4 Problema de investigación

El problema es si una secuencia digital que conecta descripción demográfica y planificación condicional ayuda a fundamentar mejor las decisiones socioeducativas. No basta con aumentar el atractivo de los gráficos ni con obtener satisfacción de uso. Es necesario averiguar si el estudiante calcula e interpreta correctamente, evita inferencias injustificadas y produce planes cuyo vínculo con la evidencia pueda examinarse.

La unidad de análisis propuesta es el trabajo individual del estudiante ante una tarea común, complementado por observación de interacción y entrevista. Se diferencian aprendizaje, usabilidad percibida y calidad técnica. Un fallo de importación pertenece a la verificación del producto; una afirmación causal infundada en una respuesta pertenece a la evaluación del razonamiento. La hipótesis educativa no se contrasta con las pruebas de software.

## 5 Estado de la cuestión

La revisión exploratoria realizada el 27 de octubre de 2026 consultó herramientas oficiales y documentación primaria. Incluyó las pirámides del INE, la ayuda del visor de Eustat, el Data Portal de Naciones Unidas, Eurostat y una herramienta pública de pirámides internacionales. La matriz ampliada figura en los anexos. No constituye una revisión sistemática ni demuestra inexistencia de otros productos semejantes.

El INE ofrece selección territorial y evolución; Eustat documenta información de edades, animación y opciones geográficas; Naciones Unidas documenta comparación por lugares y periodos con superposición. Estas funciones son antecedentes, no novedades propias. En los materiales revisados no se documentó la misma integración de siete fases socioeducativas con reglas inspeccionables, cuaderno y casos específicos. Esa ausencia en una muestra acotada sustenta una diferenciación de diseño, no una afirmación de primacía mundial. Su utilidad debe contrastarse con tareas equivalentes y usuarios reales.

También se examinó CODAP, una plataforma educativa de análisis y visualización con representaciones enlazadas e importación, y Community Tool Box de la Universidad de Kansas, que ofrece planificación de evaluación de necesidades y recursos comunitarios. Son antecedentes relevantes para aprendizaje estadístico y diagnóstico participativo. La combinación de estas familias ya tiene fundamentos y herramientas; la contribución que se estudia aquí es una organización específica, trazable y acotada para Educación Social, no la invención de aprender con datos o planificar con participación.

## 6 Marco teórico

### Demografía y estructura social

La pirámide representa una distribución de población en un momento, con el universo y las categorías definidos por cada fuente. Los indicadores de dependencia relacionan edades; no son recuentos de personas con dependencia funcional ni de personas económicamente inactivas. La aplicación utiliza 0-14, 15-64 y 65+, declarando sus cortes. Cuando otras publicaciones emplean menores de 16 y 16-64, las cifras no son directamente equivalentes.

Una distribución transversal resulta compatible con distintos procesos de nacimientos, supervivencia y movilidad. Para explicar una variación se necesitan series comparables y datos sobre los procesos correspondientes. La comparación de dos grupos 20-24 en años diferentes tampoco sigue por sí misma a una cohorte de nacimiento. Estas precisiones fundamentan la separación entre observación y explicación.

### Educación Social y diagnóstico comunitario

La referencia profesional actualizada es el Código Deontológico de la Educación Social de 2026 del CGCEES. El diseño incorpora autonomía, derechos, no discriminación y participación, en vez de convertir edad u origen supuesto en etiquetas de necesidad. Los documentos profesionalizadores de ASEDES de 2007 se consideran antecedentes de definición y funciones; el código nuevo se consulta como referencia ética actual.

El diagnóstico se concibe como un proceso contextual: integra evidencia estadística, observación de recursos y barreras, demandas expresadas y deliberación comunitaria. La distinción entre consulta y capacidad de decisión, planteada por Arnstein, ayuda a revisar si la participación propuesta modifica realmente las decisiones. La transferencia de esa tipología histórica al aula requiere contextualización y no implica que exista una única forma adecuada de participación.

### Alfabetización estadística y pensamiento crítico

Gal sitúa la interpretación, evaluación crítica y comunicación de información estadística en relación con conocimientos y disposiciones. El laboratorio traduce ese marco a actividades: nombrar un denominador, verificar una fuente, distinguir porcentaje de puntos porcentuales, considerar explicaciones alternativas y comunicar límites. No se atribuye a Gal la validación de las actividades diseñadas aquí.

La reflexión crítica se integra en los formularios, en los casos y en la retroalimentación. No se limita a una advertencia final. Un estudiante puede describir correctamente una diferencia y, aun así, proponer una actuación sin diagnóstico suficiente; la rúbrica trata ambos componentes por separado.

### Aprendizaje activo y tecnología educativa

La evidencia sintetizada por Freeman y colaboradores procede de contextos STEM y justifica estudiar actividades en las que el alumnado realiza tareas y recibe retroalimentación. No autoriza a trasladar automáticamente sus tamaños de efecto a Educación Social o a este producto. La hipótesis específica de DemoLab sigue abierta.

La interactividad se diseña alrededor de decisiones con consecuencias visibles: cambiar un periodo actualiza recuentos, la misma diferencia puede expresarse con distintas unidades y un cambio de conjunto advierte que el cuaderno mantiene otro vínculo. La relación entre acción y evidencia es el mecanismo pedagógico propuesto; debe observarse si los usuarios la comprenden.

### Diseño universal para el aprendizaje

Las pautas CAST 3.0 orientan alternativas de representación, participación y expresión. Se ofrecen gráfico, tabla, texto, ajustes visuales, navegación por teclado y exportación. Los casos admiten producción argumentativa y revisión. Estas decisiones son una aplicación de principios de diseño; no demuestran por sí mismas accesibilidad para todos los perfiles o mejora de aprendizaje. Se necesita evaluación con tecnologías de apoyo y diversidad de usuarios.

## 7 Objetivos generales y específicos

El objetivo general es desarrollar una herramienta reproducible que facilite aprender a conectar demografía y planificación socioeducativa sin sustituir el diagnóstico participativo.

Los objetivos específicos son verificar los cálculos y representaciones; explicitar procedencia y límites; organizar razonamiento en siete niveles; proporcionar casos con errores frecuentes y feedback; producir informes con trazabilidad; y preparar instrumentos para estudiar aprendizaje, usabilidad y contenido. Cada objetivo dispone de criterios de aceptación y evidencias en el informe técnico. Las metas de investigación se mantienen separadas de los resultados de implementación.

## 8 Preguntas e hipótesis de investigación

Se plantea que utilizar una herramienta que integra visualización, interpretación crítica y diseño guiado puede mejorar el aprendizaje aplicado y la fundamentación de decisiones. Es una hipótesis, no un resultado.

Las preguntas son: si mejora la comprensión de estructuras; si favorece la lectura correcta de indicadores; si ayuda a distinguir observaciones e hipótesis; si mejora la planificación fundamentada; si reduce inferencias injustificadas; si resulta utilizable y accesible; y qué aporta frente a recursos convencionales. La variable educativa principal propuesta es la calidad de una resolución de caso evaluada mediante una rúbrica de cinco competencias. La satisfacción y la finalización de tareas son resultados complementarios.

## 9 Diseño metodológico

El trabajo realizado combina desarrollo de producto, verificación funcional y revisión documental exploratoria. Se auditó el repositorio y la versión publicada, se conservó la revisión original y se implementó una arquitectura modular. La selección de Eurostat permitió trabajar con una definición común en dos territorios y dos periodos. Los modelos históricos se conservaron como datos sintéticos y se eliminaron atribuciones territoriales engañosas.

La evaluación educativa propuesta es mixta y de viabilidad. Prioriza un diseño pretest-postest con dos grupos, tareas equivalentes y corrección enmascarada respecto al grupo cuando sea posible. Si no se puede sostener una comparación razonable, se empleará un solo grupo con límites causales explícitos. El protocolo desarrolla selección, tamaño, instrumentos, análisis, sesgos, criterios de continuación y ética. No se ha reclutado a nadie ni recogido datos personales.

## 10 Arquitectura y desarrollo tecnológico

La aplicación usa HTML, CSS y módulos JavaScript nativos, sin dependencias externas en ejecución. Los cálculos se separan de la interfaz; las reglas y los contenidos docentes están en módulos examinables. La respuesta oficial se conserva con una huella SHA-256 y un script de agregación. El producto puede alojarse en GitHub Pages sin servidor adicional.

Se sustituye la carga comprimida mediante document.write por fuentes legibles. El paquete antiguo permanece recuperable y la migración de caché retira únicamente los nombres históricos identificados. Los datos del usuario se guardan en el navegador si este lo permite. La aplicación no incorpora cuentas ni analítica. La lectura en voz utiliza servicios del dispositivo, cuya implementación y privacidad requieren revisión local. La arquitectura completa, los contratos y la guía de actualización se documentan en el repositorio.

## 11 Funcionalidades de la herramienta

Explorar permite elegir territorio o modelo, periodo, absolutos o porcentaje del total, grupos e intervalos individuales, ampliar la selección y consultar valores en una tabla accesible. Comparar muestra dos pirámides o una superposición con escala común; calcula diferencias de indicadores y de intervalos. La evolución alterna dos cortes observados y advierte que no establece una tendencia.

Comprender presenta ocho fórmulas e interpretaciones, además de comentarios breves o desarrollados. Intervenir ofrece reglas y cuaderno. Aprender incluye seis casos y cinco ejercicios formativos. Investigar muestra metadatos y admite un contrato CSV/JSON validado. Exportar produce TXT, CSV, JSON y un informe HTML imprimible a PDF. El escenario permite una transición sintética de cinco años con supuestos simples, claramente separada de observaciones y proyecciones oficiales.

## 12 Modelo de razonamiento socioeducativo

Las reglas R01, R02 y R03 describen respectivamente la proporción de 65+, de 0-14 y la razón entre ambos grupos. No se utiliza un umbral para diagnosticar necesidades. La comparación de la razón con 100 expresa solamente qué grupo es más numeroso. Si no existe denominador, la regla correspondiente no produce un valor ficticio.

Cada regla conserva identificador y versión del conjunto, indicador, valor, fórmula o condición, fuente, fundamento y limitaciones. Organiza observar, interpretar, formular hipótesis, investigar necesidades, diseñar una propuesta condicional, evaluar y reflexionar. El cuaderno recoge además recursos, agentes y temporalización. Las explicaciones alternativas son posibilidades para orientar la investigación, no probabilidades calculadas. Las propuestas socioeducativas son elaboración propia pendiente de revisión experta; la fuente estadística no valida esas recomendaciones.

## 13 Aplicaciones didácticas

Los seis casos abarcan envejecimiento y comunidad, infancia, despoblación rural, transformación urbana, diversidad y diagnóstico participativo. Todos incluyen contexto, datos, objetivos, actividades, preguntas, errores, propuesta condicional, criterios, ética y retroalimentación. Los casos territoriales con datos nacionales explicitan que no pueden describir un barrio o municipio concreto. Los modelos no aportan información social real.

Se propone una secuencia docente de dos sesiones y trabajo autónomo. El estudiante primero realiza una descripción con indicadores, después cuestiona una inferencia y finalmente completa un plan. La guía docente incluye tiempos, materiales, ejemplos y rúbrica. El progreso local facilita continuidad individual, pero no constituye un registro de investigación ni un sistema de evaluación institucional. El docente recibe solo los archivos que el estudiante decida entregar.

## 14 Evaluación técnica

Las pruebas abarcan un ejemplo con resultados conocidos, los diecisiete conjuntos, conservación de totales, denominadores cero, diferencias, escenarios y contratos de importación. La integración en navegador verifica selección, actualización coordinada, escalas, superposición, persistencia, casos, corrección formativa, importación, informes y adaptación a tres anchuras.

La primera batería detectó un desbordamiento móvil y un problema del ejecutor de accesibilidad. Al corregir este último, axe detectó estados de contraste asociados a una transición de opacidad. Se eliminó esa transición y se corrigió la partición de enlaces largos. La pasada posterior de dieciocho comprobaciones de integración terminó sin fallos. Los resultados detallados, fecha y herramientas se conservan. La auditoría no debe confundirse con un ensayo de usabilidad con usuarios o con conformidad WCAG integral.

## 15 Propuesta de validación educativa

Se proponen cuatro niveles: funcionamiento, validez de contenido, usabilidad y utilidad educativa. El primero dispone de resultados técnicos. Los otros necesitan expertos y participantes. La revisión de contenido examinará exactitud, pertinencia, claridad y coherencia, documentando desacuerdos y revisiones antes del piloto.

El protocolo incluye dos formas paralelas de prueba, rúbrica, observación de tareas, cuestionarios originales, entrevista y la opción de SUS como instrumento estandarizado sujeto a selección y comprobación de la versión lingüística. No se atribuye validación a las traducciones o escalas originales elaboradas para el proyecto. Los resultados se analizarán con intervalos de incertidumbre y una interpretación centrada en viabilidad. La aplicación no recoge automáticamente estos datos; el tratamiento corresponde al equipo y a los procedimientos autorizados de la institución.

## 16 Resultados obtenidos

Se ha desarrollado una versión funcional con diecisiete conjuntos: cuatro oficiales y trece sintéticos. La instantánea oficial conserva 48 085 361 personas para España 2023, 48 619 695 para España 2024, 10 516 621 para Portugal 2023 y 10 639 726 para Portugal 2024. En España 2024 se calculan 6 430 377 personas de 0-14 y 9 928 368 de 65+; representan aproximadamente 13,23 % y 20,42 % del total. Son resultados descriptivos del conjunto, no evidencias de necesidades sociales.

La auditoría inicial identificó sumas de pesos desde 67,20 hasta 106,95 en modelos presentados como porcentajes, escalas gráficas inconsistentes y comentarios que sobrepasaban la evidencia disponible. Se implementaron normalización, escalas comunes y recomendaciones condicionales. Se verificaron flujos técnicos en navegador y se prepararon memoria, guía, protocolo y dosier. No hay datos de estudiantes, jueces expertos, satisfacción, accesibilidad con lectores de pantalla o efectos educativos. Ninguna mejora porcentual de aprendizaje puede comunicarse.

## 17 Discusión

La integración propuesta ofrece un vínculo visible entre un dato, una interpretación y una decisión que requiere contrastación. Su interés reside en hacer examinables los pasos que un comentario automático suele condensar. La conservación de hipótesis alternativas y límites permite que el docente evalúe razonamiento, no solo reproducción verbal.

Sin embargo, una regla transparente puede seguir siendo pedagógicamente pobre o profesionalmente insuficiente. Solo se han implementado tres reglas descriptivas y sus orientaciones necesitan revisión experta. La existencia de un cuaderno puede producir respuestas formularias si la evaluación premia completar campos en vez de argumentar. Por ello el piloto debe observar calidad, contradicciones y transferencia a un caso nuevo. La comparación con recursos convencionales ha de igualar información, tiempo y acompañamiento para que la novedad de la interfaz no explique por sí sola los resultados.

## 18 Limitaciones

La cobertura real se limita a dos países y dos años; no existe una base municipal integrada. Las instantáneas necesitan actualización documentada. El contrato de importación exige adaptación previa de archivos de otras fuentes. Las categorías de sexo reproducen la disponibilidad de la fuente y no abarcan todas las dimensiones de diversidad. El escenario no se ha calibrado ni validado para predecir.

La revisión de originalidad es exploratoria. La autoevaluación del producto no es una consultoría externa independiente. Las pruebas automáticas no cubren todos los criterios de accesibilidad ni todos los navegadores y dispositivos. Los PDF del navegador pueden carecer de etiquetado accesible. No se ha realizado un piloto, estimado fiabilidad de instrumentos originales o obtenido revisión de expertos. Estas limitaciones impiden presentar el proyecto como intervención educativa eficaz o recurso académicamente reconocido.

## 19 Transferibilidad a otros contextos

El núcleo de cálculo y el contrato pueden reutilizarse en otras asignaturas que trabajen estructura de población, siempre que las definiciones sean compatibles. La secuencia dato, interpretación, hipótesis y contraste puede adaptarse a empleo, vivienda o participación con nuevos indicadores y reglas, tras una revisión específica. No debe ampliarse mediante sustitución superficial de etiquetas.

Para uso profesional se requiere incorporar datos del territorio, verificar derechos de reutilización, contar con información comunitaria y revisar los procedimientos de protección de datos. Para docencia institucional hacen falta responsable académico, accesibilidad evaluada con el alumnado y una política clara de mantenimiento. La apertura del código facilita examen, pero la ausencia de una licencia original explícita requiere que el titular decida las condiciones de redistribución antes de presentar el recurso como REA plenamente reutilizable.

## 20 Conclusiones

El trabajo demuestra la viabilidad técnica de un laboratorio estático que calcula indicadores, compara distribuciones y conserva un razonamiento inspeccionable. La corrección de errores previos y la distinción entre datos, hipótesis y decisiones mejoran su defendibilidad metodológica. La revisión comparativa permite situar la propuesta como una integración específica para Educación Social, con originalidad y valor añadido aún por contrastar externamente.

El proyecto está preparado para solicitar revisión de contenido y colaboración docente, no para comunicar eficacia o reconocimiento universitario. El siguiente paso académico es acordar una asignatura y un equipo responsable, revisar los instrumentos y tramitar las autorizaciones antes del piloto. La fuerza de la candidatura dependerá de las evidencias obtenidas en ese proceso, no del acabado visual o de una puntuación interna.

## 21 Referencias bibliográficas

Arnstein, S. R. (1969). A ladder of citizen participation. Journal of the American Institute of Planners, 35(4), 216-224. https://doi.org/10.1080/01944366908977225

Asociación Estatal de Educación Social. (2007). Documentos profesionalizadores. https://www.eduso.net/wp-content/uploads/2019/11/Documentos-profes-Sept-2007.pdf

CAST. (2024). Universal Design for Learning Guidelines version 3.0. https://udlguidelines.cast.org/

Consejo General de Colegios Oficiales de Educadoras y Educadores Sociales. (2026). Código Deontológico de la Educación Social. https://www.consejoeducacionsocial.net/wp-content/uploads/2026/10/Codigo-Deontologico-digital_DEF.pdf

Eldridge, S. M., Chan, C. L., Campbell, M. J., Bond, C. M., Hopewell, S., Thabane, L., y Lancaster, G. A. (2016). CONSORT 2010 statement: Extension to randomised pilot and feasibility trials. BMJ, 355, i5239. https://doi.org/10.1136/bmj.i5239

España. (2018). Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos Personales y garantía de los derechos digitales [Texto consolidado]. https://www.boe.es/eli/es/lo/2018/12/05/3/con

Eurostat. (2026). Population on 1 January by age and sex [demo_pjan; conjunto de datos]. Recuperado el 27 de octubre de 2026 de https://doi.org/10.2908/demo_pjan

Eurostat. (s. f.). Copyright notice and free re-use of data. https://ec.europa.eu/eurostat/help/copyright-notice

Eustat. (s. f.). Interactive population pyramid [Ayuda]. https://www.eustat.eus/graficosJS-operaciones/ayuda-piramide/html/ayuda_i.asp

Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H., y Wenderoth, M. P. (2014). Active learning increases student performance in science, engineering, and mathematics. Proceedings of the National Academy of Sciences, 111(23), 8410-8415. https://doi.org/10.1073/pnas.1319030111

Gal, I. (2002). Adults' statistical literacy: Meanings, components, responsibilities. International Statistical Review, 70(1), 1-25. https://doi.org/10.1111/j.1751-5823.2002.tb00336.x

Institut d'Estadística de Catalunya. (s. f.). API de taules. https://www.idescat.cat/dev/api/taules/

Instituto Nacional de Estadística. (s. f.). API JSON. https://www.ine.es/dyngs/DAB/index.htm?cid=1099

Instituto Nacional de Estadística. (s. f.). Pirámide de población en España. https://ine.es/aplicaciones/piramides/piramides.htm

Naciones Unidas, División de Población. (2024). World Population Prospects 2024. https://population.un.org/wpp/

Naciones Unidas, División de Población. (s. f.). Data Portal user guide. https://population.un.org/dataportal/about/userguide

Parlamento Europeo y Consejo de la Unión Europea. (2016). Reglamento (UE) 2016/679. https://eur-lex.europa.eu/eli/reg/2016/679/oj

The Concord Consortium. (s. f.). Common Online Data Analysis Platform (CODAP). https://codap.concord.org/

University of Kansas, Center for Community Health and Development. (s. f.). Developing a plan for assessing local needs and resources. Community Tool Box. https://ctb.ku.edu/en/table-of-contents/assessment/assessing-community-needs-and-resources/develop-a-plan/main

World Wide Web Consortium. (2024). Web Content Accessibility Guidelines (WCAG) 2.2. https://www.w3.org/TR/WCAG22/

## 22 Anexos técnicos y metodológicos

### A Matriz comparativa exploratoria

ND significa que el componente no se documentó en las páginas examinadas; no significa que se haya probado su inexistencia.

| Herramienta | Visualización y comparación | Evolución | Secuencia socioeducativa trazable |
|---|---|---|---|
| INE pirámides | Nacional, CCAA, provincias y municipios | Disponible según serie | ND |
| Eustat pirámide | Edades, geografía y opciones de visualización | Animación documentada | ND |
| UN Data Portal | Pirámides y superposición de lugares o tiempos | Visualización temporal | ND |
| Eurostat Data Browser | Consulta y descarga con metadatos | Series por dataset | ND |
| CODAP | Análisis educativo, representaciones enlazadas e importación | Según datos y actividad | ND de esta secuencia específica; plataforma general de aprendizaje con datos |
| Community Tool Box | Guías para necesidades y recursos comunitarios | Planificación de evaluación | Diagnóstico y participación ya desarrollados; sin este comparador integrado en la sección examinada |
| DemoLab 2.0.0 | Dos países, dos años, modelos e importación | Dos cortes; sin tendencia inferida | Tres reglas, siete pasos, cuaderno y casos |

La comparación se basa en documentación funcional pública. No es un ensayo de todas las herramientas con una misma tarea. Se requiere ampliar la búsqueda bibliográfica y examinar recursos de diagnóstico participativo antes de una reivindicación formal de originalidad.

### B Matriz de aceptación

| Función | Finalidad | Criterio observable | Evidencia y límite |
|---|---|---|---|
| Indicadores | Razonamiento cuantitativo | Resultado conocido y denominadores cero correctos | Pruebas de núcleo; no valida interpretación profesional |
| Gráfico y comparación | Lectura proporcional | Anchuras y ejes comparten escala | Integración; revisión visual en navegador |
| Reglas | Explicitar inferencias | Datos, indicador, condición, fuente y límites visibles | Inspección y ejecución; revisión experta pendiente |
| Casos | Aprendizaje activo | Diez componentes didácticos por caso | Contenido implementado; aprendizaje sin medir |
| Importación | Análisis propio | Rechazar contratos incoherentes | Pruebas de archivos; procedencia no autenticada |
| Cuaderno e informe | Elaboración y revisión | Vínculo de datos y exportación de límites | Integración; no valida calidad de lo escrito |

### C Documentos vinculados

El informe de auditoría contiene resultados y registro de defectos. La guía docente concreta la secuencia didáctica y rúbrica. El protocolo entrega formas de evaluación, plan de análisis y ética. El dosier resume la solicitud de colaboración y las vías institucionales comprobadas. La arquitectura y el diccionario se conservan junto al código para facilitar revisión y reproducción.
