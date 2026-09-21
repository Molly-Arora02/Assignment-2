import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  User,
  GraduationCap,
  Award,
  Link as LinkIcon,
  CheckCircle2,
  AlertCircle,
  Save,
  Phone,
  Layers,
  FileCheck,
} from 'lucide-react';

const StudentProfile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    rollNumber: '',
    branch: 'CSE',
    CGPA: '7.5',
    graduationYear: '2026',
    activeBacklogs: '0',
    resumeUrl: '',
    phone: '',
    skills: '',
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: user?.name || '',
        rollNumber: profile.rollNumber || '',
        branch: profile.branch || 'CSE',
        CGPA: profile.CGPA !== undefined ? String(profile.CGPA) : '7.5',
        graduationYear: profile.graduationYear ? String(profile.graduationYear) : '2026',
        activeBacklogs: profile.activeBacklogs !== undefined ? String(profile.activeBacklogs) : '0',
        resumeUrl: profile.resumeUrl || '',
        phone: profile.phone || '',
        skills: Array.isArray(profile.skills) ? profile.skills.join(', ') : '',
      });
    }
  }, [profile, user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    setError('');

    try {
      const { data } = await api.put('/students/me', {
        name: formData.name,
        rollNumber: formData.rollNumber,
        branch: formData.branch,
        CGPA: Number(formData.CGPA),
        graduationYear: Number(formData.graduationYear),
        activeBacklogs: Number(formData.activeBacklogs),
        resumeUrl: formData.resumeUrl,
        phone: formData.phone,
        skills: formData.skills.split(',').map((s) => s.trim()).filter(Boolean),
      });

      if (data.success) {
        setMessage('Your academic placement profile has been updated successfully!');
        await refreshProfile();
      }
    } catch (err) {
      setError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900">Academic Placement Profile</h1>
        <p className="text-sm text-slate-600 mt-1">
          Keep your academic records, CGPA, and resume URL updated for the automated eligibility engine.
        </p>
      </div>

      {message && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5 text-emerald-800 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-800 text-xs font-bold">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal & Academic Details Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <span>Core Academic Credentials</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Full Name
              </label>
              <input
                type="text"
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Roll Number / Student ID
              </label>
              <input
                type="text"
                required
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="22CS1045"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Branch / Specialization
              </label>
              <select
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="CSE">Computer Science & Engineering (CSE)</option>
                <option value="IT">Information Technology (IT)</option>
                <option value="AI/ML">Artificial Intelligence & ML (AI/ML)</option>
                <option value="ECE">Electronics & Communication (ECE)</option>
                <option value="EE">Electrical Engineering (EE)</option>
                <option value="ME">Mechanical Engineering (ME)</option>
                <option value="CE">Civil Engineering (CE)</option>
                <option value="AIDS">AI & Data Science (AIDS)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Current Cumulative CGPA (0.0 - 10.0)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                required
                name="CGPA"
                value={formData.CGPA}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold text-brand-700"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Active Standing Backlogs
              </label>
              <input
                type="number"
                min="0"
                required
                name="activeBacklogs"
                value={formData.activeBacklogs}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Graduation Batch Year
              </label>
              <input
                type="number"
                required
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Skills & Resume Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-brand-600" />
            <span>Professional Profile & Resume</span>
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Technical Skills (Comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node.js, Python, AWS, Docker, MongoDB"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Add programming languages, frameworks, databases, and core concepts.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Resume Link (Google Drive / GitHub / Portfolio / PDF URL)
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                name="resumeUrl"
                value={formData.resumeUrl}
                onChange={handleChange}
                placeholder="https://drive.google.com/file/d/your-resume.pdf"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              {formData.resumeUrl && (
                <a
                  href={formData.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </a>
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
              Contact Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md shadow-brand-500/25 transition-all flex items-center gap-2 disabled:opacity-70"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Credentials</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentProfile;
