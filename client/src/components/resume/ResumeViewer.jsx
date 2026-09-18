import React, { useState } from 'react';
import {
  FileText,
  ExternalLink,
  Copy,
  Check,
  Edit2,
  Calendar,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

export default function ResumeViewer({ resume, onEdit }) {
  const [copied, setCopied] = useState(false);

  const fileUrl =
    resume?.fileUrl ||
    'https://drive.google.com/file/d/1eRtfLSkRqj6cHBaE6ccAJZaeFa_ZJvuH/view?usp=sharing';

  const resumeName = resume?.name || 'Software Engineer Resume';

  // Convert Google Drive view URL to preview embed URL
  const getEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com/file/d/')) {
      const parts = url.split('/view');
      return `${parts[0]}/preview`;
    }
    return url;
  };

  const embedUrl = getEmbedUrl(fileUrl);

  const handleCopy = () => {
    navigator.clipboard.writeText(fileUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (d) => {
    if (!d) return 'Recently synced';
    return new Date(d).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Resume Overview Header Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 shadow-2xs">
              <FileText className="h-6 w-6" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900">{resumeName}</h2>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Active Master</span>
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1 text-slate-600">
                  <Calendar className="h-3.5 w-3.5 text-slate-400" />
                  <span>Updated: {formatDate(resume?.updatedAt)}</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                  <span>Google Drive Cloud Synced</span>
                </span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopy}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied Link!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 text-slate-500" />
                  <span>Copy Drive Link</span>
                </>
              )}
            </button>

            <a
              href={fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-500" />
              <span>Open in Drive</span>
            </a>

            <button
              onClick={onEdit}
              type="button"
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-3.5 w-3.5" />
              <span>Edit Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* Embedded Document Frame */}
      <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/70 px-6 py-3">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-700">Document Live Preview</span>
          </div>
          <span className="text-xs text-slate-400">Powered by Google Drive Preview</span>
        </div>

        <div className="relative w-full h-[750px] bg-slate-100">
          <iframe
            src={embedUrl}
            title="Resume Preview"
            className="w-full h-full border-0"
            allow="autoplay"
          />
        </div>
      </div>
    </div>
  );
}
