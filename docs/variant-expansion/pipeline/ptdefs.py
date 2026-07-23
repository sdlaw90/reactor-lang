# -*- coding: utf-8 -*-
# Portuguese tense (T) and person (P) tag defs for pt*ForEnTags.js + verbecc verify map.
T_DEFS = {
 'presente':      ("Presente","Presente","Habitual or current actions.","Acciones habituales o actuales."),
 'pretPerfeito':  ("Pretérito perfeito","Pretérito perfecto","A completed past action (\"did\").","Una acción pasada completada."),
 'imperfeito':    ("Pretérito imperfeito","Imperfecto","Ongoing, habitual or background past actions.","Acciones pasadas en curso o habituales."),
 'futuro':        ("Futuro","Futuro","What will happen.","Lo que ocurrirá."),
 'condicional':   ("Futuro do pretérito","Condicional","What would happen, and polite requests.","Lo que ocurriría, y peticiones corteses."),
 'presSubj':      ("Presente do subjuntivo","Presente de subjuntivo","Triggered by wish, doubt, emotion (espero que, talvez, embora).","Lo activan el deseo, la duda o la emoción (espero que, talvez, embora)."),
 'impSubj':       ("Imperfeito do subjuntivo","Imperfecto de subjuntivo","Past-subjunctive contexts and the 'se' hypothetical.","Contextos de subjuntivo pasado y la hipótesis con 'se'."),
 'futSubj':       ("Futuro do subjuntivo","Futuro de subjuntivo","After 'quando' or 'se' about the future — a Portuguese-specific tense.","Tras 'quando' o 'se' sobre el futuro — un tiempo propio del portugués."),
 'infPessoal':    ("Infinitivo pessoal","Infinitivo personal","The inflected infinitive — a Portuguese-specific form.","El infinitivo flexionado — una forma propia del portugués."),
 'imperativo':    ("Imperativo","Imperativo","Telling someone to do something.","Decirle a alguien que haga algo."),
 'maisQuePerfeito':("Mais-que-perfeito","Pluscuamperfecto","A past action before another past moment (\"had done\").","Una acción pasada anterior a otro momento pasado."),
}
P_DEFS = {
 'eu':   ("eu (I)","yo"),
 'tu':   ("tu (you)","tú"),
 'você': ("você (you)","usted"),
 'ele':  ("ele / ela (he/she)","él / ella"),
 'nós':  ("nós (we)","nosotros"),
 'eles': ("eles / elas (they)","ellos / ellas"),
 'vocês':("vocês (you all)","ustedes"),
}
VBKEY = {
 'presente':('indicativo','presente'),
 'imperfeito':('indicativo','pretérito-imperfeito'),
 'pretPerfeito':('indicativo','pretérito-perfeito'),
 'futuro':('indicativo','futuro-do-presente'),
 'condicional':('condicional','futuro-do-pretérito'),
 'presSubj':('subjuntivo','presente'),
 'impSubj':('subjuntivo','pretérito-imperfeito'),
 'futSubj':('subjuntivo','futuro'),
 'infPessoal':('infinitivo','infinitivo-pessoal-presente'),
 'imperativo':None,'maisQuePerfeito':None,
}
PERSON2PR = {'eu':'eu','tu':'tu','você':'você','ele':'ele','nós':'nós','eles':'eles','vocês':'vocês'}
