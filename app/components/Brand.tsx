/* Aquaphil Water Care brand pieces — drawn as SVG so they stay crisp at any size.
 * Swap for the official artwork once it's supplied. */

/** The water-drop symbol on its own. `light` is for use on blue backgrounds. */
export function BrandMark({ size = 36, light = false }: { size?: number; light?: boolean }) {
  const id = light ? "aq-drop-light" : "aq-drop";
  const stroke = light ? "#1565d8" : "white";
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" role="img" aria-label="Aquaphil" style={{ display: "block", flexShrink: 0 }}>
      <defs>
        <linearGradient id={id} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor={light ? "#ffffff" : "#4fb3ff"} />
          <stop offset="1" stopColor={light ? "#cfe6ff" : "#0a4fd6"} />
        </linearGradient>
      </defs>
      <path d="M24 3C24 3 9 19.5 9 29.5a15 15 0 0 0 30 0C39 19.5 24 3 24 3z" fill={`url(#${id})`} />
      <path d="M13.5 31.5c3.2-2.4 6.6-2.4 10.3 0s7.1 2.4 10.4 0" stroke={stroke} strokeOpacity={light ? 0.35 : 0.55} strokeWidth="2.2" fill="none" strokeLinecap="round" />
      <path d="M17.5 23.5c.8-3.6 3-7 5-9.4" stroke={stroke} strokeOpacity={light ? 0.3 : 0.7} strokeWidth="2.4" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** "Aquaphil" with the "Water Care" line under it. */
export function Wordmark({ light = false, size = 20 }: { light?: boolean; size?: number }) {
  return (
    <div style={{ lineHeight: 1.05 }}>
      <p style={{ margin: 0, fontSize: size, fontWeight: 800, letterSpacing: "-0.02em", color: light ? "white" : "var(--blue-dark)" }}>Aquaphil</p>
      <p style={{ margin: "2px 0 0", fontSize: size * 0.5, fontWeight: 600, letterSpacing: "0.04em", color: light ? "rgba(255,255,255,0.82)" : "var(--blue)" }}>Water Care</p>
    </div>
  );
}
