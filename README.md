# DemoLab Demografía aplicada a la Educación Social

Laboratorio estático para observar estructuras de población, calcular indicadores, comparar conjuntos y construir preguntas y propuestas socioeducativas fundamentadas. Versión 2.0.1. Evoluciona el comparador de Aranda Tools conservando sus trece perfiles como modelos didácticos explícitos.

La herramienta funciona como apoyo exploratorio y docente. No diagnostica necesidades, no atribuye causas por la forma de una pirámide y no tiene eficacia educativa demostrada. No existe afiliación o reconocimiento institucional de UNIR.

## Inicio

Requisitos para desarrollo: Node 20 o superior. Desde esta carpeta:

```sh
node scripts/serve.mjs
```

Abrir http://127.0.0.1:4173. No abrir index.html con file://: los módulos y fetch requieren HTTP. La aplicación publicada no necesita Node, instalación o dependencias externas en ejecución. El servidor escucha solo en loopback y es para desarrollo.

## Datos y funciones

- Cuatro instantáneas de Eurostat demo_pjan: España y Portugal, 1 de enero de 2023 y 2024, con respuesta original, metadatos, comprobación de totales y SHA-256.
- Trece formas históricas normalizadas a 100 000 personas ficticias. No describen países o municipios reales.
- Exploración por edad, absolutos y porcentajes del total; tablas equivalentes; comparación y contornos con escala común.
- Ocho indicadores con fórmulas y límites; cero denominadores producen N/D.
- Tres reglas trazables con siete fases y un cuaderno de intervención condicionado al diagnóstico participativo.
- Seis casos y cinco preguntas formativas originales, sin validación psicométrica.
- Importación CSV/JSON del contrato del laboratorio, almacenamiento local y exportación TXT, CSV, JSON y HTML imprimible a PDF.
- Escenario quinquenal sintético con base y parámetros conservados; no es proyección o predicción validada.

INE, Idescat y Naciones Unidas se estudian como fuentes de ampliación; no existen conectores en vivo para ellas. La base real incluida es Eurostat. La evolución disponible tiene solo dos cortes; no demuestra una tendencia.

## Comprobaciones

```sh
node scripts/build-data.mjs
node --test tests/*.test.mjs
```

Para el ejecutor de navegador y axe-core 4.10.3, instalar primero las dependencias de desarrollo con `pnpm install --frozen-lockfile`. Iniciar el servidor y abrir `/tests/browser.html`. Pulsar Ejecutar pruebas y descargar el JSON. Son pruebas del producto con algunas capacidades de salida sustituidas de forma controlada; no todas las verificaciones son manuales o de extremo a extremo externo.

Resultados finales 2.0.1: 79 pruebas de cálculo/validación, 22 de integración y 21 de acceso ampliado correctas. Para estas últimas abrir `/tests/accessibility.html`. Se comprobaron 144 celdas oficiales con una extracción independiente y propiedades aritméticas en cien distribuciones de ensayo. Se corrigieron seis barreras reproducidas. Los registros anteriores y posteriores están en docs/research. Las pruebas usan un mismo origen: ejecutarlas de una en una en un perfil de pruebas, sin editar trabajo simultáneamente; respaldan y restauran la clave al terminar. Se recomienda exportación previa.

La matriz completa de 55 criterios WCAG 2.2 A/AA distingue comprobación acotada, parcial y no aplicable. No se declara conformidad integral. El tamaño de texto al 200 % se probó con CSS; no se afirma haber probado zoom real ni lectores de pantalla. La revisión de contenido es técnica y asistida por IA, sin panel académico externo.

Por instrucción del promotor se omite el piloto con personas. Para reproducir el ensayo sintético con Python 3 estándar:

```sh
python scripts/simulate-pilot.py --self-test salida_simulada
```

Produce tres escenarios, datos JSON e informe HTML con advertencias. Los 40 registros por escenario son ficticios; no hay eficacia ni usabilidad observadas. El generador superó trece autocomprobaciones. Los escenarios comparten la base aleatoria y no son cohortes independientes.

Para generar un único HTML con código y datos incluidos, ejecutar `node scripts/build-standalone.mjs laboratorio.html`. Se comprueba la huella CSP sobre saltos de línea normalizados. La versión modular del repositorio continúa requiriendo HTTP.

La revisión de seguridad detectó una vía de fórmulas CSV mediante propiedades adicionales de filas JSON. Está corregida en el exportador, con regresiones para arrays, metadatos y restauración; el informe sellado anterior se conserva con su estado temporal. No es una certificación ni una auditoría de todos los receptores de hojas de cálculo.

## Documentación

- [Guía de uso](docs/guia_uso.md)
- [Arquitectura](docs/arquitectura.md)
- [Diccionario y fórmulas](docs/diccionario_datos.md)
- [Modelo de razonamiento](docs/logica_metodologica.md)
- [Accesibilidad y pendientes](docs/accesibilidad.md)
- [Privacidad e interactividad](docs/control_interactividad.md)
- [Fuentes y licencias](docs/fuentes_licencias.md)
- [Informe de auditoría y consultoría](docs/academico/02_auditoria_y_consultoria.md)
- [Memoria universitaria](docs/academico/03_memoria_universitaria.md)
- [Guía docente](docs/academico/04_guia_docente.md)
- [Protocolo de investigación](docs/academico/05_protocolo_investigacion.md)
- [Dosier institucional](docs/academico/06_dosier_institucional.md)
- [Revisión del contenido y acceso ampliado](docs/academico/07_revision_contenido_y_accesibilidad.md)
- [Piloto simulado y anclajes de corrección](docs/academico/08_piloto_simulado.md)
- [Registro de cambios](CHANGELOG.md)

Los documentos históricos se conservan en docs/legacy y se identifican como no vigentes. El paquete payload es recuperación inactiva, no fuente de datos observados ni dependencia de inicio.

## Publicación y recuperación

La rama de trabajo es desarrollo/laboratorio-demografia. main y la versión publicada se integran solo después de revisión. Se conserva la etiqueta base-auditada-20261027 y un bundle recuperable en la entrega.

Para GitHub Pages puede publicarse la raíz de la rama elegida; las rutas son relativas. La entrega también incluye un ZIP de sitio estático sin herramientas de prueba o archivos de desarrollo, listo para desplegar. No cambiar el origen o la ruta de una instalación sin tener en cuenta que localStorage pertenece al origen y no se sincroniza.

sw.js retira las dos cachés históricas y se desregistra. La migración debe comprobarse al actualizar la web real; puede ser necesaria una recarga. No se promete modo sin conexión.

## Reutilización y límites

Los datos Eurostat se reutilizan con atribución y agregación propia; Eurostat no es responsable de la transformación. Las condiciones de software y contenidos heredados requieren decisión del titular: no se impone automáticamente una licencia nueva. Véase fuentes_licencias.md. Antes de anunciar un recurso educativo abierto, resolver derechos y licencias diferenciadas.

No introducir información personal o sensible en el cuaderno. JSON exporta también notas y respuestas formativas, no solo población. La voz depende del proveedor del navegador o sistema. Un informe guardado puede compartirse fuera del entorno local; revisar su contenido.
