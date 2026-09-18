import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MapPin,
  DollarSign,
  Calendar,
  ExternalLink,
  MoreVertical,
  ChevronRight,
  User,
} from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

export default function ApplicationCard({
  application,
  onStatusChange,
  onEdit,
  onDelete,
  isDraggable = false,
  onDragStart,
}) {
  const navigate = useNavigate();

  const formatSalary = (min, max) => {
    if (!min && !max) return null;
    const formatNum = (num) => {
      if (num >= 1000) return `$${Math.round(num / 1000)}k`;
      return `$${num}`;
    };
    if (min && max) return `${formatNum(min)} - ${formatNum(max)}`;
    if (min) return `From ${formatNum(min)}`;
    return `Up to ${formatNum(max)}`;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const salaryDisplay = formatSalary(application.salaryMin, application.salaryMax);

  return (
    <div
      draggable={isDraggable}
      onDragStart={(e) => onDragStart && onDragStart(e, application._id)}
      onClick={() => navigate(`/applications/${application._id}`)}
      className="group relative cursor-pointer rounded-xl border border-slate-200/80 bg-white p-4 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
    >
      {/* Top row: Company & Status */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h4 className="font-semibold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
              {application.company}
            </h4>
            {application.jobUrl && (
              <a
                href={application.jobUrl}
                target="_blank"
                rel="noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-slate-400 hover:text-blue-600 transition-colors"
                title="Open job posting"
              >
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            )}
          </div>
          <p className="text-xs font-medium text-slate-600 mt-0.5 truncate">
            {application.jobTitle}
          </p>
        </div>

        <StatusBadge status={application.status} size="xs" />
      </div>

      {/* Badges / Metadata */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
        {application.workMode && (
          <StatusBadge status={application.workMode} size="xs" showDot={false} />
        )}
        {application.location && (
          <span className="flex items-center gap-1 rounded-md bg-slate-50 px-2 py-0.5 text-slate-600 border border-slate-100">
            <MapPin className="h-3 w-3 text-slate-400" />
            <span className="truncate max-w-[120px]">{application.location}</span>
          </span>
        )}
        {salaryDisplay && (
          <span className="flex items-center gap-0.5 rounded-md bg-emerald-50 px-2 py-0.5 text-emerald-700 border border-emerald-100 font-medium">
            <DollarSign className="h-3 w-3 text-emerald-500" />
            <span>{salaryDisplay}</span>
          </span>
        )}
      </div>

      {/* Footer info: Date applied & Recruiter */}
      <div className="mt-3.5 flex items-center justify-between border-t border-slate-100 pt-2.5 text-[11px] text-slate-400">
        <div className="flex items-center gap-1">
          <Calendar className="h-3 w-3 text-slate-400" />
          <span>{formatDate(application.applicationDate)}</span>
        </div>

        {application.recruiter?.name ? (
          <div className="flex items-center gap-1 text-slate-600 font-medium truncate max-w-[130px]">
            <User className="h-3 w-3 text-slate-400" />
            <span className="truncate">{application.recruiter.name}</span>
          </div>
        ) : (
          <span className="text-slate-400">{application.source || 'Direct'}</span>
        )}
      </div>
    </div>
  );
}
