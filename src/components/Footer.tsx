import React from 'react';
import { ShieldCheck, Rss } from 'lucide-react';

interface FooterProps {
  onNavigatePage: (pageId: string) => void;
  onNavigateCategory: (category: string) => void;
  onNavigateBlog?: () => void;
}

// Clean inline social icons — no extra dependencies
const SocialIcons = {
  facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  x: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26 9.889 9.889 0 019.883-9.882c2.638 0 5.118 1.028 6.982 2.894a9.87 9.87 0 012.893 6.984 9.888 9.888 0 01-9.883 9.882M12 0C5.373 0 0 5.373 0 12c0 2.127.557 4.21 1.613 6.038L.553 23.703a.58.58 0 00.668.675l5.896-1.545A11.94 11.94 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  ),
};

export const Footer: React.FC<FooterProps> = ({
  onNavigatePage,
  onNavigateCategory,
  onNavigateBlog,
}) => {
  const topics = ['Ghana Health', 'Public Health', 'Medical Research'];

  const legalLinks = [
    { id: 'about', label: 'About' },
    { id: 'editorial-policy', label: 'Editorial Policy' },
    { id: 'contact', label: 'Contact' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 text-xs">
      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-5">
          {/* Brand */}
          <div className="max-w-md">
            <div className="flex items-baseline gap-2.5 mb-1">
              <span className="font-serif font-black text-lg sm:text-xl text-white tracking-tight">
                CRITICAL EYE BLOG
              </span>
              <span className="text-amber-500 font-serif italic text-xs">
                Journalism with Perspective. Reporting with Purpose.
              </span>
            </div>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              Independent Ghanaian & African healthcare journalism committed to truth, evidence-based reporting, and accountability.
            </p>
          </div>

          {/* Social icons — clean row */}
          <div className="flex items-center gap-4">
            <a
              href="https://facebook.com/criticaleye"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="text-stone-500 hover:text-amber-400 transition-colors"
            >
              {SocialIcons.facebook}
            </a>
            <a
              href="https://x.com/criticaleye"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="X (Twitter)"
              className="text-stone-500 hover:text-amber-400 transition-colors"
            >
              {SocialIcons.x}
            </a>
            <a
              href="https://linkedin.com/company/criticaleye"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-stone-500 hover:text-amber-400 transition-colors"
            >
              {SocialIcons.linkedin}
            </a>
            <a
              href="https://wa.me/233000000000"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="text-stone-500 hover:text-amber-400 transition-colors"
            >
              {SocialIcons.whatsapp}
            </a>
            <a
              href="mailto:editor@criticaleye.org"
              aria-label="Email"
              className="text-stone-500 hover:text-amber-400 transition-colors"
            >
              {SocialIcons.mail}
            </a>
            <button
              onClick={() => alert('RSS feed coming soon')}
              aria-label="RSS Feed"
              className="text-stone-500 hover:text-amber-400 transition-colors"
            >
              <Rss className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom strip — topics, legal, copyright */}
      <div className="border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500">
            {/* Topics */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {topics.map((cat, i) => (
                <React.Fragment key={cat}>
                  <button
                    onClick={() => onNavigateCategory(cat)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {cat}
                  </button>
                  {i < topics.length - 1 && (
                    <span className="text-stone-700">·</span>
                  )}
                </React.Fragment>
              ))}
              {onNavigateBlog && (
                <>
                  <span className="text-stone-700">·</span>
                  <button
                    onClick={onNavigateBlog}
                    className="text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    Blog
                  </button>
                </>
              )}
            </div>

            {/* Legal */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {legalLinks.map((link, idx) => (
                <React.Fragment key={link.id}>
                  <button
                    onClick={() => onNavigatePage(link.id)}
                    className="hover:text-amber-400 transition-colors"
                  >
                    {link.label}
                  </button>
                  {idx < legalLinks.length - 1 && (
                    <span className="text-stone-700">·</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-2 pt-2 border-t border-stone-800/50 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-stone-600">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3 h-3 text-amber-600" />
              <span>Medically Reviewed · Accra Bureau</span>
            </div>
            <div>
              © {new Date().getFullYear()} Critical Eye Blog. Accra, Republic of Ghana.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
