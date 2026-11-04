# DuoSpark · Propuesta de reglas de amistad (NO PUBLICAR TODAVÍA)

Estado: **borrador incompleto, para revisión**. Este archivo no se aplica a Firebase automáticamente.

- Mantiene las reglas existentes de puntuaciones y códigos.
- Añade únicamente solicitudes pendientes en `friendRequests/$recipientUid/$senderUid`.
- La persona destinataria puede leer sus solicitudes; quien las envía no puede consultar directamente ese nodo.
- **Falta implementar** la aceptación/rechazo por destinatario, el vínculo persistente entre ambos, cancelaciones, bloqueo de spam, protección frente a enumeración de códigos, presencia y reglas de puntuaciones compartidas.
- **Problema pendiente**: las reglas actuales permiten a cualquier cuenta autenticada consultar códigos concretos. Un código no debe actuar como autorización para datos privados.
- **Problema pendiente**: la validación de `dailyScores` no verifica la puntuación contra el resultado real del minijuego. No prometer competición antitrampas sin backend confiable.
- Para producción, conviene modelar el vínculo y las solicitudes de forma que el receptor pueda aceptar sin que un emisor falsifique la aceptación. Se debe probar en Firebase Emulator antes de publicar.
- **No pegar este JSON en la consola como reglas definitivas**. Todavía no habilita el flujo completo de amistad.

La pantalla de prueba actual permanece independiente de estas reglas.