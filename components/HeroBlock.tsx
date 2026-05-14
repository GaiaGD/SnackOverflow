'use client';

import { useState } from 'react';
import LeadCaptureForm from './LeadCaptureForm';

interface HeroBlockProps {
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaUrl: string;
}

export default function HeroBlock({ headline, subheadline, ctaText }: HeroBlockProps) {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <section className="relative bg-gradient-to-br from-orange-50 to-amber-100 py-24 px-6">
        <div className="mx-auto max-w-3xl text-center space-y-8">
          <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-6xl">
            {headline}
          </h1>
          <p className="text-lg text-zinc-600 sm:text-xl max-w-2xl mx-auto">
            {subheadline}
          </p>
          <button
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center rounded-2xl bg-orange-500 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-orange-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 transition-colors"
          >
            {ctaText || 'Get a Demo'}
          </button>
        </div>
      </section>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Get a Demo"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl p-8">
            <button
              onClick={() => setModalOpen(false)}
              aria-label="Close demo form"
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-700 text-2xl leading-none"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold text-zinc-900 mb-6">Get a Demo</h2>
            <LeadCaptureForm onSuccess={() => setModalOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}
