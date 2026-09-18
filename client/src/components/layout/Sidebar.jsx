import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  CalendarCheck,
  FileText,
  PlusCircle,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Applications', path: '/applications', icon: Briefcase },
  { name: 'Interviews', path: '/interviews', icon: CalendarCheck },
  { name: 'My Resume', path: '/resume', icon: FileText },
];

export default function Sidebar({ onOpenNewApp }) {
  const location = useLocation();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-slate-200 bg-white shadow-xs">
      {/* Brand Header */}
      <div className="flex h-16 items-center gap-3 border-b border-slate-100 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white shadow-xs shadow-blue-500/30">
          <Briefcase className="h-5 w-5" />
        </div>
        <div>
          <span className="text-lg font-bold tracking-tight text-slate-900">JobTrack</span>
          <span className="ml-1.5 rounded-md bg-blue-50 px-1.5 py-0.5 text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
            Pro
          </span>
        </div>
      </div>

      {/* Quick Action */}
      <div className="px-4 pt-5 pb-2">
        <button
          onClick={onOpenNewApp}
          type="button"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 active:scale-[0.98] transition-all"
        >
          <PlusCircle className="h-4 w-4" />
          <span>New Application</span>
        </button>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all ${isActive
                  ? 'bg-blue-50/80 text-blue-700 font-semibold shadow-xs'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
            >
              <Icon
                className={`h-4 w-4 transition-colors ${isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'
                  }`}
              />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Resume Card Link */}
      <div className="p-4 border-t border-slate-100">
        <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-800">Resume</span>
            </div>
            <NavLink
              to="/resume"
              className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-0.5"
            >
              View <ExternalLink className="h-2.5 w-2.5" />
            </NavLink>
          </div>
          <p className="mt-1 text-[11px] text-slate-500 truncate">
            Google Drive synchronized
          </p>
        </div>
      </div>

      {/* User / Candidate Footer */}
      <div className="flex items-center gap-3 border-t border-slate-100 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-300">
          MB
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-semibold text-slate-900 truncate">Princi</span>
          <span className="text-xs text-slate-500 truncate">Software Engineer</span>
        </div>
      </div>
    </aside>
  );
}
