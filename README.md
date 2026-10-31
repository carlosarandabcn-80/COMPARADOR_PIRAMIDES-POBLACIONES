# COMPARADOR DE PIRÁMIDES POBLACIONALES
### Estructura Social · Grado en Educación Social · recurso independiente basado en materiales de estudio de UNIR

Aplicación web estática para **describir y comparar tipos de pirámides de población con datos reales del INE y Eurostat**. Esta versión abandona los módulos de intervención socioeducativa y concentra la interfaz en morfología, estadística descriptiva y comparación de poblaciones.

**Sitio:** https://carlosarandabcn-80.github.io/COMPARADOR_PIRAMIDES-POBLACIONES/

## Funcionalidades
- Biblioteca de **doce perfiles didácticos**: tres familias básicas y nueve subtipos o patrones complementarios. Los esquemas SVG son sintéticos y nunca se presentan como series observadas.
- Dos selectores independientes A y B, fuente oficial, ámbito geográfico y año.
- Fuente Eurostat `demo_pjangroup`: cohortes quinquenales oficiales, con 85 años o más agrupados; el selector consulta los años completos disponibles para el país elegido.
- Fuente INE `56934`: total nacional a 1 de enero (serie desde 1971). Módulos adicionales `59238` (comunidades autónomas), `59589` (provincias) y `69129` (municipios de la provincia de Barcelona), sujetos a cobertura y validación real de la API. La validación conserva cualquier pequeña discrepancia oficial documentada, sin inventar datos.
- Gráficos SVG con escalas idénticas entre A/B, porcentajes o valores absolutos, resaltado por grandes grupos y por las tres diferencias quinquenales principales, además de tablas accesibles.
- Indicadores con fórmula explícita, lectura morfológica automatizada **orientativa** basada en familia básica y patrones adicionales (con umbrales propios no oficiales) y comparación en puntos porcentuales.
- **Lectura académica comparada de Estructura Social**: identificación de fuentes, comparación de base/tronco/cúspide, tres diferencias quinquenales principales, composición por sexo en 65+, índices, tipo de comparación temporal/territorial, límites inferenciales y conclusión. Dos niveles de extensión (completo y síntesis), matriz de 18 cohortes y exportación coherente. [Metodología](docs/lectura_comparada_academica.md).
- Exportación de comparación TXT, ambos conjuntos a CSV e impresión/PDF desde el navegador.

## Calidad de datos
**Solo se muestran pirámides reales cuando una API oficial devuelve valores completos validados.** Errores de red, edad o total resultan en rechazo y mensaje visible. Las categorías de sexo reflejan la codificación de las fuentes estadísticas.

El módulo no identifica causas, no pronostica, no formula intervenciones sociales. Los dibujos del apartado Tipos son abstracciones visuales y no representan territorios.

## Estructura
- `index.html`: aplicación de comparación vigente.
- `lab/comparison-core.mjs`: análisis estadístico y conexiones Eurostat/INE, sin DOM.
- `lab/morphology.mjs`: biblioteca de doce perfiles y reglas de reconocimiento reproducibles.
- `lab/comparison-ui.mjs`: interacción y gráficos.
- `lab/comparison.css`: diseño adaptable.
- `tests/comparison.test.mjs`: cálculos, formatos y casos límite.
- `tests/lab.e2e.spec.mjs`: pruebas Chromium Playwright y axe-core.
- `scripts/verificar-fuentes.mjs`: comprobación contra las dos API oficiales reales.
- `scripts/verificar-territorios.mjs`: comprobaciones reales separadas de tablas territoriales del INE; su resultado puede revelar periodos no publicados o cambios de API.
- `docs/comparador_estructura_social.md`: fundamentación docente y metodología.
- `clasico.html`: versión anterior preservada, no forma parte del comparador vigente.
- Archivos `lab/core.mjs`, `lab/main.mjs` y otros documentos anteriores: legado archivado y no invocado desde la aplicación actual.

## Ejecutar
```bash
python3 -m http.server 4173
# abrir http://localhost:4173
node --test tests/comparison.test.mjs
```
Requiere conexión a internet para las consultas reales. Sin API operativa no se presentan cifras ficticias.

## Atribución
- INE, [Población residente por fecha, sexo y edad (desde 1971), tabla 56934](https://www.ine.es/jaxiT3/Tabla.htm?t=56934).
- Eurostat, [Population on 1 January by age and sex, demo_pjan](https://ec.europa.eu/eurostat/databrowser/view/demo_pjangroup/default/table?lang=en).
- Referencia docente del proyecto de Estructura Social: material de la UNIR sobre tipologías y guía de lectura de Tezanos 1960–2001 (ver `docs/comparador_estructura_social.md`).

La aplicación es una iniciativa independiente, no un producto oficial de la UNIR. Durante el examen deben respetarse las instrucciones docentes específicas (no consultar internet ni sistemas de IA, según pautas aportadas).

## Auditoría de conexiones (28-10-2026)
El problema de Alemania 2009 se debía a las edades simples 95–99 ausentes en `demo_pjan`, no a falta de conexión. Se solucionó con el desglose quinquenal de `demo_pjangroup`, que incluye `Y_GE85` oficialmente. Se han probado en vivo Alemania 2009, España 2001 y 2025, además de consultar 15 países en siete años de muestra. Se corrigió el código Eurostat de Grecia (`EL`). Véase [`docs/auditoria_conexiones_2026-10-28.md`](docs/auditoria_conexiones_2026-10-28.md).

## Tipologías y rigor interpretativo (31-10-2026)
Las familias morfológicas tradicionales son expansiva, estacionaria y regresiva. La biblioteca incluye además perfiles docentes (expansiva moderada, mixta e invertida) y patrones transversales (envejecimiento intenso, abultamiento, muesca, concentración de adultos jóvenes, déficit de adultos jóvenes y asimetría por sexo). Los patrones no son categorías oficiales, no son mutuamente excluyentes y no prueban causas demográficas o desigualdad social.

El algoritmo trabaja con 18 intervalos, compara la base 0–14 con 30–44 y detecta discontinuidades locales entre grupos cerrados con parámetros descriptivos declarados. El tramo final de 85+ es abierto y se excluye de rankings entre cohortes quinquenales. El comparador marca las tres mayores divergencias A/B en proporciones (puntos porcentuales).

**Límites territoriales.** Los periodos y la disponibilidad de cada tabla INE pueden cambiar; el parser rechaza cohortes no recuperadas y nunca las sustituye por cifras fabricadas. Para periodos históricos deben comprobarse revisiones de las operaciones estadísticas. El gráfico original de Tezanos sobre España 1960–2001 no se reproduce estadísticamente: su agrupación superior difiere de los 85+ del comparador actual.
