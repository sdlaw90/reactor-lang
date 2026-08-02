# es-latam · interface — changeset from `2026-08-14-maria-r-interface-v3.2.0.xlsx`

_Generated 2026-07-28 by `docs/language-review/pipeline/ingest.py`. Derived from the submission; the submission itself is untouched. Regenerate rather than hand-edit._

- **Nombre de quien revisa:** María Rodríguez
- **País / región de origen:** México (CDMX)
- **Fecha de entrega:** 2026-08-14
- **¿Doy el visto bueno general?** SÍ CON CAMBIOS

## Verdict tally

| Sheet | OK | CAMBIAR | DUDA | APRUEBO | blank |
|---|---|---|---|---|---|
| 1-Variantes-regionales | 150 | 2 | 2 | 0 | 171 |
| 2-Decisiones | 0 | 5 | 2 | 9 | 0 |
| 3-Config-tarjeta | 117 | 0 | 0 | 0 | 0 |
| 4-Preguntas-seguridad | 8 | 2 | 0 | 0 | 0 |
| 5-Interfaz | 117 | 5 | 1 | 0 | 280 |
| 6-Otros-textos | 57 | 1 | 0 | 0 | 0 |
| 7-Ayuda-AcercaDe | 0 | 0 | 0 | 0 | 110 |
| 8-Novedades | 0 | 0 | 0 | 0 | 184 |

## Decisions to apply first (7)

_These are systematic: one answer here can rewrite many rows below. Apply them before touching individual strings._

### `2-Decisiones`

- **DEC-02** — Tema: Redacción neutra en género
  - now: `La app le habla directamente a quien la usa, así que evitamos formas «/a» y adjetivos con género. Quedan al menos cinco excepciones sin resolver.`
  - proposed: `«¡Te damos la bienvenida!» en vez de «¡Bienvenido/a»`
  - note: La barra se ve mal y se lee peor en voz alta. «Te damos la bienvenida» sirve para todo el mundo y no suena forzado. Ver también mis correcciones en la pestaña 5.
- **DEC-05** — Tema: «pista» = curso de idioma
  - now: `En el código un «track» es un curso de idioma. Lo tradujimos como «pista», que también significa pista de audio.`
  - proposed: `«por curso»`
  - note: «Pista» hace pensar en audio, sobre todo en una app que sí tiene audio. «Por curso» se entiende de inmediato.
- **DEC-06** — Tema: «Rueditas de apoyo»
  - now: `Traducción de «training wheels» para las pistas de tiempo verbal. El tono juguetón es intencional.`
  - note: «Rueditas de apoyo» se entiende en México, pero no sé si en el Cono Sur. Quizá «ayuditas» sea más neutro.
- **DEC-09** — Tema: Atribuciones por país (riesgo alto)
  - now: `Cada fila REGIONAL de la pestaña 1 afirma que un término se usa en unos países concretos. Es lo más visible y lo más fácil de equivocar.`
  - proposed: `Ver mis correcciones en la pestaña 1`
  - note: Solo dos atribuciones mal de las que revisé.
- **DEC-11** — Tema: Colisión: «bombilla»
  - now: `«bombilla» ya está usada como el término de España para el foco (concepto 28), así que no pudimos usarla también para el sorbete chileno. Hoy Chile ve «sorbete», que no es correcto para Chile.`
  - proposed: `Poner «bombilla» para Chile en el sorbete y cambiar la referencia de España del foco a «bombilla (de luz)»`
  - note: En Chile «bombilla» es el sorbete, sin duda. «Pajita» no se usa allá. Si el problema es que la palabra choca, conviene desambiguar la de España en vez de dejar Chile mal.
- **DEC-12** — Tema: Colisión: «grifo»
  - now: `«grifo» ya está usada como el término de España para la llave del agua (concepto 59), así que no pudimos usarla también para la gasolinera peruana. Hoy Perú ve «gasolinera», aunque en Perú se dice «grifo».`
  - proposed: `Usar «grifo» para Perú en la gasolinera`
  - note: En Perú es «grifo», siempre. Dejar «gasolinera» es un error visible para cualquier peruano.
- **DEC-14** — Tema: Registro coloquial en «trabajo»
  - now: `El concepto 69 usa formas informales (chamba, laburo, pega). ¿Encaja el registro en una app de aprendizaje?`
  - note: «Chamba» y «laburo» son muy coloquiales para una app de aprendizaje. Yo los dejaría, pero marcados como informales.

## Corrections to apply (10)

_Reviewer marked these for change._

### `1-Variantes-regionales`

- **VR-021-a** — Concepto Nº: 21 · Concepto (inglés): banana · Tipo: REGIONAL · Países asignados: AR · UY · PY · CO
  - now: `banana`
  - proposed: `término corregido: banano · países corregidos: CO`
  - note: En Colombia se dice «banano», no «banana». «Banana» es del Cono Sur.
- **VR-055-e** — Concepto Nº: 55 · Concepto (inglés): drinking straw · Tipo: REGIONAL · Países asignados: AR · UY · PY · BO · EC
  - now: `pajita`
  - proposed: `término corregido: bombilla · países corregidos: CL`
  - note: Ver DEC-11. En Chile el sorbete es «bombilla», sin excepción.

### `lib/playStrings.js`

- **IU-0017** — Sección: Inicio de sesión y registro · Clave / ubicación: authErrInvalidCreds
  - now: `Credenciales incorrectas.`
  - proposed: `Correo o contraseña incorrectos.`
  - note: «Credenciales» suena a trámite. Es mejor decir qué falló.
- **IU-0116** — Sección: Ajustes · Clave / ubicación: setGpTogCaudio
  - now: `Mostrar un botón de altavoz también en las opciones de respuesta — solo después de responder (en repaso/pausa), toca para escuchar una opción en voz alta. Se habilita por pista; aparece donde hay audio de opciones.`
  - proposed: `Mostrar un botón de altavoz también en las opciones de respuesta — solo después de responder (en repaso/pausa), toca para escuchar una opción en voz alta. Se habilita por curso; aparece donde hay audio de opciones.`
  - note: Ver DEC-05: «por pista» → «por curso».
- **IU-0145** — Sección: Ajustes · Clave / ubicación: setRecNoteNone
  - now: `Sin preguntas de seguridad, si olvidas tu contraseña tendrás que esperar a que un administrador la restablezca — configurarlas toma un minuto y te permite restablecerla tú mismo.`
  - proposed: `Sin preguntas de seguridad, si olvidas tu contraseña tendrás que esperar a que un administrador la restablezca — configurarlas toma un minuto y te permite restablecerla por tu cuenta.`
  - note: «Tú mismo» tiene género. «Por tu cuenta» dice lo mismo y es neutro.
- **IU-0311** — Sección: Juego e interfaz general · Clave / ubicación: homeGreeting
  - now: `¡Bienvenido/a`
  - proposed: `¡Te damos la bienvenida,`
  - note: Ver DEC-02. La coma va porque después viene el nombre.
- **IU-0339** — Sección: Juego e interfaz general · Clave / ubicación: notSureTakeQuiz
  - now: `¿No estás seguro? Hacer prueba de nivel`
  - proposed: `¿No lo tienes claro? Haz la prueba de nivel`
  - note: «Seguro» da por hecho que quien lee es hombre.

### `lib/securityQuestions.js`

- **PS-02** — Sección: Pregunta de seguridad · Clave / ubicación: childhood_street
  - now: `¿En qué calle viviste de niño?`
  - proposed: `¿En qué calle viviste en tu infancia?`
  - note: «De niño» tiene género. «En tu infancia» es lo más natural y neutro.
- **PS-08** — Sección: Pregunta de seguridad · Clave / ubicación: best_friend
  - now: `¿Cuál es el nombre de tu amistad más antigua?`
  - proposed: `¿Cómo se llama tu amistad más antigua?`
  - note: «¿Cuál es el nombre de…?» es correcto pero rígido. «¿Cómo se llama…?» es como lo diría cualquiera.

### `lib/skillLevels.js`

- **OT-044** — Sección: Niveles de habilidad · Clave / ubicación: LEVEL_DESCRIPTIONS.expert
  - now: `Te sientes cómodo — las rondas se inclinan hacia matices, modismos y detalles difíciles.`
  - proposed: `Te sientes a gusto — las rondas se inclinan hacia matices, modismos y detalles difíciles.`
  - note: «Cómodo» tiene género. «A gusto» es invariable.

## Open questions (2)

_Reviewer was unsure or said it depends on the country. Resolve with them; do not guess._

### `1-Variantes-regionales`

- **VR-016-a** — Concepto Nº: 16 · Concepto (inglés): peanut · Tipo: REGIONAL · Países asignados: CU · DO · PR · CO · VE · EC · PE · BO · AR · UY · PY · CL
  - now: `maní`
  - note: En Perú y Bolivia oigo más «maní», pero no estoy segura de Chile. Confírmenlo con alguien de allá.

### `lib/playStrings.js`

- **IU-0119** — Sección: Ajustes · Clave / ubicación: setGpTogTense
  - now: `Rueditas de apoyo para tiempos verbales: en las preguntas de conjugación, indica qué tiempo se pide y por qué. Activado por defecto; también puedes ocultarlo durante la ronda al llegar a un nivel avanzado.`
  - note: Ver DEC-06 sobre «rueditas de apoyo».

## Advisory — outside this lane's scope (1)

_Rows belonging to the counterpart variety. Useful signal, not a sign-off. Carry them into that lane's packet rather than applying them here._

### `1-Variantes-regionales`

- **VR-055-REF** — Concepto Nº: 55 · Concepto (inglés): drinking straw · Tipo: REFERENCIA · Países asignados: ES
  - now: `pajita`
  - note: (Fila de España) Me suena que en España también dicen «cañita» en algunas zonas, pero no es mi variedad — que lo confirme alguien de allá.
