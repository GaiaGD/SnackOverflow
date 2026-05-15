import { Climate_Crisis } from 'next/font/google';
import Link from 'next/link';

const climateCrisis = Climate_Crisis({ subsets: ['latin'] });

export default function NotFound() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-6 text-center gap-8">
      <h1 className={`${climateCrisis.className} text-8xl sm:text-9xl text-brand-yellow`}>
        404
      </h1>
      <p className="text-white/70 text-lg max-w-sm">
        Looks like this snack is out of stock.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center rounded-2xl bg-brand-yellow px-8 py-4 text-base font-semibold text-brand-navy shadow-lg hover:bg-brand-mustard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow transition-colors duration-200"
      >
        Back to home
      </Link>
    </main>
  );
}
