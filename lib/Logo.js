export default function Logo({ size = 32 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path d="M55,75 C85,80 95,50 78,25 C95,35 98,68 75,85 C68,90 58,88 55,75 Z" fill="#B98EFF" />
      <circle cx="28" cy="28" r="10" fill="#FF8FB1" />
      <circle cx="52" cy="28" r="10" fill="#FF8FB1" />
      <circle cx="28" cy="29" r="4.5" fill="#7A3B57" />
      <circle cx="52" cy="29" r="4.5" fill="#7A3B57" />
      <circle cx="40" cy="46" r="27" fill="#FF8FB1" />
      <circle cx="31" cy="43" r="3.4" fill="#221E33" />
      <circle cx="49" cy="43" r="3.4" fill="#221E33" />
      <ellipse cx="40" cy="55" rx="4.2" ry="3.2" fill="#221E33" />
    </svg>
  );
}
