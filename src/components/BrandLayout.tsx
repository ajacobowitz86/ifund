import Link from "next/link";

export default function BrandLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_#dde5ef_0%,_var(--brand-canvas)_48%,_#e8eef5_100%)] p-6 text-brand-navy">
      {/* Brand Header / Logo Section */}
      <div className="brand-soft-in mb-10 flex flex-col items-center">
        {/* House & Upward Arrow Icon */}
        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-xl bg-brand-navy shadow-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-10 w-10 text-brand-white"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
        </div>
        <h1 className="font-serif text-3xl font-bold tracking-wide text-brand-navy sm:text-4xl">
          IFUND EQUITY
        </h1>
        <p className="mt-1 font-sans text-sm tracking-widest text-brand-slate uppercase">
          Institutional Growth & Real Estate
        </p>
      </div>

      {/* Action Container */}
      <div className="brand-fade-up w-full max-w-md rounded-2xl border border-gray-100 bg-brand-white p-8 text-center shadow-md">
        <h2 className="mb-3 font-serif text-xl font-semibold text-brand-navy">
          Secure Client Portal
        </h2>
        <p className="mb-6 font-sans text-sm text-brand-slate">
          Access automated evaluation pipelines and portfolio management tools.
        </p>
        <Link
          href="/step-1"
          className="block w-full rounded-xl bg-brand-champagne py-3 font-sans font-medium text-white shadow transition hover:opacity-95"
        >
          Request Consultation
        </Link>
      </div>

      <p className="brand-fade-up-delay mt-8 font-sans text-xs tracking-wide text-brand-slate">
        Continue to Step 1 · Loan pricing preview
      </p>
    </div>
  );
}
