import Image from "next/image";
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
      <Image
        src="/ifund-house-mark.png"
        alt=""
        width={662}
        height={614}
        priority
        unoptimized
        className="brand-logo__mark"
      />
      <span className="brand-logo__text">
        <span className="brand-logo__name">IFUND EQUITY</span>
        <span className="brand-logo__subtitle">{subtitle}</span>
      </span>
    </Link>
  );
}
