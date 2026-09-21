import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CompanyLogo from '../../components/CompanyLogo';
import {
  Briefcase,
  Users,
  CheckCircle2,
  TrendingUp,
  Plus,
  ArrowRight,
  Building2,
  Calendar,
  Mail,
  LifeBuoy,
  ShieldCheck,
} from 'lucide-react';

const RecruiterDashboard = ({ onOpenHelp }) => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecruiterData = async () => {
      try {
        const { data } = await api.get('/drives');
        if (data.success) {
          setDrives(data.drives || []);
        }
      } catch (e) {
        console.error('Failed to load recruiter drives:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchRecruiterData();
  }, []);

  const companyName = user?.company?.name || 'Google India';

  return (
    <div className="space-y-6">
      {/* Header Banner with Company Logo */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start space-x-4">
          <CompanyLogo name={companyName} size="xl" className="bg-white/10 border-white/20" />
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
              <Building2 className="w-3.5 h-3.5" />
              <span>Verified Corporate Hiring Partner Portal</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {companyName} Recruitment Desk
            </h1>
            <p className="text-slate-300 text-sm max-w-xl">
              Manage your company recruitment drives, review eligible candidate applications, and progress talent through hiring stages.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 self-start md:self-auto">
          <button
            onClick={onOpenHelp}
            className="px-4 py-2.5 text-xs font-bold text-slate-200 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl transition-all flex items-center gap-1.5"
          >
            <LifeBuoy className="w-4 h-4 text-emerald-400" />
            <span>TPO Coordination Desk</span>
          </button>
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Active Drives
            </p>
            <h3 className="text-2xl font-black text-slate-900 mt-1">{drives.length}</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">Published for students</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Briefcase className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Assigned Recruiter
            </p>
            <h3 className="text-base font-black text-slate-900 mt-1 truncate">
              {user?.name || 'Recruiter Lead'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">{user?.email}</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
            <Mail className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Campus Policy Status
            </p>
            <h3 className="text-base font-black text-emerald-600 mt-1">1-Offer Rule Active</h3>
            <p className="text-[11px] text-slate-400 mt-0.5">No offer hoarding permitted</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Drives Management Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Your Company Recruitment Drives</h2>
            <p className="text-xs text-slate-500">
              Applicants are automatically screened against your drive criteria before submission
            </p>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
            <span>Loading company drives...</span>
          </div>
        ) : drives.length === 0 ? (
          <div className="p-10 text-center bg-white rounded-2xl border border-slate-200 text-slate-500">
            <p className="font-bold text-slate-700">No drives posted yet</p>
            <p className="text-xs text-slate-400 mt-1">Contact TPO desk to coordinate a new campus drive.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drives.map((drive) => (
              <div
                key={drive._id}
                className="p-6 bg-white rounded-2xl border border-slate-200 hover:border-emerald-300 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <CompanyLogo name={companyName} size="md" />
                      <div>
                        <h3 className="font-extrabold text-slate-900 text-base">{drive.role}</h3>
                        <span className="text-xs font-bold text-emerald-600">
                          {drive.packageLabel || `₹${drive.package} LPA`}
                        </span>
                      </div>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {drive.type}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Eligibility Cutoff:</span>
                      <span className="font-semibold text-slate-800">
                        CGPA &ge; {drive.minCGPA} • Max Backlogs: {drive.maxBacklogs}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Target Branches:</span>
                      <span className="font-semibold text-slate-800">
                        {drive.eligibleBranches?.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Deadline: {new Date(drive.deadline).toLocaleDateString()}
                  </span>

                  <Link
                    to={`/recruiter/drives/${drive._id}/applicants`}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Manage Applicants & Pipeline</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;
