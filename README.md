# COMPARADOR DE PIRÁMIDES POBLACIONALES
### Estructura Social · Grado en Educación Social · recurso independiente basado en materiales de estudio de UNIR

Aplicación web estática para **describir y comparar tipos de pirámides de población con datos reales del INE y Eurostat**. Esta versión abandona los módulos de intervención socioeducativa y concentra la interfaz en morfología, estadística descriptiva y comparación de poblaciones.

**Sitio:** https://carlosarandabcn-80.github.io/COMPARADOR_PIRAMIDES-POBLACIONES/

## Funcionalidades
- Explicación con esquemas **conceptuales** de pirámides expansivas, estacionarias y regresivas (sin simular datos observados).
- Dos selectores independientes A y B, fuente oficial, ámbito geográfico y año.
- Fuente Eurostat `demo_pjan`: países disponibles y años de la serie.
- Fuente INE `56934`: total nacional a 1 de enero de los años disponibles (serie desde 1971).
- Gráficos SVG con escalas idénticas entre A/B, porcentajes o valores absolutos, resaltado por grandes grupos y tablas accesibles.
- Indicadores con fórmula explícita, lectura morfológica automatizada **orientativa** y comparación en puntos porcentuales.
- Exportación de comparación TXT, ambos conjuntos a CSV e impresión/PDF desde el navegador.

## Calidad de datos
**Solo se muestran pirámides reales cuando una API oficial devuelve valores completos validados.** Errores de red, edad o total resultan en rechazo y mensaje visible. Las categorías de sexo reflejan la codificación de las fuentes estadísticas.

El módulo no identifica causas, no pronostica, no formula intervenciones sociales. Los dibujos del apartado Tipos son abstracciones visuales y no representan territorios.

## Estructura
- `index.html`: aplicación de comparación vigente.
- `lab/comparison-core.mjs`: análisis estadístico y conexiones Eurostat/INE, sin DOM.
- `lab/comparison-ui.mjs`: interacción y gráficos.
- `lab/comparison.css`: diseño adaptable.
- `tests/comparison.test.mjs`: cálculos, formatos y casos límite.
- `tests/lab.e2e.spec.mjs`: pruebas Chromium Playwright y axe-core.
- `scripts/verificar-fuentes.mjs`: comprobación contra las dos API oficiales reales.
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
- Eurostat, [Population on 1 January by age and sex, demo_pjan](https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en).
- Referencia docente del proyecto de Estructura Social: material de la UNIR sobre tipologías y guía de lectura de Tezanos 1960–2001 (ver `docs/comparador_estructura_social.md`).

La aplicación es una iniciativa independiente, no un producto oficial de la UNIR. Durante el examen deben respetarse las instrucciones docentes específicas (no consultar internet ni sistemas de IA, según pautas aportadas).
