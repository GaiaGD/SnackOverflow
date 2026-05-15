'use client';

import LeadCaptureForm from './LeadCaptureForm';

interface LeadCaptureSectionProps {
  title?: string;
}

export default function LeadCaptureSection({ title }: LeadCaptureSectionProps) {
  return (
    <section id="lead-form" className="py-24 px-6 bg-brand-purple">
      <div className="mx-auto max-w-2xl space-y-8">
        {title && (
          <h2 className="text-3xl font-bold text-brand-yellow text-center">{title}</h2>
        )}
        <LeadCaptureForm />
      </div>
    </section>
  );
}
