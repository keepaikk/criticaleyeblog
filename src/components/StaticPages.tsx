import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
  Send,
  AlertTriangle,
  Scale,
  Award,
} from 'lucide-react';
import { Author } from '../types';

interface StaticPageProps {
  pageId: string;
  onNavigatePage: (pageId: string) => void;
  authors: Author[];
}

export const StaticPages: React.FC<StaticPageProps> = ({ pageId, onNavigatePage, authors }) => {
  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    subject: 'Story Tip / Editorial Inquiry',
    message: '',
  });
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Correction request state
  const [correctionForm, setCorrectionForm] = useState({
    articleTitle: '',
    articleUrl: '',
    details: '',
    sourceCitation: '',
    name: '',
    email: '',
  });
  const [correctionSubmitted, setCorrectionSubmitted] = useState(false);

  // Advertise inquiry state
  const [adFormSubmitted, setAdFormSubmitted] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  const handleCorrectionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCorrectionSubmitted(true);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 transition-colors">
      {/* Page Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 border-b border-stone-200 dark:border-stone-800 text-xs font-semibold">
        {[
          { id: 'about', label: 'About Us' },
          { id: 'editorial-policy', label: 'Editorial Policy' },
          { id: 'corrections-policy', label: 'Corrections Policy' },
          { id: 'medical-disclaimer', label: 'Medical Disclaimer' },
          { id: 'contact', label: 'Contact & Tips' },
          { id: 'advertise', label: 'Advertise' },
          { id: 'privacy', label: 'Privacy Policy' },
          { id: 'terms', label: 'Terms of Use' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigatePage(item.id)}
            className={`px-3 py-1.5 rounded-sm whitespace-nowrap transition-colors ${
              pageId === item.id
                ? 'bg-amber-900 text-white dark:bg-amber-500 dark:text-stone-950 font-bold'
                : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 bg-stone-100 dark:bg-stone-900 hover:bg-stone-200 dark:hover:bg-stone-800'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* ABOUT US */}
      {pageId === 'about' && (
        <section className="space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
              Our Identity & Mission
            </span>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-stone-950 dark:text-stone-50 mt-1 mb-3">
              About Critical Eye
            </h1>
            <p className="text-lg font-serif italic text-stone-600 dark:text-stone-300">
              Journalism with Perspective. Reporting with Purpose.
            </p>
          </div>

          <div className="prose-editorial text-stone-700 dark:text-stone-300">
            <p className="editorial-dropcap font-sans">
              Critical Eye is a trusted source for credible healthcare journalism, insightful analysis, and stories that matter. We believe readers deserve more than rapid headlines; they deserve verifiable facts, systemic context, institutional accountability, and perspectives that empower informed decisions.
            </p>
            <p>
              Headquartered in Accra, Ghana, our reporting focuses on Ghanaian healthcare developments, regional public health challenges across West Africa, and the critical global health decisions that shape African wellbeing.
            </p>
            <p>
              Beyond the long-form editorial platform, Critical Eye Blog operates as a digital public-health newsroom: short-form explainers, data snapshots, and frontline dispatches ship first on our social channels and then mature into full investigations here. Join our community on{' '}
              <a
                href="https://www.facebook.com/Criticaleyeblog/"
                target="_blank"
                rel="noreferrer"
                className="text-amber-900 dark:text-amber-400 underline decoration-amber-800/40 underline-offset-2 hover:decoration-amber-800"
              >
                Facebook
              </a>
              , where tens of thousands of readers follow our daily coverage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
            <div className="p-6 bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 rounded-sm">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                <span>Our Mission</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                To provide accurate, independent, and impactful healthcare journalism that informs the public, promotes institutional accountability, and contributes meaningfully to national and global health development.
              </p>
            </div>

            <div className="p-6 bg-stone-100/70 dark:bg-stone-900/70 border border-stone-200 dark:border-stone-800 rounded-sm">
              <h3 className="text-base font-serif font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-2">
                <Scale className="w-5 h-5 text-amber-800 dark:text-amber-400" />
                <span>Our Vision</span>
              </h3>
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
                To become West Africa’s most trusted digital healthcare news platform, recognized internationally for journalistic rigor, epidemiological integrity, and relentless dedication to the public interest.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">
              Our Core Journalistic Values
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              {[
                { title: 'Truth', desc: 'Unyielding commitment to empirical facts and primary data.' },
                { title: 'Integrity', desc: 'Total editorial independence free from commercial influence.' },
                { title: 'Accountability', desc: 'Scrutinizing policies, budgets, and healthcare delivery.' },
                { title: 'Objectivity', desc: 'Balanced, fair, and nuanced reporting without sensationalism.' },
                { title: 'Public Interest', desc: 'Centering the health rights of citizens and vulnerable groups.' },
                { title: 'Innovation', desc: 'Embracing clinical technology and modern newsroom tools.' },
              ].map((val) => (
                <div key={val.title} className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm">
                  <div className="font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">{val.title}</div>
                  <div className="text-stone-500 dark:text-stone-400 leading-relaxed">{val.desc}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Masthead */}
          <div className="pt-8 border-t border-stone-200 dark:border-stone-800">
            <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">
              Newsroom Masthead & Medical Contributors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {authors.map((auth) => (
                <div key={auth.id} className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm flex gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-900/10 dark:bg-amber-400/10 text-amber-900 dark:text-amber-400 font-serif font-bold flex items-center justify-center shrink-0">
                    {auth.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-stone-900 dark:text-stone-100 text-sm">{auth.name}</h4>
                    <p className="text-xs text-amber-900 dark:text-amber-400 font-medium">{auth.role}</p>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 line-clamp-2 leading-relaxed">{auth.bio}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* EDITORIAL POLICY */}
      {pageId === 'editorial-policy' && (
        <section className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
            Newsroom Standards
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50">
            Editorial Policy & Journalistic Code of Practice
          </h1>

          <div className="prose-editorial text-stone-700 dark:text-stone-300 text-sm sm:text-base leading-relaxed space-y-4">
            <p>
              Critical Eye operates in accordance with the highest principles of independent journalism. Healthcare reporting directly influences human life and wellbeing; consequently, our reporters, editors, and clinical contributors follow strict evidentiary guidelines.
            </p>

            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-6">
              1. Evidence-Based Verification
            </h2>
            <p>
              We do not publish unverified clinical claims, anecdotal remedies, or speculative pharmaceutical assertions as established scientific facts. Any discussion of therapies, vaccine candidates, or epidemiological trends must reference peer-reviewed research, authorized regulatory registries (such as the Ghana FDA, WHO, or Africa CDC), or on-the-record statements from credentialed experts.
            </p>

            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-6">
              2. Clear Distinction of Content Types
            </h2>
            <p>
              We maintain absolute transparency regarding the genre of our published work. Straight reporting is labelled <strong>News</strong>; contextual evaluations with statistical interpretation are labelled <strong>Analysis</strong>; in-depth accountability exposés are labelled <strong>Investigation</strong>; and commentary representing individual perspectives is labelled <strong>Opinion</strong>.
            </p>

            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-6">
              3. Protection of Patient Privacy & Vulnerable Populations
            </h2>
            <p>
              Under no circumstance do we violate patient confidentiality, reveal medical record numbers, or publish identifiable photographs of minors or patients undergoing medical procedures without informed, written consent.
            </p>

            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-6">
              4. Separation of Editorial and Commercial Interests
            </h2>
            <p>
              Advertising partners, pharmaceutical sponsors, and external benefactors exert zero influence over our story selection, headline framing, or investigative conclusions. Sponsored content, where permitted, is unequivocally disclosed.
            </p>
          </div>
        </section>
      )}

      {/* CORRECTIONS POLICY */}
      {pageId === 'corrections-policy' && (
        <section className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
            Accountability & Transparency
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50">
            Corrections & Clarifications Policy
          </h1>

          <div className="prose-editorial text-stone-700 dark:text-stone-300 text-sm sm:text-base space-y-4">
            <p>
              Critical Eye is committed to prompt, transparent corrections whenever factual inaccuracies, misleading descriptions, or attribution errors occur. We believe that acknowledging and correcting errors openly builds public trust.
            </p>
            <p>
              When a material error is identified:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <li>The article is updated promptly in our CMS.</li>
              <li>A clearly visible <strong>Correction Notice</strong> is appended directly to the article footer detailing what was changed, the date of correction, and the editor responsible.</li>
              <li>The correction is permanently recorded in the article’s audit ledger.</li>
            </ul>
          </div>

          {/* Correction Request Form */}
          <div className="mt-8 p-6 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm">
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-2">
              Submit a Factual Correction Request
            </h2>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
              If you have identified an inaccuracy in one of our published stories, please provide specific citations and primary source documents.
            </p>

            {correctionSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Your correction request has been received by the Managing Editor Desk. Our fact-checking team will review within 24 hours.</span>
              </div>
            ) : (
              <form onSubmit={handleCorrectionSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Article Headline *</label>
                    <input
                      type="text"
                      required
                      value={correctionForm.articleTitle}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, articleTitle: e.target.value })}
                      placeholder="e.g. NHIS Expands Dialysis Coverage..."
                      className="w-full p-2 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Article URL / Slug</label>
                    <input
                      type="text"
                      value={correctionForm.articleUrl}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, articleUrl: e.target.value })}
                      placeholder="e.g. /article/nhis-expands..."
                      className="w-full p-2 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Details of Inaccuracy & Correct Information *</label>
                  <textarea
                    required
                    rows={3}
                    value={correctionForm.details}
                    onChange={(e) => setCorrectionForm({ ...correctionForm, details: e.target.value })}
                    placeholder="Describe the exact factual error and provide the verifiable correction."
                    className="w-full p-2 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Primary Source Reference</label>
                  <input
                    type="text"
                    value={correctionForm.sourceCitation}
                    onChange={(e) => setCorrectionForm({ ...correctionForm, sourceCitation: e.target.value })}
                    placeholder="URL to ministry communique, clinical registry, or audit report."
                    className="w-full p-2 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Your Name</label>
                    <input
                      type="text"
                      value={correctionForm.name}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, name: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Your Email *</label>
                    <input
                      type="email"
                      required
                      value={correctionForm.email}
                      onChange={(e) => setCorrectionForm({ ...correctionForm, email: e.target.value })}
                      className="w-full p-2 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded font-medium transition-colors"
                >
                  Submit Correction Request
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* MEDICAL DISCLAIMER */}
      {pageId === 'medical-disclaimer' && (
        <section className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
            Health Safety & Legal Notice
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50">
            Medical Disclaimer & Public Health Advisory
          </h1>

          <div className="p-5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200/90 dark:border-amber-800 rounded-sm">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-800 dark:text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-stone-800 dark:text-stone-200 leading-relaxed space-y-2">
                <p className="font-bold text-stone-950 dark:text-stone-100">
                  Critical Eye is an independent journalistic healthcare publication, not a medical clinic or licensed healthcare provider.
                </p>
                <p>
                  All articles, infographics, analysis, quotes, and research reports published across our platforms are intended solely for general informational, educational, and public accountability purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="prose-editorial text-stone-700 dark:text-stone-300 text-sm sm:text-base space-y-4">
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              No Clinical Doctor-Patient Relationship
            </h2>
            <p>
              Reading articles on Critical Eye or interacting with our digital features does not create a physician-patient relationship. Content must never be used to diagnose, prescribe, treat, or replace professional clinical care from qualified Ghanaian doctors, midwives, or community nurses.
            </p>

            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100">
              Emergency Healthcare Guidance
            </h2>
            <p>
              If you or someone under your care is experiencing an acute medical emergency—such as severe chest pain, snake envenomation, high febrile convulsions, postpartum hemorrhage, or breathing difficulties—immediately contact Ghana’s National Ambulance Service (193 or 112) or proceed to the nearest emergency polyclinic.
            </p>
          </div>
        </section>
      )}

      {/* CONTACT PAGE */}
      {pageId === 'contact' && (
        <section className="space-y-8">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
              Get in Touch
            </span>
            <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50 mt-1 mb-2">
              Contact Critical Eye Desk
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-sm">
              We welcome confidential news tips, clinical research submissions, press inquiries, and reader feedback.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm space-y-2">
              <MapPin className="w-5 h-5 text-amber-800 dark:text-amber-400" />
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Newsroom Bureau</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                4th Floor, Ridge Heights Tower<br />
                Independence Avenue, Ridge<br />
                Accra, Ghana
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm space-y-2">
              <Phone className="w-5 h-5 text-amber-800 dark:text-amber-400" />
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Secure Tip Line</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                Phone / WhatsApp: +233 (0) 30 298 4410<br />
                Signal (Encrypted): +233 (0) 24 551 8892<br />
                Confidentiality guaranteed.
              </p>
            </div>

            <div className="p-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm space-y-2">
              <Mail className="w-5 h-5 text-amber-800 dark:text-amber-400" />
              <h3 className="font-bold text-stone-900 dark:text-stone-100 text-sm">Editorial Desks</h3>
              <p className="text-xs text-stone-600 dark:text-stone-400 leading-relaxed">
                General: desk@criticaleyenews.org<br />
                Investigations: tips@criticaleyenews.org<br />
                Press: press@criticaleyenews.org
              </p>
            </div>
          </div>

          {/* Contact & Tip Message Form */}
          <div className="p-6 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm">
            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">
              Send a Message or Confidential Tip
            </h2>

            {contactSubmitted ? (
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 rounded text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span>Thank you. Your message has been encrypted and forwarded to the duty editor in Accra.</span>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Your Name (or "Anonymous") *</label>
                    <input
                      type="text"
                      required
                      value={contactForm.name}
                      onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>
                  <div>
                    <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Contact Email *</label>
                    <input
                      type="email"
                      required
                      value={contactForm.email}
                      onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                      className="w-full p-2.5 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Subject</label>
                  <select
                    value={contactForm.subject}
                    onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })}
                    className="w-full p-2.5 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                  >
                    <option>Story Tip / Editorial Inquiry</option>
                    <option>Healthcare Whistleblower Tip</option>
                    <option>Research Paper / Clinical Trial Notice</option>
                    <option>Press Release / Ministry Communique</option>
                    <option>Letter to the Editor</option>
                  </select>
                </div>

                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-semibold mb-1">Your Message or Lead *</label>
                  <textarea
                    required
                    rows={4}
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    placeholder="Provide detailed facts, locations, and any relevant official documentation."
                    className="w-full p-2.5 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-white text-white dark:text-stone-900 rounded font-medium inline-flex items-center gap-2 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit to Newsroom</span>
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* ADVERTISE PAGE */}
      {pageId === 'advertise' && (
        <section className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
            Partnerships & Sponsorships
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50">
            Ethical Healthcare Advertising & Media Partnerships
          </h1>

          <div className="prose-editorial text-stone-700 dark:text-stone-300 text-sm sm:text-base space-y-4">
            <p>
              Critical Eye reaches tens of thousands of healthcare leaders, medical practitioners, public health officers, pharmaceutical scientists, policy analysts, and health-conscious citizens across Ghana and the African diaspora.
            </p>
            <p>
              We welcome partnerships that support high-impact public health communication, accredited continuing medical education (CME), health technology innovations, and reputable clinical conferences.
            </p>

            <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mt-6">
              Our Ethical Advertising Standards
            </h2>
            <ul className="list-disc pl-5 space-y-1 text-xs sm:text-sm text-stone-700 dark:text-stone-300">
              <li>All partner messages are rigorously reviewed for scientific validity and consumer safety.</li>
              <li>We strictly reject advertising for unapproved medicines, miraculous cure claims, or unregulated herbal supplements.</li>
              <li>Sponsored sections are clearly marked to maintain reader trust and separation from editorial reporting.</li>
            </ul>
          </div>

          <div className="p-6 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-sm">
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100 text-base mb-2">
              Request the Critical Eye 2026/2027 Media Kit
            </h3>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-4">
              Contact our commercial partnerships team for demographic reach, newsletter sponsorships, and conference partnership rates.
            </p>

            {adFormSubmitted ? (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-200 text-xs rounded border border-emerald-200 dark:border-emerald-800">
                Media kit request dispatched. Our partnerships desk will contact you within one business day.
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setAdFormSubmitted(true);
                }}
                className="flex flex-col sm:flex-row gap-2 max-w-md"
              >
                <input
                  type="email"
                  required
                  placeholder="Enter organization email"
                  className="p-2.5 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded text-xs text-stone-900 dark:text-stone-100 flex-1 focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-amber-900 dark:bg-amber-500 hover:bg-amber-950 dark:hover:bg-amber-400 text-white dark:text-stone-950 rounded text-xs font-semibold shrink-0"
                >
                  Send Media Kit
                </button>
              </form>
            )}
          </div>
        </section>
      )}

      {/* PRIVACY POLICY */}
      {pageId === 'privacy' && (
        <section className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
            Data Protection
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50">
            Privacy Policy
          </h1>
          <div className="prose-editorial text-stone-700 dark:text-stone-300 text-sm space-y-3">
            <p>
              Critical Eye is committed to protecting the privacy of our readers and subscribers in compliance with the Ghana Data Protection Act 2012 (Act 843) and international data privacy principles.
            </p>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100">Information We Collect</h3>
            <p>
              We only collect information voluntarily provided when you subscribe to our newsletter (email address) or submit a newsroom inquiry. We do not sell or monetize personal subscriber data with third-party data brokers.
            </p>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100">Local Storage & Offline Reading</h3>
            <p>
              Our application uses local browser storage exclusively to preserve your reading preferences, saved bookmark lists, and article drafts in the newsroom editor.
            </p>
          </div>
        </section>
      )}

      {/* TERMS OF USE */}
      {pageId === 'terms' && (
        <section className="space-y-6">
          <span className="text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-semibold">
            Legal Terms
          </span>
          <h1 className="text-3xl font-serif font-bold text-stone-950 dark:text-stone-50">
            Terms of Use & Intellectual Property
          </h1>
          <div className="prose-editorial text-stone-700 dark:text-stone-300 text-sm space-y-3">
            <p>
              By accessing Critical Eye, you agree to these Terms of Use. All original investigative reporting, photographs, analysis, and infographics are the copyrighted property of Critical Eye unless credited otherwise.
            </p>
            <h3 className="font-serif font-bold text-stone-900 dark:text-stone-100">Reproduction & Syndication</h3>
            <p>
              Non-profit academic, civic, and community health organizations may excerpt up to 150 words of our coverage provided full hyperlinked attribution is given to Critical Eye. Commercial syndication requires prior written licensing authorization.
            </p>
          </div>
        </section>
      )}
    </div>
  );
};
