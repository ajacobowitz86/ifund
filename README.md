# ifund

Next.js app shell for live mortgage broker pricing (purchase, rate/term refinance, and cash-out refinance).

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Google Places autocomplete (`@react-google-maps/api`)
- Optimal Blue pricing API route stub at `/api/optimal-blue/pricing`

## Getting started

## Preview

- Brand landing: [http://localhost:3000](http://localhost:3000)
- Step 1 loan pricing: [http://localhost:3000/step-1](http://localhost:3000/step-1)
- Complete app (portal + Step 1 in one flow): [http://localhost:3000/complete](http://localhost:3000/complete)

```bash
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY in .env.local
npm run dev
```

Open the brand portal, then use **Request Consultation** to continue into Step 1.

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Places US address autocomplete |
| `OPTIMAL_BLUE_*` | Reserved for live Optimal Blue integration |

### Google Maps (US addresses)

1. Create a Google Cloud project and enable **Places API**.
2. Create an API key and set it in `.env.local` as `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
3. Restart `npm run dev`.

The address field uses Places Autocomplete restricted to the United States (`componentRestrictions: { country: 'us' }`) and street addresses only (`types: ['address']`).

Without a Google Maps key, the address field still works as a normal text input.

## Project structure

```
complete                              # full app from entire chat (portal + Step 1)
step 1                                # synced copy of MortgagePricingForm
src/
  app/
    layout.tsx
    page.tsx                          # Brand portal (/)
    step-1/page.tsx                   # Step 1 route
    complete/page.tsx                 # Complete combined flow
    api/optimal-blue/pricing/route.ts
  components/
    BrandLayout.tsx
    MortgagePricingForm.tsx           # canonical Step 1 form
    UsAddressInput.tsx                # US Places autocomplete
    IfundCompleteApp.tsx              # complete single-flow app
public/
  ifund-logo.png
  ifund-mark.png
```

The pricing route currently returns stub options so the UI can be exercised end-to-end before Optimal Blue credentials are wired in.
