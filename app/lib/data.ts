/* Sample catalogue, orders and service jobs. Stand-ins until the Node.js API
 * from the PRD is live — every screen reads through these shapes. */

export type Category = "domestic" | "commercial" | "spare" | "filter" | "accessory";
export type ArtKind = "classic" | "pro" | "premium" | "commercial" | "spare" | "cartridge" | "copper" | "tap" | "meter";

export interface Product {
  id: string;
  name: string;
  spec: string;
  price: number;
  mrp: number;
  category: Category;
  art: ArtKind;
  rating: number;
  reviews: number;
  stages: string;
  warranty: string;
  description: string;
  /** Short spec chips on the details page, e.g. "12L Storage". */
  features?: string[];
}

export const PRODUCTS: Product[] = [
  {
    id: "classic", name: "AquaPure Smart RO", spec: "7 Stage Purification | 12L Storage",
    price: 14999, mrp: 18999, category: "domestic", art: "classic",
    rating: 4.5, reviews: 1236, stages: "7 Stage", warranty: "1 Year",
    features: ["RO + UV + UF + TDS Control", "12L Storage Capacity", "Smart LED Indicator"],
    description: "Best for home use. Removes 99.9% bacteria, viruses and harmful impurities. Elegant design with smart indicators for filter life and tank level.",
  },
  {
    id: "pro", name: "AquaNova Pro RO", spec: "8 Stage Purification | Copper",
    price: 22999, mrp: 28999, category: "domestic", art: "pro",
    rating: 4.6, reviews: 856, stages: "8 Stage", warranty: "2 Years",
    features: ["RO + UV + Copper + Minerals", "10L Storage Capacity", "Auto flush & tank-full shut-off"],
    description: "RO + UV + UF with an active-copper and mineral cartridge that puts back calcium and magnesium. 10 L storage tank for families of 4–6.",
  },
  {
    id: "premium", name: "AquaElite Smart RO", spec: "9 Stage | Smart Display | WiFi",
    price: 26999, mrp: 32999, category: "domestic", art: "premium",
    rating: 4.7, reviews: 412, stages: "9 Stage", warranty: "3 Years",
    features: ["Live TDS display", "WiFi filter-change alerts", "12L steel tank"],
    description: "Touch display shows live TDS, filter health and daily usage. WiFi alerts on your phone when a filter change is due.",
  },
  {
    id: "commercial-50", name: "Aquaphil Commercial 50 LPH", spec: "For offices & shops",
    price: 42999, mrp: 49999, category: "commercial", art: "commercial",
    rating: 4.4, reviews: 131, stages: "6 Stage", warranty: "1 Year",
    features: ["50 litres / hour", "Stainless-steel frame", "Auto-flush"],
    description: "Stainless-steel frame, 50 litres per hour output. Built for offices, clinics and small restaurants.",
  },
  {
    id: "commercial-100", name: "Aquaphil Commercial 100 LPH", spec: "Schools & factories",
    price: 68999, mrp: 79999, category: "commercial", art: "commercial",
    rating: 4.5, reviews: 58, stages: "6 Stage", warranty: "1 Year",
    features: ["100 litres / hour", "Dual pressure pumps", "Continuous duty"],
    description: "Heavy-duty 100 LPH plant with auto-flush and dual pressure pumps for continuous use.",
  },
  {
    id: "spares", name: "Spare Parts Kit", spec: "Sediment + Carbon + Membrane",
    price: 499, mrp: 699, category: "spare", art: "spare",
    rating: 4.3, reviews: 210, stages: "3 filters", warranty: "6 Months",
    description: "Genuine replacement filters for AquaPure Smart RO and AquaNova Pro. Change every 6–9 months for best taste.",
  },
  {
    id: "copper", name: "Active Copper Filter", spec: "Spare part · copper infusion",
    price: 1299, mrp: 1599, category: "filter", art: "copper",
    rating: 4.4, reviews: 188, stages: "1 cartridge", warranty: "6 Months",
    description: "Adds trace copper for its natural antibacterial benefit. Fits AquaPure and AquaNova purifiers.",
  },
  {
    id: "sediment", name: "Sediment Filter", spec: "10\" PP spun · 5 micron",
    price: 799, mrp: 999, category: "filter", art: "cartridge",
    rating: 4.3, reviews: 164, stages: "1 cartridge", warranty: "6 Months",
    description: "First-stage filter that traps sand, rust and silt so the membrane lasts longer.",
  },
  {
    id: "cartridges", name: "Filter Cartridges", spec: "Pack of 3 · universal fit",
    price: 1299, mrp: 1599, category: "filter", art: "cartridge",
    rating: 4.2, reviews: 97, stages: "3 cartridges", warranty: "6 Months",
    description: "Universal-fit inline cartridges for most domestic RO purifiers.",
  },
  {
    id: "tap", name: "Designer Purifier Tap", spec: "Food-grade ABS · chrome finish",
    price: 349, mrp: 449, category: "accessory", art: "tap",
    rating: 4.1, reviews: 74, stages: "Accessory", warranty: "3 Months",
    description: "Drop-in replacement faucet for all Aquaphil domestic purifiers.",
  },
  {
    id: "tds", name: "Digital TDS Meter", spec: "Check your water at home",
    price: 599, mrp: 799, category: "accessory", art: "meter",
    rating: 4.5, reviews: 233, stages: "Accessory", warranty: "6 Months",
    description: "Pocket TDS and temperature meter — see exactly how well your purifier is working.",
  },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id);

/** Shop-by-category tiles. */
export const CATEGORIES: { id: Category; label: string; blurb: string; art: ArtKind }[] = [
  { id: "domestic", label: "Domestic RO", blurb: "For home", art: "classic" },
  { id: "commercial", label: "Commercial RO", blurb: "For business", art: "commercial" },
  { id: "spare", label: "Spare Parts", blurb: "Genuine parts", art: "spare" },
  { id: "filter", label: "Filters", blurb: "Clean & safe", art: "cartridge" },
  { id: "accessory", label: "Accessories", blurb: "Add-ons", art: "tap" },
];

export const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

export type OrderStatus = "Delivered" | "Shipped" | "Placed" | "Completed" | "In Progress" | "Requested";

export interface Order {
  id: string;
  kind: "product" | "service";
  title: string;
  art: ArtKind;
  amount: number;
  date: string;
  status: OrderStatus;
  /** Service orders link to their tracker. */
  serviceId?: string;
  /** Products in the order — used for "Rate & review" once delivered. */
  productIds?: string[];
  /** Units per product id when more than one was bought. */
  quantities?: Record<string, number>;
  coupon?: string;
  discount?: number;
  walletUsed?: number;
  payment?: "UPI" | "Card" | "COD" | "Wallet";
}

export interface TimelineStep {
  label: string;
  at: string | null;
}

export type ServiceType = "Installation" | "Repair" | "AMC" | "Filter Change" | "Water Test" | "Uninstall";

export interface ServiceRating {
  stars: number;
  tags: string[];
  comment: string;
}

export interface ServiceRequest {
  id: string;
  type: ServiceType;
  product: string;
  date: string;
  slot: string;
  description: string;
  /** Index into the timeline of the step currently running (see STEP). */
  current: number;
  timeline: TimelineStep[];
  technician: { id: string; name: string; initials: string; rating: number; phone: string } | null;
  rating?: ServiceRating;
  /** Name of the photo the customer attached when booking. */
  photo?: string;
}

export const SERVICE_STEPS = ["Service Requested", "Technician Assigned", "On the Way", "In Progress", "Completed", "Feedback"];

/** Named indexes into SERVICE_STEPS / ServiceRequest.timeline. */
export const STEP = { requested: 0, assigned: 1, onTheWay: 2, inProgress: 3, completed: 4, feedback: 5 } as const;

/** Status label for lists — collapses the six tracker steps into four. */
export const serviceStatus = (s: ServiceRequest): OrderStatus =>
  s.current >= STEP.completed ? "Completed" : s.current === STEP.requested ? "Requested" : "In Progress";

const RS = { id: "t1", name: "Rohit Sharma", initials: "RS", rating: 4.8, phone: "+919800000000" };

export const INITIAL_SERVICES: ServiceRequest[] = [
  {
    id: "SRV1041",
    type: "Repair",
    product: "AquaPure Smart RO",
    date: "30 Sep 2026",
    slot: "10:00 AM – 12:00 PM",
    description: "Water flow is very slow and the tank is not filling.",
    current: STEP.onTheWay,
    timeline: [
      { label: "Service Requested", at: "30 Sep 2026, 09:15 AM" },
      { label: "Technician Assigned", at: "30 Sep 2026, 09:32 AM" },
      { label: "On the Way", at: "30 Sep 2026, 10:05 AM" },
      { label: "In Progress", at: null },
      { label: "Completed", at: null },
      { label: "Feedback", at: null },
    ],
    technician: RS,
  },
  {
    id: "SRV1032",
    type: "AMC",
    product: "AquaPure Smart RO",
    date: "10 Aug 2026",
    slot: "12:00 – 02:00 PM",
    description: "Quarterly AMC visit.",
    current: STEP.feedback,
    timeline: SERVICE_STEPS.map((label, i) => ({ label, at: `10 Aug 2026, ${["11:02 AM", "11:20 AM", "12:05 PM", "12:30 PM", "01:10 PM", "01:40 PM"][i]}` })),
    technician: { id: "t3", name: "Suresh Yadav", initials: "SY", rating: 4.9, phone: "+919800000002" },
    rating: { stars: 5, tags: ["On time", "Clean work"], comment: "Quick and neat." },
  },
  {
    id: "SRV1027",
    type: "Installation",
    product: "AquaPure Smart RO",
    date: "22 Jul 2026",
    slot: "04:00 – 06:00 PM",
    description: "",
    current: STEP.feedback,
    timeline: SERVICE_STEPS.map((label, i) => ({ label, at: `22 Jul 2026, ${["09:40 AM", "10:15 AM", "04:02 PM", "04:20 PM", "05:05 PM", "06:30 PM"][i]}` })),
    technician: RS,
    rating: { stars: 5, tags: ["Polite", "Explained the issue"], comment: "Explained every filter stage." },
  },
];

export const INITIAL_ORDERS: Order[] = [
  { id: "AQP4602", kind: "product", title: "Active Copper Filter", art: "copper", amount: 1299, date: "27 Sep 2026", status: "Shipped", productIds: ["copper"], payment: "UPI" },
  { id: "AQP4587", kind: "product", title: "AquaPure Smart RO", art: "classic", amount: 14999, date: "18 Jul 2026", status: "Delivered", productIds: ["classic"], payment: "Card" },
  { id: "AQP4521", kind: "service", title: "Service Booking · Repair", art: "spare", amount: 499, date: "30 Sep 2026", status: "In Progress", serviceId: "SRV1041" },
  { id: "AQP4460", kind: "product", title: "Filter Cartridges", art: "cartridge", amount: 1299, date: "05 Sep 2026", status: "Delivered", productIds: ["cartridges"], payment: "UPI" },
];

export interface ChatMessage {
  id: number;
  from: "me" | "agent";
  body: string;
  at: string;
}

export const INITIAL_CHAT: ChatMessage[] = [
  { id: 1, from: "agent", body: "Hello! How can we help you today?", at: "10:24 AM" },
  { id: 2, from: "me", body: "I need help with my purifier, it's not working properly.", at: "10:26 AM" },
  { id: 3, from: "agent", body: "Please share your order number or registered mobile number.", at: "10:27 AM" },
  { id: 4, from: "me", body: "My order number is AQP4587", at: "10:28 AM" },
  { id: 5, from: "agent", body: "Thanks! Our technician will contact you shortly.", at: "10:28 AM" },
];

/** One conversation in the Chat tab. Support is live (canned replies in the demo). */
export interface ChatThread {
  id: string;
  name: string;
  role: string;
  initials: string;
  /** "brand" shows the Aquaphil drop instead of initials. */
  avatar?: "brand";
  online: boolean;
  unread: number;
  messages: ChatMessage[];
  quick: string[];
}

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: "support", name: "Aquaphil Support", role: "Support team · replies in ~2 min", initials: "AS", avatar: "brand", online: true, unread: 0,
    messages: INITIAL_CHAT, quick: ["Share order number", "Filter change", "Water leakage", "AMC renewal"],
  },
  {
    id: "t1", name: "Rohit Sharma", role: "Technician · Repair #SRV1041", initials: "RS", online: true, unread: 1,
    messages: [
      { id: 1, from: "agent", body: "Hi Amit ji, I've picked up the membrane for your repair.", at: "10:04 AM" },
      { id: 2, from: "agent", body: "I'll be there in 15 minutes.", at: "10:06 AM" },
    ],
    quick: ["Okay, see you soon", "Please call before coming", "Where are you now?"],
  },
  {
    id: "billing", name: "AMC & Billing Desk", role: "Renewals, invoices & refunds", initials: "AB", online: false, unread: 0,
    messages: [
      { id: 1, from: "agent", body: "Your AMC for AquaPure Smart RO is expiring in 15 days. Renew now to keep free visits.", at: "Yesterday" },
    ],
    quick: ["Renew my AMC", "Send my invoice", "Refund status"],
  },
];

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  gender: "" | "Male" | "Female" | "Other";
  dob: string;
}

export const USER: UserProfile = { name: "Amit Sharma", email: "amit@example.com", phone: "+91 98XXX XX210", gender: "Male", dob: "" };

/* ───────────── AMC ───────────── */

export const AMC_PLAN = {
  name: "Premium AMC Plan",
  product: "AquaPure Smart RO",
  start: "15 Oct 2025",
  validTill: "15 Oct 2026",
  validTillISO: "2026-10-15",
  isFreeYear: true,
  visitsTotal: 3,
  visitsUsed: 2,
  renewPrice: 1999,
  benefits: ["Free Service Visits (3/year)", "Priority Support", "Genuine Spare Parts", "20% Discount on Parts"],
};

/** Calendar days until the AMC runs out (0 on or after the expiry date). */
export const amcDaysLeft = (now = new Date()) => {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.max(0, Math.round((new Date(`${AMC_PLAN.validTillISO}T00:00:00`).getTime() - today.getTime()) / 86400000));
};

/** Company details printed on invoices. */
export const COMPANY = {
  name: "Aquaphil Water Care",
  address: "No. 14, 1st Cross, HSR Layout Sector 2, Bengaluru, Karnataka 560102",
  gstin: "29ABCDE1234F1Z5",
  phone: "1800-120-4455",
  email: "care@aquaphil.in",
};

export const initialsOf = (name: string) =>
  name.trim().split(/\s+/).slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "").join("") || "?";

export const TIME_SLOTS = ["08:00 – 10:00 AM", "10:00 AM – 12:00 PM", "12:00 – 02:00 PM", "02:00 – 04:00 PM", "04:00 – 06:00 PM"];

export const nowTime = () =>
  new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }).toUpperCase();

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "26 Sep 2026" — spelled out by hand because en-GB now prints "Sept". */
export const fmtDate = (d: Date) => `${String(d.getDate()).padStart(2, "0")} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;

export const todayLabel = () => fmtDate(new Date());

/* ───────────── Addresses ───────────── */

export interface Address {
  id: string;
  label: "Home" | "Office" | "Other";
  line: string;
  pincode: string;
  isDefault: boolean;
}

export const INITIAL_ADDRESSES: Address[] = [
  { id: "a1", label: "Home", line: "12th Main, Koramangala, Bengaluru, Karnataka", pincode: "560034", isDefault: true },
  { id: "a2", label: "Office", line: "3rd Floor, Prestige Tech Park, Bellandur, Bengaluru", pincode: "560103", isDefault: false },
];

/* ───────────── Offers / coupons ───────────── */

export interface Coupon {
  code: string;
  title: string;
  desc: string;
  kind: "flat" | "percent";
  value: number;
  /** Cap for percent coupons. */
  maxOff?: number;
  minOrder: number;
  appliesTo: "product" | "service" | "all";
  expires: string;
}

export const COUPONS: Coupon[] = [
  { code: "PURE10", title: "10% off purifiers", desc: "Up to ₹2,000 off on any RO purifier order.", kind: "percent", value: 10, maxOff: 2000, minOrder: 9999, appliesTo: "product", expires: "31 Oct 2026" },
  { code: "FILTER150", title: "₹150 off spares", desc: "Flat ₹150 off on filters & cartridges above ₹999.", kind: "flat", value: 150, minOrder: 999, appliesTo: "product", expires: "15 Oct 2026" },
  { code: "FIRSTFIX", title: "₹200 off first repair", desc: "Flat ₹200 off your repair visit charge.", kind: "flat", value: 200, minOrder: 399, appliesTo: "service", expires: "30 Nov 2026" },
  { code: "AMC300", title: "₹300 off AMC", desc: "Save ₹300 when you buy or renew a 1-year AMC.", kind: "flat", value: 300, minOrder: 1999, appliesTo: "service", expires: "31 Dec 2026" },
  { code: "AQUAPHIL5", title: "5% off everything", desc: "Works on products and paid services. Max ₹500.", kind: "percent", value: 5, maxOff: 500, minOrder: 499, appliesTo: "all", expires: "31 Dec 2026" },
];

export const couponByCode = (code: string) => COUPONS.find((c) => c.code === code.trim().toUpperCase());

/** Why a coupon can't be used right now, or null if it can. */
export function couponError(c: Coupon, amount: number, on: "product" | "service"): string | null {
  if (c.appliesTo !== "all" && c.appliesTo !== on) return `Valid on ${c.appliesTo === "product" ? "product orders" : "service bookings"} only`;
  if (amount < c.minOrder) return `Add ${inr(c.minOrder - amount)} more to use this`;
  return null;
}

export function couponDiscount(c: Coupon, amount: number) {
  const off = c.kind === "flat" ? c.value : Math.round((amount * c.value) / 100);
  return Math.min(amount, c.maxOff ? Math.min(off, c.maxOff) : off);
}

/* ───────────── Wallet ───────────── */

export interface WalletTxn {
  id: string;
  title: string;
  /** Positive = credit, negative = debit. */
  amount: number;
  at: string;
}

export const INITIAL_WALLET: WalletTxn[] = [
  { id: "w3", title: "Cashback · Order #AQP4460", amount: 65, at: "05 Sep 2026" },
  { id: "w2", title: "Referral bonus · Priya S.", amount: 250, at: "28 Aug 2026" },
  { id: "w1", title: "Welcome bonus", amount: 100, at: "12 Aug 2026" },
];

/* ───────────── Referral ───────────── */

export const REFERRAL_REWARD = 250;

export interface Referral {
  name: string;
  status: "Joined" | "Purchased";
  at: string;
}

export const INITIAL_REFERRALS: Referral[] = [
  { name: "Priya S.", status: "Purchased", at: "28 Aug 2026" },
  { name: "Mohit R.", status: "Joined", at: "19 Sep 2026" },
];

/* ───────────── Notifications ───────────── */

export type NotifKind = "order" | "service" | "offer" | "wallet";

export interface AppNotification {
  id: string;
  kind: NotifKind;
  title: string;
  body: string;
  at: string;
  read: boolean;
  /** Where tapping it goes. */
  link?: { k: "order"; id: string } | { k: "track"; id: string } | { k: "offers" } | { k: "wallet" };
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  { id: "n4", kind: "service", title: "Technician on the way", body: "Rohit Sharma is heading to you for your AquaPure Smart RO repair.", at: "30 Sep 2026, 10:05 AM", read: false, link: { k: "track", id: "SRV1041" } },
  { id: "n3", kind: "offer", title: "10% off purifiers 💧", body: "Use PURE10 and save up to ₹2,000 this festive season.", at: "25 Sep 2026, 09:00 AM", read: false, link: { k: "offers" } },
  { id: "n2", kind: "service", title: "AMC renewal due", body: "Your AMC for AquaPure Smart RO expires on 15 Oct. Renew to keep free visits.", at: "24 Sep 2026, 10:00 AM", read: true },
  { id: "n1", kind: "wallet", title: "₹65 cashback credited", body: "Cashback for order #AQP4460 is in your Aquaphil wallet.", at: "05 Sep 2026, 06:12 PM", read: true, link: { k: "wallet" } },
];

export interface NotifPrefs {
  push: boolean;
  sms: boolean;
  whatsapp: boolean;
  offers: boolean;
}

/* ───────────── Reviews & technicians ───────────── */

export interface Review {
  id: string;
  /** Either a product id or a technician id. */
  productId?: string;
  techId?: string;
  author: string;
  stars: number;
  body: string;
  date: string;
  mine?: boolean;
}

export const INITIAL_REVIEWS: Review[] = [
  { id: "r1", productId: "classic", author: "Neha G.", stars: 5, body: "Taste improved instantly. Installation was done the same day the purifier arrived.", date: "20 Sep 2026" },
  { id: "r2", productId: "classic", author: "Rajesh P.", stars: 4, body: "Good value. Tank indicator is handy, a bit noisy while filling.", date: "11 Sep 2026" },
  { id: "r3", productId: "classic", author: "Sana K.", stars: 5, body: "Our TDS went from 480 to 60. Very happy.", date: "02 Sep 2026" },
  { id: "r4", productId: "pro", author: "Vikram S.", stars: 5, body: "UV + mineral cartridge is worth the extra. Water tastes sweet.", date: "18 Sep 2026" },
  { id: "r5", productId: "pro", author: "Anita M.", stars: 4, body: "Solid build. Delivery took 3 days.", date: "06 Sep 2026" },
  { id: "r6", productId: "premium", author: "Karan J.", stars: 5, body: "The app alerts for filter change are really useful.", date: "15 Sep 2026" },
  { id: "r7", productId: "spares", author: "Deepak T.", stars: 4, body: "Genuine parts, fit perfectly in my Classic.", date: "10 Sep 2026" },
  { id: "r8", productId: "cartridges", author: "Ritu A.", stars: 4, body: "Fit my old Kent purifier without issues.", date: "01 Sep 2026" },
  { id: "r9", productId: "commercial-50", author: "Cafe Brew, Indiranagar", stars: 4, body: "Keeps up with our rush hours easily.", date: "22 Aug 2026" },
  { id: "t1r1", techId: "t1", author: "Meena V.", stars: 5, body: "Polite, on time and explained what was wrong with the membrane.", date: "22 Sep 2026" },
  { id: "t1r2", techId: "t1", author: "Arjun D.", stars: 5, body: "Fixed the leak in 20 minutes. Cleaned up afterwards too.", date: "14 Sep 2026" },
  { id: "t1r3", techId: "t1", author: "Farah Q.", stars: 4, body: "Good work, came 15 minutes late but called ahead.", date: "03 Sep 2026" },
];

export interface Technician {
  id: string;
  name: string;
  initials: string;
  rating: number;
  jobs: number;
  years: number;
  skills: string[];
  languages: string;
  phone: string;
}

export const TECHNICIANS: Technician[] = [
  { id: "t1", name: "Rohit Sharma", initials: "RS", rating: 4.8, jobs: 1240, years: 6, skills: ["RO repair", "Installation", "Membrane change", "UV systems"], languages: "Hindi, English", phone: "+919800000000" },
  { id: "t2", name: "Imran Ali", initials: "IA", rating: 4.7, jobs: 860, years: 4, skills: ["Commercial plants", "Installation", "Water testing"], languages: "Hindi, Urdu", phone: "+919800000001" },
  { id: "t3", name: "Suresh Yadav", initials: "SY", rating: 4.9, jobs: 1580, years: 8, skills: ["AMC visits", "Filter change", "Leak repair"], languages: "Hindi, Bhojpuri", phone: "+919800000002" },
];

export const techById = (id: string) => TECHNICIANS.find((t) => t.id === id);

export const RATING_TAGS = ["On time", "Polite", "Explained the issue", "Clean work", "Fair pricing", "Fixed first time"];

/* ───────────── Service catalogue ───────────── */

export interface ServiceOffering {
  type: ServiceType;
  tagline: string;
  price: number;
  /** Shown next to the price, e.g. "visit charge". */
  priceNote: string;
  duration: string;
  includes: string[];
  rating: number;
  bookings: string;
}

export const SERVICE_CATALOG: ServiceOffering[] = [
  { type: "Installation", tagline: "Free with every Aquaphil purifier", price: 0, priceNote: "for Aquaphil purifiers", duration: "45–60 min",
    includes: ["Wall mounting & plumbing", "Inlet valve + drain setup", "TDS check before and after", "Demo of filter indicators"], rating: 4.8, bookings: "12k+" },
  { type: "Repair", tagline: "Leaks, low flow, noise, bad taste", price: 499, priceNote: "visit charge · parts extra", duration: "30–90 min",
    includes: ["Full diagnosis of the purifier", "Leak & pressure checks", "Genuine spare parts at MRP", "30-day repair warranty"], rating: 4.7, bookings: "8k+" },
  { type: "AMC", tagline: "1 year of worry-free water", price: 1999, priceNote: "per year", duration: "1 year cover",
    includes: ["3 preventive service visits", "2 filter sets included", "Priority repairs within 24h", "No visit charges all year"], rating: 4.9, bookings: "5k+" },
  { type: "Filter Change", tagline: "Sediment, carbon & membrane", price: 899, priceNote: "incl. filter kit", duration: "30 min",
    includes: ["Genuine sediment + carbon filters", "Membrane health check", "Tank sanitisation", "TDS reading after service"], rating: 4.6, bookings: "6k+" },
  { type: "Water Test", tagline: "Know what's in your water", price: 199, priceNote: "at-home test", duration: "20 min",
    includes: ["TDS, pH and hardness test", "Chlorine check", "Purifier recommendation", "Digital report on SMS"], rating: 4.5, bookings: "3k+" },
  { type: "Uninstall", tagline: "Moving house? We'll handle it", price: 349, priceNote: "uninstall + reinstall ₹599", duration: "30 min",
    includes: ["Safe dismounting", "Pipe & valve capping", "Packing guidance", "Reinstall at new address on request"], rating: 4.6, bookings: "2k+" },
];

export const offeringOf = (t: ServiceType) => SERVICE_CATALOG.find((s) => s.type === t)!;
