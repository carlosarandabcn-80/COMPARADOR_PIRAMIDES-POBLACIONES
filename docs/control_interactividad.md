# Control de interactividad

La aplicación funciona de forma local y controlada:

- No envía datos a servidores externos.
- No usa analítica, cookies de terceros ni librerías remotas.
- La persistencia se limita al navegador mediante `localStorage`.
- La exportación TXT se genera en el propio navegador.
- El service worker solo cachea los archivos del proyecto para mejorar carga y disponibilidad.

Para reiniciar la configuración, utiliza el botón "Reiniciar vista" o borra los datos locales del navegador.
