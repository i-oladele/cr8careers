import { useState, useEffect } from 'react';
import { fetchContactSubmissions, updateContactSubmissionStatus, ContactSubmissionRow } from '../../../lib/contactService';

export function ContactSubmissionsSection() {
  const [submissions, setSubmissions] = useState<ContactSubmissionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | ContactSubmissionRow['status']>('all');
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadSubmissions = async () => {
    setLoading(true);
    const { data, error } = await fetchContactSubmissions();
    setSubmissions(data);
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleStatusChange = async (id: string, status: ContactSubmissionRow['status']) => {
    setUpdatingId(id);
    const { error } = await updateContactSubmissionStatus(id, status);
    setUpdatingId(null);
    if (error) {
      setError(error);
      return;
    }
    setSubmissions(current => current.map(item => item.id === id ? { ...item, status } : item));
  };

  const filtered = submissions.filter(submission => {
    const query = search.toLowerCase();
    const matchesSearch =
      !query ||
      submission.name.toLowerCase().includes(query) ||
      submission.email.toLowerCase().includes(query) ||
      (submission.company ?? '').toLowerCase().includes(query) ||
      (submission.service ?? '').toLowerCase().includes(query) ||
      submission.message.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusClasses: Record<ContactSubmissionRow['status'], string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    closed: 'bg-green-100 text-green-700',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#1d1d1d]">Contact Submissions</h2>
          <p className="font-['DM_Sans',sans-serif] text-gray-600">Review and track enquiries from the contact form</p>
        </div>
        <span className="font-['DM_Sans',sans-serif] text-sm text-gray-500">{submissions.length} total</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
              Search Submissions
            </label>
            <input
              type="text"
              placeholder="Search by name, email, company, service, or message..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#ed2a10]"
            />
          </div>
          <div>
            <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif] text-sm focus:outline-none focus:ring-2 focus:ring-[#ed2a10]"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <p className="font-['DM_Sans',sans-serif] text-gray-500">Loading submissions...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-2">Contact submissions could not be loaded</h3>
          <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm mb-4">
            Apply the Supabase migration and make sure your admin account has the admin role.
          </p>
          <p className="font-['DM_Sans',sans-serif] text-xs text-gray-400">Error: {error}</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-12 text-center">
          <div className="text-4xl mb-4">@</div>
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-2">No submissions found</h3>
          <p className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">New contact form enquiries will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(submission => (
            <div key={submission.id} className="bg-white rounded-xl shadow p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d]">{submission.name}</h3>
                    <span className={`text-xs font-['DM_Sans',sans-serif] font-semibold px-2 py-1 rounded-full capitalize ${statusClasses[submission.status]}`}>
                      {submission.status}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600 font-['DM_Sans',sans-serif]">
                    <a href={`mailto:${submission.email}`} className="hover:text-[#ed2a10]">{submission.email}</a>
                    {submission.phone && <a href={`tel:${submission.phone}`} className="hover:text-[#ed2a10]">{submission.phone}</a>}
                    {submission.company && <span>{submission.company}</span>}
                    {submission.service && <span className="capitalize">{submission.service}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(['new', 'contacted', 'closed'] as ContactSubmissionRow['status'][]).map(status => (
                    <button
                      key={status}
                      disabled={updatingId === submission.id || submission.status === status}
                      onClick={() => handleStatusChange(submission.id, status)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-['DM_Sans',sans-serif] font-semibold capitalize transition-colors ${
                        submission.status === status
                          ? 'bg-[#333333] text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      } disabled:opacity-60`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
              <p className="font-['DM_Sans',sans-serif] text-gray-700 leading-relaxed whitespace-pre-wrap mb-4">{submission.message}</p>
              <p className="font-['DM_Sans',sans-serif] text-xs text-gray-400">
                Submitted {new Date(submission.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
