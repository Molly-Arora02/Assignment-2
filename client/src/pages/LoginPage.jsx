import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import GoogleAuthButton from '../components/GoogleAuthButton';
import {
  GraduationCap,
  Briefcase,
  Shield,
  ArrowRight,
  Lock,
  Mail,
  AlertCircle,
  Zap,
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('aarav.cse@campusconnect.edu');
  const [password, setPassword] = useState('student123');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const res = await login(email, password);
    setSubmitting(false);

    if (res.success) {
      if (res.user.role === 'admin') navigate('/admin/dashboard');
      else if (res.user.role === 'recruiter') navigate('/recruiter/dashboard');
      else navigate('/student/dashboard');
    } else {
      setError(res.message || 'Login failed. Please check credentials.');
    }
  };

  const handleQuickFill = (demoEmail, demoPass) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError('');
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 mb-4">
            <GraduationCap className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Sign In to CampusConnect
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            Access your student, recruiter, or placement officer account
          </p>
        </div>

        {/* Demo Fast Fill Card */}
        <div className="p-4 bg-gradient-to-br from-brand-50 via-sky-50 to-indigo-50 border border-brand-200 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2 mb-2.5 text-xs font-bold text-brand-900">
            <Zap className="w-4 h-4 text-brand-600" />
            <span>Select a Demo Role to Auto-Fill Credentials:</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs font-semibold">
            <button
              type="button"
              onClick={() => handleQuickFill('aarav.cse@campusconnect.edu', 'student123')}
              className="p-2 bg-white rounded-xl border border-brand-200 hover:border-brand-500 hover:bg-brand-50 text-slate-700 hover:text-brand-700 transition-all flex flex-col items-center gap-1 shadow-xs"
            >
              <GraduationCap className="w-4 h-4 text-blue-600" />
              <span>Student</span>
            </button>
            <button
              type="button"
              onClick={() =>
                handleQuickFill('recruiter.google@campusconnect.edu', 'recruiter123')
              }
              className="p-2 bg-white rounded-xl border border-emerald-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-all flex flex-col items-center gap-1 shadow-xs"
            >
              <Briefcase className="w-4 h-4 text-emerald-600" />
              <span>Recruiter</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('admin@campusconnect.edu', 'admin123')}
              className="p-2 bg-white rounded-xl border border-purple-200 hover:border-purple-500 hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition-all flex flex-col items-center gap-1 shadow-xs"
            >
              <Shield className="w-4 h-4 text-purple-600" />
              <span>Admin (TPO)</span>
            </button>
          </div>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-md">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-rose-800 text-xs font-semibold">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@campusconnect.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-md shadow-blue-500/25 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social Google OAuth Button */}
          <div className="mt-5 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-200 w-full" />
              <span className="bg-white px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Or Fast Sign In With
              </span>
              <div className="border-t border-slate-200 w-full" />
            </div>

            <GoogleAuthButton text="Sign In with Google" />
          </div>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-600">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-blue-600 hover:underline">
              Create student or recruiter account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
