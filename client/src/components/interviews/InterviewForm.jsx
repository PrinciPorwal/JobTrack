import React, { useState, useEffect } from 'react';

const INITIAL_STATE = {
  applicationId: '',
  round: 'TECHNICAL',
  date: new Date().toISOString().split('T')[0],
  time: '14:00',
  interviewType: 'VIDEO',
  meetingLink: '',
  interviewer: '',
  notes: '',
  result: 'PENDING',
};

export default function InterviewForm({
  applications = [],
  preselectedApplicationId = '',
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
        applicationId: initialData.applicationId?._id || initialData.applicationId || '',
        round: initialData.round || 'TECHNICAL',
        date: initialData.date
          ? new Date(initialData.date).toISOString().split('T')[0]
          : new Date().toISOString().split('T')[0],
        time: initialData.time || '14:00',
        interviewType: initialData.interviewType || 'VIDEO',
        meetingLink: initialData.meetingLink || '',
        interviewer: initialData.interviewer || '',
        notes: initialData.notes || '',
        result: initialData.result || 'PENDING',
      });
    } else {
      setFormData({
        ...INITIAL_STATE,
        applicationId: preselectedApplicationId || (applications[0]?._id ?? ''),
      });
    }
  }, [initialData, preselectedApplicationId, applications]);

  const validate = () => {
    const errs = {};
    if (!formData.applicationId) errs.applicationId = 'Please select a company/job';
    if (!formData.date) errs.date = 'Date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Application Selector */}
      <div>
        <label className="block text-xs font-semibold text-slate-700">
          Select Job Application <span className="text-rose-500">*</span>
        </label>
        <select
          value={formData.applicationId}
          onChange={(e) => setFormData({ ...formData, applicationId: e.target.value })}
          disabled={Boolean(preselectedApplicationId && !initialData)}
          className={`mt-1.5 block w-full rounded-xl border bg-white px-3.5 py-2 text-sm shadow-2xs focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 ${
            errors.applicationId ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 focus:border-blue-500'
          }`}
        >
          <option value="">-- Choose Application --</option>
          {applications.map((app) => (
            <option key={app._id} value={app._id}>
              {app.company} - {app.jobTitle}
            </option>
          ))}
        </select>
        {errors.applicationId && (
          <p className="mt-1 text-xs text-rose-500">{errors.applicationId}</p>
        )}
      </div>

      {/* Round & Interview Type */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Interview Round</label>
          <select
            value={formData.round}
            onChange={(e) => setFormData({ ...formData, round: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="OA">Online Assessment (OA)</option>
            <option value="TECHNICAL">Technical Interview</option>
            <option value="SYSTEM_DESIGN">System Design</option>
            <option value="HR">HR / Behavioral</option>
            <option value="OTHER">Other Round</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Meeting Format</label>
          <select
            value={formData.interviewType}
            onChange={(e) => setFormData({ ...formData, interviewType: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          >
            <option value="VIDEO">Video Call (Google Meet, Teams, Zoom)</option>
            <option value="PHONE">Phone Screen</option>
            <option value="ONLINE">Online Platform (HackerRank, LeetCode)</option>
            <option value="ONSITE">Onsite Office</option>
          </select>
        </div>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">
            Interview Date <span className="text-rose-500">*</span>
          </label>
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
          {errors.date && <p className="mt-1 text-xs text-rose-500">{errors.date}</p>}
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Time (Local)</label>
          <input
            type="time"
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Meeting Link & Interviewer */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold text-slate-700">Meeting URL / Link</label>
          <input
            type="url"
            value={formData.meetingLink}
            onChange={(e) => setFormData({ ...formData, meetingLink: e.target.value })}
            placeholder="https://meet.google.com/..."
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700">Interviewer Name / Role</label>
          <input
            type="text"
            value={formData.interviewer}
            onChange={(e) => setFormData({ ...formData, interviewer: e.target.value })}
            placeholder="e.g. Alex Rivera (Staff Eng)"
            className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>
      </div>

      {/* Result Status */}
      <div>
        <label className="block text-xs font-semibold text-slate-700">Initial Status</label>
        <select
          value={formData.result}
          onChange={(e) => setFormData({ ...formData, result: e.target.value })}
          className="mt-1.5 block w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
        >
          <option value="PENDING">Pending / Upcoming</option>
          <option value="PASSED">Passed</option>
          <option value="FAILED">Did not pass</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-xs font-semibold text-slate-700">Preparation & Topics</label>
        <textarea
          rows={3}
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="e.g. Distributed rate limiter, LRU cache with concurrency..."
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
          {isLoading ? 'Saving...' : initialData ? 'Update Interview' : 'Schedule Round'}
        </button>
      </div>
    </form>
  );
}
