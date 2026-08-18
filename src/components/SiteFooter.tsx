export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-brand-navy/10 bg-brand-white">
      <div className="ifund-page grid gap-8 py-8 sm:grid-cols-2 lg:grid-cols-3">
        <div>
          <p className="font-serif text-lg font-bold tracking-wide text-brand-navy">
            IFUND EQUITY
          </p>
          <p className="mt-1 max-w-md font-sans text-sm leading-relaxed text-brand-slate">
            Institutional growth and real estate capital solutions. Personalized
            loan pricing for purchase, refinance, and cash-out strategies.
          </p>
        </div>
        <div className="font-sans text-sm text-brand-slate">
          <p className="font-semibold text-brand-navy">Loan programs</p>
          <p className="mt-1">Conventional 30-Year and 15-Year</p>
          <p>FHA 30-Year</p>
          <p>30-Year and 15-Year Refinance</p>
          <p>30-Year and 15-Year Cash-Out Refinance</p>
        </div>
        <div className="font-sans text-sm text-brand-slate">
          <p className="font-semibold text-brand-navy">Client desk</p>
          <p className="mt-1">consult@ifundequity.com</p>
          <p>(800) 555-0198</p>
        </div>
      </div>
      <div className="border-t border-brand-navy/8 bg-brand-canvas/80">
        <p className="ifund-page py-3 font-sans text-[0.7rem] leading-relaxed text-brand-slate">
          Market rates shown are indicative and for illustration only. They are
          not a commitment to lend. Final pricing depends on credit, property,
          occupancy, documentation, and investor guidelines. Equal Housing
          Lender.
        </p>
      </div>
    </footer>
  );
}
