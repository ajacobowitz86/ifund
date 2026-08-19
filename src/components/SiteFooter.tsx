export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="ifund-page site-footer__grid">
        <div>
          <p className="site-footer__name">IFUND EQUITY</p>
          <p>
            Instant mortgage pricing for conventional, FHA, rate-and-term
            refinance, cash-out refinance, and HELOC.
          </p>
        </div>
        <div>
          <p className="site-footer__heading">Loan programs</p>
          <p>Conventional and FHA purchase</p>
          <p>Rate &amp; term and cash-out refinance</p>
          <p>Home equity line of credit (HELOC)</p>
        </div>
        <div>
          <p className="site-footer__heading">Client desk</p>
          <p>consult@ifundequity.com</p>
          <p>(800) 555-0198</p>
        </div>
      </div>
      <div className="site-footer__legal">
        <div className="ifund-page">
          <p>
            Market rates shown are estimates and for illustration only. They are
            not a commitment to lend. Final pricing depends on credit, property,
            occupancy, documentation, and investor guidelines. Equal Housing
            Lender.
          </p>
        </div>
      </div>
    </footer>
  );
}
