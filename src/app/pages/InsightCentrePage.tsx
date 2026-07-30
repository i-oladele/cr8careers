import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen, BriefcaseBusiness, CheckCircle2, Clock3, FileText, Lightbulb, Users } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { submitContactSubmission } from "../../lib/contactService";
import { fetchPublishedBlogPosts } from "../../lib/blogService";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] focus-visible:ring-offset-2";

type InsightArticle = { title: string; excerpt: string; category: string; date: string; dateTime: string; readTime: string; slug?: string; featuredImageUrl?: string | null };

const fallbackArticles: InsightArticle[] = [
  { title: "The Future of Remote Work in Africa", excerpt: "Exploring how remote work is reshaping the African job market and what it means for employers and employees.", category: "HR Trends", date: "March 15, 2026", dateTime: "2026-03-15", readTime: "5 min read" },
  { title: "Building a Strong Company Culture in Hybrid Teams", excerpt: "Strategies for maintaining and strengthening company culture when teams work both remotely and in-office.", category: "Leadership", date: "March 10, 2026", dateTime: "2026-03-10", readTime: "7 min read" },
  { title: "AI in Recruitment: Opportunities and Challenges", excerpt: "How artificial intelligence is transforming the recruitment process and what HR professionals need to know.", category: "Recruitment", date: "March 5, 2026", dateTime: "2026-03-05", readTime: "6 min read" },
  { title: "Career Development in the Digital Age", excerpt: "Navigating career growth and skill development in an increasingly digital workplace.", category: "Career Growth", date: "February 28, 2026", dateTime: "2026-02-28", readTime: "8 min read" },
  { title: "Employee Retention Strategies for 2026", excerpt: "Practical ways to keep valued employees engaged and committed to your organization.", category: "HR Trends", date: "February 20, 2026", dateTime: "2026-02-20", readTime: "6 min read" },
  { title: "The Importance of Soft Skills in Technical Roles", excerpt: "Why communication, teamwork and adaptability matter for technical professionals.", category: "Career Growth", date: "February 15, 2026", dateTime: "2026-02-15", readTime: "5 min read" },
];

const resources = [
  { title: "HR Policy Template", description: "A practical starting point for documenting workplace policies.", type: "Template", icon: FileText, tint: "bg-[#e8f5f4] text-[#016e71]" },
  { title: "Interview Guide", description: "A structured guide for planning interviews and evaluating candidates.", type: "Guide", icon: Users, tint: "bg-[#fff1e2] text-[#b25700]" },
  { title: "Onboarding Checklist", description: "A checklist for preparing and supporting a new employee's first steps.", type: "Checklist", icon: CheckCircle2, tint: "bg-[#fff0ed] text-[#c8240e]" },
  { title: "Performance Review Template", description: "A framework for more focused performance conversations.", type: "Template", icon: BriefcaseBusiness, tint: "bg-gray-100 text-[#1d1d1d]" },
];

const categoryStyles: Record<string, { accent: string; tint: string }> = {
  "HR Trends": { accent: "text-[#016e71]", tint: "bg-[#e8f5f4] text-[#015b5e]" },
  Recruitment: { accent: "text-[#b25700]", tint: "bg-[#fff1e2] text-[#8a4500]" },
  Leadership: { accent: "text-[#c8240e]", tint: "bg-[#fff0ed] text-[#9b1b0b]" },
  "Career Growth": { accent: "text-[#1d1d1d]", tint: "bg-gray-100 text-gray-800" },
};

function ArticleCard({ article, number }: { article: InsightArticle; number: string }) {
  const style = categoryStyles[article.category] ?? categoryStyles["HR Trends"];
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#d7d7d7] bg-white transition-shadow hover:shadow-lg">
      {article.featuredImageUrl && <img src={article.featuredImageUrl} alt="" className="aspect-[16/9] w-full object-cover" loading="lazy" decoding="async" />}
      <div className="relative flex flex-1 flex-col p-6">
      <span className="absolute right-4 top-0 font-['DM_Sans',sans-serif] text-7xl font-bold text-[#eeeeee]" aria-hidden="true">{number}</span>
      <span className={`relative w-fit rounded-full px-3 py-1 font-['DM_Sans',sans-serif] text-xs font-bold ${style.tint}`}>{article.category}</span>
      <h3 className={`relative mt-5 font-['DM_Sans',sans-serif] text-2xl font-bold leading-tight tracking-tight ${style.accent}`}>{article.title}</h3>
      <p className="mt-4 flex-1 font-['DM_Sans',sans-serif] leading-relaxed text-gray-700">{article.excerpt}</p>
      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-gray-100 pt-4 font-['DM_Sans',sans-serif] text-sm text-gray-500">
        <time dateTime={article.dateTime}>{article.date}</time>
        <span className="inline-flex items-center gap-1.5"><Clock3 className="h-4 w-4" aria-hidden="true" />{article.readTime}</span>
      </div>
      {article.slug && <Link to={`/insight-centre/${article.slug}`} className={`mt-5 inline-flex items-center gap-2 self-start rounded-sm font-['DM_Sans',sans-serif] font-bold text-[#016e71] hover:opacity-75 ${focusRing}`}>Read article <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link>}
      </div>
    </article>
  );
}

export default function InsightCentrePage() {
  const categories = ["All", "HR Trends", "Recruitment", "Leadership", "Career Growth"];
  const [activeCategory, setActiveCategory] = useState("All");
  const [articles, setArticles] = useState<InsightArticle[]>(fallbackArticles);
  const [loadingArticles, setLoadingArticles] = useState(true);
  const [email, setEmail] = useState("");
  const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const filteredArticles = activeCategory === "All" ? articles : articles.filter(article => article.category === activeCategory);

  useEffect(() => {
    let active = true;
    fetchPublishedBlogPosts().then(result => {
      if (!active) return;
      if (!result.error && result.data.length > 0) {
        setArticles(result.data.map(post => ({
          title: post.title,
          excerpt: post.excerpt,
          category: post.category,
          date: new Date(post.published_at ?? post.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }),
          dateTime: post.published_at ?? post.created_at,
          readTime: `${post.read_time_minutes} min read`,
          slug: post.slug,
          featuredImageUrl: post.featured_image_url,
        })));
      }
      setLoadingArticles(false);
    });
    return () => { active = false; };
  }, []);

  const handleSubscribe = async (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return;
    setNewsletterStatus("submitting");
    const { error } = await submitContactSubmission({ name: "Insight Centre subscriber", email: trimmedEmail, service: "newsletter", message: "Newsletter signup from Insight Centre" });
    setNewsletterStatus(error ? "error" : "success");
    if (!error) setEmail("");
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader activePage="insight" />

      <main>
        <section className="relative overflow-hidden bg-[#f9fafb] pb-20 pt-40 md:pt-48 lg:pb-28 lg:pt-56" style={{ backgroundImage: "url('/Hero.svg')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}>
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex rounded-full border border-black/40 bg-white/20 px-6 py-2"><p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-wider text-black">Cr8Careers Insight Centre</p></div>
              <h1 className="font-['DM_Sans',sans-serif] text-4xl font-bold leading-tight tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-6xl">Ideas for better workplaces and more intentional <span className="italic text-[#ed2a10]">careers.</span></h1>
              <p className="mt-6 max-w-3xl font-['DM_Sans',sans-serif] text-lg leading-relaxed text-black sm:text-xl">Explore perspectives on talent, leadership, recruitment and career development.</p>
              <a href="#latest-insights" className={`mt-8 inline-flex items-center gap-2 rounded-lg bg-[#016e71] px-7 py-3 font-['DM_Sans',sans-serif] text-lg font-bold text-white hover:bg-[#015a5d] ${focusRing}`}>Explore insights <BookOpen className="h-5 w-5" aria-hidden="true" /></a>
            </div>
          </div>
        </section>

        <section id="latest-insights" className="scroll-mt-28 bg-[#fffaf5] py-20 lg:py-28" aria-labelledby="articles-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center"><p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">Latest thinking</p><h2 id="articles-heading" className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold tracking-tight text-[#1d1d1d] md:text-5xl">Insights to support your next move</h2><p className="mt-4 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-600">Filter the collection by the topic most relevant to you.</p></div>
            <div className="mt-9 flex flex-wrap justify-center gap-3" role="group" aria-label="Filter insights by category">
              {categories.map(category => <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={activeCategory === category} className={`rounded-full px-5 py-2.5 font-['DM_Sans',sans-serif] text-sm font-bold transition-colors ${focusRing} ${activeCategory === category ? "bg-[#016e71] text-white" : "border border-[#d7d7d7] bg-white text-gray-700 hover:border-[#016e71] hover:text-[#016e71]"}`}>{category === "All" ? "All insights" : category}</button>)}
            </div>
            <p className="sr-only" aria-live="polite">Showing {filteredArticles.length} {filteredArticles.length === 1 ? "insight" : "insights"}</p>
            {loadingArticles && <p className="mt-8 text-center font-['DM_Sans',sans-serif] text-sm text-gray-500">Checking for new insights…</p>}
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredArticles.map(article => <ArticleCard key={article.title} article={article} number={String(articles.indexOf(article) + 1).padStart(2, "0")} />)}
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28" aria-labelledby="resources-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
              <div><p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">Practical resources</p><h2 id="resources-heading" className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold tracking-tight text-[#1d1d1d] md:text-5xl">Tools you can put to work</h2><p className="mt-5 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-600">We are preparing templates and guides designed to make common people processes clearer and easier to manage.</p><div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#fff1e2] px-4 py-2 font-['DM_Sans',sans-serif] text-sm font-bold text-[#8a4500]"><Lightbulb className="h-4 w-4" aria-hidden="true" />Resources are coming soon</div></div>
              <div className="grid gap-5 sm:grid-cols-2">
                {resources.map(resource => { const Icon = resource.icon; return <article key={resource.title} className="rounded-xl border border-[#d7d7d7] bg-white p-6"><div className={`flex h-11 w-11 items-center justify-center rounded-lg ${resource.tint}`}><Icon className="h-5 w-5" aria-hidden="true" /></div><div className="mt-5 flex items-center gap-2"><span className="rounded-full bg-gray-100 px-2.5 py-1 font-['DM_Sans',sans-serif] text-xs font-bold text-gray-600">{resource.type}</span><span className="font-['DM_Sans',sans-serif] text-xs font-semibold text-[#ed2a10]">Coming soon</span></div><h3 className="mt-3 font-['DM_Sans',sans-serif] text-xl font-bold text-[#1d1d1d]">{resource.title}</h3><p className="mt-2 font-['DM_Sans',sans-serif] leading-relaxed text-gray-600">{resource.description}</p></article>; })}
              </div>
            </div>
          </div>
        </section>

        <section className="pb-16 lg:pb-20" aria-labelledby="newsletter-heading">
          <div className="relative mx-4 max-w-7xl overflow-hidden rounded-2xl bg-[#016e71] px-6 py-12 text-white sm:mx-6 sm:px-10 lg:mx-auto lg:px-12">
            <img src="/Hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" aria-hidden="true" />
            <div className="relative mx-auto max-w-3xl text-center"><h2 id="newsletter-heading" className="font-['DM_Sans',sans-serif] text-3xl font-bold md:text-4xl">Stay close to the conversation</h2><p className="mx-auto mt-3 max-w-2xl font-['DM_Sans',sans-serif] text-lg text-white/85">Receive new HR insights and career perspectives when they are published.</p>
              <form onSubmit={handleSubscribe} className="mx-auto mt-7 flex max-w-xl flex-col gap-3 sm:flex-row"><label htmlFor="insight-newsletter-email" className="sr-only">Email address</label><input id="insight-newsletter-email" type="email" autoComplete="email" required value={email} onChange={event => { setEmail(event.target.value); if (newsletterStatus !== "idle") setNewsletterStatus("idle"); }} disabled={newsletterStatus === "submitting"} placeholder="Enter your email address" className={`min-w-0 flex-1 rounded-lg bg-white px-5 py-3 text-[#1d1d1d] placeholder:text-gray-500 disabled:opacity-70 ${focusRing}`} /><button type="submit" disabled={newsletterStatus === "submitting"} className={`rounded-lg bg-[#f58c21] px-7 py-3 font-['DM_Sans',sans-serif] font-bold text-black hover:bg-[#ff9f3d] disabled:opacity-70 ${focusRing}`}>{newsletterStatus === "submitting" ? "Subscribing…" : "Subscribe"}</button></form>
              {newsletterStatus === "success" && <p role="status" className="mt-3 font-['DM_Sans',sans-serif] text-sm text-green-200">Thanks for subscribing.</p>}{newsletterStatus === "error" && <p role="alert" className="mt-3 font-['DM_Sans',sans-serif] text-sm text-red-200">Subscription could not be completed. Please try again.</p>}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
