# Protocolo de lectura académica comparada de pirámides
Estructura Social · Grado en Educación Social · UNIR · 28 de octubre de 2026

## Procedencia y delimitación
El marco de descripción se basa en la guía de estudio del proyecto «Guía de examen: Tezanos · 11 pirámides españolas», que sintetiza el Tema 1 de Estructura Social: base, cuerpo/tronco, cúspide, composición por sexo y edades, y tipologías expansiva, estacionaria y regresiva. Se recoge igualmente la distinción entre niveles micro, meso y macro.

La guía de 11 modelos es un material didáctico elaborado para el proyecto: sus modelos históricos no son reproducción de microdatos censales. La nueva lectura utiliza exclusivamente recuentos oficiales de INE y Eurostat. El Gráfico 1 sobre España de 1960 a 2001 de Tezanos funciona como referencia de comparación temporal, no como fuente de los efectivos actuales.

Las pautas de examen de la asignatura (documento UNIR facilitado, profesor Antonio Jesús Acevedo) establecen una extensión máxima de una cara para el caso práctico, que puede incluir un gráfico visto en clase. La aplicación permite generar una síntesis para practicar. Las mismas pautas impiden consultar internet o utilizar sistemas de IA DURANTE el examen.

## Arquitectura de la interpretación
1. **Identificación**. Fuente, país, fecha, efectivo total, criterio de comparación y unidad.
2. **Morfología**. Base (0–14), cuerpo (15–64), cúspide (65+), pico quinquenal y clasificación de forma; el esquema expansivo/estacionario/regresivo se presenta como interpretación didáctica, no taxonomía oficial.
3. **Composición**. Porcentajes de los tres grandes grupos con idéntico denominador, la población total de edades conocidas.
4. **Divergencias quinquenales**. Diferencia A−B para los 18 grupos publicados; el ranking de las tres mayores diferencias se calcula solo entre los 17 intervalos quinquenales cerrados. El tramo 85+ permanece visible y computa en los totales, pero no es directamente comparable por anchura a una cohorte de cinco años.
5. **Asimetría por sexo**. Porcentaje de mujeres dentro del grupo de 65+, distinto del porcentaje de mujeres de toda la población.
6. **Índices**. Envejecimiento y dependencia demográfica, distinguiéndolos de dependencia funcional y desempleo.
7. **Comparabilidad**. Se separan contraste entre dos fechas de un mismo territorio y fuente, territorial en el mismo año, dos operaciones estadísticas para una misma población, o comparación heterogénea.
8. **Lectura de Estructura Social**. Relación con preguntas pertinentes sobre generaciones, instituciones y organización social, sin inferir desde el gráfico desigualdad, clase, pobreza o necesidades profesionales concretas.
9. **Conclusión**. Diferencias centrales con límites de inferencia explícitos.

## Indicadores reproducibles
Sea N el total poblacional con edad conocida, N_i el total de personas de la clase i y N_{i,s} el efectivo por sexo.

- Porcentaje quinquenal = 100 × N_i / N.
- Diferencia quinquenal = 100 × N_i(A)/N(A) − 100 × N_i(B)/N(B), en PUNTOS PORCENTUALES.
- Índice de envejecimiento = 100 × N(65+) / N(0–14).
- Dependencia demográfica total = 100 × [N(0–14)+N(65+)] / N(15–64).
- Porcentaje de mujeres de 65+ = 100 × N(65+,mujeres) / N(65+).
- Variación del volumen en comparación temporal homogénea = 100 × (N posterior − N anterior) / N anterior.

El tramo superior 85+ es abierto. Ningún indicador puede desagregarlo internamente ni compararlo como si tuviera cinco años de amplitud. Los denominadores cero se expresan como NO CALCULABLE. Se calcula sobre efectivos originales y solo se redondea al mostrar resultados.

## Riesgos analíticos
Dos intervalos 30–34 observados con años de distancia representan cohortes de nacimiento distintas, no seguimiento longitudinal de personas. Una muesca no demuestra por sí sola conflicto bélico, migración ni caída de nacimientos. Diferentes fuentes pueden mostrar datos distintos por población de referencia, metodología o revisión. La variación temporal del volumen tampoco permite atribuir causas.

En el Tema 1, la población constituye una dimensión de la estructura social y admite lecturas macro (población, economía, Estado), meso (instituciones y grupos) y micro (trayectorias de vida). Estas relaciones se plantean como interrogantes contrastables y NO como conclusiones derivadas automáticamente de una distribución por edad y sexo.

## Implementación y verificación
Módulo puro: lab/academic-reading.mjs.
Cálculos y fuentes: lab/comparison-core.mjs.
Integración: lab/comparison-ui.mjs.
Pruebas deterministas: tests/academic-reading.test.mjs.
Pruebas navegador: tests/lab.e2e.spec.mjs.

## Fuentes de datos oficiales
INE. Población residente por fecha, sexo y edad (tabla 56934). https://www.ine.es/jaxiT3/Tabla.htm?t=56934
Eurostat. Population on 1 January by age group and sex (demo_pjangroup). https://ec.europa.eu/eurostat/databrowser/view/demo_pjangroup/default/table?lang=en

Documento de base: UNIR. Estructura Social. Pautas para el examen final de la asignatura (material facilitado en el proyecto). No se afirma que UNIR haya evaluado o autorizado el software.

## Complemento de octubre de 2026
El comentario morfológico identifica ahora patrones adicionales mediante reglas reproducibles: salientes, muescas, concentración o déficit de adultos jóvenes, perfiles invertidos, envejecimiento intenso y asimetría en edades mayores. No se infieren causas históricas ni se transforman los patrones en grupos oficiales. La selección «Diferencias A/B» destaca simultáneamente tres cohortes cerradas con mayor diferencia absoluta en puntos porcentuales y preserva el grupo abierto 85+ en el análisis cuantitativo general. La trazabilidad exige comprobar tabla, territorio, año y categoría de fuente, particularmente en cruces entre operaciones estadísticas.
