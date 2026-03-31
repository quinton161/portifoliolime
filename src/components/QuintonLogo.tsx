import React, { useState } from 'react';

/** File in `public/images` — keep filename in sync with your asset */
export const QUINTON_LOGO_FILE = 'Quinton logo.png';

export function quintonLogoUrl(): string {
  const base = process.env.PUBLIC_URL || '';
  return `${base}/images/${encodeURIComponent(QUINTON_LOGO_FILE)}`;
}

interface QuintonLogoProps {
  className?: string;
  /** Where the logo sits — fixes layout: big image inside a fixed box */
  variant?: 'header' | 'footer';
  /** Override image classes (usually leave default for variant) */
  imgClassName?: string;
  /** When the image fails to load (wrong path or missing file), show this text */
  fallbackClassName?: string;
}

const containerByVariant: Record<NonNullable<QuintonLogoProps['variant']>, string> = {
  header:
    'inline-flex h-[5.25rem] w-[min(92vw,22rem)] sm:h-24 sm:w-[24rem] md:h-28 md:w-[26rem] max-w-full shrink-0 items-center justify-start overflow-hidden rounded-xl',
  footer:
    'inline-flex h-28 w-full max-w-[min(100%,26rem)] sm:h-32 md:h-36 items-center justify-start overflow-hidden rounded-xl',
};

/**
 * Site wordmark from `public/images/Quinton logo.png`.
 * Uses a fixed container so a large logo does not push header/footer layout around.
 */
const QuintonLogo: React.FC<QuintonLogoProps> = ({
  className = '',
  variant = 'header',
  imgClassName,
  fallbackClassName,
}) => {
  const [failed, setFailed] = useState(false);

  const imgClasses =
    imgClassName ??
    'h-full w-full max-h-full max-w-full object-contain object-left [image-rendering:auto]';

  const fallback =
    fallbackClassName ??
    (variant === 'footer'
      ? 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-white'
      : 'text-3xl sm:text-4xl md:text-5xl font-bold tracking-tighter text-[#1D1D1F]');

  if (failed) {
    return (
      <span
        className={`inline-flex min-h-[3rem] items-center font-sans ${containerByVariant[variant]} ${fallback} ${className}`}
        aria-hidden={false}
      >
        Quinton
      </span>
    );
  }

  return (
    <span className={`${containerByVariant[variant]} ${className}`}>
      <img
        src={quintonLogoUrl()}
        alt="Quinton"
        className={imgClasses}
        width={520}
        height={120}
        loading="eager"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </span>
  );
};

export default QuintonLogo;
