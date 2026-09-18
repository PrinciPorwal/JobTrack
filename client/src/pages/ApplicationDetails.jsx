import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Building,
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  Edit2,
  Trash2,
  Plus,
  Mail,
  Linkedin,
  Clock,
  User,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { applicationService, interviewService } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';
import InterviewCard from '../components/interviews/InterviewCard';
import InterviewForm from '../components/interviews/InterviewForm';
import ApplicationForm from '../components/applications/ApplicationForm';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';

export default function ApplicationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [application, setApplication] = useState(null);
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddInterviewModalOpen, setIsAddInterviewModalOpen] = useState(false);
  const [isDeleteAppDialogOpen, setIsDeleteAppDialogOpen] = useState(false);
  const [deleteInterviewId, setDeleteInterviewId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      const [appRes, interviewRes] = await Promise.all([
        applicationService.getById(id),
        interviewService.getAll({ applicationId: id }),
      ]);
      setApplication(appRes.data);
      setInterviews(interviewRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Failed to load application details:', err);
      setError(err.message || 'Failed to load application details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    setApplication((prev) => ({ ...prev, status: newStatus }));
    try {
      await applicationService.updateStatus(id, newStatus);
    } catch (err) {
      console.error('Failed to update status:', err);
      fetchDetails();
    }
  };

  const handleUpdateApplication = async (formData) => {
    try {
      setActionLoading(true);
      const res = await applicationService.update(id, formData);
      if (res.data) setApplication(res.data);
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to update');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteApplication = async () => {
    try {
      setActionLoading(true);
      await applicationService.delete(id);
      navigate('/applications');
    } catch (err) {
      alert(err.message || 'Failed to delete application');
    } finally {
      setActionLoading(false);
    }
  };

  // Interview actions
  const handleCreateInterview = async (formData) => {
    try {
      setActionLoading(true);
      const res = await interviewService.create({ ...formData, applicationId: id });
      if (res.data) setInterviews((prev) => [...prev, res.data]);
      setIsAddInterviewModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to schedule interview');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateInterviewResult = async (interviewId, result) => {
    setInterviews((prev) =>
      prev.map((iv) => (iv._id === interviewId ? { ...iv, result } : iv))
    );
    try {
      await interviewService.update(interviewId, { result });
    } catch (err) {
      console.error('Failed to update result:', err);
      fetchDetails();
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

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center">
        <p className="text-sm font-semibold text-rose-700">{error || 'Job not found'}</p>
        <button
          onClick={() => navigate('/applications')}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white"
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Not disclosed';
    if (min && max) return `$${min.toLocaleString()} - $${max.toLocaleString()} / year`;
    if (min) return `From $${min.toLocaleString()} / year`;
    return `Up to $${max.toLocaleString()} / year`;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Back button */}
      <div>
        <button
          onClick={() => navigate('/applications')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to All Applications</span>
        </button>
      </div>

      {/* Header Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                {application.company}
              </h2>
              {application.jobUrl && (
                <a
                  href={application.jobUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200 transition-colors"
                >
                  <span>Job Post</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              )}
            </div>
            <p className="mt-1 text-base font-semibold text-slate-600">
              {application.jobTitle}
            </p>
          </div>

          {/* Right Actions: Status Dropdown & Edit / Delete */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5">
              <span className="text-xs font-semibold text-slate-500">Stage:</span>
              <select
                value={application.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="bg-transparent text-xs font-bold text-slate-900 focus:outline-hidden cursor-pointer"
              >
                <option value="SAVED">Saved</option>
                <option value="APPLIED">Applied</option>
                <option value="INTERVIEW">Interview</option>
                <option value="OFFER">Offer</option>
                <option value="REJECTED">Rejected</option>
                <option value="WITHDRAWN">Withdrawn</option>
              </select>
            </div>

            <button
              onClick={() => setIsEditModalOpen(true)}
              className="rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-50 hover:text-slate-900 transition-colors"
              title="Edit Application"
            >
              <Edit2 className="h-4 w-4" />
            </button>

            <button
              onClick={() => setIsDeleteAppDialogOpen(true)}
              className="rounded-xl border border-rose-200 p-2 text-rose-500 hover:bg-rose-50 hover:text-rose-700 transition-colors"
              title="Delete Application"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Metadata Badges */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-5 sm:grid-cols-4">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Location
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-800">
              <MapPin className="h-3.5 w-3.5 text-slate-400" />
              <span>{application.location || 'Remote'}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Work Mode & Type
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-800">
              <StatusBadge status={application.workMode} size="xs" showDot={false} />
              <span>• {application.employmentType?.replace('_', ' ')}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Target Compensation
            </span>
            <div className="mt-1 flex items-center gap-1 text-xs font-bold text-emerald-700">
              <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
              <span>{formatSalary(application.salaryMin, application.salaryMax)}</span>
            </div>
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Application Date
            </span>
            <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-800">
              <Calendar className="h-3.5 w-3.5 text-slate-400" />
              <span>
                {application.applicationDate
                  ? new Date(application.applicationDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })
                  : '—'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recruiter Card & Notes Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {/* Recruiter Contact */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
            Recruiter & Point of Contact
          </h3>
          {application.recruiter?.name ? (
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-slate-900 font-semibold">
                <User className="h-4 w-4 text-blue-500" />
                <span>{application.recruiter.name}</span>
              </div>
              {application.recruiter.email && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="h-3.5 w-3.5 text-slate-400" />
                  <a
                    href={`mailto:${application.recruiter.email}`}
                    className="text-blue-600 hover:underline truncate"
                  >
                    {application.recruiter.email}
                  </a>
                </div>
              )}
              {application.recruiter.linkedin && (
                <div className="flex items-center gap-2 text-slate-600">
                  <Linkedin className="h-3.5 w-3.5 text-slate-400" />
                  <a
                    href={application.recruiter.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline truncate"
                  >
                    LinkedIn Profile
                  </a>
                </div>
              )}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic">No direct recruiter contact listed.</p>
          )}

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400">
            Source: <span className="font-semibold text-slate-700">{application.source}</span>
          </div>
        </div>

        {/* Strategy Notes */}
        <div className="sm:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
            Strategy & Candidate Notes
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-wrap">
            {application.notes || 'No personal notes added for this job.'}
          </p>

          {application.jobDescription && (
            <div className="mt-4 pt-4 border-t border-slate-100">
              <h4 className="text-xs font-semibold text-slate-700 mb-1">Role Overview:</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                {application.jobDescription}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Connected Interviews Pipeline */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900">Interview Rounds & Timeline</h3>
            <p className="text-xs text-slate-500">
              Manage rounds, meeting links, prep notes, and decisions for this role.
            </p>
          </div>

          <button
            onClick={() => setIsAddInterviewModalOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Schedule Round</span>
          </button>
        </div>

        {interviews.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <Clock className="mx-auto h-8 w-8 text-slate-300" />
            <h4 className="mt-2 text-xs font-semibold text-slate-700">No interview rounds scheduled</h4>
            <p className="mt-0.5 text-[11px] text-slate-400">
              Keep track of technical screenings, system design rounds, and behavioral chats.
            </p>
            <button
              onClick={() => setIsAddInterviewModalOpen(true)}
              className="mt-3 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100"
            >
              + Add First Interview Round
            </button>
          </div>
        ) : (
          <div className="space-y-4 pt-2">
            {interviews.map((iv) => (
              <InterviewCard
                key={iv._id}
                interview={{ ...iv, applicationId: application }}
                onUpdateResult={handleUpdateInterviewResult}
                onDelete={(ivId) => setDeleteInterviewId(ivId)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Edit Application Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Job Application"
      >
        <ApplicationForm
          initialData={application}
          onSubmit={handleUpdateApplication}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={actionLoading}
        />
      </Modal>

      {/* Add Interview Modal */}
      <Modal
        isOpen={isAddInterviewModalOpen}
        onClose={() => setIsAddInterviewModalOpen(false)}
        title={`Schedule Round: ${application.company}`}
        description="Add date, format, and meeting link for this round."
      >
        <InterviewForm
          applications={[application]}
          preselectedApplicationId={application._id}
          onSubmit={handleCreateInterview}
          onCancel={() => setIsAddInterviewModalOpen(false)}
          isLoading={actionLoading}
        />
      </Modal>

      {/* Delete Application Confirm */}
      <ConfirmDialog
        isOpen={isDeleteAppDialogOpen}
        onClose={() => setIsDeleteAppDialogOpen(false)}
        onConfirm={handleDeleteApplication}
        title="Delete Job Application"
        message={`Are you sure you want to permanently delete the application for ${application.company}?`}
        isLoading={actionLoading}
      />

      {/* Delete Interview Confirm */}
      <ConfirmDialog
        isOpen={Boolean(deleteInterviewId)}
        onClose={() => setDeleteInterviewId(null)}
        onConfirm={handleDeleteInterview}
        title="Delete Interview Round"
        message="Are you sure you want to remove this interview record?"
        isLoading={actionLoading}
      />
    </div>
  );
}
