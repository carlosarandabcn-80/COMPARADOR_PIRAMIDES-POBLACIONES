# Consultoría crítica de la versión experimental — corte 26/10/2026

**Objeto:** rama `feature/laboratorio-socioeducativo-20261026`. **No es una auditoría independiente** ni una certificación universitaria. Este informe distingue implementación, pruebas ejecutadas y eficacia educativa todavía sin contrastar.

## Evidencia verificable de esta versión

- Código original recuperado como `comparador-original.html`, junto al payload anterior conservado.
- Motor demográfico aislado; 18 bandas quinquenales × dos categorías H/M; rechazos explícitos de errores de importación y fórmulas transparentes.
- 12 tests de `node:test` ejecutados satisfactoriamente en CI (la suite contiene más comprobaciones individuales).
- Prueba Chromium ejecutada en GitHub Actions con éxito: carga, 18 bandas por pirámide, 11 filas de indicadores, comparación, intercambio A/B, seis casos, guardado y borrado, importación de CSV de ejemplo, informe TXT y apertura del comparador antiguo.
- Análisis automático de axe-core sobre la pantalla inicial en Chromium: **sin violaciones notificadas** para el subconjunto de etiquetas WCAG A/AA escogido en esa ejecución. No se equipara a conformidad WCAG 2.2 AA; otras rutas/estados, navegación asistida y criterios manuales no se han evaluado.
- Registro de CI ejemplar, con resultados de Node y navegador: https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/40318192555 .

## Matriz ponderada de criterio interno (estimación exploratoria, no calificación oficial)

Se proponen puntuaciones de **madurez del prototipo** de 0 a 5, no de eficacia educativa demostrada. Se trata de juicios técnicos explícitos que podrán revisarse con auditoría independiente y piloto.

| Dimensión | Peso | Juicio provisional (0–5) | Evidencia positiva | Por qué no obtiene 5 |
|---|---:|---:|---|---|
| Rigor científico/estadístico | 20 % | 3,5 | Cálculos y ejemplos independientes, definiciones documentadas | Sin carga automática contrastada con fuente oficial ni revisión externa |
| Valor socioeducativo | 20 % | 4 | Ruta de siete fases y enfoque participativo y de derechos | Casos sin evaluación formal por profesionales |
| Innovación/originalidad | 15 % | 2,5 | Integración de visualización, cautelas e intervención guiada | Matriz comparativa preliminar, no revisión sistemática |
| Calidad técnica/fiabilidad | 15 % | 4 | CI Node + Chromium con flujos nucleares verdes | No se han probado todos los escenarios, amenazas o navegadores |
| Utilidad didáctica | 10 % | 3 | Guía, casos, preguntas y rúbrica | No hay evaluación con estudiantes |
| Accesibilidad/usabilidad | 10 % | 3 | Semántica, tablas y escaneo axe inicial sin incidencias notificadas | Sin evaluación manual de todos los criterios ni usuarios |
| Reproducibilidad/documentación | 5 % | 4 | CSV ejemplo, núcleo aislado, tests, metodología, memoria | Faltan versión archivada, licencias y datasets oficiales verificados |
| Potencial de transferencia | 5 % | 2 | Despliegue estático y dosier propuesto | Sin acuerdos ni adopción institucional |

**Cómputo ilustrativo de esta rúbrica interna: 67,5/100**, obtenido aplicando a cada peso la puntuación estimada/5. La cifra no es una validación científica ni debe trasladarse a una candidatura como puntuación objetiva. **La eficacia educativa demostrada sigue «no evaluada».**

## Fortalezas y correcciones acreditadas

La diferencia central frente al comparador previo es conceptual y técnica: el nuevo laboratorio **no transforma automáticamente una estructura poblacional en necesidades sociales**. Las observaciones se calculan, las hipótesis se formulan por quien aprende y la propuesta de intervención se subordina a investigación y participación. El código ya no depende para su núcleo nuevo de un HTML comprimido opaco. Se revisó la estrategia de caché, se añadió un esquema de datos y se establecieron pruebas reproducibles. La trazabilidad de los archivos externos se declara, pero no se autentica.

## Limitaciones y riesgos pendientes (orden propuesto)

1. **Prioridad científica:** integrar al menos un flujo completo de datos reales oficiales verificables con metadatos, control de versión, licencia, fecha y comparabilidad metodológica. Conservar diferenciación inequívoca entre datos observados y ficticios.
2. **Prioridad estadística:** incorporar, si se busca comparación directa con el INE, recuentos por edades simples suficientes para calcular el corte **menores de 16/16–64/65+**, o renombrar siempre el indicador actual de modo que no haya confusión.
3. **Prioridad docente:** revisión por expertos del contenido, rúbrica y casos; piloto con consentimiento y protocolo de análisis.
4. **Prioridad UX/accesibilidad:** pruebas manuales con teclado, NVDA/VoiceOver, contraste en estados dinámicos, zoom/reflujo, móviles y participación de usuarios diversos; registrar defectos y su repetición.
5. **Prioridad seguridad:** revisión de política de contenido, control de formatos, privacidad y limpieza de datos locales en navegadores compartidos; pruebas de archivos adversarios; evaluación externa proporcionada al riesgo.
6. **Prioridad de transferencia:** revisión comparativa formal frente a INE, Idescat, Eurostat y herramientas de enseñanza estadística; definir licencia, versión académica archivada y colaboración institucional.

## Dictamen

**Prototipo demostrable con núcleo y flujos principales comprobados en CI.** Puede utilizarse en experiencias didácticas exploratorias acompañadas, siempre que se identifiquen los datos ficticios y no se derive de ellos diagnóstico real. Aún **no** puede declararse validado científicamente, eficaz para mejorar el aprendizaje, conforme a WCAG 2.2 AA ni certificado seguro. La presentación universitaria debe formularse como **propuesta para valoración y colaboración**, nunca como reconocimiento ya concedido.
