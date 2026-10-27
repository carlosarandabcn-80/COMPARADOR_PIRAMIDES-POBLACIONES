# Interactividad y privacidad DemoLab 2.0.0

La aplicación descarga sus módulos y datos desde el propio sitio, sin analítica, cuentas, base de datos o recogida de participantes. Los enlaces oficiales requieren activación voluntaria. La importación lee un archivo elegido y conserva su contenido en el navegador cuando hay almacenamiento disponible; no lo sube a un servidor.

El trabajo se guarda en la clave demolab-v2 de localStorage, compartida por el origen y perfil del navegador, no aislada por cuentas o rutas del sitio. Evitar datos personales o sensibles. El guardado puede fallar por permisos o espacio; la aplicación informa del fallo y permite exportar. El cuaderno conserva el conjunto de referencia y advierte si cambia la selección.

Descargar JSON incluye notas y respuestas formativas además de los datos. HTML y PDF contienen el informe y el cuaderno. CSV contiene recuentos y metadatos; TXT y portapapeles contienen el comentario. El usuario debe revisar el contenido antes de compartirlo. La lectura en voz utiliza el proveedor del navegador o sistema y no se garantiza procesamiento exclusivamente local.

El botón Borrar trabajo local elimina la clave del laboratorio y reinicia su trabajo. No borra la configuración de la aplicación histórica ni otras claves. Las pruebas de desarrollo comparten origen; respaldan y restauran esa clave al terminar, pero se recomienda un perfil de pruebas y una exportación previa.

La versión 2 no registra un nuevo service worker. sw.js se conserva para retirar las dos cachés históricas identificadas y desregistrarse. La migración publicada necesita comprobación; no se garantiza modo sin conexión. No se incorporan automatizaciones o sincronizaciones externas.
