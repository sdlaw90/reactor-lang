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
// ⚠️ es + fr fully populated (first-pass, #41 review). pt/de = rock-solid SEEDS only.
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
    indexRegionalTerms: true,
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
    indexRegionalTerms: true,
    reference: { code: "PT", label: "Portugal" },
    regionalGroupLabel: "Brasil",
    ui: { title: "Também se diz", inYourRegion: "na sua região", variantes: "variantes regionais", hide: "ocultar", refPhrase: "Em Portugal", regGroupPhrase: "No Brasil", refFlag: "🇵🇹", regFlag: "🇧🇷" },
    countryNames: { BR: "Brasil", PT: "Portugal", AO: "Angola", MZ: "Moçambique" },
    records: [
    { gloss: "bus", reference: "autocarro", default: "ônibus", regional: [{ term: "ônibus", countries: ["BR"], label: "Brasil" }] },
    { gloss: "train", reference: "comboio", default: "trem", regional: [{ term: "trem", countries: ["BR"], label: "Brasil" }] },
    { gloss: "cell phone", reference: "telemóvel", default: "celular", regional: [{ term: "celular", countries: ["BR"], label: "Brasil" }] },
    { gloss: "breakfast", reference: "pequeno-almoço", default: "café da manhã", regional: [{ term: "café da manhã", countries: ["BR"], label: "Brasil" }] },
    { gloss: "bus stop", reference: "paragem de autocarro", default: "ponto de ônibus", regional: [{ term: "ponto de ônibus", countries: ["BR"], label: "Brasil" }] },
    { gloss: "tram", reference: "elétrico", default: "bonde", regional: [{ term: "bonde", countries: ["BR"], label: "Brasil" }] },
    { gloss: "driver's license", reference: "carta de condução", default: "carteira de motorista", regional: [{ term: "carteira de motorista", countries: ["BR"], label: "Brasil" }] },
    { gloss: "gas station", reference: "bomba de gasolina", default: "posto de gasolina", regional: [{ term: "posto de gasolina", countries: ["BR"], label: "Brasil" }] },
    { gloss: "screen", reference: "ecrã", default: "tela", regional: [{ term: "tela", countries: ["BR"], label: "Brasil" }] },
    { gloss: "computer mouse", reference: "rato", default: "mouse", regional: [{ term: "mouse", countries: ["BR"], label: "Brasil" }] },
    { gloss: "headphones", reference: "auscultadores", default: "fones de ouvido", regional: [{ term: "fones de ouvido", countries: ["BR"], label: "Brasil" }] },
    { gloss: "computer file", reference: "ficheiro", default: "arquivo", regional: [{ term: "arquivo", countries: ["BR"], label: "Brasil" }] },
    { gloss: "to download", reference: "descarregar", default: "baixar", regional: [{ term: "baixar", countries: ["BR"], label: "Brasil" }] },
    { gloss: "ice cream", reference: "gelado", default: "sorvete", regional: [{ term: "sorvete", countries: ["BR"], label: "Brasil" }] },
    { gloss: "juice", reference: "sumo", default: "suco", regional: [{ term: "suco", countries: ["BR"], label: "Brasil" }] },
    { gloss: "cup (teacup)", reference: "chávena", default: "xícara", regional: [{ term: "xícara", countries: ["BR"], label: "Brasil" }] },
    { gloss: "papaya", reference: "papaia", default: "mamão", regional: [{ term: "mamão", countries: ["BR"], label: "Brasil" }] },
    { gloss: "pineapple", reference: "ananás", default: "abacaxi", regional: [{ term: "abacaxi", countries: ["BR"], label: "Brasil" }] },
    { gloss: "sandwich", reference: "sandes", default: "sanduíche", regional: [{ term: "sanduíche", countries: ["BR"], label: "Brasil" }] },
    { gloss: "refrigerator", reference: "frigorífico", default: "geladeira", regional: [{ term: "geladeira", countries: ["BR"], label: "Brasil" }] },
    { gloss: "freezer", reference: "congelador", default: "freezer", regional: [{ term: "freezer", countries: ["BR"], label: "Brasil" }] },
    { gloss: "bathroom", reference: "casa de banho", default: "banheiro", regional: [{ term: "banheiro", countries: ["BR"], label: "Brasil" }] },
    { gloss: "toilet", reference: "sanita", default: "vaso sanitário", regional: [{ term: "vaso sanitário", countries: ["BR"], label: "Brasil" }] },
    { gloss: "suit", reference: "fato", default: "terno", regional: [{ term: "terno", countries: ["BR"], label: "Brasil" }] },
    { gloss: "socks", reference: "peúgas", default: "meias", regional: [{ term: "meias", countries: ["BR"], label: "Brasil" }] },
    { gloss: "sneakers", reference: "sapatilhas", default: "tênis", regional: [{ term: "tênis", countries: ["BR"], label: "Brasil" }] },
    { gloss: "nursery (daycare)", reference: "infantário", default: "creche", regional: [{ term: "creche", countries: ["BR"], label: "Brasil" }] },
    { gloss: "team", reference: "equipa", default: "equipe", regional: [{ term: "equipe", countries: ["BR"], label: "Brasil" }] },
    { gloss: "to catch (a bus)", reference: "apanhar", default: "pegar", regional: [{ term: "pegar", countries: ["BR"], label: "Brasil" }] },
    { gloss: "small coffee (espresso)", reference: "bica", default: "cafezinho", regional: [{ term: "cafezinho", countries: ["BR"], label: "Brasil" }] },
    { gloss: "pedestrian crossing", reference: "passadeira", default: "faixa de pedestres", regional: [{ term: "faixa de pedestres", countries: ["BR"], label: "Brasil" }] },
    { gloss: "band-aid", reference: "penso rápido", default: "curativo", regional: [{ term: "curativo", countries: ["BR"], label: "Brasil" }] },
    { gloss: "window blind", reference: "estore", default: "persiana", regional: [{ term: "persiana", countries: ["BR"], label: "Brasil" }] },
    { gloss: "cool (fun)", reference: "fixe", default: "legal", regional: [{ term: "legal", countries: ["BR"], label: "Brasil" }] },
    { gloss: "truck", reference: "camião", default: "caminhão", regional: [{ term: "caminhão", countries: ["BR"], label: "Brasil" }] },
    { gloss: "stapler", reference: "agrafador", default: "grampeador", regional: [{ term: "grampeador", countries: ["BR"], label: "Brasil" }] },
    { gloss: "staple", reference: "agrafo", default: "grampo", regional: [{ term: "grampo", countries: ["BR"], label: "Brasil" }] },
    { gloss: "car trunk", reference: "porta-bagagens", default: "porta-malas", regional: [{ term: "porta-malas", countries: ["BR"], label: "Brasil" }] },
    { gloss: "ham", reference: "fiambre", default: "presunto", regional: [{ term: "presunto", countries: ["BR"], label: "Brasil" }] },
    { gloss: "panties", reference: "cuecas", default: "calcinha", regional: [{ term: "calcinha", countries: ["BR"], label: "Brasil" }] },
    { gloss: "guy (dude)", reference: "gajo", default: "cara", regional: [{ term: "cara", countries: ["BR"], label: "Brasil" }] },
    { gloss: "goalkeeper", reference: "guarda-redes", default: "goleiro", regional: [{ term: "goleiro", countries: ["BR"], label: "Brasil" }] },
    { gloss: "grass (lawn)", reference: "relva", default: "grama", regional: [{ term: "grama", countries: ["BR"], label: "Brasil" }] },
    { gloss: "rent", reference: "renda", default: "aluguel", regional: [{ term: "aluguel", countries: ["BR"], label: "Brasil" }] },
    { gloss: "laptop", reference: "portátil", default: "notebook", regional: [{ term: "notebook", countries: ["BR"], label: "Brasil" }] },
    { gloss: "sticky tape", reference: "fita-cola", default: "fita adesiva", regional: [{ term: "fita adesiva", countries: ["BR"], label: "Brasil" }] },
    { gloss: "nail polish", reference: "verniz", default: "esmalte", regional: [{ term: "esmalte", countries: ["BR"], label: "Brasil" }] },
    { gloss: "shower", reference: "duche", default: "chuveiro", regional: [{ term: "chuveiro", countries: ["BR"], label: "Brasil" }] },
    { gloss: "trash can", reference: "caixote do lixo", default: "lixeira", regional: [{ term: "lixeira", countries: ["BR"], label: "Brasil" }] },
    { gloss: "candy", reference: "rebuçado", default: "bala", regional: [{ term: "bala", countries: ["BR"], label: "Brasil" }] },
    { gloss: "chewing gum", reference: "pastilha elástica", default: "chiclete", regional: [{ term: "chiclete", countries: ["BR"], label: "Brasil" }] },
    { gloss: "lollipop", reference: "chupa-chupa", default: "pirulito", regional: [{ term: "pirulito", countries: ["BR"], label: "Brasil" }] },
    { gloss: "drinking straw", reference: "palhinha", default: "canudo", regional: [{ term: "canudo", countries: ["BR"], label: "Brasil" }] },
    { gloss: "butcher shop", reference: "talho", default: "açougue", regional: [{ term: "açougue", countries: ["BR"], label: "Brasil" }] },
    { gloss: "shopping mall", reference: "centro comercial", default: "shopping", regional: [{ term: "shopping", countries: ["BR"], label: "Brasil" }] },
    { gloss: "roundabout", reference: "rotunda", default: "rotatória", regional: [{ term: "rotatória", countries: ["BR"], label: "Brasil" }] },
    { gloss: "sidewalk", reference: "passeio", default: "calçada", regional: [{ term: "calçada", countries: ["BR"], label: "Brasil" }] },
    { gloss: "password", reference: "palavra-passe", default: "senha", regional: [{ term: "senha", countries: ["BR"], label: "Brasil" }] },
    { gloss: "remote control", reference: "comando", default: "controle remoto", regional: [{ term: "controle remoto", countries: ["BR"], label: "Brasil" }] },
    { gloss: "draft beer", reference: "imperial", default: "chope", regional: [{ term: "chope", countries: ["BR"], label: "Brasil" }] },
    { gloss: "bra", reference: "soutien", default: "sutiã", regional: [{ term: "sutiã", countries: ["BR"], label: "Brasil" }] },
    { gloss: "pillow", reference: "almofada", default: "travesseiro", regional: [{ term: "travesseiro", countries: ["BR"], label: "Brasil" }] },
    { gloss: "desk", reference: "secretária", default: "escrivaninha", regional: [{ term: "escrivaninha", countries: ["BR"], label: "Brasil" }] },
    { gloss: "pencil sharpener", reference: "apara-lápis", default: "apontador", regional: [{ term: "apontador", countries: ["BR"], label: "Brasil" }] },
    ],
  },
  fr: {
    // FR↔Québec (+BE/CH). reference=France; Québec, Belgian and Swiss learners see the card.
    // DROPPED: `bonnet`/`tuque` (winter hat). `bonnet` is also a correct ENGLISH answer in
    // en-gb-for-fr vocab-115 ("a car's capot is called…"), so the card fired on a British-English
    // car item and taught a Québec learner winter-hat vocabulary. Same homograph class as `bas`,
    // but arriving from the TARGET side, which indexRegionalTerms cannot guard. Before adding a
    // record, check its France term against the English-target tracks' correct answers.
    // v3.3 Phase 5: taken to its high-frequency ceiling (§4c) — 80 records. Keys are the
    // FRANCE term only (indexRegionalTerms is off, see the index builder below), because all
    // reusable-track content is authored in France French. A record whose Québec term equals
    // the France term but which splits in BE/CH keeps default === reference and lists the
    // Belgian/Swiss term in `regional`, so it stays hidden for everyone else. AI-authored → #41.
    reference: { code: "FR", label: "France" },
    regionalGroupLabel: "Québec",
    ui: { title: "On dit aussi", inYourRegion: "dans ta région", variantes: "variantes régionales", hide: "masquer", refPhrase: "En France", regGroupPhrase: "Au Québec", refFlag: "🇫🇷", regFlag: "🇨🇦" },
    countryNames: { FR: "France", CA: "Québec", BE: "Belgique", CH: "Suisse" },
    regionFlags: { CA: "🇨🇦", BE: "🇧🇪", CH: "🇨🇭" },
    records: [
    { gloss: "car", reference: "voiture", default: "voiture", regional: [
      { term: "char", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "girlfriend", reference: "copine", default: "copine", regional: [
      { term: "blonde", countries: ["CA"], label: "Québec" },
    ]},
    // — table, cuisine, courses
    { gloss: "dinner / evening meal", reference: "dîner", default: "dîner", regional: [
      { term: "souper", countries: ["CA", "BE", "CH"], label: "Québec·Belgique·Suisse" },
    ]},
    { gloss: "lunch / midday meal", reference: "déjeuner", default: "déjeuner", regional: [
      { term: "dîner", countries: ["CA", "BE", "CH"], label: "Québec·Belgique·Suisse" },
    ]},
    { gloss: "breakfast", reference: "petit-déjeuner", default: "petit-déjeuner", regional: [
      { term: "déjeuner", countries: ["CA", "BE", "CH"], label: "Québec·Belgique·Suisse" },
    ]},
    { gloss: "grocery store", reference: "supermarché", default: "supermarché", regional: [{ term: "épicerie", countries: ["CA"], label: "Québec" }] },
    { gloss: "to do the grocery shopping", reference: "faire les courses", default: "faire les courses", regional: [
      { term: "faire l'épicerie", countries: ["CA"], label: "Québec" },
      { term: "faire ses commissions", countries: ["BE", "CH"], label: "Belgique·Suisse" },
    ]},
    { gloss: "convenience store", reference: "supérette", default: "supérette", regional: [{ term: "dépanneur", countries: ["CA"], label: "Québec" }] },
    { gloss: "blueberry", reference: "myrtille", default: "myrtille", regional: [{ term: "bleuet", countries: ["CA"], label: "Québec" }] },
    { gloss: "watermelon", reference: "pastèque", default: "pastèque", regional: [{ term: "melon d'eau", countries: ["CA"], label: "Québec" }] },
    { gloss: "peanut", reference: "cacahuète", default: "cacahuète", regional: [{ term: "arachide", countries: ["CA"], label: "Québec" }] },
    { gloss: "peanut butter", reference: "beurre de cacahuète", default: "beurre de cacahuète", regional: [
      { term: "beurre d'arachide", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "corn on the cob", reference: "maïs", default: "maïs", regional: [{ term: "blé d'Inde", countries: ["CA"], label: "Québec" }] },
    { gloss: "ice cream", reference: "glace", default: "glace", regional: [{ term: "crème glacée", countries: ["CA"], label: "Québec" }] },
    { gloss: "soft drink / soda", reference: "soda", default: "soda", regional: [{ term: "boisson gazeuse", countries: ["CA"], label: "Québec" }] },
    { gloss: "chewing gum", reference: "chewing-gum", default: "chewing-gum", regional: [{ term: "gomme", countries: ["CA"], label: "Québec" }] },
    { gloss: "oatmeal / porridge", reference: "porridge", default: "porridge", regional: [{ term: "gruau", countries: ["CA"], label: "Québec" }] },
    { gloss: "the bill (restaurant)", reference: "addition", default: "addition", regional: [{ term: "facture", countries: ["CA"], label: "Québec" }] },
    { gloss: "drive-through", reference: "drive", default: "drive", regional: [{ term: "service au volant", countries: ["CA"], label: "Québec" }] },
    { gloss: "afternoon snack", reference: "goûter", default: "goûter", regional: [{ term: "collation", countries: ["CA"], label: "Québec" }] },
    { gloss: "cutlery / silverware", reference: "couverts", default: "couverts", regional: [{ term: "ustensiles", countries: ["CA"], label: "Québec" }] },
    { gloss: "dish soap", reference: "liquide vaisselle", default: "liquide vaisselle", regional: [
      { term: "savon à vaisselle", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "endive / chicory", reference: "endive", default: "endive", regional: [{ term: "chicon", countries: ["BE"], label: "Belgique" }] },
    { gloss: "plastic bag", reference: "sac en plastique", default: "sac en plastique", regional: [{ term: "cornet", countries: ["CH"], label: "Suisse" }] },
    // — transport, ville, argent
    { gloss: "parking lot", reference: "parking", default: "parking", regional: [{ term: "stationnement", countries: ["CA"], label: "Québec" }] },
    { gloss: "to park", reference: "se garer", default: "se garer", regional: [
      { term: "stationner", countries: ["CA"], label: "Québec" },
      { term: "parquer", countries: ["BE", "CH"], label: "Belgique·Suisse" },
    ]},
    { gloss: "stop sign", reference: "stop", default: "stop", regional: [{ term: "arrêt", countries: ["CA"], label: "Québec" }] },
    { gloss: "bus", reference: "bus", default: "bus", regional: [{ term: "autobus", countries: ["CA"], label: "Québec" }] },
    { gloss: "traffic jam", reference: "embouteillage", default: "embouteillage", regional: [{ term: "trafic", countries: ["CA"], label: "Québec" }] },
    { gloss: "traffic light", reference: "feu rouge", default: "feu rouge", regional: [{ term: "lumière rouge", countries: ["CA"], label: "Québec" }] },
    { gloss: "bus shelter", reference: "abribus", default: "abribus", regional: [{ term: "aubette", countries: ["BE"], label: "Belgique" }] },
    { gloss: "to hitchhike", reference: "faire du stop", default: "faire du stop", regional: [{ term: "faire du pouce", countries: ["CA"], label: "Québec" }] },
    { gloss: "shopping (the activity)", reference: "shopping", default: "shopping", regional: [{ term: "magasinage", countries: ["CA"], label: "Québec" }] },
    { gloss: "to go shopping", reference: "faire les magasins", default: "faire les magasins", regional: [
      { term: "magasiner", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "shopping mall", reference: "centre commercial", default: "centre commercial", regional: [
      { term: "centre d'achats", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "on sale / special offer", reference: "en promotion", default: "en promotion", regional: [
      { term: "en spécial", countries: ["CA"], label: "Québec" },
      { term: "en action", countries: ["CH"], label: "Suisse" },
    ]},
    { gloss: "ATM", reference: "distributeur automatique", default: "distributeur automatique", regional: [
      { term: "guichet automatique", countries: ["CA"], label: "Québec" },
      { term: "bancomat", countries: ["CH"], label: "Suisse" },
    ]},
    { gloss: "debit card", reference: "carte bancaire", default: "carte bancaire", regional: [{ term: "carte de débit", countries: ["CA"], label: "Québec" }] },
    { gloss: "cash (payment)", reference: "espèces", default: "espèces", regional: [{ term: "argent comptant", countries: ["CA"], label: "Québec" }] },
    { gloss: "checking account", reference: "compte courant", default: "compte courant", regional: [
      { term: "compte-chèques", countries: ["CA"], label: "Québec" },
      { term: "compte à vue", countries: ["BE"], label: "Belgique" },
    ]},
    // — maison, vêtements, technologie
    { gloss: "cell phone", reference: "téléphone portable", default: "téléphone portable", regional: [
      { term: "cellulaire", countries: ["CA"], label: "Québec" },
      { term: "GSM", countries: ["BE"], label: "Belgique" },
      { term: "natel", countries: ["CH"], label: "Suisse" },
    ]},
    { gloss: "email", reference: "e-mail", default: "e-mail", regional: [{ term: "courriel", countries: ["CA"], label: "Québec" }] },
    { gloss: "spam / junk mail", reference: "spam", default: "spam", regional: [{ term: "pourriel", countries: ["CA"], label: "Québec" }] },
    { gloss: "to chat online", reference: "chatter", default: "chatter", regional: [{ term: "clavarder", countries: ["CA"], label: "Québec" }] },
    { gloss: "podcast", reference: "podcast", default: "podcast", regional: [{ term: "balado", countries: ["CA"], label: "Québec" }] },
    { gloss: "washing machine", reference: "machine à laver", default: "machine à laver", regional: [{ term: "laveuse", countries: ["CA"], label: "Québec" }] },
    { gloss: "clothes dryer", reference: "sèche-linge", default: "sèche-linge", regional: [{ term: "sécheuse", countries: ["CA"], label: "Québec" }] },
    { gloss: "sofa", reference: "canapé", default: "canapé", regional: [{ term: "divan", countries: ["CA"], label: "Québec" }] },
    { gloss: "closet / wardrobe", reference: "placard", default: "placard", regional: [{ term: "garde-robe", countries: ["CA"], label: "Québec" }] },
    { gloss: "air conditioning", reference: "climatisation", default: "climatisation", regional: [
      { term: "air climatisé", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "towel", reference: "serviette", default: "serviette", regional: [{ term: "essuie", countries: ["BE"], label: "Belgique" }] },
    { gloss: "washcloth", reference: "gant de toilette", default: "gant de toilette", regional: [
      { term: "débarbouillette", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "mop / floor cloth", reference: "serpillière", default: "serpillière", regional: [
      { term: "vadrouille", countries: ["CA"], label: "Québec" },
      { term: "panosse", countries: ["CH"], label: "Suisse" },
    ]},
    { gloss: "sweater", reference: "pull", default: "pull", regional: [{ term: "chandail", countries: ["CA"], label: "Québec" }] },
    { gloss: "shoes", reference: "chaussures", default: "chaussures", regional: [{ term: "souliers", countries: ["CA"], label: "Québec" }] },
    { gloss: "sneakers", reference: "baskets", default: "baskets", regional: [{ term: "espadrilles", countries: ["CA"], label: "Québec" }] },
    { gloss: "socks", reference: "chaussette", default: "chaussette", regional: [{ term: "bas", countries: ["CA"], label: "Québec" }] },
    { gloss: "mittens", reference: "moufles", default: "moufles", regional: [{ term: "mitaines", countries: ["CA"], label: "Québec" }] },
    { gloss: "scarf", reference: "écharpe", default: "écharpe", regional: [{ term: "foulard", countries: ["CA"], label: "Québec" }] },
    { gloss: "slush (melting snow)", reference: "neige fondue", default: "neige fondue", regional: [{ term: "sloche", countries: ["CA"], label: "Québec" }] },
    { gloss: "garbage / trash", reference: "ordures", default: "ordures", regional: [{ term: "vidanges", countries: ["CA"], label: "Québec" }] },
    // — gens, travail, école, temps et nombres
    { gloss: "weekend", reference: "week-end", default: "week-end", regional: [{ term: "fin de semaine", countries: ["CA"], label: "Québec" }] },
    { gloss: "babysitter", reference: "baby-sitter", default: "baby-sitter", regional: [{ term: "gardienne", countries: ["CA"], label: "Québec" }] },
    { gloss: "boyfriend", reference: "copain", default: "copain", regional: [{ term: "chum", countries: ["CA"], label: "Québec" }] },
    { gloss: "birthday", reference: "anniversaire", default: "anniversaire", regional: [{ term: "fête", countries: ["CA"], label: "Québec" }] },
    { gloss: "guy (informal)", reference: "mec", default: "mec", regional: [{ term: "gars", countries: ["CA"], label: "Québec" }] },
    { gloss: "job (informal)", reference: "boulot", default: "boulot", regional: [{ term: "job", countries: ["CA"], label: "Québec" }] },
    { gloss: "job interview", reference: "entretien", default: "entretien", regional: [{ term: "entrevue", countries: ["CA"], label: "Québec" }] },
    { gloss: "high school", reference: "lycée", default: "lycée", regional: [{ term: "école secondaire", countries: ["CA"], label: "Québec" }] },
    { gloss: "daycare / nursery", reference: "crèche", default: "crèche", regional: [{ term: "garderie", countries: ["CA"], label: "Québec" }] },
    { gloss: "school bag", reference: "cartable", default: "cartable", regional: [{ term: "sac d'école", countries: ["CA"], label: "Québec" }] },
    { gloss: "eraser", reference: "gomme", default: "gomme", regional: [{ term: "efface", countries: ["CA"], label: "Québec" }] },
    { gloss: "pencil sharpener", reference: "taille-crayon", default: "taille-crayon", regional: [{ term: "aiguisoir", countries: ["CA"], label: "Québec" }] },
    { gloss: "pencil case", reference: "trousse", default: "trousse", regional: [{ term: "étui à crayons", countries: ["CA"], label: "Québec" }] },
    { gloss: "prescription (medical)", reference: "ordonnance", default: "ordonnance", regional: [
      { term: "prescription", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "right now / currently", reference: "en ce moment", default: "en ce moment", regional: [
      { term: "présentement", countries: ["CA"], label: "Québec" },
    ]},
    { gloss: "seventy (70)", reference: "soixante-dix", default: "soixante-dix", regional: [
      { term: "septante", countries: ["BE", "CH"], label: "Belgique·Suisse" },
    ]},
    { gloss: "eighty (80)", reference: "quatre-vingts", default: "quatre-vingts", regional: [{ term: "huitante", countries: ["CH"], label: "Suisse" }] },
    { gloss: "ninety (90)", reference: "quatre-vingt-dix", default: "quatre-vingt-dix", regional: [
      { term: "nonante", countries: ["BE", "CH"], label: "Belgique·Suisse" },
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
    // DECIDED v3.4 (the Italian source build): records stay EMPTY, deliberately.
    // Italy↔Switzerland national-level lexical divergence is thin, and Italian's real
    // variation is dialectal rather than a clean national binary — the card's whole model.
    // Forcing entries here would fire a "in your region they say…" card on differences a
    // learner will never meet. The playbook says the same for it/ru/ja/ko. `ui`,
    // `reference` and `countryNames` are populated so the card renders correctly IF this is
    // ever revisited, and `indexRegionalTerms` stays OFF (v3.3 rule: reference-only keying
    // for every source after es/pt, or a homograph fires the card).
    records: [],
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
    // `indexRegionalTerms` — index the OTHER variety's word as a lookup key too.
    // True only where the reusable tracks are authored in the regional variety as well
    // as the reference one (es content is es-LatAm, pt content is pt-BR). French content
    // is authored in France French only, so indexing the Québec word makes the card fire
    // on a homograph: `bas` is socks in Québec, but every France-authored item that
    // answers `bas` means "low". Reference-only keying is the correct default for a
    // single-variety corpus — v3.4 Italian onward should leave this off.
    if (lang.indexRegionalTerms) for (const v of rec.regional) keys.add(norm(v.term));
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
