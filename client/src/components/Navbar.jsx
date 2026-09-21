import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  LogOut,
  User,
  Shield,
  Briefcase,
  Layers,
  Sparkles,
  ArrowRight,
  LifeBuoy,
} from 'lucide-react';

const Navbar = ({ onOpenHelp }) => {
  const { user, profile, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
            <Shield className="w-3 h-3" /> Placement Officer
          </span>
        );
      case 'recruiter':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <Briefcase className="w-3 h-3" /> Recruiter
          </span>
        );
      case 'student':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <GraduationCap className="w-3 h-3" /> Student
          </span>
        );
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-bold bg-gradient-to-r from-slate-900 via-brand-900 to-brand-700 bg-clip-text text-transparent">
                CampusConnect
              </span>
              <span className="text-[10px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded bg-brand-50 text-brand-700 border border-brand-200">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium -mt-1">
              Placement & Internship Portal
            </p>
          </div>
        </Link>

        {/* Center / Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <Link to="/" className="hover:text-brand-600 transition-colors">
            Home
          </Link>
          {isAuthenticated && user?.role === 'student' && (
            <>
              <Link to="/student/dashboard" className="hover:text-brand-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/student/drives" className="hover:text-brand-600 transition-colors">
                Browse Drives
              </Link>
              <Link to="/student/resume-ai" className="hover:text-brand-600 transition-colors flex items-center gap-1 text-blue-600 font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Resume AI</span>
              </Link>
              <Link to="/student/applications" className="hover:text-brand-600 transition-colors">
                My Applications
              </Link>
            </>
          )}
          {isAuthenticated && user?.role === 'recruiter' && (
            <>
              <Link to="/recruiter/dashboard" className="hover:text-brand-600 transition-colors">
                Dashboard
              </Link>
              <Link to="/recruiter/drives" className="hover:text-brand-600 transition-colors">
                Company Drives
              </Link>
            </>
          )}
          {isAuthenticated && user?.role === 'admin' && (
            <>
              <Link to="/admin/dashboard" className="hover:text-brand-600 transition-colors">
                Analytics
              </Link>
              <Link to="/admin/drives" className="hover:text-brand-600 transition-colors">
                Drives
              </Link>
              <Link to="/admin/students" className="hover:text-brand-600 transition-colors">
                Student Database
              </Link>
            </>
          )}
        </nav>

        {/* Right Action / Profile */}
        <div className="flex items-center gap-3">
          {/* Helpdesk Button */}
          <button
            onClick={onOpenHelp}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors shadow-xs"
            title="Placement Cell Helpdesk & Recruiter Contacts"
          >
            <LifeBuoy className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Helpdesk</span>
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex flex-col items-end text-right">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">{user?.name}</span>
                  {getRoleBadge(user?.role)}
                </div>
                <span className="text-xs text-slate-500">
                  {user?.role === 'student' && profile?.branch
                    ? `${profile.branch} | CGPA: ${profile.CGPA}`
                    : user?.email}
                </span>
              </div>

              {user?.role === 'student' && (
                <Link
                  to="/student/profile"
                  className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                  title="My Profile"
                >
                  <User className="w-5 h-5" />
                </Link>
              )}

              <button
                onClick={handleLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2.5">
              <Link
                to="/login"
                className="px-4 py-2 text-sm font-semibold text-slate-700 hover:text-brand-600 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm shadow-brand-500/25 transition-all hover:gap-2"
              >
                <span>Register</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
