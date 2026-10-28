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

La aplicación solicita país, año, sexo masculino/femenino y grupos de edad oficiales con la API JSON-stat. Agrupa 0–4, …, 80–84 y 85+ (incluye la categoría abierta Y_OPEN, habitualmente 100+). Los valores faltantes bloquean la pirámide. Puede obtener datos de los países incluidos por Eurostat siempre que estén disponibles para ese año.

## Fuente 2. INE
Tabla **56934**: *Población residente por fecha, sexo y edad (desde 1971)*. Operación Estadística Continua de Población; ámbito nacional.
Ficha: https://www.ine.es/jaxiT3/Tabla.htm?t=56934
Descripción/API: https://www.ine.es/dyngs/DAB/index.htm?cid=1100

La consulta filtra expresamente **1 de enero del año elegido** mediante `date=AAAAMMDD:AAAAMMDD` y `tip=A`, con respuesta JSON de 327 series. Se seleccionan únicamente registros de hombres/mujeres del total nacional, edades 0 a 99 y categoría agregada **100 y más años**. El INE también distribuye edades individuales de 100 a 104 y 105+; **no se suman a la categoría 100+**, porque produciría duplicaciones. Se valida que la suma de cohortes coincide con el total de población publicado en la tabla.

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
