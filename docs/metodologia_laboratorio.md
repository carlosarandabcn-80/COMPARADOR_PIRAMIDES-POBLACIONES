# Metodología estadística y socioeducativa del laboratorio

**Versión experimental 0.1 · 26 de octubre de 2026.** Este documento describe el código de \`assets/demografia-core.js\`, no una validación empírica. Se diferencian *dato*, *regla*, *interpretación*, *hipótesis* y *propuesta*.

## Datos y denominadores

Para cada conjunto, \`N = Σ(H_i + M_i)\`, con 18 intervalos: 0–4 a 80–84 y 85+. \`J=Σ(0–14)\`, \`A=Σ(15–64)\`, \`V=Σ(65+)\`. Los porcentajes se calculan sobre N y no sobre cada sexo. Las barras representan la proporción de hombres o mujeres de una cohorte respecto del **total del territorio**; A y B usan el mismo máximo visual en porcentaje. Para dos territorios con tamaños muy diferentes, se comparan preferentemente porcentajes y no anchos de recuentos absolutos.

| Indicador | Fórmula implementada | Alcance |
|---|---|---|
| Proporción juvenil | 100 × J/N | Edad 0–14 |
| Proporción de mayores | 100 × V/N | Edad 65+ |
| Dependencia juvenil | 100 × J/A | Demográfica, no funcional |
| Dependencia de mayores | 100 × V/A | Demográfica, no funcional |
| Dependencia total | 100 × (J+V)/A | No es relación directa entre personas empleadas y no empleadas |
| Índice de envejecimiento | 100 × V/J | Si J=0, se informa «No calculable» |
| Relación de sexos | 100 × ΣH/ΣM | No equivale a composición de identidades de género |
| Diferencia de porcentajes | %B − %A | Unidad: **puntos porcentuales**, no porcentaje de cambio |

**Advertencia metodológica esencial.** El INE define sus indicadores demográficos básicos de dependencia e índice de envejecimiento con población **menor de 16 años** frente a **16–64 años**, y 65+. Este laboratorio utiliza el corte **0–14/15–64/65+**, apropiado para grupos quinquenales. **Los resultados no son los indicadores oficiales INE ni se deben presentar como tales**. Para cumplir exactamente la definición del INE harían falta recuentos desagregados de la cohorte 15–19 u otra fuente armonizada. Véanse la [metodología INE](https://www.ine.es/metodologia/t20/metodologia_idb.pdf), la [definición INE de dependencia](https://www.ine.es/DEFIne/concepto.htm?c=5098) y la [definición INE de envejecimiento](https://www.ine.es/DEFIne/concepto.htm?c=5097).

## Cadena de evidencia

1. **Observación:** proporciones y diferencias calculadas de manera reproducible.
2. **Interpretación:** significado demográfico, sin atribución automática de causas.
3. **Hipótesis alternativas:** posibles mecanismos (cohortes, migraciones, fecundidad, mortalidad), que se deberán contrastar.
4. **Necesidades por investigar:** no deducidas directamente de la pirámide; se estudian con datos de servicios, recursos, desigualdad y prioridades expresadas.
5. **Investigación participativa:** entrevistas, datos administrativos y deliberación con agentes comunitarios.
6. **Diseño condicionado:** actividades y objetivos solo tras establecer el diagnóstico.
7. **Evaluación:** indicadores de proceso y resultado; impacto atribuible solo con un diseño adecuado.

La regla de lectura automática R-01 calcula una proporción; R-02 resta porcentajes. **No hay un algoritmo oculto de diagnóstico social ni recomendación causal**. La intervención se redacta por el usuario, no se predetermina para grupos de edad.

## Naturaleza y comparabilidad

- Los tres conjuntos precargados son **ficticios**. Los cálculos son exactos para esos recuentos de simulación, pero no describen poblaciones reales.
- Los datos externos se importan y validan estructuralmente, **sin contraste externo de autenticidad**.
- Antes de comparar fuentes reales deben comprobarse fecha, unidad espacial, definiciones, cobertura, método de producción y sexos disponibles. **La interfaz no certifica tal comparabilidad.**
- La impresión de un informe es un borrador académico y debe revisarse. No incorpora automáticamente referencias bibliográficas detalladas del fichero importado.

## Fuentes de referencia

Instituto Nacional de Estadística (INE). *Indicadores demográficos básicos: metodología*. https://www.ine.es/metodologia/t20/metodologia_idb.pdf

Instituto Nacional de Estadística (INE). *Pirámide de población en España*. https://www.ine.es/aplicaciones/piramides/piramides.htm

W3C. *Web Content Accessibility Guidelines (WCAG) 2.2*. https://www.w3.org/TR/WCAG22/

CAST (2024). *Universal Design for Learning Guidelines, version 3.0*. https://udlguidelines.cast.org/
