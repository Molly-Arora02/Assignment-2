import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import CompanyLogo from '../../components/CompanyLogo';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit3,
  Building2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Users,
} from 'lucide-react';

const DriveManagement = () => {
  const [drives, setDrives] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    companyId: '',
    role: '',
    type: 'Placement',
    package: '12',
    packageLabel: '₹12.0 LPA CTC',
    location: 'Bangalore / Remote',
    minCGPA: '7.0',
    eligibleBranches: 'CSE, IT, AI/ML, ECE',
    maxBacklogs: '0',
    eligibleYears: '2026',
    deadline: '',
    description: '',
  });

  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [drivesRes, companiesRes] = await Promise.all([
        api.get('/drives'),
        api.get('/companies'),
      ]);
      if (drivesRes.data.success) setDrives(drivesRes.data.drives || []);
      if (companiesRes.data.success) {
        setCompanies(companiesRes.data.companies || []);
        if (companiesRes.data.companies?.length > 0) {
          setFormData((prev) => ({ ...prev, companyId: companiesRes.data.companies[0]._id }));
        }
      }
    } catch (e) {
      console.error('Error fetching drives:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCreateDrive = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);

    try {
      const branches = formData.eligibleBranches
        .split(',')
        .map((b) => b.trim().toUpperCase())
        .filter(Boolean);
      const years = formData.eligibleYears
        .split(',')
        .map((y) => Number(y.trim()))
        .filter(Boolean);

      const payload = {
        ...formData,
        package: Number(formData.package),
        minCGPA: Number(formData.minCGPA),
        maxBacklogs: Number(formData.maxBacklogs),
        eligibleBranches: branches,
        eligibleYears: years,
        deadline: formData.deadline || new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      };

      const { data } = await api.post('/drives', payload);
      if (data.success) {
        setFeedback({ success: true, message: 'Drive created and published successfully!' });
        setShowModal(false);
        await fetchData();
      }
    } catch (err) {
      setFeedback({ success: false, message: err.message || 'Failed to create drive.' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDrive = async (id) => {
    if (!window.confirm('Are you sure you want to remove this recruitment drive?')) return;

    try {
      const { data } = await api.delete(`/drives/${id}`);
      if (data.success) {
        setDrives(drives.filter((d) => d._id !== id));
      }
    } catch (e) {
      alert(e.message || 'Failed to delete drive');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Campus Recruitment Drives</h1>
          <p className="text-sm text-slate-600 mt-1">
            Create, publish, and manage company recruitment and internship opportunities.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Post New Recruitment Drive</span>
        </button>
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

      {/* Drives Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <div className="p-16 text-center text-slate-400 col-span-2">Loading drives...</div>
        ) : drives.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 col-span-2">
            <Briefcase className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <p className="font-bold text-slate-700">No drives created yet</p>
          </div>
        ) : (
          drives.map((drive) => (
            <div
              key={drive._id}
              className="p-6 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start space-x-3">
                    <CompanyLogo
                      name={drive.companyId?.name || 'Company'}
                      logo={drive.companyId?.logo}
                      size="md"
                    />
                    <div className="space-y-0.5">
                      <h3 className="font-black text-slate-900 text-base">{drive.role}</h3>
                      <p className="text-xs font-bold text-blue-700 flex items-center gap-1">
                        {drive.companyId?.name}
                      </p>
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                    {drive.type}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                  <p className="font-bold text-emerald-600">
                    {drive.packageLabel || `₹${drive.package} LPA`}
                  </p>
                  <p className="text-slate-500">
                    Min CGPA: <strong>{drive.minCGPA}</strong> | Backlogs: <strong>{drive.maxBacklogs}</strong>
                  </p>
                  <p className="text-slate-500">
                    Branches: <strong>{drive.eligibleBranches?.join(', ')}</strong>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> Deadline:{' '}
                  {new Date(drive.deadline).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleDeleteDrive(drive._id)}
                  className="p-2 text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Drive Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-black text-slate-900">Post New Recruitment Drive</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateDrive} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Select Recruiting Company
                </label>
                <select
                  name="companyId"
                  value={formData.companyId}
                  onChange={handleChange}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                  {companies.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Job / Role Title
                  </label>
                  <input
                    type="text"
                    required
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    placeholder="e.g. SDE-1 / Data Analyst"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Opportunity Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  >
                    <option value="Placement">Placement</option>
                    <option value="Internship">Internship</option>
                    <option value="Internship + PPO">Internship + PPO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Package Value (LPA / Stipend)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    name="package"
                    value={formData.package}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Display Label
                  </label>
                  <input
                    type="text"
                    name="packageLabel"
                    value={formData.packageLabel}
                    onChange={handleChange}
                    placeholder="e.g. ₹18.5 LPA CTC"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Eligibility Criteria Form */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <p className="text-xs font-extrabold uppercase text-slate-700 tracking-wider">
                  Eligibility Criteria Engine Config
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Minimum CGPA
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      name="minCGPA"
                      value={formData.minCGPA}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-600 mb-1">
                      Max Active Backlogs
                    </label>
                    <input
                      type="number"
                      name="maxBacklogs"
                      value={formData.maxBacklogs}
                      onChange={handleChange}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Eligible Branches (Comma separated)
                  </label>
                  <input
                    type="text"
                    name="eligibleBranches"
                    value={formData.eligibleBranches}
                    onChange={handleChange}
                    placeholder="CSE, IT, AI/ML, ECE"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-600 mb-1">
                    Application Deadline
                  </label>
                  <input
                    type="date"
                    name="deadline"
                    value={formData.deadline}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Job Description & Key Responsibilities
                </label>
                <textarea
                  rows={3}
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Outline the responsibilities, selection rounds, and perks..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2.5 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl shadow-md transition-all flex items-center gap-1.5"
                >
                  {saving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span>Publish Drive</span>
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

export default DriveManagement;
