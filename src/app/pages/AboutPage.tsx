import { Link } from "react-router-dom";
import svgPaths from "../../imports/Home/svg-trfy73921z";

// Raster images using figma:asset scheme
import imgHappyBusinessColleaguesEnjoyingTeamSuccess1 from "figma:asset/dbde12ac83019448fd7d1c3b4f482b84dbf00a86.png";
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
            <Link to="/" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm cursor-pointer hover:text-[#ed2a10] transition-colors">Home</Link>
            <Link to="/services" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm cursor-pointer hover:text-[#ed2a10] transition-colors">Services</Link>
            <p className="font-['DM_Sans',sans-serif] font-bold text-[#ed2a10] text-sm cursor-pointer">About Us</p>
            <Link to="/contact" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm cursor-pointer hover:text-[#ed2a10] transition-colors">Contact Us</Link>
            <Link to="/insight-centre" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm cursor-pointer hover:text-[#ed2a10] transition-colors">Insight Centre</Link>
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

function TeamMemberCard({ name, role, image, description }: { 
  name: string; 
  role: string; 
  image: string; 
  description: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <div className="w-24 h-24 bg-gray-400 rounded-full"></div>
      </div>
      <div className="p-6">
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-2">{name}</h3>
        <p className="font-['DM_Sans',sans-serif] text-[#f58c21] font-semibold mb-3">{role}</p>
        <p className="font-['DM_Sans',sans-serif] text-gray-600 text-sm">{description}</p>
      </div>
    </div>
  );
}

function TimelineItem({ year, title, description }: { year: string; title: string; description: string }) {
  return (
    <div className="flex gap-6">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 bg-[#016e71] text-white rounded-full flex items-center justify-center flex-shrink-0">
          <span className="font-['DM_Sans',sans-serif] font-bold text-sm">{year}</span>
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

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#016e71] to-[#f58c21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
                About Cr8Careers
              </h1>
              <p className="font-['DM_Sans',sans-serif] text-white text-xl mb-8">
                We are a premier HR solutions provider dedicated to transforming organizations through innovative talent management and strategic workforce development.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/contact" className="bg-white text-[#016e71] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
                  <p className="font-['DM_Sans',sans-serif] font-bold">Get in Touch</p>
                </Link>
                <Link to="/services" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#016e71] transition-colors">
                  <p className="font-['DM_Sans',sans-serif] font-bold">Our Services</p>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                alt="Our team" 
                className="w-full h-auto rounded-2xl object-cover shadow-2xl" 
                src={imgHappyBusinessColleaguesEnjoyingTeamSuccess1} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="text-center md:text-left">
              <div className="w-16 h-16 bg-[#016e71] text-white rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6">
                <span className="text-2xl">🎯</span>
              </div>
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">Our Mission</h2>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 leading-relaxed">
                To bridge the gap between vision and execution by connecting top-tier talent with world-class organizations through innovative recruitment, training, and HR solutions that drive sustainable growth.
              </p>
            </div>
            <div className="text-center md:text-left">
              <div className="w-16 h-16 bg-[#f58c21] text-white rounded-full flex items-center justify-center mx-auto md:mx-0 mb-6">
                <span className="text-2xl">👁️</span>
              </div>
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">Our Vision</h2>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 leading-relaxed">
                To be the leading HR partner in Africa, recognized for our excellence in talent development, organizational transformation, and innovative workforce solutions that empower businesses to thrive in the global marketplace.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-4">
              Our Core Values
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "Excellence", description: "We deliver exceptional quality in every service we provide", color: "bg-[#016e71]" },
              { title: "Integrity", description: "We operate with transparency and honesty in all our dealings", color: "bg-[#f58c21]" },
              { title: "Innovation", description: "We embrace creative solutions and forward-thinking approaches", color: "bg-[#ed2a10]" },
              { title: "Partnership", description: "We build lasting relationships based on trust and mutual success", color: "bg-[#1d1d1d]" }
            ].map((value, index) => (
              <div key={index} className="text-center">
                <div className={`w-20 h-20 ${value.color} text-white rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <span className="text-3xl">{value.title[0]}</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl mb-2">{value.title}</h3>
                <p className="font-['DM_Sans',sans-serif] text-gray-600 text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-4">
              Our Journey
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Key milestones in our growth story
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <TimelineItem
              year="2018"
              title="Founded"
              description="Cr8Careers was established with a vision to transform HR services in Nigeria"
            />
            <TimelineItem
              year="2020"
              title="Expansion"
              description="Expanded our services to include comprehensive training and development programs"
            />
            <TimelineItem
              year="2022"
              title="Innovation"
              description="Launched our proprietary talent assessment and matching platform"
            />
            <TimelineItem
              year="2024"
              title="Growth"
              description="Served over 500 companies and placed 10,000+ professionals in key roles"
            />
            <TimelineItem
              year="2026"
              title="Future"
              description="Continuing to innovate and expand our impact across Africa"
            />
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-4">
              Meet Our Team
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              The passionate professionals behind our success
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <TeamMemberCard
              name="Sarah Johnson"
              role="CEO & Founder"
              image=""
              description="Visionary leader with 15+ years in HR and talent management"
            />
            <TeamMemberCard
              name="Michael Chen"
              role="Head of Operations"
              image=""
              description="Expert in process optimization and service delivery excellence"
            />
            <TeamMemberCard
              name="Amara Okafor"
              role="Director of Training"
              image=""
              description="Specialized in learning & development and organizational psychology"
            />
            <TeamMemberCard
              name="David Williams"
              role="Client Relations Lead"
              image=""
              description="Dedicated to building lasting partnerships with our clients"
            />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
