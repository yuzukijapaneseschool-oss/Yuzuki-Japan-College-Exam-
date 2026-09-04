import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Navbar from './components/Navbar';
import PublicFooter from './components/PublicFooter';
import FloatingWhatsApp from './components/FloatingWhatsApp';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Courses from './pages/public/Courses';
import VisaPathways from './pages/public/VisaPathways';
import Contact from './pages/public/Contact';

import Login from './pages/Login';
import Register from './pages/Register';
import BatchRegister from './pages/BatchRegister';
import ExamRegister from './pages/ExamRegister';
import ExistingStudentRegister from './pages/ExistingStudentRegister';
import StudentDashboard from './pages/StudentDashboard';
import ExamSession from './pages/ExamSession';
import ExamResult from './pages/ExamResult';
import StudentHistory from './pages/StudentHistory';

import AdminDashboard from './pages/admin/AdminDashboard';
import StudentApprovals from './pages/admin/StudentApprovals';
import QuizManager from './pages/admin/QuizManager';
import QuestionEditor from './pages/admin/QuestionEditor';
import ExamResultsList from './pages/admin/ExamResultsList';
import CourseManager from './pages/admin/CourseManager';
import PaymentManager from './pages/admin/PaymentManager';
import InquiryManager from './pages/admin/InquiryManager';

function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-rose-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/dashboard'} replace />;
  }

  return children;
}

// Helper wrapper to conditionally render footer and floating WhatsApp
function AppLayout() {
  const location = useLocation();
  const publicPaths = ['/', '/about', '/courses', '/visa-pathways', '/contact'];
  const isPublicPage = publicPaths.includes(location.pathname);
  const isExamSession = location.pathname.startsWith('/exam/');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-transparent selection:text-slate-900 select-none">
      {!isExamSession && <Navbar />}
      
      <main className="flex-1">
        <Routes>
          {/* Public College Website Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/visa-pathways" element={<VisaPathways />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Exam Portal Entry */}
          <Route path="/portal" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<ExamRegister />} />
          <Route path="/exam-register" element={<ExamRegister />} />
          <Route path="/batch-register" element={<BatchRegister />} />
          <Route path="/existing-student" element={<ExistingStudentRegister />} />
          <Route path="/activate" element={<ExistingStudentRegister />} />
          <Route path="/activate-student" element={<ExistingStudentRegister />} />

          {/* Student Exam Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exam/:id"
            element={
              <ProtectedRoute requiredRole="student">
                <ExamSession />
              </ProtectedRoute>
            }
          />
          <Route
            path="/result/:id"
            element={
              <ProtectedRoute>
                <ExamResult />
              </ProtectedRoute>
            }
          />
          <Route
            path="/history"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentHistory />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <ProtectedRoute requiredRole="admin">
                <InquiryManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/approvals"
            element={
              <ProtectedRoute requiredRole="admin">
                <StudentApprovals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes"
            element={
              <ProtectedRoute requiredRole="admin">
                <QuizManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/quizzes/:examId/questions"
            element={
              <ProtectedRoute requiredRole="admin">
                <QuestionEditor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/results"
            element={
              <ProtectedRoute requiredRole="admin">
                <ExamResultsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/payments"
            element={
              <ProtectedRoute requiredRole="admin">
                <PaymentManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/courses"
            element={
              <ProtectedRoute requiredRole="admin">
                <CourseManager />
              </ProtectedRoute>
            }
          />

          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Floating WhatsApp on all non-exam pages */}
      {!isExamSession && <FloatingWhatsApp />}

      {/* Footer */}
      {!isExamSession && (
        isPublicPage ? (
          <PublicFooter />
        ) : (
          <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 py-6 text-center text-xs">
            <p className="font-japanese">
              &copy; 2026 YUZUKI Japan College (ゆづき日本カレッジ • Kandy) • All Rights Reserved.
            </p>
          </footer>
        )
      )}
    </div>
  );
}

export default function App() {
  // Global 100% Anti-Copy & Anti-Cheating Engine
  useEffect(() => {
    const handleContextMenu = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
        return false;
      }
    };

    const handleCopyCut = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
        if (e.clipboardData) {
          e.clipboardData.clearData();
        }
        return false;
      }
    };

    const handleSelectStart = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';
      if (!isInput) {
        e.preventDefault();
        return false;
      }
    };

    const handleKeyDown = (e) => {
      const isInput = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA';

      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }

      if ((e.ctrlKey || e.metaKey) && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }

      if ((e.ctrlKey || e.metaKey) && ['u', 's', 'p'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }

      if (!isInput && (e.ctrlKey || e.metaKey) && ['c', 'x', 'a'].includes(e.key.toLowerCase())) {
        e.preventDefault();
        return false;
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyCut);
    document.addEventListener('cut', handleCopyCut);
    document.addEventListener('selectstart', handleSelectStart);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyCut);
      document.removeEventListener('cut', handleCopyCut);
      document.removeEventListener('selectstart', handleSelectStart);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider>
  );
}