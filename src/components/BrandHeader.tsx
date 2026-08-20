import BrandLogo from "@/components/BrandLogo";

type BrandHeaderProps = {
  onStartApplication?: () => void;
};

export default function BrandHeader({ onStartApplication }: BrandHeaderProps) {
  return (
    <header className="brand-header">
      <div className="ifund-page brand-header__inner">
        <BrandLogo />
        {onStartApplication ? (
          <button
            type="button"
            onClick={onStartApplication}
            className="brand-header__cta"
          >
            Start Application
          </button>
        ) : (
          <a
            href="#pricer"
            className="brand-header__cta"
          >
            Start Application
          </a>
        )}
      </div>
    </header>
  );
}
