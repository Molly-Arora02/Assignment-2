import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import CompanyLogo from '../components/CompanyLogo';
import {
  GraduationCap,
  Briefcase,
  Shield,
  CheckCircle,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Award,
  Layers,
  BarChart3,
  Cpu,
  Lock,
  LifeBuoy,
  Mail,
  Building2,
  CheckCircle2,
} from 'lucide-react';

const LandingPage = ({ onOpenHelp }) => {
  const { isAuthenticated, user } = useAuth();

  const getDashboardLink = () => {
    if (!isAuthenticated) return '/login';
    if (user?.role === 'admin') return '/admin/dashboard';
    if (user?.role === 'recruiter') return '/recruiter/dashboard';
    return '/student/dashboard';
  };

  const HIRING_PARTNERS = [
    { name: 'Google India', domain: 'google.com', role: 'SDE-1 & SWE Interns' },
    { name: 'Microsoft', domain: 'microsoft.com', role: 'Cloud & AI Engineering' },
    { name: 'Amazon', domain: 'amazon.com', role: 'AWS & Dev Associate' },
    { name: 'Cisco Systems', domain: 'cisco.com', role: 'SDN & Security Engineer' },
    { name: 'Goldman Sachs', domain: 'goldmansachs.com', role: 'Global Markets Tech' },
    { name: 'Adobe', domain: 'adobe.com', role: 'Creative Cloud & GenAI' },
    { name: 'Deloitte', domain: 'deloitte.com', role: 'Tech Consulting & Cyber' },
  ];

  return (
    <div className="flex flex-col bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-tr from-blue-100/50 via-sky-100/30 to-indigo-100/40 rounded-full blur-3xl -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold mb-6 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Next-Gen Campus Placement & Corporate Recruitment Engine</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Streamlining Campus Hirings with{' '}
            <span className="bg-gradient-to-r from-blue-600 via-sky-600 to-indigo-600 bg-clip-text text-transparent">
              Automated Eligibility
            </span>{' '}
            & Verified Recruitment Pipelines
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A unified, role-based ecosystem connecting Students, Corporate Recruiters, and
            Placement Officers with strict criteria verification and live analytics.
          </p>

          {/* Call to Actions */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link
              to={getDashboardLink()}
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-lg shadow-blue-500/25 transition-all hover:scale-105"
            >
              <span>{isAuthenticated ? 'Open Dashboard' : 'Explore Platform'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>

            <Link
              to="/student/drives"
              className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 shadow-xs transition-all"
            >
              <Briefcase className="w-5 h-5 text-blue-600" />
              <span>Browse Active Drives</span>
            </Link>

            <button
              onClick={onOpenHelp}
              className="inline-flex items-center gap-2 px-5 py-3.5 text-base font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl border border-slate-200 transition-all"
            >
              <LifeBuoy className="w-5 h-5 text-blue-600" />
              <span>Helpdesk & HR Contacts</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-14 max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-white/90 backdrop-blur-md rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-center p-3 border-r border-slate-100 last:border-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-blue-600">₹28.5 LPA</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Highest Package</p>
            </div>
            <div className="text-center p-3 border-r border-slate-100 last:border-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900">89.4%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Placement Rate</p>
            </div>
            <div className="text-center p-3 border-r border-slate-100 last:border-0">
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600">50+ Top</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Hiring Partners</p>
            </div>
            <div className="text-center p-3">
              <p className="text-2xl sm:text-3xl font-extrabold text-purple-600">100%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1">Automated Policy</p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Partners & Logos Marquee Section */}
      <section className="py-12 bg-white border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-blue-600 mb-1.5">
              Verified Corporate Recruitment Partners
            </h2>
            <p className="text-2xl font-bold text-slate-900">
              Top technology firms & enterprises hiring on CampusConnect
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {HIRING_PARTNERS.map((partner, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all flex flex-col items-center text-center space-y-2 group"
              >
                <CompanyLogo name={partner.name} size="lg" className="group-hover:scale-110 transition-transform" />
                <div className="w-full">
                  <h4 className="font-bold text-slate-900 text-xs truncate">{partner.name}</h4>
                  <span className="text-[10px] text-slate-500 block truncate">{partner.role}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={onOpenHelp}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-xl border border-blue-200 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>Need HR Contact Information? View All Visiting Recruiter Help Emails</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 3 Core Roles Section */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-blue-600 mb-2">
              Role-Based Architecture
            </h2>
            <p className="text-3xl font-bold text-slate-900">
              Tailored dashboards for every stakeholder in the placement journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Student Role */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Students</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Build academic profiles, see real-time eligibility badges on company job cards, apply with 1-click,
                and track recruitment pipeline stage milestones.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Instant eligibility feedback & breakdown</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>5-stage recruitment status timeline</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Direct company HR help emails for test issues</span>
                </li>
              </ul>
            </div>

            {/* Recruiter Role */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <Briefcase className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Corporate Recruiters</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Post targeted job & internship drives with custom CGPA/backlog/branch cutoffs. Review
                pre-verified applicant pools and shortlist with audit notes.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Company-scoped authorized drive management</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Candidate resume viewer & skill filter</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Stage transitions: Shortlist, Interview, Offer</span>
                </li>
              </ul>
            </div>

            {/* Placement Officer Role */}
            <div className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all space-y-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">For Placement Cell (TPO)</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Institution-wide oversight with live placement rate charts, branch distributions,
                single-offer policy rules, and one-click CSV report exports.
              </p>
              <ul className="space-y-2 text-xs font-medium text-slate-700 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Interactive Recharts placement dashboards</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Single-offer policy & Dream upgrade rules</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <span>Accreditation & NAAC ready CSV data exports</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Core Logic Highlights */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-xs uppercase tracking-widest font-extrabold text-blue-600 mb-2">
              Server-Enforced Rules
            </h2>
            <p className="text-3xl font-bold text-slate-900">
              Zero manual errors with server-side business rules
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-3 bg-blue-100 text-blue-700 rounded-xl w-fit mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Automated Eligibility Engine</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Evaluates minimum CGPA, allowed active backlogs, eligible degree branches, and
                graduation batch server-side. Ineligible requests are strictly blocked.
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-3 bg-indigo-100 text-indigo-700 rounded-xl w-fit mb-4">
                <Lock className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Placement Policy Guard</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Prevents placed students from hoarding job offers while supporting
                customizable Dream Offer upgrades (e.g. &ge; 1.5x previous package).
              </p>
            </div>

            <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200">
              <div className="p-3 bg-purple-100 text-purple-700 rounded-xl w-fit mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h4 className="text-lg font-bold text-slate-900 mb-2">Live Analytics & Reporting</h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Aggregates placed vs unplaced ratios, branch-wise hiring percentages, average CTCs,
                and company-wise recruitment distribution charts.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
