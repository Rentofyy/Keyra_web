import Image from "next/image";
import Link from "next/link";

interface KeyraLogoProps {
  className?: string;
  variant?: "tight" | "full" | "raw";
  height?: number;
  width?: number;
  priority?: boolean;
  href?: string | null;
}

export function KeyraLogo({
  className = "",
  variant = "tight",
  height = 40,
  width,
  priority = false,
  href = "/",
}: KeyraLogoProps) {
  // Official brand logo (luxury gold & platinum emblem on midnight navy)
  let src = "/images/keyra-logo.png";
  let aspectRatio = 824 / 320;

  if (variant === "full") {
    src = "/images/keyra-logo-full.png";
    aspectRatio = 1024 / 512;
  } else if (variant === "raw") {
    src = "/images/keyra-logo-provided.jpg";
    aspectRatio = 1024 / 512;
  }

  const computedWidth = width || Math.round(height * aspectRatio);

  const imageElement = (
    <div className={`relative inline-flex items-center shrink-0 overflow-hidden rounded-xl shadow-xs ${className}`}>
      <Image
        src={src}
        alt="KEYRA - New Era of Finding Homes"
        width={computedWidth}
        height={height}
        priority={priority}
        className="h-full w-auto object-contain"
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center transition-opacity hover:opacity-95">
        {imageElement}
      </Link>
    );
  }

  return imageElement;
}
