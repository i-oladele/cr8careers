import { Link } from "react-router-dom";
import {
  ArrowRight,
  Check,
} from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";

type Service = {
  audience: string;
  title: string;
  description: string;
  features: string[];
  accent: string;
  accentText: string;
  buttonText: string;
  tint: string;
  slug: string;
  detailPath?: string;
};

const services: Service[] = [
  {
    audience: "For organizations hiring key talent",
    title: "Recruitment",
    description: "Find people with the right skills, experience and alignment for your organization.",
    features: ["Talent sourcing and screening", "Technical and behavioural assessments", "Onboarding support"],
    accent: "bg-[#016e71]",
    accentText: "text-[#016e71]",
    buttonText: "text-white",
    tint: "bg-[#e8f5f4] text-[#015b5e]",
    slug: "recruitment",
    detailPath: "/recruitment",
  },
  {
    audience: "For teams that need flexible capacity",
    title: "Staff Outsourcing",
    description: "Build a dependable workforce while we manage the employment administration around it.",
    features: ["Trained personnel deployment", "Payroll and benefits management", "Compliance and performance support"],
    accent: "bg-[#f58c21]",
    accentText: "text-[#b25700]",
    buttonText: "text-black",
    tint: "bg-[#fff1e2] text-[#8a4500]",
    slug: "outsourcing",
    detailPath: "/outsourcing",
  },
  {
    audience: "For organizations developing their people",
    title: "Training",
    description: "Turn capability gaps into focused learning experiences that support stronger performance.",
    features: ["Leadership development", "Technical and workplace skills", "Custom team programmes"],
    accent: "bg-[#ed2a10]",
    accentText: "text-[#c8240e]",
    buttonText: "text-white",
    tint: "bg-[#fff0ed] text-[#9b1b0b]",
    slug: "training",
    detailPath: "/training",
  },
  {
    audience: "For organizations improving HR operations",
    title: "HR Advisory & Consulting",
    description: "Strengthen the policies, structures and people systems that support sustainable growth.",
    features: ["HR policy development", "Performance management systems", "Employee engagement strategy"],
    accent: "bg-[#1d1d1d]",
    accentText: "text-[#1d1d1d]",
    buttonText: "text-white",
    tint: "bg-gray-100 text-gray-800",
    slug: "consulting",
  },
];

const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] focus-visible:ring-offset-4";

function ServiceDetailCard({ service, number }: { service: Service; number: string }) {
  return (
    <article className="relative flex h-full flex-col overflow-hidden rounded-xl border border-[#d7d7d7] bg-white p-6 transition-shadow hover:shadow-lg sm:p-8">
      <div className="mb-5 flex items-start justify-between gap-4">
        <span className={`relative z-10 rounded-full px-3 py-1 font-['DM_Sans',sans-serif] text-xs font-semibold ${service.tint}`}>
          {service.audience}
        </span>
        <span className="absolute right-5 top-2 font-['DM_Sans',sans-serif] text-7xl font-bold tracking-tight text-[#eeeeee]" aria-hidden="true">{number}</span>
      </div>
      <h3 className={`relative z-10 font-['DM_Sans',sans-serif] text-2xl font-bold tracking-tight ${service.accentText}`}>{service.title}</h3>
      <p className="mt-3 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-black">{service.description}</p>
      <ul className="my-6 space-y-3" aria-label={`${service.title} capabilities`}>
        {service.features.map(feature => (
          <li key={feature} className="flex items-start gap-3">
            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#dff3ed] text-[#016e71]">
              <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />
            </span>
            <span className="font-['DM_Sans',sans-serif] text-gray-700">{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto flex flex-wrap items-center gap-4 border-t border-gray-100 pt-6">
        {service.detailPath && (
          <Link
            to={service.detailPath}
            className={`inline-flex items-center gap-2 rounded-md font-['DM_Sans',sans-serif] text-lg font-bold hover:opacity-75 ${service.accentText} ${focusRing}`}
            aria-label={`Learn more about ${service.title}`}
          >
            Learn more <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}
        <Link
          to={`/contact?service=${service.slug}`}
          className={`rounded-lg px-4 py-2.5 font-['DM_Sans',sans-serif] text-sm font-bold transition-opacity hover:opacity-90 ${service.accent} ${service.buttonText} ${focusRing}`}
        >
          Discuss {service.title.toLowerCase()}
        </Link>
      </div>
    </article>
  );
}

export default function ServicesPage() {
  const process = [
    { title: "Listen", description: "We clarify your priorities, challenges and definition of success." },
    { title: "Design", description: "We shape a practical solution around your organization and people." },
    { title: "Deliver", description: "We implement the agreed plan with clear ownership and communication." },
    { title: "Improve", description: "We review outcomes and refine the support as your needs evolve." },
  ];

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader activePage="services" />

      <main>
        <section
          className="relative overflow-hidden bg-[#f9fafb] pb-20 pt-40 md:pt-48 lg:pb-28 lg:pt-56"
          style={{ backgroundImage: "url('/Hero.svg')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
        >
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
            <div className="mb-5 inline-flex rounded-full border border-[rgba(0,0,0,0.4)] bg-[rgba(238,238,238,0.2)] px-6 py-2">
              <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-wider text-black">People solutions built around your goals</p>
            </div>
            <h1 className="font-['DM_Sans',sans-serif] text-4xl font-bold leading-tight tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-6xl">
              Build the workforce your organization needs to <span className="italic text-[#ed2a10]">thrive</span>
            </h1>
            <p className="mt-6 max-w-3xl font-['DM_Sans',sans-serif] text-lg leading-relaxed text-black sm:text-xl">
              From finding great talent to developing teams and strengthening HR operations, we help turn people challenges into practical progress.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a href="#services" className={`rounded-lg bg-[#016e71] px-7 py-3 text-center font-['DM_Sans',sans-serif] text-lg font-bold text-white hover:bg-[#015a5d] ${focusRing}`}>
                Find the right service
              </a>
              <Link to="/contact?service=other" className={`rounded-lg border border-black px-7 py-3 text-center font-['DM_Sans',sans-serif] text-lg font-bold text-[#1d1d1d] hover:bg-gray-50 ${focusRing}`}>
                Talk to an adviser
              </Link>
            </div>
            </div>
          </div>
        </section>

        <section id="services" className="scroll-mt-28 bg-[#fffaf5] py-20 lg:py-28" aria-labelledby="services-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">How we can help</p>
              <h2 id="services-heading" className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold tracking-tight text-[#1d1d1d] md:text-5xl">
                Start with the outcome you need
              </h2>
              <p className="mt-4 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-600">
                Choose a service to explore the details, or speak with us if your challenge crosses more than one area.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
              {services.map((service, index) => <ServiceDetailCard key={service.slug} service={service} number={String(index + 1).padStart(2, "0")} />)}
            </div>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-24" aria-labelledby="proof-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
              <div>
                <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#b91f0b]">The CR8 advantage</p>
                <h2 id="proof-heading" className="mt-3 font-['DM_Sans',sans-serif] text-3xl font-bold tracking-tight text-[#1d1d1d] md:text-4xl">
                  Experience that moves people and businesses forward
                </h2>
                <p className="mt-4 font-['DM_Sans',sans-serif] text-lg leading-relaxed text-gray-600">
                  We combine people expertise with a client-centred approach, supporting organizations from strategy through delivery.
                </p>
              </div>
              <dl className="grid gap-4 sm:grid-cols-3">
                <div className="rounded-2xl bg-[#e8f5f4] p-6">
                  <dt className="font-['DM_Sans',sans-serif] text-sm font-semibold text-[#015b5e]">Organizations served</dt>
                  <dd className="mt-2 font-['DM_Sans',sans-serif] text-4xl font-bold text-[#073f42]">500+</dd>
                </div>
                <div className="rounded-2xl bg-[#fff1e2] p-6">
                  <dt className="font-['DM_Sans',sans-serif] text-sm font-semibold text-[#8a4500]">Professionals placed</dt>
                  <dd className="mt-2 font-['DM_Sans',sans-serif] text-4xl font-bold text-[#6b3600]">10,000+</dd>
                </div>
                <div className="rounded-2xl bg-gray-100 p-6">
                  <dt className="font-['DM_Sans',sans-serif] text-sm font-semibold text-gray-600">Support model</dt>
                  <dd className="mt-2 font-['DM_Sans',sans-serif] text-xl font-bold text-[#1d1d1d]">End-to-end partnership</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        <section className="bg-[#f8f8f8] py-16 lg:py-24" aria-labelledby="process-heading">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto mb-12 max-w-2xl text-center">
              <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#b91f0b]">A clear way forward</p>
              <h2 id="process-heading" className="mt-3 font-['DM_Sans',sans-serif] text-3xl font-bold text-[#1d1d1d] md:text-4xl">How we work with you</h2>
            </div>
            <ol className="relative grid gap-8 md:grid-cols-4 md:gap-5">
              <div className="absolute left-[12.5%] right-[12.5%] top-8 hidden h-px bg-[#9ac7c8] md:block" aria-hidden="true" />
              {process.map((item, index) => (
                <li key={item.title} className="relative grid grid-cols-[3.5rem_1fr] gap-4 md:block md:text-center">
                  <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-lg border-4 border-[#f8f8f8] bg-[#016e71] font-['DM_Sans',sans-serif] text-lg font-bold text-white md:mx-auto md:mb-5 md:h-16 md:w-16">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-['DM_Sans',sans-serif] text-xl font-bold text-[#1d1d1d]">{item.title}</h3>
                    <p className="mt-2 font-['DM_Sans',sans-serif] leading-relaxed text-gray-600">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-white py-16 lg:py-20" aria-labelledby="cta-heading">
          <div className="relative mx-4 grid max-w-7xl gap-8 overflow-hidden rounded-2xl bg-[#016e71] px-6 py-12 text-white sm:mx-6 sm:px-10 md:grid-cols-[1fr_auto] md:items-center lg:mx-auto lg:px-12">
            <img src="/Hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" aria-hidden="true" />
            <div>
              <h2 id="cta-heading" className="relative font-['DM_Sans',sans-serif] text-3xl font-bold md:text-4xl">Not sure which service fits?</h2>
              <p className="mt-3 max-w-2xl font-['DM_Sans',sans-serif] text-lg text-white/80">Tell us what is getting in the way. We’ll help you identify a practical next step.</p>
            </div>
            <Link to="/contact?service=other" className={`relative inline-flex items-center justify-center gap-2 rounded-lg border border-[#fff9f4] px-7 py-3.5 font-['DM_Sans',sans-serif] font-bold text-white hover:bg-[#fff9f4] hover:text-[#016e71] ${focusRing}`}>
              Request a consultation <ArrowRight className="h-5 w-5" aria-hidden="true" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
