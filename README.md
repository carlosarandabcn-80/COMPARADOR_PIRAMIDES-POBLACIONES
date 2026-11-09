# COMPARADOR DE PIRÁMIDES POBLACIONALES
### Estructura Social · Grado en Educación Social · recurso independiente basado en materiales de estudio de UNIR

Aplicación web estática para **describir y comparar tipos de pirámides de población con datos reales del INE y Eurostat**. Esta versión abandona los módulos de intervención socioeducativa y concentra la interfaz en morfología, estadística descriptiva y comparación de poblaciones.

**Sitio:** https://carlosarandabcn-80.github.io/COMPARADOR_PIRAMIDES-POBLACIONES/

## Funcionalidades
- Biblioteca de **doce perfiles didácticos**: tres familias básicas y nueve subtipos o patrones complementarios. Los esquemas SVG son sintéticos y nunca se presentan como series observadas.
- Dos selectores independientes A y B, fuente oficial, ámbito geográfico y año.
- Fuente Eurostat `demo_pjangroup`: cohortes quinquenales oficiales, con 85 años o más agrupados; el selector consulta los años completos disponibles para el país elegido.
- INE a 1 de enero. La tabla `56934` cubre España de 1971 a 2025 y la `59583` aporta el dato provisional de 2026. Para 2026 también se consultan las comunidades y ciudades autónomas en `59238` y la provincia de Barcelona en `59589` con un filtro por provincia. Barcelona y L'Hospitalet como municipios proceden de una **instantánea oficial de Idescat de 2025**.
- Gráficos SVG con escalas idénticas entre A/B, porcentajes o valores absolutos, resaltado por grandes grupos y por las tres diferencias quinquenales principales, además de tablas accesibles.
- Indicadores con fórmula explícita, lectura morfológica automatizada **orientativa** basada en familia básica y patrones adicionales (con umbrales propios no oficiales) y comparación en puntos porcentuales.
- **Lectura académica comparada de Estructura Social**: identificación de fuentes, comparación de base/tronco/cúspide, tres diferencias quinquenales principales, composición por sexo en 65+, índices, tipo de comparación temporal/territorial, límites inferenciales y conclusión. Dos niveles de extensión (completo y síntesis), matriz de 18 cohortes y exportación coherente. [Metodología](docs/lectura_comparada_academica.md).
- Exportación de comparación TXT, ambos conjuntos a CSV e impresión/PDF desde el navegador.
- Tabla conjunta de personas y porcentajes por edad y gráfico de diferencias por sexo con cero central. Para el mismo territorio y fuente en dos fechas, el signo indica el año posterior menos el anterior. En los contrastes territoriales se muestra A−B. La ficha superior identifica el sentido de la resta y muestra los avisos de la fuente aplicables a la selección.

## Ajustes de accesibilidad

El botón **Accesibilidad**, identificado con una figura humana, ofrece tamaño de texto hasta el 200 %, alto contraste, espaciado de lectura y una vista con las tablas en lugar de los gráficos. Los ajustes se guardan en el navegador y se pueden restablecer desde el mismo panel. También se admiten el zoom y los colores de alto contraste del sistema. Los enlaces de salto, los indicadores de foco y las tablas con encabezados permiten recorrer el comparador con teclado o lector de pantalla.

## Calidad de datos
**Las pirámides de datos usan series oficiales completas y validadas.** El grupo abierto de 85 años y más se toma directamente cuando el INE lo publica, incluidos los años 1971–1980. En las tablas con edades simples, se suma de 85 a 99 y se añade 100+. Se contrastan los totales publicados, incluidos los de cada sexo cuando están disponibles. Las pequeñas diferencias históricas se indican en la ficha de la pirámide y en el TXT. Los porcentajes usan la suma de las edades representadas. Las categorías de sexo reflejan la codificación de cada fuente.

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
- `scripts/verificar-territorios.mjs`: comprobaciones en vivo de todos los territorios subnacionales del selector INE para 2026. `scripts/extract-idescat.mjs` genera las instantáneas municipales de 2025 desde el CSV de Idescat.
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

El algoritmo trabaja con 17 intervalos de cinco años y un grupo abierto, compara la base 0–14 con 30–44 y detecta discontinuidades locales entre grupos cerrados con parámetros descriptivos declarados. 85+ se conserva en tablas e indicadores y se lee por separado de las cohortes quinquenales. El comparador marca hasta tres divergencias A/B cuyo valor redondeado a dos decimales difiere de cero.

**Límites territoriales.** Los periodos y la disponibilidad de cada tabla INE pueden cambiar; el parser rechaza cohortes no recuperadas y nunca las sustituye por cifras fabricadas. Para periodos históricos deben comprobarse revisiones de las operaciones estadísticas. El gráfico original de Tezanos sobre España 1960–2001 no se reproduce estadísticamente: su agrupación superior difiere de los 85+ del comparador actual.

## Datos municipales con procedencia verificable
El fichero `data/idescat-municipios-2025.json` contiene 18 grupos etarios por sexo para Barcelona y L'Hospitalet de Llobregat. Los totales de la fuente de 2025 contrastados por suma de cohortes son 1.713.247 y 292.161 personas, respectivamente. Se construyó a partir del CSV institucional https://www.idescat.cat/serveis/consultes/es/censph_539_mun_2025_pc.csv mediante `scripts/extract-idescat.mjs`. Se entrega como fotografía histórica reproducible y se etiqueta expresamente como tal. Los datos territoriales INE 2026 se consultan en tiempo real y no deben confundirse con la fuente municipal 2025.
