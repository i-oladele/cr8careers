import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

const HomePage = lazy(() => import("./pages/HomePage"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const ContactPage = lazy(() => import("./pages/ContactPage"));
const InsightCentrePage = lazy(() => import("./pages/InsightCentrePage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const CoursePlayerPage = lazy(() => import("./pages/CoursePlayerPage"));
const StudentDashboard = lazy(() => import("./pages/StudentDashboard"));
const AdminLogin = lazy(() => import("./pages/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const OpportunitiesPage = lazy(() => import("./pages/OpportunitiesPage"));
const RecruitmentPage = lazy(() => import("./pages/RecruitmentPage"));
const OutsourcingPage = lazy(() => import("./pages/OutsourcingPage"));
const TrainingPage = lazy(() => import("./pages/TrainingPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const MyCoursesPage = lazy(() => import("./pages/MyCoursesPage"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));

function PageFallback() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <p className="font-['DM_Sans',sans-serif] text-gray-500">Loading...</p>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/insight-centre" element={<InsightCentrePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/course/:courseId" element={<CoursePlayerPage />} />
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/opportunities" element={<OpportunitiesPage />} />
            <Route path="/recruitment" element={<RecruitmentPage />} />
            <Route path="/outsourcing" element={<OutsourcingPage />} />
            <Route path="/training" element={<TrainingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  );
}
