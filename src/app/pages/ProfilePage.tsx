import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';

function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await signOut();
    navigate('/');
  };

  const initial = user?.email?.[0].toUpperCase() ?? '';

  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="h-16 w-32">
            <img alt="CR8Careers Logo" className="h-full w-full object-contain" src="/logo.png" />
          </Link>
          <nav className="hidden md:flex gap-8 items-center">
            <Link to="/" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Home</Link>
            <Link to="/courses" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Courses</Link>
            <Link to="/contact" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Contact</Link>
          </nav>
          <div className="flex items-center gap-3">
            {user && (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(o => !o)}
                  className="w-10 h-10 rounded-full bg-[#333333] text-white flex items-center justify-center font-['DM_Sans',sans-serif] font-bold text-sm hover:bg-[#555555] transition-colors"
                  title={user.email ?? ''}
                >
                  {initial}
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                    <Link to="/profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      {user.user_metadata?.full_name && (
                        <p className="font-['DM_Sans',sans-serif] text-sm font-bold text-gray-900 truncate">{user.user_metadata.full_name}</p>
                      )}
                      <p className="font-['DM_Sans',sans-serif] text-xs text-gray-500 truncate">{user.email}</p>
                    </Link>
                    <Link to="/courses" onClick={() => setDropdownOpen(false)} className="block px-4 py-2.5 font-['DM_Sans',sans-serif] text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                      My Courses
                    </Link>
                    <button onClick={handleSignOut} className="w-full text-left px-4 py-2.5 font-['DM_Sans',sans-serif] text-sm text-red-600 hover:bg-red-50 transition-colors">
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-5">{title}</h2>
      {children}
    </div>
  );
}

function Toast({ message, type }: { message: string; type: 'success' | 'error' }) {
  return (
    <div className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-lg shadow-lg font-['DM_Sans',sans-serif] text-sm font-semibold text-white transition-all ${type === 'success' ? 'bg-[#0d9488]' : 'bg-[#ed2a10]'}`}>
      {message}
    </div>
  );
}

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!loading && !user) navigate('/login?redirect=/profile');
  }, [loading, user, navigate]);

  useEffect(() => {
    if (user) {
      setFullName(user.user_metadata?.full_name ?? '');
      setEmail(user.email ?? '');
    }
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) { showToast('Full name cannot be empty.', 'error'); return; }
    setSavingInfo(true);

    const updates: Record<string, any> = { data: { full_name: fullName.trim() } };
    if (email.trim() !== user?.email) updates.email = email.trim();

    const { error } = await supabase.auth.updateUser(updates);
    setSavingInfo(false);
    if (error) { showToast(error.message, 'error'); return; }
    if (updates.email) {
      showToast('Profile updated. Check your new email to confirm the change.', 'success');
    } else {
      showToast('Profile updated successfully.', 'success');
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) { showToast('Password must be at least 6 characters.', 'error'); return; }
    if (newPassword !== confirmPassword) { showToast('Passwords do not match.', 'error'); return; }
    setSavingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setSavingPassword(false);
    if (error) { showToast(error.message, 'error'); return; }
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    showToast('Password changed successfully.', 'success');
  };

  if (loading || !user) return null;

  const initials = fullName
    ? fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
    : (user.email?.[0].toUpperCase() ?? '');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6">

          {/* Avatar + name */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-full bg-[#333333] text-white flex items-center justify-center font-['DM_Sans',sans-serif] font-bold text-xl">
              {initials}
            </div>
            <div>
              <h1 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#1d1d1d]">
                {user.user_metadata?.full_name || 'Your Profile'}
              </h1>
              <p className="font-['DM_Sans',sans-serif] text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Personal info */}
            <Section title="Personal Information">
              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={e => setFullName(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  />
                </div>
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  />
                  {email !== user.email && (
                    <p className="mt-1 font-['DM_Sans',sans-serif] text-xs text-amber-600">You'll receive a confirmation link at your new email.</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={savingInfo}
                  className="bg-[#333333] text-white px-6 py-2.5 rounded-lg font-['DM_Sans',sans-serif] font-semibold text-sm hover:bg-[#555555] transition-colors disabled:opacity-60"
                >
                  {savingInfo ? 'Saving...' : 'Save Changes'}
                </button>
              </form>
            </Section>

            {/* Change password */}
            <Section title="Change Password">
              <form onSubmit={handleChangePassword} className="space-y-4">
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="At least 6 characters"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  />
                </div>
                <div>
                  <label className="block font-['DM_Sans',sans-serif] font-semibold text-gray-700 text-sm mb-1.5">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#333333]"
                  />
                </div>
                <button
                  type="submit"
                  disabled={savingPassword}
                  className="bg-[#333333] text-white px-6 py-2.5 rounded-lg font-['DM_Sans',sans-serif] font-semibold text-sm hover:bg-[#555555] transition-colors disabled:opacity-60"
                >
                  {savingPassword ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </Section>
          </div>
        </div>
      </div>

      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}
