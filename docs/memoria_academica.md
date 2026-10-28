# Demografía aplicada a la Educación Social: diseño, desarrollo y evaluación de una plataforma interactiva para el análisis territorial y la planificación socioeducativa

**Memoria de desarrollo, versión preliminar (28-10-2026).** No es una memoria de resultados empíricos ni una tesis doctoral.

## Resumen
Se desarrolla un prototipo de laboratorio demográfico para abordar una dificultad de la enseñanza de la estructura social: confundir el perfil por edades de una población con sus causas o sus necesidades sociales. El diseño combina comparaciones demográficas, fórmulas explícitas y reglas interpretativas trazables, y propone actividades didácticas y criterios de evaluación para comprobar en estudios posteriores su utilidad. La aplicación contiene modelos sintéticos, validación de importaciones y un módulo de consulta oficial a Eurostat. Se describe el enfoque metodológico y las limitaciones de la evidencia disponible sin atribuir mejoras de aprendizaje aún no medidas.

**Palabras clave:** Educación Social, demografía, alfabetización estadística, diagnóstico territorial, aprendizaje activo, pensamiento crítico, software educativo.

## Introducción y problema
Las pirámides por edad y sexo constituyen una representación descriptiva. No identifican de manera unívoca mecanismos de fecundidad, mortalidad o migración; menos aún permiten deducir discapacidad, necesidades comunitarias o calidad de los servicios. La confusión entre una asociación estadística y un diagnóstico socioeducativo resulta pedagógicamente relevante porque puede promover actuaciones estereotipadas o sin participación de la comunidad.

## Justificación y antecedentes
Eurostat publica el conjunto demo_pjan y documenta su API JSON-stat. INE e Idescat ofrecen fuentes estadísticas oficiales con procedimientos y formatos propios. Su disponibilidad no implica equivalencia inmediata de cobertura, frecuencia o tramos etarios. La literatura sobre aprendizaje activo aporta una justificación preliminar para la experimentación: Freeman et al. (2014) sintetizaron evidencia de 225 estudios en disciplinas STEM; sus resultados **no** prueban eficacia en Educación Social ni en este producto.

El Diseño Universal para el Aprendizaje de CAST (versión 3.0, 2024) propone diversificar medios de participación, representación y expresión. WCAG 2.2 orienta la accesibilidad web técnica. Los documentos profesionalizadores de la Educación Social y el Código Deontológico de 2026 del CGCEES constituyen referencias éticas a contrastar en la intervención.

## Objetivos
General: diseñar una herramienta replicable y evaluable que conecte análisis demográfico, pensamiento crítico y planificación socioeducativa.
Específicos: validar operaciones con denominadores claros; diferenciar fuentes y escenarios sintéticos; formular inferencias prudentes; enseñar a identificar información faltante; guiar propuestas participativas y evaluables; documentar pruebas y límites.

## Preguntas e hipótesis
¿Se incrementa la capacidad de interpretar indicadores correctamente? ¿Se reduce la atribución causal injustificada? ¿Mejora la calidad de la formulación de intervenciones y de sus indicadores? Hipótesis de trabajo, no demostrada: un aprendizaje guiado con reglas explícitas y ejercicios formativos puede mejorar el desempeño en tareas de transferencia frente a métodos convencionales.

## Desarrollo tecnológico y metodología
Se conserva el comparador histórico en /clasico.html. El nuevo index.html es un laboratorio estático compatible con GitHub Pages, con componentes ES modules independientes: lab/core.mjs (datos, validadores, indicadores, reglas, casos y conversión JSON-stat) y lab/main.mjs (interacción, SVG, tablas y exportación). La hoja lab/style.css proporciona diseño adaptable. El almacenamiento de fichas se mantiene solo en localStorage; los archivos importados no se envían deliberadamente a servidores. Una consulta voluntaria a la API de Eurostat sí realiza una petición de red. No se usan servicios de IA generativa para interpretar datos.

## Descripción de funcionalidad
Exploración: modelos sintéticos de 18 tramos quinquenales (0–4 a 85+), alternancia entre valores absolutos y relativos, énfasis de tramos, tablas equivalentes y metadatos. Comparación: segunda pirámide normalizada, diferencias de índices y bloqueo cuando se intenta comparar un modelo sintético con uno observado. Razonamiento: reglas R01–R04 con dato, interpretación, hipótesis, comprobaciones, intervención condicional y límites. Aprendizaje: seis casos con pregunta autocorregible y actividad aplicada. Intervención: ficha editable de diagnóstico participativo, hipótesis, derechos, objetivos y evaluación. Exportación: CSV, JSON, informe TXT y PDF mediante impresión.

## Validez de datos
Los cuatro modelos sintéticos se han construido expresamente para explorar formas y **no** son datos poblacionales. Un archivo del usuario permanece etiquetado como aportado. Solo una respuesta completa del conjunto oficial demo_pjan, interpretada y validada, se etiqueta como oficial. Se rechazan valores ausentes, negativos, fraccionarios y enteros no seguros, y se evita dividir por cero. No se presenta interpolación automática ni una proyección como predicción.

## Educación Social y derechos
La interpretación profesional requiere participación, autonomía, igualdad y no discriminación. Una pirámide puede sugerir preguntas sobre accesibilidad o servicios, pero la necesidad debe contrastarse mediante indicadores sociales complementarios y consultas con personas implicadas. Los resultados deben poder examinarse y discutirse, también para detectar sesgos y consecuencias no previstas.

## Evaluación técnica y educativa
Se incluyen pruebas unitarias para fórmulas, entradas inválidas, comparabilidad y decodificación JSON-stat, y un flujo CI. **No se han documentado aún pruebas E2E de interacción real, auditorías manuales de lectores de pantalla ni un piloto de aprendizaje**. Se proporciona protocolo prospectivo de estudio comparativo o pretest-postest con limitaciones causales explícitas. No hay datos de participantes ni estimaciones de impacto educativo.

## Discusión, aportación y originalidad
El trabajo operacionaliza una secuencia pedagógica en la que cada interpretación debe mostrar su soporte demográfico y sus limitaciones. Esta integración constituye una aportación de diseño, pero afirmar originalidad científica absoluta sería improcedente sin examen sistemático de alternativas. Tampoco se puede inferir que la existencia del recurso produzca mejoras de aprendizaje.

## Limitaciones
El conjunto de casos es introductorio y sus respuestas binarias pueden simplificar problemas complejos; se compensan mediante preguntas abiertas y rúbrica externa. El laboratorio no verifica la calidad intrínseca de archivos aportados ni la homogeneidad temporal de series. El módulo API depende de disponibilidad de red, estructura de Eurostat y restricciones del navegador, y necesita pruebas en producción. La exportación imprime la interfaz además del texto del informe. No existe aún certificación externa de accesibilidad ni seguridad, ni acuerdo docente institucional.

## Conclusiones provisionales
Existe un prototipo cuyo enfoque trazable puede servir como base de evaluación docente. La contribución académica futura depende de verificar la implementación, revisar contenidos mediante expertos, realizar pruebas con usuarios y cuantificar la adquisición de competencias. Estos objetivos todavía no se han demostrado.

## Referencias verificadas (selección, APA 7)
CAST. (2024). *Universal Design for Learning Guidelines version 3.0*. https://udlguidelines.cast.org/

Consejo General de Colegios de Educadoras y Educadores Sociales. (2026). *Código Deontológico de la Educación Social* [Acceso institucional]. https://www.consejoeducacionsocial.net/quienes-somos/presentacion/

Eurostat. (s. f.). *Population on 1 January by age and sex (demo_pjan)* [Conjunto de datos]. https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en

Freeman, S., Eddy, S. L., McDonough, M., Smith, M. K., Okoroafor, N., Jordt, H., & Wenderoth, M. P. (2014). Active learning increases student performance in science, engineering, and mathematics. *Proceedings of the National Academy of Sciences, 111*(23), 8410–8415. https://doi.org/10.1073/pnas.1319030111

Institut d'Estadística de Catalunya. (s. f.). *Dades obertes*. https://www.idescat.cat/dades/obertes/

Instituto Nacional de Estadística. (s. f.). *Datos abiertos*. https://www.ine.es/datosabiertos/

World Wide Web Consortium. (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

## Anexos
Código y test suite en /lab y /tests; guía de usuario, guía docente, protocolo piloto, diagnóstico y dosier institucional en /docs.
