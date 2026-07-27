// SquirreLingo mark — the two-squirrel co-host duo (v3.2 rebrand). Geometry is
// the same drawing as app/icon.svg / the favicon, so the in-app mark, the
// browser tab, the installed app icon and the share preview are one identity.
//
// Two variants, mirroring what the multi-res favicon does:
//   duo  — both squirrels, cheek to cheek. The brand mark. Needs room to read.
//   solo — the front (brown) squirrel alone, for small sizes where two heads
//          collapse into mush. This is the same call favicon.ico makes at 16px.
// `variant="auto"` (the default) picks solo below AUTO_DUO_MIN and duo at or
// above it, so callers just pass a size and get something legible.

const AUTO_DUO_MIN = 30;

function Squirrel({ body, ear, brow, nose, outline }) {
  return (
    <g>
      {outline && (
        <g fill="none" stroke={outline} strokeWidth="4" opacity=".55">
          <ellipse cx="30" cy="30" rx="19" ry="20.5" />
          <ellipse cx="90" cy="30" rx="19" ry="20.5" />
          <ellipse cx="60" cy="70" rx="47" ry="45" />
        </g>
      )}
      <g>
        <ellipse cx="30" cy="30" rx="19" ry="20.5" fill={body} />
        <ellipse cx="90" cy="30" rx="19" ry="20.5" fill={body} />
        <ellipse cx="31" cy="32" rx="9.5" ry="11" fill={ear} />
        <ellipse cx="89" cy="32" rx="9.5" ry="11" fill={ear} />
        <ellipse cx="60" cy="70" rx="47" ry="45" fill={body} />
        <path d="M34 55 Q45 49 56 54" fill="none" stroke={brow} strokeWidth="4.2" strokeLinecap="round" opacity=".8" />
        <path d="M64 54 Q75 49 86 55" fill="none" stroke={brow} strokeWidth="4.2" strokeLinecap="round" opacity=".8" />
        <ellipse cx="45" cy="75" rx="13.5" ry="15.5" fill="#fdfbff" />
        <ellipse cx="75" cy="75" rx="13.5" ry="15.5" fill="#fdfbff" />
        <circle cx="46" cy="72.5" r="7.6" fill="#2c2140" />
        <circle cx="74" cy="72.5" r="7.6" fill="#2c2140" />
        <circle cx="48.8" cy="69.6" r="2.9" fill="#fff" />
        <circle cx="76.8" cy="69.6" r="2.9" fill="#fff" />
        <ellipse cx="27" cy="88" rx="10" ry="6.4" fill="#e08a86" opacity=".9" />
        <ellipse cx="93" cy="88" rx="10" ry="6.4" fill="#e08a86" opacity=".9" />
        <ellipse cx="60" cy="88" rx="4.6" ry="3.6" fill={nose} />
        <path d="M48 94 Q60 108 72 94 Q60 100 48 94 Z" fill={nose} />
      </g>
    </g>
  );
}

// Palette sampled from the ch0 co-host video (see claude/squirrelingo_logo_rebrand.md).
const MAUVE = { body: "#a16e80", ear: "#d3b0bf", brow: "#6f4a58", nose: "#6f4a58" };
const BROWN = { body: "#a77a4e", ear: "#e9d3ac", brow: "#6f4c2f", nose: "#6f4c2f" };

export default function Logo({ size = 32, variant = "auto" }) {
  const useDuo = variant === "duo" || (variant === "auto" && size >= AUTO_DUO_MIN);

  if (!useDuo) {
    // Front squirrel alone, centred in a square box.
    return (
      <svg viewBox="4 6 112 112" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
        <Squirrel {...BROWN} />
      </svg>
    );
  }

  // Duo: mauve behind and to the right, brown in front. The brown squirrel
  // carries a thin dark contour so the two stay distinct on any background.
  return (
    <svg viewBox="12 8 148 128" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <g transform="translate(80 24) scale(0.74)">
        <Squirrel {...MAUVE} />
      </g>
      <g transform="translate(4 20) scale(0.92)">
        <Squirrel {...BROWN} outline="#3a2a1c" />
      </g>
    </svg>
  );
}
