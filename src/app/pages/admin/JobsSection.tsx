import React, { useState, useEffect } from 'react';
import { JobOpening } from './types';
import { fetchJobOpenings, saveJobOpening, updateJobOpening, deleteJobOpening, JobOpeningRow, JobOpeningInput } from '../../../lib/jobService';
import { uid } from './ids';

function JobForm({ 
  onClose, 
  onSave, 
  editingJob 
}: { 
  onClose: () => void; 
  onSave: (job: JobOpening) => void;
  editingJob: JobOpening | null;
}) {
  const [formData, setFormData] = useState<Partial<JobOpening>>(editingJob || {
    title: '',
    company: '',
    department: '',
    location: '',
    type: 'Full-time',
    description: '',
    requirements: '',
    salary: '',
    isActive: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const jobData: JobOpening = {
      id: editingJob?.id || uid('job'),
      title: formData.title || '',
      company: formData.company || '',
      department: formData.department || '',
      location: formData.location || '',
      type: formData.type || 'Full-time',
      description: formData.description || '',
      requirements: formData.requirements || '',
      salary: formData.salary || '',
      postedDate: editingJob?.postedDate || new Date().toISOString().split('T')[0],
      isActive: formData.isActive !== false
    };

    onSave(jobData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-gray-900">
              {editingJob ? 'Edit Job Opening' : 'Post New Job'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Job Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="e.g., Frontend Developer"
              />
            </div>
            
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Company *
              </label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="e.g., Tech Innovations Ltd"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="e.g., Lagos, Nigeria"
              />
            </div>
            
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Employment Type *
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({...formData, type: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
                <option value="Remote">Remote</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Department *
              </label>
              <input
                type="text"
                required
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="e.g., Engineering"
              />
            </div>
            <div>
              <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
                Salary Range *
              </label>
              <input
                type="text"
                required
                value={formData.salary}
                onChange={(e) => setFormData({...formData, salary: e.target.value})}
                className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
                placeholder="e.g., ₦150,000 - ₦250,000"
              />
            </div>
          </div>

          <div>
            <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              rows={4}
              placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for..."
            />
          </div>

          <div>
            <label className="block font-['DM_Sans',sans-serif] font-medium text-gray-700 mb-2">
              Requirements *
            </label>
            <textarea
              required
              value={formData.requirements}
              onChange={(e) => setFormData({...formData, requirements: e.target.value})}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 font-['DM_Sans',sans-serif]"
              rows={4}
              placeholder="List the required qualifications, skills, and experience..."
            />
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="isActive"
              checked={formData.isActive !== false}
              onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
              className="w-4 h-4 text-[#ed2a10] border-gray-300 rounded focus:ring-[#ed2a10]"
            />
            <label htmlFor="isActive" className="ml-2 font-['DM_Sans',sans-serif] text-gray-700">
              Active (job posting is live and accepting applications)
            </label>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 font-['DM_Sans',sans-serif] font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#ed2a10] text-white py-2 rounded-lg hover:bg-[#d42610] font-['DM_Sans',sans-serif] font-medium"
            >
              {editingJob ? 'Update Job' : 'Post Job'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Job Openings Component
const mapJobRowToJob = (row: JobOpeningRow): JobOpening => ({
  id: row.id,
  title: row.title,
  company: row.company,
  department: row.department,
  location: row.location,
  type: row.type,
  description: row.description,
  requirements: row.requirements,
  salary: row.salary,
  postedDate: (row.created_at ?? '').split('T')[0],
  isActive: row.is_active,
});

const jobToInput = (job: JobOpening): JobOpeningInput => ({
  title: job.title,
  company: job.company,
  department: job.department,
  location: job.location,
  type: job.type,
  description: job.description,
  requirements: job.requirements,
  salary: job.salary,
  is_active: job.isActive,
});

export function JobOpenings() {
  const [jobOpenings, setJobOpenings] = useState<JobOpening[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<JobOpening | null>(null);

  const loadJobs = async () => {
    setLoading(true);
    const { data, error } = await fetchJobOpenings();
    setJobOpenings(data.map(mapJobRowToJob));
    setError(error);
    setLoading(false);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const handleJobSave = async (job: JobOpening) => {
    const { error } = editingJob
      ? await updateJobOpening(editingJob.id, jobToInput(job))
      : await saveJobOpening(jobToInput(job));
    if (error) {
      setError(error);
      return;
    }
    setShowJobForm(false);
    setEditingJob(null);
    await loadJobs();
  };

  const handleEditJob = (job: JobOpening) => {
    setEditingJob(job);
    setShowJobForm(true);
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm('Are you sure you want to delete this job posting?')) return;
    const { error } = await deleteJobOpening(jobId);
    if (error) {
      setError(error);
      return;
    }
    await loadJobs();
  };

  const handleToggleStatus = async (job: JobOpening) => {
    const { error } = await updateJobOpening(job.id, { is_active: !job.isActive });
    if (error) {
      setError(error);
      return;
    }
    await loadJobs();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-gray-900">
            Job Openings
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-gray-600">
            Manage job postings and applications
          </p>
        </div>
        <button
          onClick={() => setShowJobForm(true)}
          className="bg-[#ed2a10] text-white px-6 py-3 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-semibold"
        >
          Post New Job
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm font-['DM_Sans',sans-serif]">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span>{error}</span>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="font-['DM_Sans',sans-serif] text-gray-500">Loading job openings...</p>
          </div>
        ) : jobOpenings.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💼</span>
            </div>
            <h3 className="font-['DM_Sans',sans-serif] font-semibold text-lg text-gray-900 mb-2">
              No job openings yet
            </h3>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">
              Create your first job posting to start attracting talent
            </p>
            <button
              onClick={() => setShowJobForm(true)}
              className="bg-[#0d9488] text-white px-6 py-2 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-medium"
            >
              Post First Job
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Position</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Department</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Location</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Type</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Posted</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Status</th>
                  <th className="px-6 py-3 text-left font-['DM_Sans',sans-serif] font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {jobOpenings.map((job) => (
                  <tr key={job.id}>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-['DM_Sans',sans-serif] font-medium text-gray-900">{job.title}</div>
                        <div className="font-['DM_Sans',sans-serif] text-sm text-gray-600">{job.company}</div>
                        <div className="font-['DM_Sans',sans-serif] text-xs text-gray-400">{job.salary}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-['DM_Sans',sans-serif] text-gray-900">{job.department}</td>
                    <td className="px-6 py-4 font-['DM_Sans',sans-serif] text-gray-900">{job.location}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs font-['DM_Sans',sans-serif] rounded-full bg-blue-100 text-blue-800">
                        {job.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-['DM_Sans',sans-serif] text-gray-900">{job.postedDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs font-['DM_Sans',sans-serif] rounded-full ${
                        job.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEditJob(job)}
                          className="text-blue-600 hover:text-blue-800 font-['DM_Sans',sans-serif] text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleToggleStatus(job)}
                          className="text-yellow-600 hover:text-yellow-800 font-['DM_Sans',sans-serif] text-sm"
                        >
                          {job.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-red-600 hover:text-red-800 font-['DM_Sans',sans-serif] text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <JobForm
          onClose={() => {
            setShowJobForm(false);
            setEditingJob(null);
          }}
          onSave={handleJobSave}
          editingJob={editingJob}
        />
      )}
    </div>
  );
}
