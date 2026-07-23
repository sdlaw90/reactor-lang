# -*- coding: utf-8 -*-
# Italian tense (T) and person (P) tag defs for itForEnTags.js + verbecc verify map.
T_DEFS = {
 'presente':        ("Presente","Presente","Habitual or current actions.","Acciones habituales o actuales."),
 'passatoProssimo': ("Passato prossimo","Pretérito perfecto","A completed past action (\"have done / did\").","Una acción pasada completada."),
 'imperfetto':      ("Imperfetto","Imperfecto","Ongoing, habitual or background past actions.","Acciones pasadas en curso, habituales o de fondo."),
 'futuro':          ("Futuro semplice","Futuro simple","What will happen.","Lo que ocurrirá."),
 'condizionale':    ("Condizionale","Condicional","What would happen, and polite requests (vorrei).","Lo que ocurriría, y peticiones corteses (vorrei)."),
 'congPresente':    ("Congiuntivo presente","Presente de subjuntivo","Triggered by opinion, doubt, wish or emotion (penso che, voglio che, benché).","Lo activan la opinión, la duda, el deseo o la emoción (penso che, voglio che, benché)."),
 'congImperfetto':  ("Congiuntivo imperfetto","Imperfecto de subjuntivo","Used in past-subjunctive contexts and the 'se' hypothetical.","Se usa en contextos de subjuntivo pasado y en la hipótesis con 'se'."),
 'trapassato':      ("Trapassato prossimo","Pluscuamperfecto","A past action finished before another past moment (\"had done\").","Una acción pasada anterior a otro momento pasado."),
 'imperativo':      ("Imperativo","Imperativo","Telling someone to do something.","Decirle a alguien que haga algo."),
 'infinito':        ("Infinito","Infinitivo","The unconjugated verb, after another verb or a preposition.","El verbo sin conjugar, tras otro verbo o preposición."),
}
P_DEFS = {
 'io':  ("io (I)","yo"),
 'tu':  ("tu (you)","tú"),
 'lui': ("lui / lei (he/she)","él / ella"),
 'noi': ("noi (we)","nosotros"),
 'voi': ("voi (you all)","vosotros"),
 'loro':("loro (they)","ellos / ellas"),
 'impersonal': ("impersonal","impersonal"),
}
VBKEY = {
 'presente':('indicativo','presente'),
 'imperfetto':('indicativo','imperfetto'),
 'futuro':('indicativo','futuro'),
 'condizionale':('condizionale','presente'),
 'congPresente':('congiuntivo','presente'),
 'congImperfetto':('congiuntivo','imperfetto'),
 'passatoProssimo':None,'trapassato':None,'imperativo':None,'infinito':None,
}
PERSON2PR = {'io':'io','tu':'tu','lui':'lui','noi':'noi','voi':'voi','loro':'loro'}
