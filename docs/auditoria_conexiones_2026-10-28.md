# Auditoría de conexiones y lógica demográfica · 28 de octubre de 2026

## Objeto
Revisión del comparador A/B de pirámides reales, con especial atención a los fallos del conector Eurostat observados al seleccionar **Alemania, 2009**, y al funcionamiento de la API del INE.

Este informe distingue entre **errores de implementación**, **series oficiales incompletas** y **limitaciones de la evaluación**. La aplicación consulta exclusivamente datos publicados por los organismos estadísticos. No se rellenan edades faltantes con ceros o cifras inventadas.

## Diagnóstico reproducido: Alemania 2009
1. **Error anterior:** la aplicación descargaba la tabla oficial Eurostat `demo_pjan`, de edades simples, y exigía que todos los valores entre 0 y 99 años estuvieran presentes. Para Alemania, año 2009, la API devolvía `null` para hombres de 95 a 99 años, pese a que proporcionaba correctamente el total y otras edades. El error mostrado «falta el valor 95 (M)» describía esa ausencia; no demostraba que Eurostat estuviese desconectado.
2. **Solución:** la pirámide se obtiene ahora de **`demo_pjangroup`**, tabla oficial que publica directamente las clases quinquenales (0–4, 5–9, …, 80–84 y **85+**, mediante `Y_GE85`). Así no se necesita reconstruir 85+ sumando edades simples cuyo desglose puede no existir.
3. **Verificación de datos reales:** Alemania 2009 suma **82.002.356 personas** (40.184.283 hombres y 41.818.073 mujeres), y el desglose oficial por 18 grupos concilia con los totales consultados. La aplicación identifica la tabla, año, territorio, fuente y actualización.

Fuentes oficiales: [Eurostat demo_pjangroup](https://ec.europa.eu/eurostat/databrowser/view/demo_pjangroup/default/table?lang=en) y [Eurostat demo_pjan](https://ec.europa.eu/eurostat/databrowser/view/demo_pjan/default/table?lang=en). Verificación de API y logs de GitHub Actions disponibles en el historial del repositorio.

## Conexiones verificadas
| Servicio | Tabla | Configuración | Verificación |
| --- | --- | --- | --- |
| INE | 56934 | Población residente, España total nacional, sexo, edad simple y agregado 100+, datos a 1 de enero | España 2001 (40.665.543 en la suma de grupos) y 2025 (49.128.297) |
| Eurostat | demo_pjangroup | País, sexo M/F, año, unidad personas; grupos quinquenales publicados, con 85+ oficial | España 2001 (40.665.545), España 2025 (49.128.297), Alemania 2009 (82.002.356) |
| Navegador | APIs externas | Solicitudes reales desde Chromium con servidor local, CORS y comparación de A/B | Prueba funcional end-to-end con red real satisfactoria |

La diferencia de **dos personas** entre la suma de los grupos del INE y el total nacional publicado para 2001 se conserva y se declara en la interfaz sin corrección artificial. No se presenta como una diferencia real significativa entre poblaciones.

## Comprobación de cobertura Eurostat
Se ensayaron los **15 países** inicialmente disponibles en la interfaz en los años **1960, 1971, 1990, 2001, 2009, 2020 y 2025**. Se realizaron así **105 combinaciones** de control de integridad de grupos/totales: **97 válidas y 8 sin un desglose quinquenal completo** en la API consultada.

Las ocho no válidas correspondieron a:
- Francia: 1960, 1971, 1990.
- España: 1960.
- Italia: 1960 y 1971.
- Polonia: 1971.
- Grecia: 1960.

Se ha corregido además el código geográfico de Grecia: **`EL`**, en lugar de `GR` para Eurostat. La falta de cobertura histórica no constituye, por sí misma, un error del conector. Las fechas comprobadas solo son una **muestra de siete años** y no permiten afirmar cobertura exhaustiva de todos los años 1960–2025.

## Mejoras implementadas en la lógica
- Las cohortes proceden exclusivamente de las categorías quinquenales oficiales, sin ceros imputados.
- Se comprueba que los grupos 0–4 a 85+ concilien con el total publicado por sexo, incluyendo en su caso las personas de edad desconocida documentadas.
- Cada país utiliza sus códigos oficiales Eurostat; se limita el máximo a 2025, último año publicado en la consulta verificada.
- El selector de año se actualiza consultando la serie real del país, **mostrando únicamente los años con pirámides completas**, cuando el catálogo está disponible. Los años incompatibles quedan excluidos; cuando falla el catálogo, se permite volver a intentar una consulta individual y se muestra advertencia.
- La selección de país, fuente o año cancela/invalida peticiones anteriores. Los resultados de una solicitud antigua no pueden sustituir a la elección actual.
- Las dos pirámides utilizan ejes simétricos y una misma escala horizontal al comparar A y B. Las diferencias de proporciones se expresan en **puntos porcentuales**.
- Se mantienen las tablas alternativas, la descripción morfológica condicionada, el intercambio de A/B, la descarga CSV/TXT y la impresión.

## Comprobaciones automáticas
Se han utilizado pruebas unitarias Node y pruebas Playwright con Chromium que abarcan normalización JSON-stat, edades históricas agregadas, errores por valores faltantes, validación de totales, INE, intercambio A/B, cambios durante consultas, comparación, exportación y un análisis automatizado axe-core de criterios WCAG A/AA. Se añaden pruebas reales de red con INE y Eurostat, diferenciadas de los ensayos con respuestas simuladas.

Pruebas representativas:
- [Integración real de INE y Eurostat (rama de reparación)](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/40674583451)
- [Cobertura de países y años en Eurostat](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/40674833630)
- [Conexiones reales desde Chromium](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/40674833607)

La evaluación automática **no equivale** a auditoría manual WCAG 2.2 AA ni a comprobación exhaustiva de todas las combinaciones futuras. Tampoco garantiza que los servicios externos permanezcan siempre disponibles.

## Alcance del INE y limitaciones
La conexión del INE utiliza la tabla nacional 56934 y **no ofrece por ahora comunidades autónomas, provincias o municipios**. Una ampliación territorial necesitará seleccionar la tabla apropiada y sus definiciones para mantener la comparabilidad. La diferencia de cobertura o metodología entre INE y Eurostat debe explicitarse en las comparaciones. El cambio de una estructura no identifica de forma causal natalidad, mortalidad o migraciones.

## Dictamen
**Se ha identificado y corregido el fallo de Alemania 2009 sin inventar datos, se ha comprobado la conexión del INE y se han reforzado validaciones, disponibilidad por año, cancelación de cargas y pruebas de interfaz.** La integridad de los datos queda sujeta a la fuente seleccionada y a las verificaciones de cada consulta. Este resultado es una auditoría técnica de alcance delimitado, no una certificación científica o de accesibilidad.
