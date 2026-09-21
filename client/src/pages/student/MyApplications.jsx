import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StatusTimeline from '../../components/StatusTimeline';
import CompanyLogo from '../../components/CompanyLogo';
import {
  FileText,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Award,
  Mail,
  LifeBuoy,
  Copy,
  Check,
  ShieldCheck,
} from 'lucide-react';

const MyApplications = ({ onOpenHelp }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await api.get('/applications/me');
        if (data.success) {
          setApplications(data.applications || []);
        }
      } catch (e) {
        console.error('Failed to fetch applications:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">My Applications & Status Pipeline</h1>
          <p className="text-sm text-slate-600 mt-1">
            Track the recruitment lifecycle for every drive, view reviewer audit notes, and reach out to company HR desks.
          </p>
        </div>
        <button
          onClick={onOpenHelp}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-xs w-fit"
        >
          <LifeBuoy className="w-4 h-4 text-blue-600" />
          <span>Grievance & HR Help Desk</span>
        </button>
      </div>

      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Loading your applications & audit logs...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <FileText className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-700">No applications submitted yet</h3>
          <p className="text-xs text-slate-400">
            Browse through active placement and internship drives to submit applications.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {applications.map((app) => {
            const drive = app.driveId;
            const company = app.companyId || drive?.companyId || {};
            const helpEmail =
              drive?.helpEmail || company?.helpEmail || 'careers@' + (company?.domain || 'company.com');

            return (
              <div
                key={app._id}
                className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6"
              >
                {/* Header Information with Company Logo */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                  <div className="flex items-start space-x-4">
                    <CompanyLogo
                      name={company?.name || 'Company'}
                      logo={company?.logo}
                      size="lg"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h2 className="text-xl font-black text-slate-900">
                          {drive?.role || 'Recruitment Drive'}
                        </h2>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {drive?.type}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="font-bold text-blue-700">{company?.name}</span>
                        <span>•</span>
                        <span className="font-bold text-emerald-600">
                          {drive?.packageLabel || `₹${drive?.package} LPA`}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" /> Applied on:{' '}
                          {new Date(app.appliedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold uppercase tracking-wider ${
                        app.status === 'Selected'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-xs'
                          : app.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {app.status}
                    </span>
                  </div>
                </div>

                {/* Interactive Status Timeline */}
                <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200">
                  <StatusTimeline
                    currentStatus={app.status}
                    statusHistory={app.statusHistory || []}
                  />
                </div>

                {/* Recruiter Support Card for queries & interview schedule clashes */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-blue-50/60 border border-blue-100 px-4 py-3 rounded-2xl text-xs text-slate-700 gap-3">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    <div>
                      <span className="font-semibold text-slate-900">
                        Need query support regarding this round?
                      </span>
                      <span className="text-slate-500 block text-[11px]">
                        Contact {company?.name} Talent Team for assessment link issues or interview rescheduling
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <a
                      href={`mailto:${helpEmail}?subject=%5BInterview%20Query%5D%20Application%20for%20${encodeURIComponent(
                        drive?.role || ''
                      )}`}
                      className="px-3 py-1.5 bg-white hover:bg-blue-50 text-blue-700 font-bold border border-blue-200 rounded-lg shadow-xs flex items-center space-x-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>Email HR ({helpEmail})</span>
                    </a>
                    <button
                      onClick={() => handleCopyEmail(helpEmail)}
                      className="p-1.5 bg-white hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg"
                      title="Copy Email"
                    >
                      {copiedEmail === helpEmail ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
