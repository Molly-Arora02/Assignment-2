import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import EligibilityBadge from '../../components/EligibilityBadge';
import CompanyLogo from '../../components/CompanyLogo';
import {
  Search,
  Filter,
  Briefcase,
  Building2,
  Calendar,
  DollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Info,
  Layers,
  Mail,
  Copy,
  Check,
  LifeBuoy,
  Phone,
  ShieldCheck,
} from 'lucide-react';

const DriveExplorer = ({ onOpenHelp }) => {
  const { user, profile } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedDrive, setSelectedDrive] = useState(null); // For modal
  const [applying, setApplying] = useState(false);
  const [applyResult, setApplyResult] = useState(null);
  const [copiedEmail, setCopiedEmail] = useState('');

  const fetchDrives = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search) params.search = search;
      if (selectedBranch) params.branch = selectedBranch;
      if (selectedType) params.type = selectedType;

      const { data } = await api.get('/drives', { params });
      if (data.success) {
        setDrives(data.drives || []);
      }
    } catch (e) {
      console.error('Error fetching drives:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrives();
  }, [selectedBranch, selectedType]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDrives();
  };

  const handleApply = async (drive) => {
    setApplying(true);
    setApplyResult(null);

    try {
      // Use fallback endpoint handling to ensure 100% reliability
      let res;
      try {
        res = await api.post(`/drives/${drive._id}/apply`);
      } catch (err) {
        res = await api.post(`/applications/drive/${drive._id}/apply`);
      }

      if (res.data?.success) {
        setApplyResult({
          success: true,
          message: res.data.message || `Successfully applied to ${drive.role}!`,
        });
        await fetchDrives(); // Refresh drives list
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        'Application failed to submit. Please check your eligibility.';
      setApplyResult({
        success: false,
        message: msg,
      });
    } finally {
      setApplying(false);
    }
  };

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
          <h1 className="text-2xl font-black text-slate-900">Explore Recruitment Drives</h1>
          <p className="text-sm text-slate-600 mt-1">
            Browse verified campus placement and internship opportunities with live server-side eligibility checks.
          </p>
        </div>
        <button
          onClick={onOpenHelp}
          className="inline-flex items-center gap-2 px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-xl text-xs font-bold transition-all shadow-xs w-fit"
        >
          <LifeBuoy className="w-4 h-4 text-blue-600" />
          <span>Need Help / Contact HR Desk</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-3">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title, company name, skills, or location..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={selectedBranch}
            onChange={(e) => setSelectedBranch(e.target.value)}
            className="flex-1 md:flex-initial px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Branches</option>
            <option value="CSE">CSE</option>
            <option value="IT">IT</option>
            <option value="AI/ML">AI/ML</option>
            <option value="ECE">ECE</option>
            <option value="EE">EE</option>
            <option value="ME">ME</option>
          </select>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="flex-1 md:flex-initial px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Opportunities</option>
            <option value="Placement">Full-Time Placement</option>
            <option value="Internship">Internship</option>
            <option value="Internship + PPO">Internship + PPO</option>
          </select>
        </div>
      </div>

      {/* Drives Grid */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Computing live eligibility across drives...</span>
        </div>
      ) : drives.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 text-slate-500 space-y-3">
          <Briefcase className="w-10 h-10 mx-auto text-slate-300" />
          <p className="font-bold text-slate-700">No matching drives found</p>
          <p className="text-xs text-slate-400">Try clearing filters or search terms.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {drives.map((drive) => {
            const company = drive.companyId || {};
            const helpEmail =
              drive.helpEmail || company.helpEmail || 'careers@' + (company.domain || 'company.com');

            return (
              <div
                key={drive._id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-blue-400 hover:shadow-xl transition-all p-6 flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-4">
                  {/* Top Bar: Company Logo, Name & Role */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3.5">
                      <CompanyLogo
                        name={company.name || 'Company'}
                        logo={company.logo}
                        size="lg"
                        className="group-hover:scale-105 transition-transform"
                      />
                      <div className="space-y-0.5">
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-bold text-blue-700 tracking-wide uppercase">
                            {company.name || 'Corporate Partner'}
                          </span>
                          {company.domain && (
                            <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {company.domain}
                            </span>
                          )}
                        </div>
                        <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                          {drive.role}
                        </h3>
                      </div>
                    </div>

                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 flex-shrink-0">
                      {drive.type}
                    </span>
                  </div>

                  {/* Highlights Bar: Package & Location */}
                  <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50/80 rounded-xl text-xs border border-slate-100">
                    <div>
                      <span className="text-slate-600 font-medium">Package / Stipend:</span>
                      <p className="font-black text-emerald-600 text-sm mt-0.5">
                        {drive.packageLabel || `₹${drive.package} LPA`}
                      </p>
                    </div>
                    <div>
                      <span className="text-slate-600 font-medium">Work Location:</span>
                      <p className="font-semibold text-slate-700 text-xs mt-0.5 truncate flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-600 flex-shrink-0" />
                        <span className="truncate">{drive.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Criteria Tags */}
                  <div className="space-y-2 text-xs">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px] border border-slate-200/60">
                        Min CGPA: <strong className="text-slate-900">{drive.minCGPA}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px] border border-slate-200/60">
                        Max Backlogs: <strong className="text-slate-900">{drive.maxBacklogs}</strong>
                      </span>
                      <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium text-[11px] border border-slate-200/60">
                        Batch: <strong className="text-slate-900">{drive.eligibleYears?.join(', ')}</strong>
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Eligible Branches:{' '}
                      <span className="font-bold text-slate-800">
                        {drive.eligibleBranches?.join(', ')}
                      </span>
                    </div>
                  </div>

                  {/* Recruiter / Help Email snippet */}
                  <div className="flex items-center justify-between text-[11px] bg-blue-50/50 border border-blue-100/60 px-3 py-1.5 rounded-lg text-slate-600">
                    <div className="flex items-center space-x-1.5 truncate">
                      <Mail className="w-3.5 h-3.5 text-blue-600 flex-shrink-0" />
                      <span className="text-slate-600">HR Query:</span>
                      <a
                        href={`mailto:${helpEmail}?subject=%5BCampus%20Placement%20Query%5D%20${encodeURIComponent(
                          drive.role
                        )}`}
                        className="text-blue-700 hover:underline font-medium truncate max-w-[180px]"
                        title={helpEmail}
                      >
                        {helpEmail}
                      </a>
                    </div>
                    <button
                      onClick={() => handleCopyEmail(helpEmail)}
                      className="text-slate-600 hover:text-blue-600 p-0.5"
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

                {/* Bottom Footer: Eligibility Engine Status & Apply CTA */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3 flex-wrap">
                  <EligibilityBadge
                    isEligible={drive.isEligible}
                    reasons={drive.eligibilityReasons}
                    details={drive.eligibilityDetails}
                  />

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/student/resume-ai?driveId=${drive._id}`}
                      className="px-3 py-2 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all flex items-center gap-1.5"
                      title="Analyze ATS match & tailor resume for this drive"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                      <span>ATS & Tailor</span>
                    </Link>

                    {drive.hasApplied ? (
                      <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 text-slate-800 text-xs font-bold border border-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Applied ({drive.applicationStatus})
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedDrive(drive);
                          setApplyResult(null);
                        }}
                        className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center gap-1.5 ${
                          drive.isEligible
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25 hover:gap-2'
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }`}
                      >
                        <span>View & Apply</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail & Apply Confirmation Modal */}
      {selectedDrive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-5 max-h-[90vh] overflow-y-auto">
            {/* Modal Header with Company Logo */}
            <div className="flex items-start justify-between gap-4 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3.5">
                <CompanyLogo
                  name={selectedDrive.companyId?.name || 'Company'}
                  logo={selectedDrive.companyId?.logo}
                  size="lg"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-bold text-blue-700 uppercase tracking-wider">
                      {selectedDrive.companyId?.name}
                    </span>
                    {selectedDrive.companyId?.domain && (
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                        {selectedDrive.companyId?.domain}
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-black text-slate-900 leading-tight">
                    {selectedDrive.role}
                  </h3>
                </div>
              </div>
              <span className="px-3 py-1 bg-emerald-50 text-emerald-700 font-black text-xs rounded-xl border border-emerald-200 whitespace-nowrap">
                {selectedDrive.packageLabel || `₹${selectedDrive.package} LPA`}
              </span>
            </div>

            {/* Status Alert if returned */}
            {applyResult && (
              <div
                className={`p-4 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                  applyResult.success
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {applyResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <span>{applyResult.message}</span>
              </div>
            )}

            {/* Student Snapshot Summary */}
            <div className="space-y-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between font-bold text-slate-800 border-b border-slate-200 pb-2">
                <span>Application Candidate Snapshot:</span>
                <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                  {selectedDrive.isEligible ? 'Criteria Met' : 'Ineligible'}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-slate-700 pt-1">
                <div>
                  <span className="text-slate-600 block text-[10px]">Applicant:</span>
                  <strong>{user?.name}</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Branch:</span>
                  <strong>{profile?.branch}</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">CGPA:</span>
                  <strong>{profile?.CGPA}</strong>
                </div>
                <div>
                  <span className="text-slate-600 block text-[10px]">Backlogs:</span>
                  <strong>{profile?.activeBacklogs}</strong>
                </div>
              </div>
              <p className="pt-2 border-t border-slate-200 leading-relaxed text-slate-600 text-xs">
                {selectedDrive.description ||
                  'You will be evaluated based on your registered academic details and technical resume.'}
              </p>
            </div>

            {/* Dedicated Recruiter & TPO Help Desk Info Card */}
            <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-600" />
                  Drive Coordinator & HR Support Desk
                </span>
                <span className="text-[10px] text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded font-medium">
                  Verified Contact
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-slate-600 gap-1.5 pt-1">
                <div>
                  <span className="text-slate-600">HR Lead: </span>
                  <span className="font-semibold text-slate-800">
                    {selectedDrive.contactPerson ||
                      selectedDrive.companyId?.hrContact ||
                      'Campus Talent Acquisition Team'}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <a
                    href={`mailto:${
                      selectedDrive.helpEmail ||
                      selectedDrive.companyId?.helpEmail ||
                      'careers@' + (selectedDrive.companyId?.domain || 'company.com')
                    }?subject=%5BPlacement%20Query%5D%20${encodeURIComponent(selectedDrive.role)}`}
                    className="font-medium text-blue-700 hover:underline"
                  >
                    {selectedDrive.helpEmail ||
                      selectedDrive.companyId?.helpEmail ||
                      'careers@' + (selectedDrive.companyId?.domain || 'company.com')}
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyEmail(
                        selectedDrive.helpEmail ||
                          selectedDrive.companyId?.helpEmail ||
                          'careers@' + (selectedDrive.companyId?.domain || 'company.com')
                      )
                    }
                    className="p-1 text-slate-600 hover:text-blue-600"
                    title="Copy Email"
                  >
                    {copiedEmail ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <Link
                to={`/student/resume-ai?driveId=${selectedDrive._id}`}
                className="px-4 py-2.5 text-xs font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-all flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Optimize Resume for this Role</span>
              </Link>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDrive(null);
                    setApplyResult(null);
                  }}
                  className="px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Close
                </button>

                {!applyResult?.success && (
                  <button
                    type="button"
                    disabled={applying || !selectedDrive.isEligible}
                    onClick={() => handleApply(selectedDrive)}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/25 disabled:opacity-50 flex items-center gap-2 transition-all hover:gap-2.5"
                  >
                    {applying ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Confirm Application</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriveExplorer;
