import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!supabase) { setError('Supabase is not configured.'); return; }
    if (!email.trim()) { setError('Enter your email address.'); return; }

    setLoading(true);
    const trimmedEmail = email.trim();
    const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail, {
      redirectTo: `${window.location.origin}/reset-password?email=${encodeURIComponent(trimmedEmail)}`,
    });
    setLoading(false);

    if (error) { setError(error.message); return; }
    setMessage('Check your email for a secure password reset link.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img alt="CR8Careers Logo" className="h-14 mx-auto mb-4 object-contain" src="/logo.png" />
          </Link>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-gray-900 mb-1">
            Reset your password
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">
            We will send a secure reset link to your email
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-['DM_Sans',sans-serif] text-red-600 text-sm">{error}</p>
              </div>
            )}
            {message && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-['DM_Sans',sans-serif] text-green-700 text-sm">{message}</p>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#333333] text-white py-3 rounded-lg hover:bg-[#555555] transition-colors font-['DM_Sans',sans-serif] font-semibold text-sm disabled:opacity-60"
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
          </form>

          <p className="text-center mt-5 font-['DM_Sans',sans-serif] text-sm text-gray-400">
            <Link to="/login" className="text-gray-500 hover:text-gray-700 underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
