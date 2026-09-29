# Aquaphil Water Care

Customer app, technician partner app and admin console for **Aquaphil Water Care**: buy RO purifiers, filters and spares, book installation / repair / AMC visits, track technicians live, chat with support, and run operations from one dashboard.

Built with Next.js 16, React 19 and Inter. The frontend is adapted from the [zevto](https://github.com/Alok16012/zevto) RO-platform codebase, rebranded to the Aquaphil design system (blue palette, Inter, water-drop mark). Scope follows the *Aquaphil Water Care PRD*.

> **Demo build.** Every screen runs on sample data in `app/lib/*.ts`, held in memory — orders, bookings, chat and wallet reset on refresh. OTP, technician assignment, live tracking and chat replies are simulated. **Supabase** will replace this data layer later (see below).

## Run locally

```bash
npm install
npm run dev
```

| App | URL | Demo login |
| --- | --- | --- |
| Customer app | http://localhost:3000 | any 10-digit mobile starting 6–9, OTP `123456` (or "Continue with Google") |
| Technician app | http://localhost:3000/technician | any 10-digit mobile starting 6–9, OTP `1234` |
| Admin console | http://localhost:3000/admin | `admin@aquaphil.in` / `aquaphil@demo` |

The customer app is capped at 430 px — best viewed at phone width.

## Customer app screens

Mapped to the Aquaphil mockup:

1. Splash · 2–4. Onboarding (3 slides) · 5. Login (mobile / Google) · 6. OTP verification
7. Home — location, search, banner, quick actions, shop by category, offers, services, popular products, AMC reminder
8. Categories (Domestic RO, Commercial RO, Spare Parts, Filters, Accessories) · 9. Product listing (category chips, sort, wishlist hearts) · 10. Product details (key features, reviews)
11. Cart · 12. Checkout (address, coupon, wallet, UPI / card / COD)
13. Book service (service catalogue + details) · 14. Schedule service (calendar, time slots, note, photo upload)
15. Live tracking — map with technician ETA + 6-step tracker (Requested → Assigned → On the Way → In Progress → Completed → Feedback)
16. Chat — conversation list (Support, your technician, AMC & Billing desk) + threads with quick replies
17. My orders · 18. Service history · 19. My AMC (plan card, benefits, renew) · 20. Wishlist
21. Rate technician · 22. Notifications · 23. Profile · 24. Settings (dark mode, language, legal) · 25. Help center (FAQs, call / WhatsApp / email, live chat)
26. Offers & coupons · 27. Invoice (GST breakdown, Download PDF via print, share)

Also kept from zevto: wallet, refer & earn, saved addresses, edit profile, product & technician reviews, technician profiles.

Demo helpers: a **"Demo: move to next step"** button under the tracker walks a job through each stage; new bookings get a technician assigned after ~5 seconds.

## Technician app — `/technician`

Online/offline toggle, incoming job requests, job flow (travel → arrive → start code → checklist, TDS, parts → collect payment), van inventory, earnings and profile. Data: `app/lib/techData.ts`.

## Admin console — `/admin`

Dashboard, orders, service-job dispatch (assign / reassign technicians), customers (CRM), technicians, products & stock, offers & coupons, review moderation and notification broadcasts. Data: `app/lib/adminData.ts`.

## Where things live

- `app/CustomerApp.tsx` — customer app shell: entry flow, navigation stack and all demo state
- `app/components/`
  - `Intro.tsx` — splash, onboarding, login, OTP
  - `HomeScreen.tsx`, `ShopScreens.tsx` (listing, details, cart), `ShopExtras.tsx` (categories, wishlist, invoice)
  - `ServiceScreens.tsx` — schedule service, orders, order details, live tracking; `ServicesHub.tsx` — service catalogue
  - `ChatProfile.tsx` — chat list, chat thread, profile; `AccountExtras.tsx` — settings, help center, My AMC
  - `Account.tsx`, `Offers.tsx`, `Reviews.tsx` — wallet, referral, notifications, coupons, reviews
  - `Brand.tsx` (logo mark + wordmark), `PurifierArt.tsx` (product illustrations), `ui.tsx`, `icons.tsx`
- `app/lib/data.ts` — customer catalogue, orders, services, chat threads, AMC plan, coupons
- `app/lib/techData.ts`, `app/lib/adminData.ts` — partner-app and admin sample data
- `app/globals.css` — design tokens (light + dark theme)

## Moving to Supabase

All screens read through the types in `app/lib/data.ts` (`Product`, `Order`, `ServiceRequest`, `ChatThread`, …), which follow the PRD's data model. To wire Supabase in:

1. Create tables matching those types (plus `users`, `technicians`, `amc`, `payments` from the PRD).
2. Replace the `INITIAL_*` constants with queries, and the state setters in `CustomerApp.tsx` (`checkout`, `bookService`, `sendChat`, …) with inserts/updates.
3. Use Supabase Auth phone OTP in place of `DEMO_OTP`, and Realtime for chat and job-status updates.
4. Point the admin and technician apps at the same tables so all three share live data.
