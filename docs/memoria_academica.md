# Demografía aplicada a la Educación Social: diseño, desarrollo y evaluación de una plataforma interactiva para el análisis territorial y la planificación socioeducativa

**Memoria técnica y académica preliminar · 26/10/2026 · Proyecto experimental.**

## Resumen

Se presenta el diseño y desarrollo inicial de un laboratorio web que utiliza distribuciones demográficas para entrenar pensamiento estadístico y razonamiento socioeducativo. La propuesta distingue observaciones reproducibles, interpretaciones prudentes, hipótesis alternativas, investigación de posibles necesidades y diseño condicionado de intervenciones. Se ha conservado una versión legible del comparador previo y se ha creado un motor de indicadores con validación estructural de archivos y pruebas automatizadas. Se proponen criterios de accesibilidad y un protocolo de evaluación educativa, sin atribuir eficacia hasta disponer de datos empíricos. **Palabras clave:** demografía; Educación Social; alfabetización estadística; diagnóstico territorial; aprendizaje activo; accesibilidad.

## 1. Problema y justificación

Una distribución por edad y sexo describe una parte de la estructura poblacional, pero no ofrece medidas directas de pobreza, aislamiento, discapacidad, necesidades o funcionamiento de servicios. Convertir perfiles demográficos en diagnósticos sociales automáticos supondría un salto inferencial injustificado. La innovación educativa propuesta no se sitúa en generar pirámides, sino en **articular explícitamente datos, límites interpretativos y decisiones de intervención condicionadas**.

## 2. Fundamentos conceptuales

La lectura de pirámides exige distinguir tamaños absolutos y relativos, intervalos, diferencias en puntos porcentuales y denominadores. El INE utiliza en sus indicadores básicos de dependencia categorías inferiores a 16 años y de 16–64 (INE, s. f.). El laboratorio, al trabajar con intervalos de cinco años, implementa **0–14/15–64/65+**, una decisión explícita que impide identificar sus tasas con las oficiales.

En intervención socioeducativa, la lectura cuantitativa se plantea como entrada a una investigación territorial que incluya servicios existentes, prácticas comunitarias y opiniones de personas afectadas. El enfoque de derechos rechaza deducir necesidades individuales de la pertenencia a un grupo demográfico. El DUA orienta variedad de representaciones, modos de interacción y participación (CAST, 2024), mientras WCAG 2.2 constituye la referencia técnica de accesibilidad objetivo (W3C, 2024).

## 3. Objetivos

1. Desarrollar una interfaz interactiva que exponga datos de forma trazable y con alternativa tabular.
2. Implementar cálculos cuyo denominador y definición puedan auditarse.
3. Enseñar a distinguir observaciones, hipótesis, necesidades por investigar y propuestas condicionadas.
4. Permitir exportar un informe que conserve datos, reglas y limitaciones.
5. Diseñar una evaluación pedagógica que no presuponga eficacia.

## 4. Preguntas e hipótesis

¿Mejora la competencia de interpretación demográfica? ¿Reduce las inferencias causales injustificadas? ¿Favorece propuestas socioeducativas mejor justificadas? La hipótesis de mejora se formula en [protocolo_investigacion.md](protocolo_investigacion.md) y permanece **sin contraste empírico**.

## 5. Desarrollo y arquitectura

La aplicación original contenía HTML comprimido y cargado dinámicamente. En la rama de desarrollo se conserva el código descomprimido en \`comparador-original.html\` y se incorpora una interfaz accesible en \`index.html\`, un módulo estadístico aislado en \`assets/demografia-core.js\` y un módulo de interacción en \`assets/laboratorio.js\`. No hay backend ni transferencia intencionada de ficheros cargados por el usuario. Los datos precargados son inventados, diseñados solo para pruebas y actividades didácticas.

La aplicación valida importaciones CSV/JSON de 36 filas por conjunto, rechaza duplicados, negativos, decimales, bandas desconocidas y sumas cero. Los informes TXT y la impresión conservan datos de entrada e indicadores derivados. Las declaraciones de procedencia las aporta el usuario; **no se autentican externamente**.

## 6. Modelo de razonamiento

Se implementa la secuencia *observar → analizar/interpretar → formular hipótesis → cuestionar necesidades → investigar participativamente → intervenir condicionadamente → evaluar críticamente*. Las observaciones numéricas se calculan; las hipótesis, la deliberación y las actuaciones corresponden a juicio profesional informado, no a una recomendación automatizada que diagnostique colectivos.

## 7. Evidencias disponibles y limitaciones

En el desarrollo se ejecutaron 14 aserciones del motor de cálculo en el entorno de conexión. Se añadió una suite de tests a \`tests/demografia.test.cjs\` y un workflow CI, cuya ejecución debe comprobarse separadamente. No consta pilotaje universitario, validación de contenido por expertos, auditoría de seguridad independiente ni auditoría WCAG exhaustiva. La coherencia del código **no demuestra** aprendizaje o utilidad profesional.

## 8. Aplicación docente y discusión

Se proponen seis casos: envejecimiento, infancia, despoblación rural, transformaciones urbanas, convivencia y diagnóstico participativo. Cada caso confronta un error inferencial frecuente. La enseñanza debe insistir en que estructuras distintas pueden corresponder a realidades socioeconómicas muy diversas, por lo que ni los perfiles ficticios ni los ficheros importados sin comprobación avalan intervenciones territoriales.

## 9. Conclusiones provisionales

La aportación comprobable es una **arquitectura funcional y metodológicamente explícita propuesta para enseñanza**, no una eficacia educativa establecida. La evaluación científica futura deberá combinar revisión interdisciplinar y estudio con estudiantes. El proyecto solo sería susceptible de reconocimiento formal después de ajustarse a procedimientos y criterios institucionales concretos, que no se presuponen.

## Referencias de documentación primaria consultada (estilo APA orientativo)

CAST. (2024). *CAST Universal Design for Learning Guidelines version 3.0*. https://udlguidelines.cast.org/

Instituto Nacional de Estadística. (s. f.). *Indicadores demográficos básicos: metodología*. https://www.ine.es/metodologia/t20/metodologia_idb.pdf

Instituto Nacional de Estadística. (s. f.). *Pirámide de población en España*. https://www.ine.es/aplicaciones/piramides/piramides.htm

World Wide Web Consortium. (2024). *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

**Antes de entregar como memoria universitaria definitiva:** ampliar revisión sistemática de literatura revisada por pares, matriz de originalidad documentada, bibliografía con metadatos completos, autorización docente y sección de resultados empíricos solo cuando existan.
