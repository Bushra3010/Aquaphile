"use client";

import { useState } from "react";
import { CartIcon, CheckIcon, ChevronRight, HeartIcon, ShareIcon, StarIcon } from "./icons";
import PurifierArt from "./PurifierArt";
import { BrandMark } from "./Brand";
import { PageHeader, PrimaryButton, card, iconBtn } from "./ui";
import {
  CATEGORIES, COMPANY, PRODUCTS, inr, productById, offeringOf,
  type Address, type Category, type Order, type ServiceRequest,
} from "../lib/data";

/* ───────────────────────── Shop by category ───────────────────────── */

export function CategoriesPage({ onBack, onOpen }: { onBack: () => void; onOpen: (c: Category) => void }) {
  return (
    <div>
      <PageHeader title="Shop by Category" onBack={onBack} />
      <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 12 }}>
        {CATEGORIES.map((c) => {
          const count = PRODUCTS.filter((p) => p.category === c.id).length;
          const from = Math.min(...PRODUCTS.filter((p) => p.category === c.id).map((p) => p.price));
          return (
            <button key={c.id} onClick={() => onOpen(c.id)} className="press" style={{ ...card, border: "none", padding: 12, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 76, height: 76, borderRadius: 16, background: "var(--blue-pale)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <PurifierArt kind={c.art} size={70} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 15.5, fontWeight: 700, color: "var(--ink)" }}>{c.label}</p>
                <p style={{ margin: "2px 0 0", fontSize: 12.5, color: "var(--ink-soft)" }}>{c.blurb}</p>
                <p style={{ margin: "6px 0 0", fontSize: 12, color: "var(--blue)", fontWeight: 600 }}>{count} products · from {inr(from)}</p>
              </div>
              <ChevronRight s={18} c="var(--ink-mute)" />
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ───────────────────────── Wishlist ───────────────────────── */

export function WishlistPage({ ids, onBack, onOpen, onRemove, onAdd, onShop }: {
  ids: string[]; onBack: () => void; onOpen: (id: string) => void; onRemove: (id: string) => void; onAdd: (id: string) => void; onShop: () => void;
}) {
  const items = ids.map(productById).filter((p) => p !== undefined);
  return (
    <div>
      <PageHeader title={`My Wishlist${items.length ? ` (${items.length})` : ""}`} onBack={onBack} />
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 24px" }}>
          <div style={{ width: 96, height: 96, borderRadius: "50%", background: "var(--blue-tint)", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}><HeartIcon s={42} c="var(--blue)" /></div>
          <p style={{ margin: "18px 0 4px", fontSize: 17, fontWeight: 700, color: "var(--ink)" }}>Your wishlist is empty</p>
          <p style={{ margin: "0 0 22px", fontSize: 13.5, color: "var(--ink-soft)" }}>Tap the heart on any product to save it here.</p>
          <PrimaryButton onClick={onShop} style={{ maxWidth: 240, margin: "0 auto" }}>Browse Products</PrimaryButton>
        </div>
      ) : (
        <div style={{ padding: "0 16px 24px", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.map((p) => (
            <div key={p.id} role="button" tabIndex={0} onClick={() => onOpen(p.id)} onKeyDown={(e) => e.key === "Enter" && onOpen(p.id)} className="press"
              style={{ ...card, padding: 10, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
              <div style={{ width: 72, height: 72, borderRadius: 12, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><PurifierArt kind={p.art} size={64} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>{p.name}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 2 }}><StarIcon s={12} /><span style={{ fontSize: 11.5, fontWeight: 600, color: "var(--ink)" }}>{p.rating}</span></div>
                <p style={{ margin: "4px 0 0", fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{inr(p.price)} <s style={{ fontSize: 11.5, fontWeight: 400, color: "var(--ink-mute)" }}>{inr(p.mrp)}</s></p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 12 }}>
                <button aria-label={`Remove ${p.name} from wishlist`} onClick={(e) => { e.stopPropagation(); onRemove(p.id); }} style={iconBtn}><HeartIcon s={21} filled /></button>
                <button aria-label={`Add ${p.name} to cart`} onClick={(e) => { e.stopPropagation(); onAdd(p.id); }} className="press" style={{
                  width: 34, height: 34, borderRadius: 11, border: "none", cursor: "pointer", background: "var(--blue)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}><CartIcon s={17} c="white" w={2} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────── Invoice ───────────────────────── */

const GST_RATE = 0.18;

/** Tax invoice for a product order or a service booking. Prices are GST-inclusive. */
export function InvoicePage({ order, service, address, userName, onBack }: {
  order: Order; service?: ServiceRequest; address?: Address; userName: string; onBack: () => void;
}) {
  const [shared, setShared] = useState(false);

  const lines = order.kind === "product"
    ? (order.productIds ?? []).map((id) => { const p = productById(id)!; return { name: p.name, qty: order.quantities?.[id] ?? 1, amount: p.price }; })
    : [{ name: `${service?.type ?? "Service"} visit${service ? ` · ${service.product}` : ""}`, qty: 1, amount: service ? offeringOf(service.type).price : order.amount + (order.discount ?? 0) }];
  const itemsTotal = lines.reduce((s, l) => s + l.amount * l.qty, 0);
  const discount = order.discount ?? 0;
  const wallet = order.walletUsed ?? 0;
  const payable = itemsTotal - discount - wallet;
  const taxable = Math.round(payable / (1 + GST_RATE));
  const gst = payable - taxable;
  const invoiceNo = `INV-${order.id.replace(/\D/g, "")}`;

  const share = async () => {
    const text = `Aquaphil invoice ${invoiceNo} for order #${order.id} · ${inr(payable)}`;
    try {
      if (navigator.share) await navigator.share({ title: `Invoice ${invoiceNo}`, text });
      else { await navigator.clipboard.writeText(text); setShared(true); setTimeout(() => setShared(false), 1500); }
    } catch { /* share sheet dismissed */ }
  };

  const row = (k: string, v: string, strong = false) => (
    <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", fontSize: strong ? 14.5 : 13, fontWeight: strong ? 700 : 400, color: strong ? "var(--ink)" : "var(--ink-soft)" }}>
      <span>{k}</span><span style={{ color: "var(--ink)", fontWeight: strong ? 700 : 600 }}>{v}</span>
    </div>
  );

  return (
    <div>
      <div className="no-print"><PageHeader title="Invoice" onBack={onBack} /></div>
      <div style={{ padding: "0 16px 24px" }}>
        <div className="print-area" style={{ ...card, padding: 18 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <BrandMark size={34} />
              <div>
                <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: "var(--blue-dark)" }}>{COMPANY.name}</p>
                <p style={{ margin: 0, fontSize: 10.5, color: "var(--ink-soft)" }}>GSTIN {COMPANY.gstin}</p>
              </div>
            </div>
            <span style={{ fontSize: 10.5, fontWeight: 700, letterSpacing: "0.06em", color: "var(--success-text)", background: "var(--success)", padding: "3px 8px", borderRadius: 6 }}>PAID</span>
          </div>
          <p style={{ margin: "8px 0 0", fontSize: 11, color: "var(--ink-mute)", lineHeight: 1.5 }}>{COMPANY.address}</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <div>
              <p style={meta}>Invoice no.</p><p style={metaV}>{invoiceNo}</p>
              <p style={{ ...meta, marginTop: 8 }}>Order</p><p style={metaV}>#{order.id}</p>
            </div>
            <div>
              <p style={meta}>Date</p><p style={metaV}>{order.date}</p>
              <p style={{ ...meta, marginTop: 8 }}>Payment</p><p style={metaV}>{order.payment ?? (order.kind === "service" ? "Pay after service" : "UPI")}</p>
            </div>
          </div>

          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
            <p style={meta}>Billed to</p>
            <p style={metaV}>{userName}</p>
            {address && <p style={{ margin: "2px 0 0", fontSize: 12, color: "var(--ink-soft)", lineHeight: 1.5 }}>{address.line} {address.pincode}</p>}
          </div>

          <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid var(--line)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, fontWeight: 700, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 6 }}>
              <span>Item</span><span>Amount</span>
            </div>
            {lines.map((l) => (
              <div key={l.name} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "6px 0", fontSize: 13.5 }}>
                <span style={{ color: "var(--ink)" }}>{l.name} <span style={{ color: "var(--ink-mute)" }}>× {l.qty}</span></span>
                <span style={{ fontWeight: 600, color: "var(--ink)" }}>{inr(l.amount * l.qty)}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 8, paddingTop: 8, borderTop: "1px dashed var(--line-strong)" }}>
            {row("Items total", inr(itemsTotal))}
            {order.kind === "product" && row("Delivery & installation", "FREE")}
            {discount > 0 && row(`Coupon ${order.coupon ?? ""}`, `− ${inr(discount)}`)}
            {wallet > 0 && row("Paid from wallet", `− ${inr(wallet)}`)}
            {row("Taxable value", inr(taxable))}
            {row("CGST 9% + SGST 9%", inr(gst))}
            <div style={{ borderTop: "1px solid var(--line)", marginTop: 6, paddingTop: 4 }}>{row("Total", inr(payable), true)}</div>
          </div>
          <p style={{ margin: "12px 0 0", fontSize: 10.5, color: "var(--ink-mute)", textAlign: "center" }}>This is a computer-generated invoice. Questions? {COMPANY.phone} · {COMPANY.email}</p>
        </div>

        <div className="no-print" style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <PrimaryButton onClick={() => window.print()} style={{ flex: 1 }}>Download PDF</PrimaryButton>
          <button onClick={share} className="press" style={{
            flex: 1, borderRadius: 16, border: "2px solid var(--blue)", background: "var(--surface)", color: "var(--blue)",
            fontSize: 15, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>{shared ? <><CheckIcon s={16} c="var(--blue)" /> Copied</> : <><ShareIcon s={17} c="var(--blue)" /> Share</>}</button>
        </div>
      </div>
    </div>
  );
}

const meta: React.CSSProperties = { margin: 0, fontSize: 10.5, fontWeight: 600, color: "var(--ink-mute)", textTransform: "uppercase", letterSpacing: "0.05em" };
const metaV: React.CSSProperties = { margin: "2px 0 0", fontSize: 13.5, fontWeight: 600, color: "var(--ink)" };
