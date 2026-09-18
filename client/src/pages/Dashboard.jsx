import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase,
  CalendarCheck,
  Award,
  TrendingUp,
  ArrowRight,
  ExternalLink,
  Plus,
  Clock,
  Building,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { analyticsService, applicationService } from '../services/api';
import StatusBadge from '../components/common/StatusBadge';

export default function Dashboard({ onOpenNewApp }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [monthly, setMonthly] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashRes, monthRes] = await Promise.all([
        analyticsService.getDashboard(),
        analyticsService.getMonthly(),
      ]);
      setStats(dashRes.data);
      setMonthly(monthRes.data || []);
      setError(null);
    } catch (err) {
      console.error('Dashboard load error:', err);
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
          <p className="text-xs font-medium text-slate-500">Loading JobTrack analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50/60 p-6 text-center">
        <p className="text-sm font-semibold text-rose-700">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="mt-3 rounded-lg bg-rose-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const breakdown = stats?.statusBreakdown || {};
  const totalApps = stats?.totalApplications || 0;
  const interviewingCount = breakdown.INTERVIEW || 0;
  const offerCount = breakdown.OFFER || 0;
  const appliedCount = breakdown.APPLIED || 0;

  const statCards = [
    {
      title: 'Total Applications',
      value: totalApps,
      subtitle: `${appliedCount} actively awaiting response`,
      icon: Briefcase,
      color: 'bg-blue-50 text-blue-600 border-blue-200',
      badge: '+ Active Pipeline',
    },
    {
      title: 'Interviewing',
      value: interviewingCount,
      subtitle: `${stats?.pendingInterviews || 0} scheduled rounds`,
      icon: CalendarCheck,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
      badge: 'High Focus',
    },
    {
      title: 'Offers Secured',
      value: offerCount,
      subtitle: offerCount > 0 ? 'Reviewing compensation' : 'Keep pushing forward',
      icon: Award,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      badge: offerCount > 0 ? '🎉 Milestone' : 'Target: 1+',
    },
    {
      title: 'Interview Conversion',
      value: totalApps > 0 ? `${Math.round(((interviewingCount + offerCount) / totalApps) * 100)}%` : '0%',
      subtitle: 'Applications reaching interviews',
      icon: TrendingUp,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      badge: 'Metric',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="rounded-2xl border border-slate-200/80 bg-gradient-to-r from-white via-slate-50 to-blue-50/30 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-slate-900">
              Welcome back, Princi 👋
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              You have <span className="font-semibold text-amber-700">{interviewingCount} jobs in interview rounds</span> and{' '}
              <span className="font-semibold text-emerald-700">{offerCount} active offer</span>.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/applications')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <span>View Pipeline</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={onOpenNewApp}
              className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Track New Job</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className="group relative rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  {card.title}
                </span>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-xl border ${card.color}`}
                >
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-3xl font-extrabold tracking-tight text-slate-900">
                  {card.value}
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold text-slate-600">
                  {card.badge}
                </span>
              </div>

              <p className="mt-1 text-xs text-slate-500 truncate">{card.subtitle}</p>
            </div>
          );
        })}
      </div>

      {/* Charts & Status Breakdown Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Monthly Trend Chart */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Monthly Application Volume</h3>
              <p className="text-xs text-slate-500">Applications submitted per month</p>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 border border-blue-100">
              2026 Trend
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthly} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" stroke="#94a3b8" fontSize={12} tickLine={false} />
                <YAxis allowDecimals={false} stroke="#94a3b8" fontSize={12} tickLine={false} />
                <Tooltip
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#e2e8f0',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    fontSize: '12px',
                  }}
                />
                <Bar
                  dataKey="applications"
                  name="Applications"
                  fill="#3b82f6"
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pipeline Distribution */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Pipeline Breakdown</h3>
            <p className="text-xs text-slate-500">Current candidate status across all roles</p>

            <div className="mt-5 space-y-3.5">
              {[
                { key: 'OFFER', label: 'Offers Received', color: 'bg-emerald-500', barBg: 'bg-emerald-100' },
                { key: 'INTERVIEW', label: 'In Interviews', color: 'bg-amber-500', barBg: 'bg-amber-100' },
                { key: 'APPLIED', label: 'Applied / In Review', color: 'bg-sky-500', barBg: 'bg-sky-100' },
                { key: 'SAVED', label: 'Wishlist / Saved', color: 'bg-slate-400', barBg: 'bg-slate-100' },
                { key: 'REJECTED', label: 'Rejected', color: 'bg-rose-500', barBg: 'bg-rose-100' },
              ].map((stage) => {
                const count = breakdown[stage.key] || 0;
                const pct = totalApps > 0 ? Math.round((count / totalApps) * 100) : 0;
                return (
                  <div key={stage.key}>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-medium text-slate-700">{stage.label}</span>
                      <span className="font-semibold text-slate-900">
                        {count} ({pct}%)
                      </span>
                    </div>
                    <div className={`h-2 w-full rounded-full ${stage.barBg} overflow-hidden`}>
                      <div
                        className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-4">
            <button
              onClick={() => navigate('/applications')}
              className="w-full text-center text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              Open Interactive Board →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Upcoming Interviews & Recent Applications */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming Interviews */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CalendarCheck className="h-4 w-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Interviews</h3>
            </div>
            <button
              onClick={() => navigate('/interviews')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              View All ({stats?.upcomingInterviews?.length || 0})
            </button>
          </div>

          <div className="space-y-3">
            {stats?.upcomingInterviews?.length === 0 ? (
              <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">
                No pending interviews scheduled right now.
              </div>
            ) : (
              stats?.upcomingInterviews?.map((iv) => {
                const dateFormatted = new Date(iv.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                });
                return (
                  <div
                    key={iv._id}
                    className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/60 p-3.5 hover:bg-slate-50 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-slate-900 text-sm">
                          {iv.applicationId?.company || 'Company'}
                        </span>
                        <span className="rounded-md bg-amber-100 px-1.5 py-0.5 text-[10px] font-semibold text-amber-800">
                          {iv.round}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-slate-400" />
                          {dateFormatted} {iv.time && `• ${iv.time}`}
                        </span>
                        {iv.interviewer && <span>• {iv.interviewer}</span>}
                      </div>
                    </div>

                    {iv.meetingLink ? (
                      <a
                        href={iv.meetingLink}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 transition-colors"
                      >
                        <span>Join</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-slate-400 font-medium">Link pending</span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Recent Applications */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-blue-500" />
              <h3 className="text-sm font-bold text-slate-900">Recent Applications</h3>
            </div>
            <button
              onClick={() => navigate('/applications')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700"
            >
              See All Jobs
            </button>
          </div>

          <div className="space-y-3">
            {stats?.recentApplications?.map((app) => (
              <div
                key={app._id}
                onClick={() => navigate(`/applications/${app._id}`)}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 hover:border-slate-300 hover:shadow-2xs transition-all cursor-pointer"
              >
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-semibold text-slate-900 truncate">{app.company}</h4>
                  <p className="text-xs text-slate-500 truncate">{app.jobTitle}</p>
                </div>

                <div className="flex items-center gap-3">
                  <StatusBadge status={app.status} size="xs" />
                  <ArrowRight className="h-4 w-4 text-slate-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
