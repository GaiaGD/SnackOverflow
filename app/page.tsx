import { Climate_Crisis } from 'next/font/google';

const climateCrisis = Climate_Crisis({ subsets: ['latin'] });

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <h1 className={`${climateCrisis.className} text-brand-yellow text-6xl sm:text-8xl lg:text-9xl text-center leading-none`}>
        SnackOverflow
      </h1>
    </main>
  );
}
