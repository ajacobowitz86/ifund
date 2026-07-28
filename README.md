# ifund

Next.js app shell for live mortgage broker pricing (purchase, rate/term refinance, and cash-out refinance).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Google Places autocomplete (`@react-google-maps/api`)
- Optimal Blue pricing API route stub at `/api/optimal-blue/pricing`

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Places address autocomplete |
| `OPTIMAL_BLUE_*` | Reserved for live Optimal Blue integration |

Without a Google Maps key, the address field still works as a normal text input.

## Project structure

```
src/
  app/
    layout.tsx
    page.tsx
    api/optimal-blue/pricing/route.ts
  components/
    MortgagePricingForm.tsx
```

The pricing route currently returns stub options so the UI can be exercised end-to-end before Optimal Blue credentials are wired in.
