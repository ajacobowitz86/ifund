import MortgagePricingForm from "@/components/MortgagePricingForm";

export default function Home() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-semibold tracking-[0.14em] text-slate-500 uppercase">
          Step 1
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Price your loan
        </h1>
        <p className="mt-3 max-w-2xl text-base text-slate-600">
          Choose a loan purpose, enter amounts and credit score, then pick a US
          property address to preview broker pricing options.
        </p>
      </div>
      <MortgagePricingForm />
    </main>
  );
}
