import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CompanyLogo from '../../components/CompanyLogo';
import EligibilityBadge from '../../components/EligibilityBadge';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  FileText,
  Copy,
  Check,
  Building2,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldCheck,
  Download,
  RefreshCw,
  Zap,
  Sliders,
  HelpCircle,
  Eye,
} from 'lucide-react';

export default function ResumeAIStudio({ onOpenHelp }) {
  const { user, profile, refreshProfile } = useAuth();
  const location = useLocation();

  const [drives, setDrives] = useState([]);
  const [selectedDriveId, setSelectedDriveId] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [appliedToProfile, setAppliedToProfile] = useState(false);
  const [copiedSection, setCopiedSection] = useState('');

  // Extract driveId from query string if directed from DriveExplorer
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const driveIdParam = params.get('driveId');
    if (driveIdParam) {
      setSelectedDriveId(driveIdParam);
    }
  }, [location]);

  // Load drives and student profile default skills
  useEffect(() => {
    const fetchDrives = async () => {
      try {
        setInitialLoading(true);
        const { data } = await api.get('/drives');
        if (data.success && data.drives) {
          setDrives(data.drives);
          if (!selectedDriveId && data.drives.length > 0) {
            setSelectedDriveId(data.drives[0]._id);
          }
        }
      } catch (err) {
        console.error('Failed to load drives:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    fetchDrives();

    // Default resume text template from profile
    if (profile) {
      const defaultText = `Engineering undergraduate with background in ${(profile.skills || []).join(', ')}. Completed multiple academic projects and course modules. Looking for opportunities in software development.`;
      setResumeText(defaultText);
    }
  }, [profile]);

  // Run ATS analysis & AI Tailoring
  const runAnalysis = async (driveIdToAnalyze) => {
    const targetId = driveIdToAnalyze || selectedDriveId;
    if (!targetId) return;

    setLoading(true);
    setAppliedToProfile(false);

    try {
      const { data } = await api.post('/resume/analyze-ats', {
        driveId: targetId,
        resumeText: resumeText || (profile?.skills || []).join(', '),
      });

      if (data.success) {
        setAnalysisResult(data.data);
      }
    } catch (err) {
      console.error('ATS Analysis Error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Auto-run when drive selection changes
  useEffect(() => {
    if (selectedDriveId) {
      runAnalysis(selectedDriveId);
    }
  }, [selectedDriveId]);

  const handleApplyToProfile = async () => {
    if (!analysisResult?.tailoredResume) return;

    try {
      const { data } = await api.post('/resume/apply-tailored', {
        skills: analysisResult.tailoredResume.recommendedSkills,
      });
      if (data.success) {
        setAppliedToProfile(true);
        if (refreshProfile) refreshProfile();
        setTimeout(() => setAppliedToProfile(false), 3000);
      }
    } catch (err) {
      console.error('Failed to apply tailored skills:', err);
    }
  };

  const handleCopy = (text, sectionName) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionName);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const selectedDrive = drives.find((d) => d._id === selectedDriveId);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>AI Resume Enhancer & ATS Analyzer</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Targeted Job Description Optimizer
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Automatically reads company job requirements, evaluates your academic eligibility first, calculates
            your multi-factor ATS match score, and rewrites bullet points into high-impact STAR accomplishments.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/student/drives"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl border border-white/20 transition-all flex items-center gap-1.5"
          >
            <Briefcase className="w-4 h-4" />
            <span>Browse Drives</span>
          </Link>
          <button
            onClick={onOpenHelp}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5"
          >
            <HelpCircle className="w-4 h-4" />
            <span>ATS Helpdesk</span>
          </button>
        </div>
      </div>

      {/* Target Drive Selector Toolbar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider">
              1. Select Target Recruitment Drive
            </label>
            <p className="text-xs text-slate-500">
              Pick the company drive you want to optimize your resume and evaluate eligibility for:
            </p>
          </div>

          <select
            value={selectedDriveId}
            onChange={(e) => setSelectedDriveId(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[280px]"
          >
            {drives.map((d) => (
              <option key={d._id} value={d._id}>
                {d.companyId?.name} — {d.role} ({d.packageLabel || `₹${d.package} LPA`})
              </option>
            ))}
          </select>
        </div>

        {/* Selected Drive Meta & Description Preview */}
        {selectedDrive && (
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <CompanyLogo
                name={selectedDrive.companyId?.name}
                logo={selectedDrive.companyId?.logo}
                size="md"
              />
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-blue-700 uppercase">
                    {selectedDrive.companyId?.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                    {selectedDrive.type}
                  </span>
                </div>
                <h4 className="font-extrabold text-slate-900 text-sm">{selectedDrive.role}</h4>
                <p className="text-xs text-slate-500 line-clamp-1">{selectedDrive.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-semibold text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px]">Package:</span>
                <span className="font-bold text-emerald-600">
                  {selectedDrive.packageLabel || `₹${selectedDrive.package} LPA`}
                </span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px]">Cutoff:</span>
                <span>CGPA &ge; {selectedDrive.minCGPA}</span>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <span className="text-slate-400 block text-[10px]">Backlogs:</span>
                <span>&le; {selectedDrive.maxBacklogs}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* DUAL RESULTS SECTION: 1. Academic Eligibility Guard & 2. ATS Score Card */}
      {loading ? (
        <div className="p-16 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 flex flex-col items-center justify-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-bold text-slate-700">
            Parsing Job Description & Computing ATS Compatibility Score...
          </span>
        </div>
      ) : analysisResult ? (
        <div className="space-y-6 animate-in fade-in">
          {/* 1. Academic Eligibility Check Banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
              analysisResult.eligibility.isEligible
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start space-x-3.5">
              <div
                className={`p-2.5 rounded-xl shadow-xs ${
                  analysisResult.eligibility.isEligible
                    ? 'bg-emerald-600 text-white'
                    : 'bg-rose-600 text-white'
                }`}
              >
                {analysisResult.eligibility.isEligible ? (
                  <CheckCircle2 className="w-6 h-6" />
                ) : (
                  <AlertCircle className="w-6 h-6" />
                )}
              </div>
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-extrabold text-base">
                    {analysisResult.eligibility.isEligible
                      ? 'Academic Eligibility Criteria Verified'
                      : 'Academic Eligibility Check: Disqualified'}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      analysisResult.eligibility.isEligible
                        ? 'bg-emerald-200 text-emerald-900'
                        : 'bg-rose-200 text-rose-900'
                    }`}
                  >
                    {analysisResult.eligibility.isEligible ? 'Eligible' : 'Ineligible'}
                  </span>
                </div>
                <p className="text-xs leading-relaxed">
                  {analysisResult.eligibility.isEligible
                    ? 'Your CGPA, department branch, backlog record, and placement policy status meet all institutional requirements for this drive.'
                    : `Barriers detected: ${analysisResult.eligibility.barriers.join(' • ')}`}
                </p>
              </div>
            </div>

            <div className="text-xs space-y-1 flex-shrink-0">
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Your CGPA:</span>
                <span className="font-bold">{profile?.CGPA}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Your Branch:</span>
                <span className="font-bold">{profile?.branch}</span>
              </div>
              <div className="flex justify-between gap-3">
                <span className="text-slate-500">Active Backlogs:</span>
                <span className="font-bold">{profile?.activeBacklogs}</span>
              </div>
            </div>
          </div>

          {/* 2. ATS Score & Deep Compatibility Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Overall ATS Gauge */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col items-center text-center justify-between space-y-4">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Overall ATS Compatibility
                </span>
                <h3 className="text-lg font-black text-slate-900">Recruiter Match Score</h3>
              </div>

              {/* Circular Metric Gauge */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="w-full h-full rounded-full border-8 border-slate-100 flex items-center justify-center">
                  <div
                    className={`w-28 h-28 rounded-full flex flex-col items-center justify-center shadow-inner ${
                      analysisResult.atsAnalysis.overallScore >= 80
                        ? 'bg-emerald-50 text-emerald-700'
                        : analysisResult.atsAnalysis.overallScore >= 60
                        ? 'bg-blue-50 text-blue-700'
                        : 'bg-amber-50 text-amber-700'
                    }`}
                  >
                    <span className="text-3xl font-black">{analysisResult.atsAnalysis.overallScore}%</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                      {analysisResult.atsAnalysis.overallScore >= 80
                        ? 'High Match'
                        : analysisResult.atsAnalysis.overallScore >= 60
                        ? 'Good Match'
                        : 'Moderate'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-500 space-y-1">
                <p>
                  Found <strong>{analysisResult.atsAnalysis.matchedKeywords.length}</strong> of{' '}
                  <strong>{analysisResult.atsAnalysis.requiredKeywords.length}</strong> target keywords
                </p>
                <p>
                  <strong>{analysisResult.atsAnalysis.metricsDetected}</strong> quantifiable metrics &{' '}
                  <strong>{analysisResult.atsAnalysis.actionVerbsFound}</strong> power action verbs
                </p>
              </div>

              <button
                onClick={handleApplyToProfile}
                disabled={appliedToProfile}
                className={`w-full py-2.5 px-4 text-xs font-bold rounded-xl shadow-sm transition-all flex items-center justify-center space-x-2 ${
                  appliedToProfile
                    ? 'bg-emerald-600 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/25'
                }`}
              >
                {appliedToProfile ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Profile Synchronized!</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Apply Tailored Skills to Profile</span>
                  </>
                )}
              </button>
            </div>

            {/* Right: Sub-Score Pillars */}
            <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  Multi-Factor ATS Evaluation Pillars
                </h4>
                <span className="text-xs text-slate-400">Industry Recruiter Weightings</span>
              </div>

              <div className="space-y-4">
                {/* Keyword Match Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">1. Technical Keyword Match (40%)</span>
                    <span className="font-bold text-blue-600">
                      {analysisResult.atsAnalysis.keywordMatchRate}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.atsAnalysis.keywordMatchRate}%` }}
                    />
                  </div>
                </div>

                {/* Action Verb & Impact Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      2. Quantifiable Impact & Action Verbs (25%)
                    </span>
                    <span className="font-bold text-emerald-600">
                      {analysisResult.atsAnalysis.actionVerbScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.atsAnalysis.actionVerbScore}%` }}
                    />
                  </div>
                </div>

                {/* Skill Density Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      3. Technical Skill Density & Depth (20%)
                    </span>
                    <span className="font-bold text-purple-600">
                      {analysisResult.atsAnalysis.skillDensityScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-purple-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.atsAnalysis.skillDensityScore}%` }}
                    />
                  </div>
                </div>

                {/* Structure Bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">
                      4. Structural Hierarchy & Formatting (15%)
                    </span>
                    <span className="font-bold text-amber-600">
                      {analysisResult.atsAnalysis.structureScore}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="bg-amber-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${analysisResult.atsAnalysis.structureScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Keyword Comparison Chips */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">
                  Matched vs. Critical Missing Keywords:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {analysisResult.atsAnalysis.matchedKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1"
                    >
                      <Check className="w-3 h-3 text-emerald-600" />
                      {kw}
                    </span>
                  ))}
                  {analysisResult.atsAnalysis.missingKeywords.map((kw, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1"
                      title="Add this keyword to boost your score"
                    >
                      + Add {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 3. AI Tailored Resume Output Studio */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-600" />
                  <h3 className="font-black text-lg text-slate-900">
                    AI-Tailored Content for {analysisResult.tailoredResume.targetCompany}
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Optimized for role: <strong>{analysisResult.tailoredResume.targetRole}</strong>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() =>
                    handleCopy(
                      `${analysisResult.tailoredResume.tailoredSummary}\n\nKey Accomplishments:\n${analysisResult.tailoredResume.tailoredBulletPoints.join(
                        '\n'
                      )}`,
                      'all'
                    )
                  }
                  className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center space-x-1.5"
                >
                  {copiedSection === 'all' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedSection === 'all' ? 'Copied Entire Resume!' : 'Copy All'}</span>
                </button>
              </div>
            </div>

            {/* Section A: Tailored Professional Summary */}
            <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-blue-600" />
                  Targeted Professional Summary
                </span>
                <button
                  onClick={() =>
                    handleCopy(analysisResult.tailoredResume.tailoredSummary, 'summary')
                  }
                  className="text-slate-400 hover:text-blue-600 text-xs p-1 flex items-center gap-1"
                >
                  {copiedSection === 'summary' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px]">Copy</span>
                </button>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">
                {analysisResult.tailoredResume.tailoredSummary}
              </p>
            </div>

            {/* Section B: High-Impact STAR Format Accomplishments */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  STAR-Format Quantifiable Bullet Points
                </span>
                <button
                  onClick={() =>
                    handleCopy(
                      analysisResult.tailoredResume.tailoredBulletPoints.join('\n'),
                      'bullets'
                    )
                  }
                  className="text-slate-400 hover:text-blue-600 text-xs p-1 flex items-center gap-1"
                >
                  {copiedSection === 'bullets' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span className="text-[10px]">Copy Bullets</span>
                </button>
              </div>

              <div className="space-y-2">
                {analysisResult.tailoredResume.tailoredBulletPoints.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-300 text-xs text-slate-700 flex items-start space-x-2.5 transition-colors"
                  >
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold text-[10px] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <p className="leading-relaxed">{bullet}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Section C: Actionable ATS Recruiter Advice */}
            <div className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl space-y-2">
              <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                Recruiter Screening & Optimization Tips
              </span>
              <ul className="space-y-1.5 text-xs text-slate-700">
                {analysisResult.tailoredResume.atsRecommendations.map((tip, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
