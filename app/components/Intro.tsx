"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, BackIcon, CalendarIcon, ChatIcon, CheckIcon, PinIcon, WrenchIcon } from "./icons";
import PurifierArt from "./PurifierArt";
import { BrandMark, Wordmark } from "./Brand";
import { BottomSheet, PrimaryButton, iconBtn } from "./ui";

/** Demo OTP until SMS (MSG91 / Supabase Auth) is wired up. */
export const DEMO_OTP = "123456";

const SPLASH_MS = 1800;

/** Brand splash — Aquaphil blue with a water wave; moves on by itself. */
export function SplashScreen({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, SPLASH_MS);
    return () => clearTimeout(t);
  }, [onDone]);

  return (
    <div onClick={onDone} style={{
      position: "absolute", inset: 0, zIndex: 200, cursor: "pointer",
      background: "linear-gradient(170deg,#3f9bff 0%,#1a6ff0 45%,#0d47a1 100%)",
      display: "flex", flexDirection: "column", overflow: "hidden",
    }}>
      <div style={{ position: "absolute", right: -80, top: -90, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,0.22), transparent 70%)" }} />
      <svg viewBox="0 0 400 200" preserveAspectRatio="none" style={{ position: "absolute", left: 0, right: 0, bottom: 0, width: "100%", height: 260 }} aria-hidden="true">
        <path d="M0 80 C 90 30, 170 130, 260 80 S 380 40, 400 70 V200 H0z" fill="rgba(255,255,255,0.10)" />
        <path d="M0 115 C 110 75, 190 165, 290 115 S 380 95, 400 110 V200 H0z" fill="rgba(255,255,255,0.12)" />
        <path d="M0 150 C 120 120, 220 190, 320 150 S 390 140, 400 148 V200 H0z" fill="rgba(13,71,161,0.35)" />
      </svg>

      <div className="fade-up" style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 14, position: "relative", zIndex: 1 }}>
        <BrandMark size={92} light />
        <div style={{ textAlign: "center" }}><Wordmark light size={38} /></div>
      </div>
      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 20px calc(48px + env(safe-area-inset-bottom))" }}>
        <p style={{ margin: 0, fontSize: 19, fontWeight: 600, color: "white", lineHeight: 1.35 }}>Pure Water<br />Healthy Life</p>
      </div>
    </div>
  );
}

/* ── Onboarding artwork ── */

const Halo = ({ children }: { children: React.ReactNode }) => (
  <div style={{ width: 230, height: 230, borderRadius: "50%", background: "radial-gradient(circle, var(--blue-tint) 55%, transparent 72%)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>{children}</div>
);

const ServiceArt = () => (
  <Halo>
    <div style={{ width: 150, height: 150, borderRadius: 32, background: "linear-gradient(150deg,var(--blue),var(--blue-dark))", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 18px 36px rgba(26,111,240,0.35)" }}>
      <WrenchIcon s={76} c="white" w={1.5} />
    </div>
    <div style={{ position: "absolute", right: 12, top: 34, background: "var(--surface)", borderRadius: 14, padding: "8px 10px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 6 }}>
      <CalendarIcon s={16} c="var(--blue)" /><span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink)" }}>Tomorrow, 11 AM</span>
    </div>
    <div style={{ position: "absolute", left: 6, bottom: 36, background: "var(--surface)", borderRadius: 14, padding: "8px 10px", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", gap: 6 }}>
      <span style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--success-text)", display: "flex", alignItems: "center", justifyContent: "center" }}><CheckIcon s={11} c="white" /></span>
      <span style={{ fontSize: 11.5, fontWeight: 700, color: "var(--ink)" }}>Verified expert</span>
    </div>
  </Halo>
);

const TrackArt = () => (
  <Halo>
    <div style={{ width: 150, height: 196, borderRadius: 26, background: "var(--surface)", border: "5px solid var(--ink)", overflow: "hidden", boxShadow: "0 18px 36px rgba(15,23,41,0.2)", display: "flex", flexDirection: "column" }}>
      <MiniMap height={96} />
      <div style={{ padding: "8px 10px", display: "flex", flexDirection: "column", gap: 6 }}>
        {["Assigned", "On the way", "In progress"].map((t, i) => (
          <div key={t} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: "50%", background: i < 2 ? "var(--blue)" : "var(--line-strong)" }} />
            <span style={{ fontSize: 10, fontWeight: 600, color: i < 2 ? "var(--ink)" : "var(--ink-mute)" }}>{t}</span>
          </div>
        ))}
      </div>
    </div>
    <div style={{ position: "absolute", right: 4, top: 50, width: 44, height: 44, borderRadius: 14, background: "var(--surface)", boxShadow: "var(--shadow-lg)", display: "flex", alignItems: "center", justifyContent: "center" }}><ChatIcon s={22} c="var(--blue)" /></div>
  </Halo>
);

/** Tiny street-map sketch reused by the onboarding and tracking art. */
export function MiniMap({ height = 96 }: { height?: number }) {
  return (
    <svg viewBox="0 0 150 96" width="100%" height={height} preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ display: "block", background: "var(--blue-pale)" }}>
      <path d="M0 30h150M0 70h150M40 0v96M105 0v96" stroke="var(--surface)" strokeWidth="7" />
      <path d="M22 78 C 40 70, 40 40, 70 40 S 110 22, 124 18" stroke="var(--blue)" strokeWidth="3" fill="none" strokeDasharray="5 4" strokeLinecap="round" />
      <circle cx="22" cy="78" r="5" fill="var(--blue)" stroke="white" strokeWidth="2" />
      <g transform="translate(124 18)"><PinGlyph /></g>
    </svg>
  );
}

const PinGlyph = () => <path d="M0 0c0 0-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z" transform="translate(0 0)" fill="var(--red)" stroke="white" strokeWidth="1.5" />;

const SLIDES = [
  {
    title: "Pure & Safe", accent: "Water for Your Family",
    body: "Advanced RO purifiers for healthier and better living.",
    art: <Halo><PurifierArt kind="premium" size={210} /></Halo>,
  },
  {
    title: "Expert Service", accent: "When You Need It",
    body: "Book installation, repair or AMC in just a few taps.",
    art: <ServiceArt />,
  },
  {
    title: "Track. Chat.", accent: "Relax.",
    body: "Live tracking, in-app chat and a hassle-free service experience.",
    art: <TrackArt />,
  },
];

export function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const last = index === SLIDES.length - 1;

  const next = () => {
    if (last) return onDone();
    const el = trackRef.current;
    el?.scrollTo({ left: (index + 1) * el.clientWidth, behavior: "smooth" });
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 190, background: "var(--app-bg)", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", justifyContent: "flex-end", padding: "18px 20px 0", minHeight: 44 }}>
        {!last && <button onClick={onDone} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-soft)", fontSize: 14, fontWeight: 600 }}>Skip</button>}
      </div>

      <div ref={trackRef} className="no-scroll"
        onScroll={(e) => setIndex(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
        style={{ flex: 1, display: "flex", overflowX: "auto", scrollSnapType: "x mandatory" }}>
        {SLIDES.map((s, i) => (
          <div key={i} style={{ flex: "0 0 100%", scrollSnapAlign: "start", padding: "18px 24px 0", display: "flex", flexDirection: "column" }}>
            <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "var(--ink)", lineHeight: 1.2 }}>
              <span style={{ color: "var(--blue)" }}>{s.title}</span><br />{s.accent}
            </h1>
            <p style={{ margin: "12px 0 0", fontSize: 15, color: "var(--ink-soft)", lineHeight: 1.55, maxWidth: 300 }}>{s.body}</p>
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", minHeight: 250 }}>{s.art}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: 6, margin: "8px 0 20px" }}>
        {SLIDES.map((_, i) => (
          <span key={i} style={{
            width: i === index ? 20 : 7, height: 7, borderRadius: 999,
            background: i === index ? "var(--blue)" : "var(--blue-ghost)",
            transition: "width 0.3s, background 0.3s",
          }} />
        ))}
      </div>

      <div style={{ padding: "0 20px calc(28px + env(safe-area-inset-bottom))" }}>
        <PrimaryButton onClick={next}>{last ? "Get Started" : "Next"} <ArrowRight s={18} c="white" /></PrimaryButton>
      </div>
    </div>
  );
}

/* ───────────────────────── Login / OTP ───────────────────────── */

const validMobile = (v: string) => /^[6-9]\d{9}$/.test(v);
export const formatMobile = (v: string) => `+91 ${v.slice(0, 5)} ${v.slice(5)}`;

const LEGAL: Record<"terms" | "privacy", { title: string; body: string[] }> = {
  terms: {
    title: "Terms & Conditions",
    body: [
      "Orders are confirmed once payment succeeds or, for cash on delivery, once our team calls to confirm.",
      "Installation is free for Aquaphil purifiers within our service area. Repair visits carry a visit charge; parts are billed at MRP.",
      "AMC plans run for 12 months from activation and cover the visits and filters listed on the plan.",
    ],
  },
  privacy: {
    title: "Privacy Policy",
    body: [
      "We use your phone number and address only to deliver orders and send technicians. We never sell your data.",
      "Card and UPI details are handled by our payment gateway and never stored on Aquaphil servers.",
      "You can ask us to delete your account and data at any time from Help & Support.",
    ],
  },
};

export function LegalSheet({ which, onClose }: { which: "terms" | "privacy"; onClose: () => void }) {
  const doc = LEGAL[which];
  return (
    <BottomSheet title={doc.title} onClose={onClose}>
      {doc.body.map((p) => <p key={p} style={{ margin: "0 0 12px", fontSize: 13.5, color: "var(--ink-soft)", lineHeight: 1.6 }}>{p}</p>)}
    </BottomSheet>
  );
}

export function LoginScreen({ onContinue, onGoogle }: { onContinue: (mobile: string) => void; onGoogle: () => void }) {
  const [mobile, setMobile] = useState("");
  const [touched, setTouched] = useState(false);
  const [legal, setLegal] = useState<"terms" | "privacy" | null>(null);
  const ok = validMobile(mobile);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (ok) onContinue(mobile);
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 180, background: "var(--app-bg)", display: "flex", flexDirection: "column", overflowY: "auto" }} className="no-scroll">
      <form onSubmit={submit} style={{ flex: 1, display: "flex", flexDirection: "column", padding: "56px 22px calc(24px + env(safe-area-inset-bottom))" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
          <BrandMark size={52} /><Wordmark size={26} />
        </div>

        <h1 style={{ margin: "44px 0 4px", fontSize: 24, fontWeight: 800, color: "var(--ink)" }}>Welcome Back</h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)" }}>Login to continue</p>

        <label htmlFor="login-mobile" style={{ margin: "26px 0 8px", fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>Mobile number</label>
        <div style={{
          display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", borderRadius: 14, padding: "4px 14px",
          border: `1.5px solid ${touched && !ok ? "var(--error-text)" : "var(--line)"}`,
        }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--ink)", paddingRight: 10, borderRight: "1px solid var(--line)" }}>+91</span>
          <input id="login-mobile" inputMode="numeric" autoComplete="tel-national" value={mobile} placeholder="Enter mobile number"
            onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", padding: "11px 0", fontSize: 15, color: "var(--ink)", letterSpacing: "0.04em" }} />
        </div>
        {touched && !ok && <p role="alert" style={{ margin: "6px 2px 0", fontSize: 12.5, color: "var(--error-text)" }}>Enter a valid 10-digit mobile number.</p>}

        <PrimaryButton style={{ marginTop: 18 }}>Continue</PrimaryButton>

        <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "22px 0" }}>
          <span style={{ flex: 1, height: 1, background: "var(--line)" }} /><span style={{ fontSize: 12.5, color: "var(--ink-mute)" }}>or</span><span style={{ flex: 1, height: 1, background: "var(--line)" }} />
        </div>

        <button type="button" onClick={onGoogle} className="press" style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: 14, borderRadius: 16,
          background: "var(--surface)", border: "1.5px solid var(--line)", cursor: "pointer", fontSize: 14.5, fontWeight: 600, color: "var(--ink)",
        }}><GoogleG /> Continue with Google</button>

        <p style={{ margin: "auto 0 0", paddingTop: 28, textAlign: "center", fontSize: 12, color: "var(--ink-mute)", lineHeight: 1.6 }}>
          By continuing, you agree to our<br />
          <button type="button" onClick={() => setLegal("terms")} style={linkBtn}>Terms &amp; Conditions</button> and{" "}
          <button type="button" onClick={() => setLegal("privacy")} style={linkBtn}>Privacy Policy</button>
        </p>
      </form>
      {legal && <LegalSheet which={legal} onClose={() => setLegal(null)} />}
    </div>
  );
}

const linkBtn: React.CSSProperties = { background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--blue)", fontSize: 12, fontWeight: 600 };

const GoogleG = () => (
  <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
    <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
    <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
    <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-8l-6.5 5C9.5 39.6 16.2 44 24 44z" />
    <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
  </svg>
);

const RESEND_S = 45;

export function OtpScreen({ mobile, onBack, onVerified }: { mobile: string; onBack: () => void; onVerified: () => void }) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState(false);
  const [left, setLeft] = useState(RESEND_S);
  const [resent, setResent] = useState(false);
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => { refs.current[0]?.focus(); }, []);
  useEffect(() => {
    if (left <= 0) return;
    const t = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);

  const code = digits.join("");
  const verify = (c = code) => {
    if (c.length < 6) return;
    if (c === DEMO_OTP) onVerified();
    else setError(true);
  };

  const setAt = (i: number, raw: string) => {
    const v = raw.replace(/\D/g, "");
    setError(false);
    // Pasting the whole code fills every box at once.
    if (v.length > 1) {
      const next = v.slice(0, 6).split("");
      const filled = [...next, ...Array(6 - next.length).fill("")];
      setDigits(filled);
      refs.current[Math.min(next.length, 5)]?.focus();
      if (next.length === 6) verify(next.join(""));
      return;
    }
    const next = digits.map((d, j) => (j === i ? v : d));
    setDigits(next);
    if (v && i < 5) refs.current[i + 1]?.focus();
    if (next.every(Boolean)) verify(next.join(""));
  };

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 181, background: "var(--app-bg)", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "18px 16px 0" }}>
        <button onClick={onBack} aria-label="Back" className="press" style={iconBtn}><BackIcon c="var(--ink)" /></button>
      </div>
      <div style={{ flex: 1, padding: "34px 22px 0", textAlign: "center" }}>
        <div style={{ width: 72, height: 72, margin: "0 auto", borderRadius: 22, background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}><PinIcon s={32} c="var(--blue)" /></div>
        <h1 style={{ margin: "22px 0 6px", fontSize: 24, fontWeight: 800, color: "var(--ink)" }}>Verify OTP</h1>
        <p style={{ margin: 0, fontSize: 14, color: "var(--ink-soft)", lineHeight: 1.55 }}>We&apos;ve sent a 6 digit code to<br /><b style={{ color: "var(--ink)" }}>{formatMobile(mobile)}</b></p>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 28 }}>
          {digits.map((d, i) => (
            <input key={i} ref={(el) => { refs.current[i] = el; }} value={d} inputMode="numeric" autoComplete={i === 0 ? "one-time-code" : "off"}
              aria-label={`Digit ${i + 1}`}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => { if (e.key === "Backspace" && !d && i > 0) refs.current[i - 1]?.focus(); }}
              style={{
                width: 46, height: 54, textAlign: "center", fontSize: 21, fontWeight: 700, color: "var(--ink)", borderRadius: 14, outline: "none",
                background: "var(--surface)", border: `1.5px solid ${error ? "var(--error-text)" : d ? "var(--blue)" : "var(--line)"}`,
              }} />
          ))}
        </div>
        {error && <p role="alert" style={{ margin: "12px 0 0", fontSize: 13, color: "var(--error-text)", fontWeight: 600 }}>That code isn&apos;t right. Try again.</p>}

        <p style={{ margin: "22px 0 0", fontSize: 13.5, color: "var(--ink-soft)" }}>
          {left > 0
            ? <>Resend OTP in <b style={{ color: "var(--blue)" }}>00:{String(left).padStart(2, "0")}</b></>
            : <button onClick={() => { setLeft(RESEND_S); setResent(true); setDigits(Array(6).fill("")); refs.current[0]?.focus(); }} style={{ ...linkBtn, fontSize: 13.5 }}>Resend OTP</button>}
        </p>
        {resent && <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--success-text)" }}>A new code is on its way.</p>}
        <p style={{ margin: "18px auto 0", fontSize: 12, color: "var(--ink-mute)", background: "var(--surface)", display: "inline-block", padding: "6px 12px", borderRadius: 999 }}>Demo code: <b>{DEMO_OTP}</b></p>
      </div>
      <div style={{ padding: "0 20px calc(24px + env(safe-area-inset-bottom))" }}>
        <PrimaryButton disabled={code.length < 6} onClick={() => verify()}>Verify &amp; Continue</PrimaryButton>
      </div>
    </div>
  );
}
