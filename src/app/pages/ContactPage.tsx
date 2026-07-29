import { useState } from "react";
import SiteHeader from "../components/SiteHeader";
import svgPaths from "../../imports/Home/svg-trfy73921z";
import { submitContactSubmission } from "../../lib/contactService";

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

function ContactInfoCard({ icon, title, content, link }: { 
  icon: string; 
  title: string; 
  content: string; 
  link?: string;
}) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 bg-[#016e71] text-white rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-xl">{icon}</span>
        </div>
        <div>
          <h3 className="font-['DM_Sans',sans-serif] font-bold text-lg text-[#1d1d1d] mb-2">{title}</h3>
          {link ? (
            <a href={link} className="font-['DM_Sans',sans-serif] text-gray-600 hover:text-[#016e71] transition-colors">
              {content}
            </a>
          ) : (
            <p className="font-['DM_Sans',sans-serif] text-gray-600">{content}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  };
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service: '',
    message: ''
  });
  const [submitStatus, setSubmitStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus(null);

    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();

    if (!name || !email || !message) {
      setSubmitStatus({ type: 'error', message: 'Please complete your name, email, and message.' });
      return;
    }

    setSubmitting(true);
    const { error } = await submitContactSubmission({ ...formData, name, email, message });
    setSubmitting(false);

    if (error) {
      setSubmitStatus({ type: 'error', message: error });
      return;
    }

    setFormData(initialFormData);
    setSubmitStatus({ type: 'success', message: 'Thank you for contacting us. We will get back to you soon.' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader activePage="contact" />
      
      {/* Hero Section */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24 bg-gradient-to-br from-[#016e71] to-[#f58c21]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="font-['DM_Sans',sans-serif] font-bold text-white text-4xl md:text-5xl lg:text-6xl mb-6">
              Get in Touch
            </h1>
            <p className="font-['DM_Sans',sans-serif] text-white text-xl max-w-3xl mx-auto">
              Ready to transform your HR? Let's discuss how we can help your organization thrive
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#1d1d1d] mb-6">
                  Contact Information
                </h2>
                <p className="font-['DM_Sans',sans-serif] text-gray-600 mb-8">
                  Reach out to us through any of the following channels. We're here to help!
                </p>
              </div>
              
              <ContactInfoCard
                icon="📧"
                title="Email"
                content="info@cr8careers.com"
                link="mailto:info@cr8careers.com"
              />
              
              <ContactInfoCard
                icon="📞"
                title="Phone"
                content="+234 800 123 4567"
                link="tel:+2348001234567"
              />
              
              <ContactInfoCard
                icon="📍"
                title="Office"
                content="123 Victoria Island, Lagos, Nigeria"
              />
              
              <ContactInfoCard
                icon="🕐"
                title="Business Hours"
                content="Monday - Friday: 9:00 AM - 6:00 PM"
              />
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h2 className="font-['DM_Sans',sans-serif] font-bold text-2xl text-[#1d1d1d] mb-6">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {submitStatus && (
                    <div
                      role="status"
                      className={`rounded-lg border px-4 py-3 font-['DM_Sans',sans-serif] text-sm ${
                        submitStatus.type === 'success'
                          ? 'border-green-200 bg-green-50 text-green-700'
                          : 'border-red-200 bg-red-50 text-red-700'
                      }`}
                    >
                      {submitStatus.message}
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2 block">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent"
                        placeholder="John Doe"
                      />
                    </div>
                    
                    <div>
                      <label className="font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2 block">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent"
                        placeholder="john@example.com"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent"
                        placeholder="+234 800 000 0000"
                      />
                    </div>
                    
                    <div>
                      <label className="font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2 block">
                        Company
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleInputChange}
                        disabled={submitting}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent"
                        placeholder="Your Company Ltd"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2 block">
                      Service Interest
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      disabled={submitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent"
                    >
                      <option value="">Select a service</option>
                      <option value="recruitment">Recruitment</option>
                      <option value="outsourcing">Outsourcing</option>
                      <option value="training">Training</option>
                      <option value="consulting">Consulting</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-['DM_Sans',sans-serif] font-semibold text-gray-700 mb-2 block">
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      disabled={submitting}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#016e71] focus:border-transparent"
                      placeholder="Tell us how we can help you..."
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-4">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="bg-[#016e71] text-white px-8 py-3 rounded-lg hover:bg-[#015a5d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <p className="font-['DM_Sans',sans-serif] font-bold">{submitting ? 'Sending...' : 'Send Message'}</p>
                    </button>
                    <p className="font-['DM_Sans',sans-serif] text-sm text-gray-500">
                      We'll respond within 24 hours
                </p>
              </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-['DM_Sans',sans-serif] font-bold text-3xl text-[#1d1d1d] mb-4">
              Visit Our Office
            </h2>
            <p className="font-['DM_Sans',sans-serif] text-gray-600 text-lg">
              Stop by for a consultation - we'd love to meet you in person
            </p>
          </div>
          
          <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#016e71] text-white rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📍</span>
              </div>
              <h3 className="font-['DM_Sans',sans-serif] font-bold text-xl text-[#1d1d1d] mb-2">
                123 Victoria Island
              </h3>
              <p className="font-['DM_Sans',sans-serif] text-gray-600">
                Lagos, Nigeria
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
