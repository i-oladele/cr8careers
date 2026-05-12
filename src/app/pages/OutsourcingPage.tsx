import SiteHeader from "../components/SiteHeader";
import { Link } from "react-router-dom";
import svgPaths from "../../imports/Home/svg-trfy73921z";

// Raster images using figma:asset scheme
import imgCr8CareersLogoDarkBg1 from "figma:asset/78c12288adf22ec492cc6d1dd1419b64d5c0cf33.png";


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

function BenefitCard({ title, description, icon }: { title: string; description: string; icon: string }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="w-12 h-12 bg-[#f58c21] text-white rounded-lg flex items-center justify-center mb-4">
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-3">{title}</h3>
      <p className="font-['DM_Sans',sans-serif] text-gray-600">{description}</p>
    </div>
  );
}

export default function OutsourcingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#f58c21] to-[#e67e1a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
              Staff Outsourcing
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-white text-xl max-w-3xl mx-auto">
              We consistently train personnel for specific roles and assign them under our Staff Outsourcing to interested clients, reducing your overhead while maintaining quality workforce.
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
                Flexible Workforce Solutions
              </h2>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-6">
                Our Staff Outsourcing service provides you with access to pre-trained, qualified professionals without the burden of direct employment responsibilities. We handle recruitment, training, payroll, and HR management while you focus on your core business operations.
              </p>
              <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-8">
                Whether you need temporary staff for specific projects, seasonal workforce, or long-term outsourcing solutions, our flexible approach ensures you get the right talent when you need it, without the administrative overhead.
              </p>
              <Link to="/contact" className="bg-[#f58c21] text-white px-6 py-3 rounded-lg hover:bg-[#e67e1a] transition-colors inline-block">
                <p className="font-['DM_Sans',sans-serif] font-bold">Outsource Staff</p>
              </Link>
            </div>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-[#f58c21] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">👔</span>
                </div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d">Professional Staff</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Why Choose Our Outsourcing?
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Benefits that transform your business operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <BenefitCard
              title="Cost Efficiency"
              description="Reduce overhead costs by up to 40% with our streamlined outsourcing model."
              icon="💰"
            />
            <BenefitCard
              title="Quick Deployment"
              description="Get qualified staff deployed within 48 hours of request confirmation."
              icon="⚡"
            />
            <BenefitCard
              title="Trained Professionals"
              description="Access to our pool of pre-trained and continuously upskilled professionals."
              icon="🎓"
            />
            <BenefitCard
              title="Risk Management"
                  description="We handle all employment compliance, insurance, and legal responsibilities."
              icon="🛡️"
            />
            <BenefitCard
              title="Scalability"
              description="Easily scale your workforce up or down based on business needs."
              icon="📈"
            />
            <BenefitCard
              title="Focus on Core Business"
              description="Free up your time to focus on strategic business growth initiatives."
              icon="🎯"
            />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Outsourcing Services
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Comprehensive staffing solutions for various business needs
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Administrative Staff",
                description: "Professional receptionists, office assistants, and administrative support staff.",
                roles: ["Receptionists", "Office Assistants", "Data Entry Operators", "File Clerks"]
              },
              {
                title: "Customer Service",
                description: "Trained customer service representatives for call centers and support teams.",
                roles: ["Call Center Agents", "Customer Support", "Help Desk Staff", "Telemarketers"]
              },
              {
                title: "Technical Staff",
                description: "Skilled technical personnel for various operational and maintenance roles.",
                roles: ["IT Support", "Maintenance Staff", "Technicians", "Quality Control"]
              },
              {
                title: "Sales & Marketing",
                description: "Dynamic sales and marketing professionals to drive your business growth.",
                roles: ["Sales Executives", "Marketing Assistants", "Promotion Staff", "Field Agents"]
              }
            ].map((service, index) => (
              <div key={index} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-3">{service.title}</h3>
                <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">{service.description}</p>
                <div className="flex flex-wrap gap-2">
                  {service.roles.map((role, roleIndex) => (
                    <span key={roleIndex} className="bg-[#f58c21] text-white text-xs px-3 py-1 rounded-full">
                      {role}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Our Outsourcing Process
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Simple steps to get your outsourced team up and running
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: "01",
                title: "Needs Assessment",
                description: "Understanding your requirements and role specifications"
              },
              {
                step: "02", 
                title: "Staff Selection",
                description: "Matching pre-trained professionals to your needs"
              },
              {
                step: "03",
                title: "Onboarding",
                description: "Smooth integration of staff into your operations"
              },
              {
                step: "04",
                title: "Ongoing Support",
                description: "Continuous management and performance monitoring"
              }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-[#f58c21] text-white rounded-full flex items-center justify-center mx-auto mb-4">
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
      <section className="py-16 lg:py-24 bg-[#f58c21]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-6">
            Ready to Optimize Your Workforce?
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-white text-lg mb-8">
            Let's discuss how our outsourcing solutions can benefit your business
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-white text-[#f58c21] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Get Started</p>
            </Link>
            <Link to="/services" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-[#f58c21] transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Other Services</p>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
