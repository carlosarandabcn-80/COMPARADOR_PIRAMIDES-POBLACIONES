# Diccionario de datos y fórmulas

## Universo y procedencia

Se incluyen España y Portugal a 1 de enero de 2023 y 2024, de Eurostat demo_pjan. NR significa personas residentes; M y F se conservan según la fuente, sin interpretar identidad de género. Se agrupan edades cumplidas: Y_LT1 es edad cero, Y1 a Y84 forman los intervalos quinquenales y 85+ agrega Y85 a Y99 e Y_OPEN. UNK se comprueba igual a cero. La suma debe coincidir exactamente con TOTAL de cada sexo.

Actualización de fuente: 25 de septiembre de 2026. Descarga: 27 de octubre de 2026. SHA-256: 79fd18acb42b1afc4def14acdfd6c8646d8645a59ef9075bdd96e4ef9aaf1640. La huella define la instantánea, que no se presenta como el último dato en tiempo real.

| Campo | Tipo y significado |
|---|---|
| id | Texto único del conjunto |
| territory y territoryCode | Etiqueta legible y código estable |
| year y referenceDate | Año y fecha; en modelos, edición y ausencia explícita de fecha real |
| kind | observed, synthetic, scenario o projection |
| unit | persons; recuentos, no porcentajes |
| source y sourceUrl | Organismo y URL https |
| updated y retrieved | Actualización y descarga declaradas |
| version y rawSha256 | Versión y huella cuando existe |
| method y sexDefinition | Universo, transformación y clasificación por sexo |
| limitations | Lista de límites, separados por barra vertical en CSV |
| license | Condiciones declaradas, opcionales para importación |
| total | Entero positivo igual a la suma de recuentos |
| rows | Lista de 18 registros ordenados de 0-4 a 85+ |
| age | Etiqueta exacta del intervalo |
| male y female | Enteros no negativos sin valores ausentes |
| imported | Marcador interno de procedencia declarada sin autenticar |

## Fórmulas

Pj = 0-14; Pa = 15-64; Pm = 65+; P = población total; H y M = categorías estadísticas de hombres y mujeres.

| Indicador | Fórmula | Interpretación |
|---|---|---|
| Dependencia juvenil | 100 × Pj / Pa | Personas de 0-14 por 100 de 15-64 |
| Dependencia de mayores | 100 × Pm / Pa | Personas de 65+ por 100 de 15-64 |
| Dependencia total | 100 × (Pj + Pm) / Pa | Suma de relaciones demográficas |
| Envejecimiento | 100 × Pm / Pj | Personas de 65+ por 100 de 0-14 |
| Proporción infantil | 100 × Pj / P | Porcentaje del total |
| Proporción de mayores | 100 × Pm / P | Porcentaje del total |
| Razón por sexo | 100 × H / M | Hombres por 100 mujeres |
| Razón por sexo en 65+ | 100 × M65+ / H65+ | Mujeres por 100 hombres de 65+ |

Dependencia demográfica no mide discapacidad, cuidados necesarios o actividad económica. El grupo 0-14 no representa todos los menores legales de 18. El envejecimiento no mide directamente reemplazo generacional. El INE puede usar cortes de edad distintos en indicadores publicados; no se debe exigir igualdad con una tabla que utilice menores de 16 y población de 16-64.

Diferencia absoluta = B − A. Para proporciones se expresa en puntos porcentuales. Diferencia relativa = 100 × (B − A) / A. Un denominador cero produce null y N/D, nunca Infinity o un cero artificial. Los resultados se presentan con dos decimales, sin redondeo intermedio.

## Modelos y escenarios

Los trece perfiles heredan pesos del comparador y se normalizan a 100 000 personas ficticias con restos mayores. El nombre histórico solo se conserva como procedencia; no describen países o municipios. 2026 es la edición didáctica.

El escenario ejecuta una transición quinquenal. P′(i,s) = redondeo[P(i−1,s) × q] en 5-9 a 80-84; 85+ acumula 80-84 y 85+ multiplicados por q. En 0-4 introduce B nacimientos supervivientes y en 25-29 añade M entradas. B y M se reparten 50/50; un resto impar se asigna a la segunda categoría. El redondeo puede cambiar el total en unas unidades frente a un modelo continuo. No hay fecundidad por edad, emigración, mortalidad diferencial o calibración predictiva.

## Importación

CSV exige coma, comillas estándar y metadatos idénticos dentro de cada ID; admite BOM y CRLF. JSON acepta un objeto o lista del esquema. No se admiten directamente JSON-stat o CSV genéricos del INE: deben adaptarse sin perder fuentes, universos y totales.

Se rechazan vacíos, negativos, decimales, duplicados, grupos incompatibles, totales inconsistentes y límites superiores a 50 conjuntos o 2 MB. No se reparte proporcionalmente un intervalo que cruce 15 o 65. La validación comprueba consistencia, no autenticidad de la URL o verdad empírica.

La exportación CSV antepone un apóstrofo a textos que puedan ejecutarse como fórmulas al abrirlos en una hoja de cálculo. Para fidelidad literal de etiquetas que empiecen por =, +, -, @ o tabulación, conservar también JSON.
