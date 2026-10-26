# Estado de pruebas y validación — no certificado

**Fecha de corte: 26/10/2026. Rama de desarrollo:** \`feature/laboratorio-socioeducativo-20261026\`.

| Nivel | Qué se ha realizado | Estado / evidencia | Pendiente |
|---|---|---|---|
| Estadístico | 14 aserciones ejecutadas en el entorno de conexión al crear \`demografia-core.js\`; casos para coherencia de sumas, índices, duplicados y CSV | Pruebas locales del núcleo: superadas en esa ejecución. Test suite independiente añadido a \`tests/demografia.test.cjs\`. | CI Node 12 pruebas completado sin fallos; ampliar casos y contrastes externos |
| Seguridad básica | Revisión de procesado local, etiquetas de procedencia y construcción del DOM mediante \`textContent\` en entradas de usuarios | Controles preventivos implementados, **sin pentest** | Test de XSS, CSP efectiva y auditoría externa |
| Accesibilidad | Estructura semántica, foco visible, teclado nativo, textos de apoyo, tablas equivalentes, reflujo, reducción de movimiento | Axe-core ejecutado en vista inicial sin violaciones notificadas; **sin prueba integral WCAG** | NVDA, VoiceOver, contraste de todos los estados, zoom 200/400 %, axe y pruebas manuales |
| Usabilidad | Ruta guiada, ejemplos y mensajes de error | Implementado; smoke Chromium de navegación e importación superado | Observación con usuarios y métricas |
| Contenido | Hipótesis prudentes, ausencia de diagnósticos automáticos, casos didácticos | Diseño preliminar | Revisión interdisciplinar de contenido |
| Educativa | Objetivos y protocolo de estudio piloto | Diseñado como propuesta | Autorización institucional, participantes, recogida, análisis y resultados |
| Producción | Código publicado **solo en rama de desarrollo**, pendiente de incorporar a main | Pull request de revisión | Pruebas Chromium CI completadas; pendiente comprobar despliegue Pages público y navegación real en móviles |

**No declarar:** «herramienta científica validada», «eficacia educativa demostrada», «WCAG AA conforme», «seguridad certificada» ni «aprobado por UNIR». La validación institucional depende de evidencia y procedimientos propios.

## Evidencias CI ejecutadas

- GitHub Actions: [ejecución CI con Node y Chromium](https://github.com/carlosarandabcn-80/COMPARADOR_PIRAMIDES-POBLACIONES/actions/runs/40318192555) (conclusión satisfactoria según consulta al registro).
- 12 pruebas `node:test`, smoke E2E y axe-core en pantalla inicial: sin fallos / sin violaciones notificadas para etiquetas configuradas. Esto no equivale a una auditoría independiente.

## Criterios de cierre a verificar

1. \`npm test\` y workflow CI ejecutados en verde.
2. Todas las rutas, importación CSV/JSON, selecciones, interacción de teclado, guardado, exportación e impresión probadas en navegador.
3. Contrastes, semántica, zoom, tabla accesible, navegación y lectores de pantalla verificados con registros y versiones.
4. Revisión por expertos de todas las reglas demográficas y sus límites.
5. Pilotaje docente aprobado, realizado y analizado para poder hablar de utilidad educativa observada.

El incumplimiento de uno de estos criterios obliga a declarar el alcance real, no a emitir una «certificación» propia.
