# -*- coding: utf-8 -*-
# French tense (T) and person (P) tag definitions for frForEnTags.js,
# plus the tense-enum -> verbecc(mood,tense) map used to verify conjugations.

T_DEFS = {
 'present':        ("Présent", "Présent", "Habitual or current actions.", "Acciones habituales o actuales."),
 'passeCompose':   ("Passé composé", "Passé composé", "A completed past action (\"have done / did\").", "Una acción pasada completada (\"he hecho / hice\")."),
 'imparfait':      ("Imparfait", "Imperfecto", "Ongoing, habitual, or background past actions.", "Acciones pasadas en curso, habituales o de fondo."),
 'futur':          ("Futur simple", "Futuro simple", "What will happen.", "Lo que ocurrirá."),
 'conditionnel':   ("Conditionnel", "Condicional", "What would happen — often with a hypothetical 'si'.", "Lo que ocurriría — suele ir con un 'si' hipotético."),
 'subjPresent':    ("Subjonctif présent", "Presente de subjuntivo", "Triggered by necessity, wish, doubt or emotion (il faut que, vouloir que, bien que).", "Lo activan la necesidad, el deseo, la duda o la emoción (il faut que, vouloir que, bien que)."),
 'subjImparfait':  ("Subjonctif imparfait", "Imperfecto de subjuntivo", "The literary subjunctive for past hypotheticals.", "El subjuntivo literario para hipótesis del pasado."),
 'plusQueParfait': ("Plus-que-parfait", "Pluscuamperfecto", "A past action finished before another past moment (\"had done\").", "Una acción pasada anterior a otro momento pasado (\"había hecho\")."),
 'futurAnterieur': ("Futur antérieur", "Futuro anterior", "What will have happened by a point in the future.", "Lo que habrá ocurrido para un momento futuro."),
 'conditionnelPasse':("Conditionnel passé", "Condicional perfecto", "What would have happened (\"would have done\").", "Lo que habría ocurrido (\"habría hecho\")."),
 'imperatif':      ("Impératif", "Imperativo", "Telling someone to do something.", "Decirle a alguien que haga algo."),
 'infinitif':      ("Infinitif", "Infinitivo", "The unconjugated verb, used after another verb or preposition.", "El verbo sin conjugar, tras otro verbo o preposición."),
}
# camelCase key -> the object key used in the T = {...} map in frForEnTags.js (same key)

P_DEFS = {
 'je':   ("je (I)", "yo"),
 'tu':   ("tu (you)", "tú"),
 'il':   ("il / elle / on", "él / ella"),
 'nous': ("nous (we)", "nosotros"),
 'vous': ("vous (you, pl/formal)", "vosotros / ustedes"),
 'ils':  ("ils / elles", "ellos / ellas"),
 'impersonal': ("impersonal (il / ce)", "impersonal"),
}

# tense enum -> verbecc (mood, tense); None = don't hard-verify the form
VBKEY = {
 'present':('indicatif','présent'),
 'imparfait':('indicatif','imparfait'),
 'futur':('indicatif','futur-simple'),
 'conditionnel':('conditionnel','présent'),
 'subjPresent':('subjonctif','présent'),
 # compound / imperative / infinitive / literary: skip hard single-word check
 'passeCompose':None,'plusQueParfait':None,'futurAnterieur':None,
 'conditionnelPasse':None,'imperatif':None,'infinitif':None,'subjImparfait':None,
}
PERSON2PR = {'je':'je','tu':'tu','il':'il','nous':'nous','vous':'vous','ils':'ils'}
