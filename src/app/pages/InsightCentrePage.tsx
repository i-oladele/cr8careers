import svgPaths from "../../imports/Home/svg-trfy73921z";
import SiteHeader from "../components/SiteHeader";

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

function ArticleCard({ title, excerpt, category, date, readTime }: { 
  title: string; 
  excerpt: string; 
  category: string; 
  date: string; 
  readTime: string;
}) {
  const categoryColors: { [key: string]: string } = {
    'HR Trends': 'bg-[#016e71]',
    'Recruitment': 'bg-[#f58c21]',
    'Leadership': 'bg-[#ed2a10]',
    'Career Growth': 'bg-[#1d1d1d]'
  };

  return (
    <article className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <div className="w-16 h-16 bg-gray-400 rounded"></div>
      </div>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-3">
          <span className={`${categoryColors[category] || 'bg-gray-500'} text-white text-xs px-3 py-1 rounded-full`}>
            {category}
          </span>
          <span className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">{date}</span>
          <span className="font-['DM_Sans',sans-serif] text-gray-500 text-sm">{readTime}</span>
        </div>
        <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-3">{title}</h3>
        <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">{excerpt}</p>
        <button className="font-['DM_Sans',sans-serif] font-bold text-[#016e71] hover:text-[#015a5d] transition-colors">
          Read More →
        </button>
      </div>
    </article>
  );
}

function ResourceCard({ title, description, type, downloadLink }: { 
  title: string; 
  description: string; 
  type: string; 
  downloadLink: string;
}) {
  const typeIcons: { [key: string]: string } = {
    'PDF': '📄',
    'Video': '🎥',
    'Guide': '📖',
    'Template': '📋'
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#f58c21] text-white rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-xl">{typeIcons[type] || '📄'}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-2">{title}</h3>
          <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-4">{description}</p>
          <a href={downloadLink} className="font-['DM_Sans',sans-serif] font-bold text-[#f58c21] hover:text-[#e67e1a] transition-colors">
            Download {type}
          </a>
        </div>
      </div>
    </div>
  );
}

export default function InsightCentrePage() {
  const articles = [
    {
      title: "The Future of Remote Work in Africa",
      excerpt: "Exploring how remote work is reshaping the African job market and what it means for employers and employees.",
      category: "HR Trends",
      date: "March 15, 2026",
      readTime: "5 min read"
    },
    {
      title: "Building a Strong Company Culture in Hybrid Teams",
      excerpt: "Strategies for maintaining and strengthening company culture when teams work both remotely and in-office.",
      category: "Leadership",
      date: "March 10, 2026",
      readTime: "7 min read"
    },
    {
      title: "AI in Recruitment: Opportunities and Challenges",
      excerpt: "How artificial intelligence is transforming the recruitment process and what HR professionals need to know.",
      category: "Recruitment",
      date: "March 5, 2026",
      readTime: "6 min read"
    },
    {
      title: "Career Development in the Digital Age",
      excerpt: "Navigating career growth and skill development in an increasingly digital workplace.",
      category: "Career Growth",
      date: "February 28, 2026",
      readTime: "8 min read"
    },
    {
      title: "Employee Retention Strategies for 2026",
      excerpt: "Proven methods to keep your best employees engaged and committed to your organization.",
      category: "HR Trends",
      date: "February 20, 2026",
      readTime: "6 min read"
    },
    {
      title: "The Importance of Soft Skills in Technical Roles",
      excerpt: "Why communication, teamwork, and adaptability are crucial for technical professionals.",
      category: "Career Growth",
      date: "February 15, 2026",
      readTime: "5 min read"
    }
  ];

  const resources = [
    {
      title: "HR Policy Template",
      description: "Comprehensive template for creating effective HR policies in your organization.",
      type: "Template",
      downloadLink: "#"
    },
    {
      title: "Interview Guide",
      description: "Step-by-step guide for conducting effective interviews and evaluating candidates.",
      type: "Guide",
      downloadLink: "#"
    },
    {
      title: "Onboarding Checklist",
      description: "Complete checklist for smooth employee onboarding process.",
      type: "PDF",
      downloadLink: "#"
    },
    {
      title: "Performance Review Template",
      description: "Structured template for conducting meaningful performance reviews.",
      type: "Template",
      downloadLink: "#"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader activePage="insight" />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#016e71] to-[#f58c21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
              Insight Centre
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-white text-xl max-w-3xl mx-auto">
              Expert insights, industry trends, and valuable resources to help you navigate the world of HR and career development
            </p>
          </div>
        </div>
      </section>

      {/* Articles Section */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-4">
              Latest Articles
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Stay informed with our latest insights on HR trends, recruitment strategies, and career development
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article, index) => (
              <ArticleCard
                key={index}
                title={article.title}
                excerpt={article.excerpt}
                category={article.category}
                date={article.date}
                readTime={article.readTime}
              />
            ))}
          </div>
          
          <div className="text-center mt-12">
            <button className="bg-[#016e71] text-white px-8 py-3 rounded-lg hover:bg-[#015a5d] transition-colors">
              <p className="font-['DM_Sans',sans-serif] font-bold">Load More Articles</p>
            </button>
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {['All Articles', 'HR Trends', 'Recruitment', 'Leadership', 'Career Growth'].map((category) => (
              <button
                key={category}
                className={`px-6 py-2 rounded-full font-['DM_Sans',sans-serif] font-semibold transition-colors ${
                  category === 'All Articles' 
                    ? 'bg-[#016e71] text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-[#1d1d1d] text-3xl md:text-4xl mb-4">
              Free Resources
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg max-w-2xl mx-auto">
              Download our free templates, guides, and tools to enhance your HR practices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <ResourceCard
                key={index}
                title={resource.title}
                description={resource.description}
                type={resource.type}
                downloadLink={resource.downloadLink}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 lg:py-24 bg-[#016e71]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-['DM_Sans',sans-serif] font-bold text-white text-3xl md:text-4xl mb-6">
            Stay Updated
          </h2>
          <p className="font-['DM_Sans',sans-serif] text-white text-lg mb-8">
            Subscribe to our newsletter for the latest HR insights and career tips delivered to your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-6 py-3 rounded-lg text-gray-900"
            />
            <button className="bg-white text-[#016e71] px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-['DM_Sans',sans-serif] font-bold">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
