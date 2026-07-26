// Brazilian Portuguese (pt) localization for the esSpainForEn track interactive surface.
// Target language = European (Spain) Spanish. Consumed by the game engine
// (lib/gameEngine.js flattenBank, via getL10n) as a per-source SIDE TABLE:
//   item id "cat-i" -> { prompt?, promptNative?, options? }.
// Any omitted field falls back to the base (English-facing) content, so English
// natives are unaffected. Spanish answer options / target words STAY Spanish
// (Spain: coche, ordenador, movil, vosotros...) - only the pt learner-facing
// framing (prompt concept, promptNative subtitles, fvocab recognition glosses)
// is localized here.
//   - vocab (production): pt concept swapped into prompt + pt subtitle;
//     Spanish target-word options kept. vocab (recognition): pt "significa..."
//     subtitle + pt-gloss options (index-aligned, correctIdx 0 preserved);
//     the quoted Spanish word in the prompt is kept.
//   - verbo: pt subtitle (hint) only; prompt + options stay base Spanish.
//   - trad: "Traduzir: <pt phrase>" prompt + pt subtitle; options stay Spanish.
//   - fvocab (Word Bank): recognition -> pt glosses as options (index-aligned,
//     correctIdx 0 preserved); production -> pt gloss in prompt/subtitle.
// AI-authored 2026-07-26. FLAGGED FOR #41 native (Brazilian Portuguese) review.

export default {
  "vocab-0": {
    "prompt": "¿Cómo se dice 'computador' en español (España)?",
    "promptNative": "Como se diz 'computador' em espanhol (Espanha)?"
  },
  "vocab-1": {
    "prompt": "¿Cómo se dice 'celular' en español (España)?",
    "promptNative": "Como se diz 'celular' em espanhol (Espanha)?"
  },
  "vocab-2": {
    "prompt": "¿Cómo se dice 'suco' en español (España)?",
    "promptNative": "Como se diz 'suco' em espanhol (Espanha)?"
  },
  "vocab-3": {
    "prompt": "¿Cómo se dice 'cachorro' en español?",
    "promptNative": "Como se diz 'cachorro' em espanhol?"
  },
  "vocab-4": {
    "promptNative": "'La casa' significa...",
    "options": ["casa","carro","mesa","rua"]
  },
  "vocab-5": {
    "promptNative": "'Comer' significa...",
    "options": ["comer","comprar","correr","dormir"]
  },
  "vocab-6": {
    "prompt": "¿Cómo se dice 'carro' en español (España)?",
    "promptNative": "Como se diz 'carro' em espanhol (Espanha)?"
  },
  "vocab-7": {
    "prompt": "¿Cómo se dice 'óculos' (eyewear) en español (España)?",
    "promptNative": "Como se diz 'óculos' em espanhol (Espanha)?"
  },
  "vocab-8": {
    "prompt": "¿Cómo se dice 'batatas' en español (España)?",
    "promptNative": "Como se diz 'batatas' em espanhol (Espanha)?"
  },
  "vocab-9": {
    "prompt": "¿Cómo se dice 'pêssego' en español (España)?",
    "promptNative": "Como se diz 'pêssego' em espanhol (Espanha)?"
  },
  "vocab-10": {
    "prompt": "¿Cómo se dice 'dirigir' en español (España)?",
    "promptNative": "Como se diz 'dirigir' em espanhol (Espanha)?"
  },
  "vocab-11": {
    "promptNative": "'El piso' significa... (Espanha)",
    "options": ["apartamento","apenas o chão","um passo","um pneu furado"]
  },
  "vocab-12": {
    "promptNative": "'Coger' significa... (Espanha)",
    "options": ["pegar","cozinhar em fogo baixo","cair","doar"]
  },
  "vocab-13": {
    "promptNative": "'Apetecer' significa... (Espanha)",
    "options": ["ter vontade de","apenas ser apetitoso","competir","aparecer de repente"]
  },
  "vocab-14": {
    "promptNative": "'Enfadarse' significa... (Espanha)",
    "options": ["ficar bravo","ficar entediado","sumir aos poucos","cansar-se"]
  },
  "vocab-15": {
    "promptNative": "'Currar' significa... (colloquial, Spain)",
    "options": ["trampar","curar carne","resolver pendências","estudar muito"]
  },
  "vocab-16": {
    "promptNative": "'Molar' significa... (colloquial, Spain)",
    "options": ["cair bem / ser querido","ranger os dentes","incomodar","modelar barro"]
  },
  "vocab-17": {
    "promptNative": "'Quedar (con alguien)' significa... (Espanha)",
    "options": ["combinar de se encontrar","ficar em casa","dever dinheiro","ficar em silêncio"]
  },
  "vocab-18": {
    "promptNative": "'Hacer puente' significa... (Espanha)",
    "options": ["emendar o feriado","construir uma ponte","pular o café da manhã","mudar de emprego"]
  },
  "vocab-19": {
    "promptNative": "'Estar liado' significa... (colloquial, Spain)",
    "options": ["estar atolado de trabalho","estar amarrado com corda","estar de briga","estar perdido"]
  },
  "vocab-20": {
    "promptNative": "'La sobremesa' significa...",
    "options": ["a prosa demorada à mesa após a refeição","a toalha de mesa","sobremesa","uma soneca à tarde"]
  },
  "vocab-21": {
    "promptNative": "'Friolero' significa... (Espanha)",
    "options": ["alguém friorento","um técnico de freezer","um prato frio","um mês de inverno"]
  },
  "vocab-22": {
    "prompt": "¿Cómo se dice 'gato' en español?",
    "promptNative": "Como se diz 'gato' em espanhol?"
  },
  "vocab-23": {
    "prompt": "¿Cómo se dice 'água' en español?",
    "promptNative": "Como se diz 'água' em espanhol?"
  },
  "vocab-24": {
    "prompt": "¿Cómo se dice 'pão' en español?",
    "promptNative": "Como se diz 'pão' em espanhol?"
  },
  "vocab-25": {
    "promptNative": "'Beber' significa...",
    "options": ["beber","comer","dormir","correr"]
  },
  "vocab-26": {
    "prompt": "¿Cómo se dice 'a mãe' en español?",
    "promptNative": "Como se diz 'a mãe' em espanhol?"
  },
  "vocab-27": {
    "prompt": "¿Cómo se dice 'o pai' en español?",
    "promptNative": "Como se diz 'o pai' em espanhol?"
  },
  "vocab-28": {
    "promptNative": "'El día' significa...",
    "options": ["o dia","a noite","a semana","o ano"]
  },
  "vocab-29": {
    "promptNative": "'Grande' significa...",
    "options": ["grande","pequeno","comprido","novo"]
  },
  "vocab-30": {
    "promptNative": "'Pequeño' significa...",
    "options": ["pequeno","grande","rápido","alto"]
  },
  "vocab-31": {
    "prompt": "¿Cómo se dice 'vermelho' en español?",
    "promptNative": "Como se diz 'vermelho' em espanhol?"
  },
  "vocab-32": {
    "prompt": "¿Cómo se dice 'a mão' en español?",
    "promptNative": "Como se diz 'a mão' em espanhol?"
  },
  "vocab-33": {
    "promptNative": "'La cabeza' significa...",
    "options": ["a cabeça","a mão","o pé","a perna"]
  },
  "vocab-34": {
    "prompt": "¿Cómo se dice 'a rua' en español?",
    "promptNative": "Como se diz 'a rua' em espanhol?"
  },
  "vocab-35": {
    "promptNative": "'Hablar' significa...",
    "options": ["falar","escutar","ler","comer"]
  },
  "vocab-36": {
    "prompt": "¿Cómo se dice 'o amigo' en español?",
    "promptNative": "Como se diz 'o amigo' em espanhol?"
  },
  "vocab-37": {
    "promptNative": "'La leche' significa...",
    "options": ["leite","água","vinho","suco"]
  },
  "vocab-38": {
    "prompt": "¿Cómo se dice 'o livro' en español?",
    "promptNative": "Como se diz 'o livro' em espanhol?"
  },
  "vocab-39": {
    "promptNative": "'Blanco' significa...",
    "options": ["branco","preto","azul","verde"]
  },
  "vocab-40": {
    "prompt": "¿Cómo se dice 'a noite' en español?",
    "promptNative": "Como se diz 'a noite' em espanhol?"
  },
  "vocab-41": {
    "prompt": "¿Cómo se dice 'cinco' en español?",
    "promptNative": "Como se diz 'cinco' em espanhol?"
  },
  "vocab-42": {
    "promptNative": "'Vale' significa... (Espanha)",
    "options": ["tudo bem","tchau","por favor","claro que não"]
  },
  "vocab-43": {
    "prompt": "¿Cómo se dice 'vagem' en español (España)?",
    "promptNative": "Como se diz 'vagem' em espanhol (Espanha)?"
  },
  "vocab-44": {
    "prompt": "¿Cómo se dice 'a piscina' en español (España)?",
    "promptNative": "Como se diz 'a piscina' em espanhol (Espanha)?"
  },
  "vocab-45": {
    "promptNative": "'El billete' significa... (Espanha)",
    "options": ["nota (cédula)","carteira","moeda","recibo"]
  },
  "vocab-46": {
    "promptNative": "'El aparcamiento' significa... (Espanha)",
    "options": ["o estacionamento","o apartamento","a calçada","a garagem"]
  },
  "vocab-47": {
    "promptNative": "'Aparcar' significa... (Espanha)",
    "options": ["estacionar","parar rapidinho","dar ré","sair dirigindo"]
  },
  "vocab-48": {
    "promptNative": "'El mando' significa... (Espanha)",
    "options": ["o controle remoto","o botão","o gerente","a maçaneta"]
  },
  "vocab-49": {
    "prompt": "¿Cómo se dice 'óculos de sol' en español (España)?",
    "promptNative": "Como se diz 'óculos de sol' em espanhol (Espanha)?"
  },
  "vocab-50": {
    "promptNative": "'Las lentillas' significa... (Espanha)",
    "options": ["lentes de contato","óculos de sol","óculos de leitura","óculos de proteção"]
  },
  "vocab-51": {
    "prompt": "¿Cómo se dice 'o morango' en español?",
    "promptNative": "Como se diz 'o morango' em espanhol?"
  },
  "vocab-52": {
    "promptNative": "'El albaricoque' significa... (Espanha)",
    "options": ["damasco","pêssego","ameixa","figo"]
  },
  "vocab-53": {
    "prompt": "¿Cómo se dice 'o ônibus' en español (España)?",
    "promptNative": "Como se diz 'o ônibus' em espanhol (Espanha)?"
  },
  "vocab-54": {
    "promptNative": "'El tío / la tía' significa... (colloquial, Spain)",
    "options": ["cara / tio","o chefe","a criança","o desconhecido"]
  },
  "vocab-55": {
    "promptNative": "'Guay' significa... (colloquial, Spain)",
    "options": ["legal","chato","caro","feio"]
  },
  "vocab-56": {
    "prompt": "¿Cómo se dice 'a jaqueta' en español?",
    "promptNative": "Como se diz 'a jaqueta' em espanhol?"
  },
  "vocab-57": {
    "promptNative": "'El carné de conducir' significa... (Espanha)",
    "options": ["a carteira de motorista","a carteira de identidade","o passaporte","a placa"]
  },
  "vocab-58": {
    "prompt": "¿Cómo se dice 'tomar café da manhã' en español?",
    "promptNative": "Como se diz 'tomar café da manhã' em espanhol?"
  },
  "vocab-59": {
    "promptNative": "'Merendar' significa...",
    "options": ["fazer um lanche da tarde","tomar café da manhã","jantar","pular uma refeição"]
  },
  "vocab-60": {
    "promptNative": "'Hace frío' significa...",
    "options": ["está frio","está calor","está ensolarado","está ventando"]
  },
  "vocab-61": {
    "promptNative": "'La nevera' significa... (Espanha)",
    "options": ["a geladeira","o forno","apenas o freezer","o fogão"]
  },
  "vocab-62": {
    "promptNative": "'Una caña' significa... (Espanha)",
    "options": ["um chope pequeno","uma cana-de-açúcar","uma vara de pescar","um canudo"]
  },
  "vocab-63": {
    "promptNative": "'Un botellín' significa... (Espanha)",
    "options": ["uma garrafinha de cerveja","uma garrafa grande de vinho","um copo de dose","um refrigerante"]
  },
  "vocab-64": {
    "promptNative": "'El paro' significa... (Espanha)",
    "options": ["desemprego","uma pausa curta","um par","uma parede"]
  },
  "vocab-65": {
    "promptNative": "'Flipar' significa... (colloquial, Spain)",
    "options": ["ficar pasmo","voar","reprovar numa prova","relaxar"]
  },
  "vocab-66": {
    "promptNative": "'Majo / maja' significa... (colloquial, Spain)",
    "options": ["simpático","rico","engraçado","idoso"]
  },
  "vocab-67": {
    "promptNative": "'El curro' significa... (colloquial, Spain)",
    "options": ["trabalho","um curso","uma esquina","um favor"]
  },
  "vocab-68": {
    "promptNative": "'El grifo' significa... (Espanha)",
    "options": ["a torneira","o ralo","a pia","o cano"]
  },
  "vocab-69": {
    "promptNative": "'Fregar los platos' significa... (Espanha)",
    "options": ["lavar a louça","secar a louça","tirar a mesa","cozinhar o jantar"]
  },
  "vocab-70": {
    "promptNative": "'La acera' significa...",
    "options": ["a calçada","a estrada","a faixa","o cruzamento"]
  },
  "vocab-71": {
    "promptNative": "'El casco antiguo' significa...",
    "options": ["o centro histórico","os arredores da cidade","o bairro novo","a prefeitura"]
  },
  "vocab-72": {
    "promptNative": "'Echar de menos' significa... (Espanha)",
    "options": ["sentir saudade","jogar fora","menosprezar","ficar sem"]
  },
  "vocab-73": {
    "promptNative": "'Estar de bajón' significa... (colloquial, Spain)",
    "options": ["sentir-se para baixo","estar de dieta","estar duro","estar com pressa"]
  },
  "vocab-74": {
    "promptNative": "'El botiquín' significa...",
    "options": ["o kit de primeiros socorros","a farmácia","a receita médica","a sala de espera"]
  },
  "vocab-75": {
    "promptNative": "'La receta' significa...",
    "options": ["a receita","a farmácia","o sintoma","o check-up"]
  },
  "vocab-76": {
    "promptNative": "'Tener buena pinta' significa...",
    "options": ["parecer apetitoso","estar bem pintado","ter sorte","estar bem vestido"]
  },
  "vocab-77": {
    "promptNative": "'Ligar' significa... (colloquial, Spain)",
    "options": ["paquerar","amarrar","chegar atrasado","mentir"]
  },
  "vocab-78": {
    "promptNative": "'El atasco' significa...",
    "options": ["o engarrafamento","a vaga de estacionamento","a rotatória","a cabine de pedágio"]
  },
  "vocab-79": {
    "promptNative": "'La rotonda' significa...",
    "options": ["a rotatória","o semáforo","o cruzamento","o viaduto"]
  },
  "vocab-80": {
    "promptNative": "'Un chaval' significa... (colloquial, Spain)",
    "options": ["um garoto","um velho","um chefe","um estrangeiro"]
  },
  "vocab-81": {
    "promptNative": "'Un pinchazo' significa...",
    "options": ["um pneu furado","um tanque cheio","um estepe","um pedágio"]
  },
  "vocab-82": {
    "promptNative": "'Estar constipado' significa... (Espanha)",
    "options": ["estar resfriado","estar com prisão de ventre","estar exausto","estar queimado de sol"]
  },
  "vocab-83": {
    "promptNative": "'Pretender' significa...",
    "options": ["pretender","fingir","exigir","adiar"]
  },
  "vocab-84": {
    "promptNative": "'El compromiso' significa...",
    "options": ["compromisso","um meio-termo","uma comparação","um lembrete de compromisso"]
  },
  "vocab-85": {
    "promptNative": "'Cutre' significa... (colloquial, Spain)",
    "options": ["cafona","caro e elegante","novinho em folha","apimentado"]
  },
  "vocab-86": {
    "promptNative": "'Mogollón' significa... (colloquial, Spain)",
    "options": ["um monte","um pouquinho","quase nada","por acaso"]
  },
  "vocab-87": {
    "promptNative": "'Chungo' significa... (colloquial, Spain)",
    "options": ["duvidoso","delicioso","hilário","novinho em folha"]
  },
  "vocab-88": {
    "promptNative": "'Agobiarse' significa... (Espanha)",
    "options": ["ficar sobrecarregado","ficar entediado","animar-se","pegar no sono"]
  },
  "vocab-89": {
    "promptNative": "'La chapuza' significa... (Espanha)",
    "options": ["um trabalho malfeito","uma grande pechincha","uma soneca rápida","um contrato formal"]
  },
  "vocab-90": {
    "promptNative": "'El guiri' significa... (colloquial, Spain)",
    "options": ["um turista estrangeiro (ocidental)","um guia turístico","uma mochila","uma lembrança"]
  },
  "vocab-91": {
    "promptNative": "'El friki' significa... (colloquial, Spain)",
    "options": ["um nerd","um chef","um desconhecido","um caçador de pechinchas"]
  },
  "vocab-92": {
    "promptNative": "'Soso' significa...",
    "options": ["sem graça","salgado","apimentado","queimado"]
  },
  "vocab-93": {
    "promptNative": "'Sensible' significa...",
    "options": ["sensível","sensato","invisível","responsável"]
  },
  "vocab-94": {
    "promptNative": "'Pillar' significa... (colloquial, Spain)",
    "options": ["pegar","descascar","perder","sussurrar"]
  },
  "vocab-95": {
    "promptNative": "'Pasar de algo / alguien' significa... (colloquial, Spain)",
    "options": ["não dar bola","passar numa prova","passar por um lugar","entregar algo"]
  },
  "vocab-96": {
    "promptNative": "'Dar palo' significa... (colloquial, Spain)",
    "options": ["ficar sem jeito","bater com um pau","emprestar dinheiro","indicar o caminho"]
  },
  "vocab-97": {
    "promptNative": "'Tener morro' significa... (colloquial, Spain)",
    "options": ["ter cara de pau","estar com o nariz escorrendo","ser tímido","estar duro"]
  },
  "vocab-98": {
    "promptNative": "'Cundir' significa... (Espanha)",
    "options": ["render bastante","afundar","vencer","derramar"]
  },
  "vocab-99": {
    "promptNative": "'Apañárselas' significa... (Espanha)",
    "options": ["se virar","arrumar um quarto","pedir desculpas","se inscrever"]
  },
  "vocab-100": {
    "promptNative": "'Estar empanado' significa... (colloquial, Spain)",
    "options": ["estar aéreo","estar cheio (satisfeito)","estar furioso","estar tomando sol"]
  },
  "vocab-101": {
    "promptNative": "'Fardar' significa... (colloquial, Spain)",
    "options": ["se exibir","economizar dinheiro","estar atrasado","sussurrar"]
  },
  "vocab-102": {
    "promptNative": "'Ser un cotilla' significa... (Espanha)",
    "options": ["ser fofoqueiro","ser muito organizado","ser um corredor veloz","ter sono pesado"]
  },
  "vocab-103": {
    "promptNative": "'Las rebajas' significa... (Espanha)",
    "options": ["as liquidações (sazonais)","as sobras","os reembolsos","os recibos"]
  },
  "vocab-104": {
    "promptNative": "'Escaquearse' significa... (colloquial, Spain)",
    "options": ["matar serviço","esconder-se debaixo da mesa","ficar sem dinheiro","perder a vez"]
  },
  "vocab-105": {
    "promptNative": "'El enchufe' significa... (colloquial, Spain)",
    "options": ["apadrinhamento (panelinha)","apenas uma tomada elétrica","um aperto de mão firme","uma entrevista de emprego"]
  },
  "vocab-106": {
    "promptNative": "'El botellón' significa... (Espanha)",
    "options": ["um encontro ao ar livre para beber em grupo","apenas uma garrafa grande de vinho","uma balada","o reembolso do vasilhame"]
  },
  "vocab-107": {
    "promptNative": "'La caña' significa... (Espanha)",
    "options": ["um chope pequeno","uma garrafa de vinho","um canudo","um café com leite"]
  },
  "vocab-108": {
    "promptNative": "'El madrugón' significa... (Espanha)",
    "options": ["um despertar muito cedo","uma preguiça na cama até tarde","uma soneca ao meio-dia","uma noitada"]
  },
  "vocab-109": {
    "promptNative": "'Camelar' significa... (colloquial, Spain)",
    "options": ["conquistar com conversa","andar devagar","acampar ao ar livre","mudar de ideia"]
  },
  "vocab-110": {
    "promptNative": "'Chapurrear' significa...",
    "options": ["arranhar o idioma","falar perfeitamente","traduzir profissionalmente","resmungar dormindo"]
  },
  "vocab-111": {
    "promptNative": "'La vergüenza ajena' significa... (Espanha)",
    "options": ["vergonha alheia","vergonha pública","uma pessoa tímida","um segredo compartilhado"]
  },
  "vocab-112": {
    "promptNative": "'La morriña' significa... (Espanha)",
    "options": ["saudade","uma leve dor de cabeça","neblina matinal","uma pequena dívida"]
  },
  "vocab-113": {
    "promptNative": "'El postureo' significa... (colloquial, Spain)",
    "options": ["posar para as aparências","boa postura","um trabalho de ensaio fotográfico","uma exposição de arte"]
  },
  "vocab-114": {
    "promptNative": "'Tener mala leche' significa... (colloquial, Spain)",
    "options": ["ter má índole","ser intolerante à lactose","ter azar no jogo de cartas","ser muito generoso"]
  },
  "vocab-115": {
    "promptNative": "'Ser un tiquismiquis' significa... (Espanha)",
    "options": ["ser cheio de frescura","falar muito rápido","ser gastador","ser notívago"]
  },
  "vocab-116": {
    "promptNative": "'El aguafiestas' significa...",
    "options": ["um estraga-prazeres","um salva-vidas","um encanador","um sommelier"]
  },
  "vocab-117": {
    "promptNative": "'Estar ensimismado' significa...",
    "options": ["perdido em pensamentos","muito envergonhado","exausto","completamente perdido"]
  },
  "vocab-118": {
    "promptNative": "'El desparpajo' significa... (Espanha)",
    "options": ["desenvoltura","total falta de jeito","silêncio total","um quarto bagunçado"]
  },
  "vocab-119": {
    "promptNative": "'Entrañable' significa...",
    "options": ["cativante","insuportável","interno (órgãos)","muito caro"]
  },
  "vocab-120": {
    "promptNative": "'Achantarse' significa... (Espanha)",
    "options": ["amarelar","sentar-se","cantar junto","gabar-se"]
  },
  "vocab-121": {
    "promptNative": "'Ser un sinvergüenza' significa...",
    "options": ["ser um sem-vergonha","ser extremamente tímido","estar sem um tostão","ser trabalhador"]
  },
  "vocab-122": {
    "promptNative": "'Trasnochar' significa...",
    "options": ["virar a noite acordado","mudar de casa à noite","trabalhar no turno da noite fixo","dormir até tarde"]
  },
  "vocab-123": {
    "promptNative": "'La cuesta de enero' significa... (Espanha)",
    "options": ["o aperto financeiro do início do ano","uma estrada de montanha em janeiro","uma resolução de Ano Novo","uma liquidação de inverno"]
  },
  "vocab-124": {
    "promptNative": "'Dar la brasa' significa... (colloquial, Spain)",
    "options": ["ficar enchendo","grelhar comida","aquecer alguém","dar um presente"]
  },
  "vocab-125": {
    "promptNative": "'El chiringuito' significa... (Espanha)",
    "options": ["um quiosque de praia / (fig.) um esquema duvidoso","um hotel de luxo","um shopping","uma estação de trem"]
  },
  "vocab-126": {
    "promptNative": "'Añorar' significa...",
    "options": ["ansiar por","somar números","envelhecer","anunciar"]
  },
  "verbo-0": {
    "promptNative": "Vocês _____ (tener = ter) razão. (vosotros)"
  },
  "verbo-1": {
    "promptNative": "Vocês _____ (querer = querer) vir à festa? (vosotros)"
  },
  "verbo-2": {
    "promptNative": "Vocês (f.) _____ (ir = ir) à festa hoje à noite. (vosotras)"
  },
  "verbo-3": {
    "promptNative": "Eu _____ (ser = ser) de Madrid."
  },
  "verbo-4": {
    "promptNative": "Ela _____ (tener = ter) dois irmãos."
  },
  "verbo-5": {
    "promptNative": "Ontem eu _____ (comer = comer) paella com a minha família."
  },
  "verbo-6": {
    "promptNative": "Vocês _____ (hablar = falar) muito rápido. (vosotros)"
  },
  "verbo-7": {
    "promptNative": "Hoje de manhã eu _____ (desayunar = tomar café da manhã) churros com chocolate."
  },
  "verbo-8": {
    "promptNative": "_____ (venir = vir) aqui agora mesmo. (vosotros command)"
  },
  "verbo-9": {
    "promptNative": "Não _____ (hablar = falar) tão alto, por favor. (vosotros)"
  },
  "verbo-10": {
    "promptNative": "Vocês _____ (gustar = gostar) de tortilla espanhola? (vosotros)"
  },
  "verbo-11": {
    "promptNative": "Quando vocês _____ (terminar = terminar), me avisem. (vosotros)"
  },
  "verbo-12": {
    "promptNative": "Espero que _____ (ir = ir) tudo bem para vocês na prova."
  },
  "verbo-13": {
    "promptNative": "Se vocês _____ (estar = estar) livres no sábado, venham jantar. (vosotros)"
  },
  "verbo-14": {
    "promptNative": "Tomara que vocês _____ (hacer = fazer) o feriadão com a gente. (vosotros)"
  },
  "verbo-15": {
    "promptNative": "Se eu _____ (saber = saber) antes, teria avisado vocês."
  },
  "verbo-16": {
    "promptNative": "_____ (haber) vocês chegado antes, teriam visto o jogo. ('Se vocês tivessem chegado...')"
  },
  "verbo-17": {
    "promptNative": "Aconteça o que _____ (pasar = passar) acontecer, vocês fiquem calmos."
  },
  "verbo-18": {
    "promptNative": "Vocês _____ (hablar = falar) espanhol muito bem. (vosotros)"
  },
  "verbo-19": {
    "promptNative": "Vocês _____ (comer = comer) rápido demais. (vosotras)"
  },
  "verbo-20": {
    "promptNative": "Vocês _____ (vivir = morar) em Madrid, né? (vosotros)"
  },
  "verbo-21": {
    "promptNative": "Vocês _____ (ser = ser) muito simpáticos. (vosotros)"
  },
  "verbo-22": {
    "promptNative": "Vocês _____ (estar = estar) muito bonitas hoje. (vosotras)"
  },
  "verbo-23": {
    "promptNative": "Vocês _____ (tener = ter) muita sorte. (vosotros)"
  },
  "verbo-24": {
    "promptNative": "Vocês _____ (querer = querer) café ou chá? (vosotros)"
  },
  "verbo-25": {
    "promptNative": "Vocês _____ (hacer = fazer) muito barulho. (vosotros)"
  },
  "verbo-26": {
    "promptNative": "Vocês _____ (poder = poder) vir no sábado? (vosotras)"
  },
  "verbo-27": {
    "promptNative": "Vocês _____ (venir = vir) ao parque todos os dias. (vosotros)"
  },
  "verbo-28": {
    "promptNative": "Eu _____ (trabajar = trabalhar) em um escritório."
  },
  "verbo-29": {
    "promptNative": "Você _____ (beber = beber) muita água. (tú)"
  },
  "verbo-30": {
    "promptNative": "Ele _____ (vivir = morar) perto daqui."
  },
  "verbo-31": {
    "promptNative": "Nós _____ (estudiar = estudar) inglês no ensino médio."
  },
  "verbo-32": {
    "promptNative": "Eles _____ (ser = ser) meus primos."
  },
  "verbo-33": {
    "promptNative": "Eu _____ (ir = ir) para o trabalho de metrô."
  },
  "verbo-34": {
    "promptNative": "Você _____ (tener = ter) olhos azuis. (tú)"
  },
  "verbo-35": {
    "promptNative": "Nós _____ (hacer = fazer) as compras aos sábados."
  },
  "verbo-36": {
    "promptNative": "Ela _____ (querer = querer) um copo de suco."
  },
  "verbo-37": {
    "promptNative": "Eu _____ (estar = estar) muito cansado hoje."
  },
  "verbo-38": {
    "promptNative": "Vocês _____ (beber = beber) suco de laranja. (vosotros)"
  },
  "verbo-39": {
    "promptNative": "Vocês _____ (estudiar = estudar) muito para a prova. (vosotras)"
  },
  "verbo-40": {
    "promptNative": "Você _____ (poder = poder) fazer isso sozinho. (tú)"
  },
  "verbo-41": {
    "promptNative": "Nós _____ (ir = ir) à praia no verão."
  },
  "verbo-42": {
    "promptNative": "Ontem vocês _____ (hablar = falar) com o professor. (vosotros)"
  },
  "verbo-43": {
    "promptNative": "Ontem à noite vocês _____ (comer = comer) em um restaurante. (vosotras)"
  },
  "verbo-44": {
    "promptNative": "No ano passado vocês _____ (vivir = morar) em Sevilha. (vosotros)"
  },
  "verbo-45": {
    "promptNative": "Ontem vocês _____ (ir = ir) ao cinema, né? (vosotros)"
  },
  "verbo-46": {
    "promptNative": "Na semana passada vocês _____ (tener = ter) uma prova. (vosotros)"
  },
  "verbo-47": {
    "promptNative": "Quando vocês eram pequenos, vocês _____ (jugar = jogar) na rua. (vosotros)"
  },
  "verbo-48": {
    "promptNative": "Quando vocês eram pequenas, vocês _____ (ir = ir) à escola a pé. (vosotras)"
  },
  "verbo-49": {
    "promptNative": "Antigamente, vocês _____ (comer = comer) mais carne. (vosotros)"
  },
  "verbo-50": {
    "promptNative": "_____ (hablar = falar) mais devagar, por favor. (vosotros command)"
  },
  "verbo-51": {
    "promptNative": "_____ (comer = comer) tudo, está esfriando. (vosotros command)"
  },
  "verbo-52": {
    "promptNative": "_____ (escuchar = escutar) com atenção. (vosotros command)"
  },
  "verbo-53": {
    "promptNative": "Amanhã vocês vão _____ (ir = ir) visitar o museu. (vosotros)"
  },
  "verbo-54": {
    "promptNative": "Ontem eu _____ (comprar = comprar) um celular novo."
  },
  "verbo-55": {
    "promptNative": "Ontem à noite ela _____ (hacer = fazer) o jantar."
  },
  "verbo-56": {
    "promptNative": "No sábado nós _____ (ir = ir) para a montanha."
  },
  "verbo-57": {
    "promptNative": "Você _____ (tener = ter) muita sorte ontem. (tú)"
  },
  "verbo-58": {
    "promptNative": "Quando eu era menina, eu _____ (vivir = morar) em um vilarejo."
  },
  "verbo-59": {
    "promptNative": "Antigamente, nós _____ (jugar = jogar) futebol todas as tardes."
  },
  "verbo-60": {
    "promptNative": "Quando criança, você _____ (ser = ser) muito levado. (tú)"
  },
  "verbo-61": {
    "promptNative": "Amanhã eu vou _____ (ir = ir) estudar na biblioteca."
  },
  "verbo-62": {
    "promptNative": "Neste fim de semana nós vamos _____ (ir = ir) fazer um passeio de um dia."
  },
  "verbo-63": {
    "promptNative": "_____ (esperar = esperar) aqui um momento. (vosotros command)"
  },
  "verbo-64": {
    "promptNative": "_____ (mirar = olhar) para isto, é incrível. (vosotros command)"
  },
  "verbo-65": {
    "promptNative": "Eles _____ (ir = ir) à festa na sexta-feira passada."
  },
  "verbo-66": {
    "promptNative": "Vocês já _____ (terminar = terminar) a lição de casa. (vosotros)"
  },
  "verbo-67": {
    "promptNative": "Hoje de manhã vocês _____ (desayunar = tomar café da manhã) bem cedo. (vosotros)"
  },
  "verbo-68": {
    "promptNative": "Hoje vocês _____ (ver = ver) um ótimo filme. (vosotras)"
  },
  "verbo-69": {
    "promptNative": "Esta semana vocês _____ (hacer = fazer) muito exercício. (vosotros)"
  },
  "verbo-70": {
    "promptNative": "Hoje de manhã eu _____ (tomar = tomar) café com torradas."
  },
  "verbo-71": {
    "promptNative": "Hoje nós _____ (ir = ir) ao médico."
  },
  "verbo-72": {
    "promptNative": "Hoje à tarde ela _____ (volver = voltar) do trabalho bem cedo."
  },
  "verbo-73": {
    "promptNative": "Este ano eu _____ (viajar = viajar) para três países."
  },
  "verbo-74": {
    "promptNative": "Vocês _____ (poner = pôr) a mesa muito bem hoje. (vosotros)"
  },
  "verbo-75": {
    "promptNative": "Vocês já _____ (escribir = escrever) a carta? (vosotros)"
  },
  "verbo-76": {
    "promptNative": "Vocês ainda não _____ (llegar = chegar) a um acordo. (vosotros)"
  },
  "verbo-77": {
    "promptNative": "Não _____ (gritar = gritar) tanto, por favor. (vosotros negative command)"
  },
  "verbo-78": {
    "promptNative": "Não _____ (tocar = tocar) em nada no museu. (vosotros negative command)"
  },
  "verbo-79": {
    "promptNative": "_____ (sentarse = sentar-se), por favor. (vosotros command)"
  },
  "verbo-80": {
    "promptNative": "Este mês nós _____ (comprar = comprar) um carro novo."
  },
  "verbo-81": {
    "promptNative": "Hoje você _____ (romper = quebrar) o celular de novo. (tú)"
  },
  "verbo-82": {
    "promptNative": "Hoje de manhã eles _____ (decir = dizer) a verdade."
  },
  "verbo-83": {
    "promptNative": "Você já _____ (estar = estar) na Galícia alguma vez? (tú)"
  },
  "verbo-84": {
    "promptNative": "Neste verão eu _____ (leer = ler) cinco livros."
  },
  "verbo-85": {
    "promptNative": "Hoje vocês _____ (abrir = abrir) a loja tarde. (vosotros)"
  },
  "verbo-86": {
    "promptNative": "Vocês nunca _____ (venir = vir) nos visitar. (vosotros)"
  },
  "verbo-87": {
    "promptNative": "Hoje de manhã nós _____ (levantarse = levantar-se) supertarde."
  },
  "verbo-88": {
    "promptNative": "_____ (callarse = calar-se) por um momento, por favor. (vosotros command)"
  },
  "verbo-89": {
    "promptNative": "Este ano vocês _____ (aprender = aprender) muito espanhol. (vosotras)"
  },
  "verbo-90": {
    "promptNative": "Eu quero que vocês _____ (venir = vir) à minha casa no domingo. (vosotros)"
  },
  "verbo-91": {
    "promptNative": "Espero que vocês _____ (traer = trazer) o notebook amanhã. (vosotros)"
  },
  "verbo-92": {
    "promptNative": "É importante que vocês _____ (hablar = falar) com o chefe hoje. (vosotros)"
  },
  "verbo-93": {
    "promptNative": "Para que vocês _____ (llegar = chegar) na hora, saiam agora. (vosotros)"
  },
  "verbo-94": {
    "promptNative": "Eu não acho que vocês _____ (tener = ter razão) sobre isso. (vosotros)"
  },
  "verbo-95": {
    "promptNative": "Espero que vocês _____ (poder = poder) ficar mais um pouco. (vosotros)"
  },
  "verbo-96": {
    "promptNative": "Quando vocês _____ (salir = sair) do trabalho, me liguem. (vosotros)"
  },
  "verbo-97": {
    "promptNative": "É importante que você _____ (conducir = dirigir) com cuidado nesta neblina. (tú)"
  },
  "verbo-98": {
    "promptNative": "Eu não acho que ela _____ (saber = saber) a resposta ainda. (ella)"
  },
  "verbo-99": {
    "promptNative": "Para que eu _____ (entender = entender) o problema, me explique devagar. (yo)"
  },
  "verbo-100": {
    "promptNative": "Espero que nós _____ (conseguir = conseguir) os ingressos para o show. (nosotros)"
  },
  "verbo-101": {
    "promptNative": "Eu prefiro que vocês _____ (elegir = escolher) o restaurante desta vez. (vosotros)"
  },
  "verbo-102": {
    "promptNative": "É melhor que vocês _____ (coger = pegar) o metrô; tem um engarrafamento. (vosotros)"
  },
  "verbo-103": {
    "promptNative": "Assim que vocês _____ (llegar = chegar) à estação, me mandem mensagem. (vosotros)"
  },
  "verbo-104": {
    "promptNative": "Não _____ (hacer = fazer) tanto barulho; a criança está dormindo. (vosotros)"
  },
  "verbo-105": {
    "promptNative": "Não _____ (preocuparse = se preocupar); vai dar tudo certo. (vosotros)"
  },
  "verbo-106": {
    "promptNative": "Não _____ (decir = dizer) nada para a sua mãe ainda. (vosotros)"
  },
  "verbo-107": {
    "promptNative": "Não _____ (poner = pôr) os pés no sofá. (vosotros)"
  },
  "verbo-108": {
    "promptNative": "Não _____ (tocar = tocar) em nada enquanto o professor não estiver aqui. (vosotros)"
  },
  "verbo-109": {
    "promptNative": "Antes de vocês _____ (marcharse = ir embora), paguem a conta. (vosotros)"
  },
  "verbo-110": {
    "promptNative": "É uma pena que vocês não _____ (querer = querer) vir ao jantar. (vosotros)"
  },
  "verbo-111": {
    "promptNative": "Se vocês _____ (tener = ter) mais tempo, viajariam mais. (vosotros)"
  },
  "verbo-112": {
    "promptNative": "Se vocês _____ (venir = vir) comigo, eu mostraria o vilarejo para vocês. (vosotros)"
  },
  "verbo-113": {
    "promptNative": "Se você _____ (querer = querer), poderíamos ir ao cinema hoje à noite. (tú)"
  },
  "verbo-114": {
    "promptNative": "Se eu _____ (ser = ser) você, não diria nada. (yo)"
  },
  "verbo-115": {
    "promptNative": "Se vocês estudassem mais, vocês _____ (aprobar = passar) sem problemas. (vosotros)"
  },
  "verbo-116": {
    "promptNative": "Se nós ganhássemos na loteria, nós _____ (comprar = comprar) um apartamento em Madrid. (nosotros)"
  },
  "verbo-117": {
    "promptNative": "Se chovesse amanhã, eu não _____ (salir = sair) de casa. (yo)"
  },
  "verbo-118": {
    "promptNative": "Se vocês tivessem mais paciência, vocês _____ (conseguir = conseguir) melhores resultados. (vosotros)"
  },
  "verbo-119": {
    "promptNative": "Ela falou como se _____ (conocer = conhecer) o segredo. (ella)"
  },
  "verbo-120": {
    "promptNative": "Eles me trataram como se eu não _____ (existir = existir). (yo)"
  },
  "verbo-121": {
    "promptNative": "Eu queria que vocês _____ (estar = estar) aqui comigo agora. (vosotros)"
  },
  "verbo-122": {
    "promptNative": "Eu gostaria que vocês me _____ (escuchar = escutar) com atenção. (vosotros)"
  },
  "verbo-123": {
    "promptNative": "Eles pediram que vocês _____ (traer = trazer) os documentos assinados. (vosotros)"
  },
  "verbo-124": {
    "promptNative": "Quando vocês voltarem, nós já _____ (recoger = arrumar) a casa toda. (nosotros)"
  },
  "verbo-125": {
    "promptNative": "Eu suponho que vocês provavelmente já _____ (ver = ver) as notícias, né? (vosotros)"
  },
  "verbo-126": {
    "promptNative": "É possível que eles já _____ (irse = ir embora) quando chegarmos. (ellos)"
  },
  "verbo-127": {
    "promptNative": "É uma pena que vocês não _____ (poder = poder) vir ao casamento. (vosotros)"
  },
  "verbo-128": {
    "promptNative": "_____ (pasar = passar) o que acontecer, mantenha a calma."
  },
  "verbo-129": {
    "promptNative": "_____ (ser = ser) como for, nós vamos terminar isto hoje."
  },
  "verbo-130": {
    "promptNative": "Custe o que _____ (costar = custar), eu vou conseguir aquele emprego."
  },
  "verbo-131": {
    "promptNative": "Por mais que vocês _____ (correr = correr), não vão chegar na hora. (vosotros)"
  },
  "verbo-132": {
    "promptNative": "Se vocês _____ (saber = saber) a verdade, teriam agido de outra forma. (vosotros)"
  },
  "verbo-133": {
    "promptNative": "Se vocês tivessem me contado antes, eu _____ (ayudar = ajudar) vocês. (yo)"
  },
  "verbo-134": {
    "promptNative": "Se vocês tivessem chegado na hora, vocês _____ (ver = ver) o começo do filme. (vosotros)"
  },
  "verbo-135": {
    "promptNative": "Se eles _____ (venir = vir), a festa teria sido muito melhor. (ellos)"
  },
  "verbo-136": {
    "promptNative": "Eu queria que vocês tivessem me _____ (contar = contar) antes de assinar o contrato. (vosotros)"
  },
  "verbo-137": {
    "promptNative": "Se vocês soubessem, não _____ (venir = vir) até aqui. (vosotros)"
  },
  "verbo-138": {
    "promptNative": "Se eu estivesse lá, eu _____ (avisar = avisar) vocês na hora. (yo)"
  },
  "verbo-139": {
    "promptNative": "Digam o que _____ (decir = dizer), eu sei a verdade. (ellos)"
  },
  "verbo-140": {
    "promptNative": "Façam o que _____ (hacer = fazer), avisem a gente primeiro. (vosotros)"
  },
  "verbo-141": {
    "promptNative": "Nunca _____ (rendirse = desistir), aconteça o que acontecer. (vosotros)"
  },
  "verbo-142": {
    "promptNative": "Se eu _____ (tener = ter) mais dinheiro, compraria aquele carro."
  },
  "verbo-143": {
    "promptNative": "Se vocês tivessem nos avisado, nós não _____ (cometer = cometer) aquele erro. (nosotros)"
  },
  "verbo-144": {
    "promptNative": "Vocês olham para isso como se nunca _____ (ver = ver) o mar. (vosotros)"
  },
  "verbo-145": {
    "promptNative": "Mesmo que vocês tivessem me pedido, eu não _____ (hacer = fazer) isso. (yo)"
  },
  "verbo-146": {
    "promptNative": "Se não fosse por vocês, eu não _____ (conseguir = conseguir) isso. (yo)"
  },
  "verbo-147": {
    "promptNative": "Como se vocês _____ (ser = ser) milionários, com tanto que gastam. (vosotros)"
  },
  "verbo-148": {
    "promptNative": "Por mais que vocês _____ (negar = negar), a verdade viria à tona. (vosotros)"
  },
  "verbo-149": {
    "promptNative": "Seja quem _____ (ser = ser), que espere lá fora. (él)"
  },
  "verbo-150": {
    "promptNative": "Estou surpreso que vocês já _____ (volver = voltar) das férias. (vosotros)"
  },
  "verbo-151": {
    "promptNative": "Me surpreende que vocês não _____ (darse cuenta = perceber) antes. (vosotros)"
  },
  "verbo-152": {
    "promptNative": "Eu _____ (hablar = falar). (pres)"
  },
  "verbo-153": {
    "promptNative": "Nós _____ (hablar = falar). (pres)"
  },
  "verbo-154": {
    "promptNative": "Eu _____ (trabajar = trabalhar). (pres)"
  },
  "verbo-155": {
    "promptNative": "Nós _____ (trabajar = trabalhar). (pres)"
  },
  "verbo-156": {
    "promptNative": "Eu _____ (estudiar = estudar). (pres)"
  },
  "verbo-157": {
    "promptNative": "Nós _____ (estudiar = estudar). (pres)"
  },
  "verbo-158": {
    "promptNative": "Eu _____ (comprar = comprar). (pres)"
  },
  "verbo-159": {
    "promptNative": "Nós _____ (comprar = comprar). (pres)"
  },
  "verbo-160": {
    "promptNative": "Eu _____ (cocinar = cozinhar). (pres)"
  },
  "verbo-161": {
    "promptNative": "Nós _____ (cocinar = cozinhar). (pres)"
  },
  "verbo-162": {
    "promptNative": "Eu _____ (cantar = cantar). (pres)"
  },
  "verbo-163": {
    "promptNative": "Nós _____ (cantar = cantar). (pres)"
  },
  "verbo-164": {
    "promptNative": "Eu _____ (bailar = dançar). (pres)"
  },
  "verbo-165": {
    "promptNative": "Nós _____ (bailar = dançar). (pres)"
  },
  "verbo-166": {
    "promptNative": "Eu _____ (tomar = tomar). (pres)"
  },
  "verbo-167": {
    "promptNative": "Nós _____ (tomar = tomar). (pres)"
  },
  "verbo-168": {
    "promptNative": "Eu _____ (llegar = chegar). (pres)"
  },
  "verbo-169": {
    "promptNative": "Nós _____ (llegar = chegar). (pres)"
  },
  "verbo-170": {
    "promptNative": "Eu _____ (escuchar = escutar). (pres)"
  },
  "verbo-171": {
    "promptNative": "Nós _____ (escuchar = escutar). (pres)"
  },
  "verbo-172": {
    "promptNative": "Eu _____ (mirar = olhar). (pres)"
  },
  "verbo-173": {
    "promptNative": "Nós _____ (mirar = olhar). (pres)"
  },
  "verbo-174": {
    "promptNative": "Eu _____ (esperar = esperar). (pres)"
  },
  "verbo-175": {
    "promptNative": "Nós _____ (esperar = esperar). (pres)"
  },
  "verbo-176": {
    "promptNative": "Eu _____ (aparcar = estacionar (Espanha)). (pres)"
  },
  "verbo-177": {
    "promptNative": "Nós _____ (aparcar = estacionar (Espanha)). (pres)"
  },
  "verbo-178": {
    "promptNative": "Eu _____ (firmar = assinar). (pres)"
  },
  "verbo-179": {
    "promptNative": "Nós _____ (firmar = assinar). (pres)"
  },
  "verbo-180": {
    "promptNative": "Eu _____ (comer = comer). (pres)"
  },
  "verbo-181": {
    "promptNative": "Nós _____ (comer = comer). (pres)"
  },
  "verbo-182": {
    "promptNative": "Eu _____ (beber = beber). (pres)"
  },
  "verbo-183": {
    "promptNative": "Nós _____ (beber = beber). (pres)"
  },
  "verbo-184": {
    "promptNative": "Eu _____ (correr = correr). (pres)"
  },
  "verbo-185": {
    "promptNative": "Nós _____ (correr = correr). (pres)"
  },
  "verbo-186": {
    "promptNative": "Eu _____ (leer = ler). (pres)"
  },
  "verbo-187": {
    "promptNative": "Nós _____ (leer = ler). (pres)"
  },
  "verbo-188": {
    "promptNative": "Eu _____ (aprender = aprender). (pres)"
  },
  "verbo-189": {
    "promptNative": "Nós _____ (aprender = aprender). (pres)"
  },
  "verbo-190": {
    "promptNative": "Eu _____ (comprender = compreender). (pres)"
  },
  "verbo-191": {
    "promptNative": "Nós _____ (comprender = compreender). (pres)"
  },
  "verbo-192": {
    "promptNative": "Eu _____ (coger = pegar (Espanha)). (pres)"
  },
  "verbo-193": {
    "promptNative": "Nós _____ (coger = pegar (Espanha)). (pres)"
  },
  "verbo-194": {
    "promptNative": "Eu _____ (vender = vender). (pres)"
  },
  "verbo-195": {
    "promptNative": "Nós _____ (vender = vender). (pres)"
  },
  "verbo-196": {
    "promptNative": "Eu _____ (vivir = morar). (pres)"
  },
  "verbo-197": {
    "promptNative": "Nós _____ (vivir = morar). (pres)"
  },
  "verbo-198": {
    "promptNative": "Eu _____ (escribir = escrever). (pres)"
  },
  "verbo-199": {
    "promptNative": "Nós _____ (escribir = escrever). (pres)"
  },
  "verbo-200": {
    "promptNative": "Eu _____ (abrir = abrir). (pres)"
  },
  "verbo-201": {
    "promptNative": "Nós _____ (abrir = abrir). (pres)"
  },
  "verbo-202": {
    "promptNative": "Eu _____ (recibir = receber). (pres)"
  },
  "verbo-203": {
    "promptNative": "Nós _____ (recibir = receber). (pres)"
  },
  "verbo-204": {
    "promptNative": "Eu _____ (subir = subir). (pres)"
  },
  "verbo-205": {
    "promptNative": "Nós _____ (subir = subir). (pres)"
  },
  "verbo-206": {
    "promptNative": "Eu _____ (decidir = decidir). (pres)"
  },
  "verbo-207": {
    "promptNative": "Ontem eu _____ (hablar = falar). (pret)"
  },
  "verbo-208": {
    "promptNative": "Antigamente você (tú) _____ (hablar = falar). (impf)"
  },
  "verbo-209": {
    "promptNative": "Ontem vocês (vosotros) _____ (trabajar = trabalhar). (pret)"
  },
  "verbo-210": {
    "promptNative": "Ontem você (tú) _____ (estudiar = estudar). (pret)"
  },
  "verbo-211": {
    "promptNative": "Antigamente vocês (vosotros) _____ (estudiar = estudar). (impf)"
  },
  "verbo-212": {
    "promptNative": "Ontem eles _____ (comprar = comprar). (pret)"
  },
  "verbo-213": {
    "promptNative": "Ontem ele/ela _____ (cocinar = cozinhar). (pret)"
  },
  "verbo-214": {
    "promptNative": "Antigamente eles _____ (cocinar = cozinhar). (impf)"
  },
  "verbo-215": {
    "promptNative": "Antigamente eu _____ (cantar = cantar). (impf)"
  },
  "verbo-216": {
    "promptNative": "Ontem nós _____ (bailar = dançar). (pret)"
  },
  "verbo-217": {
    "promptNative": "Ontem eu _____ (tomar = tomar). (pret)"
  },
  "verbo-218": {
    "promptNative": "Antigamente você (tú) _____ (tomar = tomar). (impf)"
  },
  "verbo-219": {
    "promptNative": "Ontem vocês (vosotros) _____ (llegar = chegar). (pret)"
  },
  "verbo-220": {
    "promptNative": "Ontem você (tú) _____ (escuchar = escutar). (pret)"
  },
  "verbo-221": {
    "promptNative": "Antigamente vocês (vosotros) _____ (escuchar = escutar). (impf)"
  },
  "verbo-222": {
    "promptNative": "Ontem eles _____ (mirar = olhar). (pret)"
  },
  "verbo-223": {
    "promptNative": "Ontem ele/ela _____ (esperar = esperar). (pret)"
  },
  "verbo-224": {
    "promptNative": "Antigamente eles _____ (esperar = esperar). (impf)"
  },
  "verbo-225": {
    "promptNative": "Antigamente eu _____ (aparcar = estacionar (Espanha)). (impf)"
  },
  "verbo-226": {
    "promptNative": "Ontem nós _____ (firmar = assinar). (pret)"
  },
  "verbo-227": {
    "promptNative": "Ontem eu _____ (comer = comer). (pret)"
  },
  "verbo-228": {
    "promptNative": "Antigamente você (tú) _____ (comer = comer). (impf)"
  },
  "verbo-229": {
    "promptNative": "Ontem vocês (vosotros) _____ (beber = beber). (pret)"
  },
  "verbo-230": {
    "promptNative": "Ontem você (tú) _____ (correr = correr). (pret)"
  },
  "verbo-231": {
    "promptNative": "Antigamente vocês (vosotros) _____ (correr = correr). (impf)"
  },
  "verbo-232": {
    "promptNative": "Ontem eles _____ (leer = ler). (pret)"
  },
  "verbo-233": {
    "promptNative": "Ontem ele/ela _____ (aprender = aprender). (pret)"
  },
  "verbo-234": {
    "promptNative": "Antigamente eles _____ (aprender = aprender). (impf)"
  },
  "verbo-235": {
    "promptNative": "Antigamente eu _____ (comprender = compreender). (impf)"
  },
  "verbo-236": {
    "promptNative": "Ontem nós _____ (coger = pegar (Espanha)). (pret)"
  },
  "verbo-237": {
    "promptNative": "Ontem eu _____ (vender = vender). (pret)"
  },
  "verbo-238": {
    "promptNative": "Antigamente você (tú) _____ (vender = vender). (impf)"
  },
  "verbo-239": {
    "promptNative": "Ontem vocês (vosotros) _____ (vivir = morar). (pret)"
  },
  "verbo-240": {
    "promptNative": "Ontem você (tú) _____ (escribir = escrever). (pret)"
  },
  "verbo-241": {
    "promptNative": "Antigamente vocês (vosotros) _____ (escribir = escrever). (impf)"
  },
  "verbo-242": {
    "promptNative": "Ontem eles _____ (abrir = abrir). (pret)"
  },
  "verbo-243": {
    "promptNative": "Ontem ele/ela _____ (recibir = receber). (pret)"
  },
  "verbo-244": {
    "promptNative": "Antigamente eles _____ (recibir = receber). (impf)"
  },
  "verbo-245": {
    "promptNative": "Antigamente eu _____ (subir = subir). (impf)"
  },
  "verbo-246": {
    "promptNative": "Ontem nós _____ (decidir = decidir). (pret)"
  },
  "verbo-247": {
    "promptNative": "Eu _____ (pensar = pensar). (pres)"
  },
  "verbo-248": {
    "promptNative": "Antigamente você (tú) _____ (pensar = pensar). (impf)"
  },
  "verbo-249": {
    "promptNative": "Vocês (vosotros) _____ (poder = poder). (pres)"
  },
  "verbo-250": {
    "promptNative": "Você (tú) _____ (querer = querer). (pres)"
  },
  "verbo-251": {
    "promptNative": "Antigamente vocês (vosotros) _____ (querer = querer). (impf)"
  },
  "verbo-252": {
    "promptNative": "Eles _____ (volver = voltar). (pres)"
  },
  "verbo-253": {
    "promptNative": "Ele/ela _____ (dormir = dormir). (pres)"
  },
  "verbo-254": {
    "promptNative": "Antigamente eles _____ (dormir = dormir). (impf)"
  },
  "verbo-255": {
    "promptNative": "Antigamente eu _____ (pedir = pedir). (impf)"
  },
  "verbo-256": {
    "promptNative": "Nós _____ (entender = entender). (pres)"
  },
  "verbo-257": {
    "promptNative": "Eu _____ (jugar = jogar). (pres)"
  },
  "verbo-258": {
    "promptNative": "Antigamente você (tú) _____ (jugar = jogar). (impf)"
  },
  "verbo-259": {
    "promptNative": "Vocês (vosotros) _____ (empezar = começar). (pres)"
  },
  "verbo-260": {
    "promptNative": "Você (tú) _____ (cerrar = fechar). (pres)"
  },
  "verbo-261": {
    "promptNative": "Antigamente vocês (vosotros) _____ (cerrar = fechar). (impf)"
  },
  "verbo-262": {
    "promptNative": "Eles _____ (ser = ser). (pres)"
  },
  "verbo-263": {
    "promptNative": "Ele/ela _____ (estar = estar). (pres)"
  },
  "verbo-264": {
    "promptNative": "Antigamente eles _____ (estar = estar). (impf)"
  },
  "verbo-265": {
    "promptNative": "Antigamente eu _____ (ir = ir). (impf)"
  },
  "verbo-266": {
    "promptNative": "Nós _____ (tener = ter). (pres)"
  },
  "verbo-267": {
    "promptNative": "Eu _____ (hacer = fazer). (pres)"
  },
  "verbo-268": {
    "promptNative": "Antigamente você (tú) _____ (hacer = fazer). (impf)"
  },
  "verbo-269": {
    "promptNative": "Vocês (vosotros) _____ (decir = dizer). (pres)"
  },
  "verbo-270": {
    "promptNative": "Você (tú) _____ (venir = vir). (pres)"
  },
  "verbo-271": {
    "promptNative": "Antigamente vocês (vosotros) _____ (venir = vir). (impf)"
  },
  "verbo-272": {
    "promptNative": "Eles _____ (poner = pôr). (pres)"
  },
  "verbo-273": {
    "promptNative": "Ele/ela _____ (salir = sair). (pres)"
  },
  "verbo-274": {
    "promptNative": "Antigamente eles _____ (salir = sair). (impf)"
  },
  "verbo-275": {
    "promptNative": "Antigamente eu _____ (dar = dar). (impf)"
  },
  "verbo-276": {
    "promptNative": "Nós _____ (ver = ver). (pres)"
  },
  "verbo-277": {
    "promptNative": "Hoje eu _____ (hablar = falar). (perf)"
  },
  "verbo-278": {
    "promptNative": "_____ (hablar = falar) más despacio. (vosotros command)"
  },
  "verbo-279": {
    "promptNative": "Amanhã eles _____ (trabajar = trabalhar). (fut)"
  },
  "verbo-280": {
    "promptNative": "Amanhã nós _____ (estudiar = estudar). (fut)"
  },
  "verbo-281": {
    "promptNative": "Amanhã eu _____ (comprar = comprar). (fut)"
  },
  "verbo-282": {
    "promptNative": "Hoje vocês (vosotros) _____ (cocinar = cozinhar). (perf)"
  },
  "verbo-283": {
    "promptNative": "Hoje ele/ela _____ (cantar = cantar). (perf)"
  },
  "verbo-284": {
    "promptNative": "Hoje eu _____ (bailar = dançar). (perf)"
  },
  "verbo-285": {
    "promptNative": "_____ (bailar = dançar) con nosotros. (vosotros command)"
  },
  "verbo-286": {
    "promptNative": "Amanhã eles _____ (tomar = tomar). (fut)"
  },
  "verbo-287": {
    "promptNative": "Amanhã nós _____ (llegar = chegar). (fut)"
  },
  "verbo-288": {
    "promptNative": "Amanhã eu _____ (escuchar = escutar). (fut)"
  },
  "verbo-289": {
    "promptNative": "Hoje vocês (vosotros) _____ (mirar = olhar). (perf)"
  },
  "verbo-290": {
    "promptNative": "Hoje ele/ela _____ (esperar = esperar). (perf)"
  },
  "verbo-291": {
    "promptNative": "Hoje eu _____ (aparcar = estacionar (Espanha)). (perf)"
  },
  "verbo-292": {
    "promptNative": "_____ (aparcar = estacionar (Espanha)) el coche ahí. (vosotros command)"
  },
  "verbo-293": {
    "promptNative": "Amanhã eles _____ (firmar = assinar). (fut)"
  },
  "verbo-294": {
    "promptNative": "Amanhã nós _____ (comer = comer). (fut)"
  },
  "verbo-295": {
    "promptNative": "Amanhã eu _____ (beber = beber). (fut)"
  },
  "verbo-296": {
    "promptNative": "Hoje vocês (vosotros) _____ (correr = correr). (perf)"
  },
  "verbo-297": {
    "promptNative": "Hoje ele/ela _____ (leer = ler). (perf)"
  },
  "verbo-298": {
    "promptNative": "Hoje eu _____ (aprender = aprender). (perf)"
  },
  "verbo-299": {
    "promptNative": "_____ (aprender = aprender) de los errores. (vosotros command)"
  },
  "verbo-300": {
    "promptNative": "Amanhã eles _____ (comprender = compreender). (fut)"
  },
  "verbo-301": {
    "promptNative": "Amanhã nós _____ (coger = pegar (Espanha)). (fut)"
  },
  "verbo-302": {
    "promptNative": "Amanhã eu _____ (vender = vender). (fut)"
  },
  "verbo-303": {
    "promptNative": "Hoje vocês (vosotros) _____ (vivir = morar). (perf)"
  },
  "verbo-304": {
    "promptNative": "Hoje ele/ela _____ (escribir = escrever). (perf)"
  },
  "verbo-305": {
    "promptNative": "Hoje eu _____ (abrir = abrir). (perf)"
  },
  "verbo-306": {
    "promptNative": "_____ (abrir = abrir) la ventana. (vosotros command)"
  },
  "verbo-307": {
    "promptNative": "Amanhã eles _____ (recibir = receber). (fut)"
  },
  "verbo-308": {
    "promptNative": "Amanhã nós _____ (subir = subir). (fut)"
  },
  "verbo-309": {
    "promptNative": "Amanhã eu _____ (decidir = decidir). (fut)"
  },
  "verbo-310": {
    "promptNative": "Ontem vocês (vosotros) _____ (pensar = pensar). (pret)"
  },
  "verbo-311": {
    "promptNative": "Amanhã eles _____ (pensar = pensar). (fut)"
  },
  "verbo-312": {
    "promptNative": "Hoje ele/ela _____ (poder = poder). (perf)"
  },
  "verbo-313": {
    "promptNative": "Ontem nós _____ (querer = querer). (pret)"
  },
  "verbo-314": {
    "promptNative": "Amanhã vocês (vosotros) _____ (querer = querer). (fut)"
  },
  "verbo-315": {
    "promptNative": "Hoje vocês (vosotros) _____ (volver = voltar). (perf)"
  },
  "verbo-316": {
    "promptNative": "Ontem ele/ela _____ (dormir = dormir). (pret)"
  },
  "verbo-317": {
    "promptNative": "Amanhã nós _____ (dormir = dormir). (fut)"
  },
  "verbo-318": {
    "promptNative": "Hoje eu _____ (pedir = pedir). (perf)"
  },
  "verbo-319": {
    "promptNative": "_____ (pedir = pedir) la cuenta. (vosotros command)"
  },
  "verbo-320": {
    "promptNative": "Hoje vocês (vosotros) _____ (entender = entender). (perf)"
  },
  "verbo-321": {
    "promptNative": "Ontem ele/ela _____ (jugar = jogar). (pret)"
  },
  "verbo-322": {
    "promptNative": "Amanhã nós _____ (jugar = jogar). (fut)"
  },
  "verbo-323": {
    "promptNative": "Hoje eu _____ (empezar = começar). (perf)"
  },
  "verbo-324": {
    "promptNative": "_____ (empezar = começar) ya. (vosotros command)"
  },
  "verbo-325": {
    "promptNative": "Hoje vocês (vosotros) _____ (cerrar = fechar). (perf)"
  },
  "verbo-326": {
    "promptNative": "Ontem ele/ela _____ (ser = ser). (pret)"
  },
  "verbo-327": {
    "promptNative": "Amanhã nós _____ (ser = ser). (fut)"
  },
  "verbo-328": {
    "promptNative": "Hoje eu _____ (estar = estar). (perf)"
  },
  "verbo-329": {
    "promptNative": "_____ (estar = estar) atentos. (vosotros command)"
  },
  "verbo-330": {
    "promptNative": "Hoje eles _____ (ir = ir). (perf)"
  },
  "verbo-331": {
    "promptNative": "Ontem nós _____ (tener = ter). (pret)"
  },
  "verbo-332": {
    "promptNative": "Amanhã vocês (vosotros) _____ (tener = ter). (fut)"
  },
  "verbo-333": {
    "promptNative": "Hoje você (tú) _____ (hacer = fazer). (perf)"
  },
  "verbo-334": {
    "promptNative": "_____ (hacer = fazer) los deberes. (usted command)"
  },
  "verbo-335": {
    "promptNative": "Hoje eles _____ (decir = dizer). (perf)"
  },
  "verbo-336": {
    "promptNative": "Ontem nós _____ (venir = vir). (pret)"
  },
  "verbo-337": {
    "promptNative": "Amanhã vocês (vosotros) _____ (venir = vir). (fut)"
  },
  "verbo-338": {
    "promptNative": "Hoje você (tú) _____ (poner = pôr). (perf)"
  },
  "verbo-339": {
    "promptNative": "_____ (poner = pôr) la mesa. (usted command)"
  },
  "verbo-340": {
    "promptNative": "Hoje eles _____ (salir = sair). (perf)"
  },
  "verbo-341": {
    "promptNative": "Ontem nós _____ (dar = dar). (pret)"
  },
  "verbo-342": {
    "promptNative": "Amanhã vocês (vosotros) _____ (dar = dar). (fut)"
  },
  "verbo-343": {
    "promptNative": "Hoje você (tú) _____ (ver = ver). (perf)"
  },
  "verbo-344": {
    "promptNative": "_____ (ver = ver) el partido. (usted command)"
  },
  "verbo-345": {
    "promptNative": "Hoje eles _____ (saber = saber). (perf)"
  },
  "verbo-346": {
    "promptNative": "Hoje eu _____ (conocer = conhecer (pessoas)). (perf)"
  },
  "verbo-347": {
    "promptNative": "_____ (conocer = conhecer (pessoas)) a mis padres. (vosotros command)"
  },
  "verbo-348": {
    "promptNative": "Hoje vocês (vosotros) _____ (conducir = dirigir (Espanha)). (perf)"
  },
  "verbo-349": {
    "promptNative": "Ontem ele/ela _____ (traer = trazer). (pret)"
  },
  "verbo-350": {
    "promptNative": "Amanhã nós _____ (traer = trazer). (fut)"
  },
  "verbo-351": {
    "promptNative": "Hoje eu _____ (oír = ouvir). (perf)"
  },
  "verbo-352": {
    "promptNative": "Com mais tempo, eu _____ (hablar = falar). (cond)"
  },
  "verbo-353": {
    "promptNative": "Espero que vocês (vosotros) _____ (hablar = falar). (subjPres)"
  },
  "verbo-354": {
    "promptNative": "Com mais tempo, eles _____ (trabajar = trabalhar). (cond)"
  },
  "verbo-355": {
    "promptNative": "Não _____ (trabajar = trabalhar) en equipo. (usted command)"
  },
  "verbo-356": {
    "promptNative": "Espero que nós _____ (estudiar = estudar). (subjPres)"
  },
  "verbo-357": {
    "promptNative": "Com mais tempo, vocês (vosotros) _____ (comprar = comprar). (cond)"
  },
  "verbo-358": {
    "promptNative": "Não _____ (comprar = comprar) el pan. (vosotros command)"
  },
  "verbo-359": {
    "promptNative": "Espero que ele/ela _____ (cocinar = cozinhar). (subjPres)"
  },
  "verbo-360": {
    "promptNative": "Com mais tempo, nós _____ (cantar = cantar). (cond)"
  },
  "verbo-361": {
    "promptNative": "Não _____ (cantar = cantar) en voz alta. (tú command)"
  },
  "verbo-362": {
    "promptNative": "Espero que você (tú) _____ (bailar = dançar). (subjPres)"
  },
  "verbo-363": {
    "promptNative": "Com mais tempo, você (tú) _____ (tomar = tomar). (cond)"
  },
  "verbo-364": {
    "promptNative": "Espero que eles _____ (tomar = tomar). (subjPres)"
  },
  "verbo-365": {
    "promptNative": "Espero que eu _____ (llegar = chegar). (subjPres)"
  },
  "verbo-366": {
    "promptNative": "Com mais tempo, eu _____ (escuchar = escutar). (cond)"
  },
  "verbo-367": {
    "promptNative": "Espero que vocês (vosotros) _____ (escuchar = escutar). (subjPres)"
  },
  "verbo-368": {
    "promptNative": "Com mais tempo, eles _____ (mirar = olhar). (cond)"
  },
  "verbo-369": {
    "promptNative": "Não _____ (mirar = olhar) a la pizarra. (usted command)"
  },
  "verbo-370": {
    "promptNative": "Espero que nós _____ (esperar = esperar). (subjPres)"
  },
  "verbo-371": {
    "promptNative": "Com mais tempo, vocês (vosotros) _____ (aparcar = estacionar (Espanha)). (cond)"
  },
  "verbo-372": {
    "promptNative": "Não _____ (aparcar = estacionar (Espanha)) el coche ahí. (vosotros command)"
  },
  "verbo-373": {
    "promptNative": "Espero que ele/ela _____ (firmar = assinar). (subjPres)"
  },
  "verbo-374": {
    "promptNative": "Com mais tempo, nós _____ (comer = comer). (cond)"
  },
  "verbo-375": {
    "promptNative": "Não _____ (comer = comer) más verdura. (tú command)"
  },
  "verbo-376": {
    "promptNative": "Espero que você (tú) _____ (beber = beber). (subjPres)"
  },
  "verbo-377": {
    "promptNative": "Com mais tempo, você (tú) _____ (correr = correr). (cond)"
  },
  "verbo-378": {
    "promptNative": "Espero que eles _____ (correr = correr). (subjPres)"
  },
  "verbo-379": {
    "promptNative": "Espero que eu _____ (leer = ler). (subjPres)"
  },
  "verbo-380": {
    "promptNative": "Com mais tempo, eu _____ (aprender = aprender). (cond)"
  },
  "verbo-381": {
    "promptNative": "Espero que vocês (vosotros) _____ (aprender = aprender). (subjPres)"
  },
  "verbo-382": {
    "promptNative": "Com mais tempo, eles _____ (comprender = compreender). (cond)"
  },
  "verbo-383": {
    "promptNative": "Não _____ (comprender = compreender) la idea. (usted command)"
  },
  "verbo-384": {
    "promptNative": "Espero que nós _____ (coger = pegar (Espanha)). (subjPres)"
  },
  "verbo-385": {
    "promptNative": "Com mais tempo, vocês (vosotros) _____ (vender = vender). (cond)"
  },
  "verbo-386": {
    "promptNative": "Não _____ (vender = vender) el piso. (vosotros command)"
  },
  "verbo-387": {
    "promptNative": "Espero que ele/ela _____ (vivir = morar). (subjPres)"
  },
  "verbo-388": {
    "promptNative": "Com mais tempo, nós _____ (escribir = escrever). (cond)"
  },
  "verbo-389": {
    "promptNative": "Não _____ (escribir = escrever) un correo. (tú command)"
  },
  "verbo-390": {
    "promptNative": "Espero que você (tú) _____ (abrir = abrir). (subjPres)"
  },
  "verbo-391": {
    "promptNative": "Com mais tempo, você (tú) _____ (recibir = receber). (cond)"
  },
  "verbo-392": {
    "promptNative": "Espero que eles _____ (recibir = receber). (subjPres)"
  },
  "verbo-393": {
    "promptNative": "Espero que eu _____ (subir = subir). (subjPres)"
  },
  "verbo-394": {
    "promptNative": "Com mais tempo, eu _____ (decidir = decidir). (cond)"
  },
  "verbo-395": {
    "promptNative": "Espero que vocês (vosotros) _____ (decidir = decidir). (subjPres)"
  },
  "verbo-396": {
    "promptNative": "Com mais tempo, eles _____ (pensar = pensar). (cond)"
  },
  "verbo-397": {
    "promptNative": "Com mais tempo, eu _____ (querer = querer). (cond)"
  },
  "verbo-398": {
    "promptNative": "Com mais tempo, eles _____ (volver = voltar). (cond)"
  },
  "verbo-399": {
    "promptNative": "Não _____ (dormir = dormir) ocho horas. (tú command)"
  },
  "verbo-400": {
    "promptNative": "Não _____ (pedir = pedir) la cuenta. (vosotros command)"
  },
  "verbo-401": {
    "promptNative": "Não _____ (entender = entender) el problema. (usted command)"
  },
  "verbo-402": {
    "promptNative": "Com mais tempo, eu _____ (empezar = começar). (cond)"
  },
  "verbo-403": {
    "promptNative": "Com mais tempo, você (tú) _____ (cerrar = fechar). (cond)"
  },
  "verbo-404": {
    "promptNative": "Com mais tempo, nós _____ (ser = ser). (cond)"
  },
  "verbo-405": {
    "promptNative": "Com mais tempo, vocês (vosotros) _____ (estar = estar). (cond)"
  },
  "verbo-406": {
    "promptNative": "Com mais tempo, eles _____ (ir = ir). (cond)"
  },
  "verbo-407": {
    "promptNative": "Não _____ (tener = ter) cuidado. (tú command)"
  },
  "verbo-408": {
    "promptNative": "Não _____ (hacer = fazer) los deberes. (vosotros command)"
  },
  "verbo-409": {
    "promptNative": "Não _____ (decir = dizer) la verdad. (usted command)"
  },
  "verbo-410": {
    "promptNative": "Com mais tempo, eu _____ (poner = pôr). (cond)"
  },
  "verbo-411": {
    "promptNative": "Com mais tempo, você (tú) _____ (salir = sair). (cond)"
  },
  "verbo-412": {
    "promptNative": "Com mais tempo, nós _____ (dar = dar). (cond)"
  },
  "verbo-413": {
    "promptNative": "Com mais tempo, vocês (vosotros) _____ (ver = ver). (cond)"
  },
  "verbo-414": {
    "promptNative": "Com mais tempo, eles _____ (saber = saber). (cond)"
  },
  "verbo-415": {
    "promptNative": "Com mais tempo, eu _____ (conducir = dirigir (Espanha)). (cond)"
  },
  "verbo-416": {
    "promptNative": "Com mais tempo, você (tú) _____ (traer = trazer). (cond)"
  },
  "verbo-417": {
    "promptNative": "Tomara que eu _____ (hablar = falar). (subjImpf)"
  },
  "verbo-418": {
    "promptNative": "Tomara que eu _____ (trabajar = trabalhar). (subjImpf)"
  },
  "verbo-419": {
    "promptNative": "Tomara que eu _____ (estudiar = estudar). (subjImpf)"
  },
  "verbo-420": {
    "promptNative": "Tomara que eu _____ (comprar = comprar). (subjImpf)"
  },
  "verbo-421": {
    "promptNative": "Tomara que eu _____ (cocinar = cozinhar). (subjImpf)"
  },
  "verbo-422": {
    "promptNative": "Tomara que eu _____ (cantar = cantar). (subjImpf)"
  },
  "verbo-423": {
    "promptNative": "Tomara que eu _____ (bailar = dançar). (subjImpf)"
  },
  "verbo-424": {
    "promptNative": "Tomara que eu _____ (tomar = tomar). (subjImpf)"
  },
  "verbo-425": {
    "promptNative": "Tomara que eu _____ (llegar = chegar). (subjImpf)"
  },
  "verbo-426": {
    "promptNative": "Tomara que eu _____ (escuchar = escutar). (subjImpf)"
  },
  "verbo-427": {
    "promptNative": "Tomara que eu _____ (mirar = olhar). (subjImpf)"
  },
  "verbo-428": {
    "promptNative": "Tomara que eu _____ (esperar = esperar). (subjImpf)"
  },
  "verbo-429": {
    "promptNative": "Tomara que eu _____ (aparcar = estacionar (Espanha)). (subjImpf)"
  },
  "verbo-430": {
    "promptNative": "Tomara que eu _____ (firmar = assinar). (subjImpf)"
  },
  "verbo-431": {
    "promptNative": "Tomara que eu _____ (comer = comer). (subjImpf)"
  },
  "verbo-432": {
    "promptNative": "Tomara que eu _____ (beber = beber). (subjImpf)"
  },
  "verbo-433": {
    "promptNative": "Tomara que eu _____ (correr = correr). (subjImpf)"
  },
  "verbo-434": {
    "promptNative": "Tomara que eu _____ (leer = ler). (subjImpf)"
  },
  "verbo-435": {
    "promptNative": "Tomara que eu _____ (aprender = aprender). (subjImpf)"
  },
  "verbo-436": {
    "promptNative": "Tomara que eu _____ (comprender = compreender). (subjImpf)"
  },
  "verbo-437": {
    "promptNative": "Tomara que eu _____ (coger = pegar (Espanha)). (subjImpf)"
  },
  "verbo-438": {
    "promptNative": "Tomara que eu _____ (vender = vender). (subjImpf)"
  },
  "verbo-439": {
    "promptNative": "Tomara que eu _____ (vivir = morar). (subjImpf)"
  },
  "verbo-440": {
    "promptNative": "Tomara que eu _____ (escribir = escrever). (subjImpf)"
  },
  "verbo-441": {
    "promptNative": "Tomara que eu _____ (abrir = abrir). (subjImpf)"
  },
  "verbo-442": {
    "promptNative": "Tomara que eu _____ (recibir = receber). (subjImpf)"
  },
  "verbo-443": {
    "promptNative": "Tomara que eu _____ (subir = subir). (subjImpf)"
  },
  "verbo-444": {
    "promptNative": "Tomara que eu _____ (decidir = decidir). (subjImpf)"
  },
  "verbo-445": {
    "promptNative": "Espero que eu _____ (pensar = pensar). (subjPres)"
  },
  "verbo-446": {
    "promptNative": "Espero que eles _____ (pensar = pensar). (subjPres)"
  },
  "verbo-447": {
    "promptNative": "Espero que vocês (vosotros) _____ (poder = poder). (subjPres)"
  },
  "verbo-448": {
    "promptNative": "Espero que nós _____ (querer = querer). (subjPres)"
  },
  "verbo-449": {
    "promptNative": "Espero que ele/ela _____ (volver = voltar). (subjPres)"
  },
  "verbo-450": {
    "promptNative": "Espero que você (tú) _____ (dormir = dormir). (subjPres)"
  },
  "verbo-451": {
    "promptNative": "Espero que eu _____ (pedir = pedir). (subjPres)"
  },
  "verbo-452": {
    "promptNative": "Espero que eles _____ (pedir = pedir). (subjPres)"
  },
  "verbo-453": {
    "promptNative": "Espero que vocês (vosotros) _____ (entender = entender). (subjPres)"
  },
  "verbo-454": {
    "promptNative": "Espero que nós _____ (jugar = jogar). (subjPres)"
  },
  "verbo-455": {
    "promptNative": "Espero que ele/ela _____ (empezar = começar). (subjPres)"
  },
  "verbo-456": {
    "promptNative": "Espero que você (tú) _____ (cerrar = fechar). (subjPres)"
  },
  "verbo-457": {
    "promptNative": "Espero que eu _____ (ser = ser). (subjPres)"
  },
  "verbo-458": {
    "promptNative": "Espero que eles _____ (ser = ser). (subjPres)"
  },
  "verbo-459": {
    "promptNative": "Espero que vocês (vosotros) _____ (estar = estar). (subjPres)"
  },
  "verbo-460": {
    "promptNative": "Espero que nós _____ (ir = ir). (subjPres)"
  },
  "verbo-461": {
    "promptNative": "Espero que ele/ela _____ (tener = ter). (subjPres)"
  },
  "verbo-462": {
    "promptNative": "Espero que você (tú) _____ (hacer = fazer). (subjPres)"
  },
  "verbo-463": {
    "promptNative": "Espero que eu _____ (decir = dizer). (subjPres)"
  },
  "verbo-464": {
    "promptNative": "Espero que eles _____ (decir = dizer). (subjPres)"
  },
  "verbo-465": {
    "promptNative": "Espero que vocês (vosotros) _____ (venir = vir). (subjPres)"
  },
  "verbo-466": {
    "promptNative": "Espero que nós _____ (poner = pôr). (subjPres)"
  },
  "verbo-467": {
    "promptNative": "Espero que ele/ela _____ (salir = sair). (subjPres)"
  },
  "verbo-468": {
    "promptNative": "Espero que você (tú) _____ (dar = dar). (subjPres)"
  },
  "verbo-469": {
    "promptNative": "Espero que eu _____ (ver = ver). (subjPres)"
  },
  "verbo-470": {
    "promptNative": "Espero que eles _____ (ver = ver). (subjPres)"
  },
  "verbo-471": {
    "promptNative": "Espero que vocês (vosotros) _____ (saber = saber). (subjPres)"
  },
  "verbo-472": {
    "promptNative": "Tomara que eu _____ (pensar = pensar). (subjImpf)"
  },
  "verbo-473": {
    "promptNative": "Tomara que nós _____ (pensar = pensar). (subjImpf)"
  },
  "verbo-474": {
    "promptNative": "Tomara que eles _____ (pensar = pensar). (subjImpf)"
  },
  "verbo-475": {
    "promptNative": "Tomara que você (tú) _____ (poder = poder). (subjImpf)"
  },
  "verbo-476": {
    "promptNative": "Tomara que vocês (vosotros) _____ (poder = poder). (subjImpf)"
  },
  "verbo-477": {
    "promptNative": "Tomara que eu _____ (querer = querer). (subjImpf)"
  },
  "verbo-478": {
    "promptNative": "Tomara que nós _____ (querer = querer). (subjImpf)"
  },
  "verbo-479": {
    "promptNative": "Tomara que eles _____ (querer = querer). (subjImpf)"
  },
  "verbo-480": {
    "promptNative": "Tomara que você (tú) _____ (volver = voltar). (subjImpf)"
  },
  "verbo-481": {
    "promptNative": "Tomara que vocês (vosotros) _____ (volver = voltar). (subjImpf)"
  },
  "verbo-482": {
    "promptNative": "Tomara que eu _____ (dormir = dormir). (subjImpf)"
  },
  "verbo-483": {
    "promptNative": "Tomara que nós _____ (dormir = dormir). (subjImpf)"
  },
  "verbo-484": {
    "promptNative": "Tomara que eles _____ (dormir = dormir). (subjImpf)"
  },
  "verbo-485": {
    "promptNative": "Tomara que você (tú) _____ (pedir = pedir). (subjImpf)"
  },
  "verbo-486": {
    "promptNative": "Tomara que vocês (vosotros) _____ (pedir = pedir). (subjImpf)"
  },
  "verbo-487": {
    "promptNative": "Tomara que eu _____ (entender = entender). (subjImpf)"
  },
  "verbo-488": {
    "promptNative": "Tomara que nós _____ (entender = entender). (subjImpf)"
  },
  "verbo-489": {
    "promptNative": "Tomara que eles _____ (entender = entender). (subjImpf)"
  },
  "verbo-490": {
    "promptNative": "Tomara que você (tú) _____ (jugar = jogar). (subjImpf)"
  },
  "verbo-491": {
    "promptNative": "Tomara que vocês (vosotros) _____ (jugar = jogar). (subjImpf)"
  },
  "verbo-492": {
    "promptNative": "Tomara que eu _____ (empezar = começar). (subjImpf)"
  },
  "verbo-493": {
    "promptNative": "Tomara que nós _____ (empezar = começar). (subjImpf)"
  },
  "verbo-494": {
    "promptNative": "Tomara que eles _____ (empezar = começar). (subjImpf)"
  },
  "verbo-495": {
    "promptNative": "Tomara que você (tú) _____ (cerrar = fechar). (subjImpf)"
  },
  "verbo-496": {
    "promptNative": "Tomara que vocês (vosotros) _____ (cerrar = fechar). (subjImpf)"
  },
  "verbo-497": {
    "promptNative": "Tomara que eu _____ (ser = ser). (subjImpf)"
  },
  "verbo-498": {
    "promptNative": "Tomara que nós _____ (ser = ser). (subjImpf)"
  },
  "verbo-499": {
    "promptNative": "Tomara que eles _____ (ser = ser). (subjImpf)"
  },
  "verbo-500": {
    "promptNative": "Tomara que você (tú) _____ (estar = estar). (subjImpf)"
  },
  "verbo-501": {
    "promptNative": "Tomara que vocês (vosotros) _____ (estar = estar). (subjImpf)"
  },
  "verbo-502": {
    "promptNative": "Tomara que eu _____ (ir = ir). (subjImpf)"
  },
  "verbo-503": {
    "promptNative": "Tomara que nós _____ (ir = ir). (subjImpf)"
  },
  "verbo-504": {
    "promptNative": "Tomara que eles _____ (ir = ir). (subjImpf)"
  },
  "verbo-505": {
    "promptNative": "Tomara que você (tú) _____ (tener = ter). (subjImpf)"
  },
  "verbo-506": {
    "promptNative": "Tomara que vocês (vosotros) _____ (tener = ter). (subjImpf)"
  },
  "verbo-507": {
    "promptNative": "Tomara que eu _____ (hacer = fazer). (subjImpf)"
  },
  "verbo-508": {
    "promptNative": "Tomara que nós _____ (hacer = fazer). (subjImpf)"
  },
  "verbo-509": {
    "promptNative": "Tomara que eles _____ (hacer = fazer). (subjImpf)"
  },
  "verbo-510": {
    "promptNative": "Tomara que você (tú) _____ (decir = dizer). (subjImpf)"
  },
  "verbo-511": {
    "promptNative": "Tomara que vocês (vosotros) _____ (decir = dizer). (subjImpf)"
  },
  "verbo-512": {
    "promptNative": "Tomara que eu _____ (venir = vir). (subjImpf)"
  },
  "verbo-513": {
    "promptNative": "Tomara que nós _____ (venir = vir). (subjImpf)"
  },
  "verbo-514": {
    "promptNative": "Tomara que eles _____ (venir = vir). (subjImpf)"
  },
  "verbo-515": {
    "promptNative": "Tomara que você (tú) _____ (poner = pôr). (subjImpf)"
  },
  "verbo-516": {
    "promptNative": "Tomara que vocês (vosotros) _____ (poner = pôr). (subjImpf)"
  },
  "trad-0": {
    "prompt": "Traduzir: 'Beleza, parece bom.'",
    "promptNative": "Beleza, parece bom."
  },
  "trad-1": {
    "prompt": "Traduzir: 'Cara, olha isso.'",
    "promptNative": "Cara, olha isso."
  },
  "trad-2": {
    "prompt": "Traduzir: 'Muito obrigado.'",
    "promptNative": "Muito obrigado."
  },
  "trad-3": {
    "prompt": "Traduzir: 'Até mais.'",
    "promptNative": "Até mais."
  },
  "trad-4": {
    "prompt": "Traduzir: 'Que legal!' (coloquial, Espanha)",
    "promptNative": "Que legal! (coloquial, Espanha)"
  },
  "trad-5": {
    "prompt": "Traduzir: 'Estou a fim de um café.' (Espanha)",
    "promptNative": "Estou a fim de um café. (Espanha)"
  },
  "trad-6": {
    "prompt": "Traduzir: 'A gente se encontra às oito.' (Espanha)",
    "promptNative": "A gente se encontra às oito. (Espanha)"
  },
  "trad-7": {
    "prompt": "Traduzir: 'Isso é demais!' (coloquial, Espanha)",
    "promptNative": "Isso é demais! (coloquial, Espanha)"
  },
  "trad-8": {
    "prompt": "Traduzir: 'Estou pouco me lixando.' (coloquial, Espanha)",
    "promptNative": "Estou pouco me lixando. (coloquial, Espanha)"
  },
  "trad-9": {
    "prompt": "Traduzir: 'O bar está lotado.' (coloquial, Espanha)",
    "promptNative": "O bar está lotado. (coloquial, Espanha)"
  },
  "trad-10": {
    "prompt": "Traduzir: 'Acordei tarde.' (coloquial, Espanha)",
    "promptNative": "Acordei tarde. (coloquial, Espanha)"
  },
  "trad-11": {
    "prompt": "Traduzir: 'no meio do nada' (Espanha)",
    "promptNative": "no meio do nada (Espanha)"
  },
  "trad-12": {
    "prompt": "Traduzir: 'Como se já não tivéssemos problemas suficientes!' (Espanha)",
    "promptNative": "Como se já não tivéssemos problemas suficientes! (Espanha)"
  },
  "trad-13": {
    "prompt": "Traduzir: 'As coisas teriam acabado de um jeito bem diferente.' (Espanha)",
    "promptNative": "As coisas teriam acabado de um jeito bem diferente. (Espanha)"
  },
  "trad-14": {
    "prompt": "Traduzir: 'Oi, tudo bem?'",
    "promptNative": "Oi, tudo bem?"
  },
  "trad-15": {
    "prompt": "Traduzir: 'Bom dia.'",
    "promptNative": "Bom dia."
  },
  "trad-16": {
    "prompt": "Traduzir: 'Boa noite.'",
    "promptNative": "Boa noite."
  },
  "trad-17": {
    "prompt": "Traduzir: 'Por favor.'",
    "promptNative": "Por favor."
  },
  "trad-18": {
    "prompt": "Traduzir: 'De nada.'",
    "promptNative": "De nada."
  },
  "trad-19": {
    "prompt": "Traduzir: 'Com licença.' (para passar por alguém)",
    "promptNative": "Com licença. (para passar por alguém)"
  },
  "trad-20": {
    "prompt": "Traduzir: 'Sim, claro.'",
    "promptNative": "Sim, claro."
  },
  "trad-21": {
    "prompt": "Traduzir: 'Não entendo.'",
    "promptNative": "Não entendo."
  },
  "trad-22": {
    "prompt": "Traduzir: 'Como você se chama?'",
    "promptNative": "Como você se chama?"
  },
  "trad-23": {
    "prompt": "Traduzir: 'Meu nome é Ana.'",
    "promptNative": "Meu nome é Ana."
  },
  "trad-24": {
    "prompt": "Traduzir: 'Onde fica o banheiro?'",
    "promptNative": "Onde fica o banheiro?"
  },
  "trad-25": {
    "prompt": "Traduzir: 'Quanto custa?'",
    "promptNative": "Quanto custa?"
  },
  "trad-26": {
    "prompt": "Traduzir: 'A conta, por favor.'",
    "promptNative": "A conta, por favor."
  },
  "trad-27": {
    "prompt": "Traduzir: 'Um café, por favor.'",
    "promptNative": "Um café, por favor."
  },
  "trad-28": {
    "prompt": "Traduzir: 'Beleza.' (coloquial, Espanha)",
    "promptNative": "Beleza. (coloquial, Espanha)"
  },
  "trad-29": {
    "prompt": "Traduzir: 'Até amanhã.'",
    "promptNative": "Até amanhã."
  },
  "trad-30": {
    "prompt": "Traduzir: 'Tchau.'",
    "promptNative": "Tchau."
  },
  "trad-31": {
    "prompt": "Traduzir: 'Estou bem, obrigado.'",
    "promptNative": "Estou bem, obrigado."
  },
  "trad-32": {
    "prompt": "Traduzir: 'Você fala inglês?'",
    "promptNative": "Você fala inglês?"
  },
  "trad-33": {
    "prompt": "Traduzir: 'Você pode me ajudar?'",
    "promptNative": "Você pode me ajudar?"
  },
  "trad-34": {
    "prompt": "Traduzir: 'Onde fica a estação de trem?'",
    "promptNative": "Onde fica a estação de trem?"
  },
  "trad-35": {
    "prompt": "Traduzir: 'Como eu chego ao centro da cidade?'",
    "promptNative": "Como eu chego ao centro da cidade?"
  },
  "trad-36": {
    "prompt": "Traduzir: 'Estou procurando uma farmácia.'",
    "promptNative": "Estou procurando uma farmácia."
  },
  "trad-37": {
    "prompt": "Traduzir: 'Posso pagar com cartão?'",
    "promptNative": "Posso pagar com cartão?"
  },
  "trad-38": {
    "prompt": "Traduzir: 'Que horas abre?'",
    "promptNative": "Que horas abre?"
  },
  "trad-39": {
    "prompt": "Traduzir: 'Vou querer o prato feito.' (Espanha)",
    "promptNative": "Vou querer o prato feito. (Espanha)"
  },
  "trad-40": {
    "prompt": "Traduzir: 'Você pode me trazer o cardápio?' (Espanha)",
    "promptNative": "Você pode me trazer o cardápio? (Espanha)"
  },
  "trad-41": {
    "prompt": "Traduzir: 'Um chope pequeno, por favor.' (Espanha)",
    "promptNative": "Um chope pequeno, por favor. (Espanha)"
  },
  "trad-42": {
    "prompt": "Traduzir: 'Vire à direita.'",
    "promptNative": "Vire à direita."
  },
  "trad-43": {
    "prompt": "Traduzir: 'É à esquerda.'",
    "promptNative": "É à esquerda."
  },
  "trad-44": {
    "prompt": "Traduzir: 'Como estão as coisas?'",
    "promptNative": "Como estão as coisas?"
  },
  "trad-45": {
    "prompt": "Traduzir: 'Só estou olhando, obrigado.'",
    "promptNative": "Só estou olhando, obrigado."
  },
  "trad-46": {
    "prompt": "Traduzir: 'Você pode me dar uma sacola?'",
    "promptNative": "Você pode me dar uma sacola?"
  },
  "trad-47": {
    "prompt": "Traduzir: 'O que você recomenda?'",
    "promptNative": "O que você recomenda?"
  },
  "trad-48": {
    "prompt": "Traduzir: 'Você tem uma mesa para dois?'",
    "promptNative": "Você tem uma mesa para dois?"
  },
  "trad-49": {
    "prompt": "Traduzir: 'É caro demais.'",
    "promptNative": "É caro demais."
  },
  "trad-50": {
    "prompt": "Traduzir: 'Tenho que pegar o ônibus.' (Espanha)",
    "promptNative": "Tenho que pegar o ônibus. (Espanha)"
  },
  "trad-51": {
    "prompt": "Traduzir: 'Falou, até mais!' (coloquial, Espanha)",
    "promptNative": "Falou, até mais! (coloquial, Espanha)"
  },
  "trad-52": {
    "prompt": "Traduzir: 'Show!' (coloquial, Espanha)",
    "promptNative": "Show! (coloquial, Espanha)"
  },
  "trad-53": {
    "prompt": "Traduzir: 'Isso é muito maneiro.' (coloquial, Espanha)",
    "promptNative": "Isso é muito maneiro. (coloquial, Espanha)"
  },
  "trad-54": {
    "prompt": "Traduzir: 'A gente combinou de se encontrar no bar.' (Espanha)",
    "promptNative": "A gente combinou de se encontrar no bar. (Espanha)"
  },
  "trad-55": {
    "prompt": "Traduzir: 'Estou a fim de sair hoje à noite.' (Espanha)",
    "promptNative": "Estou a fim de sair hoje à noite. (Espanha)"
  },
  "trad-56": {
    "prompt": "Traduzir: 'Você pode me buscar um café?' (Espanha)",
    "promptNative": "Você pode me buscar um café? (Espanha)"
  },
  "trad-57": {
    "prompt": "Traduzir: 'Hoje de manhã tomei café da manhã em casa.' (Espanha)",
    "promptNative": "Hoje de manhã tomei café da manhã em casa. (Espanha)"
  },
  "trad-58": {
    "prompt": "Traduzir: 'Que saco / que chato.' (coloquial, Espanha)",
    "promptNative": "Que saco / que chato. (coloquial, Espanha)"
  },
  "trad-59": {
    "prompt": "Traduzir: 'Estou exausto / acabado.' (coloquial, Espanha)",
    "promptNative": "Estou exausto / acabado. (coloquial, Espanha)"
  },
  "trad-60": {
    "prompt": "Traduzir: 'Fica no meio do nada.' (Espanha)",
    "promptNative": "Fica no meio do nada. (Espanha)"
  },
  "trad-61": {
    "prompt": "Traduzir: 'Estamos atolados de trabalho.' (coloquial, Espanha)",
    "promptNative": "Estamos atolados de trabalho. (coloquial, Espanha)"
  },
  "trad-62": {
    "prompt": "Traduzir: 'É o máximo / é incrível!' (coloquial, Espanha)",
    "promptNative": "É o máximo / é incrível! (coloquial, Espanha)"
  },
  "trad-63": {
    "prompt": "Traduzir: 'Vamos emendar o feriado.' (Espanha)",
    "promptNative": "Vamos emendar o feriado. (Espanha)"
  },
  "trad-64": {
    "prompt": "Traduzir: 'Meu computador não está funcionando.' (Espanha)",
    "promptNative": "Meu computador não está funcionando. (Espanha)"
  },
  "trad-65": {
    "prompt": "Traduzir: 'Perdi meu celular.' (Espanha)",
    "promptNative": "Perdi meu celular. (Espanha)"
  },
  "trad-66": {
    "prompt": "Traduzir: 'Você está a fim de uma cerveja?' (Espanha)",
    "promptNative": "Você está a fim de uma cerveja? (Espanha)"
  },
  "trad-67": {
    "prompt": "Traduzir: 'Cuidado, mano!' (coloquial, Espanha)",
    "promptNative": "Cuidado, mano! (coloquial, Espanha)"
  },
  "trad-68": {
    "prompt": "Traduzir: 'Vou lá pegar o carro.' (Espanha)",
    "promptNative": "Vou lá pegar o carro. (Espanha)"
  },
  "trad-69": {
    "prompt": "Traduzir: 'Que roubo!' (coloquial, Espanha)",
    "promptNative": "Que roubo! (coloquial, Espanha)"
  },
  "trad-70": {
    "prompt": "Traduzir: 'É moleza.' (coloquial, Espanha)",
    "promptNative": "É moleza. (coloquial, Espanha)"
  },
  "trad-71": {
    "prompt": "Traduzir: 'Para de encher o saco.' (coloquial, Espanha)",
    "promptNative": "Para de encher o saco. (coloquial, Espanha)"
  },
  "trad-72": {
    "prompt": "Traduzir: 'Ele não dá uma dentro.' (coloquial, Espanha)",
    "promptNative": "Ele não dá uma dentro. (coloquial, Espanha)"
  },
  "trad-73": {
    "prompt": "Traduzir: 'Que azar!' (coloquial, Espanha)",
    "promptNative": "Que azar! (coloquial, Espanha)"
  },
  "trad-74": {
    "prompt": "Traduzir: 'Ele está de mau humor.' (coloquial, Espanha)",
    "promptNative": "Ele está de mau humor. (coloquial, Espanha)"
  },
  "trad-75": {
    "prompt": "Traduzir: 'Ele é um gênio absoluto / um craque.' (coloquial, Espanha)",
    "promptNative": "Ele é um gênio absoluto / um craque. (coloquial, Espanha)"
  },
  "trad-76": {
    "prompt": "Traduzir: 'Ela fez o maior escândalo.' (coloquial, Espanha)",
    "promptNative": "Ela fez o maior escândalo. (coloquial, Espanha)"
  },
  "trad-77": {
    "prompt": "Traduzir: 'Fiquei completamente pasmo.' (coloquial, Espanha)",
    "promptNative": "Fiquei completamente pasmo. (coloquial, Espanha)"
  },
  "trad-78": {
    "prompt": "Traduzir: 'A gente se empanturrou no jantar.' (coloquial, Espanha)",
    "promptNative": "A gente se empanturrou no jantar. (coloquial, Espanha)"
  },
  "trad-79": {
    "prompt": "Traduzir: 'Você vai ficar de queixo caído.' (coloquial, Espanha)",
    "promptNative": "Você vai ficar de queixo caído. (coloquial, Espanha)"
  },
  "trad-80": {
    "prompt": "Traduzir: 'Não estou a fim de lidar com isso.' (coloquial, Espanha)",
    "promptNative": "Não estou a fim de lidar com isso. (coloquial, Espanha)"
  },
  "trad-81": {
    "prompt": "Traduzir: 'É baratíssimo.' (coloquial, Espanha)",
    "promptNative": "É baratíssimo. (coloquial, Espanha)"
  },
  "trad-82": {
    "prompt": "Traduzir: 'A gente matou aula.' (coloquial, Espanha)",
    "promptNative": "A gente matou aula. (coloquial, Espanha)"
  },
  "trad-83": {
    "prompt": "Traduzir: 'Estou de saco cheio disso.' (coloquial, Espanha)",
    "promptNative": "Estou de saco cheio disso. (coloquial, Espanha)"
  },
  "trad-84": {
    "prompt": "Traduzir: 'Isso é um roubo total.' (coloquial, Espanha)",
    "promptNative": "Isso é um roubo total. (coloquial, Espanha)"
  },
  "trad-85": {
    "prompt": "Traduzir: 'Eles estão só te zoando.' (coloquial, Espanha)",
    "promptNative": "Eles estão só te zoando. (coloquial, Espanha)"
  },
  "trad-86": {
    "prompt": "Traduzir: 'Estou totalmente duro.' (coloquial, Espanha)",
    "promptNative": "Estou totalmente duro. (coloquial, Espanha)"
  },
  "trad-87": {
    "prompt": "Traduzir: 'Vamos, anda logo!' (coloquial, Espanha)",
    "promptNative": "Vamos, anda logo! (coloquial, Espanha)"
  },
  "trad-88": {
    "prompt": "Traduzir: 'Tarde demais e de menos!' (Espanha)",
    "promptNative": "Tarde demais e de menos! (Espanha)"
  },
  "trad-89": {
    "prompt": "Traduzir: 'Já que começou, vai até o fim.' (Espanha)",
    "promptNative": "Já que começou, vai até o fim. (Espanha)"
  },
  "trad-90": {
    "prompt": "Traduzir: 'Agora realmente não é a hora.' (coloquial, Espanha)",
    "promptNative": "Agora realmente não é a hora. (coloquial, Espanha)"
  },
  "trad-91": {
    "prompt": "Traduzir: 'Melhor o mal conhecido do que o bom por conhecer.' (Espanha)",
    "promptNative": "Melhor o mal conhecido do que o bom por conhecer. (Espanha)"
  },
  "trad-92": {
    "prompt": "Traduzir: 'Cria fama e deita na cama... e depois te traem.' (Espanha)",
    "promptNative": "Cria fama e deita na cama... e depois te traem. (Espanha)"
  },
  "trad-93": {
    "prompt": "Traduzir: 'Quem não chora não mama.' (Espanha)",
    "promptNative": "Quem não chora não mama. (Espanha)"
  },
  "trad-94": {
    "prompt": "Traduzir: 'Ele está totalmente aéreo.' (coloquial, Espanha)",
    "promptNative": "Ele está totalmente aéreo. (coloquial, Espanha)"
  },
  "trad-95": {
    "prompt": "Traduzir: 'Isso me deixa completamente indiferente.' (coloquial, Espanha)",
    "promptNative": "Isso me deixa completamente indiferente. (coloquial, Espanha)"
  },
  "trad-96": {
    "prompt": "Traduzir: 'Ela o traiu.' (coloquial, Espanha)",
    "promptNative": "Ela o traiu. (coloquial, Espanha)"
  },
  "trad-97": {
    "prompt": "Traduzir: 'Não pouparam despesas.' (Espanha)",
    "promptNative": "Não pouparam despesas. (Espanha)"
  },
  "trad-98": {
    "prompt": "Traduzir: 'Isso já é outra história completamente diferente.' (Espanha)",
    "promptNative": "Isso já é outra história completamente diferente. (Espanha)"
  },
  "trad-99": {
    "prompt": "Traduzir: 'Ela não tem papas na língua.' (Espanha)",
    "promptNative": "Ela não tem papas na língua. (Espanha)"
  },
  "trad-100": {
    "prompt": "Traduzir: 'Eu realmente paguei o maior mico.' (coloquial, Espanha)",
    "promptNative": "Eu realmente paguei o maior mico. (coloquial, Espanha)"
  },
  "trad-101": {
    "prompt": "Traduzir: 'Ela deu um fora nele na lata.' (coloquial, Espanha)",
    "promptNative": "Ela deu um fora nele na lata. (coloquial, Espanha)"
  },
  "trad-102": {
    "prompt": "Traduzir: 'Ele é completamente pirado.' (coloquial, Espanha)",
    "promptNative": "Ele é completamente pirado. (coloquial, Espanha)"
  },
  "trad-103": {
    "prompt": "Traduzir: 'Você precisa se ligar e se organizar.' (coloquial, Espanha)",
    "promptNative": "Você precisa se ligar e se organizar. (coloquial, Espanha)"
  },
  "trad-104": {
    "prompt": "Traduzir: 'Ele está dormindo para curar a bebedeira.' (coloquial, Espanha)",
    "promptNative": "Ele está dormindo para curar a bebedeira. (coloquial, Espanha)"
  },
  "trad-105": {
    "prompt": "Traduzir: 'Não complique as coisas.' (Espanha)",
    "promptNative": "Não complique as coisas. (Espanha)"
  },
  "trad-106": {
    "prompt": "Traduzir: 'Certo, seguindo em frente!' (coloquial, Espanha)",
    "promptNative": "Certo, seguindo em frente! (coloquial, Espanha)"
  },
  "trad-107": {
    "prompt": "Traduzir: 'Para bom entendedor, meia palavra basta.' (Espanha)",
    "promptNative": "Para bom entendedor, meia palavra basta. (Espanha)"
  },
  "trad-108": {
    "prompt": "Traduzir: 'Quem muito abraça pouco aperta.' (Espanha)",
    "promptNative": "Quem muito abraça pouco aperta. (Espanha)"
  },
  "trad-109": {
    "prompt": "Traduzir: 'Não é acordando cedo que o sol nasce mais cedo.' (Espanha)",
    "promptNative": "Não é acordando cedo que o sol nasce mais cedo. (Espanha)"
  },
  "trad-110": {
    "prompt": "Traduzir: 'Em boca fechada não entra mosca.' (Espanha)",
    "promptNative": "Em boca fechada não entra mosca. (Espanha)"
  },
  "trad-111": {
    "prompt": "Traduzir: 'Diga-me com quem andas e te direi quem és.' (Espanha)",
    "promptNative": "Diga-me com quem andas e te direi quem és. (Espanha)"
  },
  "trad-112": {
    "prompt": "Traduzir: 'Cavalo dado não se olha os dentes.' (Espanha)",
    "promptNative": "Cavalo dado não se olha os dentes. (Espanha)"
  },
  "trad-113": {
    "prompt": "Traduzir: 'Mais vale um pássaro na mão do que dois voando.' (Espanha)",
    "promptNative": "Mais vale um pássaro na mão do que dois voando. (Espanha)"
  },
  "trad-114": {
    "prompt": "Traduzir: 'Quem ri por último ri melhor.' (Espanha)",
    "promptNative": "Quem ri por último ri melhor. (Espanha)"
  },
  "trad-115": {
    "prompt": "Traduzir: 'Não se pode fazer de porco espinho uma bolsa de seda.' (Espanha)",
    "promptNative": "Não se pode fazer de porco espinho uma bolsa de seda. (Espanha)"
  },
  "trad-116": {
    "prompt": "Traduzir: 'Nem tudo que reluz é ouro.' (Espanha)",
    "promptNative": "Nem tudo que reluz é ouro. (Espanha)"
  },
  "trad-117": {
    "prompt": "Traduzir: 'Quem semeia vento colhe tempestade.' (Espanha)",
    "promptNative": "Quem semeia vento colhe tempestade. (Espanha)"
  },
  "trad-118": {
    "prompt": "Traduzir: 'Em rio revolto, ganho de pescador.' (Espanha)",
    "promptNative": "Em rio revolto, ganho de pescador. (Espanha)"
  },
  "trad-119": {
    "prompt": "Traduzir: 'Você tocou num ponto sensível.' (Espanha)",
    "promptNative": "Você tocou num ponto sensível. (Espanha)"
  },
  "trad-120": {
    "prompt": "Traduzir: 'Deixa eu dormir e pensar melhor.' (Espanha)",
    "promptNative": "Deixa eu dormir e pensar melhor. (Espanha)"
  },
  "trad-121": {
    "prompt": "Traduzir: 'Vou comer alguma coisa para enganar a fome.' (coloquial, Espanha)",
    "promptNative": "Vou comer alguma coisa para enganar a fome. (coloquial, Espanha)"
  },
  "trad-122": {
    "prompt": "Traduzir: 'Você está viajando totalmente na maionese.' (Espanha)",
    "promptNative": "Você está viajando totalmente na maionese. (Espanha)"
  },
  "trad-123": {
    "prompt": "Traduzir: 'O plano saiu totalmente pela culatra para ele.' (Espanha)",
    "promptNative": "O plano saiu totalmente pela culatra para ele. (Espanha)"
  },
  "trad-124": {
    "prompt": "Traduzir: 'Não finja que não me ouviu.' (coloquial, Espanha)",
    "promptNative": "Não finja que não me ouviu. (coloquial, Espanha)"
  },
  "trad-125": {
    "prompt": "Traduzir: 'Exigiu um esforço hercúleo.' (Espanha)",
    "promptNative": "Exigiu um esforço hercúleo. (Espanha)"
  },
  "trad-126": {
    "prompt": "Traduzir: 'Ele estava impecável, todo elegante.' (Espanha)",
    "promptNative": "Ele estava impecável, todo elegante. (Espanha)"
  },
  "fvocab-0": {
    "promptNative": "'El tiempo' significa...",
    "options": [
      "tempo; clima",
      "fogo",
      "cidade",
      "pão"
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
      "loja",
      "arroz",
      "música"
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
      "mês",
      "água",
      "homem"
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
      "cadeira",
      "fogo",
      "neve"
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
      "frango (como alimento)",
      "ar",
      "pássaro"
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
      "filha",
      "gato",
      "loja"
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
      "mulher; esposa",
      "filme",
      "avião"
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
      "pai",
      "mundo",
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
      "hora; hora do dia",
      "leite",
      "peixe (como alimento)"
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
      "irmã",
      "loja",
      "ar"
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
      "dia",
      "fruta",
      "frango (como alimento)"
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
      "céu; paraíso",
      "árvore",
      "lua"
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
      "filme",
      "semana",
      "mão"
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
      "sal",
      "mesa",
      "chuva"
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
      "família",
      "dia",
      "ar"
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
      "mãe",
      "olho",
      "frango (como alimento)"
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
      "telefone",
      "árvore",
      "sol"
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
      "ar",
      "chuva",
      "semana"
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
      "chuva",
      "trem",
      "árvore"
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
      "gato",
      "café",
      "flor"
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
      "vaca",
      "música",
      "mês"
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
      "frango (como alimento)",
      "rua",
      "mês"
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
      "bicicleta",
      "ovo",
      "mulher; esposa"
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
      "rua",
      "carne",
      "irmã"
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
      "sopa",
      "arroz",
      "mesa"
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
      "sopa",
      "flor",
      "irmão"
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
      "semana",
      "vaca",
      "mulher; esposa"
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
      "água",
      "sopa",
      "animal"
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
      "ano",
      "livro",
      "foto"
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
      "bicicleta",
      "porta",
      "futebol"
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
      "cor",
      "ar",
      "peixe (como alimento)"
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
      "açúcar",
      "ano",
      "homem"
    ]
  },
  "fvocab-63": {
    "prompt": "¿Cómo se dice 'céu; paraíso' en español?",
    "promptNative": "Como se diz 'céu; paraíso' em espanhol?"
  },
  "fvocab-64": {
    "promptNative": "'La lluvia' significa...",
    "options": [
      "chuva",
      "cavalo",
      "café",
      "hora; hora do dia"
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
      "mês",
      "avião",
      "tempo; clima"
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
      "fogo",
      "gato",
      "família"
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
      "mulher; esposa",
      "telefone",
      "neve"
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
      "porta",
      "vaca",
      "ano"
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
      "telefone",
      "rua",
      "hora; hora do dia"
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
      "sal",
      "árvore",
      "leite"
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
      "querer; amar",
      "escrever",
      "esperar; ter esperança"
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
      "fazer",
      "ler",
      "beber"
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
      "vir",
      "comprar",
      "estudar"
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
      "cozinhar",
      "dizer; contar",
      "jogar (um jogo)"
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
      "comprar",
      "amar",
      "ler"
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
      "estudar",
      "dançar",
      "precisar"
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
      "entrar",
      "dizer; contar",
      "querer; amar"
    ]
  },
  "fvocab-91": {
    "prompt": "¿Cómo se dice 'sair; partir' en español?",
    "promptNative": "Como se diz 'sair; partir' em espanhol?"
  },
  "fvocab-92": {
    "promptNative": "'Entrar' significa...",
    "options": [
      "entrar",
      "dançar",
      "olhar; assistir",
      "vir"
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
      "precisar",
      "ir",
      "chamar"
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
      "cantar",
      "dançar",
      "ver"
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
      "escutar",
      "procurar",
      "jogar (um jogo)"
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
      "abrir",
      "jogar (um jogo)",
      "cozinhar"
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
      "esperar; ter esperança",
      "ver",
      "sair; partir"
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
      "fazer",
      "ver",
      "sair; partir"
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
      "fazer",
      "procurar",
      "abrir"
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
      "chamar",
      "esperar; ter esperança",
      "ler"
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
      "fazer",
      "olhar; assistir",
      "cantar"
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
      "velho",
      "feliz"
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
      "alto",
      "bonito",
      "pequeno"
    ]
  },
  "fvocab-115": {
    "prompt": "¿Cómo se dice 'mau' en español?",
    "promptNative": "Como se diz 'mau' em espanhol?"
  },
  "fvocab-116": {
    "promptNative": "'Nuevo' significa...",
    "options": [
      "novo",
      "grande",
      "pobre",
      "lento"
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
      "bom",
      "difícil",
      "frio"
    ]
  },
  "fvocab-119": {
    "prompt": "¿Cómo se dice 'alto' en español?",
    "promptNative": "Como se diz 'alto' em espanhol?"
  },
  "fvocab-120": {
    "promptNative": "'Bajo' significa...",
    "options": [
      "baixo (estatura); baixo",
      "longo",
      "caro",
      "fácil"
    ]
  },
  "fvocab-121": {
    "prompt": "¿Cómo se dice 'longo' en español?",
    "promptNative": "Como se diz 'longo' em espanhol?"
  },
  "fvocab-122": {
    "promptNative": "'Corto' significa...",
    "options": [
      "curto (comprimento)",
      "sujo",
      "longo",
      "fácil"
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
      "grande",
      "caro",
      "curto (comprimento)"
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
      "fácil",
      "baixo (estatura); baixo",
      "pequeno"
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
      "rico; delicioso",
      "fácil",
      "triste"
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
      "pobre",
      "rápido",
      "pequeno"
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
      "rápido",
      "sujo",
      "frio"
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
      "rápido",
      "difícil",
      "lento"
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
      "longo",
      "fácil",
      "barato"
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
      "rico; delicioso",
      "triste",
      "alto"
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
      "perto",
      "bem",
      "nunca"
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
      "hoje",
      "cedo",
      "muito"
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
      "mal",
      "depois",
      "hoje"
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
      "depois",
      "muito"
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
      "aqui",
      "muito",
      "sempre"
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
      "sempre",
      "nunca",
      "ali"
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
      "hoje",
      "mal",
      "também"
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
      "sempre",
      "bem",
      "nunca"
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
      "boca",
      "lima; limão",
      "hotel"
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
      "igreja",
      "parede (interna)",
      "quarto"
    ]
  },
  "fvocab-159": {
    "prompt": "¿Cómo se dice 'orelha (externa)' en español?",
    "promptNative": "Como se diz 'orelha (externa)' em espanhol?"
  },
  "fvocab-160": {
    "promptNative": "'El diente' significa...",
    "options": [
      "dente",
      "meia",
      "orelha (externa)",
      "morango"
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
      "nariz",
      "garrafa",
      "banana"
    ]
  },
  "fvocab-163": {
    "prompt": "¿Cómo se dice 'pé' en español?",
    "promptNative": "Como se diz 'pé' em espanhol?"
  },
  "fvocab-164": {
    "promptNative": "'La espalda' significa...",
    "options": [
      "costas (parte do corpo)",
      "xícara; caneca",
      "faca",
      "mapa"
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
      "aeroporto",
      "sapato",
      "vestido"
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
      "casaco",
      "dente",
      "laranja (fruta)"
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
      "queijo",
      "guardanapo",
      "tomate"
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
      "orelha (externa)",
      "meia",
      "cinto"
    ]
  },
  "fvocab-173": {
    "prompt": "¿Cómo se dice 'jardim' en español?",
    "promptNative": "Como se diz 'jardim' em espanhol?"
  },
  "fvocab-174": {
    "promptNative": "'El suelo' significa...",
    "options": [
      "chão; solo",
      "sala de estar",
      "mala",
      "sorvete"
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
      "bolso",
      "casaco",
      "cabeça"
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
      "banco; banco (assento)",
      "parede (interna)",
      "escada"
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
      "dente",
      "mala",
      "nariz"
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
      "bolso",
      "coração",
      "dente"
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
      "bolo",
      "saia",
      "camisa"
    ]
  },
  "fvocab-185": {
    "prompt": "¿Cómo se dice 'copo' en español?",
    "promptNative": "Como se diz 'copo' em espanhol?"
  },
  "fvocab-186": {
    "promptNative": "'La taza' significa...",
    "options": [
      "xícara; caneca",
      "bolo",
      "óleo (de cozinha)",
      "legume"
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
      "férias",
      "garrafa"
    ]
  },
  "fvocab-189": {
    "prompt": "¿Cómo se dice 'aeroporto' en español?",
    "promptNative": "Como se diz 'aeroporto' em espanhol?"
  },
  "fvocab-190": {
    "promptNative": "'La estación' significa...",
    "options": [
      "estação; estação (do ano)",
      "parque",
      "cachecol",
      "banheiro"
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
      "almoço",
      "guardanapo",
      "cabelo"
    ]
  },
  "fvocab-193": {
    "prompt": "¿Cómo se dice 'mercado' en español?",
    "promptNative": "Como se diz 'mercado' em espanhol?"
  },
  "fvocab-194": {
    "promptNative": "'El banco' significa...",
    "options": [
      "banco; banco (assento)",
      "almoço",
      "manteiga",
      "prato"
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
      "pescoço",
      "sala de estar",
      "pé"
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
      "perna",
      "garrafa",
      "manteiga"
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
      "mercado",
      "morango",
      "vestido"
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
      "manteiga",
      "luva",
      "banco; banco (assento)"
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
      "cozinha",
      "mapa",
      "almoço"
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
      "boca",
      "óleo (de cozinha)",
      "sala de estar"
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
      "ponte",
      "vestido",
      "banco; banco (assento)"
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
      "nariz",
      "mapa",
      "estação; estação (do ano)"
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
      "farmácia",
      "tomate",
      "pimenta (tempero)"
    ]
  },
  "fvocab-213": {
    "prompt": "¿Cómo se dice 'sorvete' en español?",
    "promptNative": "Como se diz 'sorvete' em espanhol?"
  },
  "fvocab-214": {
    "promptNative": "'La tarta' significa...",
    "options": [
      "bolo",
      "passaporte",
      "nariz",
      "laranja (fruta)"
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
      "ponte",
      "faca",
      "chão; solo"
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
      "cebola",
      "saia",
      "camisa"
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
      "manteiga",
      "parque",
      "mala"
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
      "toalha",
      "parede (interna)",
      "banana"
    ]
  },
  "fvocab-223": {
    "prompt": "¿Cómo se dice 'morango' en español?",
    "promptNative": "Como se diz 'morango' em espanhol?"
  },
  "fvocab-224": {
    "promptNative": "'El limón' significa...",
    "options": [
      "lima; limão",
      "boné",
      "restaurante",
      "bolso"
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
      "faca",
      "pescoço",
      "prato"
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
      "museu",
      "aeroporto",
      "guardanapo"
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
      "cozinha",
      "parque",
      "sala de estar"
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
      "passaporte",
      "banco; banco (assento)",
      "pimenta (tempero)"
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
      "cozinha",
      "dente",
      "lima; limão"
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
      "estação; estação (do ano)",
      "queijo",
      "mala"
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
      "ponte",
      "rosto",
      "escada"
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
      "cortar",
      "descer; baixar (download)",
      "tocar; tocar (música)"
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
      "perder; perder (o ônibus)",
      "cortar",
      "chover"
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
      "receber",
      "pensar",
      "pôr"
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
      "acreditar",
      "sentar-se",
      "voar"
    ]
  },
  "fvocab-247": {
    "prompt": "¿Cómo se dice 'tirar; remover' en español?",
    "promptNative": "Como se diz 'tirar; remover' em espanhol?"
  },
  "fvocab-248": {
    "promptNative": "'Llevar' significa...",
    "options": [
      "carregar; vestir",
      "chover",
      "ensinar; mostrar",
      "ganhar"
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
      "chover",
      "perguntar (fazer uma pergunta)",
      "tocar; tocar (música)"
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
      "pensar",
      "acordar (alguém)",
      "ganhar"
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
      "voar",
      "empurrar",
      "sentir"
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
      "perguntar (fazer uma pergunta)",
      "responder",
      "perder; perder (o ônibus)"
    ]
  },
  "fvocab-257": {
    "prompt": "¿Cómo se dice 'perder; perder (o ônibus)' en español?",
    "promptNative": "Como se diz 'perder; perder (o ônibus)' em espanhol?"
  },
  "fvocab-258": {
    "promptNative": "'Ganar' significa...",
    "options": [
      "ganhar",
      "subir; carregar (upload)",
      "voar",
      "acreditar"
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
      "sentar-se",
      "acordar (alguém)",
      "sentir"
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
      "sentar-se",
      "subir; carregar (upload)",
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
      "subir; carregar (upload)",
      "pensar",
      "sentir"
    ]
  },
  "fvocab-265": {
    "prompt": "¿Cómo se dice 'subir; carregar (upload)' en español?",
    "promptNative": "Como se diz 'subir; carregar (upload)' em espanhol?"
  },
  "fvocab-266": {
    "promptNative": "'Bajar' significa...",
    "options": [
      "descer; baixar (download)",
      "carregar; vestir",
      "puxar",
      "acordar (alguém)"
    ]
  },
  "fvocab-267": {
    "prompt": "¿Cómo se dice 'empurrar' en español?",
    "promptNative": "Como se diz 'empurrar' em espanhol?"
  },
  "fvocab-268": {
    "promptNative": "'Tirar' significa...",
    "options": [
      "puxar",
      "acreditar",
      "tirar; remover",
      "trazer"
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
      "fechado",
      "seco",
      "magro (pessoa)"
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
      "leve (peso)",
      "seco",
      "molhado"
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
      "leve (peso)",
      "salgado",
      "pesado; chato (pessoa)"
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
      "doce",
      "picante",
      "estreito"
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
      "fraco",
      "leve (peso)",
      "perigoso"
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
      "seco",
      "fechado",
      "contente; satisfeito"
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
      "aberto",
      "gordo",
      "seguro; certo"
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
      "seco",
      "picante",
      "forte"
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
      "picante",
      "contente; satisfeito"
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
      "escuro",
      "gordo",
      "pesado; chato (pessoa)"
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
      "seco",
      "largo",
      "estreito"
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
      "leve (peso)",
      "aberto",
      "salgado"
    ]
  },
  "fvocab-293": {
    "prompt": "¿Cómo se dice 'claro (cor); claro' en español?",
    "promptNative": "Como se diz 'claro (cor); claro' em espanhol?"
  },
  "fvocab-294": {
    "promptNative": "'Peligroso' significa...",
    "options": [
      "perigoso",
      "contente; satisfeito",
      "gordo",
      "doente"
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
      "somente",
      "demais",
      "quase"
    ]
  },
  "fvocab-297": {
    "prompt": "¿Cómo se dice 'já; agora' en español?",
    "promptNative": "Como se diz 'já; agora' em espanhol?"
  },
  "fvocab-298": {
    "promptNative": "'Casi' significa...",
    "options": [
      "quase",
      "somente",
      "talvez",
      "ainda"
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
      "talvez",
      "devagar",
      "bastante; suficiente"
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
      "juntos",
      "já; agora",
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
      "somente",
      "quase",
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
      "pergunta",
      "razão",
      "sangue"
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
      "parceiro; casal",
      "cultura",
      "governo"
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
      "emprego",
      "costume; hábito",
      "razão"
    ]
  },
  "fvocab-311": {
    "prompt": "¿Cómo se dice 'exemplo' en español?",
    "promptNative": "Como se diz 'exemplo' em espanhol?"
  },
  "fvocab-312": {
    "promptNative": "'La historia' significa...",
    "options": [
      "história; história (narrativa)",
      "razão",
      "problema",
      "perigo"
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
      "ideia",
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
      "alegria",
      "crescimento",
      "direito (legal); direito (área)"
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
      "medo",
      "sorte",
      "razão"
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
      "sangue",
      "verdade",
      "direito (legal); direito (área)"
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
      "ideia",
      "nível",
      "idade"
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
      "fúria",
      "doença",
      "memória"
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
      "paz",
      "fracasso",
      "esperança"
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
      "memória",
      "surpresa",
      "pergunta"
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
      "lei",
      "fúria",
      "idade"
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
      "esforço",
      "história; história (narrativa)",
      "idade"
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
      "salário",
      "crescimento",
      "medo"
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
      "morte",
      "conhecimento",
      "fracasso"
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
      "memória",
      "conhecimento",
      "exemplo"
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
      "salário",
      "crescimento",
      "empresa"
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
      "segurança",
      "exemplo",
      "verdade"
    ]
  },
  "fvocab-343": {
    "prompt": "¿Cómo se dice 'palavra' en español?",
    "promptNative": "Como se diz 'palavra' em espanhol?"
  },
  "fvocab-344": {
    "promptNative": "'La frase' significa...",
    "options": [
      "frase; expressão",
      "remédio",
      "parceiro; casal",
      "doença"
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
      "memória",
      "resposta",
      "lei"
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
      "parceiro; casal",
      "sorte",
      "empresa"
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
      "empresa",
      "frase; expressão",
      "exemplo"
    ]
  },
  "fvocab-351": {
    "prompt": "¿Cómo se dice 'alegria' en español?",
    "promptNative": "Como se diz 'alegria' em espanhol?"
  },
  "fvocab-352": {
    "promptNative": "'La ira' significa...",
    "options": [
      "fúria",
      "direito (legal); direito (área)",
      "liberdade",
      "salário"
    ]
  },
  "fvocab-353": {
    "prompt": "¿Cómo se dice 'surpresa' en español?",
    "promptNative": "Como se diz 'surpresa' em espanhol?"
  },
  "fvocab-354": {
    "promptNative": "'La vergüenza' significa...",
    "options": [
      "vergonha; constrangimento",
      "nascimento",
      "ajuda",
      "verdade"
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
      "verdade",
      "empresa",
      "esforço"
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
      "morte",
      "casamento",
      "alegria"
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
      "meta",
      "fúria",
      "problema"
    ]
  },
  "fvocab-361": {
    "prompt": "¿Cómo se dice 'justiça' en español?",
    "promptNative": "Como se diz 'justiça' em espanhol?"
  },
  "fvocab-362": {
    "promptNative": "'El derecho' significa...",
    "options": [
      "direito (legal); direito (área)",
      "alegria",
      "esperança",
      "morte"
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
      "orgulho",
      "memória"
    ]
  },
  "fvocab-365": {
    "prompt": "¿Cómo se dice 'esforço' en español?",
    "promptNative": "Como se diz 'esforço' em espanhol?"
  },
  "fvocab-366": {
    "promptNative": "'La meta' significa...",
    "options": [
      "meta",
      "justiça",
      "reunião",
      "crescimento"
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
      "vergonha; constrangimento",
      "história; história (narrativa)",
      "morte"
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
      "justiça",
      "notícia",
      "segurança"
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
      "emprestar",
      "obrigar (alguém a)",
      "aparecer"
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
      "descrever",
      "construir",
      "esconder (algo)"
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
      "girar; rodar",
      "duvidar",
      "prometer"
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
      "rejeitar",
      "sussurrar",
      "desaparecer"
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
      "explicar",
      "rir",
      "dobrar; virar (a esquina)"
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
      "agradecer",
      "alcançar; conseguir",
      "dobrar; virar (a esquina)"
    ]
  },
  "fvocab-383": {
    "prompt": "¿Cómo se dice 'prometer' en español?",
    "promptNative": "Como se diz 'prometer' em espanhol?"
  },
  "fvocab-384": {
    "promptNative": "'Mentir' significa...",
    "options": [
      "mentir",
      "enganar",
      "convidar; pagar (por alguém)",
      "acontecer"
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
      "girar; rodar",
      "brigar",
      "obter; conseguir"
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
      "esconder (algo)",
      "duvidar",
      "girar; rodar"
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
      "rejeitar",
      "deixar (para trás); deixar",
      "dobrar; virar (a esquina)"
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
      "seguir; continuar",
      "desculpar-se",
      "agradecer"
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
      "criar",
      "sorrir",
      "girar; rodar"
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
      "discutir",
      "gritar",
      "rejeitar"
    ]
  },
  "fvocab-397": {
    "prompt": "¿Cómo se dice 'convidar; pagar (por alguém)' en español?",
    "promptNative": "Como se diz 'convidar; pagar (por alguém)' em espanhol?"
  },
  "fvocab-398": {
    "promptNative": "'Aceptar' significa...",
    "options": [
      "aceitar",
      "deixar (para trás); deixar",
      "seguir; continuar",
      "destruir"
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
      "desaparecer",
      "reclamar",
      "obrigar (alguém a)"
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
      "alcançar; conseguir",
      "descrever",
      "duvidar"
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
      "desculpar-se",
      "sussurrar",
      "aceitar"
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
      "alcançar; conseguir",
      "fugir",
      "poupar (dinheiro)"
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
      "enganar",
      "convidar; pagar (por alguém)"
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
      "explicar",
      "gastar",
      "poupar (dinheiro)"
    ]
  },
  "fvocab-411": {
    "prompt": "¿Cómo se dice 'deixar (para trás); deixar' en español?",
    "promptNative": "Como se diz 'deixar (para trás); deixar' em espanhol?"
  },
  "fvocab-412": {
    "promptNative": "'Soltar' significa...",
    "options": [
      "soltar; liberar",
      "explicar",
      "desaparecer",
      "destruir"
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
      "descobrir",
      "descrever",
      "explicar"
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
      "parabenizar",
      "decidir",
      "soltar; liberar"
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
      "rejeitar",
      "chorar",
      "duvidar"
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
      "soltar; liberar",
      "escolher; eleger",
      "rejeitar"
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
      "prometer",
      "continuar",
      "decidir"
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
      "decidir",
      "confiar",
      "deixar (para trás); deixar"
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
      "importante",
      "desconfortável; constrangedor",
      "possível"
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
      "possível",
      "orgulhoso",
      "mesmo"
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
      "provável",
      "possível",
      "corajoso"
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
      "diferente",
      "ciumento"
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
      "grosseiro",
      "inútil",
      "útil"
    ]
  },
  "fvocab-435": {
    "prompt": "¿Cómo se dice 'parecido' en español?",
    "promptNative": "Como se diz 'parecido' em espanhol?"
  },
  "fvocab-436": {
    "promptNative": "'Verdadero' significa...",
    "options": [
      "verdadeiro; real",
      "impossível",
      "orgulhoso",
      "capaz"
    ]
  },
  "fvocab-437": {
    "prompt": "¿Cómo se dice 'falso; falsificado' en español?",
    "promptNative": "Como se diz 'falso; falsificado' em espanhol?"
  },
  "fvocab-438": {
    "promptNative": "'Justo' significa...",
    "options": [
      "justo; exato",
      "confortável",
      "possível",
      "capaz"
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
      "orgulhoso",
      "possível",
      "provável"
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
      "verdadeiro; real",
      "justo; exato",
      "comum"
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
      "justo; exato",
      "confortável",
      "ciumento"
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
      "parecido",
      "justo; exato",
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
      "corajoso",
      "orgulhoso",
      "provável"
    ]
  },
  "fvocab-449": {
    "prompt": "¿Cómo se dice 'além disso' en español?",
    "promptNative": "Como se diz 'além disso' em espanhol?"
  },
  "fvocab-450": {
    "promptNative": "'Mientras' significa...",
    "options": [
      "enquanto isso; enquanto",
      "ainda; até mesmo",
      "além disso",
      "então; portanto"
    ]
  },
  "fvocab-451": {
    "prompt": "¿Cómo se dice 'então; portanto' en español?",
    "promptNative": "Como se diz 'então; portanto' em espanhol?"
  },
  "fvocab-452": {
    "promptNative": "'Luego' significa...",
    "options": [
      "depois; então",
      "ainda; até mesmo",
      "além disso",
      "enquanto isso; enquanto"
    ]
  },
  "fvocab-453": {
    "prompt": "¿Cómo se dice 'mal; dificilmente' en español?",
    "promptNative": "Como se diz 'mal; dificilmente' em espanhol?"
  },
  "fvocab-454": {
    "promptNative": "'Aún' significa...",
    "options": [
      "ainda; até mesmo",
      "então; portanto",
      "enquanto isso; enquanto",
      "além disso"
    ]
  },
  "fvocab-455": {
    "prompt": "¿Cómo se dice 'inclusive' en español?",
    "promptNative": "Como se diz 'inclusive' em espanhol?"
  },
  "fvocab-456": {
    "promptNative": "'El desafío' significa...",
    "options": [
      "desafio",
      "amizade",
      "marca",
      "orçamento"
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
      "imposto",
      "trâmite burocrático",
      "desvantagem"
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
      "solicitação",
      "força; fortaleza",
      "confiança"
    ]
  },
  "fvocab-461": {
    "prompt": "¿Cómo se dice 'ferramenta' en español?",
    "promptNative": "Como se diz 'ferramenta' em espanhol?"
  },
  "fvocab-462": {
    "promptNative": "'La medida' significa...",
    "options": [
      "medida; medição",
      "mal-entendido",
      "personalidade",
      "concorrência"
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
      "marca",
      "perda",
      "ferramenta"
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
      "desvantagem",
      "caráter (temperamento)",
      "porcentagem"
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
      "proposta",
      "publicidade",
      "amizade"
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
      "imposto",
      "ameaça",
      "requisito"
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
      "proposta",
      "acordo",
      "quantidade"
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
      "trâmite burocrático",
      "concorrência",
      "força; fortaleza"
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
      "amizade",
      "desvantagem",
      "vantagem"
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
      "orçamento",
      "perda",
      "mal-entendido"
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
      "imposto",
      "medida; medição",
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
      "solicitação",
      "atitude",
      "prazo; parcela"
    ]
  },
  "fvocab-483": {
    "prompt": "¿Cómo se dice 'relação' en español?",
    "promptNative": "Como se diz 'relação' em espanhol?"
  },
  "fvocab-484": {
    "promptNative": "'El compromiso' significa...",
    "options": [
      "compromisso; noivado",
      "desvantagem",
      "ameaça",
      "proposta"
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
      "prazo; parcela",
      "lucro",
      "dívida"
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
      "proposta",
      "ferramenta",
      "fraqueza"
    ]
  },
  "fvocab-489": {
    "prompt": "¿Cómo se dice 'proposta' en español?",
    "promptNative": "Como se diz 'proposta' em espanhol?"
  },
  "fvocab-490": {
    "promptNative": "'La solicitud' significa...",
    "options": [
      "solicitação",
      "média",
      "habilidade",
      "mal-entendido"
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
      "perda",
      "desacordo",
      "ferramenta"
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
      "exibir-se; gabar-se",
      "enfrentar; confrontar",
      "piorar"
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
      "ampliar; expandir",
      "enfrentar; confrontar",
      "substituir; repor"
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
      "disfarçar (sentimentos); dissimular",
      "demitir; despedir-se",
      "empreender; iniciar (um empreendimento)"
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
      "aumentar",
      "avisar",
      "piorar"
    ]
  },
  "fvocab-501": {
    "prompt": "¿Cómo se dice 'substituir' en español?",
    "promptNative": "Como se diz 'substituir' em espanhol?"
  },
  "fvocab-502": {
    "promptNative": "'Reemplazar' significa...",
    "options": [
      "substituir; repor",
      "reivindicar; reclamar formalmente",
      "supor; presumir",
      "assumir (responsabilidade)"
    ]
  },
  "fvocab-503": {
    "prompt": "¿Cómo se dice 'atualizar' en español?",
    "promptNative": "Como se diz 'atualizar' em espanhol?"
  },
  "fvocab-504": {
    "promptNative": "'Averiguar' significa...",
    "options": [
      "averiguar; investigar",
      "supor; presumir",
      "levantar (uma questão); propor",
      "exigir"
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
      "disfarçar (sentimentos); dissimular",
      "aumentar",
      "substituir"
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
      "arriscar",
      "renunciar; desistir",
      "exigir"
    ]
  },
  "fvocab-509": {
    "prompt": "¿Cómo se dice 'sugerir' en español?",
    "promptNative": "Como se diz 'sugerir' em espanhol?"
  },
  "fvocab-510": {
    "promptNative": "'Advertir' significa...",
    "options": [
      "avisar",
      "desenvolver",
      "substituir; repor",
      "aposentar-se"
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
      "supor; presumir",
      "assumir (responsabilidade)",
      "apontar; assinalar"
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
      "substituir; repor",
      "piorar",
      "melhorar"
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
      "abranger; abarcar",
      "enfrentar; confrontar",
      "avisar"
    ]
  },
  "fvocab-517": {
    "prompt": "¿Cómo se dice 'empreender; iniciar (um empreendimento)' en español?",
    "promptNative": "Como se diz 'empreender; iniciar (um empreendimento)' em espanhol?"
  },
  "fvocab-518": {
    "promptNative": "'Arriesgar' significa...",
    "options": [
      "arriscar",
      "supor; presumir",
      "sugerir",
      "atualizar"
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
      "abranger; abarcar",
      "superar; ultrapassar",
      "arriscar"
    ]
  },
  "fvocab-521": {
    "prompt": "¿Cómo se dice 'fingir' en español?",
    "promptNative": "Como se diz 'fingir' em espanhol?"
  },
  "fvocab-522": {
    "promptNative": "'Disimular' significa...",
    "options": [
      "disfarçar (sentimentos); dissimular",
      "fingir",
      "verificar; conferir",
      "propor"
    ]
  },
  "fvocab-523": {
    "prompt": "¿Cómo se dice 'superar; ultrapassar' en español?",
    "promptNative": "Como se diz 'superar; ultrapassar' em espanhol?"
  },
  "fvocab-524": {
    "promptNative": "'Enfrentar' significa...",
    "options": [
      "enfrentar; confrontar",
      "ampliar; expandir",
      "melhorar",
      "substituir"
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
      "avisar",
      "sugerir",
      "empreender; iniciar (um empreendimento)"
    ]
  },
  "fvocab-527": {
    "prompt": "¿Cómo se dice 'abranger; abarcar' en español?",
    "promptNative": "Como se diz 'abranger; abarcar' em espanhol?"
  },
  "fvocab-528": {
    "promptNative": "'Destacar' significa...",
    "options": [
      "destacar-se; ressaltar",
      "apontar; assinalar",
      "empreender; iniciar (um empreendimento)",
      "demitir; despedir-se"
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
      "exaustivo",
      "eficaz",
      "abundante"
    ]
  },
  "fvocab-531": {
    "prompt": "¿Cómo se dice 'gratuito' en español?",
    "promptNative": "Como se diz 'gratuito' em espanhol?"
  },
  "fvocab-532": {
    "promptNative": "'Rentable' significa...",
    "options": [
      "rentável",
      "exigente",
      "prévio; anterior",
      "abundante"
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
      "mútuo",
      "gratuito",
      "exigente"
    ]
  },
  "fvocab-535": {
    "prompt": "¿Cómo se dice 'exigente' en español?",
    "promptNative": "Como se diz 'exigente' em espanhol?"
  },
  "fvocab-536": {
    "promptNative": "'Agotado' significa...",
    "options": [
      "exausto; esgotado (vendido)",
      "eficiente",
      "exigente",
      "disponível"
    ]
  },
  "fvocab-537": {
    "prompt": "¿Cómo se dice 'exaustivo' en español?",
    "promptNative": "Como se diz 'exaustivo' em espanhol?"
  },
  "fvocab-538": {
    "promptNative": "'Imprevisto' significa...",
    "options": [
      "imprevisto",
      "exigente",
      "prévio; anterior",
      "exaustivo"
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
      "exigente",
      "gratuito",
      "exausto; esgotado (vendido)"
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
      "rentável",
      "exausto; esgotado (vendido)",
      "gratuito"
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
      "exigente",
      "eficiente",
      "eficaz"
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
      "ambiente; arredores",
      "abordagem; formulação"
    ]
  },
  "fvocab-547": {
    "prompt": "¿Cómo se dice 'ânsia; empenho' en español?",
    "promptNative": "Como se diz 'ânsia; empenho' em espanhol?"
  },
  "fvocab-548": {
    "promptNative": "'El empeño' significa...",
    "options": [
      "determinação; persistência",
      "indício; sinal",
      "lacuna; brecha",
      "saudade"
    ]
  },
  "fvocab-549": {
    "prompt": "¿Cómo se dice 'desempenho' en español?",
    "promptNative": "Como se diz 'desempenho' em espanhol?"
  },
  "fvocab-550": {
    "promptNative": "'El logro' significa...",
    "options": [
      "conquista",
      "determinação; persistência",
      "anseio; desejo profundo",
      "limiar"
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
      "nuance; matiz",
      "âmbito; campo (domínio)"
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
      "desempenho",
      "determinação; persistência",
      "indício; sinal"
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
      "saudade",
      "achado; descoberta",
      "limiar"
    ]
  },
  "fvocab-557": {
    "prompt": "¿Cómo se dice 'âmbito; campo (domínio)' en español?",
    "promptNative": "Como se diz 'âmbito; campo (domínio)' em espanhol?"
  },
  "fvocab-558": {
    "promptNative": "'El entorno' significa...",
    "options": [
      "ambiente; arredores",
      "declínio",
      "traço; característica",
      "auge; pico"
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
      "incerteza",
      "achado; descoberta",
      "conquista"
    ]
  },
  "fvocab-561": {
    "prompt": "¿Cómo se dice 'enraizamento' en español?",
    "promptNative": "Como se diz 'enraizamento' em espanhol?"
  },
  "fvocab-562": {
    "promptNative": "'La añoranza' significa...",
    "options": [
      "saudade",
      "declínio",
      "anseio; desejo profundo",
      "desempenho"
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
      "suspeita",
      "enraizamento",
      "anseio; desejo profundo"
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
      "auge; pico",
      "ânsia; empenho",
      "abordagem; formulação"
    ]
  },
  "fvocab-567": {
    "prompt": "¿Cómo se dice 'indício; sinal' en español?",
    "promptNative": "Como se diz 'indício; sinal' em espanhol?"
  },
  "fvocab-568": {
    "promptNative": "'El hallazgo' significa...",
    "options": [
      "achado; descoberta",
      "âmbito; campo (domínio)",
      "ânsia; empenho",
      "nuance; matiz"
    ]
  },
  "fvocab-569": {
    "prompt": "¿Cómo se dice 'abordagem; formulação' en español?",
    "promptNative": "Como se diz 'abordagem; formulação' em espanhol?"
  },
  "fvocab-570": {
    "promptNative": "'El enfoque' significa...",
    "options": [
      "foco; ângulo",
      "enraizamento",
      "saudade",
      "marco"
    ]
  },
  "fvocab-571": {
    "prompt": "¿Cómo se dice 'postura; posição (opinião)' en español?",
    "promptNative": "Como se diz 'postura; posição (opinião)' em espanhol?"
  },
  "fvocab-572": {
    "promptNative": "'Plasmar' significa...",
    "options": [
      "dar forma a; retratar (numa obra)",
      "contornar (um assunto)",
      "sopesar; ponderar",
      "fomentar; incentivar"
    ]
  },
  "fvocab-573": {
    "prompt": "¿Cómo se dice 'esboçar; delinear' en español?",
    "promptNative": "Como se diz 'esboçar; delinear' em espanhol?"
  },
  "fvocab-574": {
    "promptNative": "'Vislumbrar' significa...",
    "options": [
      "vislumbrar; começar a ver",
      "desmembrar; detalhar",
      "violar (direitos, regras)",
      "reunir; coletar (informação/apoio)"
    ]
  },
  "fvocab-575": {
    "prompt": "¿Cómo se dice 'sopesar; ponderar' en español?",
    "promptNative": "Como se diz 'sopesar; ponderar' em espanhol?"
  },
  "fvocab-576": {
    "promptNative": "'Desglosar' significa...",
    "options": [
      "desmembrar; detalhar",
      "minar; solapar",
      "contornar (um assunto)",
      "amenizar; mitigar"
    ]
  },
  "fvocab-577": {
    "prompt": "¿Cómo se dice 'reunir; coletar (informação/apoio)' en español?",
    "promptNative": "Como se diz 'reunir; coletar (informação/apoio)' em espanhol?"
  },
  "fvocab-578": {
    "promptNative": "'Aludir' significa...",
    "options": [
      "aludir",
      "minar; solapar",
      "esboçar; delinear",
      "fomentar; incentivar"
    ]
  },
  "fvocab-579": {
    "prompt": "¿Cómo se dice 'evadir; esquivar' en español?",
    "promptNative": "Como se diz 'evadir; esquivar' em espanhol?"
  },
  "fvocab-580": {
    "promptNative": "'Soslayar' significa...",
    "options": [
      "contornar (um assunto)",
      "amenizar; mitigar",
      "vislumbrar; começar a ver",
      "iniciar (uma conversa, uma amizade)"
    ]
  },
  "fvocab-581": {
    "prompt": "¿Cómo se dice 'amenizar; mitigar' en español?",
    "promptNative": "Como se diz 'amenizar; mitigar' em espanhol?"
  },
  "fvocab-582": {
    "promptNative": "'Mermar' significa...",
    "options": [
      "diminuir; corroer",
      "propiciar; favorecer",
      "vislumbrar; começar a ver",
      "amenizar; mitigar"
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
      "sanar; remediar",
      "contornar (um assunto)",
      "iniciar (uma conversa, uma amizade)"
    ]
  },
  "fvocab-585": {
    "prompt": "¿Cómo se dice 'fomentar; incentivar' en español?",
    "promptNative": "Como se diz 'fomentar; incentivar' em espanhol?"
  },
  "fvocab-586": {
    "promptNative": "'Entablar' significa...",
    "options": [
      "iniciar (uma conversa, uma amizade)",
      "propiciar; favorecer",
      "minar; solapar",
      "evadir; esquivar"
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
      "contornar (um assunto)",
      "acatar; cumprir",
      "sopesar; ponderar"
    ]
  },
  "fvocab-589": {
    "prompt": "¿Cómo se dice 'sanar; remediar' en español?",
    "promptNative": "Como se diz 'sanar; remediar' em espanhol?"
  },
  "fvocab-590": {
    "promptNative": "'Escueto' significa...",
    "options": [
      "sucinto; enxuto",
      "sumário; superficial",
      "insólito; extraordinário",
      "idôneo; ideal"
    ]
  },
  "fvocab-591": {
    "prompt": "¿Cómo se dice 'sumário; superficial' en español?",
    "promptNative": "Como se diz 'sumário; superficial' em espanhol?"
  },
  "fvocab-592": {
    "promptNative": "'Férreo' significa...",
    "options": [
      "férreo; inflexível",
      "sucinto; enxuto",
      "vertiginoso",
      "idôneo; ideal"
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
      "sucinto; enxuto",
      "férreo; inflexível"
    ]
  },
  "fvocab-595": {
    "prompt": "¿Cómo se dice 'gradual' en español?",
    "promptNative": "Como se diz 'gradual' em espanhol?"
  },
  "fvocab-596": {
    "promptNative": "'Vertiginoso' significa...",
    "options": [
      "vertiginoso",
      "querido; comovente",
      "idôneo; ideal",
      "insólito; extraordinário"
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
      "perene; duradouro",
      "sucinto; enxuto",
      "vertiginoso"
    ]
  },
  "fvocab-599": {
    "prompt": "¿Cómo se dice 'querido; comovente' en español?",
    "promptNative": "Como se diz 'querido; comovente' em espanhol?"
  },
  "fvocab-600": {
    "promptNative": "'Huraño' significa...",
    "options": [
      "arredio; insociável",
      "insólito; extraordinário",
      "querido; comovente",
      "precário"
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
      "sucinto; enxuto",
      "nefasto; desastroso",
      "arredio; insociável"
    ]
  },
  "fvocab-603": {
    "prompt": "¿Cómo se dice 'idôneo; ideal' en español?",
    "promptNative": "Como se diz 'idôneo; ideal' em espanhol?"
  },
  "fvocab-604": {
    "promptNative": "'Nefasto' significa...",
    "options": [
      "nefasto; desastroso",
      "precário",
      "categórico; taxativo",
      "sucinto; enxuto"
    ]
  },
  "fvocab-605": {
    "prompt": "¿Cómo se dice 'insólito; extraordinário' en español?",
    "promptNative": "Como se diz 'insólito; extraordinário' em espanhol?"
  },
  "fvocab-606": {
    "promptNative": "'Verosímil' significa...",
    "options": [
      "verossímil; plausível",
      "descomunal; colossal",
      "afável; cordial",
      "querido; comovente"
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
      "efêmero; passageiro",
      "insólito; extraordinário",
      "férreo; inflexível"
    ]
  }
};
