import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Simple authentication (in production, this would be a proper API call)
    if (email === 'admin@cr8careers.com' && password === 'admin123') {
      localStorage.setItem('isAdmin', 'true');
      navigate('/admin');
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f58c21] to-[#ed2a10] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img alt="CR8Careers Logo" className="h-16 w-32 mx-auto mb-4 object-contain" src="/logo.png" />
          </Link>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-white mb-2">
            Admin Login
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-white opacity-90">
            Access the LMS administration panel
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <form onSubmit={handleSubmit}>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-['DM_Sans',sans-serif] text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="mb-6">
              <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] focus:outline-none focus:ring-2 focus:ring-[#ed2a10] focus:border-transparent"
                placeholder="admin@cr8careers.com"
              />
            </div>

            <div className="mb-6">
              <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] focus:outline-none focus:ring-2 focus:ring-[#ed2a10] focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-[#ed2a10] text-white py-3 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-semibold"
            >
              Sign In
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600 mb-2">
              <strong>Demo Credentials:</strong>
            </p>
            <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">
              Email: admin@cr8careers.com
            </p>
            <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">
              Password: admin123
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link 
              to="/"
              className="font-['DM_Sans',sans-serif] text-[#ed2a10] hover:text-[#d42610] text-sm"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
