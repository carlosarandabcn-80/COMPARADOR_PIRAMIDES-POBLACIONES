# Fuentes, acceso y reutilización

Consulta documental: 27 de octubre de 2026. Las condiciones deben revisarse de nuevo al ampliar datos o redistribuir contenidos. La presente revisión no sustituye asesoramiento jurídico ni decisiones de sus titulares.

## Fuente integrada Eurostat

Se descargó demo_pjan con filtros de España, Portugal, sexos M/F y 2023-2024 mediante la Statistics API JSON-stat. La respuesta original se conserva en data/raw. El script no consulta la API: reproduce la agregación desde esa respuesta. La consulta exacta se almacena en cada conjunto y en el generador.

La política oficial autoriza reutilización estadística con reconocimiento de fuente; deben identificarse las modificaciones y la ausencia de responsabilidad de Eurostat por ellas. Los países incluidos son miembros de la UE; no se han mezclado datos de terceros sujetos a excepciones. El producto muestra atribución, DOI, referencia, actualización y agregación propia. No se utilizan logotipos de organismos.

Fuentes: https://ec.europa.eu/eurostat/help/copyright-notice y https://ec.europa.eu/eurostat/en/web/user-guides/data-browser/api-data-access/api-getting-started/api . Datos: https://doi.org/10.2908/demo_pjan . Eurostat conserva la última versión de sus conjuntos; por ello la respuesta y su hash son necesarios para reproducir esta instantánea.

## INE estudiado para ampliación

El INE proporciona API JSON sobre INEbase y descargas en CSV y otros formatos. Los identificadores y estructuras dependen de si la tabla procede de Tempus3, PC-Axis o tpx. Su portal de datos abiertos presenta licencia CC BY 4.0. La importación del laboratorio no acepta cualquier salida del INE directamente: requiere adaptador de tabla, revisión de cortes de edad, universo y totales.

Fuentes: https://www.ine.es/datosabiertos/ y https://www.ine.es/dyngs/DAB/index.htm?cid=1099 . El visor de pirámides distingue fuentes históricas para municipios y series recientes; no se presupone comparabilidad automática. No se ha integrado una tabla INE adicional en esta versión.

## Idescat estudiado para ampliación

Idescat publica descargas abiertas y una API de tablas JSON-stat. La documentación identifica estadísticas, nodos, tablas, divisiones territoriales y filtros; la API limita una petición a 20 000 datos. Se comprobó disponibilidad de población por sexo y edad en su portal de datos abiertos. La API de búsqueda de población no equivale a la API de tablas por edad.

Fuentes: https://www.idescat.cat/dades/obertes/ , https://www.idescat.cat/dev/api/taules/ y https://www.idescat.cat/dev/api/taules/openapi/?lang=es . La página específica de aviso legal no pudo recuperarse con la herramienta de consulta utilizada. No se incorpora ni redistribuye un conjunto Idescat hasta verificar las condiciones concretas de la tabla y las de la API. No se deduce una licencia idéntica a la del INE.

## Naciones Unidas estudiadas para ampliación

World Population Prospects 2024 distingue estimaciones y proyecciones y utiliza fechas de referencia que no deben confundirse con 1 de enero. El portal ofrece descargas y la API de datos documenta un token de autorización; su página identifica CC BY 3.0 IGO. No se introduce ese token en una aplicación estática pública ni se solicita uno para este proyecto. Una futura integración debe conservar revisión, variante, fecha de referencia y clasificación de estimación/proyección.

Fuentes: https://population.un.org/wpp/ , https://population.un.org/dataportalapi/index.html y https://population.un.org/dataportal/about/userguide . No se han cargado datos ONU en los cuatro conjuntos observados incluidos. Los nombres históricos de modelos no se consideran una fuente ONU.

## Software y contenidos

No se encontró una licencia de software explícita en el repositorio original inspeccionado. Se conserva la atribución Aranda Tools sin afirmar una comprobación registral de marca. La normalización de modelos y las mejoras no autorizan a atribuirse derechos sobre materiales ajenos.

Se recomienda que el titular examine una licencia de software como MIT o Apache-2.0 y una licencia de contenido como CC BY 4.0, con datos bajo sus condiciones originales. Esta es una propuesta, no una concesión ya realizada. No se añade una licencia general que pudiera cubrir indebidamente estadísticas, código o documentos heredados. La condición de REA plenamente reutilizable queda pendiente de esa decisión.

axe-core 4.10.3 se utiliza solo para pruebas de desarrollo y figura en pnpm-lock.yaml; conservar sus avisos y licencia si se redistribuye. No se incluye node_modules en el ZIP del sitio estático. La bibliografía se cita y resume; no se redistribuyen artículos o manuales completos de terceros.
