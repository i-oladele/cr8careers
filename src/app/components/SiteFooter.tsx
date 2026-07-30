import { useState } from "react";
import svgPaths from "../../imports/Home/svg-trfy73921z";
import { submitContactSubmission } from "../../lib/contactService";
import logoFooter from "../../assets/optimized/logo-footer.png";

const socialLinks = [
  { label: "Facebook", href: "https://facebook.com/cr8careers" },
  { label: "Instagram", href: "https://instagram.com/cr8careers" },
  { label: "X", href: "https://x.com/cr8careers" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/cr8-careers/" },
];

export default function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) return;

    setStatus("submitting");
    const { error } = await submitContactSubmission({
      name: "Newsletter subscriber",
      email: trimmed,
      service: "newsletter",
      message: "Newsletter signup from site footer",
    });
    setStatus(error ? "error" : "success");
    if (!error) setEmail("");
  };

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="h-16 w-40 mb-4">
              <img alt="CR8Careers Logo" className="h-full w-full object-contain object-left" src={logoFooter} />
            </div>
            <p className="font-['DM_Sans',sans-serif] font-bold text-lg">
              repositioning HR<br />repositioning people
            </p>
          </div>
          <div>
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-[#f58c21] text-2xl mb-6">Follow Us</h3>
            <div className="space-y-3">
              {socialLinks.map(({ label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block font-['DM_Sans',sans-serif] text-base hover:text-[#f58c21] transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-['DM_Sans',sans-serif] font-bold text-[#f58c21] text-2xl mb-6">Stay Updated</h3>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <label htmlFor="footer-newsletter-email" className="sr-only">Email address for newsletter</label>
              <input
                id="footer-newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your Email"
                required
                disabled={status === "submitting"}
                className="bg-white text-black px-4 py-3 rounded-lg flex-1 max-w-xs disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f58c21] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                disabled={status === "submitting"}
                className="bg-[#ed2a10] hover:bg-[#d42610] transition-colors p-3 rounded-lg disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                <div className="w-6 h-6">
                  <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
                    <path d={svgPaths.p2b7c1080} fill="white" />
                  </svg>
                </div>
              </button>
            </form>
            {status === "success" && (
              <p className="font-['DM_Sans',sans-serif] text-sm text-green-400 mt-2">Thanks for subscribing!</p>
            )}
            {status === "error" && (
              <p className="font-['DM_Sans',sans-serif] text-sm text-red-400 mt-2">Something went wrong. Please try again.</p>
            )}
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
