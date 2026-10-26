# Auditoría de situación inicial — revisión estática

**Fecha:** 26-10-2026. **Objeto:** rama `main`, repositorio `COMPARADOR_PIRAMIDES-POBLACIONES`. Se inspeccionaron estructura del repositorio, lector HTML, documentación y código de la aplicación descomprimido. **No se realizó una sesión de navegador con tecnologías de asistencia, ni pruebas en dispositivos reales.**

## Arquitectura encontrada (hechos observados)

- `index.html` contenía un lanzador: descarga `payload/index.html.gz.b64`, convierte desde base64, descomprime mediante `DecompressionStream('gzip')` y sustituye el documento completo con `document.write`.
- El código original se mantenía dentro del payload comprimido (aprox. 92 kB de HTML descomprimido); dificulta revisar diffs, depurar y mantener la aplicación.
- Se identificaron pirámides didácticas, comparaciones, comentarios orientativos, opciones de accesibilidad, exportación TXT, impresión y estado local en `localStorage`.
- Algunas etiquetas ejemplifican países o regiones y años (p. ej., «España 2025», «África 2024», «México 2024»), mientras la documentación `README` presenta los modelos internos como sintéticos. Esta mezcla hace posible una lectura errónea de las cifras como estadísticas oficiales auditadas.
- Parte de las interpretaciones del código original enlaza automáticamente formas demográficas con consecuencias y actuaciones; no siempre se explicita qué evidencia externa acreditaría necesidades o causas.
- La lógica original utiliza porcentajes por bandas quinquenales y valores ejemplificados sin un pipeline reproducible de procedencia/verificación de datos. No se localizó un conjunto de tests automáticos en la rama inspeccionada.
- El service worker original respondía potencialmente con el documento de inicio en errores de recursos estáticos. Su caché original podía mantener versiones antiguas.

## Hallazgos y respuesta

| ID | Hallazgo o riesgo | Criticidad | Cambio propuesto / realizado en rama |
|---|---|---|---|
| A-01 | Payload comprimido poco auditable | Alta, mantenibilidad | Se descomprime una copia íntegra en `comparador-original.html`; el original no desaparece |
| A-02 | Etiquetas geográficas reales dentro de modelos didácticos | Alta, integridad científica | Laboratorio nuevo con tres territorios **claramente ficticios** |
| A-03 | Interpretaciones sin procedencia por afirmación | Alta, metodológica | Núcleo con fórmulas explícitas, dos reglas descriptivas y advertencias |
| A-04 | Ausencia de importación estructuralmente validada | Media | CSV/JSON con 36 combinaciones edad × sexo y metadatos obligatorios |
| A-05 | Ausencia de ruta guiada para investigación participativa | Media | Siete fases con anotaciones, casos y exportación |
| A-06 | Pruebas numéricas no registradas | Alta, fiabilidad | Suite de 12 pruebas declaradas y workflow CI; revisar estado de ejecución |
| A-07 | Estrategia antigua de caché | Media | Revisión de `sw.js` y versionado de recursos |
| A-08 | Ausencia de evaluación educativa con participantes | Alta, académica | Protocolo de investigación; **no se declara eficacia** |

La implementación nueva **no garantiza todavía** que la accesibilidad 2.2 AA, la robustez frente a ficheros maliciosos, el rendimiento real ni la seguridad de toda la web estén validados externamente. Las comprobaciones funcionales de navegador y lector de pantalla permanecen pendientes.

## Delimitación del dictamen

Esta auditoría registra propiedades observables **por inspección** y una respuesta de ingeniería inicial. No equivale a una auditoría independiente de seguridad, conformidad WCAG ni validación científica. El repositorio conserva el HTML del comparador original para comparación y reversibilidad.
