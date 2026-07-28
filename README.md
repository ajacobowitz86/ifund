# ifund

IFUND EQUITY client portal — live market rates and personalized US mortgage pricing.

## Preview like a real website

```bash
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_key
npm run preview
```

Open **http://localhost:3000**

You should see:
1. Navy **Live Market** ticker (conventional, FHA, VA, jumbo, ARM, non-QM, HELOC)
2. IFUND EQUITY logo + portal
3. **Begin Loan Evaluation** → Step 1 pricing form
4. US address autocomplete + personalized rate options
5. Professional footer / disclosures

## Routes

| URL | Experience |
| --- | --- |
| `/` | Full portal → Step 1 flow |
| `/step-1` | Direct Step 1 pricing page |
| `/complete` | Redirects to `/` |

## Environment

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Google Places US address autocomplete |

Without a Maps key, the address field still works as plain text.

## Project structure

```
complete                         # reference copy of the complete app
src/app/page.tsx                 # main website entry
src/components/IfundCompleteApp.tsx
src/components/LiveMarketBar.tsx
src/components/SiteFooter.tsx
src/components/MortgagePricingForm.tsx
src/components/UsAddressInput.tsx
public/ifund-logo.png
public/ifund-mark.png
```
