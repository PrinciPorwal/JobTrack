import React, { useState, useEffect } from 'react';

const INITIAL_STATE = {
  company: '',
  jobTitle: '',
  jobUrl: '',
  location: '',
  workMode: 'REMOTE',
  employmentType: 'FULL_TIME',
  salaryMin: '',
  salaryMax: '',
  applicationDate: new Date().toISOString().split('T')[0],
  status: 'APPLIED',
  source: 'LinkedIn',
  recruiter: {
    name: '',
    email: '',
    linkedin: '',
  },
  jobDescription: '',
  notes: '',
};

export default function ApplicationForm({
  initialData = null,
  onSubmit,
  onCancel,
  isLoading = false,
}) {
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        company: initialData.company || '',
        jobTitle: initialData.jobTitle || '',
        jobUrl: initialData.jobUrl || '',
        location: initialData.location || '',
        workMode: initialData.workMode || 'REMOTE',
        employmentType: initialData.employmentType || 'FULL_TIME',
        salaryMin: initialData.salaryMin ?? '',
        salaryMax: initialData.salaryMax ?? '',
        applicationDate: initialData.applicationDate
          ? new Date(initialData.applicationDate).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        status: initialData.status || 'APPLIED',
        source: initialData.source || 'LinkedIn',
        recruiter: {
          name: initialData.recruiter?.name || '',
          email: initialData.recruiter?.email || '',
          linkedin: initialData.recruiter?.linkedin || '',
        },
        jobDescription: initialData.jobDescription || '',
        notes: initialData.notes || '',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [initialData]);

  const validate = () => {
    const errs = {};
    if (!formData.company.trim()) errs.company = 'Company name is required';
    if (!formData.jobTitle.trim()) errs.jobTitle = 'Job title is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...formData,
      salaryMin: formData.salaryMin === '' ? undefined : Number(formData.salaryMin),
      salaryMax: formData.salaryMax === '' ? undefined : Number(formData.salaryMax),
    };

    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Company & Job Title */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Company Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            placeholder="e.g. Stripe, Google"
            className={`mt-1.5 block w-full rounded-xl border px-3.5 py-2 text-sm shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
              errors.company ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.company && <p className="mt-1 text-xs text-rose-500">{errors.company}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Job Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={formData.jobTitle}
            onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
            placeholder="e.g. Senior Software Engineer"
            className={`mt-1.5 block w-full rounded-xl border px-3.5 py-2 text-sm shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
              errors.jobTitle ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
            }`}
          />
          {errors.jobTitle && <p className="mt-1 text-xs text-rose-500">{errors.jobTitle}</p>}
        </div>
      </div>

      {/* Status & Application Date */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Pipeline Stage</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="SAVED">Saved / Wishlist</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interviewing</option>
            <option value="OFFER">Offer Received</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Application Date</label>
          <input
            type="date"
            value={formData.applicationDate}
            onChange={(e) => setFormData({ ...formData, applicationDate: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Work Mode & Employment Type */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Work Mode</label>
          <select
            value={formData.workMode}
            onChange={(e) => setFormData({ ...formData, workMode: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Type</label>
          <select
            value={formData.employmentType}
            onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="FULL_TIME">Full-time</option>
            <option value="PART_TIME">Part-time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERNSHIP">Internship</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Source</label>
          <select
            value={formData.source}
            onChange={(e) => setFormData({ ...formData, source: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="LinkedIn">LinkedIn</option>
            <option value="Company Website">Company Website</option>
            <option value="Referral">Referral</option>
            <option value="Wellfound">Wellfound</option>
            <option value="Naukri">Naukri</option>
            <option value="Indeed">Indeed</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      {/* Location & Job URL */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="e.g. Bengaluru, India or San Francisco, CA"
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Job Posting URL</label>
          <input
            type="url"
            value={formData.jobUrl}
            onChange={(e) => setFormData({ ...formData, jobUrl: e.target.value })}
            placeholder="https://..."
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Salary Range */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Minimum Salary ($ / yr)</label>
          <input
            type="number"
            value={formData.salaryMin}
            onChange={(e) => setFormData({ ...formData, salaryMin: e.target.value })}
            placeholder="e.g. 140000"
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Maximum Salary ($ / yr)</label>
          <input
            type="number"
            value={formData.salaryMax}
            onChange={(e) => setFormData({ ...formData, salaryMax: e.target.value })}
            placeholder="e.g. 180000"
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Recruiter Details */}
      <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
          Recruiter / Contact Person (Optional)
        </h4>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-600">Contact Name</label>
            <input
              type="text"
              value={formData.recruiter.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recruiter: { ...formData.recruiter, name: e.target.value },
                })
              }
              placeholder="e.g. Sarah Jenkins"
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600">Email Address</label>
            <input
              type="email"
              value={formData.recruiter.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recruiter: { ...formData.recruiter, email: e.target.value },
                })
              }
              placeholder="sarah@company.com"
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600">LinkedIn Profile</label>
            <input
              type="url"
              value={formData.recruiter.linkedin}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  recruiter: { ...formData.recruiter, linkedin: e.target.value },
                })
              }
              placeholder="https://linkedin.com/in/..."
              className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs shadow-2xs focus:border-blue-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700">Personal Notes / Strategy</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g. Tailored resume for distributed systems, referral by alumni..."
          className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 active:scale-[0.99] transition-all disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : initialData ? 'Update Application' : 'Create Application'}
        </button>
      </div>
    </form>
  );
}
