import React, { useState, useEffect, useMemo } from 'react';
import {
  CalendarCheck,
  Plus,
  Search,
  Filter,
  Video,
  Clock,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { interviewService, applicationService } from '../services/api';
import InterviewCard from '../components/interviews/InterviewCard';
import InterviewForm from '../components/interviews/InterviewForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [resultFilter, setResultFilter] = useState('ALL');
  const [roundFilter, setRoundFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteInterviewId, setDeleteInterviewId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ivRes, appRes] = await Promise.all([
        interviewService.getAll(),
        applicationService.getAll(),
      ]);
      setInterviews(ivRes.data || []);
      setApplications(appRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load interviews:', err);
      setError(err.message || 'Failed to load interviews');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateResult = async (interviewId, result) => {
    setInterviews((prev) =>
      prev.map((iv) => (iv._id === interviewId ? { ...iv, result } : iv))
    );
    try {
      await interviewService.update(interviewId, { result });
    } catch (err) {
      console.error('Failed to update interview result:', err);
      fetchData();
    }
  };

  const handleCreateInterview = async (formData) => {
    try {
      setActionLoading(true);
      const res = await interviewService.create(formData);
      if (res.data) {
        // re-fetch to get populated application details
        await fetchData();
      }
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to schedule interview');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteInterview = async () => {
    if (!deleteInterviewId) return;
    try {
      setActionLoading(true);
      await interviewService.delete(deleteInterviewId);
      setInterviews((prev) => prev.filter((iv) => iv._id !== deleteInterviewId));
      setDeleteInterviewId(null);
    } catch (err) {
      alert(err.message || 'Failed to delete interview');
    } finally {
      setActionLoading(false);
    }
  };

  const filteredInterviews = useMemo(() => {
    return interviews.filter((iv) => {
      const q = searchQuery.toLowerCase().trim();
      const company = iv.applicationId?.company?.toLowerCase() || '';
      const jobTitle = iv.applicationId?.jobTitle?.toLowerCase() || '';
      const interviewer = iv.interviewer?.toLowerCase() || '';
      const matchesSearch = !q || company.includes(q) || jobTitle.includes(q) || interviewer.includes(q);

      const matchesResult = resultFilter === 'ALL' || iv.result === resultFilter;
      const matchesRound = roundFilter === 'ALL' || iv.round === roundFilter;

      return matchesSearch && matchesResult && matchesRound;
    });
  }, [interviews, searchQuery, resultFilter, roundFilter]);

  return (
    <div className="space-y-6">
      {/* Top Filter & Actions Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, interviewer, role..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Result Filter */}
          <select
            value={resultFilter}
            onChange={(e) => setResultFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-hidden"
          >
            <option value="ALL">All Outcomes</option>
            <option value="PENDING">Pending / Upcoming</option>
            <option value="PASSED">Passed</option>
            <option value="FAILED">Did not pass</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {/* Round Filter */}
          <select
            value={roundFilter}
            onChange={(e) => setRoundFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-hidden"
          >
            <option value="ALL">All Round Types</option>
            <option value="OA">Online Assessment (OA)</option>
            <option value="TECHNICAL">Technical Interview</option>
            <option value="SYSTEM_DESIGN">System Design</option>
            <option value="HR">HR / Behavioral</option>
          </select>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Round</span>
          </button>
        </div>
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : filteredInterviews.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <CalendarCheck className="h-10 w-10 text-slate-300" />
          <h3 className="mt-3 text-sm font-semibold text-slate-800">No interviews match your criteria</h3>
          <p className="mt-1 text-xs text-slate-500">
            Schedule an interview round to practice and track meeting links.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700"
          >
            + Schedule Round
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredInterviews.map((interview) => (
            <InterviewCard
              key={interview._id}
              interview={interview}
              onUpdateResult={handleUpdateResult}
              onDelete={(id) => setDeleteInterviewId(id)}
            />
          ))}
        </div>
      )}

      {/* Schedule Interview Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule Interview Round"
        description="Attach an interview to an existing job application."
      >
        <InterviewForm
          applications={applications}
          onSubmit={handleCreateInterview}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={actionLoading}
        />
      </Modal>

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteInterviewId)}
        onClose={() => setDeleteInterviewId(null)}
        onConfirm={handleDeleteInterview}
        title="Delete Interview Round"
        message="Are you sure you want to remove this interview from your records?"
        isLoading={actionLoading}
      />
    </div>
  );
}
