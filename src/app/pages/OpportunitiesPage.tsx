import { useEffect, useState } from "react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { Link } from "react-router-dom";
import svgPaths from "../../imports/Home/svg-trfy73921z";
import { fetchActiveJobOpenings } from "../../lib/jobService";

// Decorative themes cycled across job cards.
const JOB_CARD_THEMES = [
  { titleColor: "text-[#016e71]", bgColor: "bg-[#e6f3f3]", borderColor: "border-[#016e71]" },
  { titleColor: "text-[#f58c21]", bgColor: "bg-[#fef4e6]", borderColor: "border-[#f58c21]" },
  { titleColor: "text-[#ed2a10]", bgColor: "bg-[#ffebe6]", borderColor: "border-[#ed2a10]" },
];

interface PublicJob {
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
}

// Raster images using figma:asset scheme



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
  const [jobs, setJobs] = useState<PublicJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveJobOpenings().then(({ data }) => {
      const mapped = data.map((row, index) => {
        const theme = JOB_CARD_THEMES[index % JOB_CARD_THEMES.length];
        return {
          number: String(index + 1).padStart(2, "0"),
          title: row.title,
          company: row.company,
          location: row.location,
          salary: row.salary,
          type: row.type,
          description: row.description,
          ...theme,
        };
      });
      setJobs(mapped);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      
      {/* Hero Section */}
      <section className="relative pt-36 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#016e71] to-[#f58c21]">
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
          
          {loading ? (
            <div className="text-center py-16">
              <p className="font-['DM_Sans',sans-serif] text-gray-500 text-lg">Loading opportunities...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-2">No open positions right now</h3>
              <p className="font-['DM_Sans',sans-serif] text-gray-600">Check back soon, or upload your CV so we can match you as roles open up.</p>
            </div>
          ) : (
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
          )}
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

      <SiteFooter />
    </div>
  );
}
