# IFUND EQUITY

Web client portal for live mortgage market rates and personalized US loan pricing.

## Preview

```bash
npm install
cp .env.example .env.local
# add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
npm run preview
```

Open **http://localhost:3000**

## What is the main file?

**Main entry:** `src/app/page.tsx`

That page loads **`ClientPortal`**, which pulls in the other pieces:

```
src/app/page.tsx                    ← MAIN ENTRY (start here)
 └── components/ClientPortal.tsx    ← home portal + pricing screen
      ├── LiveMarketBar.tsx         ← header PPE board (24h cache)
      ├── LoanPricingForm.tsx       ← built-in monthly payment calculator
      │    └── UsAddressInput.tsx   ← US Google Places address
      │    └── GET /api/ppe/rates   ← shared 24h PPE rate board
      └── SiteFooter.tsx            ← footer + disclosures

src/lib/ppe-rates.ts                ← rate types + monthly payment math
src/lib/ppe-rates-cache.ts          ← server 24h PPE cache
src/app/layout.tsx                  ← fonts, metadata, global shell
src/app/globals.css                 ← brand CSS + ticker styles
src/app/pricing/page.tsx            ← optional direct /pricing route
public/ifund-logo.png               ← logo lockup
public/ifund-mark.png               ← icon mark
```

## PPE rates + calculator

- Header **Live PPE** ticker loads `GET /api/ppe/rates` (refreshed at most every **24 hours**).
- The loan calculator uses the same cached board and computes **monthly P&I** locally — it does **not** POST to PPE on every quote.
- When Optimal Blue credentials are added, wire the vendor board pull inside `src/lib/ppe-rates-cache.ts`.

## Routes

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Main portal experience |
| `/pricing` | `src/app/pricing/page.tsx` | Direct loan pricing page |
| `/api/ppe/rates` | `src/app/api/ppe/rates/route.ts` | 24h-cached PPE product rates |

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | US address autocomplete |
| `OPTIMAL_BLUE_CLIENT_ID` | Optional — PPE board integration |
| `OPTIMAL_BLUE_CLIENT_SECRET` | Optional — PPE board integration |
| `OPTIMAL_BLUE_BASE_URL` | Optional — PPE board integration |
