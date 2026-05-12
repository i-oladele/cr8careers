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

function JobCard({ number, title, company, location, salary, type, description, titleColor, bgColor, borderColor }: { 
  number: string;
  title: string; 
  company: string; 
  location: string; 
  salary: string; 
  type: string; 
  description: string; 
  titleColor: string; 
  bgColor: string; 
  borderColor: string;
}) {
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
        <div className="space-y-2">
          <p className="font-['DM_Sans',sans-serif] text-[#f58c21] font-semibold text-lg">{company}</p>
          <div className="flex flex-wrap gap-3 text-sm text-black">
            <span className="flex items-center gap-1">
              📍 {location}
            </span>
            <span>💰 {salary}</span>
            <span>🕒 {type}</span>
          </div>
        </div>
        <p className="font-['DM_Sans',sans-serif] text-black text-lg">{description}</p>
        <div className="flex items-center gap-3 mt-auto">
          <Link to="#" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <p className={`font-['DM_Sans',sans-serif] font-bold text-lg ${titleColor}`}>Apply Now</p>
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

export default function OpportunitiesPage() {
  const jobs = [
    {
      number: "01",
      title: "Senior HR Manager",
      company: "Tech Innovations Ltd",
      location: "Lagos, Nigeria",
      salary: "₦250,000 - ₦350,000",
      type: "Full-time",
      description: "We are seeking an experienced HR Manager to lead our human resources department and drive strategic HR initiatives.",
      titleColor: "text-[#016e71]",
      bgColor: "bg-[#e6f3f3]",
      borderColor: "border-[#016e71]"
    },
    {
      number: "02",
      title: "Software Developer",
      company: "Digital Solutions Africa",
      location: "Abuja, Nigeria",
      salary: "₦200,000 - ₦300,000",
      type: "Full-time",
      description: "Looking for a skilled software developer to join our growing team and work on innovative digital solutions.",
      titleColor: "text-[#f58c21]",
      bgColor: "bg-[#fef4e6]",
      borderColor: "border-[#f58c21]"
    },
    {
      number: "03",
      title: "Marketing Manager",
      company: "Growth Partners",
      location: "Port Harcourt, Nigeria",
      salary: "₦180,000 - ₦250,000",
      type: "Full-time",
      description: "Seeking a creative marketing manager to develop and execute marketing strategies that drive business growth.",
      titleColor: "text-[#ed2a10]",
      bgColor: "bg-[#ffebe6]",
      borderColor: "border-[#ed2a10]"
    },
    {
      number: "04",
      title: "Financial Analyst",
      company: "Investment Hub",
      location: "Lagos, Nigeria",
      salary: "₦150,000 - ₦220,000",
      type: "Full-time",
      description: "We need a detail-oriented financial analyst to help analyze financial data and provide insights for business decisions.",
      titleColor: "text-[#016e71]",
      bgColor: "bg-[#e6f3f3]",
      borderColor: "border-[#016e71]"
    },
    {
      number: "05",
      title: "Customer Service Representative",
      company: "Service Excellence Ltd",
      location: "Lagos, Nigeria",
      salary: "₦80,000 - ₦120,000",
      type: "Full-time",
      description: "Looking for friendly customer service representatives to provide excellent support to our clients.",
      titleColor: "text-[#f58c21]",
      bgColor: "bg-[#fef4e6]",
      borderColor: "border-[#f58c21]"
    },
    {
      number: "06",
      title: "Project Manager",
      company: "Construction Plus",
      location: "Abuja, Nigeria",
      salary: "₦200,000 - ₦280,000",
      type: "Full-time",
      description: "Seeking an experienced project manager to oversee construction projects and ensure timely delivery.",
      titleColor: "text-[#ed2a10]",
      bgColor: "bg-[#ffebe6]",
      borderColor: "border-[#ed2a10]"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#016e71] to-[#f58c21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
              Career Opportunities
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-white text-xl max-w-3xl mx-auto">
              Discover exciting career opportunities with top companies across Nigeria. Your next career move starts here.
            </p>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search jobs by title, company, or keyword..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent"
              />
            </div>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent">
              <option value="">All Locations</option>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
              <option value="port-harcourt">Port Harcourt</option>
            </select>
            <select className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent">
              <option value="">All Categories</option>
              <option value="technology">Technology</option>
              <option value="hr">Human Resources</option>
              <option value="finance">Finance</option>
              <option value="marketing">Marketing</option>
            </select>
            <button className="bg-[#016e71] text-white px-6 py-3 rounded-lg hover:bg-[#015a5d] transition-colors font-['DM_Sans',sans-serif] font-semibold">
              Search Jobs
            </button>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section className="bg-[#fffaf5] py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#1d1d1d]">
              Available Positions ({jobs.length})
            </h2>
            <div className="flex items-center gap-4">
              <select className="px-4 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Sort by: Latest</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
              </select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job, index) => (
              <JobCard
                key={index}
                number={job.number}
                title={job.title}
                company={job.company}
                location={job.location}
                salary={job.salary}
                type={job.type}
                description={job.description}
                titleColor={job.titleColor}
                bgColor={job.bgColor}
                borderColor={job.borderColor}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-[#016e71] text-white px-8 py-3 rounded-lg hover:bg-[#015a5d] transition-colors font-['DM_Sans',sans-serif] font-semibold">
              Load More Jobs
            </button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-[#f8f8f8]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-6">
            Can't Find What You're Looking For?
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg mb-8">
            Upload your CV to our database and we'll match you with suitable opportunities as they become available.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="bg-[#f58c21] text-white px-8 py-3 rounded-lg hover:bg-[#e67e1a] transition-colors font-['DM_Sans',sans-serif] font-semibold">
              Upload Your CV
            </Link>
            <button className="border-2 border-[#016e71] text-[#016e71] px-8 py-3 rounded-lg hover:bg-[#016e71] hover:text-white transition-colors font-['DM_Sans',sans-serif] font-semibold">
              Job Alerts
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
