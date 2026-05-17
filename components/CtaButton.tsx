'use client';

import { ReactNode } from 'react';

const baseCls =
  'inline-flex items-center justify-center bg-brand-yellow font-semibold text-brand-navy focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow transition-colors duration-200';

interface LinkProps {
  href: string;
  children: ReactNode;
  className?: string;
}

interface ButtonProps {
  href?: never;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  'aria-busy'?: boolean;
  type?: 'submit' | 'button' | 'reset';
}

type CtaButtonProps = LinkProps | ButtonProps;

export default function CtaButton(props: CtaButtonProps) {
  const { children, className = '' } = props;

  if (!children) return null;

  if ('href' in props && props.href !== undefined) {
    const raw = props.href;
    const isExternal = /^https?:\/\//i.test(raw);
    const isRelative = raw.startsWith('#') || raw.startsWith('/');
    const href = !isExternal && !isRelative ? `https://${raw}` : raw;

    return (
      <a
        href={href}
        target={isExternal ? '_blank' : undefined}
        rel={isExternal ? 'noopener noreferrer' : undefined}
        className={`${baseCls} rounded-2xl px-8 py-4 text-base shadow-lg hover:bg-brand-mustard ${className}`}
        onClick={() => gtag('event', 'cta_click', { cta_text: String(children), cta_url: href })}
      >
        {children}
      </a>
    );
  }

  const { disabled, 'aria-busy': ariaBusy, type = 'submit' } = props as ButtonProps;

  return (
    <button
      type={type}
      disabled={disabled}
      aria-busy={ariaBusy}
      className={`${baseCls} w-full rounded-xl px-6 py-3 text-sm shadow gap-2 enabled:hover:bg-brand-mustard disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}
