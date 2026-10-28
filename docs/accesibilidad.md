# Accesibilidad y comprobaciones
Objetivo: WCAG 2.2 AA; **la conformidad completa aún no está acreditada**.

## Funciones incluidas en el laboratorio nuevo
- Enlace «Saltar al contenido».
- Encabezados en jerarquía, regiones y etiquetas identificables.
- Tablas de datos completas equivalentes a las pirámides SVG, con encabezados asociados.
- Gráficos con rol y nombre accesible.
- Contraste de texto diseñado para lectura, foco visible y objetivos de interacción amplios.
- Diseño adaptable, sin desplazamiento horizontal estructural.
- Respeto a prefers-reduced-motion para transiciones.
- Mensajes de error y estado visibles, no exclusivamente cromáticos.

## Evidencia automatizada
El flujo GitHub Actions ejecuta Chromium/Playwright y axe-core (WCAG 2 A/AA, WCAG 2.1 A/AA, WCAG 2.2 AA) en la página del laboratorio. La evidencia por ejecución está en la pestaña Actions del repositorio.

## Pruebas manuales necesarias para declarar conformidad
- Zoom de navegador al 200 % y reflujo al 400 %.
- Flujo de teclado completo, orden de tabulación, diálogos y foco tras cambios.
- Screen readers NVDA/Firefox, VoiceOver/Safari y TalkBack/Android.
- Tablets, orientación y activación táctil sin gestos complejos.
- Legibilidad, accesibilidad cognitiva y comprensión del informe.
- Revisión independiente del comparador clásico comprimido.
- Criterios aplicables no evaluados automáticamente.

La nueva versión no debe publicitarse como «certificada WCAG 2.2 AA».
