import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState(searchParams.get('email') ?? '');
  const [message, setMessage] = useState('Open the verification link from your email to finish creating your account.');
  const [error, setError] = useState('');
  const [checkingLink, setCheckingLink] = useState(true);
  const [resending, setResending] = useState(false);
  const redirect = searchParams.get('redirect') ?? '/courses';

  useEffect(() => {
    if (!supabase) {
      setError('Supabase is not configured.');
      setCheckingLink(false);
      return;
    }

    let cancelled = false;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    const finishVerification = () => {
      if (cancelled) return;
      setError('');
      setMessage('Email verified. Taking you to your account...');
      setCheckingLink(false);
      redirectTimer = setTimeout(() => navigate(redirect, { replace: true }), 1000);
    };

    const checkVerificationLink = async () => {
      try {
        const code = new URLSearchParams(window.location.search).get('code');
        if (code) {
          const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
          if (exchangeError) throw exchangeError;
          finishVerification();
          return;
        }

        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) throw sessionError;
        if (session?.user.email_confirmed_at) {
          finishVerification();
          return;
        }

        if (!cancelled) setCheckingLink(false);
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'This verification link is invalid or has expired.');
          setMessage('');
          setCheckingLink(false);
        }
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user.email_confirmed_at) {
        finishVerification();
      }
    });

    checkVerificationLink();

    return () => {
      cancelled = true;
      if (redirectTimer) clearTimeout(redirectTimer);
      subscription.unsubscribe();
    };
  }, [navigate, redirect]);

  const handleResend = async () => {
    setError('');

    if (!supabase) { setError('Supabase is not configured.'); return; }
    if (!email.trim()) { setError('Enter your email first.'); return; }

    setResending(true);
    const verifyUrl = new URL('/verify-email', window.location.origin);
    verifyUrl.searchParams.set('email', email.trim());
    verifyUrl.searchParams.set('redirect', redirect);

    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim(),
      options: {
        emailRedirectTo: verifyUrl.toString(),
      },
    });
    setResending(false);

    if (error) { setError(error.message); return; }
    setMessage('A new verification link has been sent.');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img alt="CR8Careers Logo" className="h-14 mx-auto mb-4 object-contain" src="/logo.png" />
          </Link>
          <h1 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-gray-900 mb-1">
            Verify your email
          </h1>
          <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">
            Use the secure link sent to your email address
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <div className="space-y-5">
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
                disabled={checkingLink}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-transparent"
              />
            </div>

            {checkingLink && (
              <div className="w-full bg-[#333333] text-white py-3 rounded-lg font-['DM_Sans',sans-serif] font-semibold text-sm text-center opacity-60">
                Checking link...
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleResend}
            disabled={resending || checkingLink}
            className="w-full mt-4 text-[#0d9488] hover:text-[#0a7a70] font-['DM_Sans',sans-serif] font-semibold text-sm disabled:opacity-60"
          >
            {resending ? 'Sending...' : 'Resend verification link'}
          </button>
        </div>
      </div>
    </div>
  );
}
