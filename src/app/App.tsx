import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import HomePage from "./pages/HomePage";
import ServicesPage from "./pages/ServicesPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import InsightCentrePage from "./pages/InsightCentrePage";
import CoursesPage from "./pages/CoursesPage";
import CoursePlayerPage from "./pages/CoursePlayerPage";
import StudentDashboard from "./pages/StudentDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import LoginPage from "./pages/LoginPage";
import OpportunitiesPage from "./pages/OpportunitiesPage";
import RecruitmentPage from "./pages/RecruitmentPage";
import OutsourcingPage from "./pages/OutsourcingPage";
import TrainingPage from "./pages/TrainingPage";
import ProfilePage from "./pages/ProfilePage";

export default function App() {
  return (
    <AuthProvider>
    <Router>
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
      </Routes>
    </Router>
    </AuthProvider>
  );
}