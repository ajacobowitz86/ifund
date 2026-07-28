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
      ├── LiveMarketBar.tsx         ← navy live rates ticker
      ├── LoanPricingForm.tsx       ← loan form + results
      │    └── UsAddressInput.tsx   ← US Google Places address
      │    └── POST /api/optimal-blue/pricing
      └── SiteFooter.tsx            ← footer + disclosures

src/app/layout.tsx                  ← fonts, metadata, global shell
src/app/globals.css                 ← brand CSS + ticker styles
src/app/pricing/page.tsx            ← optional direct /pricing route
public/ifund-logo.png               ← logo lockup
public/ifund-mark.png               ← icon mark
```

## Routes

| URL | File | Purpose |
| --- | --- | --- |
| `/` | `src/app/page.tsx` | Main portal experience |
| `/pricing` | `src/app/pricing/page.tsx` | Direct loan pricing page |
| `/api/optimal-blue/pricing` | `src/app/api/optimal-blue/pricing/route.ts` | Pricing API (stub) |

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | US address autocomplete |
