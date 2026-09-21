import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Sparkles, User, Shield, Briefcase, Zap } from 'lucide-react';

const DemoBanner = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleDemoLogin = async (email, password, redirectPath) => {
    const res = await login(email, password);
    if (res.success) {
      navigate(redirectPath);
    }
  };

  return (
    <aside aria-label="Demo Quick Switcher" className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 text-xs border-b border-indigo-800/40 shadow-sm relative z-50">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
            <Zap className="w-3.5 h-3.5" /> 1-Click Demo Profiles:
          </span>
          <span className="hidden sm:inline text-slate-300 text-[11px]">
            Switch instant roles for college viva & demonstration
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Student 1: Eligible */}
          <button
            onClick={() =>
              handleDemoLogin('aarav.cse@campusconnect.edu', 'student123', '/student/dashboard')
            }
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-brand-600 border border-slate-700 hover:border-brand-500 transition-colors flex items-center gap-1 font-medium text-slate-200 hover:text-white"
            title="Aarav Sharma (CSE, 8.85 CGPA, 0 Backlogs - Eligible)"
          >
            <User className="w-3 h-3 text-emerald-400" />
            <span>Eligible Student</span>
          </button>

          {/* Student 2: Ineligible / Backlogs */}
          <button
            onClick={() =>
              handleDemoLogin('rohan.ece@campusconnect.edu', 'student123', '/student/drives')
            }
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-brand-600 border border-slate-700 hover:border-brand-500 transition-colors flex items-center gap-1 font-medium text-slate-200 hover:text-white"
            title="Rohan Verma (ECE, 6.4 CGPA, 1 Backlog - Ineligible for high cutoffs)"
          >
            <User className="w-3 h-3 text-rose-400" />
            <span>Ineligible Student</span>
          </button>

          {/* Student 3: Placed / 1-Offer Locked */}
          <button
            onClick={() =>
              handleDemoLogin('priya.aiml@campusconnect.edu', 'student123', '/student/drives')
            }
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-brand-600 border border-slate-700 hover:border-brand-500 transition-colors flex items-center gap-1 font-medium text-slate-200 hover:text-white"
            title="Priya Nair (AI/ML, 9.3 CGPA, Placed at Microsoft - Tests 1-offer policy)"
          >
            <User className="w-3 h-3 text-amber-400" />
            <span>Placed Student</span>
          </button>

          {/* Recruiter: Google */}
          <button
            onClick={() =>
              handleDemoLogin('recruiter.google@campusconnect.edu', 'recruiter123', '/recruiter/dashboard')
            }
            className="px-2.5 py-1 rounded bg-slate-800 hover:bg-emerald-600 border border-slate-700 hover:border-emerald-500 transition-colors flex items-center gap-1 font-medium text-slate-200 hover:text-white"
            title="Google Recruiter"
          >
            <Briefcase className="w-3 h-3 text-sky-400" />
            <span>Google Recruiter</span>
          </button>

          {/* Admin: Placement Officer */}
          <button
            onClick={() =>
              handleDemoLogin('admin@campusconnect.edu', 'admin123', '/admin/dashboard')
            }
            className="px-2.5 py-1 rounded bg-purple-950 hover:bg-purple-700 border border-purple-800 hover:border-purple-600 transition-colors flex items-center gap-1 font-bold text-purple-200 hover:text-white shadow-sm"
            title="Prof. Rajesh Sharma (Head Placement Officer)"
          >
            <Shield className="w-3 h-3 text-purple-300" />
            <span>Admin (TPO)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DemoBanner;
