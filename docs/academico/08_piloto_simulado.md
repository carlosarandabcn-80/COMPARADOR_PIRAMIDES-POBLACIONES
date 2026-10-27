# Piloto simulado: ensayo reproducible del procedimiento de evaluación

DemoLab 2.0.1 · 27 de octubre de 2026 · DATOS SINTÉTICOS

## Qué se ha realizado

Por instrucción del promotor se omite el piloto real. Se ejecuta un ensayo informático con 40 registros ficticios por escenario. No se han reclutado personas, administrado cuestionarios ni observado uso real. Los resultados de este documento prueban un procedimiento de cálculo, no la hipótesis educativa del proyecto.

La simulación permite verificar asignación de grupos, conservación de identificadores, puntuaciones dentro de rango, tratamiento de ausencias y reproducción del resumen. No puede evaluar comprensión, accesibilidad, motivación, captación, fiabilidad entre correctores o validez de instrumentos.

## Generación y supuestos

Semilla fija 20261027. Python random.Random baraja veinte etiquetas laboratorio y veinte comparación. La puntuación previa de transferencia se genera como entero uniforme entre 5 y 14, en una escala prevista de 0 a 20. La posterior añade dos puntos de práctica común, ruido de la lista [-2, -1, 0, 0, 1, 2] y una ventaja adicional del grupo laboratorio que vale cero o dos según escenario. Se trunca el resultado a 0-20.

Se alternan etiquetas de forma AB/BA para probar su registro; no se simula equivalencia psicométrica ni efectos de forma. Un orden aleatorio fijo determina las pérdidas, independientemente del resultado. En los dos primeros escenarios se retiran cuatro registros y en el tercero catorce. Es una decisión del generador; no una tasa estimada de abandono.

Los tiempos de seis tareas y las etiquetas “sin ayuda”, “con ayuda” o “no completada” se generan aleatoriamente. No son tiempos de ejecución de la aplicación ni respuestas a los casos. Los registros incorporan synthetic=true, prefijo SIM y una advertencia visible. No hay nombres, contactos ni datos derivados de personas.

## Procedimiento de análisis ensayado

Se informa del número asignado, completo y perdido por grupo. Las medias previas para comparar cambio se calculan sobre los mismos registros que tienen posterior; también se conserva la media previa de todo el grupo en JSON. Post ausente se mantiene como null y no se sustituye por cero.

El cambio individual es post menos pre. La diferencia descriptiva es la media de cambio del laboratorio menos la de comparación. Un intervalo bootstrap percentil de 95 % utiliza 5 000 remuestras con reemplazo de los cambios dentro de cada grupo y semilla fija. Se entregan además intervalos de Wilson para la finalización. No se calculan valores p, no se ajustan modelos con múltiples predictores y no se toma una decisión de eficacia.

El bootstrap ilustra incertidumbre condicional al conjunto sintético y su mecanismo. No reproduce por sí mismo la aleatorización del estudio, sesgo de selección, agrupación por aula o ausencias informativas. El escenario de pérdidas no es una sensibilidad MNAR: sus pérdidas siguen siendo artificialmente independientes del resultado.

## Resultados exclusivamente sintéticos

### Escenario neutral

Ventaja adicional del laboratorio introducida por el generador: 0 puntos. Se reutiliza la misma base de registros; los escenarios no son cohortes independientes.

| Grupo ficticio | Asignados | Completos | Pre emparejado | Post | Cambio |
| --- | --- | --- | --- | --- | --- |
| laboratorio | 20 | 18 | 9.17 | 11.17 | 2.00 |
| comparacion | 20 | 18 | 10.61 | 12.89 | 2.28 |

Diferencia de cambios laboratorio menos comparación: -0.28 puntos. Intervalo bootstrap percentil 95 %: -1.06 a 0.56. Son números producidos por supuestos arbitrarios, sin valor como evidencia de eficacia.

### Escenario supuesto_mas_2

Ventaja adicional del laboratorio introducida por el generador: 2 puntos. Se reutiliza la misma base de registros; los escenarios no son cohortes independientes.

| Grupo ficticio | Asignados | Completos | Pre emparejado | Post | Cambio |
| --- | --- | --- | --- | --- | --- |
| laboratorio | 20 | 18 | 9.17 | 13.17 | 4.00 |
| comparacion | 20 | 18 | 10.61 | 12.89 | 2.28 |

Diferencia de cambios laboratorio menos comparación: 1.72 puntos. Intervalo bootstrap percentil 95 %: 0.94 a 2.56. Son números producidos por supuestos arbitrarios, sin valor como evidencia de eficacia.

### Escenario perdidas_altas

Ventaja adicional del laboratorio introducida por el generador: 0 puntos. Se reutiliza la misma base de registros; los escenarios no son cohortes independientes.

| Grupo ficticio | Asignados | Completos | Pre emparejado | Post | Cambio |
| --- | --- | --- | --- | --- | --- |
| laboratorio | 20 | 12 | 8.83 | 10.83 | 2.00 |
| comparacion | 20 | 14 | 10.36 | 12.64 | 2.29 |

Diferencia de cambios laboratorio menos comparación: -0.29 puntos. Intervalo bootstrap percentil 95 %: -1.05 a 0.48. Son números producidos por supuestos arbitrarios, sin valor como evidencia de eficacia.

## Interpretación del ensayo

El escenario neutral produce una diferencia cercana a cero sin imponer igualdad exacta entre pequeñas muestras. El escenario con +2 produce una ventaja porque el generador la introduce. El escenario con más pérdidas reduce los casos completos. Ninguno permite afirmar que DemoLab mejora el aprendizaje o que el procedimiento sea viable con alumnado real.

Los tres escenarios son ejemplos de funcionamiento, no una simulación Monte Carlo de potencia ni cobertura: no se repiten miles de estudios independientes. Las 5 000 remuestras bootstrap pertenecen a cada conjunto y no son 5 000 estudiantes ni 5 000 pilotos.

## Autocomprobaciones y reproducción

El generador pasó trece autocomprobaciones: reproducción con semilla fija, equilibrio y conservación de casos por escenario, intervalo degenerado de cambios idénticos, manejo de denominador cero y conjunto vacío, rechazo de identificador duplicado, puntuación fuera de rango, ausencia incoherente y fila que no se declara sintética. Estos controles no validan los supuestos psicológicos del generador.

En el proyecto se entrega scripts/simulate-pilot.py. Con Python 3 estándar, ejecutar `python scripts/simulate-pilot.py --self-test carpeta_salida` desde la carpeta del código produce los mismos datos y resultados. Se requiere conservar la versión de Python para reproducción byte a byte; el algoritmo y la semilla quedan documentados. Los JSON y el informe HTML se incluyen en piloto_simulado/.

## Anclajes operativos para el instrumento de siete tareas

Estos anclajes son propuestas originales para revisión. No se han calibrado con personas ni se ha medido fiabilidad. Una puntuación cero expresa ausencia o respuesta incorrecta; un dato que no se recogió se conserva como ausente en la base y no se corrige como cero automáticamente.

| Tarea | 0 puntos | 1 punto | 2 puntos |
| --- | --- | --- | --- |
| 1 Dependencias | Denominador conceptual incorrecto o sin respuesta | Fórmula apropiada con error aritmético o unidad incompleta | Tres valores correctos con fórmulas y por cada 100 de 15-64 |
| 2 Envejecimiento y proporción | Confunde ambos denominadores | Un indicador o distinción correctos | Ambos valores y diferencia de denominadores explícitos |
| 3 Cambio | Confunde puntos con cambio relativo | Solo uno correcto o falta unidad | Puntos porcentuales y cambio relativo correctos |
| 4 Inferencia | Equipara edad y dependencia funcional | Rechaza la equivalencia sin explicación suficiente | Rechaza, distingue conceptos y pide evidencia específica |
| 5 Hipótesis | Afirma causa por la forma | Una alternativa o fuente pertinente | Dos alternativas y fuente apta para contrastarlas |
| 6 Necesidades | Infiere necesidad o excluye participación | Pregunta pertinente o participación genérica | Pregunta no respondida por la pirámide y participación accesible concreta |
| 7 Plan | Objetivo sin fundamento o indicador inoperante | Objetivo condicional o indicador parcialmente operativo | Condición, resultado, fuente, plazo y línea base ausente explícitos |

La tarea principal de transferencia mantiene la rúbrica de cinco dimensiones y 0-20 de la guía docente. No se suman automáticamente la prueba 0-14, la transferencia 0-20 y la satisfacción: representan constructos y escalas diferentes. No se produce un índice global de “excelencia” a partir de ellos.

## Material para una eventual revisión externa

Se adjunta una ficha vacía en formato editable con criterio, evidencia, comentario, propuesta de cambio y decisión. No se rellenan nombres ni valoraciones ficticias. La revisión externa independiente permanece sin realizar. El protocolo real anterior se conserva como propuesta histórica, pero no se afirma que esté en ejecución.

La autorización para simular no implica autorización para contactar personas o instituciones, recoger datos o publicar resultados atribuidos a participantes. No se ha realizado ninguna de esas actuaciones.
