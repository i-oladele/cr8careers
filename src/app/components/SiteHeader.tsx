import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

type ActivePage = 'home' | 'services' | 'about' | 'contact' | 'insight' | 'courses' | '';

const navLinks: { label: string; to: string; key: ActivePage }[] = [
  { label: 'Home', to: '/', key: 'home' },
  { label: 'Services', to: '/services', key: 'services' },
  { label: 'About Us', to: '/about', key: 'about' },
  { label: 'Contact Us', to: '/contact', key: 'contact' },
  { label: 'Insight Centre', to: '/insight-centre', key: 'insight' },
];

export default function SiteHeader({ activePage = '' }: { activePage?: ActivePage }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between md:h-28 lg:h-32">
          <Link to="/" className="h-14 w-32 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] focus-visible:ring-offset-4 md:h-20 md:w-40" aria-label="CR8Careers home">
            <img alt="CR8Careers Logo" className="h-full w-full object-contain" src="/logo.png" />
          </Link>

          <nav className="hidden md:flex gap-4 lg:gap-8 items-center" aria-label="Main navigation">
            {navLinks.map(({ label, to, key }) => (
              <Link
                key={key}
                to={to}
                aria-current={activePage === key ? 'page' : undefined}
                className={`rounded-sm font-['DM_Sans',sans-serif] text-sm whitespace-nowrap transition-colors hover:text-[#ed2a10] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] focus-visible:ring-offset-4 ${
                  activePage === key ? 'font-bold text-[#ed2a10]' : 'text-[#1d1d1d]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link to="/courses" className="rounded-lg bg-[#f58c21] px-3 py-2 font-['DM_Sans',sans-serif] text-xs font-bold text-black transition-colors hover:bg-[#e67e1a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] focus-visible:ring-offset-4 sm:px-5 sm:text-sm">
              Take a Course
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(open => !open)}
              className="rounded-lg p-2 text-[#1d1d1d] hover:bg-gray-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] md:hidden"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
            </button>
          </div>
        </div>
      </div>
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-gray-100 bg-white px-4 py-4 shadow-lg md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map(({ label, to, key }) => (
              <Link
                key={key}
                to={to}
                onClick={() => setMobileMenuOpen(false)}
                aria-current={activePage === key ? 'page' : undefined}
                className={`rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] ${
                  activePage === key ? 'bg-[#016e71]/10 font-bold text-[#016e71]' : 'text-[#1d1d1d] hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
