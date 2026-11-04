# DuoSpark · Pruebas de seguridad de amistades

**Estos archivos son solo para el emulador local. No publican reglas ni modifican Firebase de producción.**

Requisitos: Node.js, npm y Java para Firebase Emulator.

En una copia local del repositorio:

```bash
npm install --prefix pruebas-firebase
npx firebase-tools emulators:exec --only database --project duospark-friendship-rules-test "cd pruebas-firebase && npm run test:rules" --config pruebas-firebase/firebase.json
```

Los tests simulan tres cuentas (emisor, receptor y tercero) y comprueban permisos de lectura, creación, aceptación, bloqueo de modificaciones y aislamiento de puntuaciones.

**No se han ejecutado todavía**; no se debe desplegar el borrador hasta ejecutarlos y revisar los resultados. La aceptación de una solicitud no equivale aún a crear un vínculo bilateral, y siguen pendientes controles antispam, bloqueo, presencia y seguridad de puntuaciones.
