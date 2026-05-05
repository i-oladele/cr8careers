import { Link } from "react-router-dom";
import svgPaths from "../../imports/Home/svg-trfy73921z";
import coursesData from "../data/courseContent";

// Raster images using figma:asset scheme
import imgCr8CareersLogoDarkBg1 from "figma:asset/78c12288adf22ec492cc6d1dd1419b64d5c0cf33.png";

// Header Component
function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full bg-white z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-36">
          {/* Logo */}
          <Link to="/" className="h-24 w-48">
            <img alt="CR8Careers Logo" className="h-full w-full object-contain" src="/logo.png" />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex gap-8 items-center">
            <Link to="/" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Home</Link>
            <Link to="/services" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Services</Link>
            <Link to="/about" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">About Us</Link>
            <Link to="/contact" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Contact Us</Link>
            <Link to="/insight-centre" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm hover:text-[#ed2a10] transition-colors">Insight Centre</Link>
          </nav>

          {/* Take a Course Button */}
          <Link to="/courses" className="bg-[#f58c21] hover:bg-[#e67e1a] transition-colors px-6 py-2.5 rounded-lg">
            <p className="font-['DM_Sans',sans-serif] font-bold text-black text-sm tracking-tight">Take a Course</p>
          </Link>
        </div>
      </div>
    </header>
  );
}

// Footer Component
function Footer() {
  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="h-16 w-40 mb-4">
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <img alt="CR8Careers Logo" className="h-[287.18%] left-[-11.52%] max-w-none top-[-84.62%] w-[111.52%]" src={imgCr8CareersLogoDarkBg1} />
              </div>
            </div>
            <p className="font-['DM_Sans',sans-serif] font-bold text-lg">
              repositioning HR<br />repositioning people
            </p>
          </div>
          <div>
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-[#f58c21] text-2xl mb-6">Follow Us</h3>
            <div className="space-y-3">
              <p className="font-['DM_Sans',sans-serif] text-base cursor-pointer hover:text-[#f58c21] transition-colors">Facebook</p>
              <p className="font-['DM_Sans',sans-serif] text-base cursor-pointer hover:text-[#f58c21] transition-colors">LinkedIn</p>
              <p className="font-['DM_Sans',sans-serif] text-base cursor-pointer hover:text-[#f58c21] transition-colors">Instagram</p>
            </div>
          </div>
          <div>
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-[#f58c21] text-2xl mb-6">Stay Updated</h3>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="Enter your Email" 
                className="bg-white text-black px-4 py-3 rounded-lg flex-1 max-w-xs"
              />
              <button className="bg-[#ed2a10] hover:bg-[#d42610] transition-colors p-3 rounded-lg">
                <div className="w-6 h-6">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p2b7c1080} fill="white" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 pt-8 border-t border-gray-800">
          <div className="w-6 h-6">
            <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
              <path d={svgPaths.p2344af80} fill="white" />
            </svg>
          </div>
          <p className="font-['DM_Sans',sans-serif] text-lg">Copyright Cr8Careers 2026</p>
        </div>
      </div>
    </footer>
  );
}

function CourseCard({ title, description, duration, level, price, category, courseId }: { 
  title: string; 
  description: string; 
  duration: string; 
  level: string; 
  price: string; 
  category: string;
  courseId: string;
}) {
  const categoryColors: { [key: string]: string } = {
    'Leadership': 'bg-[#016e71]',
    'Technical': 'bg-[#f58c21]',
    'Soft Skills': 'bg-[#ed2a10]',
    'Career': 'bg-[#1d1d1d]'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <div className="w-20 h-20 bg-gray-400 rounded-lg"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className={`${categoryColors[category] || 'bg-gray-500'} text-white text-xs px-3 py-1 rounded-full`}>
            {category}
          </span>
          <span className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">{level}</span>
        </div>
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-3">{title}</h3>
        <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">{description}</p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-gray-500 text-sm">⏱️</span>
            <span className="font-['DM_Sans',sans-serif] text-gray-600 text-sm">{duration}</span>
          </div>
          <div className="font-['DM_Sans',sans-serif] font-bold text-[#f58c21] text-lg">{price}</div>
        </div>
        <Link 
          to={`/course/${courseId}`}
          className="block w-full bg-[#016e71] text-white py-3 rounded-lg hover:bg-[#015a5d] transition-colors font-['DM_Sans',sans-serif] font-bold text-center"
        >
          Start Course
        </Link>
      </div>
    </div>
  );
}

export default function CoursesPage() {
  const courses = coursesData.map(course => ({
    title: course.title,
    description: course.description,
    duration: course.duration,
    level: course.level,
    price: course.price,
    category: course.category,
    courseId: course.id
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#f58c21] to-[#ed2a10]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
              Professional Development Courses
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-white text-xl max-w-3xl mx-auto">
              Elevate your career with our comprehensive training programs designed for professionals at all levels
            </p>
          </div>
        </div>
      </section>

      {/* Course Categories */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {['All Courses', 'Leadership', 'Technical', 'Soft Skills', 'Career'].map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-['DM_Sans',sans-serif] font-semibold transition-colors ${
                  category === 'All Courses' 
                    ? 'bg-[#f58c21] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Courses Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => (
              <CourseCard
                key={index}
                title={course.title}
                description={course.description}
                duration={course.duration}
                level={course.level}
                price={course.price}
                category={course.category}
                courseId={course.courseId}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-4">
              Why Choose Our Courses?
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Experience the difference with our expert-led, practical training programs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Expert Instructors", description: "Learn from industry professionals with real-world experience", icon: "👨‍🏫" },
              { title: "Flexible Learning", description: "Study at your own pace with our online and offline options", icon: "📚" },
              { title: "Certification", description: "Receive recognized certificates upon completion", icon: "🏆" }
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-[#f58c21] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl mb-2">{feature.title}</h3>
                <p className="font-['DM_Sans',sans-serif] text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#016e71]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-6">
            Ready to Start Learning?
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-white text-lg mb-8">
            Join thousands of professionals who have transformed their careers with our courses
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-[#016e71] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Browse All Courses</p>
            </button>
            <Link to="/contact" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#016e71] transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Get Consultation</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
