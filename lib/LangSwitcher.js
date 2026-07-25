"use client";

import { useState } from "react";
import { useUiLang, SUPPORTED_UI_LANGS } from "./uiLang";

// Language switcher shown on every PRE-LOGIN screen (auth, forgot/reset,
// beta-apply, onboarding). Lets a user override the browser-detected UI
// language before they've set a native language. Self-contained: reads/writes
// the bootstrap language via useUiLang, so a page only needs to render it once.

const LANG_LABELS = { en: "English", es: "Español" };

export default function LangSwitcher({ style }) {
  const [uiLang, setUiLang] = useUiLang();
  const [open, setOpen] = useState(false);

  const pick = (lang) => {
    setUiLang(lang);
    setOpen(false);
  };

  return (
    <>
      {open && <div style={styles.backdrop} onClick={() => setOpen(false)} aria-hidden="true" />}
      <div style={{ ...styles.wrap, ...style }}>
        <button
          type="button"
          className="rj"
          style={styles.pill}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-label="Change language"
        >
          <span aria-hidden="true">🌐</span>
          <span>{LANG_LABELS[uiLang] || uiLang}</span>
          <span style={{ fontSize: 10 }} aria-hidden="true">▾</span>
        </button>
        {open && (
          <div style={styles.menu} role="listbox">
            {SUPPORTED_UI_LANGS.map((lang) => (
              <button
                key={lang}
                type="button"
                className="rj"
                role="option"
                aria-selected={lang === uiLang}
                style={{ ...styles.item, ...(lang === uiLang ? styles.itemSel : {}) }}
                onClick={() => pick(lang)}
              >
                {LANG_LABELS[lang] || lang}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

const styles = {
  // Fixed top-right so a page just drops <LangSwitcher/> in once; override via
  // the `style` prop for in-flow placement.
  wrap: { position: "fixed", top: 16, right: 16, zIndex: 60 },
  backdrop: { position: "fixed", inset: 0, zIndex: 55 },
  pill: {
    display: "inline-flex",
    alignItems: "center",
    gap: 6,
    background: "rgba(255,143,177,0.12)",
    color: "#FF8FB1",
    border: "1px solid #FF8FB1",
    borderRadius: 999,
    padding: "6px 12px",
    fontSize: 12.5,
    fontWeight: 700,
    cursor: "pointer",
  },
  menu: {
    position: "absolute",
    top: "115%",
    right: 0,
    background: "#221E33",
    border: "1px solid #3A3452",
    borderRadius: 10,
    padding: 6,
    minWidth: 140,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  item: {
    display: "block",
    width: "100%",
    textAlign: "left",
    background: "transparent",
    color: "#F3F0FA",
    border: "none",
    borderRadius: 7,
    padding: "9px 10px",
    fontSize: 13.5,
    cursor: "pointer",
  },
  itemSel: { color: "#FF8FB1", fontWeight: 700 },
};
