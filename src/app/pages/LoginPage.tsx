import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') ?? '/courses';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    navigate(redirect);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (!fullName.trim()) { setError('Please enter your full name.'); return; }
    setLoading(true);
    const { error } = await signUp(email, password, fullName.trim());
    setLoading(false);
    if (error) { setError(error); return; }
    navigate(redirect);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img alt="CR8Careers Logo" className="h-14 mx-auto mb-4 object-contain" src="/logo.png" />
          </Link>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-gray-900 mb-1">
            {tab === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">
            {tab === 'login' ? 'Log in to continue your learning' : 'Start your learning journey today'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => { setTab('login'); setError(''); }}
              className={`flex-1 py-4 font-['DM_Sans',sans-serif] font-semibold text-sm transition-colors ${
                tab === 'login'
                  ? 'text-[#333333] border-b-2 border-[#333333]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); }}
              className={`flex-1 py-4 font-['DM_Sans',sans-serif] font-semibold text-sm transition-colors ${
                tab === 'signup'
                  ? 'text-[#333333] border-b-2 border-[#333333]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="p-8">
            <form onSubmit={tab === 'login' ? handleLogin : handleSignUp} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-['DM_Sans',sans-serif] text-red-600 text-sm">{error}</p>
                  </div>
                )}

                {tab === 'signup' && (
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Your full name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                    />
                  </div>
                )}

                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">
                    Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                  />
                </div>

                {tab === 'signup' && (
                  <div>
                    <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat your password"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#333333] text-white py-3 rounded-lg hover:bg-[#555555] transition-colors font-['DM_Sans',sans-serif] font-semibold text-sm disabled:opacity-60"
                >
                  {loading ? 'Please wait...' : tab === 'login' ? 'Log In' : 'Create Account'}
                </button>
              </form>
          </div>
        </div>

        <p className="text-center mt-6 font-['DM_Sans',sans-serif] text-sm text-gray-400">
          <Link to="/courses" className="text-gray-500 hover:text-gray-700 underline">
            Browse courses without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}
