import { Climate_Crisis } from 'next/font/google';
import Link from 'next/link';

const climateCrisis = Climate_Crisis({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center flex-1 px-6 gap-8">
      <h1 className={`${climateCrisis.className} text-white text-3xl sm:text-8xl lg:text-9xl text-center leading-none`}>
        SnackOverflow
      </h1>
      <Link
        href="/b2b"
        className="inline-flex items-center justify-center rounded-2xl bg-brand-yellow px-8 py-4 text-base font-semibold text-brand-navy shadow-lg hover:bg-brand-mustard focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow transition-colors duration-200"
      >
        For Business
      </Link>
    </main>
  );
}
