import { Link } from 'react-router-dom';

type ActivePage = 'home' | 'services' | 'about' | 'contact' | 'insight' | 'courses' | '';

const navLinks: { label: string; to: string; key: ActivePage }[] = [
  { label: 'Home', to: '/', key: 'home' },
  { label: 'Services', to: '/services', key: 'services' },
  { label: 'About Us', to: '/about', key: 'about' },
  { label: 'Contact Us', to: '/contact', key: 'contact' },
  { label: 'Insight Centre', to: '/insight-centre', key: 'insight' },
];

export default function SiteHeader({ activePage = '' }: { activePage?: ActivePage }) {
  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-36">
          <Link to="/" className="h-24 w-48">
            <img alt="CR8Careers Logo" className="h-full w-full object-contain" src="/logo.png" />
          </Link>

          <nav className="hidden md:flex gap-8 items-center">
            {navLinks.map(({ label, to, key }) => (
              <Link
                key={key}
                to={to}
                className={`font-['DM_Sans',sans-serif] text-sm transition-colors hover:text-[#ed2a10] ${
                  activePage === key ? 'font-bold text-[#ed2a10]' : 'text-[#1d1d1d]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          <Link to="/courses" className="bg-[#f58c21] hover:bg-[#e67e1a] transition-colors px-6 py-2.5 rounded-lg">
            <p className="font-['DM_Sans',sans-serif] font-bold text-black text-sm tracking-tight">Take a Course</p>
          </Link>
        </div>
      </div>
    </header>
  );
}
