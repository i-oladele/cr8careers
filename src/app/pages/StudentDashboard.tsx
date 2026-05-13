import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import coursesData from '../data/courseContent';
import { progressTracker } from '../utils/progressTracking';
import { downloadCertificate } from '../components/CertificateGenerator';
import { useAuth } from '../context/AuthContext';


function StatsCard({ title, value, icon, color }: { 
  title: string; 
  value: string | number; 
  icon: string; 
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white text-xl`}>
          {icon}
        </div>
        <span className="font-['DM_Sans',sans-serif] text-2xl font-bold text-[#1d1d1d]">{value}</span>
      </div>
      <h3 className="font-['DM_Sans',sans-serif] text-gray-600 text-sm">{title}</h3>
    </div>
  );
}

function CourseProgressCard({ course, progress, userName }: {
  course: any;
  progress: any;
  userName: string;
}) {
  const progressPercentage = progress ? progress.progressPercentage : 0;
  const isCompleted = progress?.completed || false;
  
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-1">
            {course.title}
          </h3>
          <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">
            {course.duration} • {course.level}
          </p>
        </div>
        {isCompleted && (
          <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-['DM_Sans',sans-serif] font-semibold">
            Completed
          </span>
        )}
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="font-['DM_Sans',sans-serif] text-gray-600">Progress</span>
          <span className="font-['DM_Sans',sans-serif] font-semibold">{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#0d9488] h-2 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      <div className="flex gap-3">
        <Link 
          to={`/course/${course.id}`}
          className="flex-1 bg-[#0d9488] text-white py-2 px-4 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold text-center text-sm"
        >
          {isCompleted ? 'Review' : 'Continue'}
        </Link>
        {isCompleted && (
          <button
            onClick={() => downloadCertificate(course, userName)}
            className="flex-1 border border-[#0d9488] text-[#0d9488] py-2 px-4 rounded-lg hover:bg-[#0d9488] hover:text-white transition-colors font-['DM_Sans',sans-serif] font-semibold text-sm"
          >
            Certificate
          </button>
        )}
      </div>
    </div>
  );
}

function CertificateCard({ certificate, userName }: { certificate: any; userName: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-1">
            {certificate.courseName}
          </h3>
          <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">
            Issued on {new Date(certificate.issuedDate).toLocaleDateString()}
          </p>
        </div>
        <div className="w-12 h-12 bg-[#f58c21] rounded-lg flex items-center justify-center text-white">
          🏆
        </div>
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={() => {
            const course = coursesData.find(c => c.id === certificate.courseId);
            if (course) {
              downloadCertificate(course, userName);
            }
          }}
          className="flex-1 bg-[#0d9488] text-white py-2 px-4 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold text-sm"
        >
          Download
        </button>
        <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors font-['DM_Sans',sans-serif] font-semibold text-sm">
          Share
        </button>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    coursesEnrolled: 0,
    coursesCompleted: 0,
    totalLessonsCompleted: 0,
    totalCertificates: 0,
    averageProgress: 0
  });
  const [enrolledCourses, setEnrolledCourses] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Learner';

  useEffect(() => {
    const profile = progressTracker.getUserProfile();
    if (!profile) {
      progressTracker.initializeUserProfile(userName, user?.email ?? '');
    }

    // Load stats
    const learningStats = progressTracker.getLearningStats();
    setStats(learningStats);

    // Load enrolled courses
    const enrolledIds = progressTracker.getEnrolledCourses();
    const courses = enrolledIds.map(id => {
      const course = coursesData.find(c => c.id === id);
      const progress = progressTracker.getCourseProgress(id);
      return { ...course, progress };
    }).filter(Boolean);
    
    setEnrolledCourses(courses);

    // Load certificates
    const userCertificates = progressTracker.getCertificates();
    setCertificates(userCertificates);
  }, [userName, user?.email]);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-2">
              Welcome back, {userName}!
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-gray-600">
              Track your learning progress and manage your certificates
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Courses Enrolled" 
              value={stats.coursesEnrolled} 
              icon="📚"
              color="bg-blue-500"
            />
            <StatsCard 
              title="Courses Completed" 
              value={stats.coursesCompleted} 
              icon="✅"
              color="bg-green-500"
            />
            <StatsCard 
              title="Lessons Completed" 
              value={stats.totalLessonsCompleted} 
              icon="📖"
              color="bg-purple-500"
            />
            <StatsCard 
              title="Certificates Earned" 
              value={stats.totalCertificates} 
              icon="🏆"
              color="bg-yellow-500"
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Progress */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d]">
                  My Courses
                </h2>
                <Link 
                  to="/courses"
                  className="text-[#0d9488] hover:text-[#0a7a70] font-['DM_Sans',sans-serif] font-semibold text-sm"
                >
                  Browse Courses →
                </Link>
              </div>
              
              <div className="space-y-4">
                {enrolledCourses.length > 0 ? (
                  enrolledCourses.map((course, index) => (
                    <CourseProgressCard
                      key={index}
                      course={course}
                      progress={course.progress}
                      userName={userName}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      📚
                    </div>
                    <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-2">
                      No courses yet
                    </h3>
                    <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">
                      Start your learning journey by enrolling in a course
                    </p>
                    <Link 
                      to="/courses"
                      className="inline-block bg-[#0d9488] text-white py-2 px-6 rounded-lg hover:bg-[#0a7a70] transition-colors font-['DM_Sans',sans-serif] font-semibold"
                    >
                      Browse Courses
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Certificates */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d]">
                  My Certificates
                </h2>
              </div>
              
              <div className="space-y-4">
                {certificates.length > 0 ? (
                  certificates.map((certificate, index) => (
                    <CertificateCard
                      key={index}
                      certificate={certificate}
                      userName={userName}
                    />
                  ))
                ) : (
                  <div className="bg-white rounded-xl shadow-lg p-6 text-center">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      🏆
                    </div>
                    <h3 className="font-['DM_Sans',sans-serif] font-semibold text-[#1d1d1d] mb-2">
                      No certificates yet
                    </h3>
                    <p className="font-['DM_Sans',sans-serif] text-sm text-gray-600">
                      Complete courses to earn certificates
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
