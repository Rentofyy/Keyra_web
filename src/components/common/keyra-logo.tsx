import Image from "next/image";
import Link from "next/link";

interface KeyraLogoProps {
  className?: string;
  variant?: "tight" | "full" | "raw";
  mode?: "light" | "dark";
  height?: number;
  width?: number;
  priority?: boolean;
  href?: string | null;
}

export function KeyraLogo({
  className = "",
  variant = "tight",
  mode = "light",
  height = 40,
  width,
  priority = false,
  href = "/",
}: KeyraLogoProps) {
  // Official seamless brand logo (pure transparent background, zero cutout)
  let src = mode === "dark" ? "/images/keyra-logo-dark.png" : "/images/keyra-logo.png";
  let aspectRatio = 791 / 306;

  if (variant === "full") {
    src = mode === "dark" ? "/images/keyra-logo-dark.png" : "/images/keyra-logo-full.png";
    aspectRatio = 791 / 306;
  } else if (variant === "raw") {
    src = "/images/keyra-logo-provided.jpg";
    aspectRatio = 1024 / 512;
  }

  const computedWidth = width || Math.round(height * aspectRatio);

  const imageElement = (
    <div className={`relative inline-flex items-center shrink-0 ${className}`}>
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
