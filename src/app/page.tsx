import MortgagePricingForm from "@/components/MortgagePricingForm";

export default function Home() {
  return (
    <main className="flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl text-center">
        <p className="text-sm font-semibold tracking-wide text-slate-500 uppercase">
          ifund
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Mortgage pricing
        </h1>
        <p className="mt-3 text-base text-slate-600">
          Enter loan details to preview live broker pricing options.
        </p>
      </div>
      <MortgagePricingForm />
    </main>
  );
}
