# DuoSpark · Nuestra Flota — diseño de partidas persistentes (borrador, no publicado)

## Estado
- Invitaciones `fleetInvites`: ya se utilizan en la sala.
- `batalla-de-las-mareas.html`: juego original contra CPU, **intocable**.
- `batalla-mareas-online-preparacion.html`: copia de trabajo, aún contra CPU.
- **No se han creado rutas de partidas ni cambiado reglas de Firebase**.

## Requisitos confirmados
- Dos cuentas autenticadas y amistad aceptada.
- Cada jugador coloca 5 barcos de tamaños 5, 4, 3, 3 y 2 en cuadrícula 10 × 10.
- Turnos asíncronos persistentes; cierre de Safari o del iPhone no elimina la partida.
- Mantener efectos visuales del juego original.
- Nunca leer ni descargar al dispositivo rival las posiciones secretas de barcos sin descubrir.

## Estructura propuesta de RTDB (requiere revisión de reglas antes de escribir)
- `fleetMatches/$matchId/meta`: participantes `playerA`, `playerB`, `status` (setup/active/finished), `turnUid`, `winnerUid`, `mode`, `createdAt`, `updatedAt`. Lectura solo de participantes, cambios de estado controlados.
- `fleetPrivateBoards/$matchId/$uid`: posiciones completas de los 5 barcos, solo legibles/escribibles por su propietario durante preparación. **Nunca colocar estos datos debajo de un nodo con .read para ambos participantes**: las reglas RTDB heredan permisos.
- `fleetShots/$matchId/$shotId`: coordenada, autor, turno, resultado, confirmación. Ambos pueden leer resultados, pero las escrituras requieren validación para impedir dobles disparos, falsos aciertos y saltarse turnos.
- `fleetMatchMembers/$uid/$matchId`: índice privado para recuperar partida tras volver a iniciar sesión.
- `fleetMatchEvents/$matchId`: registro compartido sin posiciones no descubiertas, solo eventos públicos.

## Advertencia de integridad
Con Firebase Realtime Database y solo código cliente, un atacante que controle su navegador podría falsificar resultados de sus propios barcos o manipular el estado si las reglas permiten escrituras amplias. Antes de publicar el modo competitivo, diseñar validaciones estrictas y, si se exige verificación robusta, evaluar un árbitro confiable o un esquema criptográfico de compromisos. No afirmar que un simple ocultamiento de interfaz garantiza privacidad o juego limpio.

## Orden de implementación
1. Obtener y revisar las reglas vigentes, especialmente `friendRequests` y `fleetInvites`.
2. Preparar reglas privadas de las rutas nuevas y probar lectura/escritura con dos cuentas diferentes, incluido rechazo de una tercera.
3. Crear partida al aceptar invitación, con ID estable y sin duplicados.
4. Colocación privada, estado «listo», comienzo solo cuando ambos estén listos.
5. Disparos por turnos y resultados, animaciones y reanudación.
6. Revancha y avisos discretos **dentro de la web**; notificaciones push del iPhone son una fase distinta.

**No pegar ni publicar este documento como reglas JSON de Firebase.**
