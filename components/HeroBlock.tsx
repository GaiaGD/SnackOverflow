import Image from 'next/image';
import { climateCrisis } from '@/lib/fonts';
import CtaButton from './CtaButton';

interface HeroBlockProps {
  headline: string;
  subheadline?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundImageUrl?: string;
}

export default function HeroBlock({ headline, subheadline, ctaText, ctaUrl, backgroundImageUrl }: HeroBlockProps) {
  return (
    <section className="relative overflow-hidden bg-brand-navy min-h-[560px] flex items-center px-6 py-16">
      {backgroundImageUrl && (
        <>
          <Image
            src={backgroundImageUrl}
            alt=""
            fill
            className="object-cover"
            priority
          />
          {/* Overlay ensures text is readable over any image */}
          <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
        </>
      )}

      <div className="relative z-10 mx-auto w-full max-w-3xl text-center space-y-8">
        <h1 className={`${climateCrisis.className} text-3xl tracking-tight text-white sm:text-6xl`}>
          {headline}
        </h1>
        {subheadline && (
          <p className="text-lg text-white/80 sm:text-xl max-w-2xl mx-auto">
            {subheadline}
          </p>
        )}
        <CtaButton href={ctaUrl}>
          {ctaText}
        </CtaButton>
      </div>
    </section>
  );
}
