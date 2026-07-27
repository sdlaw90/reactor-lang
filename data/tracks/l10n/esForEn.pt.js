// v3.2 (pt-BR source) — LOCALIZED-SURFACE side table for the reused
// Spanish-target track "es-latam-for-en", consumed by a Brazilian Portuguese
// speaker learning Spanish ("one track, many sources", see l10n/index.js).
//
// Keyed by item id "cat-i" (0-indexed within each base bank category, matching
// the engine flattenBank order): vocab-*, verbo-*, trad-*, fvocab-*. Each value
// carries ONLY the fields that must change for a pt-BR learner:
//   { prompt?, promptNative?, options? } — any omitted field falls back to the
// base (English) surface. The Spanish ANSWER OPTIONS the learner is choosing
// among stay Spanish and are NOT overridden for vocab(production)/verbo/trad or
// fvocab(production); they ARE translated for recognition items (vocab 'significa'
// and fvocab even-index), whose base options are English glosses.
//
// Category coverage (base counts): vocab 134/134, verbo 404/404, trad 127/127,
// fvocab 609/609 (Word Bank, generator-replayed). fvocab + vocab recognition
// option arrays are index-aligned to the base English options (correctIdx
// unchanged); parity asserted at build time.
//
// AI-authored (Opus) 2026-07-26 — FLAG FOR #41 native review (no pt-BR reviewer
// lined up yet). A missing entry falls back to the base English surface (safe).

export default {
 "vocab-0": {
  "prompt": "¿Cómo se dice 'janela' en español?",
  "promptNative": "Como se diz 'janela' em espanhol?"
 },
 "vocab-1": {
  "prompt": "¿Cómo se dice 'esquecer' en español?",
  "promptNative": "Como se diz 'esquecer' em espanhol?"
 },
 "vocab-3": {
  "prompt": "¿Cómo se dice 'prazo' en español?",
  "promptNative": "Como se diz 'prazo' em espanhol?"
 },
 "vocab-5": {
  "prompt": "¿Cómo se dice 'teclado' en español?",
  "promptNative": "Como se diz 'teclado' em espanhol?"
 },
 "vocab-7": {
  "prompt": "¿Cómo se dice 'teimoso' en español?",
  "promptNative": "Como se diz 'teimoso' em espanhol?"
 },
 "vocab-9": {
  "prompt": "¿Cómo se dice 'consertar' (reparar) en español?",
  "promptNative": "Como se diz 'consertar' (reparar) em espanhol?"
 },
 "vocab-11": {
  "prompt": "¿Cómo se dice 'colega de quarto' en español?",
  "promptNative": "Como se diz 'colega de quarto' em espanhol?"
 },
 "vocab-13": {
  "prompt": "¿Cómo se dice 'criança pequena' en español?",
  "promptNative": "Como se diz 'criança pequena' em espanhol?"
 },
 "vocab-15": {
  "prompt": "¿Cómo se dice 'colega de trabalho' en español?",
  "promptNative": "Como se diz 'colega de trabalho' em espanhol?"
 },
 "vocab-17": {
  "prompt": "¿Cómo se dice 'pensar demais' en español?",
  "promptNative": "Como se diz 'pensar demais' em espanhol?"
 },
 "vocab-18": {
  "prompt": "¿Cómo se dice 'cachorro' en español?",
  "promptNative": "Como se diz 'cachorro' em espanhol?"
 },
 "vocab-21": {
  "prompt": "¿Cómo se dice 'carro' en español (Latinoamérica)?",
  "promptNative": "Como se diz 'carro' em espanhol (América Latina)?"
 },
 "vocab-22": {
  "prompt": "¿Cómo se dice 'celular' en español (Latinoamérica)?",
  "promptNative": "Como se diz 'celular' em espanhol (América Latina)?"
 },
 "vocab-23": {
  "prompt": "¿Cómo se dice 'suco' en español (Latinoamérica)?",
  "promptNative": "Como se diz 'suco' em espanhol (América Latina)?"
 },
 "vocab-24": {
  "prompt": "¿Cómo se dice 'computador' en español (Latinoamérica)?",
  "promptNative": "Como se diz 'computador' em espanhol (América Latina)?"
 },
 "vocab-26": {
  "prompt": "¿Cómo se dice 'abacate' en español?",
  "promptNative": "Como se diz 'abacate' em espanhol?"
 },
 "vocab-39": {
  "prompt": "¿Cómo se dice 'o emprego/trabalho' en español?",
  "promptNative": "Como se diz 'o emprego/trabalho' em espanhol?"
 },
 "vocab-41": {
  "prompt": "¿Cómo se dice 'o vizinho' en español?",
  "promptNative": "Como se diz 'o vizinho' em espanhol?"
 },
 "vocab-43": {
  "prompt": "¿Cómo se dice 'o aeroporto' en español?",
  "promptNative": "Como se diz 'o aeroporto' em espanhol?"
 },
 "vocab-45": {
  "prompt": "¿Cómo se dice 'a floresta' en español?",
  "promptNative": "Como se diz 'a floresta' em espanhol?"
 },
 "vocab-47": {
  "prompt": "¿Cómo se dice 'o namorado/a namorada' en español?",
  "promptNative": "Como se diz 'o namorado/a namorada' em espanhol?"
 },
 "vocab-49": {
  "prompt": "¿Cómo se dice 'a ideia' en español?",
  "promptNative": "Como se diz 'a ideia' em espanhol?"
 },
 "vocab-51": {
  "prompt": "¿Cómo se dice 'a reunião' en español?",
  "promptNative": "Como se diz 'a reunião' em espanhol?"
 },
 "vocab-53": {
  "prompt": "¿Cómo se dice 'legal/bacana' (informal) en español?",
  "promptNative": "Como se diz 'legal/bacana' (informal) em espanhol?"
 },
 "vocab-55": {
  "prompt": "¿Cómo se dice 'reclamar' en español?",
  "promptNative": "Como se diz 'reclamar' em espanhol?"
 },
 "vocab-56": {
  "prompt": "¿Cómo se dice 'o prazo' en español?",
  "promptNative": "Como se diz 'o prazo' em espanhol?"
 },
 "vocab-58": {
  "prompt": "¿Cómo se dice 'o celular' en español (en muchos paises de America Latina)?",
  "promptNative": "Como se diz 'o celular' em espanhol (em muitos países da América Latina)?"
 },
 "vocab-60": {
  "prompt": "¿Cómo se dice 'confiar' en español?",
  "promptNative": "Como se diz 'confiar' em espanhol?"
 },
 "vocab-62": {
  "prompt": "¿Cómo se dice 'o recibo' en español?",
  "promptNative": "Como se diz 'o recibo' em espanhol?"
 },
 "vocab-63": {
  "prompt": "¿Cómo se dice 'com saudade de casa' en español?",
  "promptNative": "Como se diz 'com saudade de casa' em espanhol?"
 },
 "vocab-64": {
  "prompt": "¿Cómo se dice 'acostumar-se' en español?",
  "promptNative": "Como se diz 'acostumar-se' em espanhol?"
 },
 "vocab-66": {
  "prompt": "¿Cómo se dice 'economizar dinheiro' en español?",
  "promptNative": "Como se diz 'economizar dinheiro' em espanhol?"
 },
 "vocab-68": {
  "prompt": "¿Cómo se dice 'apaixonar-se' en español?",
  "promptNative": "Como se diz 'apaixonar-se' em espanhol?"
 },
 "vocab-70": {
  "prompt": "¿Cómo se dice 'carregar a bateria' en español?",
  "promptNative": "Como se diz 'carregar a bateria' em espanhol?"
 },
 "vocab-74": {
  "prompt": "¿Cómo se dice 'o shopping' en español?",
  "promptNative": "Como se diz 'o shopping' em espanhol?"
 },
 "vocab-76": {
  "prompt": "¿Cómo se dice 'sentir falta (de uma pessoa)' en español?",
  "promptNative": "Como se diz 'sentir falta (de uma pessoa)' em espanhol?"
 },
 "vocab-78": {
  "prompt": "¿Cómo se dice 'pedir desculpas' en español?",
  "promptNative": "Como se diz 'pedir desculpas' em espanhol?"
 },
 "vocab-79": {
  "prompt": "¿Cómo se dice 'carregar (um celular)' en español?",
  "promptNative": "Como se diz 'carregar (um celular)' em espanhol?"
 },
 "vocab-80": {
  "prompt": "¿Cómo se dice 'ficar sem (algo)' en español?",
  "promptNative": "Como se diz 'ficar sem (algo)' em espanhol?"
 },
 "vocab-82": {
  "prompt": "¿Cómo se dice 'fazer um esforço' en español?",
  "promptNative": "Como se diz 'fazer um esforço' em espanhol?"
 },
 "vocab-84": {
  "prompt": "¿Cómo se dice 'confiável' en español?",
  "promptNative": "Como se diz 'confiável' em espanhol?"
 },
 "vocab-86": {
  "prompt": "¿Cómo se dice 'aproveitar' en español?",
  "promptNative": "Como se diz 'aproveitar' em espanhol?"
 },
 "vocab-88": {
  "prompt": "¿Cómo se dice 'se enturmar (socialmente)' en español?",
  "promptNative": "Como se diz 'se enturmar (socialmente)' em espanhol?"
 },
 "vocab-90": {
  "prompt": "¿Cómo se dice 'colocar em dia (algo)' en español?",
  "promptNative": "Como se diz 'colocar em dia (algo)' em espanhol?"
 },
 "vocab-91": {
  "prompt": "¿Cómo se dice 'fazer as pazes (reconciliar)' en español?",
  "promptNative": "Como se diz 'fazer as pazes (reconciliar)' em espanhol?"
 },
 "vocab-93": {
  "prompt": "¿Cómo se dice 'superar (um desafio)' en español?",
  "promptNative": "Como se diz 'superar (um desafio)' em espanhol?"
 },
 "vocab-95": {
  "prompt": "¿Cómo se dice 'o trajeto (para o trabalho)' en español?",
  "promptNative": "Como se diz 'o trajeto (para o trabalho)' em espanhol?"
 },
 "vocab-97": {
  "prompt": "¿Cómo se dice 'subornar' en español?",
  "promptNative": "Como se diz 'subornar' em espanhol?"
 },
 "vocab-99": {
  "prompt": "¿Cómo se dice 'colocar em dia (notícias/trabalho)' en español?",
  "promptNative": "Como se diz 'colocar em dia (notícias/trabalho)' em espanhol?"
 },
 "vocab-100": {
  "prompt": "¿Cómo se dice 'juntar dinheiro' en español?",
  "promptNative": "Como se diz 'juntar dinheiro' em espanhol?"
 },
 "vocab-102": {
  "prompt": "¿Cómo se dice 'carregar (um celular/bateria)' en español?",
  "promptNative": "Como se diz 'carregar (um celular/bateria)' em espanhol?"
 },
 "vocab-104": {
  "prompt": "¿Cómo se dice 'dar como certo' en español?",
  "promptNative": "Como se diz 'dar como certo' em espanhol?"
 },
 "vocab-105": {
  "prompt": "¿Cómo se dice 'resolver afazeres' en español?",
  "promptNative": "Como se diz 'resolver afazeres' em espanhol?"
 },
 "vocab-107": {
  "prompt": "¿Cómo se dice 'estar ansioso por' en español?",
  "promptNative": "Como se diz 'estar ansioso por' em espanhol?"
 },
 "vocab-109": {
  "prompt": "¿Cómo se dice 'procrastinar' en español?",
  "promptNative": "Como se diz 'procrastinar' em espanhol?"
 },
 "vocab-111": {
  "prompt": "¿Cómo se dice 'mandar mensagem (para alguém)' en español?",
  "promptNative": "Como se diz 'mandar mensagem (para alguém)' em espanhol?"
 },
 "vocab-114": {
  "prompt": "Cómo se dice 'sobrecarregar (alguém)' en español?",
  "promptNative": "Como se diz 'sobrecarregar (alguém)' em espanhol?"
 },
 "vocab-116": {
  "prompt": "Cómo se dice 'desviar dinheiro' en español?",
  "promptNative": "Como se diz 'desviar dinheiro' em espanhol?"
 },
 "vocab-117": {
  "prompt": "Cómo se dice 'inovador/pioneiro' en español?",
  "promptNative": "Como se diz 'inovador/pioneiro' em espanhol?"
 },
 "vocab-119": {
  "prompt": "Cómo se dice 'pôr em risco' en español?",
  "promptNative": "Como se diz 'pôr em risco' em espanhol?"
 },
 "vocab-121": {
  "prompt": "Cómo se dice 'sair pela culatra' en español?",
  "promptNative": "Como se diz 'sair pela culatra' em espanhol?"
 },
 "vocab-123": {
  "prompt": "Cómo se dice 'fazer vista grossa' en español?",
  "promptNative": "Como se diz 'fazer vista grossa' em espanhol?"
 },
 "vocab-124": {
  "prompt": "Cómo se dice 'fechar as contas do mês' en español?",
  "promptNative": "Como se diz 'fechar as contas do mês' em espanhol?"
 },
 "vocab-126": {
  "prompt": "Cómo se dice 'aceitar algo/conformar-se com algo' en español?",
  "promptNative": "Como se diz 'aceitar algo/conformar-se com algo' em espanhol?"
 },
 "vocab-128": {
  "prompt": "¿Cómo se dice 'desperdiçar (uma oportunidade)' en español?",
  "promptNative": "Como se diz 'desperdiçar (uma oportunidade)' em espanhol?"
 },
 "vocab-129": {
  "prompt": "¿Cómo se dice 'guardar rancor' en español?",
  "promptNative": "Como se diz 'guardar rancor' em espanhol?"
 },
 "vocab-130": {
  "prompt": "¿Cómo se dice 'implacável' en español?",
  "promptNative": "Como se diz 'implacável' em espanhol?"
 },
 "vocab-132": {
  "prompt": "¿Cómo se dice 'menosprezar' en español?",
  "promptNative": "Como se diz 'menosprezar' em espanhol?"
 },
 "vocab-133": {
  "prompt": "¿Cómo se dice 'a disputa (ex.: eleitoral ou ideológica)' en español?",
  "promptNative": "Como se diz 'a disputa (ex.: eleitoral ou ideológica)' em espanhol?"
 },
 "vocab-2": {
  "promptNative": "'La almohada' significa...",
  "options": [
   "travesseiro",
   "cobertor",
   "colchão",
   "cortina"
  ]
 },
 "vocab-4": {
  "promptNative": "'Madrugar' significa...",
  "options": [
   "acordar cedo",
   "ficar acordado até tarde",
   "tirar uma soneca",
   "dormir demais"
  ]
 },
 "vocab-6": {
  "promptNative": "'Aprovechar' significa...",
  "options": [
   "aproveitar ao máximo",
   "desperdiçar",
   "esquecer de",
   "adiar"
  ]
 },
 "vocab-8": {
  "promptNative": "'La factura' significa...",
  "options": [
   "a conta/fatura",
   "a sacola do recibo",
   "a pasta",
   "o contrato"
  ]
 },
 "vocab-10": {
  "promptNative": "'Chismear' significa...",
  "options": [
   "fofocar",
   "cozinhar",
   "gritar",
   "viajar"
  ]
 },
 "vocab-12": {
  "promptNative": "'Enterarse' significa...",
  "options": [
   "ficar sabendo",
   "enterrar",
   "entrar",
   "dormir"
  ]
 },
 "vocab-14": {
  "promptNative": "'La pereza' significa...",
  "options": [
   "preguiça",
   "fome",
   "tristeza",
   "raiva"
  ]
 },
 "vocab-16": {
  "promptNative": "'Madrugada' significa...",
  "options": [
   "a madrugada",
   "o meio-dia",
   "o pôr do sol",
   "o lanche da meia-noite"
  ]
 },
 "vocab-19": {
  "promptNative": "'La casa' significa...",
  "options": [
   "casa",
   "carro",
   "mesa",
   "rua"
  ]
 },
 "vocab-20": {
  "promptNative": "'Comer' significa...",
  "options": [
   "comer",
   "comprar",
   "correr",
   "dormir"
  ]
 },
 "vocab-25": {
  "promptNative": "'La ropa' significa...",
  "options": [
   "roupa",
   "corda",
   "tapete",
   "sabonete"
  ]
 },
 "vocab-27": {
  "promptNative": "'Embarazada' significa...",
  "options": [
   "grávida",
   "envergonhado",
   "abraçado",
   "ocupado"
  ]
 },
 "vocab-28": {
  "promptNative": "'Actualmente' significa...",
  "options": [
   "atualmente",
   "na verdade",
   "com precisão",
   "eventualmente"
  ]
 },
 "vocab-29": {
  "promptNative": "'El éxito' significa...",
  "options": [
   "sucesso",
   "saída",
   "empolgação",
   "prova"
  ]
 },
 "vocab-30": {
  "promptNative": "'Extrañar (a alguien)' significa... (América Latina)",
  "options": [
   "sentir falta (de alguém)",
   "achar estranho",
   "afastar",
   "esticar"
  ]
 },
 "vocab-31": {
  "promptNative": "'Realizar' significa...",
  "options": [
   "realizar / concretizar",
   "perceber (dar-se conta)",
   "fazer negócios imobiliários",
   "ensaiar"
  ]
 },
 "vocab-32": {
  "promptNative": "'Asistir a' significa...",
  "options": [
   "comparecer a",
   "auxiliar / ajudar",
   "insistir em",
   "consistir em"
  ]
 },
 "vocab-33": {
  "promptNative": "'Desvelarse' significa...",
  "options": [
   "ficar acordado até tarde / perder o sono",
   "desvelar-se (revelar-se)",
   "acordar cedo",
   "adormecer"
  ]
 },
 "vocab-34": {
  "promptNative": "'La plata' significa... (coloquial, América do Sul)",
  "options": [
   "dinheiro (gíria)",
   "apenas um troféu de prata",
   "um prato raso",
   "uma praia pequena"
  ]
 },
 "vocab-35": {
  "promptNative": "'La chamba' significa... (coloquial)",
  "options": [
   "trabalho / emprego (gíria)",
   "uma piada",
   "uma sandália",
   "uma pechincha"
  ]
 },
 "vocab-36": {
  "promptNative": "'Platicar' significa... (México e América Central)",
  "options": [
   "conversar / bater papo",
   "servir comida em pratos",
   "achatar",
   "aplicar banho de prata"
  ]
 },
 "vocab-37": {
  "promptNative": "'Apapachar' significa... (coloquial, México e América Central)",
  "options": [
   "fazer carinho / mimar com afeto",
   "esmagar",
   "aplaudir alto",
   "remendar algo"
  ]
 },
 "vocab-38": {
  "promptNative": "'Ningunear' significa...",
  "options": [
   "menosprezar / tratar como ninguém",
   "dizer não repetidamente",
   "reduzir a zero",
   "permanecer neutro"
  ]
 },
 "vocab-40": {
  "promptNative": "'El jugo' significa...",
  "options": [
   "o suco",
   "a sopa",
   "o leite",
   "o gelo"
  ]
 },
 "vocab-42": {
  "promptNative": "'Triste' significa...",
  "options": [
   "triste",
   "cansado",
   "zangado",
   "entediado"
  ]
 },
 "vocab-44": {
  "promptNative": "'El celular' significa...",
  "options": [
   "o celular",
   "o computador",
   "o controle remoto",
   "o carregador"
  ]
 },
 "vocab-46": {
  "promptNative": "'La cita' significa...",
  "options": [
   "o compromisso/encontro",
   "o mapa",
   "o cartão de convite",
   "o recibo"
  ]
 },
 "vocab-48": {
  "promptNative": "'Aburrido' significa...",
  "options": [
   "entediado/chato",
   "cansado",
   "nervoso",
   "feliz"
  ]
 },
 "vocab-50": {
  "promptNative": "'La palta' significa...",
  "options": [
   "o abacate",
   "a batata",
   "a pera",
   "a abóbora"
  ]
 },
 "vocab-52": {
  "promptNative": "'El paisaje' significa...",
  "options": [
   "a paisagem/o cenário",
   "o país",
   "o passaporte",
   "o mapa"
  ]
 },
 "vocab-54": {
  "promptNative": "'La confianza' significa...",
  "options": [
   "a confiança",
   "a confusão",
   "a conferência",
   "a confissão"
  ]
 },
 "vocab-57": {
  "promptNative": "'Extrañar' significa...",
  "options": [
   "sentir falta (de alguém)",
   "ser estranho",
   "explicar",
   "esticar"
  ]
 },
 "vocab-59": {
  "promptNative": "'El carro' significa...",
  "options": [
   "o carro",
   "a carta",
   "a cenoura",
   "a carga"
  ]
 },
 "vocab-61": {
  "promptNative": "'Chevere' significa...",
  "options": [
   "legal/ótimo",
   "cereja",
   "caro",
   "perigoso"
  ]
 },
 "vocab-65": {
  "promptNative": "'El equipaje' significa...",
  "options": [
   "a bagagem",
   "a equipe",
   "o equador",
   "a sala de equipamentos"
  ]
 },
 "vocab-67": {
  "promptNative": "'La cosecha' significa...",
  "options": [
   "a colheita",
   "a cozinha",
   "a costa",
   "a receita"
  ]
 },
 "vocab-69": {
  "promptNative": "'La sombra' significa...",
  "options": [
   "a sombra",
   "a surpresa",
   "o chapéu",
   "a tempestade"
  ]
 },
 "vocab-71": {
  "promptNative": "'El plazo' significa...",
  "options": [
   "o prazo",
   "o prato",
   "o plano",
   "a praça"
  ]
 },
 "vocab-72": {
  "promptNative": "'El aguacate' significa...",
  "options": [
   "o abacate",
   "a berinjela",
   "o pepino",
   "o abacaxi"
  ]
 },
 "vocab-73": {
  "promptNative": "'El desafio' significa...",
  "options": [
   "o desafio",
   "o deserto",
   "o desastre",
   "a derrota"
  ]
 },
 "vocab-75": {
  "promptNative": "'La cordillera' significa...",
  "options": [
   "a cordilheira",
   "o litoral",
   "o campo",
   "a caverna"
  ]
 },
 "vocab-77": {
  "promptNative": "'El sueldo' significa...",
  "options": [
   "o salário",
   "o sono",
   "o sonho",
   "o chão/solo"
  ]
 },
 "vocab-81": {
  "promptNative": "'La verguenza' significa...",
  "options": [
   "a vergonha",
   "a verdade",
   "a vingança",
   "a vegetação"
  ]
 },
 "vocab-83": {
  "promptNative": "'El chisme' significa...",
  "options": [
   "a fofoca",
   "a bugiganga",
   "a batata frita (salgadinho)",
   "o truque"
  ]
 },
 "vocab-85": {
  "promptNative": "'El madrugador' significa...",
  "options": [
   "o madrugador",
   "a madrasta",
   "a maturidade",
   "o lenhador"
  ]
 },
 "vocab-87": {
  "promptNative": "'El malentendido' significa...",
  "options": [
   "o mal-entendido",
   "o mau hábito",
   "o erro",
   "o infortúnio"
  ]
 },
 "vocab-89": {
  "promptNative": "'La jugada' significa...",
  "options": [
   "a jogada",
   "o suco",
   "o brinquedo",
   "a piada"
  ]
 },
 "vocab-92": {
  "promptNative": "'La madrugada' significa...",
  "options": [
   "a madrugada (antes do amanhecer)",
   "a soneca da tarde",
   "o pôr do sol",
   "o fim de semana"
  ]
 },
 "vocab-94": {
  "promptNative": "'El asombro' significa...",
  "options": [
   "assombro/espanto",
   "a sombra",
   "o fardo",
   "tédio"
  ]
 },
 "vocab-96": {
  "promptNative": "'Imprescindible' significa...",
  "options": [
   "essencial/indispensável",
   "impossível",
   "impreciso",
   "improvisado"
  ]
 },
 "vocab-98": {
  "promptNative": "'La huella' significa...",
  "options": [
   "a pegada/o rastro",
   "o buraco",
   "a roda",
   "a prateleira"
  ]
 },
 "vocab-101": {
  "promptNative": "'El vínculo' significa...",
  "options": [
   "o vínculo/laço",
   "a fronteira",
   "a armadilha",
   "o suborno"
  ]
 },
 "vocab-103": {
  "promptNative": "'El desahogo' significa...",
  "options": [
   "o desabafo/alívio emocional",
   "a decepção",
   "o desconto",
   "a vergonha"
  ]
 },
 "vocab-106": {
  "promptNative": "'El agobio' significa...",
  "options": [
   "a sobrecarga/o estresse",
   "o tédio",
   "a gratidão",
   "a coragem"
  ]
 },
 "vocab-108": {
  "promptNative": "'La retroalimentación' significa...",
  "options": [
   "o feedback/retorno",
   "a reflexão",
   "o recuo",
   "a revocação"
  ]
 },
 "vocab-110": {
  "promptNative": "'El entorno' significa...",
  "options": [
   "o ambiente/entorno",
   "a entrada",
   "a virada",
   "o interior"
  ]
 },
 "vocab-112": {
  "promptNative": "'El desenlace' significa...",
  "options": [
   "o desfecho/final",
   "o começo",
   "o disfarce",
   "o desconto"
  ]
 },
 "vocab-113": {
  "promptNative": "'El acervo' significa...",
  "options": [
   "o acervo/patrimônio",
   "a papelada",
   "o atalho",
   "o teto"
  ]
 },
 "vocab-115": {
  "promptNative": "'La coyuntura' significa...",
  "options": [
   "a conjuntura (econômica/política)",
   "a coincidência",
   "o prazo",
   "a travessia da fronteira"
  ]
 },
 "vocab-118": {
  "promptNative": "'El resquicio' significa...",
  "options": [
   "a fresta/o vislumbre (de esperança)",
   "o recurso",
   "o ressentimento",
   "o resíduo"
  ]
 },
 "vocab-120": {
  "promptNative": "'El hincapie' significa...",
  "options": [
   "a ênfase (hacer hincapié en = enfatizar)",
   "a pegada",
   "a lesão no calcanhar",
   "a soleira da porta"
  ]
 },
 "vocab-122": {
  "promptNative": "'La idiosincrasia' significa...",
  "options": [
   "a idiossincrasia/o caráter distintivo",
   "a ideologia",
   "a doença",
   "a carteira de identidade"
  ]
 },
 "vocab-125": {
  "promptNative": "'El trasfondo' significa...",
  "options": [
   "o pano de fundo/contexto subjacente",
   "a transferência",
   "a tradução",
   "a sobra"
  ]
 },
 "vocab-127": {
  "promptNative": "'El pormenor' significa...",
  "options": [
   "o pormenor/detalhe",
   "o ponto principal",
   "o resumo",
   "o prazo"
  ]
 },
 "vocab-131": {
  "promptNative": "'La zozobra' significa...",
  "options": [
   "a angústia/aflição",
   "o sobrevivente do naufrágio",
   "a celebração",
   "a negociação"
  ]
 },
 "verbo-0": {
  "promptNative": "Eu _____ (tener = ter) muita fome agora mesmo."
 },
 "verbo-1": {
  "promptNative": "Nós _____ (querer = querer) sair esta noite."
 },
 "verbo-2": {
  "promptNative": "Ela _____ (dormir = dormir) oito horas ontem à noite."
 },
 "verbo-3": {
  "promptNative": "Você _____ (poder = poder) me ajudar amanhã?"
 },
 "verbo-4": {
  "promptNative": "Ontem eu _____ (ir = ir) à academia."
 },
 "verbo-5": {
  "promptNative": "Eles _____ (estar = estar) trabalhando quando eu liguei."
 },
 "verbo-6": {
  "promptNative": "Amanhã nós _____ (llegar = chegar) atrasados, com certeza."
 },
 "verbo-7": {
  "promptNative": "Se eu tivesse tempo, eu _____ (viajar = viajar) mais."
 },
 "verbo-8": {
  "promptNative": "Espero que você _____ (venir = vir) à festa."
 },
 "verbo-9": {
  "promptNative": "Eu já _____ (terminar = terminar) o projeto."
 },
 "verbo-10": {
  "promptNative": "Ela _____ (decir = dizer) que chegaria às oito."
 },
 "verbo-11": {
  "promptNative": "Nós _____ (ver = ver) aquele filme três vezes."
 },
 "verbo-12": {
  "promptNative": "O que você _____ (hacer = fazer) se ganhasse na loteria?"
 },
 "verbo-13": {
  "promptNative": "Quando eu era criança, eu _____ (jugar = jogar) futebol todos os dias."
 },
 "verbo-14": {
  "promptNative": "É importante que eles _____ (llegar = chegar) cedo."
 },
 "verbo-15": {
  "promptNative": "Eu me _____ (levantarse = levantar-se) às seis todos os dias."
 },
 "verbo-16": {
  "promptNative": "Ela _____ (ser = ser) médica."
 },
 "verbo-17": {
  "promptNative": "Nós _____ (estar = estar) no cinema agora."
 },
 "verbo-18": {
  "promptNative": "Você tem que _____ (estudiar = estudar) para a prova."
 },
 "verbo-19": {
  "promptNative": "Ela está _____ (correr = correr) no parque."
 },
 "verbo-20": {
  "promptNative": "Eu _____ (gustar = gostar) de tacos. (Literalmente: os tacos me agradam.)"
 },
 "verbo-21": {
  "promptNative": "Eles _____ (vivir = morar) em Bogotá desde 2020."
 },
 "verbo-22": {
  "promptNative": "Não _____ (tocar = tocar) nisso, por favor."
 },
 "verbo-23": {
  "promptNative": "_____ (venir = vir) aqui, filho, o jantar está pronto."
 },
 "verbo-24": {
  "promptNative": "Quando eu _____ (llegar = chegar) em casa, vou te ligar."
 },
 "verbo-25": {
  "promptNative": "Duvido que ele _____ (saber = saber) disso."
 },
 "verbo-26": {
  "promptNative": "Tomara que nós _____ (poder = poder) ir amanhã."
 },
 "verbo-27": {
  "promptNative": "Casas se _____ (vender = vender) neste bairro."
 },
 "verbo-28": {
  "promptNative": "Eu _____ (olvidar = esquecer) as chaves. (Literalmente: as chaves se esqueceram em mim.)"
 },
 "verbo-29": {
  "promptNative": "Se eu _____ (saber = saber) antes, teria te avisado."
 },
 "verbo-30": {
  "promptNative": "Não acho que eles _____ (llegar = chegar) ainda."
 },
 "verbo-31": {
  "promptNative": "Eu gostaria que você me _____ (decir = dizer) com mais antecedência."
 },
 "verbo-32": {
  "promptNative": "_____ (haber) eu sabido, não teria vindo. ('Se eu tivesse sabido...')"
 },
 "verbo-33": {
  "promptNative": "Seja como _____ (ser = ser), tem que ser terminado hoje."
 },
 "verbo-34": {
  "promptNative": "Eu _____ (hacer = fazer) minha lição de casa toda noite."
 },
 "verbo-35": {
  "promptNative": "Eu _____ (poner = pôr) a mesa antes do jantar."
 },
 "verbo-36": {
  "promptNative": "Eu _____ (salir = sair) do trabalho às seis."
 },
 "verbo-37": {
  "promptNative": "Eu não _____ (saber = saber) a resposta."
 },
 "verbo-38": {
  "promptNative": "Você _____ (conocer = conhecer) meu irmão?"
 },
 "verbo-39": {
  "promptNative": "Ontem ela _____ (hacer = fazer) um bolo."
 },
 "verbo-40": {
  "promptNative": "Ontem à noite nós _____ (tener = ter) um problema."
 },
 "verbo-41": {
  "promptNative": "Eles me _____ (decir = contar) a verdade."
 },
 "verbo-42": {
  "promptNative": "Você _____ (traer = trazer) a sobremesa?"
 },
 "verbo-43": {
  "promptNative": "Quando eu era criança, eu _____ (jugar = brincar) no parque."
 },
 "verbo-44": {
  "promptNative": "A casa _____ (ser = ser) grande e velha."
 },
 "verbo-45": {
  "promptNative": "A sopa _____ (estar = estar) fria."
 },
 "verbo-46": {
  "promptNative": "Minha irmã _____ (ser = ser) médica."
 },
 "verbo-47": {
  "promptNative": "Eu _____ (gustar = gostar) de tacos. (lit. os tacos me agradam)"
 },
 "verbo-48": {
  "promptNative": "Minhas pernas _____ (doler = doer) depois de correr."
 },
 "verbo-49": {
  "promptNative": "Eu me _____ (despertarse = acordar) às sete."
 },
 "verbo-50": {
  "promptNative": "As crianças estão _____ (dormir = dormir) agora."
 },
 "verbo-51": {
  "promptNative": "Estou _____ (leer = ler) um romance muito bom."
 },
 "verbo-52": {
  "promptNative": "Quero que você _____ (estudiar = estudar) mais."
 },
 "verbo-53": {
  "promptNative": "Espero que não _____ (llover = chover) amanhã."
 },
 "verbo-54": {
  "promptNative": "Não acho que ele _____ (tener = ter) razão."
 },
 "verbo-55": {
  "promptNative": "Vou explicar para que você _____ (entender = entender)."
 },
 "verbo-56": {
  "promptNative": "_____ (venir = vir) aqui agora mesmo!"
 },
 "verbo-57": {
  "promptNative": "_____ (hacer = fazer) sua cama, por favor."
 },
 "verbo-58": {
  "promptNative": "_____ (poner = pôr) atenção, por favor. (prestar atenção)"
 },
 "verbo-59": {
  "promptNative": "Não _____ (hablar = falar) tão rápido."
 },
 "verbo-60": {
  "promptNative": "_____ (seguir = seguir) reto até o semáforo."
 },
 "verbo-61": {
  "promptNative": "Vamos _____ (empezar = começar) agora, está ficando tarde."
 },
 "verbo-62": {
  "promptNative": "Amanhã _____ (haber = haver) uma reunião importante."
 },
 "verbo-63": {
  "promptNative": "Se eu fosse você, não _____ (decir = dizer) nada."
 },
 "verbo-64": {
  "promptNative": "Você já _____ (probar = experimentar) ceviche?"
 },
 "verbo-65": {
  "promptNative": "Quando cheguei, eles já _____ (irse = ir embora)."
 },
 "verbo-66": {
  "promptNative": "Às cinco eu já terei _____ (terminar = terminar) tudo."
 },
 "verbo-67": {
  "promptNative": "Com mais tempo, eu teria _____ (hacer = fazer) melhor."
 },
 "verbo-68": {
  "promptNative": "Espero que você _____ (llegar = chegar) em casa bem."
 },
 "verbo-69": {
  "promptNative": "Se você me _____ (decir = dizer), eu teria te ajudado."
 },
 "verbo-70": {
  "promptNative": "Ela me _____ (pedir = pedir) um favor ontem."
 },
 "verbo-71": {
  "promptNative": "Eles _____ (seguir = continuar) trabalhando apesar de tudo."
 },
 "verbo-72": {
  "promptNative": "Eu _____ (trabajar = trabalhar) em um escritório grande."
 },
 "verbo-73": {
  "promptNative": "Nós _____ (comer = comer) arroz com frango aos domingos."
 },
 "verbo-74": {
  "promptNative": "Ela _____ (vivir = morar) perto da praia."
 },
 "verbo-75": {
  "promptNative": "Ontem nós _____ (viajar = viajar) para Bogotá."
 },
 "verbo-76": {
  "promptNative": "Você _____ (ser = ser) muito gentil com todos."
 },
 "verbo-77": {
  "promptNative": "As crianças _____ (estar = estar) cansadas depois da escola."
 },
 "verbo-78": {
  "promptNative": "Eu gosto ('gustar' = agradar/gostar) de suco de manga."
 },
 "verbo-79": {
  "promptNative": "Todos os dias eu _____ (desayunar = tomar café da manhã) antes de sair para o trabalho."
 },
 "verbo-80": {
  "promptNative": "Minha irmã _____ (ser = ser) muito paciente com as crianças."
 },
 "verbo-81": {
  "promptNative": "Ontem nós _____ (comer = comer) em um restaurante novo no centro."
 },
 "verbo-82": {
  "promptNative": "Eu realmente _____ (gustar = gostar) de suco de manga."
 },
 "verbo-83": {
  "promptNative": "Quando eu era menina, eu _____ (vivir = morar) em uma casa perto da praia."
 },
 "verbo-84": {
  "promptNative": "No fim de semana passado, meus amigos _____ (viajar = viajar) para as montanhas."
 },
 "verbo-85": {
  "promptNative": "Agora, as crianças _____ (estar = estar) brincando no parque."
 },
 "verbo-86": {
  "promptNative": "Amanhã eu _____ (ir = ir) ao mercado comprar abacate fresco."
 },
 "verbo-87": {
  "promptNative": "Meu avô _____ (tener = ter) setenta anos e ainda trabalha."
 },
 "verbo-88": {
  "promptNative": "No ano passado, você _____ (estudiar = estudar) francês na universidade."
 },
 "verbo-89": {
  "promptNative": "Normalmente, meu chefe _____ (llegar = chegar) ao escritório muito cedo."
 },
 "verbo-90": {
  "promptNative": "Quando crianças, meus primos e eu _____ (jugar = jogar) futebol todo sábado."
 },
 "verbo-91": {
  "promptNative": "Agora, a reunião _____ (estar = estar) muito chata."
 },
 "verbo-92": {
  "promptNative": "Ontem à noite nós _____ (dormir = dormir) muito pouco por causa do barulho da rua."
 },
 "verbo-93": {
  "promptNative": "Meus colegas de trabalho _____ (encantar = adorar) o novo celular que comprei."
 },
 "verbo-94": {
  "promptNative": "Ontem nós _____ (dormir = dormir) muito mal no hotel."
 },
 "verbo-95": {
  "promptNative": "Quando eu era menina, eu _____ (jugar = brincar) no parque todos os dias."
 },
 "verbo-96": {
  "promptNative": "É importante que você _____ (llegar = chegar) cedo à reunião."
 },
 "verbo-97": {
  "promptNative": "_____ (cerrar = fechar) a janela, por favor, está muito frio."
 },
 "verbo-98": {
  "promptNative": "Meu irmão já _____ (terminar = terminar) a lição quando eu liguei para ele."
 },
 "verbo-99": {
  "promptNative": "Nós _____ (viajar = viajar) para a Colômbia no verão passado."
 },
 "verbo-100": {
  "promptNative": "Duvido que ela _____ (saber = saber) a verdade sobre o projeto."
 },
 "verbo-101": {
  "promptNative": "Neste verão eu _____ (visitar = visitar) três países diferentes."
 },
 "verbo-102": {
  "promptNative": "Quando eu _____ (llegar = chegar) ao escritório, meus colegas já estavam trabalhando."
 },
 "verbo-103": {
  "promptNative": "Espero que não _____ (llover = chover) durante o jogo amanhã."
 },
 "verbo-104": {
  "promptNative": "Quando eu tinha quinze anos, meus pais me _____ (permitir = permitir) sair nos fins de semana."
 },
 "verbo-105": {
  "promptNative": "_____ (comer = comer) os legumes antes da sobremesa, crianças."
 },
 "verbo-106": {
  "promptNative": "É provável que o voo se _____ (retrasarse = atrasar-se) por causa da tempestade."
 },
 "verbo-107": {
  "promptNative": "No ano passado nós nos _____ (mudarse = mudar-se) para um apartamento menor."
 },
 "verbo-108": {
  "promptNative": "Antes de nos mudarmos, já _____ (visitar = visitar) o bairro várias vezes."
 },
 "verbo-109": {
  "promptNative": "Não acho que ele _____ (tener = ter) tempo para nos ajudar hoje."
 },
 "verbo-110": {
  "promptNative": "Enquanto eu _____ (cocinar = cozinhar), meu parceiro punha a mesa."
 },
 "verbo-111": {
  "promptNative": "Você _____ (poder = poder) me ajudar com esta papelada, por favor?"
 },
 "verbo-112": {
  "promptNative": "Assim que você _____ (recibir = receber) a mensagem, me escreva."
 },
 "verbo-113": {
  "promptNative": "Eu nunca _____ (probar = provar) um prato tão delicioso quanto este ceviche."
 },
 "verbo-114": {
  "promptNative": "Quando chegamos ao cinema, o filme já _____ (empezar = começar)."
 },
 "verbo-115": {
  "promptNative": "Duvido que eles _____ (llegar = chegar) a tempo com este trânsito."
 },
 "verbo-116": {
  "promptNative": "_____ (cerrar = trancar) a porta antes de sair, por favor (você formal)."
 },
 "verbo-117": {
  "promptNative": "Este ano eu _____ (viajar = viajar) três vezes para a Colômbia a trabalho."
 },
 "verbo-118": {
  "promptNative": "Se eu tivesse mais dinheiro, eu _____ (comprar = comprar) aquele carro novo."
 },
 "verbo-119": {
  "promptNative": "Meus avós sempre _____ (vivir = morar) no campo quando eram jovens."
 },
 "verbo-120": {
  "promptNative": "É importante que você _____ (cuidar = cuidar de) sua saúde mental no trabalho."
 },
 "verbo-121": {
  "promptNative": "Ontem à noite nós _____ (cenar = jantar) naquele restaurante peruano super bacana."
 },
 "verbo-122": {
  "promptNative": "Não acho que ela _____ (estar = estar) brava com você, mais provavelmente preocupada."
 },
 "verbo-123": {
  "promptNative": "Quando terminei a faculdade, eu já _____ (aprender = aprender) três idiomas."
 },
 "verbo-124": {
  "promptNative": "_____ (sentarse = sentar-se) aqui comigo um pouco, precisamos conversar (você informal)."
 },
 "verbo-125": {
  "promptNative": "Quando eu era menina, minha mãe me _____ (llevar = levar) ao parque todo domingo."
 },
 "verbo-126": {
  "promptNative": "Tomara que o chefe nos _____ (dar = dar) folga na sexta este mês."
 },
 "verbo-127": {
  "promptNative": "No ano passado, enquanto eu _____ (trabajar = trabalhar) no escritório, houve um apagão enorme."
 },
 "verbo-128": {
  "promptNative": "Recomendo que você _____ (probar = experimentar) o suco de maracujá antes de ir."
 },
 "verbo-129": {
  "promptNative": "Até agora, a empresa não _____ (resolver = resolver) o problema com os envios."
 },
 "verbo-130": {
  "promptNative": "Não se _____ (preocuparse = preocupar-se), tudo vai dar certo com o projeto (vocês)."
 },
 "verbo-131": {
  "promptNative": "Quando morávamos no litoral, sempre _____ (nadar = nadar) no mar ao amanhecer."
 },
 "verbo-132": {
  "promptNative": "Surpreende-me que tanta gente _____ (usar = usar) o celular o dia todo."
 },
 "verbo-133": {
  "promptNative": "Antes de me mudar para Lima, eu nunca _____ (probar = provar) comida peruana."
 },
 "verbo-134": {
  "promptNative": "Se você me _____ (decir = dizer) antes, eu teria mudado meus planos de viagem."
 },
 "verbo-135": {
  "promptNative": "Eu queria ter _____ (poder = poder) participar da conferência, mas surgiu um imprevisto."
 },
 "verbo-136": {
  "promptNative": "Se eu soubesse a verdade, nunca _____ (firmar = assinar) aquele contrato."
 },
 "verbo-137": {
  "promptNative": "O gerente exigiu que todos os relatórios _____ (entregar = entregar) antes de sexta."
 },
 "verbo-138": {
  "promptNative": "Por mais que ele _____ (intentar = tentar), não conseguiria convencer o júri."
 },
 "verbo-139": {
  "promptNative": "Eu teria gostado que vocês _____ (estar = estar) presentes na cerimônia."
 },
 "verbo-140": {
  "promptNative": "Quem _____ (ser = ser) responsável terá que responder à diretoria."
 },
 "verbo-141": {
  "promptNative": "O sindicato aceitou o acordo desde que a empresa _____ (reducir = reduzir) a jornada em vez de demitir pessoas."
 },
 "verbo-142": {
  "promptNative": "Como se nada _____ (pasar = acontecer), ela continuou trabalhando em frente à tela."
 },
 "verbo-143": {
  "promptNative": "A menos que o governo _____ (invertir = investir) mais em infraestrutura, a rede elétrica continuará entrando em colapso."
 },
 "verbo-144": {
  "promptNative": "A testemunha falou como se _____ (presenciar = presenciar) o acidente com os próprios olhos, embora na verdade não estivesse lá."
 },
 "verbo-145": {
  "promptNative": "Mesmo que lhe _____ (ofrecer = oferecer) o dobro do salário, ela nunca teria abandonado sua vocação de ensinar."
 },
 "verbo-146": {
  "promptNative": "Não havia ninguém que _____ (saber = saber) resolver o enigma proposto pela antiga profecia."
 },
 "verbo-147": {
  "promptNative": "Se você tivesse me _____ (decir = dizer) antes, eu teria mudado de ideia."
 },
 "verbo-148": {
  "promptNative": "Nunca acreditei que o projeto _____ (llegar = chegar) a ter tanto sucesso."
 },
 "verbo-149": {
  "promptNative": "Se eu soubesse, não _____ (invertir = investir) naquela empresa."
 },
 "verbo-150": {
  "promptNative": "Por mais que ela _____ (intentar = tentar), não conseguia convencer o júri."
 },
 "verbo-151": {
  "promptNative": "A testemunha falou como se _____ (presenciar = presenciar) o acidente pessoalmente."
 },
 "verbo-152": {
  "promptNative": "Quem _____ (ser = ser) responsável terá que responder por isso."
 },
 "verbo-153": {
  "promptNative": "Desde que o prazo se _____ (cumplirse = ser cumprido), aceitaremos qualquer formato."
 },
 "verbo-154": {
  "promptNative": "Se ela se _____ (esforzarse = esforçar-se) um pouco, teria passado na prova sem problemas."
 },
 "verbo-155": {
  "promptNative": "Ele foi o único colega que se _____ (atreverse = atrever-se) a questionar a decisão do gerente."
 },
 "verbo-156": {
  "promptNative": "Eu queria ter _____ (prever = prever) as consequências antes de assinar o contrato."
 },
 "verbo-157": {
  "promptNative": "Você _____ (tener = ter) muita fome agora mesmo."
 },
 "verbo-158": {
  "promptNative": "Ele _____ (tener = ter) muita fome agora mesmo."
 },
 "verbo-159": {
  "promptNative": "Nós _____ (tener = ter) muita fome agora mesmo."
 },
 "verbo-160": {
  "promptNative": "Eles _____ (tener = ter) muita fome agora mesmo."
 },
 "verbo-161": {
  "promptNative": "Eu _____ (querer = querer) sair esta noite."
 },
 "verbo-162": {
  "promptNative": "Você _____ (querer = querer) sair esta noite."
 },
 "verbo-163": {
  "promptNative": "Ele _____ (querer = querer) sair esta noite."
 },
 "verbo-164": {
  "promptNative": "Eles _____ (querer = querer) sair esta noite."
 },
 "verbo-165": {
  "promptNative": "Eu _____ (dormir = dormir) oito horas ontem à noite."
 },
 "verbo-166": {
  "promptNative": "Você _____ (dormir = dormir) oito horas ontem à noite."
 },
 "verbo-167": {
  "promptNative": "Nós _____ (dormir = dormir) oito horas ontem à noite."
 },
 "verbo-168": {
  "promptNative": "Eles _____ (dormir = dormir) oito horas ontem à noite."
 },
 "verbo-169": {
  "promptNative": "Eu _____ (poder = poder) te ajudar amanhã?"
 },
 "verbo-170": {
  "promptNative": "Ele _____ (poder = poder) me ajudar amanhã?"
 },
 "verbo-171": {
  "promptNative": "Nós _____ (poder = poder) te ajudar amanhã?"
 },
 "verbo-172": {
  "promptNative": "Eles _____ (poder = poder) me ajudar amanhã?"
 },
 "verbo-173": {
  "promptNative": "Ontem você _____ (ir = ir) à academia."
 },
 "verbo-174": {
  "promptNative": "Ontem ele _____ (ir = ir) à academia."
 },
 "verbo-175": {
  "promptNative": "Ontem nós _____ (ir = ir) à academia."
 },
 "verbo-176": {
  "promptNative": "Ontem eles _____ (ir = ir) à academia."
 },
 "verbo-177": {
  "promptNative": "Eu _____ (estar = estar) trabalhando quando eu liguei."
 },
 "verbo-178": {
  "promptNative": "Você _____ (estar = estar) trabalhando quando eu liguei."
 },
 "verbo-179": {
  "promptNative": "Ele _____ (estar = estar) trabalhando quando eu liguei."
 },
 "verbo-180": {
  "promptNative": "Nós _____ (estar = estar) trabalhando quando eu liguei."
 },
 "verbo-181": {
  "promptNative": "Amanhã eu _____ (llegar = chegar) atrasado, com certeza."
 },
 "verbo-182": {
  "promptNative": "Amanhã você _____ (llegar = chegar) atrasado, com certeza."
 },
 "verbo-183": {
  "promptNative": "Amanhã ele _____ (llegar = chegar) atrasado, com certeza."
 },
 "verbo-184": {
  "promptNative": "Amanhã eles _____ (llegar = chegar) atrasados, com certeza."
 },
 "verbo-185": {
  "promptNative": "Ele espera que você _____ (venir = vir) à festa."
 },
 "verbo-186": {
  "promptNative": "Nós esperamos que você _____ (venir = vir) à festa."
 },
 "verbo-187": {
  "promptNative": "Eles esperam que você _____ (venir = vir) à festa."
 },
 "verbo-188": {
  "promptNative": "Você já _____ (terminar = terminar) o projeto."
 },
 "verbo-189": {
  "promptNative": "Ele já _____ (terminar = terminar) o projeto."
 },
 "verbo-190": {
  "promptNative": "Nós já _____ (terminar = terminar) o projeto."
 },
 "verbo-191": {
  "promptNative": "Eles já _____ (terminar = terminar) o projeto."
 },
 "verbo-192": {
  "promptNative": "Eu _____ (decir = dizer) que ela chegaria às oito."
 },
 "verbo-193": {
  "promptNative": "Você _____ (decir = dizer) que ela chegaria às oito."
 },
 "verbo-194": {
  "promptNative": "Nós _____ (decir = dizer) que ela chegaria às oito."
 },
 "verbo-195": {
  "promptNative": "Eles _____ (decir = dizer) que ela chegaria às oito."
 },
 "verbo-196": {
  "promptNative": "Eu _____ (ver = ver) aquele filme três vezes."
 },
 "verbo-197": {
  "promptNative": "Você _____ (ver = ver) aquele filme três vezes."
 },
 "verbo-198": {
  "promptNative": "Ele _____ (ver = ver) aquele filme três vezes."
 },
 "verbo-199": {
  "promptNative": "Eles _____ (ver = ver) aquele filme três vezes."
 },
 "verbo-200": {
  "promptNative": "O que eu _____ (hacer = fazer) se ganhasse na loteria?"
 },
 "verbo-201": {
  "promptNative": "O que ele _____ (hacer = fazer) se ganhasse na loteria?"
 },
 "verbo-202": {
  "promptNative": "O que nós _____ (hacer = fazer) se ganhássemos na loteria?"
 },
 "verbo-203": {
  "promptNative": "O que eles _____ (hacer = fazer) se ganhassem na loteria?"
 },
 "verbo-204": {
  "promptNative": "É importante que eu _____ (llegar = chegar) cedo."
 },
 "verbo-205": {
  "promptNative": "É importante que você _____ (llegar = chegar) cedo."
 },
 "verbo-206": {
  "promptNative": "É importante que ele _____ (llegar = chegar) cedo."
 },
 "verbo-207": {
  "promptNative": "É importante que nós _____ (llegar = chegar) cedo."
 },
 "verbo-208": {
  "promptNative": "Você se _____ (levantarse = levantar-se) às seis todos os dias."
 },
 "verbo-209": {
  "promptNative": "Ele se _____ (levantarse = levantar-se) às seis todos os dias."
 },
 "verbo-210": {
  "promptNative": "Nós nos _____ (levantarse = levantar-se) às seis todos os dias."
 },
 "verbo-211": {
  "promptNative": "Eles se _____ (levantarse = levantar-se) às seis todos os dias."
 },
 "verbo-212": {
  "promptNative": "Eu _____ (ser = ser) médico."
 },
 "verbo-213": {
  "promptNative": "Você _____ (ser = ser) médico."
 },
 "verbo-214": {
  "promptNative": "Nós _____ (ser = ser) médicos."
 },
 "verbo-215": {
  "promptNative": "Eles _____ (ser = ser) médicos."
 },
 "verbo-216": {
  "promptNative": "Eu _____ (estar = estar) no cinema agora."
 },
 "verbo-217": {
  "promptNative": "Você _____ (estar = estar) no cinema agora."
 },
 "verbo-218": {
  "promptNative": "Ele _____ (estar = estar) no cinema agora."
 },
 "verbo-219": {
  "promptNative": "Eles _____ (estar = estar) no cinema agora."
 },
 "verbo-220": {
  "promptNative": "Eu _____ (vivir = morar) em Bogotá desde 2020."
 },
 "verbo-221": {
  "promptNative": "Você _____ (vivir = morar) em Bogotá desde 2020."
 },
 "verbo-222": {
  "promptNative": "Ele _____ (vivir = morar) em Bogotá desde 2020."
 },
 "verbo-223": {
  "promptNative": "Nós _____ (vivir = morar) em Bogotá desde 2020."
 },
 "verbo-224": {
  "promptNative": "Você duvida que ele _____ (saber = saber) disso."
 },
 "verbo-225": {
  "promptNative": "Nós duvidamos que ele _____ (saber = saber) disso."
 },
 "verbo-226": {
  "promptNative": "Eles duvidam que ele _____ (saber = saber) disso."
 },
 "verbo-227": {
  "promptNative": "Não acho que eles _____ (llegar = chegar) ainda."
 },
 "verbo-228": {
  "promptNative": "Você não acha que eles _____ (llegar = chegar) ainda."
 },
 "verbo-229": {
  "promptNative": "Ele não acha que eles _____ (llegar = chegar) ainda."
 },
 "verbo-230": {
  "promptNative": "Nós não achamos que eles _____ (llegar = chegar) ainda."
 },
 "verbo-231": {
  "promptNative": "Você _____ (hacer = fazer) minha lição de casa toda noite."
 },
 "verbo-232": {
  "promptNative": "Ele _____ (hacer = fazer) minha lição de casa toda noite."
 },
 "verbo-233": {
  "promptNative": "Nós _____ (hacer = fazer) minha lição de casa toda noite."
 },
 "verbo-234": {
  "promptNative": "Eles _____ (hacer = fazer) minha lição de casa toda noite."
 },
 "verbo-235": {
  "promptNative": "Você _____ (poner = pôr) a mesa antes do jantar."
 },
 "verbo-236": {
  "promptNative": "Ele _____ (poner = pôr) a mesa antes do jantar."
 },
 "verbo-237": {
  "promptNative": "Nós _____ (poner = pôr) a mesa antes do jantar."
 },
 "verbo-238": {
  "promptNative": "Eles _____ (poner = pôr) a mesa antes do jantar."
 },
 "verbo-239": {
  "promptNative": "Você _____ (salir = sair) do trabalho às seis."
 },
 "verbo-240": {
  "promptNative": "Ele _____ (salir = sair) do trabalho às seis."
 },
 "verbo-241": {
  "promptNative": "Nós _____ (salir = sair) do trabalho às seis."
 },
 "verbo-242": {
  "promptNative": "Eles _____ (salir = sair) do trabalho às seis."
 },
 "verbo-243": {
  "promptNative": "Você não _____ (saber = saber) a resposta."
 },
 "verbo-244": {
  "promptNative": "Ele não _____ (saber = saber) a resposta."
 },
 "verbo-245": {
  "promptNative": "Nós não _____ (saber = saber) a resposta."
 },
 "verbo-246": {
  "promptNative": "Eles não _____ (saber = saber) a resposta."
 },
 "verbo-247": {
  "promptNative": "Ontem eu _____ (hacer = fazer) um bolo."
 },
 "verbo-248": {
  "promptNative": "Ontem você _____ (hacer = fazer) um bolo."
 },
 "verbo-249": {
  "promptNative": "Ontem nós _____ (hacer = fazer) um bolo."
 },
 "verbo-250": {
  "promptNative": "Ontem eles _____ (hacer = fazer) um bolo."
 },
 "verbo-251": {
  "promptNative": "Ontem à noite eu _____ (tener = ter) um problema."
 },
 "verbo-252": {
  "promptNative": "Ontem à noite você _____ (tener = ter) um problema."
 },
 "verbo-253": {
  "promptNative": "Ontem à noite ele _____ (tener = ter) um problema."
 },
 "verbo-254": {
  "promptNative": "Ontem à noite eles _____ (tener = ter) um problema."
 },
 "verbo-255": {
  "promptNative": "Eu _____ (decir = contar) a verdade para você."
 },
 "verbo-256": {
  "promptNative": "Você me _____ (decir = contar) a verdade."
 },
 "verbo-257": {
  "promptNative": "Ele me _____ (decir = contar) a verdade."
 },
 "verbo-258": {
  "promptNative": "Nós _____ (decir = contar) a verdade para você."
 },
 "verbo-259": {
  "promptNative": "Eu _____ (traer = trazer) a sobremesa?"
 },
 "verbo-260": {
  "promptNative": "Ele _____ (traer = trazer) a sobremesa?"
 },
 "verbo-261": {
  "promptNative": "Nós _____ (traer = trazer) a sobremesa?"
 },
 "verbo-262": {
  "promptNative": "Eles _____ (traer = trazer) a sobremesa?"
 },
 "verbo-263": {
  "promptNative": "Quando você era criança, eu _____ (jugar = brincar) no parque."
 },
 "verbo-264": {
  "promptNative": "Quando ele era criança, eu _____ (jugar = brincar) no parque."
 },
 "verbo-265": {
  "promptNative": "Quando nós éramos crianças, eu _____ (jugar = brincar) no parque."
 },
 "verbo-266": {
  "promptNative": "Quando eles eram crianças, eu _____ (jugar = brincar) no parque."
 },
 "verbo-267": {
  "promptNative": "Você se _____ (despertarse = acordar) às sete."
 },
 "verbo-268": {
  "promptNative": "Ele se _____ (despertarse = acordar) às sete."
 },
 "verbo-269": {
  "promptNative": "Nós nos _____ (despertarse = acordar) às sete."
 },
 "verbo-270": {
  "promptNative": "Eles se _____ (despertarse = acordar) às sete."
 },
 "verbo-271": {
  "promptNative": "Ele quer que você _____ (estudiar = estudar) mais."
 },
 "verbo-272": {
  "promptNative": "Nós queremos que você _____ (estudiar = estudar) mais."
 },
 "verbo-273": {
  "promptNative": "Eles querem que você _____ (estudiar = estudar) mais."
 },
 "verbo-274": {
  "promptNative": "Não acho que ele _____ (tener = ter) razão."
 },
 "verbo-275": {
  "promptNative": "Você não acha que ele _____ (tener = ter) razão."
 },
 "verbo-276": {
  "promptNative": "Nós não achamos que ele _____ (tener = ter) razão."
 },
 "verbo-277": {
  "promptNative": "Eles não acham que ele _____ (tener = ter) razão."
 },
 "verbo-278": {
  "promptNative": "_____ (seguir = seguir) reto até o semáforo."
 },
 "verbo-279": {
  "promptNative": "_____ (seguir = seguir) reto até o semáforo."
 },
 "verbo-280": {
  "promptNative": "_____ (seguir = seguir) reto até o semáforo."
 },
 "verbo-281": {
  "promptNative": "_____ (seguir = seguir) reto até o semáforo."
 },
 "verbo-282": {
  "promptNative": "Você, no meu lugar, não _____ (decir = dizer) nada."
 },
 "verbo-283": {
  "promptNative": "Ele, no seu lugar, não _____ (decir = dizer) nada."
 },
 "verbo-284": {
  "promptNative": "Nós, no seu lugar, não _____ (decir = dizer) nada."
 },
 "verbo-285": {
  "promptNative": "Eles, no seu lugar, não _____ (decir = dizer) nada."
 },
 "verbo-286": {
  "promptNative": "Quando cheguei, eu já _____ (irse = ir embora)."
 },
 "verbo-287": {
  "promptNative": "Quando cheguei, você já _____ (irse = ir embora)."
 },
 "verbo-288": {
  "promptNative": "Quando ele chegou, eles já _____ (irse = ir embora)."
 },
 "verbo-289": {
  "promptNative": "Quando cheguei, nós já _____ (irse = ir embora)."
 },
 "verbo-290": {
  "promptNative": "Eu te _____ (pedir = pedir) um favor ontem."
 },
 "verbo-291": {
  "promptNative": "Você me _____ (pedir = pedir) um favor ontem."
 },
 "verbo-292": {
  "promptNative": "Nós te _____ (pedir = pedir) um favor ontem."
 },
 "verbo-293": {
  "promptNative": "Eles me _____ (pedir = pedir) um favor ontem."
 },
 "verbo-294": {
  "promptNative": "Eu _____ (seguir = continuar) trabalhando apesar de tudo."
 },
 "verbo-295": {
  "promptNative": "Você _____ (seguir = continuar) trabalhando apesar de tudo."
 },
 "verbo-296": {
  "promptNative": "Ele _____ (seguir = continuar) trabalhando apesar de tudo."
 },
 "verbo-297": {
  "promptNative": "Nós _____ (seguir = continuar) trabalhando apesar de tudo."
 },
 "verbo-298": {
  "promptNative": "Você _____ (trabajar = trabalhar) em um escritório grande."
 },
 "verbo-299": {
  "promptNative": "Ele _____ (trabajar = trabalhar) em um escritório grande."
 },
 "verbo-300": {
  "promptNative": "Nós _____ (trabajar = trabalhar) em um escritório grande."
 },
 "verbo-301": {
  "promptNative": "Eles _____ (trabajar = trabalhar) em um escritório grande."
 },
 "verbo-302": {
  "promptNative": "Eu _____ (comer = comer) arroz com frango aos domingos."
 },
 "verbo-303": {
  "promptNative": "Você _____ (comer = comer) arroz com frango aos domingos."
 },
 "verbo-304": {
  "promptNative": "Ele _____ (comer = comer) arroz com frango aos domingos."
 },
 "verbo-305": {
  "promptNative": "Eles _____ (comer = comer) arroz com frango aos domingos."
 },
 "verbo-306": {
  "promptNative": "Eu _____ (vivir = morar) perto da praia."
 },
 "verbo-307": {
  "promptNative": "Você _____ (vivir = morar) perto da praia."
 },
 "verbo-308": {
  "promptNative": "Nós _____ (vivir = morar) perto da praia."
 },
 "verbo-309": {
  "promptNative": "Eles _____ (vivir = morar) perto da praia."
 },
 "verbo-310": {
  "promptNative": "Ontem eu _____ (viajar = viajar) para Bogotá."
 },
 "verbo-311": {
  "promptNative": "Ontem você _____ (viajar = viajar) para Bogotá."
 },
 "verbo-312": {
  "promptNative": "Ontem ele _____ (viajar = viajar) para Bogotá."
 },
 "verbo-313": {
  "promptNative": "Ontem eles _____ (viajar = viajar) para Bogotá."
 },
 "verbo-314": {
  "promptNative": "Eu _____ (ser = ser) muito gentil com todos."
 },
 "verbo-315": {
  "promptNative": "Ele _____ (ser = ser) muito gentil com todos."
 },
 "verbo-316": {
  "promptNative": "Nós _____ (ser = ser) muito gentis com todos."
 },
 "verbo-317": {
  "promptNative": "Eles _____ (ser = ser) muito gentis com todos."
 },
 "verbo-318": {
  "promptNative": "Todos os dias você _____ (desayunar = tomar café da manhã) antes de sair para o trabalho."
 },
 "verbo-319": {
  "promptNative": "Todos os dias ele _____ (desayunar = tomar café da manhã) antes de sair para o trabalho."
 },
 "verbo-320": {
  "promptNative": "Todos os dias nós _____ (desayunar = tomar café da manhã) antes de sair para o trabalho."
 },
 "verbo-321": {
  "promptNative": "Todos os dias eles _____ (desayunar = tomar café da manhã) antes de sair para o trabalho."
 },
 "verbo-322": {
  "promptNative": "Ontem eu _____ (comer = comer) em um restaurante novo no centro."
 },
 "verbo-323": {
  "promptNative": "Ontem você _____ (comer = comer) em um restaurante novo no centro."
 },
 "verbo-324": {
  "promptNative": "Ontem ele _____ (comer = comer) em um restaurante novo no centro."
 },
 "verbo-325": {
  "promptNative": "Ontem eles _____ (comer = comer) em um restaurante novo no centro."
 },
 "verbo-326": {
  "promptNative": "Quando você era menina, eu _____ (vivir = morar) em uma casa perto da praia."
 },
 "verbo-327": {
  "promptNative": "Quando ele era menino, eu _____ (vivir = morar) em uma casa perto da praia."
 },
 "verbo-328": {
  "promptNative": "Quando nós éramos crianças, eu _____ (vivir = morar) em uma casa perto da praia."
 },
 "verbo-329": {
  "promptNative": "Quando eles eram crianças, eu _____ (vivir = morar) em uma casa perto da praia."
 },
 "verbo-330": {
  "promptNative": "Amanhã você _____ (ir = ir) ao mercado comprar abacate fresco."
 },
 "verbo-331": {
  "promptNative": "Amanhã ele _____ (ir = ir) ao mercado comprar abacate fresco."
 },
 "verbo-332": {
  "promptNative": "Amanhã nós _____ (ir = ir) ao mercado comprar abacate fresco."
 },
 "verbo-333": {
  "promptNative": "Amanhã eles _____ (ir = ir) ao mercado comprar abacate fresco."
 },
 "verbo-334": {
  "promptNative": "Quando crianças, meus primos e você _____ (jugar = jogar) futebol todo sábado."
 },
 "verbo-335": {
  "promptNative": "Quando crianças, meus primos e ele _____ (jugar = jogar) futebol todo sábado."
 },
 "verbo-336": {
  "promptNative": "Quando crianças, meus primos e nós _____ (jugar = jogar) futebol todo sábado."
 },
 "verbo-337": {
  "promptNative": "Quando crianças, meus primos e eles _____ (jugar = jogar) futebol todo sábado."
 },
 "verbo-338": {
  "promptNative": "Ontem à noite eu _____ (dormir = dormir) muito pouco por causa do barulho da rua."
 },
 "verbo-339": {
  "promptNative": "Ontem à noite você _____ (dormir = dormir) muito pouco por causa do barulho da rua."
 },
 "verbo-340": {
  "promptNative": "Ontem à noite ele _____ (dormir = dormir) muito pouco por causa do barulho da rua."
 },
 "verbo-341": {
  "promptNative": "Ontem à noite eles _____ (dormir = dormir) muito pouco por causa do barulho da rua."
 },
 "verbo-342": {
  "promptNative": "Ontem eu _____ (dormir = dormir) muito mal no hotel."
 },
 "verbo-343": {
  "promptNative": "Ontem você _____ (dormir = dormir) muito mal no hotel."
 },
 "verbo-344": {
  "promptNative": "Ontem ele _____ (dormir = dormir) muito mal no hotel."
 },
 "verbo-345": {
  "promptNative": "Ontem eles _____ (dormir = dormir) muito mal no hotel."
 },
 "verbo-346": {
  "promptNative": "Quando você era menina, eu _____ (jugar = brincar) no parque todos os dias."
 },
 "verbo-347": {
  "promptNative": "Quando ele era menino, eu _____ (jugar = brincar) no parque todos os dias."
 },
 "verbo-348": {
  "promptNative": "Quando nós éramos crianças, eu _____ (jugar = brincar) no parque todos os dias."
 },
 "verbo-349": {
  "promptNative": "Quando eles eram crianças, eu _____ (jugar = brincar) no parque todos os dias."
 },
 "verbo-350": {
  "promptNative": "É importante que eu _____ (llegar = chegar) cedo à reunião."
 },
 "verbo-351": {
  "promptNative": "É importante que ele _____ (llegar = chegar) cedo à reunião."
 },
 "verbo-352": {
  "promptNative": "É importante que nós _____ (llegar = chegar) cedo à reunião."
 },
 "verbo-353": {
  "promptNative": "É importante que eles _____ (llegar = chegar) cedo à reunião."
 },
 "verbo-354": {
  "promptNative": "Eu _____ (viajar = viajar) para a Colômbia no verão passado."
 },
 "verbo-355": {
  "promptNative": "Você _____ (viajar = viajar) para a Colômbia no verão passado."
 },
 "verbo-356": {
  "promptNative": "Ele _____ (viajar = viajar) para a Colômbia no verão passado."
 },
 "verbo-357": {
  "promptNative": "Eles _____ (viajar = viajar) para a Colômbia no verão passado."
 },
 "verbo-358": {
  "promptNative": "Você duvida que ela _____ (saber = saber) a verdade sobre o projeto."
 },
 "verbo-359": {
  "promptNative": "Nós duvidamos que ela _____ (saber = saber) a verdade sobre o projeto."
 },
 "verbo-360": {
  "promptNative": "Eles duvidam que ela _____ (saber = saber) a verdade sobre o projeto."
 },
 "verbo-361": {
  "promptNative": "Quando você _____ (llegar = chegar) ao escritório, meus colegas já estavam trabalhando."
 },
 "verbo-362": {
  "promptNative": "Quando ele _____ (llegar = chegar) ao escritório, meus colegas já estavam trabalhando."
 },
 "verbo-363": {
  "promptNative": "Quando nós _____ (llegar = chegar) ao escritório, meus colegas já estavam trabalhando."
 },
 "verbo-364": {
  "promptNative": "Quando eles _____ (llegar = chegar) ao escritório, meus colegas já estavam trabalhando."
 },
 "verbo-365": {
  "promptNative": "Não acho que ele _____ (tener = ter) tempo para nos ajudar hoje."
 },
 "verbo-366": {
  "promptNative": "Você não acha que ele _____ (tener = ter) tempo para nos ajudar hoje."
 },
 "verbo-367": {
  "promptNative": "Nós não achamos que ele _____ (tener = ter) tempo para nos ajudar hoje."
 },
 "verbo-368": {
  "promptNative": "Eles não acham que ele _____ (tener = ter) tempo para nos ajudar hoje."
 },
 "verbo-369": {
  "promptNative": "Enquanto você _____ (cocinar = cozinhar), meu parceiro punha a mesa."
 },
 "verbo-370": {
  "promptNative": "Enquanto ele _____ (cocinar = cozinhar), meu parceiro punha a mesa."
 },
 "verbo-371": {
  "promptNative": "Enquanto nós _____ (cocinar = cozinhar), meu parceiro punha a mesa."
 },
 "verbo-372": {
  "promptNative": "Enquanto eles _____ (cocinar = cozinhar), meu parceiro punha a mesa."
 },
 "verbo-373": {
  "promptNative": "Eu _____ (poder = poder) ajudar com esta papelada, por favor?"
 },
 "verbo-374": {
  "promptNative": "Você _____ (poder = poder) me ajudar com esta papelada, por favor?"
 },
 "verbo-375": {
  "promptNative": "Nós _____ (poder = poder) ajudar com esta papelada, por favor?"
 },
 "verbo-376": {
  "promptNative": "Eles _____ (poder = poder) me ajudar com esta papelada, por favor?"
 },
 "verbo-377": {
  "promptNative": "Assim que eu _____ (recibir = receber) a mensagem, me escreva."
 },
 "verbo-378": {
  "promptNative": "Assim que ele _____ (recibir = receber) a mensagem, me escreva."
 },
 "verbo-379": {
  "promptNative": "Assim que nós _____ (recibir = receber) a mensagem, me escreva."
 },
 "verbo-380": {
  "promptNative": "Assim que eles _____ (recibir = receber) a mensagem, me escreva."
 },
 "verbo-381": {
  "promptNative": "Você nunca _____ (probar = provar) um prato tão delicioso quanto este ceviche."
 },
 "verbo-382": {
  "promptNative": "Ele nunca _____ (probar = provar) um prato tão delicioso quanto este ceviche."
 },
 "verbo-383": {
  "promptNative": "Nós nunca _____ (probar = provar) um prato tão delicioso quanto este ceviche."
 },
 "verbo-384": {
  "promptNative": "Eles nunca _____ (probar = provar) um prato tão delicioso quanto este ceviche."
 },
 "verbo-385": {
  "promptNative": "Você duvida que eles _____ (llegar = chegar) a tempo com este trânsito."
 },
 "verbo-386": {
  "promptNative": "Ele duvida que eles _____ (llegar = chegar) a tempo com este trânsito."
 },
 "verbo-387": {
  "promptNative": "Nós duvidamos que eles _____ (llegar = chegar) a tempo com este trânsito."
 },
 "verbo-388": {
  "promptNative": "Este ano você _____ (viajar = viajar) três vezes para a Colômbia a trabalho."
 },
 "verbo-389": {
  "promptNative": "Este ano ele _____ (viajar = viajar) três vezes para a Colômbia a trabalho."
 },
 "verbo-390": {
  "promptNative": "Este ano nós _____ (viajar = viajar) três vezes para a Colômbia a trabalho."
 },
 "verbo-391": {
  "promptNative": "Este ano eles _____ (viajar = viajar) três vezes para a Colômbia a trabalho."
 },
 "verbo-392": {
  "promptNative": "É importante que eu _____ (cuidar = cuidar de) sua saúde mental no trabalho."
 },
 "verbo-393": {
  "promptNative": "É importante que ele _____ (cuidar = cuidar de) sua saúde mental no trabalho."
 },
 "verbo-394": {
  "promptNative": "É importante que nós _____ (cuidar = cuidar de) sua saúde mental no trabalho."
 },
 "verbo-395": {
  "promptNative": "É importante que eles _____ (cuidar = cuidar de) sua saúde mental no trabalho."
 },
 "verbo-396": {
  "promptNative": "Ontem à noite eu _____ (cenar = jantar) naquele restaurante peruano super bacana."
 },
 "verbo-397": {
  "promptNative": "Ontem à noite você _____ (cenar = jantar) naquele restaurante peruano super bacana."
 },
 "verbo-398": {
  "promptNative": "Ontem à noite ele _____ (cenar = jantar) naquele restaurante peruano super bacana."
 },
 "verbo-399": {
  "promptNative": "Ontem à noite eles _____ (cenar = jantar) naquele restaurante peruano super bacana."
 },
 "verbo-400": {
  "promptNative": "Não acho que ela _____ (estar = estar) brava com você, mais provavelmente preocupada."
 },
 "verbo-401": {
  "promptNative": "Você não acha que ela _____ (estar = estar) brava com você, mais provavelmente preocupada."
 },
 "verbo-402": {
  "promptNative": "Nós não achamos que ela _____ (estar = estar) brava com você, mais provavelmente preocupada."
 },
 "verbo-403": {
  "promptNative": "Eles não acham que ela _____ (estar = estar) brava com você, mais provavelmente preocupada."
 },
 "trad-0": {
  "prompt": "Traduzir: 'Estou atrasado.'",
  "promptNative": "Traduza: 'Estou atrasado.'"
 },
 "trad-1": {
  "prompt": "Traduzir: 'Não importa.'",
  "promptNative": "Traduza: 'Não importa.'"
 },
 "trad-2": {
  "prompt": "Traduzir: 'Ela acabou de sair.'",
  "promptNative": "Traduza: 'Ela acabou de sair.'"
 },
 "trad-3": {
  "prompt": "Traduzir: 'Que saco.'",
  "promptNative": "Traduza: 'Que saco.'"
 },
 "trad-4": {
  "prompt": "Traduzir: 'Estou morrendo de vontade de te ver.'",
  "promptNative": "Traduza: 'Estou morrendo de vontade de te ver.'"
 },
 "trad-5": {
  "prompt": "Traduzir: 'Vamos direto ao ponto.'",
  "promptNative": "Traduza: 'Vamos direto ao ponto.'"
 },
 "trad-6": {
  "prompt": "Traduzir: 'Ele está de mau humor.'",
  "promptNative": "Traduza: 'Ele está de mau humor.'"
 },
 "trad-7": {
  "prompt": "Traduzir: 'Não podia me importar menos.'",
  "promptNative": "Traduza: 'Não podia me importar menos.'"
 },
 "trad-8": {
  "prompt": "Traduzir: 'Isso não é da sua conta.'",
  "promptNative": "Traduza: 'Isso não é da sua conta.'"
 },
 "trad-9": {
  "prompt": "Traduzir: 'Estou com muita coisa para fazer.'",
  "promptNative": "Traduza: 'Estou com muita coisa para fazer.'"
 },
 "trad-10": {
  "prompt": "Traduzir: 'Resumindo...'",
  "promptNative": "Traduza: 'Resumindo...'"
 },
 "trad-11": {
  "prompt": "Traduzir: 'Já estou cuidando disso.'",
  "promptNative": "Traduza: 'Já estou cuidando disso.'"
 },
 "trad-12": {
  "prompt": "Traduzir: 'Depende de você.'",
  "promptNative": "Traduza: 'Depende de você.'"
 },
 "trad-13": {
  "prompt": "Traduzir: 'Sem problemas.'",
  "promptNative": "Traduza: 'Sem problemas.'"
 },
 "trad-14": {
  "prompt": "Traduzir: 'Vou levar isso em conta.'",
  "promptNative": "Traduza: 'Vou levar isso em conta.'"
 },
 "trad-15": {
  "prompt": "Traduzir: 'Antes tarde do que nunca.'",
  "promptNative": "Traduza: 'Antes tarde do que nunca.'"
 },
 "trad-16": {
  "prompt": "Traduzir: 'É moleza.'",
  "promptNative": "Traduza: 'É moleza.'"
 },
 "trad-17": {
  "prompt": "Traduzir: 'Você está me sacaneando!'",
  "promptNative": "Traduza: 'Você está me sacaneando!'"
 },
 "trad-18": {
  "prompt": "Traduzir: 'Não é grande coisa.'",
  "promptNative": "Traduza: 'Não é grande coisa.'"
 },
 "trad-19": {
  "prompt": "Traduzir: 'Você pode me dar uma mão?'",
  "promptNative": "Traduza: 'Você pode me dar uma mão?'"
 },
 "trad-20": {
  "prompt": "Traduzir: 'Estou duro.'",
  "promptNative": "Traduza: 'Estou duro.'"
 },
 "trad-21": {
  "prompt": "Traduzir: 'Que legal! / Show! (coloquial)'",
  "promptNative": "Traduza: 'Que legal! / Show! (coloquial)'"
 },
 "trad-22": {
  "prompt": "Traduzir: 'Dormi como uma pedra.'",
  "promptNative": "Traduza: 'Dormi como uma pedra.'"
 },
 "trad-23": {
  "prompt": "Traduzir: 'Custa os olhos da cara.'",
  "promptNative": "Traduza: 'Custa os olhos da cara.'"
 },
 "trad-24": {
  "prompt": "Traduzir: 'Falando no diabo!'",
  "promptNative": "Traduza: 'Falando no diabo!'"
 },
 "trad-25": {
  "prompt": "Traduzir: 'Você acertou em cheio.'",
  "promptNative": "Traduza: 'Você acertou em cheio.'"
 },
 "trad-26": {
  "prompt": "Traduzir: 'Pare de enrolar.'",
  "promptNative": "Traduza: 'Pare de enrolar.'"
 },
 "trad-27": {
  "prompt": "Traduzir: 'Deus ajuda quem cedo madruga.'",
  "promptNative": "Traduza: 'Deus ajuda quem cedo madruga.'"
 },
 "trad-28": {
  "prompt": "Traduzir: 'de vez em nunca'",
  "promptNative": "Traduza: 'de vez em nunca'"
 },
 "trad-29": {
  "prompt": "Traduzir: 'Ele faz uma tempestade em copo d'água.'",
  "promptNative": "Traduza: 'Ele faz uma tempestade em copo d'água.'"
 },
 "trad-30": {
  "prompt": "Traduzir: 'Quem cochila perde.'",
  "promptNative": "Traduza: 'Quem cochila perde.'"
 },
 "trad-31": {
  "prompt": "Traduzir: 'Não adianta chorar sobre o leite derramado.'",
  "promptNative": "Traduza: 'Não adianta chorar sobre o leite derramado.'"
 },
 "trad-32": {
  "prompt": "Traduzir: 'Está chovendo canivetes.'",
  "promptNative": "Traduza: 'Está chovendo canivetes.'"
 },
 "trad-33": {
  "prompt": "Traduzir: 'Você está me sacaneando.'",
  "promptNative": "Traduza: 'Você está me sacaneando.'"
 },
 "trad-34": {
  "prompt": "Traduzir: 'Custa os olhos da cara.'",
  "promptNative": "Traduza: 'Custa os olhos da cara.'"
 },
 "trad-35": {
  "prompt": "Traduzir: 'Falando no diabo.'",
  "promptNative": "Traduza: 'Falando no diabo.'"
 },
 "trad-36": {
  "prompt": "Traduzir: 'Antes tarde do que nunca.'",
  "promptNative": "Traduza: 'Antes tarde do que nunca.'"
 },
 "trad-37": {
  "prompt": "Traduzir: 'É moleza.'",
  "promptNative": "Traduza: 'É moleza.'"
 },
 "trad-38": {
  "prompt": "Traduzir: 'Matar dois coelhos com uma cajadada.'",
  "promptNative": "Traduza: 'Matar dois coelhos com uma cajadada.'"
 },
 "trad-39": {
  "prompt": "Traduzir: 'Deus ajuda quem cedo madruga.'",
  "promptNative": "Traduza: 'Deus ajuda quem cedo madruga.'"
 },
 "trad-40": {
  "prompt": "Traduzir: 'O que os olhos não veem, o coração não sente.'",
  "promptNative": "Traduza: 'O que os olhos não veem, o coração não sente.'"
 },
 "trad-41": {
  "prompt": "Traduzir: 'No dia de São Nunca.'",
  "promptNative": "Traduza: 'No dia de São Nunca.'"
 },
 "trad-42": {
  "prompt": "Traduzir: 'Estou duro.'",
  "promptNative": "Traduza: 'Estou duro.'"
 },
 "trad-43": {
  "prompt": "Traduzir: 'Não é grande coisa.'",
  "promptNative": "Traduza: 'Não é grande coisa.'"
 },
 "trad-44": {
  "prompt": "Traduzir: 'Vá com calma.'",
  "promptNative": "Traduza: 'Vá com calma.'"
 },
 "trad-45": {
  "prompt": "Traduzir: 'Depende de você.'",
  "promptNative": "Traduza: 'Depende de você.'"
 },
 "trad-46": {
  "prompt": "Traduzir: 'Anda logo!'",
  "promptNative": "Traduza: 'Anda logo!'"
 },
 "trad-47": {
  "prompt": "Traduzir: 'Eu te falei.'",
  "promptNative": "Traduza: 'Eu te falei.'"
 },
 "trad-48": {
  "prompt": "Traduzir: 'Vale a pena.'",
  "promptNative": "Traduza: 'Vale a pena.'"
 },
 "trad-49": {
  "prompt": "Traduzir: 'Quanto tempo!'",
  "promptNative": "Traduza: 'Quanto tempo!'"
 },
 "trad-50": {
  "prompt": "Traduzir: 'Fique à vontade.'",
  "promptNative": "Traduza: 'Fique à vontade.'"
 },
 "trad-51": {
  "prompt": "Traduzir: 'Está na ponta da língua.'",
  "promptNative": "Traduza: 'Está na ponta da língua.'"
 },
 "trad-52": {
  "prompt": "Traduzir: 'Estou com pressa.'",
  "promptNative": "Traduza: 'Estou com pressa.'"
 },
 "trad-53": {
  "prompt": "Traduzir: 'De vez em quando.'",
  "promptNative": "Traduza: 'De vez em quando.'"
 },
 "trad-54": {
  "prompt": "Traduzir: 'De repente.'",
  "promptNative": "Traduza: 'De repente.'"
 },
 "trad-55": {
  "prompt": "Traduzir: 'A propósito...'",
  "promptNative": "Traduza: 'A propósito...'"
 },
 "trad-56": {
  "prompt": "Traduzir: 'Só por via das dúvidas.'",
  "promptNative": "Traduza: 'Só por via das dúvidas.'"
 },
 "trad-57": {
  "prompt": "Traduzir: 'O mais rápido possível.'",
  "promptNative": "Traduza: 'O mais rápido possível.'"
 },
 "trad-58": {
  "prompt": "Traduzir: 'Isso não me diz nada.'",
  "promptNative": "Traduza: 'Isso não me diz nada.'"
 },
 "trad-59": {
  "prompt": "Traduzir: 'Essa é a gota d'água.'",
  "promptNative": "Traduza: 'Essa é a gota d'água.'"
 },
 "trad-60": {
  "prompt": "Traduzir: 'Fazer vista grossa.'",
  "promptNative": "Traduza: 'Fazer vista grossa.'"
 },
 "trad-61": {
  "prompt": "Traduzir: 'Estou de saco cheio.'",
  "promptNative": "Traduza: 'Estou de saco cheio.'"
 },
 "trad-62": {
  "prompt": "Traduzir: 'Virei a noite.'",
  "promptNative": "Traduza: 'Virei a noite.'"
 },
 "trad-63": {
  "prompt": "Traduzir: 'Me fugiu completamente da cabeça.'",
  "promptNative": "Traduza: 'Me fugiu completamente da cabeça.'"
 },
 "trad-64": {
  "prompt": "Traduzir: 'Mal consigo fechar as contas do mês.'",
  "promptNative": "Traduza: 'Mal consigo fechar as contas do mês.'"
 },
 "trad-65": {
  "prompt": "Traduzir: 'Não fique enrolando.'",
  "promptNative": "Traduza: 'Não fique enrolando.'"
 },
 "trad-66": {
  "prompt": "Traduzir: 'A gente se deu bem na hora.'",
  "promptNative": "Traduza: 'A gente se deu bem na hora.'"
 },
 "trad-67": {
  "prompt": "Traduzir: 'Dinheiro não dá em árvore.'",
  "promptNative": "Traduza: 'Dinheiro não dá em árvore.'"
 },
 "trad-68": {
  "prompt": "Traduzir: 'Ser formiga (gostar de doces).'",
  "promptNative": "Traduza: 'Ser formiga (gostar de doces).'"
 },
 "trad-69": {
  "prompt": "Traduzir: 'É agora ou nunca.'",
  "promptNative": "Traduza: 'É agora ou nunca.'"
 },
 "trad-70": {
  "prompt": "Traduzir: 'Um problema de cada vez.'",
  "promptNative": "Traduza: 'Um problema de cada vez.'"
 },
 "trad-71": {
  "prompt": "Traduzir: 'Sem esforço não há recompensa.'",
  "promptNative": "Traduza: 'Sem esforço não há recompensa.'"
 },
 "trad-72": {
  "prompt": "Traduzir: 'Até mais.'",
  "promptNative": "Traduza: 'Até mais.'"
 },
 "trad-73": {
  "prompt": "Traduzir: 'E aí?'",
  "promptNative": "Traduza: 'E aí?'"
 },
 "trad-74": {
  "prompt": "Traduzir: 'Estou com fome.'",
  "promptNative": "Traduza: 'Estou com fome.'"
 },
 "trad-75": {
  "prompt": "Traduzir: 'Quantos anos você tem?'",
  "promptNative": "Traduza: 'Quantos anos você tem?'"
 },
 "trad-76": {
  "prompt": "Traduzir: 'Está muito frio.'",
  "promptNative": "Traduza: 'Está muito frio.'"
 },
 "trad-77": {
  "prompt": "Traduzir: 'Tenho 25 anos.'",
  "promptNative": "Traduza: 'Tenho 25 anos.'"
 },
 "trad-78": {
  "prompt": "Traduzir: 'Boa sorte!'",
  "promptNative": "Traduza: 'Boa sorte!'"
 },
 "trad-79": {
  "prompt": "Traduzir: 'Sinto muito.'",
  "promptNative": "Traduza: 'Sinto muito.'"
 },
 "trad-80": {
  "prompt": "Traduzir: 'Se cuida!'",
  "promptNative": "Traduza: 'Se cuida!'"
 },
 "trad-81": {
  "prompt": "Traduzir: 'Estou morrendo de fome.'",
  "promptNative": "Traduza: 'Estou morrendo de fome.'"
 },
 "trad-82": {
  "prompt": "Traduzir: 'Estou com dor de cabeça.'",
  "promptNative": "Traduza: 'Estou com dor de cabeça.'"
 },
 "trad-83": {
  "prompt": "Traduzir: 'Estou congelando!'",
  "promptNative": "Traduza: 'Estou congelando!'"
 },
 "trad-84": {
  "prompt": "Traduzir: 'Estou com saudade de você.'",
  "promptNative": "Traduza: 'Estou com saudade de você.'"
 },
 "trad-85": {
  "prompt": "Traduzir: 'De jeito nenhum!'",
  "promptNative": "Traduza: 'De jeito nenhum!'"
 },
 "trad-86": {
  "prompt": "Traduzir: 'Ela é a menina dos meus olhos.'",
  "promptNative": "Traduza: 'Ela é a menina dos meus olhos.'"
 },
 "trad-87": {
  "prompt": "Traduzir: 'Vamos ao que interessa.'",
  "promptNative": "Traduza: 'Vamos ao que interessa.'"
 },
 "trad-88": {
  "prompt": "Traduzir: 'Ele bateu as botas.'",
  "promptNative": "Traduza: 'Ele bateu as botas.'"
 },
 "trad-89": {
  "prompt": "Traduzir: 'Me custou os olhos da cara.'",
  "promptNative": "Traduza: 'Me custou os olhos da cara.'"
 },
 "trad-90": {
  "prompt": "Traduzir: 'Sou todo ouvidos.'",
  "promptNative": "Traduza: 'Sou todo ouvidos.'"
 },
 "trad-91": {
  "prompt": "Traduzir: 'Boa sorte! (\"merda!\")'",
  "promptNative": "Traduza: 'Boa sorte! (\"merda!\")'"
 },
 "trad-92": {
  "prompt": "Traduzir: 'Isso é moleza.'",
  "promptNative": "Traduza: 'Isso é moleza.'"
 },
 "trad-93": {
  "prompt": "Traduzir: 'Estou nas nuvens.'",
  "promptNative": "Traduza: 'Estou nas nuvens.'"
 },
 "trad-94": {
  "prompt": "Traduzir: 'Ele é uma coruja (fica acordado até tarde).'",
  "promptNative": "Traduza: 'Ele é uma coruja (fica acordado até tarde).'"
 },
 "trad-95": {
  "prompt": "Traduzir: 'Não é muito a minha praia.'",
  "promptNative": "Traduza: 'Não é muito a minha praia.'"
 },
 "trad-96": {
  "prompt": "Traduzir: 'Ela abriu o bico.'",
  "promptNative": "Traduza: 'Ela abriu o bico.'"
 },
 "trad-97": {
  "prompt": "Traduzir: 'O tempo voa.'",
  "promptNative": "Traduza: 'O tempo voa.'"
 },
 "trad-98": {
  "prompt": "Traduzir: 'Ele está meio adoentado.'",
  "promptNative": "Traduza: 'Ele está meio adoentado.'"
 },
 "trad-99": {
  "prompt": "Traduzir: 'Vamos parar por hoje.'",
  "promptNative": "Traduza: 'Vamos parar por hoje.'"
 },
 "trad-100": {
  "prompt": "Traduzir: 'Ela está com muita coisa para fazer agora.'",
  "promptNative": "Traduza: 'Ela está com muita coisa para fazer agora.'"
 },
 "trad-101": {
  "prompt": "Traduzir: 'Ele está enrolando.'",
  "promptNative": "Traduza: 'Ele está enrolando.'"
 },
 "trad-102": {
  "prompt": "Traduzir: 'Não conte com o ovo antes de a galinha botar.'",
  "promptNative": "Traduza: 'Não conte com o ovo antes de a galinha botar.'"
 },
 "trad-103": {
  "prompt": "Traduzir: 'Não é nenhum bicho de sete cabeças.'",
  "promptNative": "Traduza: 'Não é nenhum bicho de sete cabeças.'"
 },
 "trad-104": {
  "prompt": "Traduzir: 'Ela entregou o segredo da festa surpresa.'",
  "promptNative": "Traduza: 'Ela entregou o segredo da festa surpresa.'"
 },
 "trad-105": {
  "prompt": "Traduzir: 'Precisamos quebrar o gelo na reunião.'",
  "promptNative": "Traduza: 'Precisamos quebrar o gelo na reunião.'"
 },
 "trad-106": {
  "prompt": "Traduzir: 'Aquela prova foi moleza.'",
  "promptNative": "Traduza: 'Aquela prova foi moleza.'"
 },
 "trad-107": {
  "prompt": "Traduzir: 'Ele vive se martirizando por pequenos erros.'",
  "promptNative": "Traduza: 'Ele vive se martirizando por pequenos erros.'"
 },
 "trad-108": {
  "prompt": "Traduzir: 'Vamos esperar para ver como as coisas ficam.'",
  "promptNative": "Traduza: 'Vamos esperar para ver como as coisas ficam.'"
 },
 "trad-109": {
  "prompt": "Traduzir: 'A nova política é uma faca de dois gumes.'",
  "promptNative": "Traduza: 'A nova política é uma faca de dois gumes.'"
 },
 "trad-110": {
  "prompt": "Traduzir: 'Sou todo ouvidos, me conta o que aconteceu.'",
  "promptNative": "Traduza: 'Sou todo ouvidos, me conta o que aconteceu.'"
 },
 "trad-111": {
  "prompt": "Traduzir: 'Ele foi pego em flagrante roubando as mangas.'",
  "promptNative": "Traduza: 'Ele foi pego em flagrante roubando as mangas.'"
 },
 "trad-112": {
  "prompt": "Traduzir: 'Este projeto está nos custando os olhos da cara.'",
  "promptNative": "Traduza: 'Este projeto está nos custando os olhos da cara.'"
 },
 "trad-113": {
  "prompt": "Traduzir: 'Ela vive com a cabeça nas nuvens durante a aula.'",
  "promptNative": "Traduza: 'Ela vive com a cabeça nas nuvens durante a aula.'"
 },
 "trad-114": {
  "prompt": "Traduzir: 'Não insista em vão, a decisão é final.'",
  "promptNative": "Traduza: 'Não insista em vão, a decisão é final.'"
 },
 "trad-115": {
  "prompt": "Traduzir: 'Ele acertou em cheio com aquele comentário.'",
  "promptNative": "Traduza: 'Ele acertou em cheio com aquele comentário.'"
 },
 "trad-116": {
  "prompt": "Traduzir: 'É hora de encarar as consequências e admitir o erro.'",
  "promptNative": "Traduza: 'É hora de encarar as consequências e admitir o erro.'"
 },
 "trad-117": {
  "prompt": "Traduzir: 'Essa foi a gota d'água.'",
  "promptNative": "Traduza: 'Essa foi a gota d'água.'"
 },
 "trad-118": {
  "prompt": "Traduzir: 'Ele entregou o segredo da festa surpresa.'",
  "promptNative": "Traduza: 'Ele entregou o segredo da festa surpresa.'"
 },
 "trad-119": {
  "prompt": "Traduzir: 'As ações falam mais alto que as palavras.'",
  "promptNative": "Traduza: 'As ações falam mais alto que as palavras.'"
 },
 "trad-120": {
  "prompt": "Traduzir: 'Há males que vêm para bem.'",
  "promptNative": "Traduza: 'Há males que vêm para bem.'"
 },
 "trad-121": {
  "prompt": "Traduzir: 'Em Roma, faça como os romanos.'",
  "promptNative": "Traduza: 'Em Roma, faça como os romanos.'"
 },
 "trad-122": {
  "prompt": "Traduzir: 'Estamos entre a cruz e a espada.'",
  "promptNative": "Traduza: 'Estamos entre a cruz e a espada.'"
 },
 "trad-123": {
  "prompt": "Traduzir: 'Não adianta chorar sobre o leite derramado.'",
  "promptNative": "Traduza: 'Não adianta chorar sobre o leite derramado.'"
 },
 "trad-124": {
  "prompt": "Traduzir: 'Ela acertou em cheio.'",
  "promptNative": "Traduza: 'Ela acertou em cheio.'"
 },
 "trad-125": {
  "prompt": "Traduzir: 'Ele é um pau para toda obra.'",
  "promptNative": "Traduza: 'Ele é um pau para toda obra.'"
 },
 "trad-126": {
  "prompt": "Traduzir: 'Ele foi pego em flagrante.'",
  "promptNative": "Traduza: 'Ele foi pego em flagrante.'"
 },
 "fvocab-0": {
  "promptNative": "'El tiempo' significa...",
  "options": [
   "tempo; clima",
   "escola",
   "avião",
   "trem"
  ]
 },
 "fvocab-1": {
  "prompt": "¿Cómo se dice 'ano' en español?",
  "promptNative": "Como se diz 'ano' em espanhol?"
 },
 "fvocab-2": {
  "promptNative": "'El día' significa...",
  "options": [
   "dia",
   "leite",
   "céu",
   "peixe (como alimento)"
  ]
 },
 "fvocab-3": {
  "prompt": "¿Cómo se dice 'vez (ocasião)' en español?",
  "promptNative": "Como se diz 'vez (ocasião)' em espanhol?"
 },
 "fvocab-4": {
  "promptNative": "'La vida' significa...",
  "options": [
   "vida",
   "ano",
   "dinheiro",
   "pai"
  ]
 },
 "fvocab-5": {
  "prompt": "¿Cómo se dice 'homem' en español?",
  "promptNative": "Como se diz 'homem' em espanhol?"
 },
 "fvocab-6": {
  "promptNative": "'La mujer' significa...",
  "options": [
   "mulher; esposa",
   "vaca",
   "neve",
   "mesa"
  ]
 },
 "fvocab-7": {
  "prompt": "¿Cómo se dice 'criança; menino' en español?",
  "promptNative": "Como se diz 'criança; menino' em espanhol?"
 },
 "fvocab-8": {
  "promptNative": "'La mano' significa...",
  "options": [
   "mão",
   "família",
   "mundo",
   "filme"
  ]
 },
 "fvocab-9": {
  "prompt": "¿Cómo se dice 'olho' en español?",
  "promptNative": "Como se diz 'olho' em espanhol?"
 },
 "fvocab-10": {
  "promptNative": "'El agua' significa...",
  "options": [
   "água",
   "filme",
   "mulher; esposa",
   "irmão"
  ]
 },
 "fvocab-11": {
  "prompt": "¿Cómo se dice 'mesa' en español?",
  "promptNative": "Como se diz 'mesa' em espanhol?"
 },
 "fvocab-12": {
  "promptNative": "'La silla' significa...",
  "options": [
   "cadeira",
   "manhã",
   "filha",
   "foto"
  ]
 },
 "fvocab-13": {
  "prompt": "¿Cómo se dice 'porta' en español?",
  "promptNative": "Como se diz 'porta' em espanhol?"
 },
 "fvocab-14": {
  "promptNative": "'El libro' significa...",
  "options": [
   "livro",
   "sopa",
   "animal",
   "mês"
  ]
 },
 "fvocab-15": {
  "prompt": "¿Cómo se dice 'escola' en español?",
  "promptNative": "Como se diz 'escola' em espanhol?"
 },
 "fvocab-16": {
  "promptNative": "'La ciudad' significa...",
  "options": [
   "cidade",
   "irmão",
   "sol",
   "hora; hora do dia"
  ]
 },
 "fvocab-17": {
  "prompt": "¿Cómo se dice 'país (nação)' en español?",
  "promptNative": "Como se diz 'país (nação)' em espanhol?"
 },
 "fvocab-18": {
  "promptNative": "'El mundo' significa...",
  "options": [
   "mundo",
   "sopa",
   "país (nação)",
   "mês"
  ]
 },
 "fvocab-19": {
  "prompt": "¿Cómo se dice 'noite' en español?",
  "promptNative": "Como se diz 'noite' em espanhol?"
 },
 "fvocab-20": {
  "promptNative": "'La mañana' significa...",
  "options": [
   "manhã",
   "mundo",
   "neve",
   "mulher; esposa"
  ]
 },
 "fvocab-21": {
  "prompt": "¿Cómo se dice 'semana' en español?",
  "promptNative": "Como se diz 'semana' em espanhol?"
 },
 "fvocab-22": {
  "promptNative": "'El mes' significa...",
  "options": [
   "mês",
   "tempo; clima",
   "país (nação)",
   "escola"
  ]
 },
 "fvocab-23": {
  "prompt": "¿Cómo se dice 'hora; hora do dia' en español?",
  "promptNative": "Como se diz 'hora; hora do dia' em espanhol?"
 },
 "fvocab-24": {
  "promptNative": "'El minuto' significa...",
  "options": [
   "minuto",
   "açúcar",
   "fogo",
   "esporte"
  ]
 },
 "fvocab-25": {
  "prompt": "¿Cómo se dice 'nome' en español?",
  "promptNative": "Como se diz 'nome' em espanhol?"
 },
 "fvocab-26": {
  "promptNative": "'La familia' significa...",
  "options": [
   "família",
   "trem",
   "sal",
   "vez (ocasião)"
  ]
 },
 "fvocab-27": {
  "prompt": "¿Cómo se dice 'pai' en español?",
  "promptNative": "Como se diz 'pai' em espanhol?"
 },
 "fvocab-28": {
  "promptNative": "'La madre' significa...",
  "options": [
   "mãe",
   "dinheiro",
   "nome",
   "família"
  ]
 },
 "fvocab-29": {
  "prompt": "¿Cómo se dice 'filho' en español?",
  "promptNative": "Como se diz 'filho' em espanhol?"
 },
 "fvocab-30": {
  "promptNative": "'La hija' significa...",
  "options": [
   "filha",
   "flor",
   "vida",
   "arroz"
  ]
 },
 "fvocab-31": {
  "prompt": "¿Cómo se dice 'irmão' en español?",
  "promptNative": "Como se diz 'irmão' em espanhol?"
 },
 "fvocab-32": {
  "promptNative": "'La hermana' significa...",
  "options": [
   "irmã",
   "água",
   "dia",
   "avião"
  ]
 },
 "fvocab-33": {
  "prompt": "¿Cómo se dice 'amigo' en español?",
  "promptNative": "Como se diz 'amigo' em espanhol?"
 },
 "fvocab-34": {
  "promptNative": "'El gato' significa...",
  "options": [
   "gato",
   "flor",
   "cavalo",
   "filme"
  ]
 },
 "fvocab-35": {
  "prompt": "¿Cómo se dice 'pão' en español?",
  "promptNative": "Como se diz 'pão' em espanhol?"
 },
 "fvocab-36": {
  "promptNative": "'La leche' significa...",
  "options": [
   "leite",
   "céu",
   "neve",
   "olho"
  ]
 },
 "fvocab-37": {
  "prompt": "¿Cómo se dice 'café' en español?",
  "promptNative": "Como se diz 'café' em espanhol?"
 },
 "fvocab-38": {
  "promptNative": "'La fruta' significa...",
  "options": [
   "fruta",
   "jogo",
   "irmão",
   "dia"
  ]
 },
 "fvocab-39": {
  "prompt": "¿Cómo se dice 'carne' en español?",
  "promptNative": "Como se diz 'carne' em espanhol?"
 },
 "fvocab-40": {
  "promptNative": "'El pescado' significa...",
  "options": [
   "peixe (como alimento)",
   "mês",
   "ano",
   "hora; hora do dia"
  ]
 },
 "fvocab-41": {
  "prompt": "¿Cómo se dice 'ovo' en español?",
  "promptNative": "Como se diz 'ovo' em espanhol?"
 },
 "fvocab-42": {
  "promptNative": "'El arroz' significa...",
  "options": [
   "arroz",
   "porta",
   "mulher; esposa",
   "cadeira"
  ]
 },
 "fvocab-43": {
  "prompt": "¿Cómo se dice 'sopa' en español?",
  "promptNative": "Como se diz 'sopa' em espanhol?"
 },
 "fvocab-44": {
  "promptNative": "'La sal' significa...",
  "options": [
   "sal",
   "sol",
   "rua",
   "noite"
  ]
 },
 "fvocab-45": {
  "prompt": "¿Cómo se dice 'açúcar' en español?",
  "promptNative": "Como se diz 'açúcar' em espanhol?"
 },
 "fvocab-46": {
  "promptNative": "'El dinero' significa...",
  "options": [
   "dinheiro",
   "filha",
   "sol",
   "animal"
  ]
 },
 "fvocab-47": {
  "prompt": "¿Cómo se dice 'loja' en español?",
  "promptNative": "Como se diz 'loja' em espanhol?"
 },
 "fvocab-48": {
  "promptNative": "'La calle' significa...",
  "options": [
   "rua",
   "ovo",
   "noite",
   "tempo; clima"
  ]
 },
 "fvocab-49": {
  "prompt": "¿Cómo se dice 'trem' en español?",
  "promptNative": "Como se diz 'trem' em espanhol?"
 },
 "fvocab-50": {
  "promptNative": "'El avión' significa...",
  "options": [
   "avião",
   "peixe (o animal)",
   "mês",
   "tempo; clima"
  ]
 },
 "fvocab-51": {
  "prompt": "¿Cómo se dice 'ônibus' en español?",
  "promptNative": "Como se diz 'ônibus' em espanhol?"
 },
 "fvocab-52": {
  "promptNative": "'La bicicleta' significa...",
  "options": [
   "bicicleta",
   "ônibus",
   "esporte",
   "pássaro"
  ]
 },
 "fvocab-53": {
  "prompt": "¿Cómo se dice 'telefone' en español?",
  "promptNative": "Como se diz 'telefone' em espanhol?"
 },
 "fvocab-54": {
  "promptNative": "'La foto' significa...",
  "options": [
   "foto",
   "filho",
   "bicicleta",
   "cavalo"
  ]
 },
 "fvocab-55": {
  "prompt": "¿Cómo se dice 'música' en español?",
  "promptNative": "Como se diz 'música' em espanhol?"
 },
 "fvocab-56": {
  "promptNative": "'La película' significa...",
  "options": [
   "filme",
   "lua",
   "semana",
   "jogo"
  ]
 },
 "fvocab-57": {
  "prompt": "¿Cómo se dice 'jogo' en español?",
  "promptNative": "Como se diz 'jogo' em espanhol?"
 },
 "fvocab-58": {
  "promptNative": "'El deporte' significa...",
  "options": [
   "esporte",
   "vida",
   "país (nação)",
   "flor"
  ]
 },
 "fvocab-59": {
  "prompt": "¿Cómo se dice 'futebol' en español?",
  "promptNative": "Como se diz 'futebol' em espanhol?"
 },
 "fvocab-60": {
  "promptNative": "'La playa' significa...",
  "options": [
   "praia",
   "jogo",
   "açúcar",
   "amigo"
  ]
 },
 "fvocab-61": {
  "prompt": "¿Cómo se dice 'sol' en español?",
  "promptNative": "Como se diz 'sol' em espanhol?"
 },
 "fvocab-62": {
  "promptNative": "'La luna' significa...",
  "options": [
   "lua",
   "mesa",
   "árvore",
   "trem"
  ]
 },
 "fvocab-63": {
  "prompt": "¿Cómo se dice 'céu' en español?",
  "promptNative": "Como se diz 'céu' em espanhol?"
 },
 "fvocab-64": {
  "promptNative": "'La lluvia' significa...",
  "options": [
   "chuva",
   "sol",
   "mesa",
   "açúcar"
  ]
 },
 "fvocab-65": {
  "prompt": "¿Cómo se dice 'neve' en español?",
  "promptNative": "Como se diz 'neve' em espanhol?"
 },
 "fvocab-66": {
  "promptNative": "'El fuego' significa...",
  "options": [
   "fogo",
   "manhã",
   "céu",
   "rua"
  ]
 },
 "fvocab-67": {
  "prompt": "¿Cómo se dice 'ar' en español?",
  "promptNative": "Como se diz 'ar' em espanhol?"
 },
 "fvocab-68": {
  "promptNative": "'El árbol' significa...",
  "options": [
   "árvore",
   "criança; menino",
   "água",
   "sopa"
  ]
 },
 "fvocab-69": {
  "prompt": "¿Cómo se dice 'flor' en español?",
  "promptNative": "Como se diz 'flor' em espanhol?"
 },
 "fvocab-70": {
  "promptNative": "'El animal' significa...",
  "options": [
   "animal",
   "arroz",
   "mãe",
   "mês"
  ]
 },
 "fvocab-71": {
  "prompt": "¿Cómo se dice 'pássaro' en español?",
  "promptNative": "Como se diz 'pássaro' em espanhol?"
 },
 "fvocab-72": {
  "promptNative": "'El pez' significa...",
  "options": [
   "peixe (o animal)",
   "vaca",
   "minuto",
   "água"
  ]
 },
 "fvocab-73": {
  "prompt": "¿Cómo se dice 'cavalo' en español?",
  "promptNative": "Como se diz 'cavalo' em espanhol?"
 },
 "fvocab-74": {
  "promptNative": "'La vaca' significa...",
  "options": [
   "vaca",
   "pão",
   "lua",
   "loja"
  ]
 },
 "fvocab-75": {
  "prompt": "¿Cómo se dice 'frango (como alimento)' en español?",
  "promptNative": "Como se diz 'frango (como alimento)' em espanhol?"
 },
 "fvocab-76": {
  "promptNative": "'El color' significa...",
  "options": [
   "cor",
   "porta",
   "vaca",
   "mesa"
  ]
 },
 "fvocab-77": {
  "prompt": "¿Cómo se dice 'falar' en español?",
  "promptNative": "Como se diz 'falar' em espanhol?"
 },
 "fvocab-78": {
  "promptNative": "'Vivir' significa...",
  "options": [
   "viver",
   "pagar",
   "chamar",
   "beber"
  ]
 },
 "fvocab-79": {
  "prompt": "¿Cómo se dice 'trabalhar' en español?",
  "promptNative": "Como se diz 'trabalhar' em espanhol?"
 },
 "fvocab-80": {
  "promptNative": "'Estudiar' significa...",
  "options": [
   "estudar",
   "querer; amar",
   "cantar",
   "jogar (um jogo)"
  ]
 },
 "fvocab-81": {
  "prompt": "¿Cómo se dice 'ler' en español?",
  "promptNative": "Como se diz 'ler' em espanhol?"
 },
 "fvocab-82": {
  "promptNative": "'Escribir' significa...",
  "options": [
   "escrever",
   "caminhar",
   "falar",
   "trabalhar"
  ]
 },
 "fvocab-83": {
  "prompt": "¿Cómo se dice 'escutar' en español?",
  "promptNative": "Como se diz 'escutar' em espanhol?"
 },
 "fvocab-84": {
  "promptNative": "'Mirar' significa...",
  "options": [
   "olhar; assistir",
   "trabalhar",
   "falar",
   "ir"
  ]
 },
 "fvocab-85": {
  "prompt": "¿Cómo se dice 'ver' en español?",
  "promptNative": "Como se diz 'ver' em espanhol?"
 },
 "fvocab-86": {
  "promptNative": "'Dar' significa...",
  "options": [
   "dar",
   "esperar; ter esperança",
   "jogar (um jogo)",
   "comprar"
  ]
 },
 "fvocab-87": {
  "prompt": "¿Cómo se dice 'dizer; contar' en español?",
  "promptNative": "Como se diz 'dizer; contar' em espanhol?"
 },
 "fvocab-88": {
  "promptNative": "'Hacer' significa...",
  "options": [
   "fazer",
   "cozinhar",
   "comprar",
   "querer; amar"
  ]
 },
 "fvocab-89": {
  "prompt": "¿Cómo se dice 'ir' en español?",
  "promptNative": "Como se diz 'ir' em espanhol?"
 },
 "fvocab-90": {
  "promptNative": "'Venir' significa...",
  "options": [
   "vir",
   "fazer",
   "abrir",
   "jogar (um jogo)"
  ]
 },
 "fvocab-91": {
  "prompt": "¿Cómo se dice 'sair' en español?",
  "promptNative": "Como se diz 'sair' em espanhol?"
 },
 "fvocab-92": {
  "promptNative": "'Entrar' significa...",
  "options": [
   "entrar",
   "beber",
   "ajudar",
   "dar"
  ]
 },
 "fvocab-93": {
  "prompt": "¿Cómo se dice 'abrir' en español?",
  "promptNative": "Como se diz 'abrir' em espanhol?"
 },
 "fvocab-94": {
  "promptNative": "'Cerrar' significa...",
  "options": [
   "fechar",
   "viver",
   "ler",
   "cantar"
  ]
 },
 "fvocab-95": {
  "prompt": "¿Cómo se dice 'comprar' en español?",
  "promptNative": "Como se diz 'comprar' em espanhol?"
 },
 "fvocab-96": {
  "promptNative": "'Pagar' significa...",
  "options": [
   "pagar",
   "precisar",
   "ler",
   "beber"
  ]
 },
 "fvocab-97": {
  "prompt": "¿Cómo se dice 'ajudar' en español?",
  "promptNative": "Como se diz 'ajudar' em espanhol?"
 },
 "fvocab-98": {
  "promptNative": "'Llamar' significa...",
  "options": [
   "chamar",
   "procurar",
   "querer; amar",
   "beber"
  ]
 },
 "fvocab-99": {
  "prompt": "¿Cómo se dice 'procurar' en español?",
  "promptNative": "Como se diz 'procurar' em espanhol?"
 },
 "fvocab-100": {
  "promptNative": "'Esperar' significa...",
  "options": [
   "esperar; ter esperança",
   "vir",
   "viver",
   "caminhar"
  ]
 },
 "fvocab-101": {
  "prompt": "¿Cómo se dice 'amar' en español?",
  "promptNative": "Como se diz 'amar' em espanhol?"
 },
 "fvocab-102": {
  "promptNative": "'Querer' significa...",
  "options": [
   "querer; amar",
   "sair",
   "olhar; assistir",
   "vir"
  ]
 },
 "fvocab-103": {
  "prompt": "¿Cómo se dice 'precisar' en español?",
  "promptNative": "Como se diz 'precisar' em espanhol?"
 },
 "fvocab-104": {
  "promptNative": "'Usar' significa...",
  "options": [
   "usar",
   "estudar",
   "falar",
   "vir"
  ]
 },
 "fvocab-105": {
  "prompt": "¿Cómo se dice 'jogar (um jogo)' en español?",
  "promptNative": "Como se diz 'jogar (um jogo)' em espanhol?"
 },
 "fvocab-106": {
  "promptNative": "'Caminar' significa...",
  "options": [
   "caminhar",
   "nadar",
   "estudar",
   "pagar"
  ]
 },
 "fvocab-107": {
  "prompt": "¿Cómo se dice 'nadar' en español?",
  "promptNative": "Como se diz 'nadar' em espanhol?"
 },
 "fvocab-108": {
  "promptNative": "'Bailar' significa...",
  "options": [
   "dançar",
   "ajudar",
   "cantar",
   "usar"
  ]
 },
 "fvocab-109": {
  "prompt": "¿Cómo se dice 'cantar' en español?",
  "promptNative": "Como se diz 'cantar' em espanhol?"
 },
 "fvocab-110": {
  "promptNative": "'Cocinar' significa...",
  "options": [
   "cozinhar",
   "ajudar",
   "caminhar",
   "dançar"
  ]
 },
 "fvocab-111": {
  "prompt": "¿Cómo se dice 'beber' en español?",
  "promptNative": "Como se diz 'beber' em espanhol?"
 },
 "fvocab-112": {
  "promptNative": "'Grande' significa...",
  "options": [
   "grande",
   "bom",
   "rápido",
   "jovem"
  ]
 },
 "fvocab-113": {
  "prompt": "¿Cómo se dice 'pequeno' en español?",
  "promptNative": "Como se diz 'pequeno' em espanhol?"
 },
 "fvocab-114": {
  "promptNative": "'Bueno' significa...",
  "options": [
   "bom",
   "barato",
   "jovem",
   "rápido"
  ]
 },
 "fvocab-115": {
  "prompt": "¿Cómo se dice 'ruim' en español?",
  "promptNative": "Como se diz 'ruim' em espanhol?"
 },
 "fvocab-116": {
  "promptNative": "'Nuevo' significa...",
  "options": [
   "novo",
   "baixo",
   "grande",
   "alto"
  ]
 },
 "fvocab-117": {
  "prompt": "¿Cómo se dice 'velho' en español?",
  "promptNative": "Como se diz 'velho' em espanhol?"
 },
 "fvocab-118": {
  "promptNative": "'Joven' significa...",
  "options": [
   "jovem",
   "limpo",
   "triste",
   "baixo"
  ]
 },
 "fvocab-119": {
  "prompt": "¿Cómo se dice 'alto' en español?",
  "promptNative": "Como se diz 'alto' em espanhol?"
 },
 "fvocab-120": {
  "promptNative": "'Bajo' significa...",
  "options": [
   "baixo",
   "pobre",
   "comprido",
   "feliz"
  ]
 },
 "fvocab-121": {
  "prompt": "¿Cómo se dice 'comprido' en español?",
  "promptNative": "Como se diz 'comprido' em espanhol?"
 },
 "fvocab-122": {
  "promptNative": "'Corto' significa...",
  "options": [
   "curto",
   "rico; delicioso",
   "feliz",
   "triste"
  ]
 },
 "fvocab-123": {
  "prompt": "¿Cómo se dice 'feliz' en español?",
  "promptNative": "Como se diz 'feliz' em espanhol?"
 },
 "fvocab-124": {
  "promptNative": "'Triste' significa...",
  "options": [
   "triste",
   "velho",
   "fácil",
   "limpo"
  ]
 },
 "fvocab-125": {
  "prompt": "¿Cómo se dice 'fácil' en español?",
  "promptNative": "Como se diz 'fácil' em espanhol?"
 },
 "fvocab-126": {
  "promptNative": "'Difícil' significa...",
  "options": [
   "difícil",
   "alto",
   "sujo",
   "rico; delicioso"
  ]
 },
 "fvocab-127": {
  "prompt": "¿Cómo se dice 'quente' en español?",
  "promptNative": "Como se diz 'quente' em espanhol?"
 },
 "fvocab-128": {
  "promptNative": "'Frío' significa...",
  "options": [
   "frio",
   "jovem",
   "pobre",
   "feio"
  ]
 },
 "fvocab-129": {
  "prompt": "¿Cómo se dice 'rápido' en español?",
  "promptNative": "Como se diz 'rápido' em espanhol?"
 },
 "fvocab-130": {
  "promptNative": "'Lento' significa...",
  "options": [
   "lento",
   "baixo",
   "fácil",
   "novo"
  ]
 },
 "fvocab-131": {
  "prompt": "¿Cómo se dice 'bonito' en español?",
  "promptNative": "Como se diz 'bonito' em espanhol?"
 },
 "fvocab-132": {
  "promptNative": "'Feo' significa...",
  "options": [
   "feio",
   "rico; delicioso",
   "alto",
   "limpo"
  ]
 },
 "fvocab-133": {
  "prompt": "¿Cómo se dice 'limpo' en español?",
  "promptNative": "Como se diz 'limpo' em espanhol?"
 },
 "fvocab-134": {
  "promptNative": "'Sucio' significa...",
  "options": [
   "sujo",
   "frio",
   "lento",
   "barato"
  ]
 },
 "fvocab-135": {
  "prompt": "¿Cómo se dice 'barato' en español?",
  "promptNative": "Como se diz 'barato' em espanhol?"
 },
 "fvocab-136": {
  "promptNative": "'Caro' significa...",
  "options": [
   "caro",
   "bom",
   "ruim",
   "alto"
  ]
 },
 "fvocab-137": {
  "prompt": "¿Cómo se dice 'rico; delicioso' en español?",
  "promptNative": "Como se diz 'rico; delicioso' em espanhol?"
 },
 "fvocab-138": {
  "promptNative": "'Pobre' significa...",
  "options": [
   "pobre",
   "frio",
   "rápido",
   "bonito"
  ]
 },
 "fvocab-139": {
  "prompt": "¿Cómo se dice 'bem' en español?",
  "promptNative": "Como se diz 'bem' em espanhol?"
 },
 "fvocab-140": {
  "promptNative": "'Mal' significa...",
  "options": [
   "mal",
   "depois",
   "muito",
   "ali"
  ]
 },
 "fvocab-141": {
  "prompt": "¿Cómo se dice 'muito' en español?",
  "promptNative": "Como se diz 'muito' em espanhol?"
 },
 "fvocab-142": {
  "promptNative": "'Poco' significa...",
  "options": [
   "pouco (quantidade)",
   "bem",
   "sempre",
   "cedo"
  ]
 },
 "fvocab-143": {
  "prompt": "¿Cómo se dice 'sempre' en español?",
  "promptNative": "Como se diz 'sempre' em espanhol?"
 },
 "fvocab-144": {
  "promptNative": "'Nunca' significa...",
  "options": [
   "nunca",
   "também",
   "mal",
   "pouco (quantidade)"
  ]
 },
 "fvocab-145": {
  "prompt": "¿Cómo se dice 'hoje' en español?",
  "promptNative": "Como se diz 'hoje' em espanhol?"
 },
 "fvocab-146": {
  "promptNative": "'Aquí' significa...",
  "options": [
   "aqui",
   "bem",
   "também",
   "sempre"
  ]
 },
 "fvocab-147": {
  "prompt": "¿Cómo se dice 'ali' en español?",
  "promptNative": "Como se diz 'ali' em espanhol?"
 },
 "fvocab-148": {
  "promptNative": "'Cerca' significa...",
  "options": [
   "perto",
   "também",
   "cedo",
   "longe"
  ]
 },
 "fvocab-149": {
  "prompt": "¿Cómo se dice 'longe' en español?",
  "promptNative": "Como se diz 'longe' em espanhol?"
 },
 "fvocab-150": {
  "promptNative": "'Ahora' significa...",
  "options": [
   "agora",
   "perto",
   "muito",
   "também"
  ]
 },
 "fvocab-151": {
  "prompt": "¿Cómo se dice 'depois' en español?",
  "promptNative": "Como se diz 'depois' em espanhol?"
 },
 "fvocab-152": {
  "promptNative": "'Antes' significa...",
  "options": [
   "antes (no tempo)",
   "também",
   "cedo",
   "perto"
  ]
 },
 "fvocab-153": {
  "prompt": "¿Cómo se dice 'também' en español?",
  "promptNative": "Como se diz 'também' em espanhol?"
 },
 "fvocab-154": {
  "promptNative": "'Temprano' significa...",
  "options": [
   "cedo",
   "mal",
   "ali",
   "pouco (quantidade)"
  ]
 },
 "fvocab-155": {
  "prompt": "¿Cómo se dice 'cabeça' en español?",
  "promptNative": "Como se diz 'cabeça' em espanhol?"
 },
 "fvocab-156": {
  "promptNative": "'La cara' significa...",
  "options": [
   "rosto",
   "luva",
   "pescoço",
   "pimenta (tempero)"
  ]
 },
 "fvocab-157": {
  "prompt": "¿Cómo se dice 'boca' en español?",
  "promptNative": "Como se diz 'boca' em espanhol?"
 },
 "fvocab-158": {
  "promptNative": "'La nariz' significa...",
  "options": [
   "nariz",
   "colher",
   "parque",
   "meia"
  ]
 },
 "fvocab-159": {
  "prompt": "¿Cómo se dice 'orelha' en español?",
  "promptNative": "Como se diz 'orelha' em espanhol?"
 },
 "fvocab-160": {
  "promptNative": "'El diente' significa...",
  "options": [
   "dente",
   "pescoço",
   "banco",
   "almoço"
  ]
 },
 "fvocab-161": {
  "prompt": "¿Cómo se dice 'cabelo' en español?",
  "promptNative": "Como se diz 'cabelo' em espanhol?"
 },
 "fvocab-162": {
  "promptNative": "'La pierna' significa...",
  "options": [
   "perna",
   "ponte",
   "igreja",
   "vestido"
  ]
 },
 "fvocab-163": {
  "prompt": "¿Cómo se dice 'pé' en español?",
  "promptNative": "Como se diz 'pé' em espanhol?"
 },
 "fvocab-164": {
  "promptNative": "'La espalda' significa...",
  "options": [
   "costas",
   "nariz",
   "banheiro",
   "passaporte"
  ]
 },
 "fvocab-165": {
  "prompt": "¿Cómo se dice 'coração' en español?",
  "promptNative": "Como se diz 'coração' em espanhol?"
 },
 "fvocab-166": {
  "promptNative": "'El dedo' significa...",
  "options": [
   "dedo (da mão ou do pé)",
   "prato",
   "banheiro",
   "jantar"
  ]
 },
 "fvocab-167": {
  "prompt": "¿Cómo se dice 'pescoço' en español?",
  "promptNative": "Como se diz 'pescoço' em espanhol?"
 },
 "fvocab-168": {
  "promptNative": "'El hombro' significa...",
  "options": [
   "ombro",
   "banana",
   "hotel",
   "estação"
  ]
 },
 "fvocab-169": {
  "prompt": "¿Cómo se dice 'cozinha' en español?",
  "promptNative": "Como se diz 'cozinha' em espanhol?"
 },
 "fvocab-170": {
  "promptNative": "'El baño' significa...",
  "options": [
   "banheiro",
   "boné",
   "estação",
   "mercado"
  ]
 },
 "fvocab-171": {
  "prompt": "¿Cómo se dice 'quarto' en español?",
  "promptNative": "Como se diz 'quarto' em espanhol?"
 },
 "fvocab-172": {
  "promptNative": "'La sala' significa...",
  "options": [
   "sala de estar",
   "cozinha",
   "tomate",
   "mala"
  ]
 },
 "fvocab-173": {
  "prompt": "¿Cómo se dice 'jardim' en español?",
  "promptNative": "Como se diz 'jardim' em espanhol?"
 },
 "fvocab-174": {
  "promptNative": "'El suelo' significa...",
  "options": [
   "chão",
   "casaco",
   "jardim",
   "café da manhã"
  ]
 },
 "fvocab-175": {
  "prompt": "¿Cómo se dice 'parede (interna)' en español?",
  "promptNative": "Como se diz 'parede (interna)' em espanhol?"
 },
 "fvocab-176": {
  "promptNative": "'La escalera' significa...",
  "options": [
   "escada",
   "calça",
   "almoço",
   "ponte"
  ]
 },
 "fvocab-177": {
  "prompt": "¿Cómo se dice 'cama' en español?",
  "promptNative": "Como se diz 'cama' em espanhol?"
 },
 "fvocab-178": {
  "promptNative": "'El espejo' significa...",
  "options": [
   "espelho",
   "luva",
   "viagem",
   "perna"
  ]
 },
 "fvocab-179": {
  "prompt": "¿Cómo se dice 'toalha' en español?",
  "promptNative": "Como se diz 'toalha' em espanhol?"
 },
 "fvocab-180": {
  "promptNative": "'El jabón' significa...",
  "options": [
   "sabonete",
   "cachecol",
   "viagem",
   "vestido"
  ]
 },
 "fvocab-181": {
  "prompt": "¿Cómo se dice 'faca' en español?",
  "promptNative": "Como se diz 'faca' em espanhol?"
 },
 "fvocab-182": {
  "promptNative": "'El tenedor' significa...",
  "options": [
   "garfo",
   "jardim",
   "espelho",
   "legume"
  ]
 },
 "fvocab-183": {
  "prompt": "¿Cómo se dice 'colher' en español?",
  "promptNative": "Como se diz 'colher' em espanhol?"
 },
 "fvocab-184": {
  "promptNative": "'El plato' significa...",
  "options": [
   "prato",
   "legume",
   "escada",
   "maçã; quarteirão"
  ]
 },
 "fvocab-185": {
  "prompt": "¿Cómo se dice 'copo' en español?",
  "promptNative": "Como se diz 'copo' em espanhol?"
 },
 "fvocab-186": {
  "promptNative": "'La taza' significa...",
  "options": [
   "xícara",
   "esquina",
   "cachecol",
   "espelho"
  ]
 },
 "fvocab-187": {
  "prompt": "¿Cómo se dice 'garrafa' en español?",
  "promptNative": "Como se diz 'garrafa' em espanhol?"
 },
 "fvocab-188": {
  "promptNative": "'La servilleta' significa...",
  "options": [
   "guardanapo",
   "nariz",
   "maçã; quarteirão",
   "parque"
  ]
 },
 "fvocab-189": {
  "prompt": "¿Cómo se dice 'aeroporto' en español?",
  "promptNative": "Como se diz 'aeroporto' em espanhol?"
 },
 "fvocab-190": {
  "promptNative": "'La estación' significa...",
  "options": [
   "estação",
   "sorvete",
   "óleo (de cozinha)",
   "meia"
  ]
 },
 "fvocab-191": {
  "prompt": "¿Cómo se dice 'hotel' en español?",
  "promptNative": "Como se diz 'hotel' em espanhol?"
 },
 "fvocab-192": {
  "promptNative": "'El restaurante' significa...",
  "options": [
   "restaurante",
   "laranja (fruta)",
   "calça",
   "igreja"
  ]
 },
 "fvocab-193": {
  "prompt": "¿Cómo se dice 'mercado' en español?",
  "promptNative": "Como se diz 'mercado' em espanhol?"
 },
 "fvocab-194": {
  "promptNative": "'El banco' significa...",
  "options": [
   "banco",
   "sabonete",
   "museu",
   "boca"
  ]
 },
 "fvocab-195": {
  "prompt": "¿Cómo se dice 'hospital' en español?",
  "promptNative": "Como se diz 'hospital' em espanhol?"
 },
 "fvocab-196": {
  "promptNative": "'La farmacia' significa...",
  "options": [
   "farmácia",
   "casaco",
   "banco",
   "garfo"
  ]
 },
 "fvocab-197": {
  "prompt": "¿Cómo se dice 'igreja' en español?",
  "promptNative": "Como se diz 'igreja' em espanhol?"
 },
 "fvocab-198": {
  "promptNative": "'El museo' significa...",
  "options": [
   "museu",
   "luva",
   "vestido",
   "igreja"
  ]
 },
 "fvocab-199": {
  "prompt": "¿Cómo se dice 'parque' en español?",
  "promptNative": "Como se diz 'parque' em espanhol?"
 },
 "fvocab-200": {
  "promptNative": "'El puente' significa...",
  "options": [
   "ponte",
   "pé",
   "colher",
   "perna"
  ]
 },
 "fvocab-201": {
  "prompt": "¿Cómo se dice 'esquina' en español?",
  "promptNative": "Como se diz 'esquina' em espanhol?"
 },
 "fvocab-202": {
  "promptNative": "'El mapa' significa...",
  "options": [
   "mapa",
   "jardim",
   "sorvete",
   "guardanapo"
  ]
 },
 "fvocab-203": {
  "prompt": "¿Cómo se dice 'mala' en español?",
  "promptNative": "Como se diz 'mala' em espanhol?"
 },
 "fvocab-204": {
  "promptNative": "'El pasaporte' significa...",
  "options": [
   "passaporte",
   "copo",
   "viagem",
   "esquina"
  ]
 },
 "fvocab-205": {
  "prompt": "¿Cómo se dice 'bilhete' en español?",
  "promptNative": "Como se diz 'bilhete' em espanhol?"
 },
 "fvocab-206": {
  "promptNative": "'El viaje' significa...",
  "options": [
   "viagem",
   "sapato",
   "quarto",
   "mala"
  ]
 },
 "fvocab-207": {
  "prompt": "¿Cómo se dice 'férias' en español?",
  "promptNative": "Como se diz 'férias' em espanhol?"
 },
 "fvocab-208": {
  "promptNative": "'El desayuno' significa...",
  "options": [
   "café da manhã",
   "mercado",
   "manteiga",
   "museu"
  ]
 },
 "fvocab-209": {
  "prompt": "¿Cómo se dice 'almoço' en español?",
  "promptNative": "Como se diz 'almoço' em espanhol?"
 },
 "fvocab-210": {
  "promptNative": "'La cena' significa...",
  "options": [
   "jantar",
   "meia",
   "tomate",
   "dente"
  ]
 },
 "fvocab-211": {
  "prompt": "¿Cómo se dice 'queijo' en español?",
  "promptNative": "Como se diz 'queijo' em espanhol?"
 },
 "fvocab-212": {
  "promptNative": "'La mantequilla' significa...",
  "options": [
   "manteiga",
   "dente",
   "mercado",
   "bilhete"
  ]
 },
 "fvocab-213": {
  "prompt": "¿Cómo se dice 'sorvete' en español?",
  "promptNative": "Como se diz 'sorvete' em espanhol?"
 },
 "fvocab-214": {
  "promptNative": "'El pastel' significa...",
  "options": [
   "bolo",
   "laranja (fruta)",
   "banco",
   "museu"
  ]
 },
 "fvocab-215": {
  "prompt": "¿Cómo se dice 'biscoito' en español?",
  "promptNative": "Como se diz 'biscoito' em espanhol?"
 },
 "fvocab-216": {
  "promptNative": "'La verdura' significa...",
  "options": [
   "legume",
   "queijo",
   "quarto",
   "bilhete"
  ]
 },
 "fvocab-217": {
  "prompt": "¿Cómo se dice 'cebola' en español?",
  "promptNative": "Como se diz 'cebola' em espanhol?"
 },
 "fvocab-218": {
  "promptNative": "'El tomate' significa...",
  "options": [
   "tomate",
   "coração",
   "costas",
   "prato"
  ]
 },
 "fvocab-219": {
  "prompt": "¿Cómo se dice 'laranja (fruta)' en español?",
  "promptNative": "Como se diz 'laranja (fruta)' em espanhol?"
 },
 "fvocab-220": {
  "promptNative": "'La manzana' significa...",
  "options": [
   "maçã; quarteirão",
   "cozinha",
   "meia",
   "passaporte"
  ]
 },
 "fvocab-221": {
  "prompt": "¿Cómo se dice 'banana' en español?",
  "promptNative": "Como se diz 'banana' em espanhol?"
 },
 "fvocab-222": {
  "promptNative": "'La uva' significa...",
  "options": [
   "uva",
   "copo",
   "garfo",
   "faca"
  ]
 },
 "fvocab-223": {
  "prompt": "¿Cómo se dice 'morango' en español?",
  "promptNative": "Como se diz 'morango' em espanhol?"
 },
 "fvocab-224": {
  "promptNative": "'El limón' significa...",
  "options": [
   "limão",
   "óleo (de cozinha)",
   "espelho",
   "laranja (fruta)"
  ]
 },
 "fvocab-225": {
  "prompt": "¿Cómo se dice 'pimenta (tempero)' en español?",
  "promptNative": "Como se diz 'pimenta (tempero)' em espanhol?"
 },
 "fvocab-226": {
  "promptNative": "'El aceite' significa...",
  "options": [
   "óleo (de cozinha)",
   "dente",
   "legume",
   "cabelo"
  ]
 },
 "fvocab-227": {
  "prompt": "¿Cómo se dice 'camisa' en español?",
  "promptNative": "Como se diz 'camisa' em espanhol?"
 },
 "fvocab-228": {
  "promptNative": "'El pantalón' significa...",
  "options": [
   "calça",
   "cabeça",
   "dedo (da mão ou do pé)",
   "sapato"
  ]
 },
 "fvocab-229": {
  "prompt": "¿Cómo se dice 'vestido' en español?",
  "promptNative": "Como se diz 'vestido' em espanhol?"
 },
 "fvocab-230": {
  "promptNative": "'La falda' significa...",
  "options": [
   "saia",
   "garrafa",
   "dente",
   "sabonete"
  ]
 },
 "fvocab-231": {
  "prompt": "¿Cómo se dice 'sapato' en español?",
  "promptNative": "Como se diz 'sapato' em espanhol?"
 },
 "fvocab-232": {
  "promptNative": "'El calcetín' significa...",
  "options": [
   "meia",
   "parede (interna)",
   "orelha",
   "maçã; quarteirão"
  ]
 },
 "fvocab-233": {
  "prompt": "¿Cómo se dice 'casaco' en español?",
  "promptNative": "Como se diz 'casaco' em espanhol?"
 },
 "fvocab-234": {
  "promptNative": "'La gorra' significa...",
  "options": [
   "boné",
   "banana",
   "legume",
   "limão"
  ]
 },
 "fvocab-235": {
  "prompt": "¿Cómo se dice 'luva' en español?",
  "promptNative": "Como se diz 'luva' em espanhol?"
 },
 "fvocab-236": {
  "promptNative": "'La bufanda' significa...",
  "options": [
   "cachecol",
   "estação",
   "café da manhã",
   "meia"
  ]
 },
 "fvocab-237": {
  "prompt": "¿Cómo se dice 'cinto' en español?",
  "promptNative": "Como se diz 'cinto' em espanhol?"
 },
 "fvocab-238": {
  "promptNative": "'El bolsillo' significa...",
  "options": [
   "bolso",
   "xícara",
   "almoço",
   "costas"
  ]
 },
 "fvocab-239": {
  "prompt": "¿Cómo se dice 'voar' en español?",
  "promptNative": "Como se diz 'voar' em espanhol?"
 },
 "fvocab-240": {
  "promptNative": "'Conocer' significa...",
  "options": [
   "conhecer (pessoas/lugares)",
   "puxar",
   "sentar-se",
   "lembrar"
  ]
 },
 "fvocab-241": {
  "prompt": "¿Cómo se dice 'pensar' en español?",
  "promptNative": "Como se diz 'pensar' em espanhol?"
 },
 "fvocab-242": {
  "promptNative": "'Creer' significa...",
  "options": [
   "acreditar",
   "sentar-se",
   "subir; fazer upload",
   "lembrar"
  ]
 },
 "fvocab-243": {
  "prompt": "¿Cómo se dice 'sentir' en español?",
  "promptNative": "Como se diz 'sentir' em espanhol?"
 },
 "fvocab-244": {
  "promptNative": "'Despertar' significa...",
  "options": [
   "acordar (alguém)",
   "pintar",
   "descer; baixar",
   "enviar"
  ]
 },
 "fvocab-245": {
  "prompt": "¿Cómo se dice 'sentar-se' en español?",
  "promptNative": "Como se diz 'sentar-se' em espanhol?"
 },
 "fvocab-246": {
  "promptNative": "'Poner' significa...",
  "options": [
   "pôr",
   "lembrar",
   "ensinar; mostrar",
   "enviar"
  ]
 },
 "fvocab-247": {
  "prompt": "¿Cómo se dice 'tirar; remover' en español?",
  "promptNative": "Como se diz 'tirar; remover' em espanhol?"
 },
 "fvocab-248": {
  "promptNative": "'Llevar' significa...",
  "options": [
   "levar; vestir",
   "desenhar",
   "sentir",
   "lembrar"
  ]
 },
 "fvocab-249": {
  "prompt": "¿Cómo se dice 'trazer' en español?",
  "promptNative": "Como se diz 'trazer' em espanhol?"
 },
 "fvocab-250": {
  "promptNative": "'Enviar' significa...",
  "options": [
   "enviar",
   "cortar",
   "puxar",
   "trazer"
  ]
 },
 "fvocab-251": {
  "prompt": "¿Cómo se dice 'receber' en español?",
  "promptNative": "Como se diz 'receber' em espanhol?"
 },
 "fvocab-252": {
  "promptNative": "'Preguntar' significa...",
  "options": [
   "perguntar (fazer uma pergunta)",
   "sentir",
   "desenhar",
   "enviar"
  ]
 },
 "fvocab-253": {
  "prompt": "¿Cómo se dice 'responder' en español?",
  "promptNative": "Como se diz 'responder' em espanhol?"
 },
 "fvocab-254": {
  "promptNative": "'Enseñar' significa...",
  "options": [
   "ensinar; mostrar",
   "enviar",
   "perder; perder (um ônibus)",
   "lembrar"
  ]
 },
 "fvocab-255": {
  "prompt": "¿Cómo se dice 'aprender' en español?",
  "promptNative": "Como se diz 'aprender' em espanhol?"
 },
 "fvocab-256": {
  "promptNative": "'Recordar' significa...",
  "options": [
   "lembrar",
   "enviar",
   "levar; vestir",
   "acordar (alguém)"
  ]
 },
 "fvocab-257": {
  "prompt": "¿Cómo se dice 'perder; perder (um ônibus)' en español?",
  "promptNative": "Como se diz 'perder; perder (um ônibus)' em espanhol?"
 },
 "fvocab-258": {
  "promptNative": "'Ganar' significa...",
  "options": [
   "ganhar",
   "desenhar",
   "pintar",
   "subir; fazer upload"
  ]
 },
 "fvocab-259": {
  "prompt": "¿Cómo se dice 'limpar' en español?",
  "promptNative": "Como se diz 'limpar' em espanhol?"
 },
 "fvocab-260": {
  "promptNative": "'Lavar' significa...",
  "options": [
   "lavar",
   "acreditar",
   "receber",
   "perder; perder (um ônibus)"
  ]
 },
 "fvocab-261": {
  "prompt": "¿Cómo se dice 'cortar' en español?",
  "promptNative": "Como se diz 'cortar' em espanhol?"
 },
 "fvocab-262": {
  "promptNative": "'Pintar' significa...",
  "options": [
   "pintar",
   "levar; vestir",
   "limpar",
   "responder"
  ]
 },
 "fvocab-263": {
  "prompt": "¿Cómo se dice 'desenhar' en español?",
  "promptNative": "Como se diz 'desenhar' em espanhol?"
 },
 "fvocab-264": {
  "promptNative": "'Tocar' significa...",
  "options": [
   "tocar; tocar (música)",
   "sentir",
   "empurrar",
   "lembrar"
  ]
 },
 "fvocab-265": {
  "prompt": "¿Cómo se dice 'subir; fazer upload' en español?",
  "promptNative": "Como se diz 'subir; fazer upload' em espanhol?"
 },
 "fvocab-266": {
  "promptNative": "'Bajar' significa...",
  "options": [
   "descer; baixar",
   "ensinar; mostrar",
   "conhecer (pessoas/lugares)",
   "receber"
  ]
 },
 "fvocab-267": {
  "prompt": "¿Cómo se dice 'empurrar' en español?",
  "promptNative": "Como se diz 'empurrar' em espanhol?"
 },
 "fvocab-268": {
  "promptNative": "'Jalar' significa...",
  "options": [
   "puxar",
   "trazer",
   "tocar; tocar (música)",
   "chover"
  ]
 },
 "fvocab-269": {
  "prompt": "¿Cómo se dice 'chover' en español?",
  "promptNative": "Como se diz 'chover' em espanhol?"
 },
 "fvocab-270": {
  "promptNative": "'Contento' significa...",
  "options": [
   "contente; satisfeito",
   "doce",
   "saudável",
   "vazio"
  ]
 },
 "fvocab-271": {
  "prompt": "¿Cómo se dice 'cansado' en español?",
  "promptNative": "Como se diz 'cansado' em espanhol?"
 },
 "fvocab-272": {
  "promptNative": "'Enfermo' significa...",
  "options": [
   "doente",
   "cansado",
   "aberto",
   "seco"
  ]
 },
 "fvocab-273": {
  "prompt": "¿Cómo se dice 'saudável' en español?",
  "promptNative": "Como se diz 'saudável' em espanhol?"
 },
 "fvocab-274": {
  "promptNative": "'Fuerte' significa...",
  "options": [
   "forte",
   "doce",
   "aberto",
   "cansado"
  ]
 },
 "fvocab-275": {
  "prompt": "¿Cómo se dice 'fraco' en español?",
  "promptNative": "Como se diz 'fraco' em espanhol?"
 },
 "fvocab-276": {
  "promptNative": "'Gordo' significa...",
  "options": [
   "gordo",
   "picante",
   "saudável",
   "cansado"
  ]
 },
 "fvocab-277": {
  "prompt": "¿Cómo se dice 'magro (pessoa)' en español?",
  "promptNative": "Como se diz 'magro (pessoa)' em espanhol?"
 },
 "fvocab-278": {
  "promptNative": "'Ancho' significa...",
  "options": [
   "largo",
   "amargo",
   "aberto",
   "doce"
  ]
 },
 "fvocab-279": {
  "prompt": "¿Cómo se dice 'estreito' en español?",
  "promptNative": "Como se diz 'estreito' em espanhol?"
 },
 "fvocab-280": {
  "promptNative": "'Pesado' significa...",
  "options": [
   "pesado; chato (pessoa)",
   "perigoso",
   "estreito",
   "molhado"
  ]
 },
 "fvocab-281": {
  "prompt": "¿Cómo se dice 'leve (peso)' en español?",
  "promptNative": "Como se diz 'leve (peso)' em espanhol?"
 },
 "fvocab-282": {
  "promptNative": "'Lleno' significa...",
  "options": [
   "cheio",
   "pesado; chato (pessoa)",
   "gordo",
   "leve (peso)"
  ]
 },
 "fvocab-283": {
  "prompt": "¿Cómo se dice 'vazio' en español?",
  "promptNative": "Como se diz 'vazio' em espanhol?"
 },
 "fvocab-284": {
  "promptNative": "'Abierto' significa...",
  "options": [
   "aberto",
   "escuro",
   "doce",
   "leve (peso)"
  ]
 },
 "fvocab-285": {
  "prompt": "¿Cómo se dice 'fechado' en español?",
  "promptNative": "Como se diz 'fechado' em espanhol?"
 },
 "fvocab-286": {
  "promptNative": "'Seco' significa...",
  "options": [
   "seco",
   "magro (pessoa)",
   "saudável",
   "estreito"
  ]
 },
 "fvocab-287": {
  "prompt": "¿Cómo se dice 'molhado' en español?",
  "promptNative": "Como se diz 'molhado' em espanhol?"
 },
 "fvocab-288": {
  "promptNative": "'Dulce' significa...",
  "options": [
   "doce",
   "contente; satisfeito",
   "claro (cor); nítido",
   "perigoso"
  ]
 },
 "fvocab-289": {
  "prompt": "¿Cómo se dice 'amargo' en español?",
  "promptNative": "Como se diz 'amargo' em espanhol?"
 },
 "fvocab-290": {
  "promptNative": "'Salado' significa...",
  "options": [
   "salgado",
   "cheio",
   "pesado; chato (pessoa)",
   "forte"
  ]
 },
 "fvocab-291": {
  "prompt": "¿Cómo se dice 'picante' en español?",
  "promptNative": "Como se diz 'picante' em espanhol?"
 },
 "fvocab-292": {
  "promptNative": "'Oscuro' significa...",
  "options": [
   "escuro",
   "forte",
   "aberto",
   "claro (cor); nítido"
  ]
 },
 "fvocab-293": {
  "prompt": "¿Cómo se dice 'claro (cor); nítido' en español?",
  "promptNative": "Como se diz 'claro (cor); nítido' em espanhol?"
 },
 "fvocab-294": {
  "promptNative": "'Peligroso' significa...",
  "options": [
   "perigoso",
   "leve (peso)",
   "vazio",
   "seguro; certo"
  ]
 },
 "fvocab-295": {
  "prompt": "¿Cómo se dice 'seguro; certo' en español?",
  "promptNative": "Como se diz 'seguro; certo' em espanhol?"
 },
 "fvocab-296": {
  "promptNative": "'Todavía' significa...",
  "options": [
   "ainda",
   "talvez",
   "logo",
   "demais"
  ]
 },
 "fvocab-297": {
  "prompt": "¿Cómo se dice 'já' en español?",
  "promptNative": "Como se diz 'já' em espanhol?"
 },
 "fvocab-298": {
  "promptNative": "'Casi' significa...",
  "options": [
   "quase",
   "talvez",
   "ainda",
   "demais"
  ]
 },
 "fvocab-299": {
  "prompt": "¿Cómo se dice 'bastante; suficiente' en español?",
  "promptNative": "Como se diz 'bastante; suficiente' em espanhol?"
 },
 "fvocab-300": {
  "promptNative": "'Demasiado' significa...",
  "options": [
   "demais",
   "devagar",
   "ainda",
   "somente"
  ]
 },
 "fvocab-301": {
  "prompt": "¿Cómo se dice 'juntos' en español?",
  "promptNative": "Como se diz 'juntos' em espanhol?"
 },
 "fvocab-302": {
  "promptNative": "'Solamente' significa...",
  "options": [
   "somente",
   "talvez",
   "ainda",
   "devagar"
  ]
 },
 "fvocab-303": {
  "prompt": "¿Cómo se dice 'talvez' en español?",
  "promptNative": "Como se diz 'talvez' em espanhol?"
 },
 "fvocab-304": {
  "promptNative": "'Pronto' significa...",
  "options": [
   "logo",
   "ainda",
   "bastante; suficiente",
   "devagar"
  ]
 },
 "fvocab-305": {
  "prompt": "¿Cómo se dice 'devagar' en español?",
  "promptNative": "Como se diz 'devagar' em espanhol?"
 },
 "fvocab-306": {
  "promptNative": "'El problema' significa...",
  "options": [
   "problema",
   "ajuda",
   "frase",
   "esforço"
  ]
 },
 "fvocab-307": {
  "prompt": "¿Cómo se dice 'pergunta' en español?",
  "promptNative": "Como se diz 'pergunta' em espanhol?"
 },
 "fvocab-308": {
  "promptNative": "'La respuesta' significa...",
  "options": [
   "resposta",
   "salário",
   "desenvolvimento",
   "dever"
  ]
 },
 "fvocab-309": {
  "prompt": "¿Cómo se dice 'razão' en español?",
  "promptNative": "Como se diz 'razão' em espanhol?"
 },
 "fvocab-310": {
  "promptNative": "'La idea' significa...",
  "options": [
   "ideia",
   "ajuda",
   "meta (objetivo)",
   "dor"
  ]
 },
 "fvocab-311": {
  "prompt": "¿Cómo se dice 'exemplo' en español?",
  "promptNative": "Como se diz 'exemplo' em espanhol?"
 },
 "fvocab-312": {
  "promptNative": "'La historia' significa...",
  "options": [
   "história",
   "problema",
   "governo",
   "meta (objetivo)"
  ]
 },
 "fvocab-313": {
  "prompt": "¿Cómo se dice 'notícia' en español?",
  "promptNative": "Como se diz 'notícia' em espanhol?"
 },
 "fvocab-314": {
  "promptNative": "'La verdad' significa...",
  "options": [
   "verdade",
   "liberdade",
   "projeto",
   "idade"
  ]
 },
 "fvocab-315": {
  "prompt": "¿Cómo se dice 'mentira' en español?",
  "promptNative": "Como se diz 'mentira' em espanhol?"
 },
 "fvocab-316": {
  "promptNative": "'La ayuda' significa...",
  "options": [
   "ajuda",
   "reunião",
   "parceiro; casal",
   "ideia"
  ]
 },
 "fvocab-317": {
  "prompt": "¿Cómo se dice 'emprego' en español?",
  "promptNative": "Como se diz 'emprego' em espanhol?"
 },
 "fvocab-318": {
  "promptNative": "'El sueldo' significa...",
  "options": [
   "salário",
   "ideia",
   "pergunta",
   "perigo"
  ]
 },
 "fvocab-319": {
  "prompt": "¿Cómo se dice 'reunião' en español?",
  "promptNative": "Como se diz 'reunião' em espanhol?"
 },
 "fvocab-320": {
  "promptNative": "'La oficina' significa...",
  "options": [
   "escritório",
   "alegria",
   "cultura",
   "relatório"
  ]
 },
 "fvocab-321": {
  "prompt": "¿Cómo se dice 'empresa' en español?",
  "promptNative": "Como se diz 'empresa' em espanhol?"
 },
 "fvocab-322": {
  "promptNative": "'El informe' significa...",
  "options": [
   "relatório",
   "ira",
   "doença",
   "surpresa"
  ]
 },
 "fvocab-323": {
  "prompt": "¿Cómo se dice 'projeto' en español?",
  "promptNative": "Como se diz 'projeto' em espanhol?"
 },
 "fvocab-324": {
  "promptNative": "'La ley' significa...",
  "options": [
   "lei",
   "pergunta",
   "vergonha",
   "sorte"
  ]
 },
 "fvocab-325": {
  "prompt": "¿Cómo se dice 'governo' en español?",
  "promptNative": "Como se diz 'governo' em espanhol?"
 },
 "fvocab-326": {
  "promptNative": "'La guerra' significa...",
  "options": [
   "guerra",
   "alegria",
   "pele",
   "doença"
  ]
 },
 "fvocab-327": {
  "prompt": "¿Cómo se dice 'paz' en español?",
  "promptNative": "Como se diz 'paz' em espanhol?"
 },
 "fvocab-328": {
  "promptNative": "'La salud' significa...",
  "options": [
   "saúde",
   "empresa",
   "direito (jurídico); direito (área)",
   "fracasso"
  ]
 },
 "fvocab-329": {
  "prompt": "¿Cómo se dice 'doença' en español?",
  "promptNative": "Como se diz 'doença' em espanhol?"
 },
 "fvocab-330": {
  "promptNative": "'La medicina' significa...",
  "options": [
   "remédio",
   "significado",
   "relatório",
   "mudança"
  ]
 },
 "fvocab-331": {
  "prompt": "¿Cómo se dice 'dor' en español?",
  "promptNative": "Como se diz 'dor' em espanhol?"
 },
 "fvocab-332": {
  "promptNative": "'La sangre' significa...",
  "options": [
   "sangue",
   "perigo",
   "lei",
   "conhecimento"
  ]
 },
 "fvocab-333": {
  "prompt": "¿Cómo se dice 'pele' en español?",
  "promptNative": "Como se diz 'pele' em espanhol?"
 },
 "fvocab-334": {
  "promptNative": "'La edad' significa...",
  "options": [
   "idade",
   "casamento",
   "história",
   "escritório"
  ]
 },
 "fvocab-335": {
  "prompt": "¿Cómo se dice 'morte' en español?",
  "promptNative": "Como se diz 'morte' em espanhol?"
 },
 "fvocab-336": {
  "promptNative": "'El nacimiento' significa...",
  "options": [
   "nascimento",
   "sonho; sono",
   "sorte",
   "vergonha"
  ]
 },
 "fvocab-337": {
  "prompt": "¿Cómo se dice 'casamento' en español?",
  "promptNative": "Como se diz 'casamento' em espanhol?"
 },
 "fvocab-338": {
  "promptNative": "'La pareja' significa...",
  "options": [
   "parceiro; casal",
   "perigo",
   "mudança",
   "resposta"
  ]
 },
 "fvocab-339": {
  "prompt": "¿Cómo se dice 'vizinho' en español?",
  "promptNative": "Como se diz 'vizinho' em espanhol?"
 },
 "fvocab-340": {
  "promptNative": "'La costumbre' significa...",
  "options": [
   "costume; hábito",
   "ira",
   "desenvolvimento",
   "idade"
  ]
 },
 "fvocab-341": {
  "prompt": "¿Cómo se dice 'cultura' en español?",
  "promptNative": "Como se diz 'cultura' em espanhol?"
 },
 "fvocab-342": {
  "promptNative": "'El idioma' significa...",
  "options": [
   "idioma",
   "parceiro; casal",
   "pergunta",
   "reunião"
  ]
 },
 "fvocab-343": {
  "prompt": "¿Cómo se dice 'palavra' en español?",
  "promptNative": "Como se diz 'palavra' em espanhol?"
 },
 "fvocab-344": {
  "promptNative": "'La frase' significa...",
  "options": [
   "frase",
   "governo",
   "salário",
   "surpresa"
  ]
 },
 "fvocab-345": {
  "prompt": "¿Cómo se dice 'significado' en español?",
  "promptNative": "Como se diz 'significado' em espanhol?"
 },
 "fvocab-346": {
  "promptNative": "'El conocimiento' significa...",
  "options": [
   "conhecimento",
   "surpresa",
   "ideia",
   "ira"
  ]
 },
 "fvocab-347": {
  "prompt": "¿Cómo se dice 'memória' en español?",
  "promptNative": "Como se diz 'memória' em espanhol?"
 },
 "fvocab-348": {
  "promptNative": "'El sueño' significa...",
  "options": [
   "sonho; sono",
   "desenvolvimento",
   "liberdade",
   "notícia"
  ]
 },
 "fvocab-349": {
  "prompt": "¿Cómo se dice 'medo' en español?",
  "promptNative": "Como se diz 'medo' em espanhol?"
 },
 "fvocab-350": {
  "promptNative": "'La esperanza' significa...",
  "options": [
   "esperança",
   "dor",
   "desenvolvimento",
   "pergunta"
  ]
 },
 "fvocab-351": {
  "prompt": "¿Cómo se dice 'alegria' en español?",
  "promptNative": "Como se diz 'alegria' em espanhol?"
 },
 "fvocab-352": {
  "promptNative": "'La ira' significa...",
  "options": [
   "ira",
   "significado",
   "sangue",
   "doença"
  ]
 },
 "fvocab-353": {
  "prompt": "¿Cómo se dice 'surpresa' en español?",
  "promptNative": "Como se diz 'surpresa' em espanhol?"
 },
 "fvocab-354": {
  "promptNative": "'La vergüenza' significa...",
  "options": [
   "vergonha",
   "governo",
   "pergunta",
   "ideia"
  ]
 },
 "fvocab-355": {
  "prompt": "¿Cómo se dice 'orgulho' en español?",
  "promptNative": "Como se diz 'orgulho' em espanhol?"
 },
 "fvocab-356": {
  "promptNative": "'La culpa' significa...",
  "options": [
   "culpa",
   "parceiro; casal",
   "justiça",
   "remédio"
  ]
 },
 "fvocab-357": {
  "prompt": "¿Cómo se dice 'sorte' en español?",
  "promptNative": "Como se diz 'sorte' em espanhol?"
 },
 "fvocab-358": {
  "promptNative": "'El peligro' significa...",
  "options": [
   "perigo",
   "vergonha",
   "frase",
   "culpa"
  ]
 },
 "fvocab-359": {
  "prompt": "¿Cómo se dice 'segurança' en español?",
  "promptNative": "Como se diz 'segurança' em espanhol?"
 },
 "fvocab-360": {
  "promptNative": "'La libertad' significa...",
  "options": [
   "liberdade",
   "guerra",
   "significado",
   "vergonha"
  ]
 },
 "fvocab-361": {
  "prompt": "¿Cómo se dice 'justiça' en español?",
  "promptNative": "Como se diz 'justiça' em espanhol?"
 },
 "fvocab-362": {
  "promptNative": "'El derecho' significa...",
  "options": [
   "direito (jurídico); direito (área)",
   "relatório",
   "empresa",
   "surpresa"
  ]
 },
 "fvocab-363": {
  "prompt": "¿Cómo se dice 'dever' en español?",
  "promptNative": "Como se diz 'dever' em espanhol?"
 },
 "fvocab-364": {
  "promptNative": "'El fracaso' significa...",
  "options": [
   "fracasso",
   "surpresa",
   "culpa",
   "costume; hábito"
  ]
 },
 "fvocab-365": {
  "prompt": "¿Cómo se dice 'esforço' en español?",
  "promptNative": "Como se diz 'esforço' em espanhol?"
 },
 "fvocab-366": {
  "promptNative": "'La meta' significa...",
  "options": [
   "meta (objetivo)",
   "dor",
   "idioma",
   "governo"
  ]
 },
 "fvocab-367": {
  "prompt": "¿Cómo se dice 'nível' en español?",
  "promptNative": "Como se diz 'nível' em espanhol?"
 },
 "fvocab-368": {
  "promptNative": "'El cambio' significa...",
  "options": [
   "mudança",
   "ajuda",
   "desenvolvimento",
   "vergonha"
  ]
 },
 "fvocab-369": {
  "prompt": "¿Cómo se dice 'desenvolvimento' en español?",
  "promptNative": "Como se diz 'desenvolvimento' em espanhol?"
 },
 "fvocab-370": {
  "promptNative": "'El crecimiento' significa...",
  "options": [
   "crescimento",
   "segurança",
   "perigo",
   "costume; hábito"
  ]
 },
 "fvocab-371": {
  "prompt": "¿Cómo se dice 'aumento' en español?",
  "promptNative": "Como se diz 'aumento' em espanhol?"
 },
 "fvocab-372": {
  "promptNative": "'Lograr' significa...",
  "options": [
   "alcançar; conseguir",
   "gritar",
   "convidar; pagar (para alguém)",
   "prometer"
  ]
 },
 "fvocab-373": {
  "prompt": "¿Cómo se dice 'obter; conseguir' en español?",
  "promptNative": "Como se diz 'obter; conseguir' em espanhol?"
 },
 "fvocab-374": {
  "promptNative": "'Intentar' significa...",
  "options": [
   "tentar",
   "soltar; largar",
   "desaparecer",
   "discutir"
  ]
 },
 "fvocab-375": {
  "prompt": "¿Cómo se dice 'evitar' en español?",
  "promptNative": "Como se diz 'evitar' em espanhol?"
 },
 "fvocab-376": {
  "promptNative": "'Permitir' significa...",
  "options": [
   "permitir",
   "parabenizar",
   "soltar; largar",
   "construir"
  ]
 },
 "fvocab-377": {
  "prompt": "¿Cómo se dice 'proibir' en español?",
  "promptNative": "Como se diz 'proibir' em espanhol?"
 },
 "fvocab-378": {
  "promptNative": "'Obligar' significa...",
  "options": [
   "obrigar (alguém a)",
   "soltar; largar",
   "aparecer",
   "brigar"
  ]
 },
 "fvocab-379": {
  "prompt": "¿Cómo se dice 'decidir' en español?",
  "promptNative": "Como se diz 'decidir' em espanhol?"
 },
 "fvocab-380": {
  "promptNative": "'Elegir' significa...",
  "options": [
   "escolher; eleger",
   "tentar",
   "construir",
   "fugir"
  ]
 },
 "fvocab-381": {
  "prompt": "¿Cómo se dice 'duvidar' en español?",
  "promptNative": "Como se diz 'duvidar' em espanhol?"
 },
 "fvocab-382": {
  "promptNative": "'Confiar' significa...",
  "options": [
   "confiar",
   "oferecer",
   "aceitar",
   "aparecer"
  ]
 },
 "fvocab-383": {
  "prompt": "¿Cómo se dice 'prometer' en español?",
  "promptNative": "Como se diz 'prometer' em espanhol?"
 },
 "fvocab-384": {
  "promptNative": "'Mentir' significa...",
  "options": [
   "contar uma mentira",
   "criar",
   "brigar",
   "desculpar-se"
  ]
 },
 "fvocab-385": {
  "prompt": "¿Cómo se dice 'enganar' en español?",
  "promptNative": "Como se diz 'enganar' em espanhol?"
 },
 "fvocab-386": {
  "promptNative": "'Discutir' significa...",
  "options": [
   "discutir",
   "medir",
   "emprestar",
   "aceitar"
  ]
 },
 "fvocab-387": {
  "prompt": "¿Cómo se dice 'brigar' en español?",
  "promptNative": "Como se diz 'brigar' em espanhol?"
 },
 "fvocab-388": {
  "promptNative": "'Gritar' significa...",
  "options": [
   "gritar",
   "fugir",
   "continuar",
   "chorar"
  ]
 },
 "fvocab-389": {
  "prompt": "¿Cómo se dice 'sussurrar' en español?",
  "promptNative": "Como se diz 'sussurrar' em espanhol?"
 },
 "fvocab-390": {
  "promptNative": "'Llorar' significa...",
  "options": [
   "chorar",
   "medir",
   "decidir",
   "rir"
  ]
 },
 "fvocab-391": {
  "prompt": "¿Cómo se dice 'rir' en español?",
  "promptNative": "Como se diz 'rir' em espanhol?"
 },
 "fvocab-392": {
  "promptNative": "'Sonreír' significa...",
  "options": [
   "sorrir",
   "destruir",
   "explicar",
   "contar uma mentira"
  ]
 },
 "fvocab-393": {
  "prompt": "¿Cómo se dice 'reclamar' en español?",
  "promptNative": "Como se diz 'reclamar' em espanhol?"
 },
 "fvocab-394": {
  "promptNative": "'Disculparse' significa...",
  "options": [
   "desculpar-se",
   "sussurrar",
   "gritar",
   "brigar"
  ]
 },
 "fvocab-395": {
  "prompt": "¿Cómo se dice 'agradecer' en español?",
  "promptNative": "Como se diz 'agradecer' em espanhol?"
 },
 "fvocab-396": {
  "promptNative": "'Felicitar' significa...",
  "options": [
   "parabenizar",
   "aparecer",
   "seguir; continuar",
   "dobrar; virar (a esquina)"
  ]
 },
 "fvocab-397": {
  "prompt": "¿Cómo se dice 'convidar; pagar (para alguém)' en español?",
  "promptNative": "Como se diz 'convidar; pagar (para alguém)' em espanhol?"
 },
 "fvocab-398": {
  "promptNative": "'Aceptar' significa...",
  "options": [
   "aceitar",
   "deixar (para trás); permitir",
   "seguir; continuar",
   "continuar"
  ]
 },
 "fvocab-399": {
  "prompt": "¿Cómo se dice 'rejeitar' en español?",
  "promptNative": "Como se diz 'rejeitar' em espanhol?"
 },
 "fvocab-400": {
  "promptNative": "'Ofrecer' significa...",
  "options": [
   "oferecer",
   "prometer",
   "contar; contar (uma história)",
   "aceitar"
  ]
 },
 "fvocab-401": {
  "prompt": "¿Cómo se dice 'emprestar' en español?",
  "promptNative": "Como se diz 'emprestar' em espanhol?"
 },
 "fvocab-402": {
  "promptNative": "'Ahorrar' significa...",
  "options": [
   "poupar (dinheiro)",
   "descobrir",
   "confiar",
   "rir"
  ]
 },
 "fvocab-403": {
  "prompt": "¿Cómo se dice 'gastar' en español?",
  "promptNative": "Como se diz 'gastar' em espanhol?"
 },
 "fvocab-404": {
  "promptNative": "'Construir' significa...",
  "options": [
   "construir",
   "enganar",
   "destruir",
   "girar; rodar"
  ]
 },
 "fvocab-405": {
  "prompt": "¿Cómo se dice 'destruir' en español?",
  "promptNative": "Como se diz 'destruir' em espanhol?"
 },
 "fvocab-406": {
  "promptNative": "'Crear' significa...",
  "options": [
   "criar",
   "aceitar",
   "convidar; pagar (para alguém)",
   "escolher; eleger"
  ]
 },
 "fvocab-407": {
  "prompt": "¿Cómo se dice 'aparecer' en español?",
  "promptNative": "Como se diz 'aparecer' em espanhol?"
 },
 "fvocab-408": {
  "promptNative": "'Desaparecer' significa...",
  "options": [
   "desaparecer",
   "alcançar; conseguir",
   "gritar",
   "decidir"
  ]
 },
 "fvocab-409": {
  "prompt": "¿Cómo se dice 'acontecer' en español?",
  "promptNative": "Como se diz 'acontecer' em espanhol?"
 },
 "fvocab-410": {
  "promptNative": "'Continuar' significa...",
  "options": [
   "continuar",
   "tentar",
   "atravessar",
   "deixar (para trás); permitir"
  ]
 },
 "fvocab-411": {
  "prompt": "¿Cómo se dice 'deixar (para trás); permitir' en español?",
  "promptNative": "Como se diz 'deixar (para trás); permitir' em espanhol?"
 },
 "fvocab-412": {
  "promptNative": "'Soltar' significa...",
  "options": [
   "soltar; largar",
   "gastar",
   "desculpar-se",
   "sorrir"
  ]
 },
 "fvocab-413": {
  "prompt": "¿Cómo se dice 'dobrar; virar (a esquina)' en español?",
  "promptNative": "Como se diz 'dobrar; virar (a esquina)' em espanhol?"
 },
 "fvocab-414": {
  "promptNative": "'Girar' significa...",
  "options": [
   "girar; rodar",
   "escolher; eleger",
   "decidir",
   "descobrir"
  ]
 },
 "fvocab-415": {
  "prompt": "¿Cómo se dice 'atravessar' en español?",
  "promptNative": "Como se diz 'atravessar' em espanhol?"
 },
 "fvocab-416": {
  "promptNative": "'Seguir' significa...",
  "options": [
   "seguir; continuar",
   "sorrir",
   "obrigar (alguém a)",
   "reclamar"
  ]
 },
 "fvocab-417": {
  "prompt": "¿Cómo se dice 'fugir' en español?",
  "promptNative": "Como se diz 'fugir' em espanhol?"
 },
 "fvocab-418": {
  "promptNative": "'Esconder' significa...",
  "options": [
   "esconder (algo)",
   "gritar",
   "brigar",
   "aceitar"
  ]
 },
 "fvocab-419": {
  "prompt": "¿Cómo se dice 'descobrir' en español?",
  "promptNative": "Como se diz 'descobrir' em espanhol?"
 },
 "fvocab-420": {
  "promptNative": "'Explicar' significa...",
  "options": [
   "explicar",
   "destruir",
   "rir",
   "evitar"
  ]
 },
 "fvocab-421": {
  "prompt": "¿Cómo se dice 'descrever' en español?",
  "promptNative": "Como se diz 'descrever' em espanhol?"
 },
 "fvocab-422": {
  "promptNative": "'Comparar' significa...",
  "options": [
   "comparar",
   "emprestar",
   "parabenizar",
   "rir"
  ]
 },
 "fvocab-423": {
  "prompt": "¿Cómo se dice 'medir' en español?",
  "promptNative": "Como se diz 'medir' em espanhol?"
 },
 "fvocab-424": {
  "promptNative": "'Contar' significa...",
  "options": [
   "contar; contar (uma história)",
   "girar; rodar",
   "brigar",
   "medir"
  ]
 },
 "fvocab-425": {
  "prompt": "¿Cómo se dice 'importante' en español?",
  "promptNative": "Como se diz 'importante' em espanhol?"
 },
 "fvocab-426": {
  "promptNative": "'Necesario' significa...",
  "options": [
   "necessário",
   "capaz",
   "importante",
   "estranho; incomum"
  ]
 },
 "fvocab-427": {
  "prompt": "¿Cómo se dice 'possível' en español?",
  "promptNative": "Como se diz 'possível' em espanhol?"
 },
 "fvocab-428": {
  "promptNative": "'Imposible' significa...",
  "options": [
   "impossível",
   "grosseiro",
   "desconfortável; constrangedor",
   "parecido; semelhante"
  ]
 },
 "fvocab-429": {
  "prompt": "¿Cómo se dice 'provável' en español?",
  "promptNative": "Como se diz 'provável' em espanhol?"
 },
 "fvocab-430": {
  "promptNative": "'Común' significa...",
  "options": [
   "comum",
   "próprio",
   "mesmo",
   "capaz"
  ]
 },
 "fvocab-431": {
  "prompt": "¿Cómo se dice 'estranho; incomum' en español?",
  "promptNative": "Como se diz 'estranho; incomum' em espanhol?"
 },
 "fvocab-432": {
  "promptNative": "'Propio' significa...",
  "options": [
   "próprio",
   "necessário",
   "inútil",
   "possível"
  ]
 },
 "fvocab-433": {
  "prompt": "¿Cómo se dice 'mesmo' en español?",
  "promptNative": "Como se diz 'mesmo' em espanhol?"
 },
 "fvocab-434": {
  "promptNative": "'Diferente' significa...",
  "options": [
   "diferente",
   "justo; exato",
   "grosseiro",
   "parecido; semelhante"
  ]
 },
 "fvocab-435": {
  "prompt": "¿Cómo se dice 'parecido; semelhante' en español?",
  "promptNative": "Como se diz 'parecido; semelhante' em espanhol?"
 },
 "fvocab-436": {
  "promptNative": "'Verdadero' significa...",
  "options": [
   "verdadeiro; real",
   "útil",
   "importante",
   "desconfortável; constrangedor"
  ]
 },
 "fvocab-437": {
  "prompt": "¿Cómo se dice 'falso' en español?",
  "promptNative": "Como se diz 'falso' em espanhol?"
 },
 "fvocab-438": {
  "promptNative": "'Justo' significa...",
  "options": [
   "justo; exato",
   "importante",
   "confortável",
   "possível"
  ]
 },
 "fvocab-439": {
  "prompt": "¿Cómo se dice 'capaz' en español?",
  "promptNative": "Como se diz 'capaz' em espanhol?"
 },
 "fvocab-440": {
  "promptNative": "'Útil' significa...",
  "options": [
   "útil",
   "justo; exato",
   "covarde",
   "confortável"
  ]
 },
 "fvocab-441": {
  "prompt": "¿Cómo se dice 'inútil' en español?",
  "promptNative": "Como se diz 'inútil' em espanhol?"
 },
 "fvocab-442": {
  "promptNative": "'Cómodo' significa...",
  "options": [
   "confortável",
   "possível",
   "justo; exato",
   "estranho; incomum"
  ]
 },
 "fvocab-443": {
  "prompt": "¿Cómo se dice 'desconfortável; constrangedor' en español?",
  "promptNative": "Como se diz 'desconfortável; constrangedor' em espanhol?"
 },
 "fvocab-444": {
  "promptNative": "'Grosero' significa...",
  "options": [
   "grosseiro",
   "necessário",
   "confortável",
   "inútil"
  ]
 },
 "fvocab-445": {
  "prompt": "¿Cómo se dice 'orgulhoso' en español?",
  "promptNative": "Como se diz 'orgulhoso' em espanhol?"
 },
 "fvocab-446": {
  "promptNative": "'Celoso' significa...",
  "options": [
   "ciumento",
   "necessário",
   "provável",
   "próprio"
  ]
 },
 "fvocab-447": {
  "prompt": "¿Cómo se dice 'corajoso' en español?",
  "promptNative": "Como se diz 'corajoso' em espanhol?"
 },
 "fvocab-448": {
  "promptNative": "'Cobarde' significa...",
  "options": [
   "covarde",
   "ciumento",
   "provável",
   "comum"
  ]
 },
 "fvocab-449": {
  "prompt": "¿Cómo se dice 'além disso' en español?",
  "promptNative": "Como se diz 'além disso' em espanhol?"
 },
 "fvocab-450": {
  "promptNative": "'Mientras' significa...",
  "options": [
   "enquanto",
   "mal; quase não",
   "inclusive; até",
   "depois; logo"
  ]
 },
 "fvocab-451": {
  "prompt": "¿Cómo se dice 'então' en español?",
  "promptNative": "Como se diz 'então' em espanhol?"
 },
 "fvocab-452": {
  "promptNative": "'Luego' significa...",
  "options": [
   "depois; logo",
   "inclusive; até",
   "enquanto",
   "mal; quase não"
  ]
 },
 "fvocab-453": {
  "prompt": "¿Cómo se dice 'mal; quase não' en español?",
  "promptNative": "Como se diz 'mal; quase não' em espanhol?"
 },
 "fvocab-454": {
  "promptNative": "'Aún' significa...",
  "options": [
   "ainda; até (mais)",
   "mal; quase não",
   "depois; logo",
   "enquanto"
  ]
 },
 "fvocab-455": {
  "prompt": "¿Cómo se dice 'inclusive; até' en español?",
  "promptNative": "Como se diz 'inclusive; até' em espanhol?"
 },
 "fvocab-456": {
  "promptNative": "'El desafío' significa...",
  "options": [
   "desafio",
   "recurso",
   "solicitação (pedido)",
   "ferramenta"
  ]
 },
 "fvocab-457": {
  "prompt": "¿Cómo se dice 'ameaça' en español?",
  "promptNative": "Como se diz 'ameaça' em espanhol?"
 },
 "fvocab-458": {
  "promptNative": "'La ventaja' significa...",
  "options": [
   "vantagem",
   "comportamento",
   "confiança",
   "imposto"
  ]
 },
 "fvocab-459": {
  "prompt": "¿Cómo se dice 'desvantagem' en español?",
  "promptNative": "Como se diz 'desvantagem' em espanhol?"
 },
 "fvocab-460": {
  "promptNative": "'El recurso' significa...",
  "options": [
   "recurso",
   "caráter (temperamento)",
   "quantidade",
   "habilidade"
  ]
 },
 "fvocab-461": {
  "prompt": "¿Cómo se dice 'ferramenta' en español?",
  "promptNative": "Como se diz 'ferramenta' em espanhol?"
 },
 "fvocab-462": {
  "promptNative": "'La medida' significa...",
  "options": [
   "medida",
   "vantagem",
   "caráter (temperamento)",
   "força; fortaleza"
  ]
 },
 "fvocab-463": {
  "prompt": "¿Cómo se dice 'média' en español?",
  "promptNative": "Como se diz 'média' em espanhol?"
 },
 "fvocab-464": {
  "promptNative": "'El porcentaje' significa...",
  "options": [
   "porcentagem",
   "compromisso; noivado",
   "personalidade",
   "fraqueza"
  ]
 },
 "fvocab-465": {
  "prompt": "¿Cómo se dice 'imposto' en español?",
  "promptNative": "Como se diz 'imposto' em espanhol?"
 },
 "fvocab-466": {
  "promptNative": "'La deuda' significa...",
  "options": [
   "dívida",
   "qualidade",
   "trâmite burocrático",
   "média"
  ]
 },
 "fvocab-467": {
  "prompt": "¿Cómo se dice 'orçamento' en español?",
  "promptNative": "Como se diz 'orçamento' em espanhol?"
 },
 "fvocab-468": {
  "promptNative": "'La ganancia' significa...",
  "options": [
   "lucro",
   "fraqueza",
   "trâmite burocrático",
   "qualidade"
  ]
 },
 "fvocab-469": {
  "prompt": "¿Cómo se dice 'perda' en español?",
  "promptNative": "Como se diz 'perda' em espanhol?"
 },
 "fvocab-470": {
  "promptNative": "'La marca' significa...",
  "options": [
   "marca",
   "desacordo",
   "caráter (temperamento)",
   "concorrência"
  ]
 },
 "fvocab-471": {
  "prompt": "¿Cómo se dice 'publicidade' en español?",
  "promptNative": "Como se diz 'publicidade' em espanhol?"
 },
 "fvocab-472": {
  "promptNative": "'La competencia' significa...",
  "options": [
   "concorrência",
   "prazo; parcela",
   "caráter (temperamento)",
   "desvantagem"
  ]
 },
 "fvocab-473": {
  "prompt": "¿Cómo se dice 'qualidade' en español?",
  "promptNative": "Como se diz 'qualidade' em espanhol?"
 },
 "fvocab-474": {
  "promptNative": "'La cantidad' significa...",
  "options": [
   "quantidade",
   "relação; relacionamento",
   "imposto",
   "medida"
  ]
 },
 "fvocab-475": {
  "prompt": "¿Cómo se dice 'comportamento' en español?",
  "promptNative": "Como se diz 'comportamento' em espanhol?"
 },
 "fvocab-476": {
  "promptNative": "'La actitud' significa...",
  "options": [
   "atitude",
   "imposto",
   "dívida",
   "marca"
  ]
 },
 "fvocab-477": {
  "prompt": "¿Cómo se dice 'personalidade' en español?",
  "promptNative": "Como se diz 'personalidade' em espanhol?"
 },
 "fvocab-478": {
  "promptNative": "'El carácter' significa...",
  "options": [
   "caráter (temperamento)",
   "requisito",
   "força; fortaleza",
   "porcentagem"
  ]
 },
 "fvocab-479": {
  "prompt": "¿Cómo se dice 'habilidade' en español?",
  "promptNative": "Como se diz 'habilidade' em espanhol?"
 },
 "fvocab-480": {
  "promptNative": "'La debilidad' significa...",
  "options": [
   "fraqueza",
   "ameaça",
   "dívida",
   "atitude"
  ]
 },
 "fvocab-481": {
  "prompt": "¿Cómo se dice 'força; fortaleza' en español?",
  "promptNative": "Como se diz 'força; fortaleza' em espanhol?"
 },
 "fvocab-482": {
  "promptNative": "'La amistad' significa...",
  "options": [
   "amizade",
   "imposto",
   "desafio",
   "prazo; parcela"
  ]
 },
 "fvocab-483": {
  "prompt": "¿Cómo se dice 'relação; relacionamento' en español?",
  "promptNative": "Como se diz 'relação; relacionamento' em espanhol?"
 },
 "fvocab-484": {
  "promptNative": "'El compromiso' significa...",
  "options": [
   "compromisso; noivado",
   "lucro",
   "dívida",
   "requisito"
  ]
 },
 "fvocab-485": {
  "prompt": "¿Cómo se dice 'confiança' en español?",
  "promptNative": "Como se diz 'confiança' em espanhol?"
 },
 "fvocab-486": {
  "promptNative": "'El malentendido' significa...",
  "options": [
   "mal-entendido",
   "medida",
   "orçamento",
   "caráter (temperamento)"
  ]
 },
 "fvocab-487": {
  "prompt": "¿Cómo se dice 'acordo' en español?",
  "promptNative": "Como se diz 'acordo' em espanhol?"
 },
 "fvocab-488": {
  "promptNative": "'El desacuerdo' significa...",
  "options": [
   "desacordo",
   "relação; relacionamento",
   "média",
   "amizade"
  ]
 },
 "fvocab-489": {
  "prompt": "¿Cómo se dice 'proposta' en español?",
  "promptNative": "Como se diz 'proposta' em espanhol?"
 },
 "fvocab-490": {
  "promptNative": "'La solicitud' significa...",
  "options": [
   "solicitação (pedido)",
   "medida",
   "marca",
   "lucro"
  ]
 },
 "fvocab-491": {
  "prompt": "¿Cómo se dice 'requisito' en español?",
  "promptNative": "Como se diz 'requisito' em espanhol?"
 },
 "fvocab-492": {
  "promptNative": "'El plazo' significa...",
  "options": [
   "prazo; parcela",
   "caráter (temperamento)",
   "qualidade",
   "atitude"
  ]
 },
 "fvocab-493": {
  "prompt": "¿Cómo se dice 'trâmite burocrático' en español?",
  "promptNative": "Como se diz 'trâmite burocrático' em espanhol?"
 },
 "fvocab-494": {
  "promptNative": "'Desarrollar' significa...",
  "options": [
   "desenvolver",
   "piorar",
   "fingir",
   "avisar; advertir"
  ]
 },
 "fvocab-495": {
  "prompt": "¿Cómo se dice 'melhorar' en español?",
  "promptNative": "Como se diz 'melhorar' em espanhol?"
 },
 "fvocab-496": {
  "promptNative": "'Empeorar' significa...",
  "options": [
   "piorar",
   "propor",
   "avisar; advertir",
   "substituir (trocar por)"
  ]
 },
 "fvocab-497": {
  "prompt": "¿Cómo se dice 'aumentar' en español?",
  "promptNative": "Como se diz 'aumentar' em espanhol?"
 },
 "fvocab-498": {
  "promptNative": "'Disminuir' significa...",
  "options": [
   "diminuir",
   "melhorar",
   "abranger",
   "propor"
  ]
 },
 "fvocab-499": {
  "prompt": "¿Cómo se dice 'reduzir' en español?",
  "promptNative": "Como se diz 'reduzir' em espanhol?"
 },
 "fvocab-500": {
  "promptNative": "'Ampliar' significa...",
  "options": [
   "ampliar; expandir",
   "atualizar",
   "carecer; faltar",
   "averiguar; apurar"
  ]
 },
 "fvocab-501": {
  "prompt": "¿Cómo se dice 'substituir' en español?",
  "promptNative": "Como se diz 'substituir' em espanhol?"
 },
 "fvocab-502": {
  "promptNative": "'Reemplazar' significa...",
  "options": [
   "substituir (trocar por)",
   "verificar; conferir",
   "assumir (responsabilidade)",
   "supor; presumir"
  ]
 },
 "fvocab-503": {
  "prompt": "¿Cómo se dice 'atualizar' en español?",
  "promptNative": "Como se diz 'atualizar' em espanhol?"
 },
 "fvocab-504": {
  "promptNative": "'Averiguar' significa...",
  "options": [
   "averiguar; apurar",
   "diminuir",
   "reivindicar; reclamar formalmente",
   "ampliar; expandir"
  ]
 },
 "fvocab-505": {
  "prompt": "¿Cómo se dice 'verificar; conferir' en español?",
  "promptNative": "Como se diz 'verificar; conferir' em espanhol?"
 },
 "fvocab-506": {
  "promptNative": "'Suponer' significa...",
  "options": [
   "supor; presumir",
   "melhorar",
   "destacar-se; destacar",
   "desenvolver"
  ]
 },
 "fvocab-507": {
  "prompt": "¿Cómo se dice 'levantar (uma questão); propor' en español?",
  "promptNative": "Como se diz 'levantar (uma questão); propor' em espanhol?"
 },
 "fvocab-508": {
  "promptNative": "'Proponer' significa...",
  "options": [
   "propor",
   "diminuir",
   "destacar-se; destacar",
   "carecer; faltar"
  ]
 },
 "fvocab-509": {
  "prompt": "¿Cómo se dice 'sugerir' en español?",
  "promptNative": "Como se diz 'sugerir' em espanhol?"
 },
 "fvocab-510": {
  "promptNative": "'Advertir' significa...",
  "options": [
   "avisar; advertir",
   "superar",
   "enfrentar",
   "empreender"
  ]
 },
 "fvocab-511": {
  "prompt": "¿Cómo se dice 'exigir' en español?",
  "promptNative": "Como se diz 'exigir' em espanhol?"
 },
 "fvocab-512": {
  "promptNative": "'Reclamar' significa...",
  "options": [
   "reivindicar; reclamar formalmente",
   "empreender",
   "arriscar",
   "reduzir"
  ]
 },
 "fvocab-513": {
  "prompt": "¿Cómo se dice 'renunciar; desistir' en español?",
  "promptNative": "Como se diz 'renunciar; desistir' em espanhol?"
 },
 "fvocab-514": {
  "promptNative": "'Jubilarse' significa...",
  "options": [
   "aposentar-se",
   "levantar (uma questão); propor",
   "renunciar; desistir",
   "substituir (trocar por)"
  ]
 },
 "fvocab-515": {
  "prompt": "¿Cómo se dice 'contratar' en español?",
  "promptNative": "Como se diz 'contratar' em espanhol?"
 },
 "fvocab-516": {
  "promptNative": "'Despedir' significa...",
  "options": [
   "demitir; despedir-se",
   "fingir",
   "arriscar",
   "avisar; advertir"
  ]
 },
 "fvocab-517": {
  "prompt": "¿Cómo se dice 'empreender' en español?",
  "promptNative": "Como se diz 'empreender' em espanhol?"
 },
 "fvocab-518": {
  "promptNative": "'Arriesgar' significa...",
  "options": [
   "arriscar",
   "diminuir",
   "atualizar",
   "exibir-se; gabar-se"
  ]
 },
 "fvocab-519": {
  "prompt": "¿Cómo se dice 'apostar' en español?",
  "promptNative": "Como se diz 'apostar' em espanhol?"
 },
 "fvocab-520": {
  "promptNative": "'Presumir' significa...",
  "options": [
   "exibir-se; gabar-se",
   "disfarçar",
   "aumentar",
   "superar"
  ]
 },
 "fvocab-521": {
  "prompt": "¿Cómo se dice 'fingir' en español?",
  "promptNative": "Como se diz 'fingir' em espanhol?"
 },
 "fvocab-522": {
  "promptNative": "'Disimular' significa...",
  "options": [
   "disfarçar",
   "levantar (uma questão); propor",
   "demitir; despedir-se",
   "exigir"
  ]
 },
 "fvocab-523": {
  "prompt": "¿Cómo se dice 'superar' en español?",
  "promptNative": "Como se diz 'superar' em espanhol?"
 },
 "fvocab-524": {
  "promptNative": "'Enfrentar' significa...",
  "options": [
   "enfrentar",
   "piorar",
   "sugerir",
   "destacar-se; destacar"
  ]
 },
 "fvocab-525": {
  "prompt": "¿Cómo se dice 'assumir (responsabilidade)' en español?",
  "promptNative": "Como se diz 'assumir (responsabilidade)' em espanhol?"
 },
 "fvocab-526": {
  "promptNative": "'Carecer' significa...",
  "options": [
   "carecer; faltar",
   "substituir",
   "aumentar",
   "exibir-se; gabar-se"
  ]
 },
 "fvocab-527": {
  "prompt": "¿Cómo se dice 'abranger' en español?",
  "promptNative": "Como se diz 'abranger' em espanhol?"
 },
 "fvocab-528": {
  "promptNative": "'Destacar' significa...",
  "options": [
   "destacar-se; destacar",
   "aposentar-se",
   "superar",
   "abranger"
  ]
 },
 "fvocab-529": {
  "prompt": "¿Cómo se dice 'apontar; assinalar' en español?",
  "promptNative": "Como se diz 'apontar; assinalar' em espanhol?"
 },
 "fvocab-530": {
  "promptNative": "'Disponible' significa...",
  "options": [
   "disponível",
   "exigente",
   "prévio; anterior",
   "eficaz"
  ]
 },
 "fvocab-531": {
  "prompt": "¿Cómo se dice 'gratuito' en español?",
  "promptNative": "Como se diz 'gratuito' em espanhol?"
 },
 "fvocab-532": {
  "promptNative": "'Rentable' significa...",
  "options": [
   "lucrativo; rentável",
   "gratuito",
   "exigente",
   "eficiente"
  ]
 },
 "fvocab-533": {
  "prompt": "¿Cómo se dice 'eficaz' en español?",
  "promptNative": "Como se diz 'eficaz' em espanhol?"
 },
 "fvocab-534": {
  "promptNative": "'Eficiente' significa...",
  "options": [
   "eficiente",
   "eficaz",
   "exaustivo; cansativo",
   "cotidiano; diário"
  ]
 },
 "fvocab-535": {
  "prompt": "¿Cómo se dice 'exigente' en español?",
  "promptNative": "Como se diz 'exigente' em espanhol?"
 },
 "fvocab-536": {
  "promptNative": "'Agotado' significa...",
  "options": [
   "esgotado",
   "exigente",
   "lucrativo; rentável",
   "atual"
  ]
 },
 "fvocab-537": {
  "prompt": "¿Cómo se dice 'exaustivo; cansativo' en español?",
  "promptNative": "Como se diz 'exaustivo; cansativo' em espanhol?"
 },
 "fvocab-538": {
  "promptNative": "'Imprevisto' significa...",
  "options": [
   "imprevisto",
   "disponível",
   "escasso",
   "mútuo"
  ]
 },
 "fvocab-539": {
  "prompt": "¿Cómo se dice 'cotidiano; diário' en español?",
  "promptNative": "Como se diz 'cotidiano; diário' em espanhol?"
 },
 "fvocab-540": {
  "promptNative": "'Actual' significa...",
  "options": [
   "atual",
   "gratuito",
   "abundante",
   "imprevisto"
  ]
 },
 "fvocab-541": {
  "prompt": "¿Cómo se dice 'prévio; anterior' en español?",
  "promptNative": "Como se diz 'prévio; anterior' em espanhol?"
 },
 "fvocab-542": {
  "promptNative": "'Escaso' significa...",
  "options": [
   "escasso",
   "gratuito",
   "mútuo",
   "esgotado"
  ]
 },
 "fvocab-543": {
  "prompt": "¿Cómo se dice 'abundante' en español?",
  "promptNative": "Como se diz 'abundante' em espanhol?"
 },
 "fvocab-544": {
  "promptNative": "'Mutuo' significa...",
  "options": [
   "mútuo",
   "cotidiano; diário",
   "eficiente",
   "escasso"
  ]
 },
 "fvocab-545": {
  "prompt": "¿Cómo se dice 'nuance; matiz' en español?",
  "promptNative": "Como se diz 'nuance; matiz' em espanhol?"
 },
 "fvocab-546": {
  "promptNative": "'El rasgo' significa...",
  "options": [
   "traço; característica",
   "achado; descoberta",
   "viés",
   "saudade; nostalgia"
  ]
 },
 "fvocab-547": {
  "prompt": "¿Cómo se dice 'afã; ânsia' en español?",
  "promptNative": "Como se diz 'afã; ânsia' em espanhol?"
 },
 "fvocab-548": {
  "promptNative": "'El empeño' significa...",
  "options": [
   "empenho; persistência",
   "nuance; matiz",
   "viés",
   "abordagem; enfoque"
  ]
 },
 "fvocab-549": {
  "prompt": "¿Cómo se dice 'desempenho' en español?",
  "promptNative": "Como se diz 'desempenho' em espanhol?"
 },
 "fvocab-550": {
  "promptNative": "'El logro' significa...",
  "options": [
   "conquista; realização",
   "anseio; desejo profundo",
   "auge; pico",
   "traço; característica"
  ]
 },
 "fvocab-551": {
  "prompt": "¿Cómo se dice 'marco' en español?",
  "promptNative": "Como se diz 'marco' em espanhol?"
 },
 "fvocab-552": {
  "promptNative": "'El auge' significa...",
  "options": [
   "auge; pico",
   "foco; ângulo",
   "suspeita",
   "achado; descoberta"
  ]
 },
 "fvocab-553": {
  "prompt": "¿Cómo se dice 'declínio' en español?",
  "promptNative": "Como se diz 'declínio' em espanhol?"
 },
 "fvocab-554": {
  "promptNative": "'La brecha' significa...",
  "options": [
   "lacuna; brecha",
   "auge; pico",
   "desempenho",
   "enraizamento"
  ]
 },
 "fvocab-555": {
  "prompt": "¿Cómo se dice 'viés' en español?",
  "promptNative": "Como se diz 'viés' em espanhol?"
 },
 "fvocab-556": {
  "promptNative": "'La pauta' significa...",
  "options": [
   "diretriz; padrão",
   "traço; característica",
   "saudade; nostalgia",
   "foco; ângulo"
  ]
 },
 "fvocab-557": {
  "prompt": "¿Cómo se dice 'âmbito; campo' en español?",
  "promptNative": "Como se diz 'âmbito; campo' em espanhol?"
 },
 "fvocab-558": {
  "promptNative": "'El entorno' significa...",
  "options": [
   "ambiente; entorno",
   "desempenho",
   "saudade; nostalgia",
   "postura; posição"
  ]
 },
 "fvocab-559": {
  "prompt": "¿Cómo se dice 'limiar' en español?",
  "promptNative": "Como se diz 'limiar' em espanhol?"
 },
 "fvocab-560": {
  "promptNative": "'El vínculo' significa...",
  "options": [
   "vínculo; laço",
   "traço; característica",
   "certeza",
   "empenho; persistência"
  ]
 },
 "fvocab-561": {
  "prompt": "¿Cómo se dice 'enraizamento' en español?",
  "promptNative": "Como se diz 'enraizamento' em espanhol?"
 },
 "fvocab-562": {
  "promptNative": "'La añoranza' significa...",
  "options": [
   "saudade; nostalgia",
   "vínculo; laço",
   "abordagem; enfoque",
   "declínio"
  ]
 },
 "fvocab-563": {
  "prompt": "¿Cómo se dice 'anseio; desejo profundo' en español?",
  "promptNative": "Como se diz 'anseio; desejo profundo' em espanhol?"
 },
 "fvocab-564": {
  "promptNative": "'La incertidumbre' significa...",
  "options": [
   "incerteza",
   "âmbito; campo",
   "enraizamento",
   "afã; ânsia"
  ]
 },
 "fvocab-565": {
  "prompt": "¿Cómo se dice 'certeza' en español?",
  "promptNative": "Como se diz 'certeza' em espanhol?"
 },
 "fvocab-566": {
  "promptNative": "'La sospecha' significa...",
  "options": [
   "suspeita",
   "postura; posição",
   "diretriz; padrão",
   "lacuna; brecha"
  ]
 },
 "fvocab-567": {
  "prompt": "¿Cómo se dice 'indício; pista' en español?",
  "promptNative": "Como se diz 'indício; pista' em espanhol?"
 },
 "fvocab-568": {
  "promptNative": "'El hallazgo' significa...",
  "options": [
   "achado; descoberta",
   "lacuna; brecha",
   "declínio",
   "âmbito; campo"
  ]
 },
 "fvocab-569": {
  "prompt": "¿Cómo se dice 'abordagem; enfoque' en español?",
  "promptNative": "Como se diz 'abordagem; enfoque' em espanhol?"
 },
 "fvocab-570": {
  "promptNative": "'El enfoque' significa...",
  "options": [
   "foco; ângulo",
   "marco",
   "indício; pista",
   "ambiente; entorno"
  ]
 },
 "fvocab-571": {
  "prompt": "¿Cómo se dice 'postura; posição' en español?",
  "promptNative": "Como se diz 'postura; posição' em espanhol?"
 },
 "fvocab-572": {
  "promptNative": "'Plasmar' significa...",
  "options": [
   "plasmar; retratar (numa obra)",
   "contornar (uma questão)",
   "evadir; esquivar",
   "minar; solapar"
  ]
 },
 "fvocab-573": {
  "prompt": "¿Cómo se dice 'esboçar' en español?",
  "promptNative": "Como se diz 'esboçar' em espanhol?"
 },
 "fvocab-574": {
  "promptNative": "'Vislumbrar' significa...",
  "options": [
   "vislumbrar",
   "reduzir; corroer",
   "evadir; esquivar",
   "violar (direitos, regras)"
  ]
 },
 "fvocab-575": {
  "prompt": "¿Cómo se dice 'ponderar; sopesar' en español?",
  "promptNative": "Como se diz 'ponderar; sopesar' em espanhol?"
 },
 "fvocab-576": {
  "promptNative": "'Desglosar' significa...",
  "options": [
   "detalhar; desmembrar",
   "plasmar; retratar (numa obra)",
   "violar (direitos, regras)",
   "contornar (uma questão)"
  ]
 },
 "fvocab-577": {
  "prompt": "¿Cómo se dice 'reunir; angariar' en español?",
  "promptNative": "Como se diz 'reunir; angariar' em espanhol?"
 },
 "fvocab-578": {
  "promptNative": "'Aludir' significa...",
  "options": [
   "aludir a",
   "esboçar",
   "vislumbrar",
   "plasmar; retratar (numa obra)"
  ]
 },
 "fvocab-579": {
  "prompt": "¿Cómo se dice 'evadir; esquivar' en español?",
  "promptNative": "Como se diz 'evadir; esquivar' em espanhol?"
 },
 "fvocab-580": {
  "promptNative": "'Soslayar' significa...",
  "options": [
   "contornar (uma questão)",
   "aludir a",
   "violar (direitos, regras)",
   "sanar; corrigir"
  ]
 },
 "fvocab-581": {
  "prompt": "¿Cómo se dice 'aliviar; mitigar' en español?",
  "promptNative": "Como se diz 'aliviar; mitigar' em espanhol?"
 },
 "fvocab-582": {
  "promptNative": "'Mermar' significa...",
  "options": [
   "reduzir; corroer",
   "acatar; cumprir",
   "violar (direitos, regras)",
   "minar; solapar"
  ]
 },
 "fvocab-583": {
  "prompt": "¿Cómo se dice 'minar; solapar' en español?",
  "promptNative": "Como se diz 'minar; solapar' em espanhol?"
 },
 "fvocab-584": {
  "promptNative": "'Propiciar' significa...",
  "options": [
   "propiciar; favorecer",
   "reunir; angariar",
   "reduzir; corroer",
   "minar; solapar"
  ]
 },
 "fvocab-585": {
  "prompt": "¿Cómo se dice 'fomentar; incentivar' en español?",
  "promptNative": "Como se diz 'fomentar; incentivar' em espanhol?"
 },
 "fvocab-586": {
  "promptNative": "'Entablar' significa...",
  "options": [
   "travar (uma conversa, uma amizade)",
   "esboçar",
   "detalhar; desmembrar",
   "aliviar; mitigar"
  ]
 },
 "fvocab-587": {
  "prompt": "¿Cómo se dice 'acatar; cumprir' en español?",
  "promptNative": "Como se diz 'acatar; cumprir' em espanhol?"
 },
 "fvocab-588": {
  "promptNative": "'Vulnerar' significa...",
  "options": [
   "violar (direitos, regras)",
   "fomentar; incentivar",
   "contornar (uma questão)",
   "esboçar"
  ]
 },
 "fvocab-589": {
  "prompt": "¿Cómo se dice 'sanar; corrigir' en español?",
  "promptNative": "Como se diz 'sanar; corrigir' em espanhol?"
 },
 "fvocab-590": {
  "promptNative": "'Escueto' significa...",
  "options": [
   "sucinto; enxuto",
   "contundente; esmagador",
   "precário",
   "arredio; insociável"
  ]
 },
 "fvocab-591": {
  "prompt": "¿Cómo se dice 'superficial; sumário' en español?",
  "promptNative": "Como se diz 'superficial; sumário' em espanhol?"
 },
 "fvocab-592": {
  "promptNative": "'Férreo' significa...",
  "options": [
   "férreo; inflexível",
   "precário",
   "querido; entranhável",
   "perene; duradouro"
  ]
 },
 "fvocab-593": {
  "prompt": "¿Cómo se dice 'categórico; taxativo' en español?",
  "promptNative": "Como se diz 'categórico; taxativo' em espanhol?"
 },
 "fvocab-594": {
  "promptNative": "'Contundente' significa...",
  "options": [
   "contundente; esmagador",
   "descomunal; colossal",
   "querido; entranhável",
   "superficial; sumário"
  ]
 },
 "fvocab-595": {
  "prompt": "¿Cómo se dice 'gradual; paulatino' en español?",
  "promptNative": "Como se diz 'gradual; paulatino' em espanhol?"
 },
 "fvocab-596": {
  "promptNative": "'Vertiginoso' significa...",
  "options": [
   "vertiginoso",
   "precário",
   "inédito; insólito",
   "superficial; sumário"
  ]
 },
 "fvocab-597": {
  "prompt": "¿Cómo se dice 'ínfimo; irrisório' en español?",
  "promptNative": "Como se diz 'ínfimo; irrisório' em espanhol?"
 },
 "fvocab-598": {
  "promptNative": "'Descomunal' significa...",
  "options": [
   "descomunal; colossal",
   "ideal; idôneo",
   "superficial; sumário",
   "efêmero; passageiro"
  ]
 },
 "fvocab-599": {
  "prompt": "¿Cómo se dice 'querido; entranhável' en español?",
  "promptNative": "Como se diz 'querido; entranhável' em espanhol?"
 },
 "fvocab-600": {
  "promptNative": "'Huraño' significa...",
  "options": [
   "arredio; insociável",
   "contundente; esmagador",
   "descomunal; colossal",
   "férreo; inflexível"
  ]
 },
 "fvocab-601": {
  "prompt": "¿Cómo se dice 'afável; cordial' en español?",
  "promptNative": "Como se diz 'afável; cordial' em espanhol?"
 },
 "fvocab-602": {
  "promptNative": "'Precario' significa...",
  "options": [
   "precário",
   "ínfimo; irrisório",
   "inédito; insólito",
   "sucinto; enxuto"
  ]
 },
 "fvocab-603": {
  "prompt": "¿Cómo se dice 'ideal; idôneo' en español?",
  "promptNative": "Como se diz 'ideal; idôneo' em espanhol?"
 },
 "fvocab-604": {
  "promptNative": "'Nefasto' significa...",
  "options": [
   "nefasto; desastroso",
   "efêmero; passageiro",
   "perene; duradouro",
   "afável; cordial"
  ]
 },
 "fvocab-605": {
  "prompt": "¿Cómo se dice 'inédito; insólito' en español?",
  "promptNative": "Como se diz 'inédito; insólito' em espanhol?"
 },
 "fvocab-606": {
  "promptNative": "'Verosímil' significa...",
  "options": [
   "plausível; verossímil",
   "sucinto; enxuto",
   "ideal; idôneo",
   "inédito; insólito"
  ]
 },
 "fvocab-607": {
  "prompt": "¿Cómo se dice 'efêmero; passageiro' en español?",
  "promptNative": "Como se diz 'efêmero; passageiro' em espanhol?"
 },
 "fvocab-608": {
  "promptNative": "'Perenne' significa...",
  "options": [
   "perene; duradouro",
   "precário",
   "nefasto; desastroso",
   "ideal; idôneo"
  ]
 }
};
