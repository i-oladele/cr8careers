import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, CheckCircle2, Mail, MessageSquareText } from "lucide-react";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { submitContactSubmission } from "../../lib/contactService";

const VALID_SERVICES = ["recruitment", "outsourcing", "training", "consulting", "other"];
const focusRing = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#016e71] focus-visible:ring-offset-2";
const fieldClass = `w-full rounded-lg border border-gray-300 bg-white px-4 py-3 font-['DM_Sans',sans-serif] text-[#1d1d1d] placeholder:text-gray-400 disabled:bg-gray-100 disabled:text-gray-500 ${focusRing}`;

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const requestedService = searchParams.get("service");
  const initialFormData = {
    name: "",
    email: "",
    phone: "",
    company: "",
    service: requestedService && VALID_SERVICES.includes(requestedService) ? requestedService : "",
    message: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [submitStatus, setSubmitStatus] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(current => ({ ...current, [event.target.name]: event.target.value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitStatus(null);
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setSubmitStatus({ type: "error", message: "Please complete your name, email address and message." });
      return;
    }

    setSubmitting(true);
    const { error } = await submitContactSubmission({ ...formData, name, email, message });
    setSubmitting(false);

    if (error) {
      setSubmitStatus({ type: "error", message: error });
      return;
    }

    setFormData({ ...initialFormData, service: "" });
    setSubmitStatus({ type: "success", message: "Thank you. Your message has been sent successfully." });
  };

  return (
    <div className="min-h-screen bg-white">
      <SiteHeader activePage="contact" />

      <main>
        <section
          className="relative overflow-hidden bg-[#f9fafb] pb-20 pt-40 md:pt-48 lg:pb-28 lg:pt-56"
          style={{ backgroundImage: "url('/Hero.svg')", backgroundPosition: "center", backgroundRepeat: "no-repeat", backgroundSize: "cover" }}
        >
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl">
              <div className="mb-5 inline-flex rounded-full border border-black/40 bg-white/20 px-6 py-2">
                <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-wider text-black">Contact Cr8Careers</p>
              </div>
              <h1 className="font-['DM_Sans',sans-serif] text-4xl font-bold leading-tight tracking-tight text-[#1d1d1d] sm:text-5xl lg:text-6xl">
                Let’s turn your people challenge into <span className="italic text-[#ed2a10]">progress.</span>
              </h1>
              <p className="mt-6 max-w-3xl font-['DM_Sans',sans-serif] text-lg leading-relaxed text-black sm:text-xl">
                Tell us what you are working toward and where you need support. We’ll use your message to start the right conversation.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[#fffaf5] py-20 lg:py-28" aria-labelledby="contact-form-heading">
          <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16 lg:px-8">
            <aside>
              <p className="font-['DM_Sans',sans-serif] text-sm font-bold uppercase tracking-widest text-[#ed2a10]">Start a conversation</p>
              <h2 className="mt-3 font-['DM_Sans',sans-serif] text-4xl font-bold tracking-tight text-[#1d1d1d]">What happens next</h2>
              <ol className="mt-8 space-y-6">
                {[
                  "Share your needs through the form.",
                  "We review the details and identify the right area of support.",
                  "A member of the team follows up to discuss practical next steps.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#016e71] font-['DM_Sans',sans-serif] text-sm font-bold text-white">{String(index + 1).padStart(2, "0")}</span>
                    <p className="pt-1 font-['DM_Sans',sans-serif] leading-relaxed text-gray-700">{step}</p>
                  </li>
                ))}
              </ol>
              <div className="mt-10 rounded-xl border border-[#d7d7d7] bg-white p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-[#e8f5f4] text-[#016e71]"><Mail aria-hidden="true" /></div>
                <h3 className="mt-4 font-['DM_Sans',sans-serif] text-xl font-bold text-[#1d1d1d]">Prefer email?</h3>
                <a href="mailto:info@cr8careers.com" className={`mt-2 inline-block rounded-sm font-['DM_Sans',sans-serif] font-bold text-[#016e71] hover:opacity-75 ${focusRing}`}>info@cr8careers.com</a>
              </div>
              <p className="mt-6 font-['DM_Sans',sans-serif] text-sm leading-relaxed text-gray-500">Please do not include passwords, payment information or other sensitive personal information in your message.</p>
            </aside>

            <div className="rounded-xl border border-[#d7d7d7] bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <div className="mb-8 flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#f58c21] text-black"><MessageSquareText aria-hidden="true" /></div>
                <div>
                  <h2 id="contact-form-heading" className="font-['DM_Sans',sans-serif] text-3xl font-bold text-[#1d1d1d]">Send us a message</h2>
                  <p className="mt-1 font-['DM_Sans',sans-serif] text-gray-600">Fields marked with an asterisk are required.</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {submitStatus && (
                  <div role={submitStatus.type === "error" ? "alert" : "status"} aria-live="polite" className={`flex items-start gap-3 rounded-lg border px-4 py-3 font-['DM_Sans',sans-serif] text-sm ${submitStatus.type === "success" ? "border-green-200 bg-green-50 text-green-800" : "border-red-200 bg-red-50 text-red-800"}`}>
                    {submitStatus.type === "success" && <CheckCircle2 className="h-5 w-5 shrink-0" aria-hidden="true" />}
                    {submitStatus.message}
                  </div>
                )}

                <div className="grid gap-6 md:grid-cols-2">
                  <div><label htmlFor="contact-name" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Full name *</label><input id="contact-name" type="text" name="name" autoComplete="name" value={formData.name} onChange={handleInputChange} required disabled={submitting} className={fieldClass} placeholder="Your name" /></div>
                  <div><label htmlFor="contact-email" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Email address *</label><input id="contact-email" type="email" name="email" autoComplete="email" value={formData.email} onChange={handleInputChange} required disabled={submitting} className={fieldClass} placeholder="you@example.com" /></div>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  <div><label htmlFor="contact-phone" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Phone number <span className="font-normal text-gray-500">(optional)</span></label><input id="contact-phone" type="tel" name="phone" autoComplete="tel" value={formData.phone} onChange={handleInputChange} disabled={submitting} className={fieldClass} placeholder="Your phone number" /></div>
                  <div><label htmlFor="contact-company" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Organization <span className="font-normal text-gray-500">(optional)</span></label><input id="contact-company" type="text" name="company" autoComplete="organization" value={formData.company} onChange={handleInputChange} disabled={submitting} className={fieldClass} placeholder="Your organization" /></div>
                </div>
                <div><label htmlFor="contact-service" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">Area of interest <span className="font-normal text-gray-500">(optional)</span></label><select id="contact-service" name="service" value={formData.service} onChange={handleInputChange} disabled={submitting} className={fieldClass}><option value="">Select an area</option><option value="recruitment">Recruitment</option><option value="outsourcing">Staff Outsourcing</option><option value="training">Training</option><option value="consulting">HR Advisory & Consulting</option><option value="other">Something else</option></select></div>
                <div><label htmlFor="contact-message" className="mb-2 block font-['DM_Sans',sans-serif] font-semibold text-gray-700">How can we help? *</label><textarea id="contact-message" name="message" value={formData.message} onChange={handleInputChange} required rows={6} disabled={submitting} className={fieldClass} placeholder="Tell us about your goals, challenge or question." /></div>
                <button type="submit" disabled={submitting} className={`inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#016e71] px-8 py-3.5 font-['DM_Sans',sans-serif] text-lg font-bold text-white hover:bg-[#015a5d] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto ${focusRing}`}>
                  {submitting ? "Sending…" : "Send message"}{!submitting && <ArrowRight className="h-5 w-5" aria-hidden="true" />}
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="py-16 lg:py-20" aria-labelledby="contact-services-heading">
          <div className="relative mx-4 grid max-w-7xl gap-8 overflow-hidden rounded-2xl bg-[#016e71] px-6 py-12 text-white sm:mx-6 sm:px-10 md:grid-cols-[1fr_auto] md:items-center lg:mx-auto lg:px-12">
            <img src="/Hero.svg" alt="" className="absolute inset-0 h-full w-full object-cover opacity-20" aria-hidden="true" />
            <div className="relative"><h2 id="contact-services-heading" className="font-['DM_Sans',sans-serif] text-3xl font-bold md:text-4xl">Want to understand your options first?</h2><p className="mt-3 max-w-2xl font-['DM_Sans',sans-serif] text-lg text-white/85">Explore how recruitment, outsourcing, training and HR advisory can support your organization.</p></div>
            <Link to="/services" className={`relative inline-flex items-center justify-center gap-2 rounded-lg border border-white px-7 py-3.5 font-['DM_Sans',sans-serif] font-bold text-white hover:bg-white hover:text-[#016e71] ${focusRing}`}>Explore our services <ArrowRight className="h-5 w-5" aria-hidden="true" /></Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
