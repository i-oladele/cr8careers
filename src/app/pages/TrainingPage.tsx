import { Link } from "react-router-dom";
import svgPaths from "../../imports/Home/svg-trfy73921z";

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

function TrainingCard({ title, description, duration, level, icon }: { 
  title: string; 
  description: string; 
  duration: string; 
  level: string; 
  icon: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="w-12 h-12 bg-[#ed2a10] text-white rounded-lg flex items-center justify-center mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-3">{title}</h3>
      <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">{description}</p>
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span>⏱️ {duration}</span>
        <span>📊 {level}</span>
      </div>
      <button className="w-full bg-[#ed2a10] text-white py-2 rounded-lg hover:bg-[#d42610] transition-colors font-['DM_Sans',sans-serif] font-semibold">
        Learn More
      </button>
    </div>
  );
}

export default function TrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#ed2a10] to-[#d42610]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
              Professional Training
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-white text-xl max-w-3xl mx-auto">
              We develop and deliver customized training programs that enhance skills, boost productivity, and drive organizational growth through continuous learning and development.
            </p>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-6">
                Transformative Learning Experiences
              </h2>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-6">
                Our training programs are designed to bridge the gap between potential and performance. We combine industry expertise with innovative learning methodologies to deliver training that makes a real impact on your organization's success.
              </p>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-8">
                From leadership development to technical skills enhancement, our comprehensive training solutions are tailored to meet the unique needs of your organization and workforce.
              </p>
              <Link to="/contact" className="bg-[#ed2a10] text-white px-6 py-3 rounded-lg hover:bg-[#d42610] transition-colors inline-block">
                <p className="font-['DM_Sans',sans-serif] font-bold">Book Training</p>
              </Link>
            </div>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#ed2a10] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎓</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d]">Skill Development</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Training Programs */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Our Training Programs
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive training solutions for every level of your organization
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <TrainingCard
              title="Leadership Development"
              description="Build strong leaders with our comprehensive leadership training programs."
              duration="3-6 months"
              level="Executive"
              icon="👑"
            />
            <TrainingCard
              title="Technical Skills"
              description="Enhance technical capabilities with hands-on training and workshops."
              duration="1-3 months"
              level="Professional"
              icon="💻"
            />
            <TrainingCard
              title="Soft Skills"
              description="Develop essential interpersonal skills for workplace success."
              duration="2-4 weeks"
              level="All Levels"
              icon="🤝"
            />
            <TrainingCard
              title="Sales Excellence"
              description="Master sales techniques and customer relationship management."
              duration="6-8 weeks"
              level="Professional"
              icon="💼"
            />
            <TrainingCard
              title="HR Management"
              description="Comprehensive HR training for modern workplace challenges."
              duration="2-4 months"
              level="Managerial"
              icon="👥"
            />
            <TrainingCard
              title="Digital Marketing"
              description="Learn digital marketing strategies and tools for business growth."
              duration="4-6 weeks"
              level="Professional"
              icon="📱"
            />
          </div>
        </div>
      </section>

      {/* Training Methods */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Training Delivery Methods
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Flexible learning options to suit your organization's needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "In-Person Training",
                description: "Traditional classroom training with direct instructor interaction.",
                icon: "🏫"
              },
              {
                title: "Virtual Learning",
                description: "Live online sessions with interactive participation.",
                icon: "💻"
              },
              {
                title: "Self-Paced",
                description: "Flexible online courses that learn at your own pace.",
                icon: "⏰"
              },
              {
                title: "Blended Learning",
                description: "Combination of online and in-person training methods.",
                icon: "🔄"
              }
            ].map((method, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-16 h-16 bg-[#ed2a10] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">{method.icon}</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg mb-2">{method.title}</h3>
                <p className="font-['DM_Sans',sans-serif] text-gray-600 text-sm">{method.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Corporate Training */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#ed2a10] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🏢</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d]">Corporate Solutions</h3>
              </div>
            </div>
            <div>
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-6">
                Corporate Training Solutions
              </h2>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-6">
                We partner with organizations to design and deliver custom training programs that address specific business challenges and objectives. Our corporate training solutions are tailored to your industry, culture, and strategic goals.
              </p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="font-['DM_Sans',sans-serif] text-gray-700">Custom curriculum development</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="font-['DM_Sans',sans-serif] text-gray-700">On-site and off-site training options</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="font-['DM_Sans',sans-serif] text-gray-700">Post-training assessment and certification</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-1">•</span>
                  <span className="font-['DM_Sans',sans-serif] text-gray-700">Ongoing support and follow-up sessions</span>
                </li>
              </ul>
              <Link to="/contact" className="bg-[#ed2a10] text-white px-6 py-3 rounded-lg hover:bg-[#d42610] transition-colors inline-block">
                <p className="font-['DM_Sans',sans-serif] font-bold">Get Corporate Quote</p>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#ed2a10]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-6">
            Invest in Your Team's Growth
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-white text-lg mb-8">
            Let's design a training program that transforms your workforce and drives business success
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-[#ed2a10] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Start Training</p>
            </Link>
            <Link to="/courses" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#ed2a10] transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">View Courses</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
