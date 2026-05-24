import { useState } from "react";
import { Link } from "react-router-dom";
import SiteHeader from "../components/SiteHeader";
import svgPaths from "../../imports/Home/svg-trfy73921z";

import imgHappyBusinessColleaguesEnjoyingTeamSuccess1 from "../../assets/optimized/happy-business-colleagues.jpg";
import img66076CfcA1394149A2Ce6E2218B28F4F1 from "../../assets/optimized/assessment-illustration.jpg";
import imgSideViewManMakingPlansRedecorateHouse1 from "../../assets/optimized/business-planning.jpg";
import imgCr8CareersLogoDarkBg1 from "figma:asset/78c12288adf22ec492cc6d1dd1419b64d5c0cf33.png";


// Hero Section Component
function HeroSection() {
  const imgRectangle = "/Hero.svg";
  
  return (
    <section className="relative w-full pt-64 lg:pt-72 pb-20 lg:pb-32 overflow-hidden" style={{backgroundImage: `url(${imgRectangle})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundColor: '#f9fafb'}}>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl">
          {/* Main Heading */}
          <div className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] mb-8">
            <h1 className="text-4xl md:text-5xl lg:text-6xl leading-tight tracking-tight">
              <span className="block">Repositioning <span className="italic text-[#ed2a10]">HR</span></span>
              <span className="block">Repositioning <span className="italic text-[#ed2a10]">People</span></span>
            </h1>
          </div>

          {/* Tagline */}
          <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[rgba(238,238,238,0.2)] border border-[rgba(0,0,0,0.4)] mb-6">
            <p className="font-['DM_Sans',sans-serif] font-bold text-black text-base tracking-tight">INNOVATIVE TALENT SOLUTIONS</p>
          </div>

          {/* Description */}
          <div className="font-['DM_Sans',sans-serif] text-black text-lg mb-10 max-w-3xl">
            <p className="mb-2">We bridge the gap between vision and execution,</p>
            <p className="mb-2">connecting top tier talent with world class organizations</p>
            <p>through recruitment and training.</p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/services" className="bg-[#016e71] hover:bg-[#015a5d] transition-colors px-6 py-3 rounded-lg text-center">
              <p className="font-['DM_Sans',sans-serif] font-bold text-white text-lg tracking-tight">Explore our Services</p>
            </Link>
            <Link to="/courses" className="border border-black hover:bg-gray-50 transition-colors px-6 py-3 rounded-lg text-center inline-block">
              <p className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-lg tracking-tight">Take a Course</p>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function ServiceCard({ number, title, description, titleColor, bgColor, borderColor, link }: { number: string; title: string; description: string; titleColor: string; bgColor: string; borderColor: string; link: string }) {
  const getArrowColor = () => {
    switch(titleColor) {
      case 'text-[#016e71]': return '#016e71';
      case 'text-[#f58c21]': return '#f58c21';
      case 'text-[#ed2a10]': return '#ed2a10';
      default: return '#000000';
    }
  };

  return (
    <div className={`relative rounded-xl ${bgColor} border ${borderColor} p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex flex-col gap-4 h-full">
        <div className="relative">
          <p className="absolute -top-4 -right-2 font-['DM_Sans',sans-serif] font-bold text-[#dadada] text-6xl tracking-tight z-0">{number}</p>
          <h3 className={`font-['DM_Sans',sans-serif] font-bold text-2xl tracking-tight ${titleColor} relative z-10`}>{title}</h3>
        </div>
        <p className="font-['DM_Sans',sans-serif] text-black text-lg">{description}</p>
        <div className="flex items-center gap-3 mt-auto">
          <Link to={link} className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <p className={`font-['DM_Sans',sans-serif] font-bold text-lg ${titleColor}`}>Learn More</p>
            <div className="w-6 h-6">
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                <path d={svgPaths.p2faae100} fill={getArrowColor()} />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

// CV Upload Modal Component
function CVUploadModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setUploaded(false);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    
    setUploading(true);
    // Simulate upload - replace with actual upload logic
    await new Promise(resolve => setTimeout(resolve, 1500));
    setUploading(false);
    setUploaded(true);
    
    // Close modal after successful upload
    setTimeout(() => {
      onClose();
      setSelectedFile(null);
      setUploaded(false);
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative shadow-2xl border border-gray-200">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-black mb-6">
          Upload Your CV
        </h3>
        
        <div className="space-y-4">
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0d9488] transition-colors">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              className="hidden"
              id="cv-upload"
            />
            <label 
              htmlFor="cv-upload"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span className="font-['DM_Sans',sans-serif] text-gray-600">
                {selectedFile ? selectedFile.name : "Click to select file"}
              </span>
              <span className="font-['DM_Sans',sans-serif] text-sm text-gray-400">
                PDF, DOC, or DOCX up to 5MB
              </span>
            </label>
          </div>

          {uploaded && (
            <div className="bg-green-100 text-green-700 p-3 rounded-lg font-['DM_Sans',sans-serif] text-sm">
              CV uploaded successfully!
            </div>
          )}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className={`w-full py-3 rounded-lg font-['DM_Sans',sans-serif] font-semibold transition-colors ${
              selectedFile && !uploading
                ? "bg-[#0d9488] text-white hover:bg-[#0a7a70]"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {uploading ? "Uploading..." : uploaded ? "Uploaded!" : "Upload CV"}
          </button>
        </div>
      </div>
    </div>
  );
}

function OpportunityCard({ title, salary, location, requirements, titleColor }: { title: string; salary: string; location: string; requirements: string[]; titleColor: string }) {
  const getArrowColor = () => {
    switch(titleColor) {
      case 'text-[#016e71]': return '#016e71';
      case 'text-[#f58c21]': return '#f58c21';
      case 'text-[#ed2a10]': return '#ed2a10';
      default: return '#000000';
    }
  };

  return (
    <div className={`relative rounded-xl bg-white border border-[#d1d5db] p-6 hover:shadow-lg transition-shadow`}>
      <div className="flex flex-col gap-4 h-full items-start text-left">
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl tracking-tight text-black">{title}</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3 text-sm text-black">
            <div className="flex items-center gap-2">
              <img src="/MoneyWavy.svg" alt="Money" className="w-4 h-4" />
              <p className="font-['DM_Sans',sans-serif] text-black">{salary}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4">
                <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                  <path d={svgPaths.p1c084000} fill="#0d9488" />
                </svg>
              </div>
              <span>{location}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-['DM_Sans',sans-serif] font-semibold text-sm text-black mb-2">Requirements:</h4>
          <ul className="space-y-1">
            {requirements.slice(0, 2).map((req, index) => (
              <li key={index} className="font-['DM_Sans',sans-serif] text-sm text-black flex items-start gap-2">
                <span className="text-[#0d9488] mt-1">•</span>
                {req}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex items-center gap-3 mt-auto">
          <Link to="/opportunities" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <p className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#0d9488]">Apply Now</p>
            <div className="w-6 h-6">
              <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                <path d={svgPaths.p2faae100} fill="#0d9488" />
              </svg>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

function AssessmentCard({ icon, title, description, bgColor }: { icon: string; title: string; description: string; bgColor: string }) {
  const iconPaths: { [key: string]: string } = {
    user: svgPaths.p67d73f0,
    cv: svgPaths.p35df470,
    baby: svgPaths.p178bd5f0
  };

  return (
    <div className="flex flex-col gap-7 w-full max-w-sm">
      <div className="flex flex-col gap-3">
        <div className={`${bgColor} rounded-lg p-4`}>
          <div className="flex items-center justify-between">
            <p className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl tracking-tight">{title}</p>
            <div className="w-10 h-10">
              <svg className="w-full h-full" fill="none" viewBox="0 0 40 40">
                <path d={iconPaths[icon]} fill="white" />
              </svg>
            </div>
          </div>
        </div>
        <p className="font-['DM_Sans',sans-serif] text-black text-lg">{description}</p>
      </div>
      <button className="font-['DM_Sans',sans-serif] font-bold text-black text-lg tracking-wider hover:opacity-80 transition-opacity">
        LEARN MORE
      </button>
    </div>
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

export default function HomePage() {
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader activePage="home" />
      <HeroSection />
      
      {/* Our Services Section */}
      <section className="bg-[#fffaf5] py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-4xl md:text-5xl tracking-tight mb-4">Our Services</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <ServiceCard
              number="01"
              title="Recruitment"
              description="We proactively select and engage best-fit talents for your desired manpower"
              titleColor="text-[#016e71]"
              bgColor="bg-white"
              borderColor="border-[#d7d7d7]"
              link="/recruitment"
            />
            <ServiceCard
              number="02"
              title="Outsourcing"
              description="We consistently train personnel for specific roles, and assign them under our Staff Outsourcing to interested clients."
              titleColor="text-[#f58c21]"
              bgColor="bg-white"
              borderColor="border-[#d7d7d7]"
              link="/outsourcing"
            />
            <ServiceCard
              number="03"
              title="Training"
              description="We proactively select and engage best-fit talents for your desired manpower framework."
              titleColor="text-[#ed2a10]"
              bgColor="bg-white"
              borderColor="border-[#d7d7d7]"
              link="/training"
            />
            <div className="bg-white border border-[#d7d7d7] rounded-xl p-6 hover:shadow-lg transition-shadow">
              <div className="flex flex-col gap-4 h-full">
                <div className="relative">
                  <p className="absolute -top-4 -right-2 font-['DM_Sans',sans-serif] font-bold text-[#dadada] text-6xl tracking-tight z-0">04</p>
                  <h3 className="font-['DM_Sans',sans-serif] font-bold text-2xl tracking-tight text-[#1d1d1d] relative z-10">Other Consulting</h3>
                </div>
                <p className="font-['DM_Sans',sans-serif] text-black text-lg">
                  Depending on where you are in the development phase, we offer a range of services to support your endeavours and ensure excellent project delivery and post-development performance.
                </p>
                <div className="flex items-center gap-3 mt-auto">
                  <a 
                    href="https://www.acutehospitality.co.za" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-3 hover:opacity-80 transition-opacity"
                  >
                    <p className="font-['DM_Sans',sans-serif] font-bold text-black text-lg">Learn More</p>
                    <div className="w-6 h-6">
                      <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                        <path d={svgPaths.p2faae100} fill="black" />
                      </svg>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Professional Excellence Section */}
      <section className="pt-20 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1 flex items-end">
              <img 
                alt="Happy business colleagues" 
                className="w-full h-auto rounded-lg object-cover mb-0" 
                loading="lazy"
                decoding="async"
                src={imgHappyBusinessColleaguesEnjoyingTeamSuccess1} 
              />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center justify-center px-6 py-2 rounded-full bg-[rgba(238,238,238,0.2)] border border-[#ed2a10] mb-6">
                <p className="font-['DM_Sans',sans-serif] font-bold text-[#ed2a10] text-base tracking-tight">THE CR8 ADVANTAGE</p>
              </div>
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-8">
                Why Choose <span className="italic text-[#016e71]">Professional </span>
                <span className="italic text-[#016e71] block">Excellence</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex-shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 40 40">
                      <rect fill="#FFECFB" height="39" rx="3.5" width="39" x="0.5" y="0.5" />
                      <rect height="39" rx="3.5" stroke="#D64EB8" width="39" x="0.5" y="0.5" />
                      <path d={svgPaths.p1ac57700} fill="#D64EB8" />
                    </svg>
                  </div>
                  <p className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-xl">Client Centric Approach</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex-shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 40 40">
                      <rect fill="#E3EBFF" height="39" rx="3.5" width="39" x="0.5" y="0.5" />
                      <rect height="39" rx="3.5" stroke="#4062B9" width="39" x="0.5" y="0.5" />
                      <path d={svgPaths.p2881c300} fill="#4062B9" />
                    </svg>
                  </div>
                  <p className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-xl">Curated Professionalism</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 flex-shrink-0">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 38.5 38.5028">
                      <rect height="37.5028" stroke="#EB9B07" width="37.5" x="0.5" y="0.5" />
                      <path d={svgPaths.p1bbd7600} fill="#EB9B07" />
                    </svg>
                  </div>
                  <p className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-xl">Innovation-Driven</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities Section */}
      <section className="bg-[#f8f8f8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-4xl md:text-5xl tracking-tight mb-8">Opportunities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <OpportunityCard
                title="Sous Chef"
                salary="₦50,000 - ₦100,000 monthly"
                location="Lagos, Nigeria"
                requirements={["3+ years of culinary experience", "Knowledge of Nigerian cuisine"]}
                titleColor="text-[#f58c21]"
              />
              <OpportunityCard
                title="Sous Chef"
                salary="₦50,000 - ₦100,000 monthly"
                location="Lagos, Nigeria"
                requirements={["Culinary school certification", "Ability to work flexible hours"]}
                titleColor="text-[#ed2a10]"
              />
            </div>
            <Link to="/opportunities" className="border border-[#8d8d8d] hover:bg-gray-100 transition-colors px-6 py-3 rounded-lg text-center inline-block">
              <p className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-lg tracking-tight">View All Openings</p>
            </Link>
          </div>
          
          <div className="bg-[#016e71] rounded-2xl p-10 relative overflow-hidden">
            <img src="/Hero.svg" alt="Hero" className="absolute inset-0 w-full h-full object-cover opacity-20" loading="lazy" decoding="async" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center relative z-10">
              <div>
                <h3 className="font-['DM_Sans',sans-serif] font-bold text-[#ffecfb] text-3xl md:text-4xl mb-6">
                  Ready to Elevate<br />Your Professional Journey
                </h3>
                <p className="font-['DM_Sans',sans-serif] text-[#ffefed] text-lg mb-8">
                  Whether you are looking to hire world class talent or<br />
                  trying to land your next big break, we are here to<br />
                  curate your success
                </p>
              </div>
              <div className="flex flex-col gap-4 items-start lg:items-end">
                <Link to="/contact" className="border border-[#fff9f4] text-[#ffecfb] hover:bg-[#fff9f4] hover:text-[#0d9488] transition-colors px-6 py-3 rounded-lg text-center inline-block">
                  <p className="font-['DM_Sans',sans-serif] font-bold text-lg tracking-tight">Contact Us</p>
                </Link>
                <button 
                  onClick={() => setIsCVModalOpen(true)}
                  className="border border-[#fff9f4] text-[#ffecfb] hover:bg-[#fff9f4] hover:text-[#0d9488] transition-colors px-6 py-3 rounded-lg w-full lg:w-auto text-center inline-block"
                >
                  <p className="font-['DM_Sans',sans-serif] font-bold text-lg tracking-tight">Upload your CV</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Assessments Section */}
      <section className="bg-[#fff0ee] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-4xl md:text-5xl tracking-tight mb-8 text-center lg:text-left">Assessments</h2>
              <div className="w-full h-96 lg:h-full max-w-md mx-auto lg:mx-0">
                <img 
                  alt="Assessment illustration" 
                  className="w-full h-full object-cover rounded-lg" 
                  loading="lazy"
                  decoding="async"
                  src={img66076CfcA1394149A2Ce6E2218B28F4F1} 
                />
              </div>
            </div>
            <div className="space-y-14">
              <AssessmentCard
                icon="user"
                title="Talent Profiling"
                description="Discovering yourself, your strengths, and planning an intentional career at any stage"
                bgColor="bg-[#ed2a10]"
              />
              <AssessmentCard
                icon="cv"
                title="Career Account Management"
                description="One-on-one personalised Talent training for a healthy start to a deliberate career!"
                bgColor="bg-[#f58c21]"
              />
              <AssessmentCard
                icon="baby"
                title="Junior Talent"
                description="Discovering yourself at the very best time to build an intentional & successful career!"
                bgColor="bg-[#016e71]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MSME Block Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-4xl md:text-5xl tracking-tight mb-8">MSME Block</h2>
              <p className="font-['DM_Sans',sans-serif] text-black text-lg mb-8">
                The Cr8 MSME Block is a uniquely designed business support outsourcing programme to ensure entrepreneurs are not burdened with higher headcounts and overheads than necessary, without compromising on the professional business support services every business requires to succeed.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-[#016e71] hover:bg-[#015a5d] transition-colors px-6 py-3 rounded-lg">
                  <p className="font-['DM_Sans',sans-serif] font-bold text-white text-lg tracking-tight">Learn More</p>
                </button>
                <button className="border border-black hover:bg-gray-50 transition-colors px-6 py-3 rounded-lg">
                  <p className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-lg tracking-tight">Ask Your Questions</p>
                </button>
              </div>
            </div>
            <div className="w-full h-96">
              <img 
                alt="Business planning" 
                className="w-full h-full object-cover rounded-lg" 
                loading="lazy"
                decoding="async"
                src={imgSideViewManMakingPlansRedecorateHouse1} 
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
      
      {/* CV Upload Modal */}
      <CVUploadModal 
        isOpen={isCVModalOpen} 
        onClose={() => setIsCVModalOpen(false)} 
      />
    </div>
  );
}
