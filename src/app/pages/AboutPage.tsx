import { Link } from "react-router-dom";
import { ArrowRight, Check, Eye, Lightbulb, ShieldCheck, Target, Users } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import teamImage from "../../assets/optimized/happy-business-colleagues.jpg";

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] focus-visible:ring-offset-4";

const values = [
  { number: "01", title: "Excellence", description: "We bring care, rigour and high standards to every engagement.", color: "text-[#016e71]", tint: "bg-[#e8f5f4]", icon: Check },
  { number: "02", title: "Integrity", description: "We communicate honestly and act responsibly in every relationship.", color: "text-[#b25700]", tint: "bg-[#fff1e2]", icon: ShieldCheck },
  { number: "03", title: "Innovation", description: "We keep improving how people and organizations find opportunities to grow.", color: "text-[#c8240e]", tint: "bg-[#fff0ed]", icon: Lightbulb },
  { number: "04", title: "Partnership", description: "We work alongside our clients and talent to build lasting progress.", color: "text-[#1d1d1d]", tint: "bg-gray-100", icon: Users },
];

const milestones = [
  { year: "2018", title: "Cr8Careers begins", description: "Established with a vision to transform HR services in Nigeria." },
  { year: "2020", title: "Learning expands", description: "Training and development programmes become part of our wider people offering." },
  { year: "2022", title: "Assessment evolves", description: "Talent assessment and matching capabilities are introduced to strengthen hiring decisions." },
  { year: "2024", title: "Impact grows", description: "More than 500 organizations served and 10,000 professionals placed in key roles." },
  { year: "2026", title: "The journey continues", description: "Continuing to develop practical people solutions with relevance across Africa." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader activePage="about" />

      <main>
        <section
          className="relative overflow-hidden bg-[#f9fafb] pb-20 pt-40 md:pt-48 lg:pb-28 lg:pt-56"
          style={{ backgroundImage: "url('/Hero.svg')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
        >
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex rounded-full border border-black/40 bg-white/20 px-6 py-2">
                <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-wider text-black">About Cr8Careers</p>
              </div>
              <h1 className="font-['DM_Sans',sans-serif] text-4xl font-bold leading-tight tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-6xl">
                Repositioning <span className="italic text-[#ed2a10]">HR.</span><br />Repositioning <span className="italic text-[#ed2a10]">people.</span>
              </h1>
              <p className="mt-6 max-w-3xl font-['DM_Sans',sans-serif] text-lg leading-relaxed text-black sm:text-xl">
                We connect talent, learning and practical HR support to help people and organizations move from potential to progress.
              </p>
              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <Link to="/services" className={`rounded-lg bg-[#016e71] px-7 py-3 text-center font-['DM_Sans',sans-serif] text-lg font-bold text-white hover:bg-[#015a5d] ${focusRing}`}>
                  Explore our services
                </Link>
                <Link to="/contact" className={`rounded-lg border border-black px-7 py-3 text-center font-['DM_Sans',sans-serif] text-lg font-bold text-[#1d1d1d] hover:bg-gray-50 ${focusRing}`}>
                  Talk to our team
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28" aria-labelledby="story-heading">
          <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8">
            <div className="overflow-hidden rounded-xl bg-gray-100">
              <img src={teamImage} alt="Colleagues collaborating at work" className="h-full min-h-80 w-full object-cover" loading="lazy" decoding="async" />
            </div>
            <div>
              <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">Our story</p>
              <h2 id="story-heading" className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold tracking-tight text-[#1d1d1d] md:text-5xl">
                Bridging the gap between vision and execution
              </h2>
              <p className="mt-6 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-700">
                Cr8Careers was created around a simple belief: organizations perform better when the right people, skills and systems come together. We support that connection through recruitment, outsourcing, training and HR advisory services.
              </p>
              <p className="mt-4 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-700">
                Our work is shaped by the realities of the organizations and professionals we serve, with solutions designed to be practical, relevant and sustainable.
              </p>
              <Link to="/services" className={`mt-7 inline-flex items-center gap-2 rounded-md font-['DM_Sans',sans-serif] text-lg font-bold text-[#016e71] hover:opacity-75 ${focusRing}`}>
                See how we can help <ArrowRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf5] py-20 lg:py-28" aria-labelledby="direction-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">What guides us</p>
              <h2 id="direction-heading" className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold tracking-tight text-[#1d1d1d] md:text-5xl">Our mission and vision</h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <article className="relative overflow-hidden rounded-xl border border-[#d7d7d7] bg-white p-8 lg:p-10">
                <span className="absolute right-5 top-1 font-['DM_Sans',sans-serif] text-8xl font-bold text-[#eeeeee]" aria-hidden="true">01</span>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-[#016e71] text-white"><Target aria-hidden="true" /></div>
                <h3 className="relative mt-6 font-['DM_Sans',sans-serif] text-3xl font-bold text-[#016e71]">Our Mission</h3>
                <p className="relative mt-4 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-700">
                  To bridge the gap between vision and execution by connecting top-tier talent with world-class organizations through innovative recruitment, training and HR solutions that drive sustainable growth.
                </p>
              </article>
              <article className="relative overflow-hidden rounded-xl border border-[#d7d7d7] bg-white p-8 lg:p-10">
                <span className="absolute right-5 top-1 font-['DM_Sans',sans-serif] text-8xl font-bold text-[#eeeeee]" aria-hidden="true">02</span>
                <div className="relative flex h-12 w-12 items-center justify-center rounded-lg bg-[#f58c21] text-black"><Eye aria-hidden="true" /></div>
                <h3 className="relative mt-6 font-['DM_Sans',sans-serif] text-3xl font-bold text-[#b25700]">Our Vision</h3>
                <p className="relative mt-4 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-700">
                  To be a leading HR partner in Africa, recognized for talent development, organizational transformation and workforce solutions that empower businesses to thrive.
                </p>
              </article>
            </div>
          </div>
        </section>

        <section className="py-20 lg:py-28" aria-labelledby="values-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">How we show up</p>
              <h2 id="values-heading" className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold tracking-tight text-[#1d1d1d] md:text-5xl">Our core values</h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {values.map(value => {
                const Icon = value.icon;
                return (
                  <article key={value.title} className="relative overflow-hidden rounded-xl border border-[#d7d7d7] bg-white p-6 transition-shadow hover:shadow-lg">
                    <span className="absolute right-3 top-0 font-['DM_Sans',sans-serif] text-6xl font-bold text-[#eeeeee]" aria-hidden="true">{value.number}</span>
                    <div className={`relative flex h-11 w-11 items-center justify-center rounded-lg ${value.tint} ${value.color}`}><Icon className="h-5 w-5" aria-hidden="true" /></div>
                    <h3 className={`relative mt-5 font-['DM_Sans',sans-serif] text-2xl font-bold ${value.color}`}>{value.title}</h3>
                    <p className="relative mt-3 font-['DM_Sans',sans-serif] leading-relaxed text-gray-700">{value.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#f8f8f8] py-20 lg:py-28" aria-labelledby="journey-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
              <div>
                <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">Our journey</p>
                <h2 id="journey-heading" className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold tracking-tight text-[#1d1d1d] md:text-5xl">Growing with the people we serve</h2>
                <p className="mt-5 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-600">A timeline of how our people solutions have developed and expanded.</p>
              </div>
              <ol className="border-l-2 border-[#bdd9d9] pl-7">
                {milestones.map((milestone, index) => (
                  <li key={milestone.year} className={`relative ${index < milestones.length - 1 ? "pb-9" : ""}`}>
                    <span className="absolute -left-[2.15rem] top-1 h-3 w-3 rounded-full bg-[#016e71] ring-4 ring-[#f8f8f8]" aria-hidden="true" />
                    <p className="font-['DM_Sans',sans-serif] text-sm font-bold text-[#ed2a10]">{milestone.year}</p>
                    <h3 className="mt-1 font-['DM_Sans',sans-serif] text-xl font-bold text-[#1d1d1d]">{milestone.title}</h3>
                    <p className="mt-2 font-['DM_Sans',sans-serif] leading-relaxed text-gray-600">{milestone.description}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20" aria-labelledby="about-cta-heading">
          <div className="relative mx-4 grid max-w-7xl gap-8 overflow-hidden rounded-2xl bg-[#016e71] px-6 py-12 text-white sm:mx-6 sm:px-10 md:grid-cols-[1fr_auto] md:items-center lg:mx-auto lg:px-12">
            <img src="/Hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" aria-hidden="true" />
            <div className="relative">
              <h2 id="about-cta-heading" className="font-['DM_Sans',sans-serif] text-3xl font-bold md:text-4xl">Let’s build what comes next</h2>
              <p className="mt-3 max-w-2xl font-['DM_Sans',sans-serif] text-lg text-white/85">Tell us about the people challenge or opportunity in front of your organization.</p>
            </div>
            <Link to="/contact" className={`relative inline-flex items-center justify-center gap-2 rounded-lg border border-[#fff9f4] px-7 py-3.5 font-['DM_Sans',sans-serif] font-bold text-white hover:bg-[#fff9f4] hover:text-[#016e71] ${focusRing}`}>
              Start a conversation <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
