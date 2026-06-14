import { Link } from 'react-router-dom';

export function Sidebar({ activeSection, setActiveSection }: { 
  activeSection: string; 
  setActiveSection: (section: string) => void;
}) {
  const menuItems = [
    { id: 'courses', label: 'Courses', icon: '/Books.svg' },
    { id: 'jobs', label: 'Job Openings', icon: '/ReadCvLogo.svg' },
    { id: 'learners', label: 'Learners', icon: '👥' },
    { id: 'contact', label: 'Contact', icon: '@' },
  ];

  return (
    <div className="w-64 bg-white shadow-lg fixed left-0 top-36 bottom-0">
      <div className="p-6">
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-gray-900 mb-4">
          Admin Dashboard
        </h3>
      </div>
      
      <nav className="px-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
              activeSection === item.id
                ? 'bg-[#ed2a10] text-white'
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            {item.icon.startsWith('/') ? (
              <img 
                src={item.icon} 
                alt={item.label}
                className={`w-5 h-5 ${activeSection === item.id ? 'filter brightness-0 invert' : ''}`}
              />
            ) : (
              <span className="text-xl">{item.icon}</span>
            )}
            <span className="font-['DM_Sans',sans-serif] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="absolute bottom-6 left-6 right-6">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-3 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span className="font-['DM_Sans',sans-serif] font-medium">Back to Site</span>
        </Link>
      </div>
    </div>
  );
}
