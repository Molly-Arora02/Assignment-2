import React from 'react';
import {
  GraduationCap,
  Mail,
  Phone,
  Building2,
  ShieldCheck,
  Award,
  ExternalLink,
  LifeBuoy,
} from 'lucide-react';
import CompanyLogo from './CompanyLogo';

export default function Footer({ onOpenHelp }) {
  const PARTNER_COMPANIES = [
    { name: 'Google India', domain: 'google.com' },
    { name: 'Microsoft', domain: 'microsoft.com' },
    { name: 'Amazon', domain: 'amazon.com' },
    { name: 'Cisco Systems', domain: 'cisco.com' },
    { name: 'Goldman Sachs', domain: 'goldmansachs.com' },
    { name: 'Adobe', domain: 'adobe.com' },
    { name: 'Deloitte', domain: 'deloitte.com' },
  ];

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 pt-12 pb-8 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Top Corporate Partners Logo Strip */}
        <div className="border-b border-slate-800 pb-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Official Campus Recruitment & Hiring Partners
              </h4>
              <p className="text-xs text-slate-500">
                Top corporate recruiters conducting verified drives on CampusConnect
              </p>
            </div>
            <button
              onClick={onOpenHelp}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
            >
              <LifeBuoy className="w-3.5 h-3.5" />
              <span>View All Recruiter Help Emails & Contacts</span>
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
            {PARTNER_COMPANIES.map((company, idx) => (
              <div
                key={idx}
                className="bg-slate-800/80 hover:bg-slate-800 border border-slate-700/60 rounded-xl p-2.5 flex items-center space-x-2.5 transition-all group"
              >
                <CompanyLogo name={company.name} size="sm" showShadow={false} />
                <div className="truncate">
                  <span className="text-xs font-semibold text-slate-200 block truncate group-hover:text-white">
                    {company.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono block truncate">
                    {company.domain}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Middle Columns */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Accreditation */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white tracking-tight">CampusConnect</span>
                <span className="block text-[10px] text-blue-400 font-semibold uppercase tracking-wider">
                  Placement & Career Cell
                </span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Autonomous central placement portal managing drive registrations, automated academic eligibility
              verification, role pipelines, and placement policy enforcement.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-emerald-400 bg-emerald-950/50 border border-emerald-800/50 px-3 py-1.5 rounded-lg w-fit">
              <Award className="w-4 h-4" />
              <span className="font-semibold">NAAC A++ Accredited • NBA Tier-1</span>
            </div>
          </div>

          {/* Col 2: Placement Cell Contacts */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Training & Placement Office
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start space-x-2">
                <Building2 className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0" />
                <span>3rd Floor, Administrative Block, Main Campus</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span className="font-mono text-slate-300">+91 11 2659 1000 (Ext. 402)</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <a
                  href="mailto:tpo-desk@college.edu"
                  className="text-blue-400 hover:text-blue-300 hover:underline"
                >
                  tpo-desk@college.edu
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Dedicated Help Emails */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Direct Help & Grievance Desks
            </h4>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div>
                <span className="text-[11px] text-slate-500 block">Student Grievance Cell:</span>
                <a
                  href="mailto:placement-grievance@college.edu"
                  className="text-slate-300 hover:text-white hover:underline flex items-center space-x-1"
                >
                  <span>placement-grievance@college.edu</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Recruiter Relations Desk:</span>
                <a
                  href="mailto:recruiter-relations@college.edu"
                  className="text-slate-300 hover:text-white hover:underline flex items-center space-x-1"
                >
                  <span>recruiter-relations@college.edu</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">Portal Tech Support:</span>
                <a
                  href="mailto:portal-support@campusconnect.edu"
                  className="text-slate-300 hover:text-white hover:underline flex items-center space-x-1"
                >
                  <span>portal-support@campusconnect.edu</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Action / Help Modal Trigger */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Need Instant Assistance?
            </h4>
            <p className="text-xs text-slate-400">
              Access the centralized helpdesk for eligibility FAQs, interview schedule queries, and company HR emails.
            </p>
            <button
              onClick={onOpenHelp}
              className="w-full py-2 px-3.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md flex items-center justify-center space-x-2 transition-colors"
            >
              <LifeBuoy className="w-4 h-4" />
              <span>Open Campus Helpdesk</span>
            </button>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 space-y-2 sm:space-y-0">
          <p>© {new Date().getFullYear()} CampusConnect Management System. All rights reserved.</p>
          <div className="flex items-center space-x-4 text-[11px]">
            <span className="hover:text-slate-400 cursor-pointer" onClick={onOpenHelp}>
              Single-Offer Policy
            </span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer" onClick={onOpenHelp}>
              Recruiter Guidelines
            </span>
            <span>•</span>
            <span className="hover:text-slate-400 cursor-pointer" onClick={onOpenHelp}>
              Student Code of Conduct
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
