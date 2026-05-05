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

function ProcessStep({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-[#016e71] text-white rounded-full flex items-center justify-center flex-shrink-0">
          <span className="font-['DM_Sans',sans-serif] font-bold text-sm">{number}</span>
        </div>
        <div className="w-0.5 h-full bg-gray-300"></div>
      </div>
      <div className="pb-8">
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-2">{title}</h3>
        <p className="font-['DM_Sans',sans-serif] text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default function RecruitmentPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#016e71] to-[#015a5d]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
              Recruitment Services
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-white text-xl max-w-3xl mx-auto">
              We proactively select and engage best-fit talents for your desired manpower framework, ensuring your organization thrives with the right people.
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
                Strategic Talent Acquisition
              </h2>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-6">
                Our recruitment services go beyond traditional hiring. We partner with you to understand your unique organizational culture, business objectives, and specific talent requirements to deliver candidates who not only have the right skills but also align with your company values.
              </p>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-8">
                Whether you're looking for executive leadership, technical specialists, or building entire teams, our comprehensive recruitment approach ensures you get the right talent at the right time.
              </p>
              <Link to="/contact" className="bg-[#016e71] text-white px-6 py-3 rounded-lg hover:bg-[#015a5d] transition-colors inline-block">
                <p className="font-['DM_Sans',sans-serif] font-bold">Start Hiring</p>
              </Link>
            </div>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#016e71] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👥</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d]">Talent Matching</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Offered */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Our Recruitment Solutions
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive recruitment services tailored to meet your specific hiring needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Executive Search",
                description: "Finding top-level leadership talent for your organization's most critical positions.",
                icon: "🎯"
              },
              {
                title: "Technical Recruitment",
                description: "Specialized recruitment for IT, engineering, and technical roles across all industries.",
                icon: "💻"
              },
              {
                title: "Volume Hiring",
                description: "Scaling your workforce quickly with bulk recruitment for multiple positions simultaneously.",
                icon: "📊"
              },
              {
                title: "Contract Staffing",
                description: "Flexible temporary and contract staffing solutions for project-based or seasonal needs.",
                icon: "⏰"
              },
              {
                title: "International Recruitment",
                description: "Sourcing talent globally with expertise in immigration and cross-border hiring.",
                icon: "🌍"
              },
              {
                title: "Campus Recruitment",
                description: "Building your future workforce by recruiting fresh talent from educational institutions.",
                icon: "🎓"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-[#016e71] text-white rounded-lg flex items-center justify-center mb-4">
                  <span className="text-2xl">{service.icon}</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-3">{service.title}</h3>
                <p className="font-['DM_Sans',sans-serif] text-gray-600">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Our Recruitment Process
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              A systematic approach to finding and placing the right talent
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <ProcessStep
              number="01"
              title="Needs Analysis"
              description="We begin by understanding your organization's culture, requirements, and specific role specifications."
            />
            <ProcessStep
              number="02"
              title="Sourcing Strategy"
              description="Developing targeted sourcing strategies using our extensive network, job boards, and direct outreach."
            />
            <ProcessStep
              number="03"
              title="Screening & Assessment"
              description="Comprehensive screening including skills assessment, behavioral interviews, and cultural fit evaluation."
            />
            <ProcessStep
              number="04"
              title="Client Interviews"
              description="Coordinating and facilitating interviews between you and the shortlisted candidates."
            />
            <ProcessStep
              number="05"
              title="Offer & Onboarding"
              description="Assisting with offer negotiations and ensuring smooth onboarding of selected candidates."
            />
            <ProcessStep
              number="06"
              title="Follow-up Support"
              description="Post-placement support to ensure successful integration and retention of new hires."
            />
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Industries We Serve
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Extensive experience across diverse sectors
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[
              "Technology", "Healthcare", "Finance", "Manufacturing",
              "Retail", "Telecom", "Energy", "Education",
              "Real Estate", "Logistics", "Media", "Consulting"
            ].map((industry, index) => (
              <div key={index} className="bg-white rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <p className="font-['DM_Sans',sans-serif] font-semibold text-[#1d1d1d]">{industry}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#016e71]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-6">
            Ready to Build Your Dream Team?
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-white text-lg mb-8">
            Let's discuss your recruitment needs and find the perfect talent for your organization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-[#016e71] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Get Started</p>
            </Link>
            <Link to="/services" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#016e71] transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Other Services</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
