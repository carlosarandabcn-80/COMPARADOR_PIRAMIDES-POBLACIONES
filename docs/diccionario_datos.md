# Diccionario de datos e importación — v0.1 (26-10-2026)

## Esquema obligatorio

Formato CSV UTF-8 (delimitador coma, punto y coma o tabulador), con cabecera **grupo_edad,sexo,poblacion**. JSON admitido: array de 36 objetos o `{"metadatos":{...},"registros":[...]}`. Se permiten campos adicionales, aunque no se usan en los cálculos.

| Variable | Tipo | Valores válidos | Observaciones |
|---|---|---|---|
| grupo_edad | texto | 0-4, 5-9, 10-14, 15-19, 20-24, 25-29, 30-34, 35-39, 40-44, 45-49, 50-54, 55-59, 60-64, 65-69, 70-74, 75-79, 80-84, 85+ | 18 tramos exhaustivos y excluyentes; 85+ es abierto. |
| sexo | texto | H o M, nombres desarrollados admitidos | Reproduce las categorías suministradas por la fuente; no es una clasificación de identidad de género. |
| poblacion | entero | 0 a entero seguro de JavaScript | Se rechazan negativos, decimales, ausencias, duplicados y totales cero. |
| territorio | metadato declarado | texto | No se comprueba automáticamente en la fuente. |
| periodo | metadato declarado | texto | Obligatorio en la interfaz. |
| fuente | metadato declarado | texto, referencia/URL | Obligatorio en la interfaz. |

El conjunto contiene **exactamente 36 registros**, uno por combinación de tramo y sexo. El formato no acepta grupos 0-15 ni edades simples sin transformación previa. No debe distribuirse artificialmente un tramo incompatible sin explicitar el supuesto. El fichero CSV de ejemplo en `examples/datos-sinteticos.csv` es ficticio.

## Comprobaciones

Estructura, tramos permitidos, duplicados, cifras no negativas enteras, 36 combinaciones, total mayor que cero y desbordamiento aritmético. No se comprueban veracidad de procedencia, cobertura censal, consistencia externa, posibles diferencias de clasificación por sexo ni comparabilidad temporal/territorial. La interfaz **no** permite presentar un fichero importado como oficialmente verificado.

## Privacidad

El fichero se lee mediante la API del navegador: **no se sube** a un servidor. Debe evitarse incorporar datos personales en territorio, metadatos, comentarios o nombres de ficheros. Las respuestas redactadas solo se guardan en el navegador cuando se pulsa «Guardar localmente».

## Formato mínimo de dos filas (no importable por estar incompleto)

```csv
grupo_edad,sexo,poblacion
0-4,H,25
0-4,M,24
```

Para una importación válida, completar los otros 34 pares con recuentos no negativos. No se aceptan estimaciones de edades individuales derivadas sin justificación de grupos agregados.
