import Image from "next/image";
import Link from "next/link";

export default function BrandLayout() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top,_#dde5ef_0%,_var(--brand-canvas)_48%,_#e8eef5_100%)] p-6 text-brand-navy">
      {/* Brand Header / Logo Section */}
      <div className="brand-soft-in mb-10 flex flex-col items-center">
        <Image
          src="/ifund-logo.png"
          alt="IFUND EQUITY"
          width={280}
          height={280}
          priority
          className="h-auto w-[200px] sm:w-[240px]"
        />
        <p className="-mt-2 font-sans text-sm tracking-widest text-brand-slate uppercase">
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
