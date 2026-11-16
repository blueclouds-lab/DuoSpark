# Nuestra Flota — permiso mínimo para estado «Estoy listo» (propuesta)

**No publicado en Firebase.** Esta ampliación no crea partidas ni permite leer barcos.

Agregar dentro del objeto `rules`, como hermano de `fleetInvites`:

```json
"fleetReady": {
  "$uid": {
    ".read": "auth != null && (auth.uid === $uid || root.child('friendRequests').child($uid).child(auth.uid).child('status').val() === 'accepted' || root.child('friendRequests').child(auth.uid).child($uid).child('status').val() === 'accepted')",
    ".write": "auth != null && auth.uid === $uid && newData.exists()",
    ".validate": "newData.hasChildren(['ready', 'updatedAt'])",
    "ready": {
      ".validate": "newData.isBoolean()"
    },
    "updatedAt": {
      ".validate": "newData.isNumber() && newData.val() > 0 && newData.val() <= now + 60000"
    },
    "$other": {
      ".validate": false
    }
  }
}
```

Datos: `fleetReady/$uid = {ready:true|false, updatedAt: timestamp}`. Sin barcos, sin tiros ni datos sensibles de partida.

**Limitación**: este permiso expresa disponibilidad general, no preparación de una partida concreta. Solo sirve para la primera prueba de sincronización. No debe usarse como señal definitiva de inicio de partida: para ello habrá que ligar readiness a un `matchId` y validar que la invitación está aceptada.

Pruebas requeridas antes de usar: propietario escribe su nodo, amigo aceptado puede leer, tercero no puede leer, tercero no puede escribir, propietario no puede añadir campos inesperados ni escribir datos de barcos. Validar también ausencia de amistad y sesión cerrada.

Las reglas `.validate` no impiden borrar un nodo por sí solas, por eso `.write` exige `newData.exists()`. El nodo se puede actualizar solo por su propietario.
