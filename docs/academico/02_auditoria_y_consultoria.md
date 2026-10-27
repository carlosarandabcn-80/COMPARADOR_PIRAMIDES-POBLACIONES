# Informe de auditoría y consultoría del laboratorio de demografía aplicada a la Educación Social

DemoLab 2.0.0 · 27 de octubre de 2026

## Dictamen y alcance

La versión desarrollada permite reproducir análisis demográficos y organizar preguntas e intervenciones condicionales. Se han corregido defectos de normalización, escala, interpretación y exportación, y se han ejecutado pruebas de cálculo y de flujos reales de navegador. Puede presentarse para revisión académica y uso docente exploratorio supervisado. No hay evidencia de eficacia educativa, revisión experta concluida o conformidad integral WCAG.

Esta consultoría global es una evaluación interna del trabajo. La revisión de seguridad contó además con auditores independientes de código dentro del mismo entorno de desarrollo; no equivale a una auditoría institucional externa o certificación. La revisión externa global solicitada como aspiración del proyecto sigue pendiente de un equipo ajeno al desarrollo.

La revisión inicial corresponde al commit 02d7b38333db23f8b2f0515c68b1e1c8dd98d0ae del repositorio original. Se conservan una etiqueta recuperable y el paquete histórico. La versión final se identifica mediante package.json, historial Git y manifiesto de hashes incluido en la entrega. Las pruebas se refieren a esos archivos, no a una eventual modificación posterior.

## Situación inicial comprobada

Se inspeccionaron todos los archivos de primera parte del repositorio, la documentación, el cargador, el HTML descomprimido y la aplicación publicada. Se observó la pantalla principal y se cambió el modelo seleccionado a rural, verificando la actualización del título y comentario. Esa observación no se presenta como prueba exhaustiva de cada botón antiguo.

La aplicación publicaba un cargador que descargaba Base64/Gzip, requería DecompressionStream y sustituía el documento con document.write. El código descomprimido contenía trece perfiles y comentarios predefinidos. Los indicadores aparecían como fórmulas documentales, sin un módulo que los calculase para cada selección. Existían comparación, comentarios, TXT, portapapeles, impresión, persistencia y ajustes visuales o de voz, que se conservaron o evolucionaron.

Los pesos sumaban los siguientes valores antes de la normalización:

| Identificador histórico | Suma de pesos |
|---|---:|
| expansiva | 83,87 |
| stationary | 89,81 |
| spain | 100,03 |
| europa | 100,44 |
| rural | 67,20 |
| metro | 93,17 |
| university | 74,17 |
| litoral | 90,88 |
| crisis | 80,07 |
| baby | 103,38 |
| japan | 106,95 |
| niger | 89,58 |
| industrial | 91,26 |

Presentarlos como porcentajes de un mismo universo resultaba incoherente. El perfil España utilizaba recuentos y un total sin una procedencia verificable completa en el paquete; no se mantuvo como dato observado. Los nombres de países se sustituyeron por nombres didácticos. La transformación conserva formas relativas y un total ficticio de 100 000 por perfil, con restos mayores y sin atribución territorial.

La fórmula gráfica anterior usaba una distancia para las marcas del eje y otra 12 píxeles menor para las barras; además podía calcular máximos distintos en las dos pirámides comparadas. Se sustituyeron por una transformación compartida y una escala común. Algunos textos pedían una tesis causal y derivaban necesidades o consecuencias institucionales de la forma. Se retiraron esas conclusiones prefijadas y las referencias de afiliación o anclaje curricular no acreditadas.

## Arquitectura y decisiones de conservación

Se mantiene una aplicación estática apta para GitHub Pages. Las fuentes ahora son legibles: núcleo, entrada/salida, contenidos y aplicación. El paquete anterior queda como evidencia y no se ejecuta. La retirada de la caché histórica se limita a los nombres identificados; no se promete funcionamiento sin conexión. Las funciones útiles se conservan: modelos, comparación, comentarios, impresión, TXT, portapapeles, voz y ajustes.

Se añaden recuentos reales con metadatos, ocho cálculos, escalas homogéneas, superposición, tabla accesible, selección de edades, dos cortes temporales, importación validada, cuaderno, casos e informe. La simulación es una transición quinquenal documentada, no una predicción. No se añaden cuentas, servidor de datos, IA generativa o recogida de estudiantes, porque no son necesarias para el objetivo actual y aumentarían mantenimiento y riesgos.

## Verificación estadística

Se ejecutaron 70 pruebas del núcleo con Node. El registro TAP está incluido. Las pruebas cubren resultados conocidos, los diecisiete conjuntos, integridad de totales, normalización, porcentajes, razones, denominadores cero, diferencias absolutas y relativas, escalas, grupos incompatibles, escenarios, contrato CSV/JSON, fechas, metadatos opcionales, persistencia y regresiones de seguridad.

El ejemplo de referencia tiene 200 jóvenes, 600 personas de 15-64 y 200 mayores: dependencias juvenil y de mayores 33,333…, total 66,666…, envejecimiento 100 y proporciones 20 %. Se utilizan tolerancias pequeñas para comparaciones de coma flotante, no igualdades exactas artificiales entre operaciones equivalentes. No se redondea antes de calcular.

Se verificó que cada conjunto oficial coincide con TOTAL de hombres y mujeres de la respuesta guardada, que UNK es cero y que la suma de edades forma el total. No se hicieron aproximaciones proporcionales para intervalos incompatibles. La dependencia se define con 0-14, 15-64 y 65+, que puede diferir de indicadores del INE con cortes distintos.

## Pruebas de integración en navegador

La última batería produjo 22 comprobaciones correctas y cero fallidas. Se ejecutó en el navegador integrado del entorno de trabajo, con un ejecutor local que carga una instancia de la aplicación. Sus resultados y los detalles de axe se conservan como JSON. No se presenta como cobertura de todos los navegadores.

| Área | Evidencia ejecutada |
|---|---|
| Selección y periodos | Cambio de territorio/año actualiza título, métricas, tabla y denominador |
| Visualización | Absolutos/relativos, escala proporcional y ampliación de 65+ |
| Comparación | Misma escala, contornos y actualización al intercambiar A/B |
| Razonamiento | Reglas visibles, revisión de campos y vínculo del cuaderno |
| Persistencia | Recarga conserva respuesta y avisa si cambia el contexto |
| Aprendizaje | Seis casos, feedback y clave de cinco competencias |
| Importación | Archivo JSON real válido, duplicado, negativo y texto con marcado HTML |
| Exportación | Contenido de HTML, JSON, CSV, TXT y dos plantillas generado en navegador |
| Impresión | El botón entrega el informe completo a window.print con sustituto controlado |
| Escenario | Cálculo, etiqueta hipotética y gráfico presentes |
| Modelos | Trece perfiles actualizan gráfico y total de 100 000 |
| Acceso | Ajustes, devolución de foco con Escape y reflujo en tres anchuras |

Las descargas se verificaron a través de los Blob producidos por los botones; no se abrieron todos los formatos en aplicaciones externas. La prueba de impresión comprueba la integración, no el guardado final ni la paginación de un PDF del navegador. El portapapeles y el sonido dependen de permisos o servicios del dispositivo: no se acredita que una voz concreta se haya escuchado o que todos los sistemas permitan copiar.

## Accesibilidad

El objetivo es WCAG 2.2 AA. El producto incorpora enlace de salto, regiones semánticas, controles etiquetados, foco visible, tablas equivalentes, información que no depende solo del color, tamaños de control y preferencias de movimiento. Se probaron reflujo de las siete secciones a 320, 768 y 1280 píxeles, navegación entre secciones y cierre del panel con devolución de foco.

axe-core 4.10.3, con etiquetas WCAG A/AA hasta 2.2, no informó infracciones en los estados finales de las siete secciones examinadas. Sí devolvió comprobaciones incompletas, especialmente contraste en contenido gráfico, y una revisión ARIA en Aprender. Esos elementos requieren revisión humana; cero infracciones automáticas no equivale a cero barreras. La observación del árbol accesible y las tablas tampoco sustituye una sesión con lector de pantalla.

Pendientes: lectura con NVDA u otra tecnología pertinente; contraste de todos los estados y gráficos; zoom de texto al 200 % y reflujo con zoom de navegador; secuencia completa de teclado, errores y estados dinámicos; móvil físico; usuarios con distintas necesidades; y accesibilidad de PDF/HTML exportados. No se declara conformidad integral ni se emite certificado.

## Seguridad y corrección de CSV

Codex Security realizó una revisión estática con un auditor general independiente, una revisión de arquitectura y una investigación específica de importación/exportación. El alcance y las exclusiones se conservan en el informe original. No se auditó la implementación de dependencias de terceros, todo el formato PDF histórico o cada valor de los archivos estadísticos. No se probaron controles del proveedor de hosting ni se ejecutaron fórmulas en hojas de cálculo.

Se validó un hallazgo de severidad baja sobre la integridad del CSV: un JSON elegido por el usuario podía incorporar una propiedad adicional de fila, como source con un array de texto de fórmula. El exportador priorizaba esa propiedad frente al metadato del conjunto y comprobaba el tipo anterior a la conversión a texto. Se confirmó una cadena CSV sin protección utilizando únicamente una expresión aritmética inocua. La severidad considera que hacen falta importación, exportación y apertura en una hoja capaz de evaluar fórmulas; no se estableció exfiltración o ejecución del sistema.

La corrección en src/io.js selecciona desde la fila solo age, male y female, y neutraliza los prefijos de fórmula de cualquier representación no numérica. Conserva metadatos desde el conjunto, comillas, BOM, CRLF y recuentos numéricos. Las regresiones prueban arrays, arrays anidados, metadatos adicionales y conjuntos restaurados. Las ocho pruebas focales y las 70 del núcleo terminaron correctamente. Una revisión independiente del parche no encontró evasiones o regresiones concretas en el alcance examinado.

Resultado de la corrección: fixed en las pruebas descritas. El ejemplo original ya no modifica el campo source del CSV y las representaciones de arrays se neutralizan. No es una nueva auditoría exhaustiva de la versión final ni una certificación sobre todos los receptores de hojas de cálculo. El informe de seguridad sellado conserva la instantánea anterior a la corrección; este documento y las pruebas explican su estado posterior.

No se identificaron secretos incrustados en el alcance examinado. Los datos externos se escapan al representar HTML, las URLs declaradas requieren https y la aplicación no evalúa los archivos importados como código. La información local no se cifra ni se separa por cuenta; el perfil y el origen del navegador son la frontera real. La voz puede depender de un proveedor externo. El servidor de desarrollo escucha en loopback y no es un servidor de producción.

## Rendimiento y compatibilidad

Se registró una ejecución local con DOMContentLoaded de aproximadamente 30,1 ms, load de 33,1 ms y seis recursos en la instancia medida. Son observaciones locales con caché y máquina concretas, no un benchmark de producción, una garantía de tiempo o una medición de Core Web Vitals. El informe JSON conserva el contexto.

La aplicación no requiere librerías remotas en ejecución y carga una instantánea pequeña del propio sitio. La compatibilidad se basa en módulos ES, fetch, SVG, Blob y controles HTML actuales. Faltan pruebas en Safari, Firefox, otros dispositivos, redes lentas y sesiones de larga duración. La actualización de datos y la migración del service worker necesitan comprobación en un despliegue real antes de dar por cerrado ese riesgo.

## Registro de defectos y correcciones

| ID | Defecto observado | Corrección | Revisión |
|---|---|---|---|
| D01 | Porcentajes incoherentes en modelos | Normalización por restos mayores y etiquetas sintéticas | Totales y porcentajes en 13 modelos |
| D02 | Ejes y barras con transformaciones distintas | Escala compartida y simétrica | Proporcionalidad y comparación en navegador |
| D03 | Indicadores solo documentales | Núcleo calculado con ocho fórmulas | Ejemplo conocido y casos límite |
| D04 | Necesidades y causas prefijadas | Reglas descriptivas, alternativas y propuestas condicionales | Revisión de texto y pruebas de reglas |
| D05 | Fuente no trazable en perfiles nacionales antiguos | Sustituir observaciones por instantáneas oficiales | Huella y totales por sexo |
| D06 | Carga opaca y cacheo histórico | Módulos legibles y retirada limitada del SW | Carga local; migración publicada pendiente |
| D07 | Desbordamiento de enlaces en móvil | Contención de controles y partición de URLs | Siete secciones en 320/768/1280 |
| D08 | Contraste transitorio por animación de opacidad | Eliminar opacidad y conservar desplazamiento discreto | Nueva pasada axe sin infracciones detectadas |
| D09 | Metadatos extra eluden protección de CSV | Propiedad de cada columna y neutralización final | Regresiones y revisión independiente |
| D10 | Fuente Eurostat atribuida a reglas sobre modelos | Fundamento vinculado a la fuente de cada conjunto | Prueba específica sin atribución falsa |
| D11 | Escenario exportado sin todos los parámetros | Incluir base, parámetros y paso de cinco años | Reproducción exacta de recuentos |
| D12 | Metadatos opcionales mal tipados y fecha incoherente | Rechazo con mensaje antes de representar | Pruebas de contrato |
| D13 | Pruebas podían borrar trabajo del mismo origen | Respaldo y restauración en finally del ejecutor | Flujo revisado; usar perfil de pruebas recomendado |

## Matriz ponderada de consultoría

Escala interna de 0 a 4: 0 sin evidencia; 1 diseño inicial; 2 implementación parcial o fundamentación pendiente; 3 implementación con pruebas relevantes y límites; 4 evidencia completa para el propósito definido y revisión externa pertinente. Se admiten medios puntos. Estos pesos y notas son internos, no criterios de UNIR ni de otra universidad. Valoran la preparación del producto; no son una medida de eficacia educativa.

| Dimensión | Peso | Nota sobre 4 | Puntos ponderados |
|---|---:|---:|---:|
| Rigor científico y estadístico | 20 % | 3,0 | 15,00 |
| Valor socioeducativo | 20 % | 2,5 | 12,50 |
| Innovación y originalidad | 15 % | 2,0 | 7,50 |
| Calidad técnica y fiabilidad | 15 % | 3,0 | 11,25 |
| Utilidad didáctica | 10 % | 2,5 | 6,25 |
| Accesibilidad y usabilidad | 10 % | 2,5 | 6,25 |
| Reproducibilidad y documentación | 5 % | 3,5 | 4,38 |
| Potencial de transferencia | 5 % | 2,0 | 2,50 |
| Total de preparación interna | 100 % | | 65,63 |

La nota de rigor se apoya en fórmulas, datos y pruebas, y se limita por la revisión experta pendiente. El valor socioeducativo se apoya en siete fases, derechos y participación, pero no en resultados con comunidades. La originalidad recibe una valoración contenida por la búsqueda exploratoria. La fiabilidad técnica conserva límites de cobertura y despliegue. La didáctica tiene tareas y rúbrica sin aprendizaje medido. Accesibilidad y usabilidad carecen de usuarios reales y revisión completa. La documentación es reproducible, aunque actualizar y abrir licencias necesita mantenimiento. La transferencia es un potencial condicionado al contexto y acuerdos institucionales.

Implementación: evidencia técnica disponible. Validez metodológica: fundamentos explícitos y revisión de contenido pendiente. Usabilidad comprobada con usuarios: no evaluada. Eficacia educativa demostrada: no evaluada. Potencial académico: propuesta de colaboración preparada. La suma 65,63 no autoriza transformar “no evaluado” en “aprobado”.

## Fortalezas, riesgos y siguientes requisitos

Fortalezas acreditadas: cálculos reproducibles, fuente conservada, corrección de escalas, distinción sintético/observado, reglas inspeccionables, casos completos y exportación con límites. Debilidades: solo dos países y dos años reales, pocos mecanismos interpretativos, importación con preparación previa y ausencia de validación educativa.

La innovación verificable es la implementación de una integración específica y transparente para Educación Social. No se acredita primacía científica. Los errores detectados y sus correcciones figuran en el registro. Los riesgos pendientes son actualización de datos, compatibilidad, accesibilidad manual, calidad de los planes escritos y mantenimiento. La institución debe revisar contenido, acordar asignatura, comprobar derechos y acceso, y autorizar el piloto antes de recoger datos.

Puede utilizarse para una demostración y actividad exploratoria supervisada. No debe usarse como diagnóstico automático o evidencia de impacto socioeducativo. Para la presentación universitaria se recomienda una solicitud de revisión y colaboración, apoyada en los seis entregables, sin prometer reconocimiento. La evaluación externa global y el estudio con estudiantes son condiciones pendientes para una afirmación académica más fuerte.

## Estado de las nueve etapas

Diagnóstico, arquitectura y desarrollo priorizado: realizados con evidencias. Fundamentación: realizada como revisión exploratoria, ampliación sistemática pendiente. Integración y laboratorio didáctico: implementados, contenido pendiente de expertos. Validación técnica: ejecutada con alcance y exclusiones; accesibilidad completa y compatibilidad ampliada pendientes. Preparación académica: memoria, guía, protocolo y dosier entregados. Consultoría: interna, con contraste independiente de seguridad; evaluación externa integral pendiente. Investigación con participantes: diseñada, no ejecutada.

## Reproducción y trazabilidad

Desde la raíz del proyecto, con Node 20 o superior: node scripts/build-data.mjs; node --test tests/core.test.mjs; instalar las dependencias de desarrollo con pnpm install --frozen-lockfile; iniciar node scripts/serve.mjs; abrir /tests/browser.html y ejecutar. El ejecutor restaura el valor previo de trabajo local al terminar, aunque sigue siendo preferible un perfil de navegador de pruebas. El registro de resultados contiene el detalle de auditoría automática y sus comprobaciones incompletas.

La memoria y el diccionario describen supuestos y fuentes; los hashes de entrega identifican archivos. La revisión de seguridad conserva su informe original, modelo de amenazas y cobertura, con ID 82090747-0d21-478e-86f0-31a6c51cd479. El plugin informó una medición acumulada de 8 039 342 tokens de los contextos incluidos, de los cuales 7 746 304 estaban en caché; no se interpreta como consumo exclusivo de análisis nuevo ni como coste facturable. No se dispone de una medición aislada comparable para todas las etapas del proyecto.
