import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CompanyLogo from '../../components/CompanyLogo';
import {
  Briefcase,
  FileText,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  Award,
  Building2,
  Calendar,
  LifeBuoy,
  Mail,
  ShieldCheck,
} from 'lucide-react';

const StudentDashboard = ({ onOpenHelp }) => {
  const { user, profile } = useAuth();
  const [drives, setDrives] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [drivesRes, appsRes] = await Promise.all([
          api.get('/drives'),
          api.get('/applications/me'),
        ]);
        if (drivesRes.data.success) setDrives(drivesRes.data.drives || []);
        if (appsRes.data.success) setApplications(appsRes.data.applications || []);
      } catch (e) {
        console.error('Failed to load student dashboard data:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const eligibleDrivesCount = drives.filter((d) => d.isEligible && !d.hasApplied).length;
  const appliedCount = applications.length;
  const shortlistedCount = applications.filter((a) =>
    ['Shortlisted', 'Interviewed', 'Selected'].includes(a.status)
  ).length;
  const placedApp = applications.find((a) => a.status === 'Selected');

  return (
    <div className="space-y-6">
      {/* Welcome & Profile Summary Card */}
      <div className="relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-0" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Placement Season 2025-2026 Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Branch: <span className="text-white font-bold">{profile?.branch || 'CSE'}</span> | Roll No:{' '}
              <span className="text-white font-bold">{profile?.rollNumber || 'N/A'}</span> | CGPA:{' '}
              <span className="text-emerald-400 font-bold">{profile?.CGPA || '0.0'}</span> | Active Backlogs:{' '}
              <span className="text-white font-bold">{profile?.activeBacklogs ?? 0}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenHelp}
              className="px-3.5 py-2 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-1.5"
            >
              <LifeBuoy className="w-3.5 h-3.5 text-blue-400" />
              <span>TPO Helpdesk</span>
            </button>
            <Link
              to="/student/profile"
              className="px-4 py-2 text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all"
            >
              Edit Profile
            </Link>
            <Link
              to="/student/drives"
              className="px-4 py-2 text-xs font-bold text-slate-950 bg-blue-400 hover:bg-blue-300 rounded-xl shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Explore Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Placement Offer Banner (If Placed) */}
      {placedApp && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-600 text-white shadow-lg flex items-center justify-between flex-wrap gap-4 animate-in fade-in">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <Award className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-100">
                🎉 Congratulations! Verified Placement Offer
              </p>
              <h3 className="text-lg font-black">
                Selected at {placedApp.companyId?.name} ({placedApp.driveId?.role})
              </h3>
              <p className="text-xs text-emerald-100">
                Package:{' '}
                <strong>
                  {placedApp.driveId?.packageLabel || `₹${placedApp.driveId?.package} LPA`}
                </strong>{' '}
                • Institutional 1-offer policy is actively protecting fair opportunity allocation.
              </p>
            </div>
          </div>
          <Link
            to="/student/applications"
            className="px-4 py-2 rounded-xl bg-white text-emerald-800 text-xs font-bold shadow-md hover:bg-emerald-50 transition-colors"
          >
            View Offer Details
          </Link>
        </div>
      )}

      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Eligible Open Drives
            </p>
            <h3 className="text-2xl font-black text-blue-600 mt-1">{eligibleDrivesCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Ready for 1-click apply</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Applications Sent
            </p>
            <h3 className="text-2xl font-black text-slate-800 mt-1">{appliedCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Tracked in pipeline</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Shortlisted / Progress
            </p>
            <h3 className="text-2xl font-black text-purple-600 mt-1">{shortlistedCount}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">In advanced stages</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Placement Status
            </p>
            <h3
              className={`text-xl font-black mt-1 ${
                profile?.isPlaced ? 'text-emerald-600' : 'text-amber-600'
              }`}
            >
              {profile?.isPlaced ? 'Placed 🏆' : 'In Progress ⏳'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {profile?.isPlaced ? `${profile.placedPackage} LPA Package` : 'Drive participation active'}
            </p>
          </div>
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center ${
              profile?.isPlaced ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
            }`}
          >
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Two Column Layout: Recommended Eligible Drives & Recent Application Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Top Eligible Drives */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Recommended Opportunities</h2>
              <p className="text-xs text-slate-500">
                Matched automatically by CGPA, branch, and backlog criteria
              </p>
            </div>
            <Link
              to="/student/drives"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>View All Drives</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">Loading live drives...</div>
          ) : drives.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-sm">
              No active recruitment drives at this time.
            </div>
          ) : (
            <div className="space-y-3">
              {drives.slice(0, 4).map((drive) => {
                const company = drive.companyId || {};
                const helpEmail = drive.helpEmail || company.helpEmail;

                return (
                  <div
                    key={drive._id}
                    className="p-5 bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start space-x-3.5">
                      <CompanyLogo name={company.name} logo={company.logo} size="md" />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{drive.role}</span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                            {drive.type}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="font-semibold text-slate-700">
                            {company.name}
                          </span>
                          <span>•</span>
                          <span className="font-bold text-emerald-600">
                            {drive.packageLabel || `₹${drive.package} LPA`}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" /> Deadline:{' '}
                            {new Date(drive.deadline).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {drive.hasApplied ? (
                        <span className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                          Applied ({drive.applicationStatus})
                        </span>
                      ) : drive.isEligible ? (
                        <Link
                          to="/student/drives"
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                        >
                          Apply Now
                        </Link>
                      ) : (
                        <span className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-semibold border border-rose-200">
                          Ineligible
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Application Status Tracker & TPO Contact */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900">Application Pipeline</h2>
            <Link
              to="/student/applications"
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              View History
            </Link>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            {applications.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-6">
                You haven't applied to any drives yet. Browse open drives to apply!
              </p>
            ) : (
              applications.slice(0, 4).map((app) => (
                <div
                  key={app._id}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3"
                >
                  <div className="flex items-center space-x-2.5">
                    <CompanyLogo name={app.companyId?.name} logo={app.companyId?.logo} size="xs" />
                    <div>
                      <p className="text-xs font-bold text-slate-900">{app.driveId?.role}</p>
                      <p className="text-[11px] text-slate-500">{app.companyId?.name}</p>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                      app.status === 'Selected'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Rejected'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Quick Grievance & Help Desk widget */}
          <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl space-y-2 text-xs">
            <div className="flex items-center space-x-2 text-blue-900 font-bold">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span>TPO Student Helpdesk</span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Have questions regarding test links, eligibility recalculation, or interview clashes?
            </p>
            <button
              onClick={onOpenHelp}
              className="w-full py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg text-xs transition-colors text-center"
            >
              Contact Placement Cell
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
