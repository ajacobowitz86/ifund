import BrandLogo from "@/components/BrandLogo";

export default function BrandHeader() {
  return (
    <header className="brand-header">
      <div className="ifund-page brand-header__inner">
        <BrandLogo />
        <a
          href="mailto:consult@ifundequity.com?subject=IFUND%20Equity%20%E2%80%94%20Request%20Consultation"
          className="brand-header__cta"
        >
          Request Consultation
        </a>
      </div>
    </header>
  );
}
