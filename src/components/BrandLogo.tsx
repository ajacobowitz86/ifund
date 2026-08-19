import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  subtitle?: string;
  className?: string;
};

export default function BrandLogo({
  href = "/",
  subtitle = "The Home Mortgage Refi Equity Tool",
  className = "",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={`brand-logo ${className}`.trim()}
      aria-label="IFUND EQUITY - The Home Mortgage Refi Equity Tool"
    >
      <div className="brand-logo__mark-wrap" aria-hidden="true">
        <svg
          className="brand-logo__svg"
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Crisp, modern geometric house silhouette with upward arrow cutout */}
          <path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M32 5.5L5.5 28.2H12.5V59.5H51.5V28.2H58.5L48.5 19.6V8.5H41.5V13.6L32 5.5ZM32 21.5L45 36.5H37.5V59.5H26.5V36.5H19L32 21.5Z"
          />
        </svg>
      </div>
      <div className="brand-logo__text">
        <span className="brand-logo__name">IFUND EQUITY</span>
        <span className="brand-logo__subtitle">{subtitle}</span>
      </div>
    </Link>
  );
}
