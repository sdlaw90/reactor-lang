// Flags are generated on the fly from ISO 3166-1 alpha-2 codes — no image
// assets needed, works everywhere emoji render.
export function flagEmoji(countryCode) {
  if (!countryCode || countryCode.length !== 2) return "";
  return String.fromCodePoint(
    ...countryCode
      .toUpperCase()
      .split("")
      .map((c) => 127397 + c.charCodeAt(0))
  );
}

export const COUNTRIES = [
  // Spanish-speaking
  { code: "AR", name: "Argentina", lang: "es" },
  { code: "BO", name: "Bolivia", lang: "es" },
  { code: "CL", name: "Chile", lang: "es" },
  { code: "CO", name: "Colombia", lang: "es" },
  { code: "CR", name: "Costa Rica", lang: "es" },
  { code: "CU", name: "Cuba", lang: "es" },
  { code: "DO", name: "Dominican Republic", lang: "es" },
  { code: "EC", name: "Ecuador", lang: "es" },
  { code: "SV", name: "El Salvador", lang: "es" },
  { code: "GQ", name: "Equatorial Guinea", lang: "es" },
  { code: "GT", name: "Guatemala", lang: "es" },
  { code: "HN", name: "Honduras", lang: "es" },
  { code: "MX", name: "Mexico", lang: "es" },
  { code: "NI", name: "Nicaragua", lang: "es" },
  { code: "PA", name: "Panama", lang: "es" },
  { code: "PY", name: "Paraguay", lang: "es" },
  { code: "PE", name: "Peru", lang: "es" },
  { code: "PR", name: "Puerto Rico", lang: "es" },
  { code: "ES", name: "España (Spain)", lang: "es" },
  { code: "UY", name: "Uruguay", lang: "es" },
  { code: "VE", name: "Venezuela", lang: "es" },
  // English-speaking
  { code: "US", name: "United States", lang: "en" },
  { code: "GB", name: "United Kingdom", lang: "en" },
  { code: "CA", name: "Canada", lang: "en" },
  { code: "AU", name: "Australia", lang: "en" },
  { code: "NZ", name: "New Zealand", lang: "en" },
  { code: "IE", name: "Ireland", lang: "en" },
  { code: "ZA", name: "South Africa", lang: "en" },
];

export function countriesForLang(lang) {
  return COUNTRIES.filter((c) => c.lang === lang);
}

// Infers a regional label from native language + chosen country — this is
// what makes "Spanish + Venezuela" render as "Español (Latinoamérica)" and
// "English + United Kingdom" render as "English (UK)", without needing the
// person to separately pick a region.
export function regionalLanguageLabel(nativeLang, countryCode) {
  if (nativeLang === "es") {
    return countryCode === "ES" ? "Español (España)" : "Español (Latinoamérica)";
  }
  if (nativeLang === "en") {
    if (countryCode === "GB") return "English (UK)";
    if (countryCode === "US") return "English (US)";
    return "English";
  }
  return "";
}
