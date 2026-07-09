"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchableSelect({ options, value, onChange, placeholder = "Search…", renderOption }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);

  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    function onClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const filtered = query.trim() ? options.filter((o) => o.label.toLowerCase().includes(query.trim().toLowerCase())) : options;

  return (
    <div ref={containerRef} style={{ position: "relative", width: "100%" }}>
      <input
        className="jm"
        style={styles.input}
        placeholder={placeholder}
        aria-label={placeholder}
        value={open ? query : selected ? selected.label : ""}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(e) => setQuery(e.target.value)}
      />
      {open && (
        <div style={styles.dropdown}>
          {filtered.length === 0 && <div style={styles.empty}>No matches</div>}
          {filtered.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
                setQuery("");
              }}
              style={{ ...styles.option, background: o.value === value ? "#3A3452" : "transparent" }}
            >
              {renderOption ? renderOption(o) : o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  input: {
    width: "100%",
    background: "#171423",
    color: "#F3F0FA",
    border: "1px solid #3A3452",
    borderRadius: 8,
    padding: "10px 12px",
    fontSize: 14,
  },
  dropdown: {
    position: "absolute",
    top: "calc(100% + 4px)",
    left: 0,
    right: 0,
    maxHeight: 240,
    overflowY: "auto",
    background: "#171423",
    border: "1px solid #3A3452",
    borderRadius: 8,
    zIndex: 30,
    boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
  },
  option: {
    display: "flex",
    alignItems: "center",
    gap: 8,
    width: "100%",
    textAlign: "left",
    padding: "8px 12px",
    background: "transparent",
    border: "none",
    color: "#F3F0FA",
    fontSize: 14,
    cursor: "pointer",
  },
  empty: { padding: "10px 12px", color: "#7C7395", fontSize: 13 },
};
