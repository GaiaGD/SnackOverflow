import { climateCrisis } from '@/lib/fonts';

export default function Footer() {
  return (
    <footer className="bg-brand-navy py-12 px-6 border-t border-white/20">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-6 text-center">
        <div>
          <p className={`text-xl font-extrabold text-white tracking-tight ${climateCrisis.className}`}>SnackOverflow</p>
          <p className="text-sm text-white/50 mt-1">Snack solutions for every office</p>
        </div>

        <nav className="flex flex-wrap gap-8 justify-center" aria-label="Footer navigation">
          <a href="#" className="text-sm text-white hover:opacity-75 transition-opacity">Privacy Policy</a>
          <a href="#" className="text-sm text-white hover:opacity-75 transition-opacity">Terms of Service</a>
          <a href="#" className="text-sm text-white hover:opacity-75 transition-opacity">Contact</a>
          <a href="#" className="text-sm text-white hover:opacity-75 transition-opacity">Careers</a>
        </nav>

        <p className="text-xs text-white/60">
          © {new Date().getFullYear()} SnackOverflow. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
