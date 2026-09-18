import React, { useState, useEffect } from 'react';
import { resumeService } from '../services/api';
import ResumeViewer from '../components/resume/ResumeViewer';
import Modal from '../components/common/Modal';

export default function Resume() {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Edit Modal state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ name: '', fileUrl: '' });
  const [saving, setSaving] = useState(false);

  const fetchResume = async () => {
    try {
      setLoading(true);
      const res = await resumeService.get();
      setResume(res.data);
      if (res.data) {
        setEditFormData({
          name: res.data.name || '',
          fileUrl: res.data.fileUrl || '',
        });
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load resume:', err);
      setError(err.message || 'Failed to load resume configuration');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResume();
  }, []);

  const handleSaveResume = async (e) => {
    e.preventDefault();
    if (!editFormData.fileUrl.trim()) return;

    try {
      setSaving(true);
      const res = await resumeService.save(editFormData);
      if (res.data) {
        setResume(res.data);
      }
      setIsEditModalOpen(false);
    } catch (err) {
      alert(err.message || 'Failed to update resume');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
          {error}
        </div>
      )}

      <ResumeViewer
        resume={resume}
        onEdit={() => {
          setEditFormData({
            name: resume?.name || '',
            fileUrl: resume?.fileUrl || '',
          });
          setIsEditModalOpen(true);
        }}
      />

      {/* Edit Resume Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Master Resume Link"
        description="Connect your latest Google Drive or cloud resume document."
      >
        <form onSubmit={handleSaveResume} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Resume Display Name
            </label>
            <input
              type="text"
              value={editFormData.name}
              onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
              placeholder="e.g. Software Engineer Resume "
              className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700">
              Google Drive Sharing Link <span className="text-rose-500">*</span>
            </label>
            <input
              type="url"
              required
              value={editFormData.fileUrl}
              onChange={(e) => setEditFormData({ ...editFormData, fileUrl: e.target.value })}
              placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
              className="mt-1.5 block w-full rounded-xl border border-slate-200 px-3.5 py-2 text-sm shadow-2xs focus:border-blue-500 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            />
            <p className="mt-1 text-[11px] text-slate-400">
              Make sure Google Drive sharing permissions are set to "Anyone with the link can view".
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsEditModalOpen(false)}
              disabled={saving}
              className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="rounded-xl bg-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-700 transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
