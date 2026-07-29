import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('Checking your reset link...');
  const [error, setError] = useState('');
  const [ready, setReady] = useState(false);
  const [checkingLink, setCheckingLink] = useState(true);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured.');
      setCheckingLink(false);
      return;
    }
    const auth = supabase.auth;

    let cancelled = false;

    const enableResetForm = () => {
      if (cancelled) return;
      setReady(true);
      setError('');
      setMessage('Choose a new password for your account.');
      setCheckingLink(false);
    };

    const checkRecoverySession = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
          const { error: exchangeError } = await auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          enableResetForm();
          return;
        }

        const { data: { session }, error: sessionError } = await auth.getSession();
        if (sessionError) throw sessionError;
        if (session) {
          enableResetForm();
          return;
        }

        if (!cancelled) {
          setError('Open the password reset link from your email to continue.');
          setMessage('');
          setCheckingLink(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'This reset link is invalid or has expired.');
          setMessage('');
          setCheckingLink(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY' || event === 'SIGNED_IN') {
        enableResetForm();
      }
    });

    checkRecoverySession();

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!supabase) { setError('Supabase is not configured.'); return; }
    if (!ready) { setError('Open the password reset link from your email to continue.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    if (!updateError) await supabase.auth.signOut();
    setLoading(false);

    if (updateError) { setError(updateError.message); return; }

    setMessage('Your password has been changed. You can now log in.');
    setTimeout(() => navigate('/login', { replace: true }), 1200);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img alt="CR8Careers Logo" className="h-14 mx-auto mb-4 object-contain" src="/logo.png" />
          </Link>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-gray-900 mb-1">
            Create new password
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">
            Use the secure link sent to your email
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
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="font-['DM_Sans',sans-serif] text-blue-700 text-sm">{message}</p>
              </div>
            )}

            <div>
              <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">
                New Password
              </label>
              <input
                type="password"
                required
                disabled={!ready || checkingLink}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>

            <div>
              <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">
                Confirm Password
              </label>
              <input
                type="password"
                required
                disabled={!ready || checkingLink}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent disabled:bg-gray-100 disabled:text-gray-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !ready || checkingLink}
              className="w-full bg-[#333333] text-white py-3 rounded-lg hover:bg-[#555555] transition-colors font-['DM_Sans',sans-serif] font-semibold text-sm disabled:opacity-60"
            >
              {checkingLink ? 'Checking link...' : loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>

          <p className="text-center mt-5 font-['DM_Sans',sans-serif] text-sm text-gray-400">
            <Link to="/forgot-password" className="text-gray-500 hover:text-gray-700 underline">
              Request a new reset link
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
