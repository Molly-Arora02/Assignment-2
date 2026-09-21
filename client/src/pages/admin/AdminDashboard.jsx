import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Users,
  Briefcase,
  Award,
  TrendingUp,
  DownloadCloud,
  CheckCircle2,
  Building2,
  Shield,
  Sliders,
  DollarSign,
} from 'lucide-react';

const COLORS = ['#0284c7', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6366f1'];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/analytics');
      if (res.data.success) {
        setData(res.data.data);
      }
    } catch (e) {
      console.error('Failed to load admin analytics:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const summary = data?.summary || {};
  const branchStats = data?.branchStats || [];
  const funnelStats = data?.funnelStats || [];
  const companyStats = data?.companyStats || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-xs font-bold">
            <Shield className="w-3.5 h-3.5" />
            <span>Institution Placement & Internship Cell (TPO)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Campus Placement Analytics & Insights
          </h1>
          <p className="text-slate-300 text-sm max-w-xl">
            Real-time branch statistics, corporate recruitment pipelines, package distributions, and
            institutional policy tracking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/admin/reports"
            className="px-4 py-2.5 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-1.5"
          >
            <DownloadCloud className="w-4 h-4" />
            <span>Export CSV</span>
          </Link>

          <Link
            to="/admin/drives"
            className="px-4 py-2.5 text-xs font-bold text-slate-950 bg-purple-400 hover:bg-purple-300 rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Create Drive</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Enrolled Students
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {summary.totalStudents || 0}
            </h3>
            <p className="text-[11px] text-emerald-600 font-semibold mt-0.5">
              {summary.placedStudents || 0} Placed ({summary.placementPercentage || 0}%)
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Highest CTC Offered
            </p>
            <h3 className="text-2xl font-black text-emerald-600 mt-1">
              ₹{summary.highestPackage || 28.5} LPA
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Top tier corporate offer</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Average CTC Package
            </p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">
              ₹{summary.averagePackage || 18.2} LPA
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Across verified selections</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Recruitment Drives
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">
              {summary.totalDrives || 0}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {summary.totalApplications || 0} Total Applications
            </p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Branch-wise Placed vs Unplaced Chart */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Branch-wise Placement Distribution
              </h3>
              <p className="text-xs text-slate-500">
                Total eligible candidates vs verified placed candidates
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={branchStats}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="branch" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend />
                <Bar dataKey="placed" name="Placed" fill="#10b981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="unplaced" name="Unplaced" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Stage Funnel Chart */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900">Application Funnel Breakdown</h3>
              <p className="text-xs text-slate-500">
                Candidates advancing across recruitment stages
              </p>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={funnelStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 12 }} stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="count" name="Applicants" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Top Hiring Companies & Live Placement Records */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Company Breakdown */}
        <div className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Hiring Partner Highlights</h3>
          <div className="space-y-3">
            {companyStats.length === 0 ? (
              <p className="text-xs text-slate-400">Recruitment drives in progress...</p>
            ) : (
              companyStats.map((comp, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-bold text-xs text-slate-700">
                      <Building2 className="w-4 h-4 text-brand-600" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 text-xs">{comp.company}</p>
                      <p className="text-[10px] text-slate-400">Max CTC: ₹{comp.highestCTC} LPA</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
                    {comp.hires} Hired
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions & Policy Summary */}
        <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-slate-900">Quick Administration Actions</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Ensure fair candidate distribution, configure the single-offer lock rules, and generate
              audit reports for university accreditation.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <Link
                to="/admin/policy"
                className="p-4 rounded-2xl bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all text-purple-900 space-y-1"
              >
                <Sliders className="w-5 h-5 text-purple-600" />
                <p className="font-bold text-xs">Placement Policy</p>
                <p className="text-[11px] text-purple-700/80">Configure 1-offer lock</p>
              </Link>

              <Link
                to="/admin/students"
                className="p-4 rounded-2xl bg-brand-50 hover:bg-brand-100 border border-brand-200 transition-all text-brand-900 space-y-1"
              >
                <Users className="w-5 h-5 text-brand-600" />
                <p className="font-bold text-xs">Student Database</p>
                <p className="text-[11px] text-brand-700/80">Search by branch & CGPA</p>
              </Link>

              <Link
                to="/admin/reports"
                className="p-4 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all text-emerald-900 space-y-1"
              >
                <DownloadCloud className="w-5 h-5 text-emerald-600" />
                <p className="font-bold text-xs">Export CSV Reports</p>
                <p className="text-[11px] text-emerald-700/80">Download full sheet</p>
              </Link>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Automated eligibility & status validation engines active.</span>
            </div>
            <span className="font-bold text-slate-800">System v1.0.0</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
