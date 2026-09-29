"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { BackIcon, BagIcon, CardIcon, ChevronRight, ClipIcon, GearIcon, GiftIcon, HeartIcon, HelpIcon, HistoryIcon, InfoIcon, PinIcon, SearchIcon, SendIcon, ShieldIcon, BellIcon, StarLineIcon, TagIcon, WalletIcon } from "./icons";
import { Avatar, PageHeader, card, iconBtn } from "./ui";
import { BrandMark } from "./Brand";
import { initialsOf, inr, type ChatMessage, type ChatThread, type UserProfile } from "../lib/data";

/* ───────────────────────── Chat list ───────────────────────── */

function ThreadAvatar({ thread, size = 48 }: { thread: ChatThread; size?: number }) {
  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      {thread.avatar === "brand"
        ? <div style={{ width: size, height: size, borderRadius: "50%", background: "var(--surface)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "var(--shadow-card)" }}><BrandMark size={size * 0.64} /></div>
        : <Avatar initials={thread.initials} size={size} />}
      {thread.online && <span style={{ position: "absolute", right: 0, bottom: 1, width: size * 0.24, height: size * 0.24, borderRadius: "50%", background: "var(--green-500)", border: "2px solid var(--app-bg)" }} />}
    </div>
  );
}

export function ChatListScreen({ threads, onOpen }: { threads: ChatThread[]; onOpen: (id: string) => void }) {
  const [q, setQ] = useState("");
  const needle = q.trim().toLowerCase();
  const rows = threads.filter((t) => !needle || `${t.name} ${t.messages.map((m) => m.body).join(" ")}`.toLowerCase().includes(needle));
  return (
    <div>
      <PageHeader title="Chat" />
      <div style={{ padding: "0 16px 16px" }}>
        <label style={{ display: "flex", alignItems: "center", gap: 10, background: "var(--surface)", borderRadius: 16, padding: "11px 14px", boxShadow: "var(--shadow-card)" }}>
          <SearchIcon s={19} c="var(--ink-mute)" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search messages..." aria-label="Search messages"
            style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "var(--ink)" }} />
        </label>
        <div style={{ marginTop: 10 }}>
          {rows.map((t, i) => {
            const last = t.messages[t.messages.length - 1];
            return (
              <button key={t.id} onClick={() => onOpen(t.id)} className="press" style={{
                width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 2px", background: "none", border: "none",
                borderTop: i ? "1px solid var(--line)" : "none", cursor: "pointer", textAlign: "left",
              }}>
                <ThreadAvatar thread={t} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                    <span style={{ fontSize: 14.5, fontWeight: 700, color: "var(--ink)" }}>{t.name}</span>
                    <span style={{ fontSize: 11, color: t.unread ? "var(--blue)" : "var(--ink-mute)", fontWeight: t.unread ? 700 : 500, flexShrink: 0 }}>{last?.at}</span>
                  </div>
                  <p style={{ margin: "1px 0 0", fontSize: 11.5, color: "var(--ink-mute)" }}>{t.role}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginTop: 2 }}>
                    <span style={{ fontSize: 13, color: t.unread ? "var(--ink)" : "var(--ink-soft)", fontWeight: t.unread ? 600 : 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {last ? `${last.from === "me" ? "You: " : ""}${last.body}` : "Say hello 👋"}
                    </span>
                    {t.unread > 0 && <span style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: 10, background: "var(--blue)", color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{t.unread}</span>}
                  </div>
                </div>
              </button>
            );
          })}
          {rows.length === 0 && <p style={{ textAlign: "center", color: "var(--ink-soft)", fontSize: 14, padding: "40px 0" }}>No chats match “{q}”.</p>}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Chat ───────────────────────── */

export function ChatScreen({ thread, typing, onSend, onBack }: {
  thread: ChatThread; typing: boolean; onSend: (body: string) => void; onBack?: () => void;
}) {
  const messages = thread.messages;
  const [draft, setDraft] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" }); }, [messages.length, typing]);

  const send = (text = draft) => {
    const body = text.trim();
    if (!body) return;
    onSend(body);
    setDraft("");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px 12px", background: "var(--app-bg)", borderBottom: "1px solid var(--line)" }}>
        {onBack && <button onClick={onBack} aria-label="Back" className="press" style={iconBtn}><BackIcon c="var(--ink)" /></button>}
        <ThreadAvatar thread={thread} size={42} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: 15.5, fontWeight: 600, color: "var(--ink)" }}>{thread.name}</p>
          <p style={{ margin: 0, fontSize: 11.5, color: thread.online || typing ? "var(--success-text)" : "var(--ink-mute)", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {typing ? "typing…" : thread.online ? `Online · ${thread.role}` : `Offline · ${thread.role}`}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="no-scroll" style={{ flex: 1, minHeight: 0, overflowY: "auto", padding: "14px 16px 8px" }}>
        <p style={{ textAlign: "center", margin: "0 0 12px" }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: "var(--ink-soft)", background: "var(--surface)", padding: "4px 12px", borderRadius: 999 }}>Today</span>
        </p>
        {messages.map((m) => {
          const me = m.from === "me";
          return (
            <div key={m.id} className="fade-up" style={{ display: "flex", justifyContent: me ? "flex-end" : "flex-start", marginBottom: 10 }}>
              <div style={{ maxWidth: "78%" }}>
                <div style={{
                  padding: "10px 14px", fontSize: 13.5, lineHeight: 1.5,
                  borderRadius: me ? "18px 18px 6px 18px" : "18px 18px 18px 6px",
                  background: me ? "linear-gradient(135deg,var(--blue),var(--blue-dark))" : "var(--surface)",
                  color: me ? "white" : "var(--ink)",
                  boxShadow: me ? "0 4px 12px rgba(26,111,240,0.22)" : "var(--shadow-card)",
                }}>{m.body}</div>
                <p style={{ margin: "3px 6px 0", fontSize: 10.5, color: "var(--ink-mute)", textAlign: me ? "right" : "left" }}>{m.at}{me && " · ✓✓"}</p>
              </div>
            </div>
          );
        })}
        {typing && (
          <div style={{ display: "inline-flex", gap: 4, background: "var(--surface)", padding: "12px 14px", borderRadius: "18px 18px 18px 6px", boxShadow: "var(--shadow-card)" }}>
            {[0, 1, 2].map((i) => <span key={i} className="animate-pulse-dot" style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--ink-mute)", animationDelay: `${i * 0.2}s` }} />)}
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Quick replies + composer — sits above the floating bottom nav */}
      <div style={{ padding: "6px 16px 0" }}>
        <div className="no-scroll" style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 8 }}>
          {thread.quick.map((q) => (
            <button key={q} onClick={() => send(q === "Share order number" ? "My order number is AQP4587" : q)} style={{
              flexShrink: 0, border: "1.5px solid var(--blue-ghost)", background: "var(--surface)", color: "var(--blue)",
              borderRadius: 999, padding: "6px 12px", fontSize: 12, fontWeight: 600, cursor: "pointer",
            }}>{q}</button>
          ))}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); send(); }} style={{ display: "flex", alignItems: "center", gap: 10, paddingBottom: onBack ? "calc(12px + env(safe-area-inset-bottom))" : 10 }}>
          <label style={{ flex: 1, display: "flex", alignItems: "center", gap: 8, background: "var(--surface)", borderRadius: 999, padding: "10px 14px", boxShadow: "var(--shadow-card)" }}>
            <input value={draft} onChange={(e) => setDraft(e.target.value)} placeholder="Type a message..."
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 14, color: "var(--ink)" }} />
            <span aria-label="Attach photo" style={{ display: "flex" }}><ClipIcon s={19} c="var(--ink-mute)" /></span>
          </label>
          <button type="submit" aria-label="Send" className="press" disabled={!draft.trim()} style={{
            width: 46, height: 46, borderRadius: "50%", border: "none", cursor: "pointer", flexShrink: 0,
            background: draft.trim() ? "linear-gradient(135deg,var(--blue),var(--blue-dark))" : "var(--line-strong)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: draft.trim() ? "0 6px 14px rgba(26,111,240,0.3)" : "none",
          }}><SendIcon s={19} c="white" w={2} /></button>
        </form>
      </div>
    </div>
  );
}

/* ───────────────────────── Profile ───────────────────────── */

export type ProfileKey =
  | "edit" | "orders" | "history" | "wallet" | "offers" | "referral" | "reviews" | "amc"
  | "addresses" | "payments" | "notifications" | "help" | "about" | "wishlist" | "settings";

type MenuIcon = (p: { s?: number; c?: string; w?: number }) => React.ReactElement;

const MENU: { title: string; items: { key: ProfileKey; label: string; Icon: MenuIcon }[] }[] = [
  { title: "Orders & services", items: [
    { key: "orders", label: "My Orders", Icon: BagIcon },
    { key: "history", label: "Service History", Icon: HistoryIcon },
    { key: "amc", label: "AMC Plans", Icon: ShieldIcon },
    { key: "wishlist", label: "My Wishlist", Icon: HeartIcon },
    { key: "reviews", label: "My Ratings & Reviews", Icon: StarLineIcon },
  ] },
  { title: "Payments & rewards", items: [
    { key: "wallet", label: "Aquaphil Wallet", Icon: WalletIcon },
    { key: "offers", label: "Offers & Coupons", Icon: TagIcon },
    { key: "referral", label: "Refer & Earn", Icon: GiftIcon },
    { key: "payments", label: "Payment Methods", Icon: CardIcon },
  ] },
  { title: "Account", items: [
    { key: "addresses", label: "Saved Addresses", Icon: PinIcon },
    { key: "notifications", label: "Notifications", Icon: BellIcon },
    { key: "settings", label: "Settings", Icon: GearIcon },
    { key: "help", label: "Help & Support", Icon: HelpIcon },
    { key: "about", label: "About Us", Icon: InfoIcon },
  ] },
];

export function ProfileScreen({ user, stats, walletBalance, unreadNotifs, onMenu, onLogout }: {
  user: UserProfile; stats: { orders: number; services: number; amcDays: number }; walletBalance: number; unreadNotifs: number;
  onMenu: (k: ProfileKey) => void; onLogout: () => void;
}) {
  // Nudge until the optional fields are filled in.
  const filled = [user.name, user.email, user.phone, user.gender, user.dob].filter(Boolean).length;
  const complete = Math.round((filled / 5) * 100);
  return (
    <div style={{ paddingBottom: 12 }}>
      <PageHeader title="My Profile" right={<button aria-label="Settings" onClick={() => onMenu("settings")} className="press" style={iconBtn}><GearIcon s={22} c="var(--text-secondary)" /></button>} />

      {/* Identity card */}
      <div style={{ padding: "0 16px" }}>
        <div style={{ ...card, padding: "18px 16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <Avatar initials={initialsOf(user.name)} size={58} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: "var(--ink)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
              <p style={{ margin: "1px 0 0", fontSize: 13, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</p>
              <p style={{ margin: "1px 0 0", fontSize: 12.5, color: "var(--text-muted)" }}>{user.phone}</p>
            </div>
            <button onClick={() => onMenu("edit")} style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "var(--blue)", fontSize: 12.5, fontWeight: 600, letterSpacing: "0.03em", alignSelf: "flex-start" }}>EDIT</button>
          </div>
          <span style={{ display: "inline-block", marginTop: 14, background: "var(--green)", color: "white", fontSize: 11, fontWeight: 600, padding: "5px 11px", borderRadius: 6, letterSpacing: "0.02em" }}>AMC ACTIVE</span>
          {complete < 100 && (
            <button onClick={() => onMenu("edit")} style={{ display: "block", width: "100%", marginTop: 14, background: "none", border: "none", padding: 0, cursor: "pointer", textAlign: "left" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, fontWeight: 600 }}>
                <span style={{ color: "var(--ink-soft)" }}>Profile {complete}% complete</span><span style={{ color: "var(--blue)" }}>Complete now →</span>
              </div>
              <div style={{ height: 5, borderRadius: 3, background: "var(--line)", marginTop: 6 }}>
                <div style={{ width: `${complete}%`, height: "100%", borderRadius: 3, background: "var(--blue)" }} />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* Wallet + refer shortcuts */}
      <div style={{ padding: "12px 16px 0", display: "flex", gap: 10 }}>
        <button onClick={() => onMenu("wallet")} className="press" style={{ ...card, flex: 1, border: "none", padding: 14, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "var(--blue-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}><WalletIcon s={20} c="var(--blue)" /></div>
          <div><p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-soft)" }}>Wallet</p><p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{inr(walletBalance)}</p></div>
        </button>
        <button onClick={() => onMenu("referral")} className="press" style={{ ...card, flex: 1, border: "none", padding: 14, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 12, background: "var(--gold-tint)", display: "flex", alignItems: "center", justifyContent: "center" }}><GiftIcon s={20} c="var(--gold-dark)" /></div>
          <div><p style={{ margin: 0, fontSize: 11.5, color: "var(--ink-soft)" }}>Refer &amp; earn</p><p style={{ margin: 0, fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>₹250</p></div>
        </button>
      </div>

      {/* Snapshot strip */}
      <div style={{ padding: "14px 16px 0" }}>
        <div style={{ ...card, padding: "14px 16px", display: "flex" }}>
          {[[String(stats.orders), "Orders"], [String(stats.services), "Services"], [`${stats.amcDays}d`, "AMC left"]].map(([v, l], i) => (
            <div key={l} style={{ flex: 1, textAlign: "center", borderRight: i < 2 ? "1px solid var(--border)" : "none" }}>
              <p style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>{v}</p>
              <p style={{ margin: "2px 0 0", fontSize: 11.5, color: "var(--text-muted)" }}>{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Menu — flat rows on the canvas, split by hairlines */}
      {MENU.map((group) => (
        <div key={group.title} style={{ padding: "18px 16px 0" }}>
          <p style={{ margin: "0 2px 2px", fontSize: 11.5, fontWeight: 700, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{group.title}</p>
          {group.items.map(({ key, label, Icon }, i) => (
            <button key={key} onClick={() => onMenu(key)} className="press" style={{
              width: "100%", display: "flex", alignItems: "center", gap: 16, padding: "15px 2px",
              background: "none", border: "none", borderTop: i === 0 ? "none" : "1px solid var(--line)",
              cursor: "pointer", textAlign: "left",
            }}>
              <Icon s={22} c="var(--text-muted)" w={1.6} />
              <span style={{ flex: 1, fontSize: 15, fontWeight: 500, color: "var(--text-secondary)" }}>{label}</span>
              {key === "notifications" && unreadNotifs > 0 && (
                <span style={{ minWidth: 20, height: 20, padding: "0 6px", borderRadius: 10, background: "var(--red)", color: "white", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{unreadNotifs}</span>
              )}
              {key === "wallet" && <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink-soft)" }}>{inr(walletBalance)}</span>}
              <ChevronRight s={16} c="var(--ink-mute)" />
            </button>
          ))}
        </div>
      ))}

      <div style={{ padding: "22px 16px 12px" }}>
        <button onClick={onLogout} className="press" style={{
          width: "100%", background: "var(--surface)", color: "var(--red)", border: "none", borderRadius: 16,
          padding: 15, fontSize: 15, fontWeight: 600, cursor: "pointer",
        }}>Log Out</button>
        <p style={{ textAlign: "center", fontSize: 12, marginTop: 14 }}>
          <Link href="/technician" style={{ color: "var(--blue)", fontWeight: 600, textDecoration: "none" }}>Are you a Aquaphil technician? Partner app →</Link>
        </p>
        <p style={{ textAlign: "center", fontSize: 11.5, color: "var(--text-disabled)", marginTop: 6 }}>Aquaphil v1.0.0</p>
      </div>
    </div>
  );
}

/* ───────────────────────── Simple info pages from the profile menu ───────────────────────── */

export function InfoPage({ title, onBack, children }: { title: string; onBack: () => void; children: React.ReactNode }) {
  return (
    <div>
      <PageHeader title={title} onBack={onBack} />
      <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>{children}</div>
    </div>
  );
}
