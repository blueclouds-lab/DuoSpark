# DuoSpark · Revisión de solicitudes de amistad (NO PUBLICAR)

**Estado:** borrador de reglas, guardado únicamente en GitHub. No se ha desplegado en Firebase.

## Flujo previsto
1. Emisor autenticado crea `friendRequests/<destinatarioUid>/<emisorUid>` con `status: pending`.
2. El destinatario autenticado lee su bandeja y puede cambiar `status` a `accepted` o `rejected`.
3. El emisor puede consultar su solicitud individual si conoce el UID del destinatario.
4. No se permite que el emisor acepte en nombre del destinatario, ni que se reabra una solicitud ya resuelta.

## Antes de publicar
- **Pruebas obligatorias en Firebase Emulator:** creación válida, lectura por receptor, lectura directa por emisor, rechazo de terceros, rechazo de aceptación por emisor, bloqueo de cambios de UID/fecha, bloqueo de sobrescritura, y verificación de reglas existentes.
- **No hay todavía lista persistente de amigos para ambas cuentas:** el estado `accepted` en la solicitud no sustituye un índice bilateral seguro. No activar aún el botón «Amigos conectados» en producción.
- **No hay cancelación, bloqueo ni límite antispam**; un usuario puede intentar solicitudes a UIDs conocidos. Definir controles antes de despliegue.
- **Los códigos de amistad se pueden consultar por cuentas autenticadas** si conocen el código. La búsqueda por código debe ser un mecanismo de descubrimiento, nunca autorización.
- **Los puntos no están verificados por servidor**, y los retos online y la presencia no están implementados.
- El indicador de presencia deberá ser discreto, consentido y actualizado mediante `onDisconnect`, evitando publicar una localización o historial.
- La seguridad de invitaciones exige validar que el UID destinatario corresponde al código buscado, sin permitir suplantación ni acceso a datos ajenos.

**No copiar estas reglas a Firebase todavía.** Son un diseño en revisión y requieren pruebas reales antes de habilitar solicitudes entre iPhones.
