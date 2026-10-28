# Guía de uso · Laboratorio demográfico

## Abrir y empezar
Abre la raíz de GitHub Pages. Pulsa «Iniciar análisis» para acceder a los modelos sintéticos. Los valores son ficticios y no describen ningún municipio. El comparador de la versión anterior sigue accesible desde «Comparador clásico».

## Explorar y comparar
Selecciona una de cuatro estructuras, alterna porcentajes/efectivos y destaca edades. Bajo el gráfico hay una tabla completa y nueve indicadores. La dependencia demográfica se refiere a una relación de edades, no a dependencia funcional.

Selecciona un segundo modelo, observa las diferencias relativas y usa «Intercambiar poblaciones». Si intentas comparar una población sintética con datos aportados u oficiales, el laboratorio bloquea la comparación numérica.

## Investigar e intervenir
Las reglas R01–R04 exponen dato, interpretación, hipótesis, comprobaciones pendientes, propuesta condicional y limitación. La ficha inferior permite documentar necesidad investigable, derechos y participación, hipótesis, actuación e indicadores. Guarda la ficha solo si confías en el dispositivo: se almacena en el navegador.

## Aprendizaje
En «Aprender» hay seis casos de reflexión crítica. Responde Sí/No para obtener retroalimentación y completa la actividad abierta de cada caso. El ejercicio no equivale a una prueba psicométrica validada.

## Fuentes e importación
Consulta los datos anuales nacionales de Eurostat bajo demanda. Si no se reciben todas las edades y ambos sexos, aparecerá un error y no se completarán cifras artificialmente.

Importa CSV o JSON propios. CSV: columna «edad», «hombres», «mujeres», 18 filas en orden 0-4,5-9,…,85+. Usa enteros no negativos. Ejemplo:
```csv
edad,hombres,mujeres
0-4,10,11
5-9,12,12
```
El ejemplo **es incompleto**; deben añadirse todas las edades. No introduzcas datos personales. El archivo importado se identifica como fuente aportada, no oficial.

## Informe y exportación
El botón de informe descarga un documento TXT con fórmulas, tablas, limitaciones y ficha. El botón PDF abre la función de impresión del navegador, cuyo resultado depende de la configuración. Es responsabilidad del autor revisar referencias antes de su presentación académica.

## Privacidad y accesibilidad
La nueva aplicación no utiliza cookies publicitarias. La ficha se guarda en localStorage local; borra los datos del sitio para eliminarla. Los gráficos tienen tablas accesibles, controles identificados y navegación por teclado. Una evaluación completa con tecnologías de apoyo sigue pendiente.
