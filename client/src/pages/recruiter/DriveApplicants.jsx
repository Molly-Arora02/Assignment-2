import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import {
  Users,
  ArrowLeft,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Filter,
  Search,
  Building2,
  AlertCircle,
  Award,
} from 'lucide-react';

const DriveApplicants = () => {
  const { driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Status Update State
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('Shortlisted');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const { data } = await api.get(`/applications/drive/${driveId}`, { params });
      if (data.success) {
        setDrive(data.drive);
        setApplications(data.applications || []);
      }
    } catch (e) {
      console.error('Failed to load drive applicants:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplicants();
  }, [driveId, statusFilter]);

  const handleStatusUpdate = async (e) => {
    e.preventDefault();
    if (!selectedApp) return;

    setUpdating(true);
    setFeedback(null);

    try {
      const { data } = await api.patch(`/applications/${selectedApp._id}/status`, {
        status: newStatus,
        notes,
      });

      if (data.success) {
        setFeedback({
          success: true,
          message: `Candidate status updated to '${newStatus}' successfully!`,
        });
        await fetchApplicants();
        setSelectedApp(null);
        setNotes('');
      }
    } catch (err) {
      setFeedback({
        success: false,
        message: err.message || 'Failed to update candidate status',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/recruiter/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-black text-slate-900">
            {drive ? `${drive.role} — Candidate Pipeline` : 'Candidate Review'}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Evaluate applicants, inspect verified academic credentials, and advance candidates
            through interview stages.
          </p>
        </div>

        {drive && (
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-xl text-xs font-bold text-emerald-800 self-start sm:self-auto">
            Package: {drive.packageLabel || `₹${drive.package} LPA`} | Min CGPA: {drive.minCGPA}
          </div>
        )}
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 ${
            feedback.success
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.success ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchApplicants()}
            placeholder="Search candidate name, email, or roll number..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3.5 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="">All Pipeline Stages</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interviewed">Interviewed</option>
          <option value="Selected">Selected (Offer)</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-slate-400">Loading candidate list...</div>
        ) : applications.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <Users className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No applicants found for this criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-3.5">Candidate Details</th>
                  <th className="px-6 py-3.5">Branch & Batch</th>
                  <th className="px-6 py-3.5">CGPA / Backlogs</th>
                  <th className="px-6 py-3.5">Resume</th>
                  <th className="px-6 py-3.5">Current Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {applications.map((app) => {
                  const student = app.studentId;
                  const profile = app.studentProfileId || app.applicantSnapshot;

                  return (
                    <tr key={app._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="space-y-0.5">
                          <p className="font-bold text-slate-900 text-sm">{student?.name}</p>
                          <p className="text-slate-500 text-[11px]">{student?.email}</p>
                          <p className="text-[10px] text-slate-400">
                            Roll: {profile?.rollNumber || 'N/A'}
                          </p>
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-bold text-slate-800">{profile?.branch || 'N/A'}</span>
                        <p className="text-[10px] text-slate-400">Batch {profile?.graduationYear}</p>
                      </td>

                      <td className="px-6 py-4">
                        <span className="font-black text-emerald-700 text-sm">{profile?.CGPA}</span>
                        <p className="text-[10px] text-slate-400">
                          {profile?.activeBacklogs === 0 ? (
                            <span className="text-emerald-600 font-semibold">0 Backlogs</span>
                          ) : (
                            <span className="text-rose-600 font-semibold">
                              {profile?.activeBacklogs} Backlogs
                            </span>
                          )}
                        </p>
                      </td>

                      <td className="px-6 py-4">
                        {profile?.resumeUrl ? (
                          <a
                            href={profile.resumeUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-bold text-[11px] border border-blue-200 transition-colors"
                          >
                            <span>Resume</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">No link</span>
                        )}
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            app.status === 'Selected'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : app.status === 'Rejected'
                              ? 'bg-rose-100 text-rose-800 border border-rose-300'
                              : app.status === 'Interviewed'
                              ? 'bg-purple-100 text-purple-800 border border-purple-300'
                              : app.status === 'Shortlisted'
                              ? 'bg-blue-100 text-blue-800 border border-blue-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {app.status}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => {
                            setSelectedApp(app);
                            setNewStatus(app.status);
                            setNotes('');
                          }}
                          className="px-3 py-1.5 bg-slate-900 hover:bg-brand-600 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
                        >
                          Update Status
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Status Update Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5">
            <h3 className="text-lg font-black text-slate-900">
              Update Candidate Recruitment Stage
            </h3>

            <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
              <p className="font-bold text-slate-800">{selectedApp.studentId?.name}</p>
              <p className="text-slate-500">
                {selectedApp.studentProfileId?.branch} | CGPA: {selectedApp.studentProfileId?.CGPA}
              </p>
            </div>

            <form onSubmit={handleStatusUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  <option value="Applied">Applied (Reset)</option>
                  <option value="Shortlisted">Shortlisted</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Selected">Selected (Extend Placement Offer)</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Evaluation Remarks / Feedback Notes
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Cleared technical interview round with high scores in DSA & System Design."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {updating ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Confirm Update</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveApplicants;
