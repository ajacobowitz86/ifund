import Link from "next/link";

type BrandLogoProps = {
  href?: string;
  subtitle?: string;
};

export default function BrandLogo({
  href = "/",
  subtitle = "Mortgage Pricing",
}: BrandLogoProps) {
  return (
    <Link href={href} className="brand-logo" aria-label="IFUND EQUITY home">
      <span className="brand-logo__mark" aria-hidden="true">
        <svg viewBox="0 0 64 64" fill="none">
          <path
            fill="currentColor"
            fill-rule="evenodd"
            d="M8.2 29.4 32 7.8l16.8 15.2V16.2h8.4v12.6L59 31.2V56.8H8.2V29.4Zm23.8-7.6-9.8 16.4h6.2V56.8h7.2V38.2h6.2L32 21.8Z"
          />
        </svg>
      </span>
      <span className="brand-logo__text">
        <span className="brand-logo__name">IFUND EQUITY</span>
        <span className="brand-logo__subtitle">{subtitle}</span>
      </span>
    </Link>
  );
}
