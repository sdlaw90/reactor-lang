// v3.1 — CENTRAL regional-variant map (dual-version card / U4), PER SOURCE LANGUAGE.
//
// SINGLE SOURCE OF TRUTH for every language's LatAm/Spain-style regional splits.
// Add/edit a word under its source-language block and it auto-applies everywhere the
// word is a correct answer (Word Bank + curated vocab + future content) — no per-item
// tagging. The play page calls regionalVariantFor(sourceLang, correctAnswer) after
// buildRound and attaches the record; the card personalizes by the learner's
// native_country.
//
// ADDING A NEW SOURCE LANGUAGE = DATA ONLY (no engine change): fill that language's
//   `records: []` below. Each block already carries its reference variety, its
//   regional-group label, its in-language card chrome (`ui`), and its country names.
//   See the build playbook: claude/squirrelingo_native_source_build_playbook.md.
//
// record shape: { gloss, reference, default, regional: [ { term, countries:[ISO], label } ] }
//   reference — the "counterpart" variety's term (e.g. Spain / Portugal / France / DE).
//   default   — the term shown when the learner's country isn't listed in `regional`.
//   The card highlights the learner's-country term (or `default`), shows the other
//   side as "<refPhrase|regGroupPhrase>: …", and self-suppresses when they're equal.
//
// ⚠️ es fully populated (first-pass, #41 review). pt/fr/de = rock-solid SEEDS only.
//    it/ru/ja/ko/zh/en = scaffolding + notes (populate per build). All flagged.

function norm(s) {
  return (s || "")
    .toLowerCase()
    .trim()
    .replace(/^(el|la|los|las|un|una|o|a|os|as|le|la|les|der|die|das)\s+/, "")
    .replace(/\s*[;(/].*$/, "")
    .trim();
}

const LANGS = {
  es: {
    reference: { code: "ES", label: "España" },
    regionalGroupLabel: "Latinoamérica",
    ui: { title: "También se dice", inYourRegion: "en tu región", variantes: "variantes regionales", hide: "ocultar", refPhrase: "En España", regGroupPhrase: "En Latinoamérica", refFlag: "🇪🇸", regFlag: "🌎" },
    countryNames: { MX: "México", GT: "Guatemala", HN: "Honduras", SV: "El Salvador", NI: "Nicaragua", CR: "Costa Rica", PA: "Panamá", CU: "Cuba", DO: "Rep. Dominicana", PR: "Puerto Rico", CO: "Colombia", VE: "Venezuela", EC: "Ecuador", PE: "Perú", BO: "Bolivia", CL: "Chile", AR: "Argentina", UY: "Uruguay", PY: "Paraguay", ES: "España" },
    records: [
    { gloss: "car", reference: "coche", default: "carro", regional: [
      { term: "carro", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE", "EC", "PE"], label: "Méx·CA·Andes" },
      { term: "auto", countries: ["AR", "UY", "PY", "CL", "BO"], label: "Cono Sur" },
    ]},
    { gloss: "to drive", reference: "conducir", default: "manejar", regional: [
      { term: "manejar", countries: [], label: "LatAm" },
    ]},
    { gloss: "ticket (bus/event)", reference: "billete", default: "boleto", regional: [
      { term: "boleto", countries: [], label: "LatAm" },
    ]},
    { gloss: "tire", reference: "neumático", default: "llanta", regional: [
      { term: "llanta", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CO", "VE", "EC", "PE", "BO"], label: "Méx·Andes" },
      { term: "goma", countries: ["AR", "UY", "PY", "CU", "DO", "PR"], label: "Cono Sur·Caribe" },
      { term: "neumático", countries: ["CL"], label: "Chile" },
    ]},
    { gloss: "car trunk", reference: "maletero", default: "baúl", regional: [
      { term: "cajuela", countries: ["MX"], label: "Méx" },
      { term: "baúl", countries: ["AR", "UY", "PY", "CO", "VE", "CU", "DO", "PR"], label: "Cono Sur·Andes·Caribe" },
      { term: "maletera", countries: ["PE", "EC", "CL", "BO"], label: "Perú·Chile" },
    ]},
    { gloss: "to park", reference: "aparcar", default: "estacionar", regional: [
      { term: "estacionar", countries: ["MX", "AR", "UY", "PY", "CL", "PE", "EC", "BO"], label: "Méx·Cono Sur·Andes" },
      { term: "parquear", countries: ["CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA", "CO", "VE"], label: "Caribe·CA·Col" },
    ]},
    { gloss: "parking lot", reference: "aparcamiento", default: "estacionamiento", regional: [
      { term: "estacionamiento", countries: ["MX", "AR", "UY", "PY", "CL", "PE", "EC", "BO"], label: "Méx·Cono Sur" },
      { term: "parqueadero", countries: ["CO", "PA", "EC"], label: "Col·Pan" },
      { term: "parqueo", countries: ["GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "VE"], label: "CA·Caribe" },
    ]},
    { gloss: "driver's license", reference: "carné de conducir", default: "licencia de conducir", regional: [
      { term: "licencia de conducir", countries: [], label: "LatAm" },
    ]},
    { gloss: "city block", reference: "manzana", default: "cuadra", regional: [
      { term: "cuadra", countries: [], label: "LatAm" },
    ]},
    { gloss: "gas / fuel", reference: "gasolina", default: "gasolina", regional: [
      { term: "gasolina", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE", "EC", "PE"], label: "Méx·Andes" },
      { term: "nafta", countries: ["AR", "UY", "PY", "BO"], label: "Cono Sur" },
      { term: "bencina", countries: ["CL"], label: "Chile" },
    ]},
    { gloss: "juice", reference: "zumo", default: "jugo", regional: [
      { term: "jugo", countries: [], label: "LatAm" },
    ]},
    { gloss: "potato", reference: "patata", default: "papa", regional: [
      { term: "papa", countries: [], label: "LatAm" },
    ]},
    { gloss: "peach", reference: "melocotón", default: "durazno", regional: [
      { term: "durazno", countries: [], label: "LatAm" },
    ]},
    { gloss: "strawberry", reference: "fresa", default: "frutilla", regional: [
      { term: "fresa", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE", "EC", "PE"], label: "Méx·Andes" },
      { term: "frutilla", countries: ["AR", "UY", "PY", "CL", "BO"], label: "Cono Sur" },
    ]},
    { gloss: "avocado", reference: "aguacate", default: "aguacate", regional: [
      { term: "aguacate", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE"], label: "Méx·Caribe" },
      { term: "palta", countries: ["PE", "CL", "AR", "UY", "BO", "EC"], label: "Andes·Cono Sur" },
    ]},
    { gloss: "peanut", reference: "cacahuete", default: "maní", regional: [
      { term: "maní", countries: ["CU", "DO", "PR", "CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL"], label: "casi toda LatAm" },
      { term: "cacahuate", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
    ]},
    { gloss: "shrimp / prawn", reference: "gamba", default: "camarón", regional: [
      { term: "camarón", countries: [], label: "LatAm" },
    ]},
    { gloss: "chili pepper", reference: "guindilla", default: "ají", regional: [
      { term: "ají", countries: ["CU", "DO", "PR", "CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL"], label: "Caribe·Andes·Cono Sur" },
      { term: "chile", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
    ]},
    { gloss: "corn on the cob", reference: "mazorca", default: "elote", regional: [
      { term: "elote", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
      { term: "choclo", countries: ["CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL"], label: "Andes·Cono Sur" },
    ]},
    { gloss: "beet", reference: "remolacha", default: "remolacha", regional: [
      { term: "betabel", countries: ["MX"], label: "Méx" },
      { term: "remolacha", countries: ["GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY"], label: "gran parte de LatAm" },
      { term: "betarraga", countries: ["CL", "BO", "PE"], label: "Chile·Perú" },
    ]},
    { gloss: "banana", reference: "plátano", default: "banana", regional: [
      { term: "banana", countries: ["AR", "UY", "PY", "CO"], label: "Cono Sur·Col" },
      { term: "guineo", countries: ["CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA", "EC"], label: "Caribe·CA" },
      { term: "cambur", countries: ["VE"], label: "Ven" },
      { term: "plátano", countries: ["MX", "PE", "CL", "BO"], label: "Méx·Perú" },
    ]},
    { gloss: "refrigerator", reference: "frigorífico", default: "refrigerador", regional: [
      { term: "refrigerador", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CL", "PE", "EC", "BO"], label: "Méx·Chile·Perú" },
      { term: "nevera", countries: ["CU", "DO", "PR", "CO", "VE", "PA"], label: "Caribe·Col·Ven" },
      { term: "heladera", countries: ["AR", "UY", "PY"], label: "Cono Sur" },
    ]},
    { gloss: "apartment / flat", reference: "piso", default: "departamento", regional: [
      { term: "departamento", countries: ["MX", "PE", "CL", "AR", "UY", "PY", "BO", "EC"], label: "Méx·Andes·Cono Sur" },
      { term: "apartamento", countries: ["CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA", "CO", "VE"], label: "Caribe·CA·Col" },
    ]},
    { gloss: "bedroom", reference: "dormitorio", default: "cuarto", regional: [
      { term: "recámara", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
      { term: "cuarto", countries: ["CU", "DO", "PR", "CO", "VE", "EC", "PE"], label: "Caribe·Andes" },
      { term: "pieza", countries: ["CL", "AR", "UY"], label: "Chile·Río de la Plata" },
    ]},
    { gloss: "swimming pool", reference: "piscina", default: "piscina", regional: [
      { term: "alberca", countries: ["MX"], label: "Méx" },
      { term: "piscina", countries: ["GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE", "EC", "PE", "BO", "CL"], label: "CA·Andes·Chile" },
      { term: "pileta", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
    ]},
    { gloss: "grass / lawn", reference: "césped", default: "pasto", regional: [
      { term: "pasto", countries: ["MX", "AR", "UY", "PY", "CL", "PE", "BO", "EC"], label: "Méx·Cono Sur·Andes" },
      { term: "zacate", countries: ["GT", "HN", "SV", "NI", "CR", "PA"], label: "CA" },
      { term: "grama", countries: ["CU", "DO", "PR", "CO", "VE"], label: "Caribe·Col·Ven" },
    ]},
    { gloss: "blanket", reference: "manta", default: "cobija", regional: [
      { term: "cobija", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE"], label: "Méx·Caribe·Col" },
      { term: "frazada", countries: ["EC", "PE", "BO", "AR", "UY", "PY", "CL"], label: "Andes·Cono Sur" },
    ]},
    { gloss: "lightbulb", reference: "bombilla", default: "foco", regional: [
      { term: "foco", countries: ["MX", "PE", "EC", "BO", "AR", "UY", "PY"], label: "Méx·Andes·Río de la Plata" },
      { term: "bombillo", countries: ["CO", "VE", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR"], label: "Col·Ven·CA·Caribe" },
      { term: "ampolleta", countries: ["CL"], label: "Chile" },
    ]},
    { gloss: "closet / wardrobe", reference: "armario", default: "clóset", regional: [
      { term: "clóset", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE", "EC", "PE", "CL", "BO"], label: "Méx·Caribe·Andes·Chile" },
      { term: "placard", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
    ]},
    { gloss: "t-shirt", reference: "camiseta", default: "playera", regional: [
      { term: "playera", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
      { term: "remera", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
      { term: "polera", countries: ["CL", "BO"], label: "Chile·Bol" },
      { term: "franela", countries: ["VE"], label: "Ven" },
      { term: "camiseta", countries: ["CO", "PE", "EC", "CU", "DO", "PR"], label: "Col·Andes·Caribe" },
    ]},
    { gloss: "jacket", reference: "cazadora", default: "chamarra", regional: [
      { term: "chamarra", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
      { term: "campera", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
      { term: "casaca", countries: ["PE", "BO"], label: "Perú·Bol" },
      { term: "chaqueta", countries: ["CO", "VE", "EC", "CL", "CU", "DO", "PR"], label: "Col·Andes·Chile·Caribe" },
    ]},
    { gloss: "sweater", reference: "jersey", default: "suéter", regional: [
      { term: "suéter", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "CO", "VE"], label: "Méx·Caribe·Col" },
      { term: "chompa", countries: ["PE", "EC", "BO"], label: "Andes" },
      { term: "pulóver", countries: ["AR", "UY"], label: "Río de la Plata" },
      { term: "chomba", countries: ["CL"], label: "Chile" },
    ]},
    { gloss: "earrings", reference: "pendientes", default: "aretes", regional: [
      { term: "aretes", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CO", "PE", "EC"], label: "Méx·CA·Col" },
      { term: "aros", countries: ["AR", "UY", "CL", "PY"], label: "Cono Sur" },
      { term: "zarcillos", countries: ["VE"], label: "Ven" },
      { term: "pantallas", countries: ["CU", "DO", "PR"], label: "Caribe" },
    ]},
    { gloss: "glasses (eyewear)", reference: "gafas", default: "lentes", regional: [
      { term: "lentes", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CL", "PE", "EC", "BO"], label: "Méx·Chile·Andes" },
      { term: "anteojos", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
      { term: "gafas", countries: ["CO", "VE"], label: "Col·Ven" },
      { term: "espejuelos", countries: ["CU"], label: "Cuba" },
    ]},
    { gloss: "cell phone", reference: "móvil", default: "celular", regional: [
      { term: "celular", countries: [], label: "LatAm" },
    ]},
    { gloss: "computer", reference: "ordenador", default: "computadora", regional: [
      { term: "computadora", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR", "AR", "UY", "PY", "PE", "BO"], label: "Méx·Caribe·Río de la Plata" },
      { term: "computador", countries: ["CO", "VE", "EC", "CL"], label: "Col·Ven·Chile" },
    ]},
    { gloss: "laptop", reference: "portátil", default: "laptop", regional: [
      { term: "laptop", countries: [], label: "LatAm" },
    ]},
    { gloss: "speaker (audio)", reference: "altavoz", default: "parlante", regional: [
      { term: "bocina", countries: ["MX", "CU", "DO", "PR"], label: "Méx·Caribe" },
      { term: "parlante", countries: ["CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Andes·Cono Sur·CA" },
    ]},
    { gloss: "money (informal)", reference: "pasta", default: "plata", regional: [
      { term: "plata", countries: ["CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL", "CU", "DO", "PR"], label: "Andes·Cono Sur·Caribe" },
      { term: "lana", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
    ]},
    { gloss: "rent", reference: "alquiler", default: "renta", regional: [
      { term: "renta", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR"], label: "Méx·CA·Caribe" },
      { term: "arriendo", countries: ["CL", "CO"], label: "Chile·Col" },
      { term: "alquiler", countries: ["AR", "UY", "PY", "PE", "VE", "EC", "BO"], label: "Cono Sur·Andes" },
    ]},
    { gloss: "to rent", reference: "alquilar", default: "rentar", regional: [
      { term: "rentar", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR"], label: "Méx·CA·Caribe" },
      { term: "arrendar", countries: ["CL", "CO"], label: "Chile·Col" },
      { term: "alquilar", countries: ["AR", "UY", "PY", "PE", "VE", "EC", "BO"], label: "Cono Sur·Andes" },
    ]},
    { gloss: "postage stamp", reference: "sello", default: "estampilla", regional: [
      { term: "estampilla", countries: ["CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL", "CU", "DO", "PR"], label: "Andes·Cono Sur·Caribe" },
      { term: "timbre", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
    ]},
    { gloss: "waiter", reference: "camarero", default: "mesero", regional: [
      { term: "mesero", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CO", "VE", "EC", "CU", "DO", "PR"], label: "Méx·CA·Col" },
      { term: "mozo", countries: ["AR", "UY", "PY", "PE"], label: "Río de la Plata·Perú" },
      { term: "garzón", countries: ["CL"], label: "Chile" },
    ]},
    { gloss: "plumber", reference: "fontanero", default: "plomero", regional: [
      { term: "plomero", countries: [], label: "LatAm" },
    ]},
    { gloss: "to miss (someone)", reference: "echar de menos", default: "extrañar", regional: [
      { term: "extrañar", countries: [], label: "LatAm" },
    ]},
    { gloss: "to turn on", reference: "encender", default: "prender", regional: [
      { term: "prender", countries: [], label: "LatAm" },
    ]},
    { gloss: "to hurry", reference: "darse prisa", default: "apurarse", regional: [
      { term: "apurarse", countries: [], label: "LatAm" },
    ]},
    { gloss: "to get angry", reference: "enfadarse", default: "enojarse", regional: [
      { term: "enojarse", countries: [], label: "LatAm" },
    ]},
    { gloss: "to chat", reference: "charlar", default: "platicar", regional: [
      { term: "platicar", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
      { term: "conversar", countries: ["CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL", "CU", "DO", "PR"], label: "resto de LatAm" },
    ]},
    { gloss: "to throw away", reference: "tirar", default: "botar", regional: [
      { term: "botar", countries: ["CO", "VE", "EC", "PE", "BO", "CL", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Andes·Chile·Caribe·CA" },
      { term: "tirar", countries: ["MX", "AR", "UY", "PY"], label: "Méx·Río de la Plata" },
    ]},
    { gloss: "to grab / take", reference: "coger", default: "agarrar", regional: [
      { term: "agarrar", countries: [], label: "LatAm" },
    ]},
    { gloss: "popcorn", reference: "palomitas", default: "palomitas de maíz", regional: [
      { term: "palomitas", countries: ["MX"], label: "Méx" },
      { term: "pochoclo", countries: ["AR"], label: "Argentina" },
      { term: "pororó", countries: ["PY"], label: "Paraguay" },
      { term: "cotufas", countries: ["VE"], label: "Venezuela" },
      { term: "cabritas", countries: ["CL"], label: "Chile" },
      { term: "canchita", countries: ["PE"], label: "Perú" },
      { term: "crispetas", countries: ["CO"], label: "Colombia" },
      { term: "poporopo", countries: ["GT"], label: "Guatemala" },
    ]},
    { gloss: "beans", reference: "judías / alubias", default: "frijoles", regional: [
      { term: "frijoles", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CO"], label: "Méx·CA·Col" },
      { term: "porotos", countries: ["AR", "UY", "PY", "CL", "BO"], label: "Cono Sur·Bol" },
      { term: "caraotas", countries: ["VE"], label: "Venezuela" },
      { term: "habichuelas", countries: ["CU", "DO", "PR"], label: "Caribe" },
      { term: "frejoles", countries: ["PE", "EC"], label: "Perú·Ecuador" },
    ]},
    { gloss: "peas", reference: "guisantes", default: "arvejas", regional: [
      { term: "arvejas", countries: ["CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL"], label: "Andes·Cono Sur·Col" },
      { term: "chícharos", countries: ["MX", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA·Caribe" },
    ]},
    { gloss: "drinking straw", reference: "pajita", default: "sorbete", regional: [
      { term: "popote", countries: ["MX"], label: "Méx" },
      { term: "pitillo", countries: ["CO", "VE"], label: "Col·Ven" },
      { term: "sorbete", countries: ["CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Caribe·CA" },
      { term: "cañita", countries: ["PE"], label: "Perú" },
      { term: "pajita", countries: ["AR", "UY", "PY", "BO", "EC"], label: "Cono Sur·Andes" },
    ]},
    { gloss: "cake", reference: "tarta", default: "torta", regional: [
      { term: "pastel", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CU", "DO", "PR"], label: "Méx·CA·Caribe" },
      { term: "torta", countries: ["AR", "UY", "PY", "CL", "BO", "CO", "VE", "EC", "PE"], label: "Cono Sur·Andes·Col" },
    ]},
    { gloss: "soft drink / soda", reference: "refresco", default: "gaseosa", regional: [
      { term: "refresco", countries: ["MX", "CU", "DO", "PR", "GT", "HN", "SV", "NI"], label: "Méx·Caribe·CA" },
      { term: "gaseosa", countries: ["CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CR", "PA"], label: "Andes·Cono Sur" },
      { term: "bebida", countries: ["CL"], label: "Chile" },
    ]},
    { gloss: "grapefruit", reference: "pomelo", default: "toronja", regional: [
      { term: "toronja", countries: ["MX", "CO", "VE", "EC", "PE", "BO", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·Andes·Caribe·CA" },
      { term: "pomelo", countries: ["AR", "UY", "PY", "CL"], label: "Cono Sur" },
    ]},
    { gloss: "faucet / tap", reference: "grifo", default: "llave", regional: [
      { term: "llave", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA", "CO", "VE", "EC", "CL", "BO"], label: "Méx·CA·Col·Andes·Chile" },
      { term: "canilla", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
      { term: "caño", countries: ["PE"], label: "Perú" },
    ]},
    { gloss: "bucket", reference: "cubo", default: "balde", regional: [
      { term: "cubeta", countries: ["MX"], label: "Méx" },
      { term: "tobo", countries: ["VE"], label: "Venezuela" },
      { term: "balde", countries: ["AR", "UY", "PY", "CL", "PE", "EC", "BO", "CO", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "resto de LatAm" },
    ]},
    { gloss: "sidewalk", reference: "acera", default: "vereda", regional: [
      { term: "banqueta", countries: ["MX", "GT"], label: "Méx·Guat" },
      { term: "vereda", countries: ["AR", "UY", "PY", "CL", "PE", "BO", "EC"], label: "Cono Sur·Andes" },
      { term: "acera", countries: ["CO", "VE", "CU", "DO", "PR", "HN", "SV", "NI", "CR", "PA"], label: "Col·Ven·Caribe·CA" },
    ]},
    { gloss: "stove", reference: "cocina", default: "estufa", regional: [
      { term: "estufa", countries: ["MX", "CO", "VE", "EC", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·Col·Andes·Caribe·CA" },
      { term: "cocina", countries: ["AR", "UY", "PY", "CL", "BO", "PE"], label: "Cono Sur·Bol·Perú" },
    ]},
    { gloss: "sneakers", reference: "zapatillas", default: "zapatillas", regional: [
      { term: "tenis", countries: ["MX", "CO", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·Col·CA" },
      { term: "zapatillas", countries: ["AR", "PY", "CL", "PE", "BO", "EC"], label: "Cono Sur·Andes" },
      { term: "championes", countries: ["UY"], label: "Uruguay" },
      { term: "zapatos de goma", countries: ["VE", "CU", "DO", "PR"], label: "Ven·Caribe" },
    ]},
    { gloss: "socks", reference: "calcetines", default: "medias", regional: [
      { term: "calcetines", countries: ["MX", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·CA" },
      { term: "medias", countries: ["CO", "VE", "EC", "PE", "BO", "AR", "UY", "PY", "CL", "CU", "DO", "PR"], label: "Col·Andes·Cono Sur·Caribe" },
    ]},
    { gloss: "swimsuit", reference: "bañador", default: "traje de baño", regional: [
      { term: "malla", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
      { term: "vestido de baño", countries: ["CO"], label: "Colombia" },
      { term: "terno de baño", countries: ["PE"], label: "Perú" },
      { term: "traje de baño", countries: ["MX", "VE", "EC", "BO", "CL", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "resto de LatAm" },
    ]},
    { gloss: "bus", reference: "autobús", default: "autobús", regional: [
      { term: "camión", countries: ["MX"], label: "Méx" },
      { term: "guagua", countries: ["CU", "DO", "PR"], label: "Caribe" },
      { term: "colectivo", countries: ["AR", "BO"], label: "Arg·Bol" },
      { term: "micro", countries: ["CL"], label: "Chile" },
      { term: "ómnibus", countries: ["UY"], label: "Uruguay" },
      { term: "bus", countries: ["CO", "EC", "VE", "PE", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Col·Andes·CA" },
    ]},
    { gloss: "bus stop", reference: "parada", default: "parada", regional: [
      { term: "paradero", countries: ["MX", "CO", "PE", "CL", "EC", "PA"], label: "Méx·Col·Andes·Chile·Pan" },
      { term: "parada", countries: ["AR", "UY", "PY", "VE", "BO", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR"], label: "Cono Sur·Ven·Caribe·CA" },
    ]},
    { gloss: "gas station", reference: "gasolinera", default: "gasolinera", regional: [
      { term: "gasolinera", countries: ["MX", "CO", "VE", "EC", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·Col·Andes·Caribe·CA" },
      { term: "estación de servicio", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
      { term: "bencinera", countries: ["CL", "BO"], label: "Chile·Bol" },
    ]},
    { gloss: "job / work (informal)", reference: "curro", default: "trabajo", regional: [
      { term: "chamba", countries: ["MX", "PE"], label: "Méx·Perú" },
      { term: "laburo", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
      { term: "pega", countries: ["CL"], label: "Chile" },
      { term: "trabajo", countries: ["CO", "VE", "EC", "BO", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "resto de LatAm" },
    ]},
    { gloss: "pen", reference: "bolígrafo", default: "lapicero", regional: [
      { term: "pluma", countries: ["MX"], label: "Méx" },
      { term: "birome", countries: ["AR", "UY", "PY"], label: "Río de la Plata" },
      { term: "esfero", countries: ["CO", "EC"], label: "Col·Ecuador" },
      { term: "lápiz pasta", countries: ["CL"], label: "Chile" },
      { term: "lapicero", countries: ["PE", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Perú·CA" },
      { term: "bolígrafo", countries: ["VE", "CU", "DO", "PR", "BO"], label: "Ven·Caribe·Bol" },
    ]},
    { gloss: "eraser", reference: "goma de borrar", default: "borrador", regional: [
      { term: "goma de borrar", countries: ["AR", "UY", "PY", "CL", "PE", "BO", "EC"], label: "Cono Sur·Andes" },
      { term: "borrador", countries: ["MX", "CO", "VE", "CU", "DO", "PR", "GT", "HN", "SV", "NI", "CR", "PA"], label: "Méx·Col·Ven·Caribe·CA" },
    ]},
    ],
  },
  pt: {
    // BR↔PT: the big split. reference=European PT; default=Brazilian. SEED — #41-equiv review.
    reference: { code: "PT", label: "Portugal" },
    regionalGroupLabel: "Brasil",
    ui: { title: "Também se diz", inYourRegion: "na sua região", variantes: "variantes regionais", hide: "ocultar", refPhrase: "Em Portugal", regGroupPhrase: "No Brasil", refFlag: "🇵🇹", regFlag: "🇧🇷" },
    countryNames: { BR: "Brasil", PT: "Portugal", AO: "Angola", MZ: "Moçambique" },
    records: [
    { gloss: "bus", reference: "autocarro", default: "ônibus", regional: [
      { term: "ônibus", countries: ["BR"], label: "Brasil" },
    ]},
    { gloss: "train", reference: "comboio", default: "trem", regional: [
      { term: "trem", countries: ["BR"], label: "Brasil" },
    ]},
    { gloss: "cell phone", reference: "telemóvel", default: "celular", regional: [
      { term: "celular", countries: ["BR"], label: "Brasil" },
    ]},
    { gloss: "breakfast", reference: "pequeno-almoço", default: "café da manhã", regional: [
      { term: "café da manhã", countries: ["BR"], label: "Brasil" },
    ]},
    ],
  },
  fr: {
    // FR↔Québec (+BE/CH minor). reference=France; Québec learners (CA) see the card. SEED.
    reference: { code: "FR", label: "France" },
    regionalGroupLabel: "Québec",
    ui: { title: "On dit aussi", inYourRegion: "dans ta région", variantes: "variantes régionales", hide: "masquer", refPhrase: "En France", regGroupPhrase: "Au Québec", refFlag: "🇫🇷", regFlag: "🇨🇦" },
    countryNames: { FR: "France", CA: "Quebec", BE: "Belgique", CH: "Suisse" },
    records: [
    { gloss: "car", reference: "voiture", default: "voiture", regional: [
      { term: "char", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "girlfriend", reference: "copine", default: "copine", regional: [
      { term: "blonde", countries: ["CA"], label: "Québec" },
    ]},
    ],
  },
  de: {
    // DE↔AT↔CH. reference=Germany; AT/CH learners see the card. SEED.
    reference: { code: "DE", label: "Deutschland" },
    regionalGroupLabel: "Österreich/Schweiz",
    ui: { title: "Man sagt auch", inYourRegion: "in deiner Region", variantes: "regionale Varianten", hide: "ausblenden", refPhrase: "In Deutschland", regGroupPhrase: "In Österreich/der Schweiz", refFlag: "🇩🇪", regFlag: "🇦🇹" },
    countryNames: { DE: "Deutschland", AT: "Österreich", CH: "Schweiz" },
    records: [
    { gloss: "bread roll", reference: "Brötchen", default: "Brötchen", regional: [
      { term: "Semmel", countries: ["AT"], label: "Österreich" },
      { term: "Weggli", countries: ["CH"], label: "Schweiz" },
    ]},
    { gloss: "cream", reference: "Sahne", default: "Sahne", regional: [
      { term: "Obers", countries: ["AT"], label: "Österreich" },
      { term: "Rahm", countries: ["CH"], label: "Schweiz" },
    ]},
    ],
  },
  it: {
    // Little national-level lexical divergence (dialects ≠ a clean binary). Likely sparse.
    reference: { code: "IT", label: "Italia" },
    regionalGroupLabel: "Svizzera",
    ui: { title: "Si dice anche", inYourRegion: "nella tua regione", variantes: "varianti regionali", hide: "nascondi", refPhrase: "In Italia", regGroupPhrase: "In Svizzera", refFlag: "🇮🇹", regFlag: "🇨🇭" },
    countryNames: { IT: "Italia", CH: "Svizzera" },
    records: [], // TODO(vX.x): populate — see docs/regional-variants + build playbook
  },
  ru: {
    // Minimal cross-country russophone lexical divergence. Likely sparse/skip.
    reference: { code: "RU", label: "Россия" },
    regionalGroupLabel: "",
    ui: { title: "Также говорят", inYourRegion: "в вашем регионе", variantes: "региональные варианты", hide: "скрыть", refPhrase: "В России", regGroupPhrase: "В других странах", refFlag: "🇷🇺", regFlag: "🌍" },
    countryNames: { RU: "Россия" },
    records: [], // TODO(vX.x): populate — see docs/regional-variants + build playbook
  },
  ja: {
    // National-standard vs dialect (Kansai etc.) — not a clean national binary. Likely N/A.
    reference: { code: "JP", label: "日本" },
    regionalGroupLabel: "",
    ui: { title: "こうも言います", inYourRegion: "あなたの地域では", variantes: "地域による言い方", hide: "隠す", refPhrase: "標準語では", regGroupPhrase: "他の地域では", refFlag: "🇯🇵", regFlag: "🗾" },
    countryNames: { JP: "日本" },
    records: [], // TODO(vX.x): populate — see docs/regional-variants + build playbook
  },
  ko: {
    // South-standard; dialects regional; NK excluded. Likely sparse.
    reference: { code: "KR", label: "한국" },
    regionalGroupLabel: "",
    ui: { title: "이렇게도 말해요", inYourRegion: "당신의 지역에서는", variantes: "지역별 표현", hide: "숨기기", refPhrase: "표준어로는", regGroupPhrase: "다른 지역에서는", refFlag: "🇰🇷", regFlag: "🌏" },
    countryNames: { KR: "한국" },
    records: [], // TODO(vX.x): populate — see docs/regional-variants + build playbook
  },
  zh: {
    // Mainland↔Taiwan lexical split IS real (软件/軟體 etc.); also simplified/traditional script is a SEPARATE concern. Populate carefully; sensitive.
    reference: { code: "CN", label: "中国大陆" },
    regionalGroupLabel: "台湾",
    ui: { title: "也可以说", inYourRegion: "在你的地区", variantes: "地区变体", hide: "隐藏", refPhrase: "在中国大陆", regGroupPhrase: "在台湾", refFlag: "🇨🇳", regFlag: "🇹🇼" },
    countryNames: { CN: "中国大陆", TW: "台湾" },
    records: [], // TODO(vX.x): populate — see docs/regional-variants + build playbook
  },
  en: {
    // US↔UK (elevator/lift, truck/lorry, apartment/flat…). Populate when en becomes a source.
    reference: { code: "US", label: "the US" },
    regionalGroupLabel: "the UK",
    ui: { title: "Also said", inYourRegion: "in your region", variantes: "regional variants", hide: "hide", refPhrase: "In the US", regGroupPhrase: "In the UK", refFlag: "🇺🇸", regFlag: "🇬🇧" },
    countryNames: { US: "the US", GB: "the UK", AU: "Australia", CA: "Canada" },
    records: [], // TODO(vX.x): populate — see docs/regional-variants + build playbook
  },
};

// ---- build per-language lookup index (normalized term → record) ----
for (const code of Object.keys(LANGS)) {
  const lang = LANGS[code];
  lang.index = new Map();
  for (const rec of lang.records) {
    const keys = new Set([norm(rec.reference), rec.default ? norm(rec.default) : null]);
    for (const v of rec.regional) keys.add(norm(v.term));
    for (const k of keys) {
      if (!k) continue;
      if (!lang.index.has(k)) lang.index.set(k, rec); // first record wins on collision
    }
  }
}

// True when this source language has any regional-variant data.
export function hasRegionalMap(sourceLang) {
  return !!(LANGS[sourceLang] && LANGS[sourceLang].records.length);
}

// Country/region name in the given source language, or null.
export function countryNameFor(sourceLang, code) {
  const l = LANGS[sourceLang];
  return (l && l.countryNames[code]) || null;
}

// The regional-variant record for a correct-answer string in a given source
// language, enriched with that language's reference/labels/chrome for the card.
// Returns null when the language has no map or the answer isn't a known divergence.
export function regionalVariantFor(sourceLang, answerText) {
  const l = LANGS[sourceLang];
  if (!l || !l.index) return null;
  const rec = l.index.get(norm(answerText));
  if (!rec) return null;
  return {
    ...rec,
    referenceCode: l.reference.code,
    referenceLabel: l.reference.label,
    regionalGroupLabel: l.regionalGroupLabel,
    ui: l.ui,
    countryNames: l.countryNames,
    contentTerm: answerText,
  };
}

export const __debug = { LANGS, norm };
