"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BottomNav, { type Tab } from "./components/BottomNav";
import HomeScreen from "./components/HomeScreen";
import { LoginScreen, OnboardingScreen, OtpScreen, SplashScreen, formatMobile } from "./components/Intro";
import { CartPage, OrderPlacedPage, ProductDetailPage, ProductListPage, type CartLine, type CheckoutTotals } from "./components/ShopScreens";
import { CategoriesPage, InvoicePage, WishlistPage } from "./components/ShopExtras";
import { BookServiceScreen, OrderDetailPage, OrdersScreen, TrackServicePage, type BookingRequest } from "./components/ServiceScreens";
import { ChatListScreen, ChatScreen, InfoPage, ProfileScreen, type ProfileKey } from "./components/ChatProfile";
import { AddressesPage, EditProfilePage, NotificationsPage, ReferralPage, WalletPage } from "./components/Account";
import { AmcPage, HelpCenterPage, SettingsPage, type Language } from "./components/AccountExtras";
import { OffersPage } from "./components/Offers";
import { AllReviewsPage, MyReviewsPage, TechnicianPage, WriteReviewPage } from "./components/Reviews";
import { ServiceDetailPage, ServicesHubScreen } from "./components/ServicesHub";
import { StatusBadge, card } from "./components/ui";
import { ChevronRight, CardIcon } from "./components/icons";
import {
  COMPANY, INITIAL_ADDRESSES, INITIAL_NOTIFICATIONS, INITIAL_ORDERS, INITIAL_REFERRALS, INITIAL_REVIEWS, INITIAL_SERVICES,
  INITIAL_THREADS, INITIAL_WALLET, REFERRAL_REWARD, SERVICE_STEPS, STEP, USER, amcDaysLeft, inr, nowTime, productById,
  serviceStatus, techById, todayLabel,
  type Address, type AppNotification, type Category, type ChatThread, type NotifPrefs, type Order, type Referral, type Review,
  type ServiceRating, type ServiceRequest, type ServiceType, type UserProfile, type WalletTxn,
} from "./lib/data";

const SHELL_MAX_W = 430;
const ONBOARDED_KEY = "aquaphil:onboarded";
const SESSION_KEY = "aquaphil:session";
const THEME_KEY = "aquaphil:theme";
const LANG_KEY = "aquaphil:lang";

type Stage = "splash" | "onboarding" | "login" | "otp" | "app";

type Detail =
  | { k: "products"; q?: string; cat?: Category }
  | { k: "product"; id: string }
  | { k: "categories" }
  | { k: "wishlist" }
  | { k: "cart" }
  | { k: "placed"; ref: string; title: string; next: Detail }
  | { k: "track"; id: string }
  | { k: "order"; id: string }
  | { k: "invoice"; id: string }
  | { k: "orders" }
  | { k: "book"; type: ServiceType }
  | { k: "serviceInfo"; type: ServiceType }
  | { k: "tech"; id: string }
  | { k: "reviews"; productId: string }
  | { k: "writeReview"; productId: string }
  | { k: "myReviews" }
  | { k: "offers" }
  | { k: "wallet" }
  | { k: "referral" }
  | { k: "notifications" }
  | { k: "editProfile" }
  | { k: "addresses" }
  | { k: "thread"; id: string }
  | { k: "settings" }
  | { k: "help" }
  | { k: "amc" }
  | { k: "info"; key: ProfileKey };

/* Device-local preferences. Storage can be blocked (private mode), so every access is guarded. */
const read = (key: string) => { try { return localStorage.getItem(key); } catch { return null; } };
const write = (key: string, v: string | null) => { try { if (v === null) localStorage.removeItem(key); else localStorage.setItem(key, v); } catch { /* storage blocked */ } };

let seq = 4700;
const nextRef = (prefix: string) => `${prefix}${++seq}`;

/** Canned replies per conversation until the real chat backend (Supabase Realtime) is wired up. */
function autoReply(threadId: string, body: string) {
  const t = body.toLowerCase();
  if (threadId === "t1") {
    if (/where|how long|eta/.test(t)) return "About 10 minutes away — stuck at the Sony signal, almost there.";
    if (/call/.test(t)) return "Sure, I'll call you when I reach your gate.";
    return "Okay ji 👍";
  }
  if (threadId === "billing") {
    if (/invoice/.test(t)) return "Your invoices are under My Orders → order → View Invoice. I've also emailed the latest one.";
    if (/refund/.test(t)) return "Refunds reach your account in 5–7 working days after pickup. Share the order number and I'll check.";
    if (/renew|amc/.test(t)) return "You can renew from Profile → AMC Plans → Renew Plan. Use AMC300 for ₹300 off!";
    return "Thanks — our billing desk replies within 4 working hours.";
  }
  if (/aqp\d+|order/.test(t)) return "Got it! I can see that order. Is the issue with water flow, taste or a leak?";
  if (/filter/.test(t)) return "Filters should be changed every 6–9 months. Want me to book a filter-change visit for you?";
  if (/leak/.test(t)) return "Please switch off the purifier's inlet valve. I'm raising a priority repair request right away.";
  if (/amc/.test(t)) return `Your AMC for AquaPure Smart RO is due in ${amcDaysLeft()} days. You can renew it from Home → AMC Renewal.`;
  return "Thanks! Our support team will get back to you shortly.";
}

/** "12th Main, Koramangala, Bengaluru, Karnataka" → "Koramangala, Bengaluru". */
const shortArea = (a?: Address) => {
  if (!a) return "Add your address";
  const parts = a.line.split(",").map((s) => s.trim()).filter((s) => s && s !== "Karnataka");
  return parts.slice(-2).join(", ");
};

export default function CustomerApp() {
  const [stage, setStage] = useState<Stage>("splash");
  const [mobile, setMobile] = useState("");
  const [tab, setTab] = useState<Tab>("home");
  const [stack, setStack] = useState<Detail[]>([]);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [services, setServices] = useState<ServiceRequest[]>(INITIAL_SERVICES);
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [typing, setTyping] = useState<string | null>(null);
  const [wish, setWish] = useState<string[]>(["pro"]);
  const [user, setUser] = useState<UserProfile>(USER);
  const [addresses, setAddresses] = useState<Address[]>(INITIAL_ADDRESSES);
  const [wallet, setWallet] = useState<WalletTxn[]>(INITIAL_WALLET);
  const [referrals, setReferrals] = useState<Referral[]>(INITIAL_REFERRALS);
  const [notifs, setNotifs] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>({ push: true, sms: true, whatsapp: false, offers: true });
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [coupon, setCoupon] = useState<string | null>(null);
  const [useWallet, setUseWallet] = useState(false);
  const [dark, setDark] = useState(false);
  const [language, setLanguage] = useState<Language>("English");
  const [toast, setToast] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const openThread = useRef<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Restore device preferences once on mount.
  useEffect(() => {
    setDark(read(THEME_KEY) === "dark");
    const lang = read(LANG_KEY);
    if (lang === "English" || lang === "हिन्दी") setLanguage(lang);
  }, []);
  useEffect(() => {
    document.documentElement.dataset.theme = dark ? "dark" : "light";
  }, [dark]);

  const detail = stack[stack.length - 1];
  const detailKey = detail ? JSON.stringify(detail) : tab;
  useEffect(() => { scrollRef.current?.scrollTo({ top: 0 }); }, [detailKey]);

  const push = (d: Detail) => setStack((s) => [...s, d]);
  const back = () => setStack((s) => s.slice(0, -1));
  const goTab = (t: Tab) => { setStack([]); setTab(t); };
  const flash = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  };

  /* ── Entry flow: splash → onboarding (first run) → login → OTP → app ── */
  const afterSplash = useCallback(() => {
    setStage(read(SESSION_KEY) ? "app" : read(ONBOARDED_KEY) ? "login" : "onboarding");
  }, []);
  const signIn = (phone?: string) => {
    write(SESSION_KEY, "1");
    if (phone) setUser((u) => ({ ...u, phone: formatMobile(phone) }));
    setStage("app");
    flash(`Welcome, ${user.name.split(" ")[0]}!`);
  };

  const cartCount = cart.reduce((s, l) => s + l.qty, 0);
  const walletBalance = wallet.reduce((s, t) => s + t.amount, 0);
  const unreadNotifs = notifs.filter((n) => !n.read).length;
  const unreadChat = threads.reduce((s, t) => s + t.unread, 0);
  const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
  const referralCode = `${user.name.split(" ")[0].toUpperCase().replace(/[^A-Z]/g, "").slice(0, 6) || "AQUA"}250`;

  /** Drops a new item into the in-app notification centre. */
  const notify = (n: Omit<AppNotification, "id" | "at" | "read">) =>
    setNotifs((all) => [{ ...n, id: `n${Date.now()}${Math.random().toString(36).slice(2, 5)}`, at: `${todayLabel()}, ${nowTime()}`, read: false }, ...all]);

  const creditWallet = (title: string, amount: number) =>
    setWallet((w) => [{ id: `w${Date.now()}`, title, amount, at: todayLabel() }, ...w]);

  const addToCart = (id: string, qty = 1) => {
    setCart((c) => {
      const hit = c.find((l) => l.id === id);
      return hit ? c.map((l) => (l.id === id ? { ...l, qty: Math.min(9, l.qty + qty) } : l)) : [...c, { id, qty }];
    });
    flash(`${productById(id)?.name} added to cart`);
  };

  const setQty = (id: string, qty: number) =>
    setCart((c) => (qty <= 0 ? c.filter((l) => l.id !== id) : c.map((l) => (l.id === id ? { ...l, qty } : l))));

  const toggleWish = (id: string) => {
    const on = wish.includes(id);
    setWish((w) => (on ? w.filter((x) => x !== id) : [...w, id]));
    flash(on ? "Removed from wishlist" : "Saved to wishlist");
  };

  const checkout = (pay: "online" | "cod", t: CheckoutTotals) => {
    const first = productById(cart[0].id)!;
    const ref = nextRef("AQP");
    const title = cart.length > 1 ? `${first.name} + ${cart.length - 1} more` : first.name;
    setOrders((o) => [{
      id: ref, kind: "product", title, art: first.art, amount: t.toPay, date: todayLabel(), status: "Placed",
      productIds: cart.map((l) => l.id), quantities: Object.fromEntries(cart.map((l) => [l.id, l.qty])), coupon: t.coupon ?? undefined, discount: t.discount || undefined, walletUsed: t.walletUsed || undefined,
      payment: t.toPay === 0 ? "Wallet" : pay === "cod" ? "COD" : "UPI",
    }, ...o]);
    if (t.walletUsed) creditWallet(`Paid for order #${ref}`, -t.walletUsed);
    notify({ kind: "order", title: "Order placed", body: `${title} · ${inr(t.toPay)}. We'll notify you when it ships.`, link: { k: "order", id: ref } });
    setCart([]); setCoupon(null); setUseWallet(false);
    setStack([{ k: "placed", ref, title: "Order Placed!", next: { k: "order", id: ref } }]);
  };

  const stampStep = (id: string, step: number, extra: Partial<ServiceRequest> = {}) => {
    const at = `${todayLabel()}, ${nowTime()}`;
    setServices((all) => all.map((s) => s.id !== id ? s : {
      ...s, ...extra, current: extra.current ?? step, timeline: s.timeline.map((st, i) => (i === step ? { ...st, at } : st)),
    }));
  };

  const bookService = ({ price, coupon: code, discount, ...req }: BookingRequest) => {
    const id = nextRef("SRV");
    const ref = nextRef("AQP");
    const now = `${todayLabel()}, ${nowTime()}`;
    const svc: ServiceRequest = {
      id, ...req, current: STEP.requested, technician: null,
      timeline: SERVICE_STEPS.map((label, i) => ({ label, at: i === STEP.requested ? now : null })),
    };
    setServices((s) => [svc, ...s]);
    setOrders((o) => [{
      id: ref, kind: "service", title: `Service Booking · ${req.type}`, art: "spare", amount: price - discount, date: todayLabel(),
      status: "Requested", serviceId: id, coupon: code ?? undefined, discount: discount || undefined,
    }, ...o]);
    notify({ kind: "service", title: `${req.type} booked`, body: `${req.date}, ${req.slot}. We'll assign a technician shortly.`, link: { k: "track", id } });
    setStack([{ k: "placed", ref, title: "Service Booked!", next: { k: "track", id } }]);

    // Demo: ops assigns a technician a few seconds later.
    setTimeout(() => {
      const tech = techById("t1")!;
      stampStep(id, STEP.assigned, { technician: { id: tech.id, name: tech.name, initials: tech.initials, rating: tech.rating, phone: tech.phone } });
      setOrders((all) => all.map((o) => (o.serviceId === id ? { ...o, status: "In Progress" } : o)));
      notify({ kind: "service", title: "Technician assigned", body: `${tech.name} (★ ${tech.rating}) will visit on ${req.date}, ${req.slot}.`, link: { k: "track", id } });
    }, 5000);
  };

  /** Demo helper: moves a running job one step along (assigned → on the way → in progress → completed). */
  const advanceService = (id: string) => {
    const s = services.find((x) => x.id === id);
    if (!s || !s.technician || s.current >= STEP.completed) return;
    if (s.current === STEP.inProgress) {
      // Finishing the job stamps "Completed" and moves straight on to feedback.
      stampStep(id, STEP.completed, { current: STEP.feedback });
      setOrders((all) => all.map((o) => (o.serviceId === id ? { ...o, status: "Completed" } : o)));
      notify({ kind: "service", title: `${s.type} completed`, body: "How did it go? Rate your technician to help others.", link: { k: "track", id } });
      return;
    }
    const next = s.current + 1;
    stampStep(id, next);
    if (next === STEP.onTheWay) notify({ kind: "service", title: "Technician on the way", body: `${s.technician.name} is heading to you. Track live in the app.`, link: { k: "track", id } });
  };

  const rateService = (id: string, rating: ServiceRating) => {
    const s = services.find((x) => x.id === id);
    stampStep(id, STEP.feedback, { rating });
    // The rating also shows up on the technician's public profile.
    if (s?.technician) {
      const body = [rating.comment, rating.tags.length ? rating.tags.join(" · ") : ""].filter(Boolean).join(" — ");
      setReviews((r) => [{ id: `rv${Date.now()}`, techId: s.technician!.id, author: user.name, stars: rating.stars, body, date: todayLabel(), mine: true }, ...r]);
    }
    flash("Thanks for your feedback!");
  };

  const saveProductReview = (productId: string, stars: number, body: string) => {
    setReviews((all) => {
      const rest = all.filter((r) => !(r.mine && r.productId === productId));
      return [{ id: `rv${Date.now()}`, productId, author: user.name, stars, body, date: todayLabel(), mine: true }, ...rest];
    });
    back();
    flash("Review posted — thank you!");
  };

  const addMoney = (n: number) => {
    creditWallet("Added money", n);
    notify({ kind: "wallet", title: `${inr(n)} added to wallet`, body: `Your wallet balance is now ${inr(walletBalance + n)}.`, link: { k: "wallet" } });
    flash(`${inr(n)} added to your wallet`);
  };

  /** Demo: a referred friend completes a purchase. */
  const simulateReferral = () => {
    const names = ["Sneha P.", "Arjun M.", "Kavya R.", "Rahul T.", "Isha B."];
    const name = names[referrals.length % names.length];
    setReferrals((r) => [{ name, status: "Purchased", at: todayLabel() }, ...r]);
    creditWallet(`Referral bonus · ${name}`, REFERRAL_REWARD);
    notify({ kind: "wallet", title: `You earned ${inr(REFERRAL_REWARD)}!`, body: `${name} bought an Aquaphil purifier with your code.`, link: { k: "wallet" } });
    flash(`${inr(REFERRAL_REWARD)} referral bonus credited`);
  };

  const openNotif = (n: AppNotification) => {
    setNotifs((all) => all.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
    if (n.link) push(n.link);
  };

  /* ── Chat ── */
  const openChat = (id: string) => {
    setThreads((all) => all.map((t) => (t.id === id ? { ...t, unread: 0 } : t)));
    push({ k: "thread", id });
  };

  const sendChat = (threadId: string, body: string) => {
    const add = (m: ChatThread["messages"][number], bump: boolean) =>
      setThreads((all) => all.map((t) => (t.id !== threadId ? t : { ...t, messages: [...t.messages, m], unread: bump ? t.unread + 1 : t.unread })));
    add({ id: Date.now(), from: "me", body, at: nowTime() }, false);
    setTyping(threadId);
    setTimeout(() => {
      setTyping(null);
      add({ id: Date.now() + 1, from: "agent", body: autoReply(threadId, body), at: nowTime() }, openThread.current !== threadId);
    }, 1400);
  };

  const openOrder = (o: Order) => push(o.serviceId ? { k: "track", id: o.serviceId } : { k: "order", id: o.id });

  const openProfileMenu = (key: ProfileKey) => {
    const direct: Partial<Record<ProfileKey, Detail>> = {
      edit: { k: "editProfile" }, orders: { k: "orders" }, wallet: { k: "wallet" }, offers: { k: "offers" },
      referral: { k: "referral" }, reviews: { k: "myReviews" }, addresses: { k: "addresses" }, notifications: { k: "notifications" },
      wishlist: { k: "wishlist" }, settings: { k: "settings" }, help: { k: "help" }, amc: { k: "amc" },
    };
    push(direct[key] ?? { k: "info", key });
  };

  const logout = () => {
    write(SESSION_KEY, null);
    setStack([]); setTab("home"); setCart([]);
    setStage("login");
  };

  const setTheme = (v: boolean) => { setDark(v); write(THEME_KEY, v ? "dark" : "light"); };
  const setLang = (l: Language) => { setLanguage(l); write(LANG_KEY, l); flash(`Language set to ${l}`); };

  const showNav = stage === "app" && !detail;
  const chatThread = detail?.k === "thread" ? threads.find((t) => t.id === detail.id) : undefined;
  useEffect(() => { openThread.current = chatThread?.id ?? null; }, [chatThread?.id]);

  return (
    // Pinned to the viewport so the page itself never scrolls — only the content area does.
    <div style={{ position: "fixed", inset: 0, background: "var(--app-bg)", display: "flex", justifyContent: "center" }}>
      <div style={{ width: "100%", maxWidth: SHELL_MAX_W, height: "100%", position: "relative", background: "var(--app-bg)", overflow: "hidden", boxShadow: "var(--shadow-float)", display: "flex", flexDirection: "column" }}>

        {stage === "splash" && <SplashScreen onDone={afterSplash} />}
        {stage === "onboarding" && <OnboardingScreen onDone={() => { write(ONBOARDED_KEY, "1"); setStage("login"); }} />}
        {stage === "login" && <LoginScreen onContinue={(m) => { setMobile(m); setStage("otp"); }} onGoogle={() => signIn()} />}
        {stage === "otp" && <OtpScreen mobile={mobile} onBack={() => setStage("login")} onVerified={() => signIn(mobile)} />}

        {chatThread ? (
          <div style={{ flex: 1, minHeight: 0 }}>
            <ChatScreen thread={chatThread} typing={typing === chatThread.id} onSend={(b) => sendChat(chatThread.id, b)} onBack={back} />
          </div>
        ) : (
          <div ref={scrollRef} className="no-scroll" style={{
            flex: 1, minHeight: 0, overflowY: "auto", overscrollBehavior: "contain",
            paddingBottom: showNav ? "calc(76px + env(safe-area-inset-bottom))" : undefined,
          }}>
            {/* ── Detail pages ── */}
            {detail?.k === "products" && (
              <ProductListPage key={`${detail.q ?? ""}|${detail.cat ?? ""}`} initialQuery={detail.q} initialCategory={detail.cat} onBack={back}
                onOpen={(id) => push({ k: "product", id })} onAdd={(id) => addToCart(id)} cartCount={cartCount} onOpenCart={() => push({ k: "cart" })}
                wish={wish} onToggleWish={toggleWish} />
            )}
            {detail?.k === "categories" && <CategoriesPage onBack={back} onOpen={(cat) => push({ k: "products", cat })} />}
            {detail?.k === "wishlist" && (
              <WishlistPage ids={wish} onBack={back} onOpen={(id) => push({ k: "product", id })} onRemove={toggleWish}
                onAdd={(id) => addToCart(id)} onShop={() => push({ k: "products" })} />
            )}
            {detail?.k === "product" && (
              <ProductDetailPage key={detail.id} id={detail.id} onBack={back}
                onAdd={(id, qty) => addToCart(id, qty)}
                onBuyNow={(id, qty) => { addToCart(id, qty); push({ k: "cart" }); }}
                wished={wish.includes(detail.id)}
                onToggleWish={() => toggleWish(detail.id)}
                reviews={reviews}
                onSeeReviews={() => push({ k: "reviews", productId: detail.id })}
                onWriteReview={() => push({ k: "writeReview", productId: detail.id })} />
            )}
            {detail?.k === "reviews" && (
              <AllReviewsPage productId={detail.productId} reviews={reviews} onBack={back} onWrite={() => push({ k: "writeReview", productId: detail.productId })} />
            )}
            {detail?.k === "writeReview" && (
              <WriteReviewPage key={detail.productId} productId={detail.productId} onBack={back}
                existing={reviews.find((r) => r.mine && r.productId === detail.productId)}
                onSubmit={(stars, body) => saveProductReview(detail.productId, stars, body)} />
            )}
            {detail?.k === "cart" && (
              <CartPage lines={cart} onBack={back} setQty={setQty} onCheckout={checkout} onShop={() => push({ k: "products" })}
                coupon={coupon} onCoupon={setCoupon} walletBalance={walletBalance} useWallet={useWallet} onUseWallet={setUseWallet}
                address={defaultAddress} onChangeAddress={() => push({ k: "addresses" })} userName={user.name} />
            )}
            {detail?.k === "placed" && (
              <OrderPlacedPage orderId={detail.ref} title={detail.title} onTrack={() => setStack([detail.next])} onHome={() => goTab("home")} />
            )}
            {detail?.k === "track" && (() => {
              const s = services.find((x) => x.id === detail.id);
              if (!s) return null;
              const techThread = s.technician && threads.some((t) => t.id === s.technician!.id) ? s.technician.id : "support";
              return (
                <>
                  <TrackServicePage key={s.id} service={s} onBack={back} onChat={() => openChat(techThread)}
                    onRate={(r) => rateService(s.id, r)} onOpenTech={(id) => push({ k: "tech", id })} />
                  {s.technician && s.current < STEP.completed && (
                    <div style={{ padding: "0 16px 24px", textAlign: "center" }}>
                      <button onClick={() => advanceService(s.id)} style={{ background: "none", border: "1px dashed var(--line-strong)", borderRadius: 10, padding: "6px 12px", fontSize: 11.5, color: "var(--ink-mute)", cursor: "pointer" }}>
                        Demo: move to next step
                      </button>
                    </div>
                  )}
                </>
              );
            })()}
            {detail?.k === "order" && (() => {
              const o = orders.find((x) => x.id === detail.id);
              return o ? (
                <OrderDetailPage order={o} onBack={back} onHelp={() => openChat("support")}
                  onReview={(pid) => push({ k: "writeReview", productId: pid })} onInvoice={() => push({ k: "invoice", id: o.id })} />
              ) : null;
            })()}
            {detail?.k === "invoice" && (() => {
              const o = orders.find((x) => x.id === detail.id);
              return o ? <InvoicePage order={o} service={services.find((s) => s.id === o.serviceId)} address={defaultAddress} userName={user.name} onBack={back} /> : null;
            })()}
            {detail?.k === "tech" && (() => {
              const t = techById(detail.id);
              return t ? <TechnicianPage tech={t} reviews={reviews} onBack={back} onChat={() => openChat(threads.some((x) => x.id === t.id) ? t.id : "support")} /> : null;
            })()}
            {detail?.k === "serviceInfo" && (
              <ServiceDetailPage type={detail.type} reviews={reviews} onBack={back} onBook={() => push({ k: "book", type: detail.type })} />
            )}
            {detail?.k === "myReviews" && (
              <MyReviewsPage reviews={reviews} services={services} onBack={back}
                onEditProduct={(pid) => push({ k: "writeReview", productId: pid })} onTrack={(id) => push({ k: "track", id })} />
            )}
            {detail?.k === "offers" && (
              <OffersPage onBack={back} onShop={() => push({ k: "products" })} onBook={() => goTab("service")} />
            )}
            {detail?.k === "wallet" && (
              <WalletPage balance={walletBalance} txns={wallet} onBack={back} onAddMoney={addMoney} onRefer={() => push({ k: "referral" })} />
            )}
            {detail?.k === "referral" && (
              <ReferralPage code={referralCode} referrals={referrals} onBack={back} onSimulate={simulateReferral} />
            )}
            {detail?.k === "notifications" && (
              <NotificationsPage items={notifs} prefs={notifPrefs} onBack={back} onOpen={openNotif} onPrefs={setNotifPrefs}
                onReadAll={() => setNotifs((all) => all.map((n) => ({ ...n, read: true })))} onClear={() => setNotifs([])} />
            )}
            {detail?.k === "editProfile" && (
              <EditProfilePage user={user} onBack={back} onSave={(u) => { setUser(u); back(); flash("Profile updated"); }} />
            )}
            {detail?.k === "addresses" && <AddressesPage addresses={addresses} onBack={back} onChange={setAddresses} />}
            {detail?.k === "orders" && <OrdersScreen orders={orders} onBack={back} onOpen={openOrder} />}
            {detail?.k === "book" && <BookServiceScreen key={detail.type} initialType={detail.type} onBack={back} onSubmit={bookService} />}
            {detail?.k === "settings" && (
              <SettingsPage dark={dark} onDark={setTheme} language={language} onLanguage={setLang} onBack={back}
                onNotifications={() => push({ k: "notifications" })} onAbout={() => push({ k: "info", key: "about" })} />
            )}
            {detail?.k === "help" && <HelpCenterPage onBack={back} onLiveChat={() => openChat("support")} />}
            {detail?.k === "amc" && <AmcPage onBack={back} onRenew={() => push({ k: "book", type: "AMC" })} />}
            {detail?.k === "info" && <ProfileInfo which={detail.key} onBack={back} services={services} onTrack={(id) => push({ k: "track", id })} />}

            {/* ── Tabs ── */}
            {!detail && tab === "home" && (
              <HomeScreen
                location={shortArea(defaultAddress)}
                onChangeLocation={() => push({ k: "addresses" })}
                onOpenCategory={(cat) => push({ k: "products", cat })}
                onOpenCategories={() => push({ k: "categories" })}
                cartCount={cartCount}
                onOpenCart={() => push({ k: "cart" })}
                onOpenProducts={(q) => push({ k: "products", q })}
                onOpenProduct={(id) => push({ k: "product", id })}
                onBookService={() => goTab("service")}
                onRenewAmc={() => push({ k: "amc" })}
                onSupport={() => openChat("support")}
                onAddToCart={(id) => addToCart(id)}
                unreadNotifs={unreadNotifs}
                onOpenNotifications={() => push({ k: "notifications" })}
                onOpenOffers={() => push({ k: "offers" })}
                onOpenService={(t) => push({ k: "serviceInfo", type: t })}
                onOpenServices={() => goTab("service")}
                onRefer={() => push({ k: "referral" })}
              />
            )}
            {!detail && tab === "orders" && <OrdersScreen orders={orders} onOpen={openOrder} />}
            {!detail && tab === "service" && (
              <ServicesHubScreen services={services} onOpen={(t) => push({ k: "serviceInfo", type: t })}
                onTrack={(id) => push({ k: "track", id })} onOpenTech={(id) => push({ k: "tech", id })} />
            )}
            {!detail && tab === "chat" && <ChatListScreen threads={threads} onOpen={openChat} />}
            {!detail && tab === "profile" && (
              <ProfileScreen
                user={user}
                stats={{ orders: orders.filter((o) => o.kind === "product").length, services: services.length, amcDays: amcDaysLeft() }}
                walletBalance={walletBalance}
                unreadNotifs={unreadNotifs}
                onMenu={openProfileMenu}
                onLogout={logout}
              />
            )}
          </div>
        )}

        {showNav && <BottomNav active={tab} onChange={goTab} unreadChat={unreadChat} />}

        {toast && (
          <div className="fade-up" role="status" style={{
            position: "absolute", left: 16, right: 16, bottom: showNav ? 90 : 96, zIndex: 250,
            background: "#0f1729", color: "white", borderRadius: 14, padding: "12px 16px",
            fontSize: 13.5, fontWeight: 500, boxShadow: "var(--shadow-xl)", textAlign: "center",
          }}>{toast}</div>
        )}
      </div>
    </div>
  );
}

/* Profile-menu pages that don't need a screen of their own yet. */
function ProfileInfo({ which, onBack, services, onTrack }: {
  which: ProfileKey; onBack: () => void; services: ServiceRequest[]; onTrack: (id: string) => void;
}) {
  const row: React.CSSProperties = { ...card, padding: 14, display: "flex", alignItems: "center", gap: 12 };
  const small: React.CSSProperties = { margin: "2px 0 0", fontSize: 12.5, color: "var(--ink-soft)", lineHeight: 1.5 };

  switch (which) {
    case "history":
      return (
        <InfoPage title="Service History" onBack={onBack}>
          {services.map((s) => (
            <button key={s.id} onClick={() => onTrack(s.id)} className="press" style={{ ...row, border: "none", cursor: "pointer", textAlign: "left" }}>
              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>Service #{s.id}</p>
                <p style={{ margin: "1px 0 0", fontSize: 12.5, fontWeight: 600, color: "var(--blue)" }}>{s.type} · {s.product}</p>
                <p style={small}>{s.date}</p>
              </div>
              <StatusBadge status={serviceStatus(s)} />
              <ChevronRight s={16} c="var(--ink-mute)" />
            </button>
          ))}
        </InfoPage>
      );
    case "payments":
      return (
        <InfoPage title="Payment Methods" onBack={onBack}>
          <div style={row}><CardIcon s={22} c="var(--blue)" /><div><p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "var(--ink)" }}>UPI</p><p style={small}>amit@okaxis</p></div></div>
          <p style={{ ...small, textAlign: "center", padding: "0 20px" }}>Card details are stored by the payment gateway, never on Aquaphil servers.</p>
        </InfoPage>
      );
    case "about":
    default:
      return (
        <InfoPage title="About Us" onBack={onBack}>
          <div style={{ ...card, padding: 16 }}>
            <p style={{ margin: 0, fontSize: 16, fontWeight: 700, color: "var(--ink)" }}>{COMPANY.name}</p>
            <p style={small}>We sell, install and service RO water purifiers, spare parts and AMC plans — so every home gets pure water without the hassle. Trusted by 50,000+ families across Karnataka.</p>
            <p style={{ ...small, marginTop: 10 }}>{COMPANY.address}<br />{COMPANY.phone} · {COMPANY.email}</p>
          </div>
        </InfoPage>
      );
  }
}
