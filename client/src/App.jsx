import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import DemoBanner from './components/DemoBanner';
import ProtectedRoute from './components/ProtectedRoute';
import HelpSupportModal from './components/HelpSupportModal';
import Footer from './components/Footer';

import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import StudentProfile from './pages/student/StudentProfile';
import DriveExplorer from './pages/student/DriveExplorer';
import MyApplications from './pages/student/MyApplications';
import ResumeAIStudio from './pages/student/ResumeAIStudio';

// Recruiter Pages
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard';
import DriveApplicants from './pages/recruiter/DriveApplicants';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import DriveManagement from './pages/admin/DriveManagement';
import StudentDirectory from './pages/admin/StudentDirectory';
import PolicySettings from './pages/admin/PolicySettings';
import PlacementReports from './pages/admin/PlacementReports';

// Authenticated Layout with Sidebar
const DashboardLayout = () => {
  const { user } = useAuth();

  return (
    <div className="flex min-h-[calc(100vh-4rem)] bg-slate-50">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};

// Main App Container
const AppContent = () => {
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <DemoBanner />
      <Navbar onOpenHelp={() => setIsHelpOpen(true)} />
      <div className="flex-1 flex flex-col">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage onOpenHelp={() => setIsHelpOpen(true)} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/student/dashboard" element={<StudentDashboard onOpenHelp={() => setIsHelpOpen(true)} />} />
              <Route path="/student/profile" element={<StudentProfile />} />
              <Route path="/student/drives" element={<DriveExplorer onOpenHelp={() => setIsHelpOpen(true)} />} />
              <Route path="/student/applications" element={<MyApplications onOpenHelp={() => setIsHelpOpen(true)} />} />
              <Route path="/student/resume-ai" element={<ResumeAIStudio onOpenHelp={() => setIsHelpOpen(true)} />} />
            </Route>
          </Route>

          {/* Recruiter Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['recruiter']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/recruiter/dashboard" element={<RecruiterDashboard onOpenHelp={() => setIsHelpOpen(true)} />} />
              <Route path="/recruiter/drives" element={<RecruiterDashboard onOpenHelp={() => setIsHelpOpen(true)} />} />
              <Route path="/recruiter/drives/:driveId/applicants" element={<DriveApplicants />} />
            </Route>
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route element={<DashboardLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboard onOpenHelp={() => setIsHelpOpen(true)} />} />
              <Route path="/admin/drives" element={<DriveManagement />} />
              <Route path="/admin/students" element={<StudentDirectory />} />
              <Route path="/admin/reports" element={<PlacementReports />} />
              <Route path="/admin/policy" element={<PolicySettings />} />
            </Route>
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      <Footer onOpenHelp={() => setIsHelpOpen(true)} />
      <HelpSupportModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
