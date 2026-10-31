# Comparador de pirámides poblacionales · Estructura Social (UNIR)

**Reorientación del proyecto · 28 de octubre de 2026.**

## Finalidad y delimitación
El objeto de la herramienta es exclusivamente **describir y comparar pirámides de población** elaboradas con fuentes estadísticas oficiales. El itinerario sigue el material de estudio del proyecto de Estructura Social de la UNIR disponible como «Guía de examen: Tezanos · 11 pirámides españolas» y las pautas de examen de la asignatura.

Se han retirado de la interfaz principal la ficha de intervención, los casos de intervención socioeducativa, las recomendaciones de actuación, las propuestas de investigación educativa y el informe genérico de innovación; eran ajenos a la función principal solicitada.

**Distinción metodológica:** los dibujos expansiva/estacionaria/regresiva de la sección «Tipos» son esquemas conceptuales sin valores estadísticos; solo las pirámides de la sección «Comparar» utilizan efectivos observados. No se mezclan gráficos ficticios y datos reales.

## Conceptos docentes derivados del material de Estructura Social
- Pirámide de población: distribución de efectivos por grupos de edad y sexo, según las categorías de cada fuente.
- Elementos: base (edades jóvenes), tronco/cuerpo (cohortes adultas), cúspide (edades mayores), simetría por sexo, salientes y muescas.
- Tipologías básicas: **expansiva** (base relativamente ancha); **estacionaria** (base y cuerpo próximos); **regresiva** (base estrecha respecto a edades adultas). «Transición/mixta» expresa formas que combinan rasgos, sin imponer etiquetas absolutas.
- El Gráfico 1 asociado a Tezanos y estudiado en el proyecto compara España en **1960 y 2001**. Su reproducción estadística exacta no está incorporada; para comparar fechas históricas se consultan datos reales a través de las fuentes oficiales.

El criterio automático «compatible con expansiva/estacionaria/regresiva» es una regla **operativa didáctica**, no una tipología oficial ni un diagnóstico científico. Utiliza el cociente entre efectivo medio por cohorte de 0–14 y efectivo medio por cohorte de 30–44; la etiqueta expansiva requiere además proporción 65+ menor del 15 %. Umbrales: expansiva ≥1,25; regresiva ≤0,8; estacionaria/transición en el rango intermedio. Ningún umbral se atribuye al INE, Eurostat o UNIR. Debe leerse junto con el gráfico.

## Fuente 1. Eurostat
Tabla **demo_pjangroup**: *Population on 1 January by age group and sex*.
Ficha: https://ec.europa.eu/eurostat/databrowser/view/demo_pjangroup/default/table?lang=en

La aplicación solicita país, año, sexo masculino/femenino y grupos de edad oficiales con la API JSON-stat. Utiliza directamente 0–4, …, 80–84 y la categoría abierta Y_GE85 (85+) de Eurostat; no necesita sumar edades simples incompletas. Los valores faltantes bloquean la pirámide. Puede obtener datos de los países incluidos por Eurostat siempre que estén disponibles para ese año.

## Fuente 2. INE
Tabla **56934**: *Población residente por fecha, sexo y edad (desde 1971)*. Operación Estadística Continua de Población; ámbito nacional.
Ficha: https://www.ine.es/jaxiT3/Tabla.htm?t=56934
Descripción/API: https://www.ine.es/dyngs/DAB/index.htm?cid=1100

La consulta filtra expresamente **1 de enero del año elegido** mediante `date=AAAAMMDD:AAAAMMDD` y `tip=A`, con respuesta JSON de 327 series. Se seleccionan únicamente registros de hombres/mujeres del total nacional, edades 0 a 99 y categoría agregada **100 y más años**. El INE también distribuye edades individuales de 100 a 104 y 105+; **no se suman a la categoría 100+**, porque produciría duplicaciones. Se contrasta la suma de cohortes con el total publicado. Las discrepancias oficiales mínimas, cuando aparecen, se conservan y se documentan sin imputación de datos.

La serie puede incorporar cambios de base o revisiones históricos; el usuario debe comprobar las notas oficiales. Las solicitudes del navegador al INE usan su API pública con política CORS de la respuesta consultada; si el servicio es inaccesible, la aplicación muestra el fallo sin generar cifras alternativas.

## Comparación y fórmulas
- Cada pirámide representa hombres a la izquierda y mujeres a la derecha con **eje horizontal simétrico**.
- Escala normalizada: barra en porcentaje de **toda la población** del conjunto = 100 × personas de sexo y edad / población total.
- Escala absoluta: personas por sexo y grupo de edad. **Las dos pirámides comparten el máximo horizontal**, tanto en porcentajes como en absolutos.
- Menores 0–14, edades 15–64 y personas 65+ expresados como porcentaje del total.
- Índice de envejecimiento = personas 65+ / menores 0–14 × 100.
- Razón de dependencia demográfica total = (menores 0–14 + personas 65+) / personas 15–64 × 100.
- Los denominadores cero se muestran como «No calculable». La razón de dependencia demográfica no mide capacidad funcional ni inactividad económica.
- Al restar porcentajes, la diferencia se expresa en **puntos porcentuales**, nunca en porcentaje de crecimiento.

Se comparan perfiles, efectivos y porcentajes. La propia forma no identifica tasas de natalidad, migración, mortalidad o desigualdad. Estas explicaciones requieren datos longitudinales y otro tipo de variables.

## Límites y ética académica
Los comentarios se generan mediante reglas matemáticas explícitas, sin modelos de lenguaje externos. No existe reconocimiento institucional implícito. La guía docente estudiada distingue el corte de España 1960 y 2001 en Tezanos, pero no debe usarse para asignar datos reales a los esquemas didácticos.

Las pautas del examen de la asignatura suministradas indican que **no se permite consultar internet ni utilizar inteligencia artificial durante el examen**. Esta herramienta sirve para la preparación y el estudio, respetando esas condiciones.

## Verificación reproducible
Pruebas unitarias en `tests/comparison.test.mjs`, pruebas de navegador `tests/lab.e2e.spec.mjs`, análisis automático axe-core, y prueba real de endpoints `scripts/verificar-fuentes.mjs`. La automatización no acredita por sí sola conformidad total WCAG 2.2 AA ni eficacia académica.

La licencia del software nuevo se especifica en `LICENSE`; los derechos de fuentes oficiales y contenidos docentes pertenecen a sus titulares.

## Lectura comparada ampliada (octubre de 2026)
La aplicación incorpora una lectura determinista y reproducible con nueve apartados: identificación, morfología, composición por edad, mayores diferencias quinquenales, distribución por sexo en mayores, índices, comparabilidad temporal/territorial, marco de Estructura Social y síntesis. Se ofrece además una versión abreviada de estudio y una matriz accesible con los 18 grupos. Las diferencias de porcentajes se expresan en puntos porcentuales; la evolución del volumen solo se describe cuando coinciden territorio y fuente y cambian fechas. El nuevo método no infiere causas de una muesca ni convierte diferencias entre fuentes en cambios demográficos. Véase [Protocolo de lectura comparada académica](lectura_comparada_academica.md).

## Ampliación de tipología y análisis (31 de octubre de 2026)
La biblioteca visible consta de 12 perfiles, agrupados en 3 **familias morfológicas** y 9 **subtipos/patrones adicionales**. Cada ficha identifica su condición conceptual, definición y límites. Los dibujos SVG son ejemplos esquemáticos; solo el área de comparación representa poblaciones observadas.

**Reconocimiento:** se calcula la relación de efectivos medios de 0–14 frente a 30–44 (ambos tienen tres intervalos quinquenales); expansiva compatible cuando relación ≥1,25 y 65+ <15 %, regresiva compatible cuando ≤0,80, estacionaria/transición entre ambos. Como marcadores separados se utilizan 65+ ≥25 %, base muy estrecha (<0,55), salientes ≥18 % y muescas ≥18 % respecto a la media de tramos contiguos cerrados, concentración o déficit de 20–39 frente a 40–59 y asimetría femenina 65+ (≥60 % o ≤40 %). **Todos estos umbrales son decisiones didácticas operativas, no estándares oficiales ni diagnósticos validados.** Un patrón puede coexistir con cualquier familia.

Las tres diferencias principales entre poblaciones A/B se calculan sobre porcentajes de cada territorio y abarcan únicamente las 17 clases quinquenales cerradas; el 85+ sigue en los totales y tablas, pero se excluye del ranking por anchura desigual.

Se añaden conectores a INE 59238 (comunidades), 59589 (provincias) y 69129 (censo municipal de la provincia de Barcelona). Para cada operación se seleccionan edades por sexo y año y se exige integridad de los 18 grupos; los años de cobertura y el servicio deben verificarse mediante las comprobaciones en vivo. La ausencia de dato bloquea el gráfico, sin interpolación ni ceros supuestos.

**Fuentes:** https://www.ine.es/jaxiT3/Tabla.htm?t=59238 · https://www.ine.es/jaxiT3/Tabla.htm?t=59589 · https://www.ine.es/jaxiT3/Tabla.htm?t=69129 · https://ec.europa.eu/eurostat/databrowser/view/demo_pjangroup/default/table · Tezanos (2004), https://dialnet.unirioja.es/descarga/articulo/1036609.pdf .
