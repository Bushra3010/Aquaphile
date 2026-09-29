"use client";

import { useState } from "react";
import { BellIcon, ChatIcon, CheckIcon, ChevronDown, ChevronRight, HelpIcon, InfoIcon, PhoneIcon, SearchIcon, ShieldIcon, SunIcon } from "./icons";
import { BrandMark } from "./Brand";
import { LegalSheet } from "./Intro";
import { BottomSheet, PageHeader, PrimaryButton, Toggle, card } from "./ui";
import { AMC_PLAN, COMPANY, amcDaysLeft, inr } from "../lib/data";

export type Language = "English" | "हिन्दी";

/* ───────────────────────── Settings ───────────────────────── */

export function SettingsPage({ dark, onDark, language, onLanguage, onBack, onNotifications, onAbout }: {
  dark: boolean; onDark: (v: boolean) => void; language: Language; onLanguage: (l: Language) => void;
  onBack: () => void; onNotifications: () => void; onAbout: () => void;
}) {
  const [sheet, setSheet] = useState<"language" | "terms" | "privacy" | null>(null);

  return (
    <div>
      <PageHeader title="Settings" onBack={onBack} />
      <div style={{ padding: "0 16px 24px" }}>
        <p style={groupH}>Preferences</p>
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ marginTop: -1 }}>
            <Row Icon={SunIcon} label="Dark Mode" right={<Toggle on={dark} onChange={onDark} label="Dark mode" />} />
            <Row Icon={GlobeIcon} label="Language" onClick={() => setSheet("language")}
              right={<span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13, color: "var(--ink-soft)" }}>{language}<ChevronRight s={15} c="var(--ink-mute)" /></span>} />
            <Row Icon={BellIcon} label="Notifications" onClick={onNotifications} />
          </div>
        </div>

        <p style={groupH}>About</p>
        <div style={{ ...card, overflow: "hidden" }}>
          <div style={{ marginTop: -1 }}>
            <Row Icon={ShieldIcon} label="Privacy Policy" onClick={() => setSheet("privacy")} />
            <Row Icon={HelpIcon} label="Terms & Conditions" onClick={() => setSheet("terms")} />
            <Row Icon={InfoIcon} label="About Us" onClick={onAbout} />
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11.5, color: "var(--text-disabled)", marginTop: 18 }}>Aquaphil Water Care v1.0.0</p>
      </div>

      {sheet === "language" && (
        <BottomSheet title="Language" onClose={() => setSheet(null)}>
          {(["English", "हिन्दी"] as Language[]).map((l) => (
            <button key={l} onClick={() => { onLanguage(l); setSheet(null); }} className="press" style={{
              ...card, width: "100%", marginBottom: 8, padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer",
              border: l === language ? "2px solid var(--blue)" : "2px solid transparent", fontSize: 15, fontWeight: 600, color: "var(--ink)",
            }}>{l}{l === language && <CheckIcon s={18} c="var(--blue)" />}</button>
          ))}
          <p style={{ margin: "6px 2px 0", fontSize: 12, color: "var(--ink-mute)", lineHeight: 1.5 }}>Hindi translations are being prepared — your choice is saved and will apply once they&apos;re ready.</p>
        </BottomSheet>
      )}
      {(sheet === "terms" || sheet === "privacy") && <LegalSheet which={sheet} onClose={() => setSheet(null)} />}
    </div>
  );
}

function Row({ Icon, label, right, onClick }: { Icon: (p: { s?: number; c?: string }) => React.ReactElement; label: string; right?: React.ReactNode; onClick?: () => void }) {
  return (
    <div role={onClick ? "button" : undefined} tabIndex={onClick ? 0 : undefined} onClick={onClick} onKeyDown={(e) => onClick && e.key === "Enter" && onClick()}
      style={{ display: "flex", alignItems: "center", gap: 14, padding: "15px 14px", cursor: onClick ? "pointer" : "default", borderTop: "1px solid var(--line)" }}>
      <Icon s={21} c="var(--text-muted)" />
      <span style={{ flex: 1, fontSize: 14.5, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</span>
      {right ?? <ChevronRight s={16} c="var(--ink-mute)" />}
    </div>
  );
}

const groupH: React.CSSProperties ={ margin: "8px 4px 8px", fontSize: 11.5, fontWeight: 700, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.06em" };

const GlobeIcon = ({ s = 22, c = "currentColor" }: { s?: number; c?: string }) => (
  <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
    <circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 2.6 3.8 5.6 3.8 9s-1.3 6.4-3.8 9c-2.5-2.6-3.8-5.6-3.8-9S9.5 5.6 12 3z" />
  </svg>
);

/* ───────────────────────── Help center ───────────────────────── */

const FAQS: [string, string][] = [
  ["How often should I change filters?", "Every 6–9 months, depending on your water TDS and daily usage. The purifier's LED turns amber when a change is due."],
  ["Is installation free?", "Yes — installation is free with every Aquaphil purifier within our service area."],
  ["What does AMC cover?", "3 service visits, filter replacements and priority repairs for one year, plus 20% off other spare parts."],
  ["How do I track my technician?", "Open My Orders → your service booking. Once the technician starts, you'll see them on the live map with an ETA."],
  ["Can I reschedule a visit?", "Yes — chat with support or call us at least 2 hours before your slot and we'll move it for free."],
  ["What payment methods do you accept?", "UPI, cards, netbanking, Aquaphil wallet and cash on delivery for products."],
];

export function HelpCenterPage({ onBack, onLiveChat }: { onBack: () => void; onLiveChat: () => void }) {
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);
  const needle = q.trim().toLowerCase();
  const faqs = FAQS.filter(([a, b]) => !needle || `${a} ${b}`.toLowerCase().includes(needle));
  const whatsapp = `https://wa.me/918012044550?text=${encodeURIComponent("Hi Aquaphil, I need help with my purifier.")}`;

  const contact: { Icon: (p: { s?: number; c?: string }) => React.ReactElement; title: string; sub: string; href?: string; onClick?: () => void; tone: string }[] = [
    { Icon: PhoneIcon, title: "Call us", sub: `${COMPANY.phone} · 8 AM – 8 PM`, href: `tel:${COMPANY.phone.replace(/-/g, "")}`, tone: "var(--success)" },
    { Icon: ChatIcon, title: "WhatsApp", sub: "Chat with us on WhatsApp", href: whatsapp, tone: "var(--teal-bg)" },
    { Icon: InfoIcon, title: "Email", sub: COMPANY.email, href: `mailto:${COMPANY.email}`, tone: "var(--gold-tint)" },
  ];

  return (
    <div>
      <PageHeader title="Help Center" onBack={onBack} />
      <div style={{ padding: "0 16px 24px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", borderRadius: 16, padding: "11px 14px", boxShadow: "var(--shadow-card)" }}>
          <SearchIcon s={19} c="var(--ink-mute)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search for help..." aria-label="Search for help"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "var(--ink)" }} />
        </label>

        <button onClick={onLiveChat} className="press" style={{
          width: "100%", marginTop: 14, border: "none", cursor: "pointer", textAlign: "left", borderRadius: 18, padding: 14,
          background: "linear-gradient(135deg,#0d47a1,#1a6ff0)", color: "white", display: "flex", alignItems: "center", gap: 12,
        }}>
          <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}><ChatIcon s={22} c="white" /></div>
          <div style={{ flex: 1 }}>
            <p style={{ margin: 0, fontSize: 14.5, fontWeight: 700 }}>Live Chat</p>
            <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.8)" }}>Talk to our support team · ~2 min reply</p>
          </div>
          <ChevronRight s={18} c="white" />
        </button>

        <p style={groupH}>FAQs</p>
        <div style={{ ...card, overflow: "hidden" }}>
          {faqs.map(([question, answer], i) => {
            const on = open === question;
            return (
              <div key={question} style={{ borderTop: i ? "1px solid var(--line)" : "none" }}>
                <button onClick={() => setOpen(on ? null : question)} aria-expanded={on} style={{
                  width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "14px", background: "none", border: "none", cursor: "pointer", textAlign: "left",
                }}>
                  <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{question}</span>
                  <span style={{ display: "flex", transform: on ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}><ChevronDown s={16} c="var(--ink-mute)" /></span>
                </button>
                {on && <p className="fade-up" style={{ margin: 0, padding: "0 14px 14px", fontSize: 13, color: "var(--ink-soft)", lineHeight: 1.6 }}>{answer}</p>}
              </div>
            );
          })}
          {faqs.length === 0 && <p style={{ margin: 0, padding: 16, fontSize: 13.5, color: "var(--ink-soft)", textAlign: "center" }}>No answers match “{q}”. Try Live Chat.</p>}
        </div>

        <p style={groupH}>Contact us</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {contact.map(({ Icon, title, sub, href, tone }) => (
            <a key={title} href={href} target={href?.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="press" style={{ ...card, padding: 14, display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: tone, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon s={20} c="var(--ink)" /></div>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{title}</p>
                <p style={{ margin: 0, fontSize: 12, color: "var(--ink-soft)" }}>{sub}</p>
              </div>
              <ChevronRight s={16} c="var(--ink-mute)" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── My AMC ───────────────────────── */

export function AmcPage({ onBack, onRenew }: { onBack: () => void; onRenew: () => void }) {
  const days = amcDaysLeft();
  const left = AMC_PLAN.visitsTotal - AMC_PLAN.visitsUsed;
  return (
    <div>
      <PageHeader title="My AMC" onBack={onBack} />
      <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ borderRadius: 22, padding: 18, background: "linear-gradient(150deg,#0d47a1,#1a6ff0)", color: "white", boxShadow: "0 10px 28px rgba(26,111,240,0.28)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", right: -40, top: -50, width: 170, height: 170, borderRadius: "50%", background: "radial-gradient(circle, rgba(191,225,255,0.35), transparent 70%)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative" }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: "rgba(255,255,255,0.16)", display: "flex", alignItems: "center", justifyContent: "center" }}><BrandMark size={28} light /></div>
            <span style={{ background: days > 0 ? "#22c55e" : "var(--red)", color: "white", fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999 }}>{days > 0 ? "Active" : "Expired"}</span>
          </div>
          <p style={{ margin: "14px 0 2px", fontSize: 19, fontWeight: 800, position: "relative" }}>{AMC_PLAN.name}</p>
          <p style={{ margin: 0, fontSize: 12.5, color: "rgba(255,255,255,0.8)", position: "relative" }}>{AMC_PLAN.product} · Valid till {AMC_PLAN.validTill}</p>
          <div style={{ height: 6, borderRadius: 3, background: "rgba(255,255,255,0.2)", margin: "14px 0 6px" }}>
            <div style={{ width: `${Math.round((AMC_PLAN.visitsUsed / AMC_PLAN.visitsTotal) * 100)}%`, height: "100%", borderRadius: 3, background: "white" }} />
          </div>
          <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.85)", position: "relative" }}>{AMC_PLAN.visitsUsed} of {AMC_PLAN.visitsTotal} visits used · {left} left · {days} days to go</p>
        </div>

        {days <= 30 && (
          <div style={{ ...card, padding: 14, background: "var(--warning)", boxShadow: "none", border: "1px solid var(--warning-border)" }}>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "var(--warning-text)" }}>Your AMC expires in {days} days</p>
            <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--text-secondary)" }}>Renew now to keep free visits and priority repairs without a gap.</p>
          </div>
        )}

        <div style={{ ...card, padding: "6px 14px" }}>
          <p style={{ ...groupH, margin: "10px 0 4px" }}>Plan benefits</p>
          {AMC_PLAN.benefits.map((b) => (
            <div key={b} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 0", fontSize: 13.5, color: "var(--text-secondary)" }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--success)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><CheckIcon s={12} c="var(--success-text)" /></span>{b}
            </div>
          ))}
        </div>

        <div style={{ ...card, padding: "6px 14px" }}>
          {[["Started", AMC_PLAN.start], ["Renews on", AMC_PLAN.validTill], ["Plan type", AMC_PLAN.isFreeYear ? "Free first year (with purchase)" : "Paid"], ["Renewal price", `${inr(AMC_PLAN.renewPrice)} / year`]].map(([k, v], i) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "10px 0", borderTop: i ? "1px solid var(--line)" : "none", fontSize: 13 }}>
              <span style={{ color: "var(--ink-soft)" }}>{k}</span><span style={{ fontWeight: 600, color: "var(--ink)", textAlign: "right" }}>{v}</span>
            </div>
          ))}
        </div>

        <PrimaryButton onClick={onRenew}>Renew Plan · {inr(AMC_PLAN.renewPrice)}</PrimaryButton>
        <a href={`tel:${COMPANY.phone.replace(/-/g, "")}`} style={{ textAlign: "center", fontSize: 13.5, fontWeight: 600, color: "var(--blue)", textDecoration: "none", padding: 6 }}>Need help? Call us</a>
      </div>
    </div>
  );
}
