import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import svgPaths from "../../imports/Home/svg-trfy73921z";
import { fetchCourses, CourseRow } from "../../lib/courseService";

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

function CourseCard({ title, description, duration, level, price, category, courseId, thumbnailUrl }: {
  title: string;
  description: string;
  duration: string;
  level: string;
  price: string;
  category: string;
  courseId: string;
  thumbnailUrl?: string;
}) {
  const getCardStyles = () => {
    switch(category) {
      case 'Leadership':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          titleColor: 'text-black',
          arrowColor: '#016e71',
          buttonBg: 'bg-[#333333]',
          buttonHover: 'hover:bg-[#555555]',
          number: '01'
        };
      case 'Technical':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          titleColor: 'text-black',
          arrowColor: '#f58c21',
          buttonBg: 'bg-[#333333]',
          buttonHover: 'hover:bg-[#555555]',
          number: '02'
        };
      case 'Soft Skills':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          titleColor: 'text-black',
          arrowColor: '#ed2a10',
          buttonBg: 'bg-[#333333]',
          buttonHover: 'hover:bg-[#555555]',
          number: '03'
        };
      case 'Career':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          titleColor: 'text-black',
          arrowColor: '#1d1d1d',
          buttonBg: 'bg-[#333333]',
          buttonHover: 'hover:bg-[#555555]',
          number: '04'
        };
      case 'Core Hospitality':
        return {
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          titleColor: 'text-black',
          arrowColor: '#8b5cf6',
          buttonBg: 'bg-[#333333]',
          buttonHover: 'hover:bg-[#555555]',
          number: '05'
        };
      default:
        return {
          bgColor: 'bg-white',
          borderColor: 'border-gray-200',
          titleColor: 'text-black',
          arrowColor: '#6b7280',
          buttonBg: 'bg-[#333333]',
          buttonHover: 'hover:bg-[#555555]',
          number: '06'
        };
    }
  };

  const styles = getCardStyles();

  return (
    <div className={`relative rounded-xl ${styles.bgColor} border ${styles.borderColor} overflow-hidden hover:shadow-lg transition-shadow flex flex-col`}>
      {thumbnailUrl && (
        <div className="w-full aspect-video bg-gray-100 shrink-0">
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="flex flex-col gap-4 flex-1 p-6">
        <div className="flex items-start justify-between">
          <h3 className={`font-['DM_Sans',sans-serif] font-bold text-2xl tracking-tight ${styles.titleColor}`}>{title}</h3>
          <span className={`text-xs px-3 py-1 rounded-full border whitespace-nowrap ${
            category === 'Leadership' ? 'bg-[#4062B9] text-white border-[#4062B9]' :
            category === 'Technical' ? 'bg-[#ED2A10] text-white border-[#ED2A10]' :
            category === 'Soft Skills' ? 'bg-[#BB6BD9] text-white border-[#BB6BD9]' :
            category === 'Career' ? 'bg-[#EB9B07] text-white border-[#EB9B07]' :
            category === 'Core Hospitality' ? 'bg-[#D64EB8] text-white border-[#D64EB8]' :
            'border-gray-200 text-gray-700'
          }`}>
            {category}
          </span>
        </div>
        <p className="font-['DM_Sans',sans-serif] text-black text-lg">{description.length > 120 ? description.slice(0, 120) + '...' : description}</p>
        
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-2">
            <img src="/ClockCountdown.svg" alt="Duration" className="w-4 h-4 filter brightness-0 opacity-50" />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-2">
            {level === 'Beginner' ? (
              <img src="/StackSimple.svg" alt="Beginner" className="w-4 h-4 filter brightness-0 opacity-50" />
            ) : level === 'Intermediate' ? (
              <img src="/Stack.svg" alt="Intermediate" className="w-4 h-4 filter brightness-0 opacity-50" />
            ) : level === 'Advanced' ? (
              <img src="/Star.svg" alt="Advanced" className="w-4 h-4 filter brightness-0 opacity-50" />
            ) : (
              <span>📚</span>
            )}
            <span>{level}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className={`font-['DM_Sans',sans-serif] font-bold text-2xl ${styles.titleColor}`}>
            {price}
          </div>
          <Link to={`/course/${courseId}`}>
            <button className={`${styles.buttonBg} text-white px-6 py-2 rounded-lg ${styles.buttonHover} transition-colors font-['DM_Sans',sans-serif] font-bold flex items-center gap-2`}>
              Start Course
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
                <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="white" />
              </svg>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}


export default function CoursesPage() {
  const [selectedCategory, setSelectedCategory] = useState('All Courses');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDuration, setSelectedDuration] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [courses, setCourses] = useState<CourseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const filterDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterDropdownRef.current && !filterDropdownRef.current.contains(event.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch courses from Supabase
  useEffect(() => {
    fetchCourses().then(({ data, error }) => {
      if (!error) setCourses(data);
      setLoading(false);
    });
  }, []);

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'All Courses' || course.category === selectedCategory;
    const matchesSearch = searchTerm === '' || 
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.level.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDuration = selectedDuration === 'All' || 
      (selectedDuration === 'Short' && course.duration.includes('1 week') || course.duration.includes('2 weeks') || course.duration.includes('3 weeks')) ||
      (selectedDuration === 'Medium' && course.duration.includes('4 weeks') || course.duration.includes('5 weeks') || course.duration.includes('6 weeks')) ||
      (selectedDuration === 'Long' && course.duration.includes('7 weeks') || course.duration.includes('8 weeks') || course.duration.includes('more'));
    
    const matchesLevel = selectedLevel === 'All' || course.level === selectedLevel;
    
    return matchesCategory && matchesSearch && matchesDuration && matchesLevel;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-6 lg:pb-8 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="font-['DM_Sans',sans-serif] text-black text-xl max-w-3xl mx-auto">
              Elevate your career with our comprehensive training programs designed for professionals at all levels
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filters */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative flex gap-3">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Search courses by title, description, category, or level..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-3 pr-12 text-gray-900 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-[#333333] focus:ring-2 focus:ring-[#333333] focus:ring-opacity-20 font-['DM_Sans',sans-serif] text-base"
                />
                <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                  <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              {/* Filter Button */}
              <div className="relative" ref={filterDropdownRef}>
                {(selectedDuration !== 'All' || selectedLevel !== 'All') ? (
                  <button
                    onClick={() => {
                      setSelectedDuration('All');
                      setSelectedLevel('All');
                    }}
                    className="px-6 py-3 rounded-full bg-[#333333] text-white border-[#333333] transition-colors font-['DM_Sans',sans-serif] font-semibold flex items-center gap-2 hover:bg-[#555555]"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    Clear Filters
                  </button>
                ) : (
                  <button
                    onClick={() => setShowFilterDropdown(!showFilterDropdown)}
                    className="px-6 py-3 rounded-full bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 transition-colors font-['DM_Sans',sans-serif] font-semibold flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filter
                  </button>
                )}

                {/* Filter Dropdown */}
                {showFilterDropdown && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                    <div className="p-4">
                      <h3 className="font-['DM_Sans',sans-serif] font-semibold text-gray-900 mb-4">Filter Options</h3>
                      
                      {/* Duration Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                        <select
                          value={selectedDuration}
                          onChange={(e) => setSelectedDuration(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-[#333333] font-['DM_Sans',sans-serif]"
                        >
                          <option value="All">All Durations</option>
                          <option value="Short">Short (1-3 weeks)</option>
                          <option value="Medium">Medium (4-6 weeks)</option>
                          <option value="Long">Long (7+ weeks)</option>
                        </select>
                      </div>

                      {/* Level Filter */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                        <select
                          value={selectedLevel}
                          onChange={(e) => setSelectedLevel(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#333333] focus:border-[#333333] font-['DM_Sans',sans-serif]"
                        >
                          <option value="All">All Levels</option>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedDuration('All');
                            setSelectedLevel('All');
                          }}
                          className="flex-1 px-3 py-2 text-sm font-['DM_Sans',sans-serif] text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                        >
                          Clear
                        </button>
                        <button
                          onClick={() => setShowFilterDropdown(false)}
                          className="flex-1 px-3 py-2 text-sm font-['DM_Sans',sans-serif] text-white bg-[#333333] rounded-md hover:bg-[#555555] transition-colors"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-4">
            {['All Courses', 'Leadership', 'Technical', 'Soft Skills', 'Career', 'Core Hospitality'].map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-['DM_Sans',sans-serif] font-semibold transition-colors whitespace-nowrap ${
                  selectedCategory === category 
                    ? category === 'All Courses' 
                      ? 'bg-[#333333] text-white'
                      : category === 'Leadership'
                      ? 'bg-[#4062B9] text-white'
                      : category === 'Technical'
                      ? 'bg-[#ED2A10] text-white'
                      : category === 'Soft Skills'
                      ? 'bg-[#BB6BD9] text-white'
                      : category === 'Career'
                      ? 'bg-[#EB9B07] text-white'
                      : category === 'Core Hospitality'
                      ? 'bg-[#D64EB8] text-white'
                      : 'bg-gray-100 text-gray-700'
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
            {loading ? (
              <div className="col-span-3 text-center py-16 font-['DM_Sans',sans-serif] text-gray-500">Loading courses...</div>
            ) : filteredCourses.map((course, index) => (
              <CourseCard
                key={course.id ?? index}
                title={course.title}
                description={course.description}
                duration={course.duration}
                level={course.level}
                price={course.price}
                category={course.category}
                courseId={course.id}
                thumbnailUrl={course.thumbnail_url}
              />
            ))}
          </div>
          
          {filteredCourses.length === 0 && (
            <div className="text-center py-12">
              <p className="font-['DM_Sans',sans-serif] text-gray-500 text-lg">
                {(() => {
                  const hasActiveFilters = searchTerm || selectedCategory !== 'All Courses' || selectedDuration !== 'All' || selectedLevel !== 'All';
                  if (!hasActiveFilters) return "No courses available.";
                  
                  let message = "No courses found";
                  const conditions = [];
                  
                  if (searchTerm) conditions.push(`matching "${searchTerm}"`);
                  if (selectedCategory !== 'All Courses') conditions.push(`in ${selectedCategory}`);
                  if (selectedDuration !== 'All') conditions.push(`with ${selectedDuration.toLowerCase()} duration`);
                  if (selectedLevel !== 'All') conditions.push(`at ${selectedLevel.toLowerCase()} level`);
                  
                  return message + " " + conditions.join(" ") + ".";
                })()}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
                {(searchTerm || selectedDuration !== 'All' || selectedLevel !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedDuration('All');
                      setSelectedLevel('All');
                    }}
                    className="text-[#333333] hover:text-[#555555] font-['DM_Sans',sans-serif] font-semibold"
                  >
                    Clear Filters
                  </button>
                )}
                <button
                  onClick={() => {
                    setSelectedCategory('All Courses');
                    setSearchTerm('');
                    setSelectedDuration('All');
                    setSelectedLevel('All');
                  }}
                  className="text-[#f58c21] hover:text-[#e67e1a] font-['DM_Sans',sans-serif] font-semibold"
                >
                  View All Courses
                </button>
              </div>
            </div>
          )}
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
