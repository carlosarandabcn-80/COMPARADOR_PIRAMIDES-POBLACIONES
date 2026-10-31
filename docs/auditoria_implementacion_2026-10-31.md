# Auditoría de implementación: seis prioridades del Comparador de Pirámides
**Fecha:** 31 de octubre de 2026  
**Proyecto:** Estructura Social · Educación Social · UNIR (recurso independiente)  
**Alcance:** aplicación web de producción `index.html`, motor estadístico, documentación y pruebas.  
**Naturaleza del dictamen:** auditoría técnica reproducible con cobertura delimitada. No es una certificación científica o institucional.

## Resultado por prioridad

| Prioridad | Cambios incorporados | Criterio de revisión |
| --- | --- | --- |
| 1. Doce modelos | Nueva biblioteca `lab/morphology.mjs` con tres familias básicas y nueve subtipos o patrones docentes; representación SVG y ficha de límites. | Pruebas de 12 registros únicos, 18 bandas por diagrama; E2E de 12 tarjetas. |
| 2. Morfología mejorada | Reconocimiento de formas y marcadores adicionales de salientes, muescas, envejecimiento, asimetría y peso adulto. Parámetros explícitos. | Pruebas unitarias de patrones y límites; los umbrales son didácticos, no oficiales. |
| 3. Fuentes territoriales | INE 56934 España; INE 59238 CCAA 2026; INE 59589 Barcelona provincia 2026; Idescat oficial municipal 2025 para Barcelona y L'Hospitalet. | Verificación de integridad de cohortes, totales, fecha y procedencia; API real para Cataluña y provincia de Barcelona; validación de instantánea Idescat. |
| 4. Comparación A/B | Detección de tres mayores diferencias entre 17 intervalos quinquenales cerrados, tabla y resaltado sincronizado, diferencias expresadas en puntos porcentuales. | Pruebas E2E, exportaciones y verificaciones unitarias de indicadores. |
| 5. Fuentes y metodología | README, documentación de fundamentación, lectura comparada, enlaces oficiales y advertencias sobre clasificación, años, sexos y grupos abiertos. | Revisión de concordancia entre código, metadatos, tablas y documentación. |
| 6. Accesibilidad, integridad y regresiones | Tests Node, Playwright y axe; mejora del intercambio A/B asíncrono y de validación de años; revisión del servicio de caché (versión 8). | Pipeline de GitHub Actions con pruebas de navegador y accesibilidad automática, además de despliegue GitHub Pages. |

## Evidencias de ejecución sobre commit edd4cfceb7d765080af34356080b760e54e9119c
- [Verificación técnica, pruebas unitarias, navegador y axe: éxito](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/41192753151).
- [Comprobaciones reales INE España y Eurostat: éxito](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/41192753170).
- [Comprobaciones reales de Cataluña y Barcelona provincia en INE 2026: éxito](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/41192753160).
- [Publicación GitHub Pages: éxito](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/41192753028).
- [Extracción de fuente municipal Idescat 2025: éxito](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/41192551166).

Las modificaciones posteriores a dicho commit son de documentación. Para declarar una verificación de la última revisión se debe consultar siempre el estado del pipeline correspondiente al commit más reciente.

## Incidencias detectadas y corregidas

**INE 2025 territorial.** Las tablas consultadas no devolvían la totalidad de cohortes en el periodo 2025, aunque sí estaban completas para 2026 en Cataluña y Barcelona provincia. Los selectores territoriales se han limitado expresamente a 2026, evitando simular cobertura histórica.

**INE municipal.** La API de la tabla 69129 responde `No puede mostrarse por restricciones de volumen`. No se interpreta como dato ausente ni se fabrica una pirámide. En su lugar se utiliza el CSV oficial de Idescat para 2025, del que se han extraído 18 intervalos por sexo y municipio con control de sumas. Barcelona: 1.713.247 habitantes. L'Hospitalet: 292.161. Fuente: https://www.idescat.cat/serveis/consultes/es/censph_539_mun_2025_pc.csv .

**Año seleccionado.** Al pasar de INE a Idescat se selecciona un año permitido de forma explícita (2025), para que la aplicación no conserve 2001 u otro periodo sin datos municipales.

**Consultas asíncronas.** El intercambio de A/B invalida solicitudes antiguas y reconstruye las selecciones antes de intercambiar los datos cargados.

## Límites y riesgos pendientes

1. La biblioteca de doce perfiles es didáctica y **no representa doce clases oficiales**. Las nueve etiquetas adicionales pueden coexistir; ninguna certifica natalidad, mortalidad, migración o desigualdad social.
2. Las pruebas territoriales en vivo verificaron Cataluña y Barcelona provincia para 2026, pero no cada comunidad autónoma. Otras comunidades utilizan la misma operación oficial; la compatibilidad particular y las revisiones de series requieren controles adicionales.
3. La instantánea municipal de 2025 debe actualizarse explícitamente cuando se incorpore un año posterior: no se debe anunciar como datos en tiempo real.
4. El curso completo de accesibilidad WCAG 2.2 AA requiere auditoría manual con teclado, tecnologías de apoyo y dispositivos reales. La ausencia de errores detectados por axe no equivale a conformidad certificada.
5. El reconocimiento morfológico no ha sido sometido a estudio de validez con especialistas ni a evaluación de aprendizaje con estudiantes.
6. La publicación en GitHub Pages y las consultas externas dependen de disponibilidad de red y políticas de los proveedores.
7. La figura histórica de Tezanos (1960 y 2001) no se reproduce como microdato original; la clase superior del gráfico histórico (75+) difiere del 85+ de la aplicación.

## Dictamen
**Seis prioridades implementadas y verificación automatizada satisfactoria para las rutas y fuentes expresamente probadas.** El producto puede emplearse como recurso de descripción y comparación de estructuras demográficas con trazabilidad de fuentes, manteniendo las limitaciones anotadas. No procede declararlo validado científicamente, homologado por UNIR ni certificado como plenamente accesible.
