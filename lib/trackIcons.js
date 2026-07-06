function StatueOfLibertyIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 70 90" width={size} height={size} style={{ flexShrink: 0 }}>
      <path d="M35,15 C38,8 42,8 45,15 L45,25 L35,25 Z" fill="#5DBBA5" />
      <rect x="30" y="25" width="20" height="15" fill="#5DBBA5" />
      <path d="M25,40 L55,40 L48,75 L32,75 Z" fill="#5DBBA5" />
      <rect x="10" y="75" width="60" height="6" fill="#3D8A78" />
      <line x1="52" y1="20" x2="60" y2="8" stroke="#5DBBA5" strokeWidth="3" />
      <circle cx="61" cy="6" r="4" fill="#FFB84D" />
    </svg>
  );
}

function BigBenIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 60 90" width={size} height={size} style={{ flexShrink: 0 }}>
      <rect x="20" y="20" width="20" height="55" fill="#B98EFF" />
      <rect x="16" y="10" width="28" height="12" fill="#B98EFF" />
      <circle cx="30" cy="30" r="7" fill="#171423" stroke="#F3F0FA" strokeWidth="1.5" />
      <path d="M16,10 L30,0 L44,10 Z" fill="#8F6BC7" />
      <rect x="10" y="75" width="40" height="6" fill="#8F6BC7" />
    </svg>
  );
}

function SpainFlagIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (40 / 60)} style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="60" height="12" fill="#C60B1E" />
      <rect x="0" y="12" width="60" height="16" fill="#FFC400" />
      <rect x="0" y="28" width="60" height="12" fill="#C60B1E" />
    </svg>
  );
}

function LatamSunIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 60 60" width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx="30" cy="30" r="16" fill="#FFB84D" />
      <g stroke="#FFB84D" strokeWidth="4">
        <line x1="30" y1="2" x2="30" y2="10" />
        <line x1="30" y1="50" x2="30" y2="58" />
        <line x1="2" y1="30" x2="10" y2="30" />
        <line x1="50" y1="30" x2="58" y2="30" />
        <line x1="10" y1="10" x2="15" y2="15" />
        <line x1="45" y1="45" x2="50" y2="50" />
        <line x1="10" y1="50" x2="15" y2="45" />
        <line x1="45" y1="15" x2="50" y2="10" />
      </g>
    </svg>
  );
}

function ItalyFlagIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (40 / 60)} style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="20" height="40" fill="#009246" />
      <rect x="20" y="0" width="20" height="40" fill="#F1F2F1" />
      <rect x="40" y="0" width="20" height="40" fill="#CE2B37" />
    </svg>
  );
}

function FranceFlagIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (40 / 60)} style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="20" height="40" fill="#0055A4" />
      <rect x="20" y="0" width="20" height="40" fill="#F1F2F1" />
      <rect x="40" y="0" width="20" height="40" fill="#EF4135" />
    </svg>
  );
}

function CanadaFlagIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (40 / 60)} style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="15" height="40" fill="#D80621" />
      <rect x="15" y="0" width="30" height="40" fill="#F1F2F1" />
      <rect x="45" y="0" width="15" height="40" fill="#D80621" />
      <path d="M30,10 L32,16 L38,14 L35,19 L39,22 L33,23 L34,29 L30,25 L26,29 L27,23 L21,22 L25,19 L22,14 L28,16 Z" fill="#D80621" />
    </svg>
  );
}

function BrazilFlagIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (40 / 60)} style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="60" height="40" fill="#009739" />
      <path d="M30,4 L56,20 L30,36 L4,20 Z" fill="#FEDD00" />
      <circle cx="30" cy="20" r="8" fill="#002776" />
    </svg>
  );
}

function PortugalFlagIcon({ size = 32 }) {
  return (
    <svg viewBox="0 0 60 40" width={size} height={size * (40 / 60)} style={{ flexShrink: 0 }}>
      <rect x="0" y="0" width="24" height="40" fill="#046A38" />
      <rect x="24" y="0" width="36" height="40" fill="#DA291C" />
      <circle cx="24" cy="20" r="9" fill="#FFCC00" stroke="#046A38" strokeWidth="1.5" />
    </svg>
  );
}

const ICONS_BY_TRACK_ID = {
  "en-us-for-es": StatueOfLibertyIcon,
  "en-gb-for-es": BigBenIcon,
  "es-spain-for-en": SpainFlagIcon,
  "es-latam-for-en": LatamSunIcon,
  "it-for-en": ItalyFlagIcon,
  "fr-for-en": FranceFlagIcon,
  "fr-ca-for-en": CanadaFlagIcon,
  "pt-br-for-en": BrazilFlagIcon,
  "pt-pt-for-en": PortugalFlagIcon,
};

export default function TrackIcon({ trackId, size = 32 }) {
  const IconComponent = ICONS_BY_TRACK_ID[trackId];
  if (!IconComponent) return null;
  return <IconComponent size={size} />;
}
