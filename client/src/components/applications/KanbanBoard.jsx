import React, { useState } from 'react';
import ApplicationCard from './ApplicationCard';
import { Plus } from 'lucide-react';

const COLUMNS = [
  { id: 'SAVED', title: 'Saved', color: 'border-slate-300 text-slate-700 bg-slate-100', dot: 'bg-slate-400' },
  { id: 'APPLIED', title: 'Applied', color: 'border-sky-300 text-sky-800 bg-sky-100', dot: 'bg-sky-500' },
  { id: 'INTERVIEW', title: 'Interviewing', color: 'border-amber-300 text-amber-850 bg-amber-100', dot: 'bg-amber-500' },
  { id: 'OFFER', title: 'Offers', color: 'border-emerald-300 text-emerald-800 bg-emerald-100', dot: 'bg-emerald-500' },
  { id: 'REJECTED', title: 'Rejected', color: 'border-rose-300 text-rose-800 bg-rose-100', dot: 'bg-rose-500' },
  { id: 'WITHDRAWN', title: 'Withdrawn', color: 'border-slate-300 text-slate-600 bg-slate-100', dot: 'bg-slate-400' },
];

export default function KanbanBoard({
  applications = [],
  onStatusChange,
  onOpenNewApp,
}) {
  const [activeDragId, setActiveDragId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const handleDragStart = (e, appId) => {
    setActiveDragId(appId);
    e.dataTransfer.setData('text/plain', appId);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    if (dragOverColumn !== columnId) {
      setDragOverColumn(columnId);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const appId = e.dataTransfer.getData('text/plain') || activeDragId;
    if (appId) {
      onStatusChange(appId, targetStatus);
    }
    setActiveDragId(null);
  };

  return (
    <div className="flex gap-5 overflow-x-auto pb-6 pt-2 select-none min-h-[calc(100vh-230px)]">
      {COLUMNS.map((col) => {
        const columnApps = applications.filter((app) => app.status === col.id);
        const isTarget = dragOverColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.id)}
            className={`flex w-80 shrink-0 flex-col rounded-2xl border transition-all duration-150 ${
              isTarget
                ? 'border-blue-400 bg-blue-50/40 ring-2 ring-blue-500/20'
                : 'border-slate-200/70 bg-slate-100/60'
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between p-3.5 border-b border-slate-200/60">
              <div className="flex items-center gap-2">
                <span className={`h-2.5 w-2.5 rounded-full ${col.dot}`} />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  {col.title}
                </h3>
                <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${col.color}`}>
                  {columnApps.length}
                </span>
              </div>

              <button
                onClick={() => onOpenNewApp && onOpenNewApp(col.id)}
                type="button"
                className="rounded-lg p-1 text-slate-400 hover:bg-white hover:text-slate-700 transition-colors"
                title={`Add application in ${col.title}`}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            {/* Cards List */}
            <div className="flex-1 space-y-3 p-3 overflow-y-auto max-h-[calc(100vh-290px)]">
              {columnApps.length === 0 ? (
                <div className="flex h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 p-4 text-center">
                  <p className="text-xs text-slate-400">No applications</p>
                  <button
                    onClick={() => onOpenNewApp && onOpenNewApp(col.id)}
                    className="mt-1 text-[11px] font-medium text-blue-600 hover:text-blue-700"
                  >
                    + Add one
                  </button>
                </div>
              ) : (
                columnApps.map((app) => (
                  <ApplicationCard
                    key={app._id}
                    application={app}
                    isDraggable={true}
                    onDragStart={handleDragStart}
                  />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
