# DuoSpark · Batalla de las Mareas — protocolo de partidas por turnos
**Estado: diseño para revisión. No desplegado, no se han cambiado reglas ni creado partidas.**

## Objetivo confirmado
Dos cuentas con amistad aceptada; partida 10×10, barcos 5/4/3/3/2; cada persona puede cerrar Safari y regresar cuando le toque. Preservar `batalla-de-las-mareas.html` y efectos de la copia de preparación.

## Restricción esencial
No colocar flotas secretas dentro de `fleetMatches` ni bajo ninguna ruta con `.read` concedido a los dos. En RTDB, un permiso de lectura heredado no puede anularse en un hijo. Las reglas de cliente por sí solas no pueden comprobar de forma fiable impactos sobre un tablero secreto del otro jugador: quien controla el cliente podría mentir sobre el resultado. Para juego amistoso es posible un protocolo de respuestas del defensor; para juego competitivo verificable hace falta un árbitro confiable o un protocolo criptográfico revisado.

## Esquema candidato (NO crear aún)
- `fleetMatches/$matchId/meta`: `playerA`, `playerB`, `status` (`setup|active|finished`), `turnUid`, `mode`, `winnerUid`, `createdAt`, `updatedAt`, `revision`. Solo metadatos públicos para ambos participantes.
- `fleetPrivateBoards/$matchId/$uid`: cinco barcos completos y colocación, lectura exclusiva del propietario; escritura solo en preparación y con validación de estructura. **Ojo:** el servidor no puede verificar resultados si no tiene acceso confiable a estos tableros.
- `fleetMatchMembers/$uid/$matchId`: índice privado para recuperar partidas; no debe conceder lectura de partidas de terceros.
- `fleetShots/$matchId/$turnNumber`: solicitud de disparo (`shooterUid`, `row`, `col`, `createdAt`) y resolución posterior del defensor (`result`, `resolvedAt`). Evitar permisos de escritura general a ambos sobre el mismo nodo: separar solicitud y respuesta si se implementa solo con reglas.
- `fleetReadiness/$matchId/$uid`: listo específico de esa partida; no reutilizar `fleetReady/$uid` como prueba suficiente de comienzo.

## Máquina de estados prevista
1. Invitación privada aceptada; crear un único `matchId` estable asociado a la invitación y ambos participantes.
2. `setup`: cada participante coloca y guarda su flota **solo en su ruta privada**; puede desmarcar «listo» hasta que ambos confirmen.
3. Al estar ambos listos, transición a `active` una sola vez; turno inicial definido y persistido.
4. El atacante envía un disparo con número de turno único y casilla no repetida. No puede enviar otro mientras espera resolución.
5. El defensor resuelve el disparo contra su tablero privado. Ambos ven únicamente resultado de esa casilla y el siguiente turno; los barcos no descubiertos nunca se transmiten al rival.
6. Al hundirse la última nave, marcar `finished`; conservar historial y permitir revancha con nuevo ID.

## Persistencia y desconexión
- Firebase RTDB guarda metadatos, disparos, respuestas y turnos; el estado debe reconstruirse al reabrir Safari y autenticar.
- Usar listeners en la partida activa; desuscribirse al cambiar de cuenta o partida.
- Las escrituras de turnos necesitan transacción o control de revisión para impedir duplicados, dobles clics y carreras.
- Si se pierde conexión, mostrar «Pendiente de sincronizar» y no afirmar que el disparo se envió hasta recibir confirmación.
- Avisos dentro de la web al entrar; push con Safari cerrado se aborda aparte.

## Pruebas de seguridad obligatorias antes de publicar
1. A y B pueden leer metadatos de su partida; C (tercera cuenta) no.
2. A no puede leer `fleetPrivateBoards/$matchId/B`, ni B leer la flota de A.
3. Nadie puede leer un tablero secreto a través de un nodo padre.
4. A no puede disparar dos veces, disparar fuera de turno o repetir casilla.
5. B no puede editar un disparo de A; A no puede falsificar respuesta de B.
6. No se puede reactivar una partida terminada ni escribir después de `finished`.
7. Recarga, dos dispositivos, desconexión y reintento no crean turnos duplicados.
8. No se filtran posiciones por logs, invitaciones, índices o errores.

## Próxima implementación
Preparar una **sala de partida en modo maqueta local**, con vista de estado de turno y «continuar partida», sin escrituras en rutas nuevas. Después diseñar reglas RTDB concretas y ensayarlas en emulador con tres identidades antes de conectar el juego. No publicar permisos amplios ni sustituir el juego original.
