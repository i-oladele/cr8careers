import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

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
    if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setLoading(true);
    const { error, emailConfirmation } = await signUp(email, password);
    setLoading(false);
    if (error) { setError(error); return; }
    if (emailConfirmation) { setEmailSent(true); return; }
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
              onClick={() => { setTab('login'); setError(''); setEmailSent(false); }}
              className={`flex-1 py-4 font-['DM_Sans',sans-serif] font-semibold text-sm transition-colors ${
                tab === 'login'
                  ? 'text-[#333333] border-b-2 border-[#333333]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => { setTab('signup'); setError(''); setEmailSent(false); }}
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
            {emailSent ? (
              <div className="text-center py-4">
                <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-gray-900 mb-2">Check your email</h2>
                <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">
                  We sent a confirmation link to <strong>{email}</strong>. Click it to activate your account, then log in.
                </p>
                <button
                  onClick={() => { setEmailSent(false); setTab('login'); }}
                  className="mt-6 font-['DM_Sans',sans-serif] text-sm text-[#333333] underline"
                >
                  Back to Log In
                </button>
              </div>
            ) : (
              <form onSubmit={tab === 'login' ? handleLogin : handleSignUp} className="space-y-5">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="font-['DM_Sans',sans-serif] text-red-600 text-sm">{error}</p>
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
                    placeholder="At least 6 characters"
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
            )}
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
