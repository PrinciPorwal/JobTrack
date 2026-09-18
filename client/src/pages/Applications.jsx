import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutGrid,
  List,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  ExternalLink,
  Trash2,
  Edit2,
  ChevronRight,
  Briefcase,
} from 'lucide-react';
import { applicationService } from '../services/api';
import KanbanBoard from '../components/applications/KanbanBoard';
import ApplicationForm from '../components/applications/ApplicationForm';
import StatusBadge from '../components/common/StatusBadge';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function Applications({ isAddModalOpen, setIsAddModalOpen, initialNewStatus = 'APPLIED' }) {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View & Filter states
  const [viewMode, setViewMode] = useState('board'); // 'board' | 'table'
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [workModeFilter, setWorkModeFilter] = useState('ALL');

  // Modals
  const [editApp, setEditApp] = useState(null);
  const [deleteAppId, setDeleteAppId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const res = await applicationService.getAll();
      setApplications(res.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch applications:', err);
      setError(err.message || 'Failed to fetch applications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        app.company?.toLowerCase().includes(q) ||
        app.jobTitle?.toLowerCase().includes(q) ||
        app.location?.toLowerCase().includes(q);

      const matchesStatus = statusFilter === 'ALL' || app.status === statusFilter;
      const matchesWorkMode = workModeFilter === 'ALL' || app.workMode === workModeFilter;

      return matchesSearch && matchesStatus && matchesWorkMode;
    });
  }, [applications, searchQuery, statusFilter, workModeFilter]);

  // Status transition handler (Kanban drag or select)
  const handleStatusChange = async (appId, newStatus) => {
    // Optimistic UI update
    setApplications((prev) =>
      prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
    );

    try {
      await applicationService.updateStatus(appId, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      // Rollback on error
      fetchApplications();
    }
  };

  // Create Application
  const handleCreateApplication = async (formData) => {
    try {
      setActionLoading(true);
      const res = await applicationService.create(formData);
      if (res.data) {
        setApplications((prev) => [res.data, ...prev]);
      }
      setIsAddModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to create application');
    } finally {
      setActionLoading(false);
    }
  };

  // Update Application
  const handleUpdateApplication = async (formData) => {
    if (!editApp) return;
    try {
      setActionLoading(true);
      const res = await applicationService.update(editApp._id, formData);
      if (res.data) {
        setApplications((prev) =>
          prev.map((a) => (a._id === editApp._id ? res.data : a))
        );
      }
      setEditApp(null);
    } catch (err) {
      alert(err.message || 'Failed to update application');
    } finally {
      setActionLoading(false);
    }
  };

  // Delete Application
  const handleDeleteApplication = async () => {
    if (!deleteAppId) return;
    try {
      setActionLoading(true);
      await applicationService.delete(deleteAppId);
      setApplications((prev) => prev.filter((a) => a._id !== deleteAppId));
      setDeleteAppId(null);
    } catch (err) {
      alert(err.message || 'Failed to delete application');
    } finally {
      setActionLoading(false);
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return '—';
    if (min && max) return `$${Math.round(min / 1000)}k - $${Math.round(max / 1000)}k`;
    if (min) return `From $${Math.round(min / 1000)}k`;
    return `Up to $${Math.round(max / 1000)}k`;
  };

  return (
    <div className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by company, job title, location..."
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status filter dropdown */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="SAVED">Saved</option>
            <option value="APPLIED">Applied</option>
            <option value="INTERVIEW">Interview</option>
            <option value="OFFER">Offer</option>
            <option value="REJECTED">Rejected</option>
            <option value="WITHDRAWN">Withdrawn</option>
          </select>

          {/* Work mode filter */}
          <select
            value={workModeFilter}
            onChange={(e) => setWorkModeFilter(e.target.value)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-2xs focus:border-blue-500 focus:outline-hidden"
          >
            <option value="ALL">All Work Modes</option>
            <option value="REMOTE">Remote</option>
            <option value="HYBRID">Hybrid</option>
            <option value="ONSITE">On-site</option>
          </select>

          {/* View Toggle */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-100 p-1">
            <button
              onClick={() => setViewMode('board')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'board'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutGrid className="h-3.5 w-3.5" />
              <span>Board</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-blue-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="h-3.5 w-3.5" />
              <span>List</span>
            </button>
          </div>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Job</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="flex h-72 items-center justify-center">
          <div className="h-7 w-7 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center text-sm font-medium text-rose-700">
          {error}
        </div>
      ) : filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-slate-800">No applications found</h3>
          <p className="mt-1 text-xs text-slate-500 max-w-sm">
            Try adjusting your search filters or add a new job application to start tracking.
          </p>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="mt-5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700"
          >
            + Track Application
          </button>
        </div>
      ) : viewMode === 'board' ? (
        <KanbanBoard
          applications={filteredApps}
          onStatusChange={handleStatusChange}
          onOpenNewApp={() => setIsAddModalOpen(true)}
        />
      ) : (
        /* Table / List View */
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 bg-slate-50/80 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3.5">Company & Role</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5">Work Mode</th>
                  <th className="px-5 py-3.5">Salary</th>
                  <th className="px-5 py-3.5">Applied Date</th>
                  <th className="px-5 py-3.5">Recruiter</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {filteredApps.map((app) => (
                  <tr
                    key={app._id}
                    onClick={() => navigate(`/applications/${app._id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {app.company}
                      </div>
                      <div className="text-slate-500 text-[11px] mt-0.5">{app.jobTitle}</div>
                    </td>
                    <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app._id, e.target.value)}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-800 shadow-2xs focus:border-blue-500"
                      >
                        <option value="SAVED">Saved</option>
                        <option value="APPLIED">Applied</option>
                        <option value="INTERVIEW">Interview</option>
                        <option value="OFFER">Offer</option>
                        <option value="REJECTED">Rejected</option>
                        <option value="WITHDRAWN">Withdrawn</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={app.workMode} size="xs" showDot={false} />
                    </td>
                    <td className="px-5 py-3.5 font-medium text-slate-900">
                      {formatSalary(app.salaryMin, app.salaryMax)}
                    </td>
                    <td className="px-5 py-3.5 text-slate-500">
                      {app.applicationDate
                        ? new Date(app.applicationDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })
                        : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-slate-600">
                      {app.recruiter?.name || '—'}
                    </td>
                    <td className="px-5 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setEditApp(app)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteAppId(app._id)}
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Job Application"
        description="Track a new opportunity in your pipeline."
      >
        <ApplicationForm
          initialData={{ status: initialNewStatus }}
          onSubmit={handleCreateApplication}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={actionLoading}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={Boolean(editApp)}
        onClose={() => setEditApp(null)}
        title="Edit Job Application"
        description={`Update information for ${editApp?.company}`}
      >
        <ApplicationForm
          initialData={editApp}
          onSubmit={handleUpdateApplication}
          onCancel={() => setEditApp(null)}
          isLoading={actionLoading}
        />
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={Boolean(deleteAppId)}
        onClose={() => setDeleteAppId(null)}
        onConfirm={handleDeleteApplication}
        title="Delete Application"
        message="Are you sure you want to delete this job application? Any associated interview rounds will also be removed."
        confirmText="Delete Application"
        isLoading={actionLoading}
      />
    </div>
  );
}
