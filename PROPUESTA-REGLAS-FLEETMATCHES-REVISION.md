# DuoSpark · Revisión de reglas para fleetMatches
Estado: propuesta, NO publicar todavía.

## Base confirmada
La usuaria ha confirmado las reglas vigentes con .read y .write en false en raíz y las rutas dailyScores, friendCodes, myFriendCode, friendRequests, fleetInvites y fleetReady. Esta propuesta no modifica esas rutas.

## Diseño mínimo de metadatos
fleetMatches/$matchId con playerA, playerB, status=setup, mode=classic|special, createdAt, updatedAt y createdBy. No almacenar flotas aquí.

## Restricciones necesarias para creación
- Autenticación obligatoria.
- auth.uid = playerA = createdBy; playerA != playerB.
- Amistad aceptada entre playerA y playerB.
- No permitir sobreescritura de partidas existentes.
- ID aleatorio suficientemente largo, validado por patrón.
- Tipos, claves y rangos estrictamente validados.
- La lectura debe autorizar únicamente a playerA o playerB mediante comprobación de pertenencia a la partida.
- No conceder lectura en fleetMatches raíz ni lectura heredada en un padre que contenga barcos.
- Cuidado: una regla de escritura en $matchId con newData y !data.exists() no permite por sí misma crear índices por usuario ni transición segura de turnos.

## Problema pendiente
Los participantes necesitan recuperar el ID de la partida en otro dispositivo: guardar un índice por usuario en una ruta distinta o derivarlo de la invitación aceptada. Es necesario verificar la vinculación de índice, invitación y partida sin permitir referencias falsas ni acceso ajeno.

## Pruebas obligatorias
1. Anónimo: lectura/escritura denegada.
2. Tercero autenticado: lectura/escritura denegada.
3. Propietario: creación válida permitida.
4. Amigo aceptado: lectura permitida.
5. Persona no amiga: creación denegada.
6. Sobrescritura de partida: denegada.
7. Campos inesperados, IDs incorrectos, modo o status inválido: denegados.
8. No filtrar flotas ni permitir leer nodos padres.
9. Probar en emulador antes de publicar.

No se ha modificado Firebase. La propuesta no constituye todavía un sistema completo de partidas jugables.
