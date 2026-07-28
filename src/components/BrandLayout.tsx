import Image from "next/image";
import Link from "next/link";
import LiveMarketBar from "@/components/LiveMarketBar";
import SiteFooter from "@/components/SiteFooter";

export default function BrandLayout() {
  return (
    <div className="ifund-shell">
      <LiveMarketBar />
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/ifund-logo.png"
            alt="IFUND EQUITY"
            width={280}
            height={280}
            priority
            unoptimized
            className="mb-2 h-auto w-[200px] sm:w-[240px]"
          />
          <p className="mt-1 font-sans text-sm tracking-[0.2em] text-brand-slate uppercase">
            Institutional Growth & Real Estate
          </p>
        </div>

        <div className="ifund-portal-card">
          <h2 className="mb-3 font-serif text-xl font-semibold text-brand-navy">
            Secure Client Portal
          </h2>
          <p className="mb-6 font-sans text-sm text-brand-slate">
            Access automated evaluation pipelines and portfolio management tools.
          </p>
          <Link href="/step-1" className="ifund-cta inline-block">
            Begin Loan Evaluation
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}
