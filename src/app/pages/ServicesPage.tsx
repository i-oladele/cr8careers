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
            <Link to="/" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm cursor-pointer hover:text-[#ed2a10] transition-colors">Home</Link>
            <p className="font-['DM_Sans',sans-serif] font-bold text-[#ed2a10] text-sm cursor-pointer">Services</p>
            <Link to="/about" className="font-['DM_Sans',sans-serif] text-[#1d1d1d] text-sm cursor-pointer hover:text-[#ed2a10] transition-colors">About Us</Link>
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

function ServiceDetailCard({ title, description, features, color }: { 
  title: string; 
  description: string; 
  features: string[]; 
  color: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
      <div className="flex items-center gap-4 mb-6">
        <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center`}>
          <div className="w-6 h-6 bg-white rounded"></div>
        </div>
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#1d1d1d]">{title}</h3>
      </div>
      <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-6 leading-relaxed">{description}</p>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start gap-3">
            <div className="w-5 h-5 bg-green-500 rounded-full flex-shrink-0 mt-0.5"></div>
            <span className="font-['DM_Sans',sans-serif] text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`${color} text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity`}>
        <p className="font-['DM_Sans',sans-serif] font-bold">Get Started</p>
      </button>
    </div>
  );
}

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#016e71] to-[#f58c21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
              Our Services
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-white text-xl max-w-3xl mx-auto">
              Comprehensive HR solutions designed to transform your organization and elevate your workforce
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <ServiceDetailCard
              title="Recruitment"
              description="We proactively select and engage best-fit talents for your desired manpower framework. Our comprehensive recruitment process ensures you get the right people who align with your company culture and goals."
              features={[
                "Talent Sourcing & Screening",
                "Technical & Behavioral Assessments",
                "Background Verification",
                "Offer Management & Onboarding Support",
                "Executive Search Services"
              ]}
              color="bg-[#016e71]"
            />
            
            <ServiceDetailCard
              title="Outsourcing"
              description="We consistently train personnel for specific roles and assign them under our Staff Outsourcing to interested clients. Reduce your overhead while maintaining quality workforce."
              features={[
                "Trained Personnel Deployment",
                "Payroll & Benefits Management",
                "Performance Monitoring",
                "Compliance & Risk Management",
                "Flexible Staffing Solutions"
              ]}
              color="bg-[#f58c21]"
            />
            
            <ServiceDetailCard
              title="Training"
              description="We develop and deliver customized training programs that enhance skills, boost productivity, and drive organizational growth. From leadership development to technical skills, we've got you covered."
              features={[
                "Leadership Development Programs",
                "Technical Skills Training",
                "Soft Skills Enhancement",
                "Team Building Workshops",
                "Custom Training Solutions"
              ]}
              color="bg-[#ed2a10]"
            />
            
            <ServiceDetailCard
              title="Other Consulting"
              description="Depending on where you are in the development phase, we offer a range of services to support your endeavours and ensure excellent project delivery and post-development performance."
              features={[
                "HR Policy Development",
                "Organizational Restructuring",
                "Performance Management Systems",
                "Employee Engagement Strategies",
                "Compensation & Benefits Design"
              ]}
              color="bg-[#1d1d1d]"
            />
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-4">
              Our Process
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              A systematic approach to delivering exceptional HR solutions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { step: "01", title: "Consultation", description: "Understanding your unique needs and challenges" },
              { step: "02", title: "Strategy", description: "Developing tailored solutions for your organization" },
              { step: "03", title: "Implementation", description: "Executing plans with precision and care" },
              { step: "04", title: "Support", description: "Ongoing assistance and optimization" }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#016e71] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="font-['DM_Sans',sans-serif] font-bold text-xl">{item.step}</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl mb-2">{item.title}</h3>
                <p className="font-['DM_Sans',sans-serif] text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#016e71]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-6">
            Ready to Transform Your HR?
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-white text-lg mb-8">
            Let's discuss how our services can help your organization thrive
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-[#016e71] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Contact Us</p>
            </Link>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#016e71] transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Schedule Consultation</p>
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
