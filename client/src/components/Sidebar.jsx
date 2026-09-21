import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  UserCheck,
  Users,
  Settings,
  DownloadCloud,
  CheckCircle2,
  Building2,
  Sliders,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  if (!user) return null;

  const studentLinks = [
    { to: '/student/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/student/drives', icon: Briefcase, label: 'Browse Drives' },
    { to: '/student/resume-ai', icon: Sparkles, label: 'Resume AI & ATS' },
    { to: '/student/applications', icon: FileText, label: 'My Applications' },
    { to: '/student/profile', icon: UserCheck, label: 'Placement Profile' },
  ];

  const recruiterLinks = [
    { to: '/recruiter/dashboard', icon: LayoutDashboard, label: 'Recruiter Dashboard' },
    { to: '/recruiter/drives', icon: Briefcase, label: 'Manage Drives' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: LayoutDashboard, label: 'Placement Analytics' },
    { to: '/admin/drives', icon: Briefcase, label: 'Drive Management' },
    { to: '/admin/students', icon: Users, label: 'Student Directory' },
    { to: '/admin/reports', icon: DownloadCloud, label: 'Placement Reports & CSV' },
    { to: '/admin/policy', icon: Sliders, label: 'Placement Policy' },
  ];

  let links = [];
  if (user.role === 'student') links = studentLinks;
  else if (user.role === 'recruiter') links = recruiterLinks;
  else if (user.role === 'admin') links = adminLinks;

  return (
    <aside className="w-64 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] flex flex-col p-4 shadow-sm">
      <div className="mb-4 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
          Current Workspace
        </p>
        <p className="text-sm font-bold text-slate-800 capitalize">
          {user.role === 'admin'
            ? 'Placement Cell Admin'
            : user.role === 'recruiter'
            ? `${user.company?.name || 'Recruiter Portal'}`
            : 'Student Portal'}
        </p>
      </div>

      <nav className="space-y-1.5 flex-1">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm shadow-brand-500/25 font-semibold'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Info / Policy Status */}
      <div className="mt-auto pt-4 border-t border-slate-100">
        <div className="p-3 bg-gradient-to-br from-brand-50 to-sky-50 border border-brand-100 rounded-xl text-xs text-brand-900">
          <div className="flex items-center gap-1.5 font-bold mb-1">
            <ShieldCheck className="w-4 h-4 text-brand-600" />
            <span>Placement Policy</span>
          </div>
          <p className="text-[11px] text-brand-800/80 leading-relaxed">
            Automatic eligibility validation & 1-offer restrictions active.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
