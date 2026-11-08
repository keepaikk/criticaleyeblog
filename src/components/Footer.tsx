import React from 'react';
import { ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigatePage: (pageId: string) => void;
  onNavigateCategory: (category: string) => void;
  onNavigateBlog?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigatePage,
  onNavigateCategory,
  onNavigateBlog,
}) => {
  const topics = [
    'Ghana Health',
    'Public Health',
    'Medical Research',
  ];

  const legalLinks = [
    { id: 'about', label: 'About Us' },
    { id: 'editorial-policy', label: 'Editorial Policy' },
    { id: 'contact', label: 'Contact & Tips' },
    { id: 'privacy', label: 'Privacy' },
  ];

  return (
    <footer className="bg-stone-900 text-stone-300 py-6 sm:py-8 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-5">
        {/* Compact Main Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-800/80">
          <div>
            <div className="flex flex-wrap items-baseline gap-2.5">
              <span className="font-serif font-black text-lg sm:text-xl text-white tracking-tight">
                CRITICAL EYE BLOG
              </span>
              <span className="text-amber-500 font-serif italic text-xs">
                Journalism with Perspective. Reporting with Purpose.
              </span>
            </div>
            <p className="text-stone-400 text-[11px] mt-0.5 max-w-xl">
              Independent Ghanaian & African healthcare journalism committed to truth, evidence-based reporting, and accountability.
            </p>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-stone-400 shrink-0">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
              <span>Medically Reviewed</span>
            </span>
            <span className="text-stone-700">·</span>
            <span>Accra Bureau</span>
          </div>
        </div>

        {/* Compact Topics & Links Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 text-[11px] text-stone-400">
          {/* Healthcare Topics */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-stone-500 font-semibold uppercase tracking-wider text-[10px]">
              Topics:
            </span>
            {topics.map((cat, i) => (
              <React.Fragment key={cat}>
                <button
                  onClick={() => onNavigateCategory(cat)}
                  className="hover:text-amber-400 transition-colors"
                >
                  {cat}
                </button>
                <span aria-hidden="true" className="text-stone-700">·</span>
              </React.Fragment>
            ))}
            {onNavigateBlog && (
              <button
                onClick={onNavigateBlog}
                className="text-amber-400 font-semibold hover:underline transition-all"
              >
                Healthcare Blog
              </button>
            )}
          </div>

          {/* Legal and Policies */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            {legalLinks.map((link, idx) => (
              <React.Fragment key={link.id}>
                <button
                  onClick={() => onNavigatePage(link.id)}
                  className="hover:text-amber-400 transition-colors"
                >
                  {link.label}
                </button>
                {idx < legalLinks.length - 1 && (
                  <span aria-hidden="true" className="text-stone-700">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Bottom Utility & Copyright */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-stone-500">
          <div>
            © {new Date().getFullYear()} Critical Eye Blog. All rights reserved. Accra, Republic of Ghana.
          </div>
        </div>
      </div>
    </footer>
  );
};
