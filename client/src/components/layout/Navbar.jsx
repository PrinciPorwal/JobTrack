import React from 'react';
import { Database, Plus } from 'lucide-react';

export default function Navbar({ title, subtitle, onOpenNewApp }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur-md">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {/* DB Connection Pill */}
        <div className="hidden sm:flex items-center gap-2 rounded-full border border-emerald-200/80 bg-emerald-50/70 px-3 py-1 text-xs font-medium text-emerald-800 shadow-2xs">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <Database className="h-3.5 w-3.5 text-emerald-600" />
          <span>MongoDB Atlas Connected</span>
        </div>

        {/* Quick Add CTA */}
        <button
          onClick={onOpenNewApp}
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Add Application</span>
        </button>
      </div>
    </header>
  );
}
