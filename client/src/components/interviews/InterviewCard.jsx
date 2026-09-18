import React from 'react';
import {
  Video,
  Phone,
  Laptop,
  Building,
  Calendar,
  Clock,
  User,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock3,
  Trash2,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const ROUND_LABELS = {
  OA: 'Online Assessment (OA)',
  TECHNICAL: 'Technical Interview',
  SYSTEM_DESIGN: 'System Design Round',
  HR: 'HR & Behavioral',
  OTHER: 'Interview Round',
};

export default function InterviewCard({
  interview,
  onUpdateResult,
  onDelete,
}) {
  const { applicationId, round, date, time, interviewType, meetingLink, interviewer, notes, result } =
    interview;

  const appCompany = applicationId?.company || 'Company';
  const appJobTitle = applicationId?.jobTitle || 'Role';

  const formatInterviewDate = (d) => {
    if (!d) return '';
    return new Date(d).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getTypeIcon = () => {
    switch (interviewType) {
      case 'PHONE':
        return <Phone className="h-4 w-4 text-emerald-600" />;
      case 'ONSITE':
        return <Building className="h-4 w-4 text-amber-600" />;
      case 'ONLINE':
        return <Laptop className="h-4 w-4 text-sky-600" />;
      case 'VIDEO':
      default:
        return <Video className="h-4 w-4 text-blue-600" />;
    }
  };

  return (
    <div className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:border-slate-300 hover:shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        {/* Left info: Company, Title & Round */}
        <div className="flex items-start gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 border border-slate-200">
            {getTypeIcon()}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{appCompany}</h3>
              <span className="text-xs text-slate-400 font-normal">•</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                {ROUND_LABELS[round] || round}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-medium mt-0.5">{appJobTitle}</p>

            {/* Date & Time */}
            <div className="mt-2.5 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-1.5 font-medium text-slate-700">
                <Calendar className="h-3.5 w-3.5 text-slate-400" />
                <span>{formatInterviewDate(date)}</span>
              </div>
              {time && (
                <div className="flex items-center gap-1 text-slate-600">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  <span>{time}</span>
                </div>
              )}
              {interviewer && (
                <div className="flex items-center gap-1 text-slate-600">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>{interviewer}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right info: Result & Action buttons */}
        <div className="flex sm:flex-col items-end justify-between sm:justify-start gap-2.5">
          <StatusBadge status={result} size="sm" />

          {meetingLink && (
            <a
              href={meetingLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-2xs hover:bg-blue-700 transition-colors"
            >
              <span>Join Meeting</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
      </div>

      {/* Notes */}
      {notes && (
        <div className="mt-3.5 rounded-xl bg-slate-50/90 border border-slate-100 px-3.5 py-2 text-xs text-slate-600 leading-relaxed">
          <span className="font-semibold text-slate-700">Prep Notes: </span>
          {notes}
        </div>
      )}

      {/* Bottom Result Toggle & Delete */}
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="text-slate-400 font-medium">Update Status:</span>
          <button
            onClick={() => onUpdateResult(interview._id, 'PASSED')}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium transition-colors ${
              result === 'PASSED'
                ? 'bg-emerald-100 text-emerald-800'
                : 'text-slate-600 hover:bg-emerald-50 hover:text-emerald-700'
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>Passed</span>
          </button>
          <button
            onClick={() => onUpdateResult(interview._id, 'FAILED')}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium transition-colors ${
              result === 'FAILED'
                ? 'bg-rose-100 text-rose-800'
                : 'text-slate-600 hover:bg-rose-50 hover:text-rose-700'
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            <span>Failed</span>
          </button>
          <button
            onClick={() => onUpdateResult(interview._id, 'PENDING')}
            className={`inline-flex items-center gap-1 rounded-md px-2 py-1 font-medium transition-colors ${
              result === 'PENDING'
                ? 'bg-amber-100 text-amber-800'
                : 'text-slate-600 hover:bg-amber-50 hover:text-amber-700'
            }`}
          >
            <Clock3 className="h-3.5 w-3.5" />
            <span>Pending</span>
          </button>
        </div>

        {onDelete && (
          <button
            onClick={() => onDelete(interview._id)}
            className="text-slate-400 hover:text-rose-600 transition-colors p-1"
            title="Delete interview record"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
