import React, { useState, useEffect } from 'react';
import { Article } from '../types';
import { formatNewsDate } from '../utils/formatters';
import {
  ArrowLeft,
  Share2,
  Bookmark,
  Volume2,
  VolumeX,
  Printer,
  Copy,
  Check,
  ShieldCheck,
  AlertCircle,
  FileText,
  MessageCircle,
  Stethoscope,
  HeartHandshake,
} from 'lucide-react';

interface ArticleDetailProps {
  article: Article;
  allArticles: Article[];
  onBack: () => void;
  onSelectArticle: (article: Article) => void;
  isBookmarked: boolean;
  onToggleBookmark: (articleId: string) => void;
}

export const ArticleDetail: React.FC<ArticleDetailProps> = ({
  article,
  allArticles,
  onBack,
  onSelectArticle,
  isBookmarked,
  onToggleBookmark,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [copied, setCopied] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechRate, setSpeechRate] = useState<number>(1);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Track reading scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scrollPercent = (totalScroll / windowHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, scrollPercent)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Web Speech API text-to-speech reader
  const handleToggleAudio = () => {
    if (!('speechSynthesis' in window)) {
      alert('Audio narration is not supported in this browser.');
      return;
    }

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    } else {
      window.speechSynthesis.cancel();
      const textToRead = `${article.title}. ${article.deck}. Reported by ${article.author.name}. ${article.content.join(' ')}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.rate = speechRate;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
      setIsPlayingAudio(true);
    }
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [article.id]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareWhatsApp = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const shareText = encodeURIComponent(`${article.title} — Critical Eye\n\n`);
    window.open(`https://api.whatsapp.com/send?text=${shareText}${shareUrl}`, '_blank');
  };

  const handleShareTwitter = () => {
    const shareUrl = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`${article.title} via @CriticalEye`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${shareUrl}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  // Related articles (same category or others)
  const relatedArticles = allArticles
    .filter((a) => a.id !== article.id && (a.category === article.category || a.featured))
    .slice(0, 3);

  const fontSizeClass =
    fontSize === 'large'
      ? 'text-lg leading-relaxed'
      : fontSize === 'xlarge'
      ? 'text-xl leading-loose'
      : 'text-base leading-relaxed';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 transition-colors">
      {/* Reading Progress Top Bar */}
      <div
        className="fixed top-0 left-0 h-1 bg-amber-800 dark:bg-amber-500 z-50 transition-all duration-150"
        style={{ width: `${scrollProgress}%` }}
        aria-hidden="true"
      />

      {/* Top Breadcrumb & Action Ribbon */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-stone-200 dark:border-stone-800 mb-8 text-xs">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 font-semibold text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-stone-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to dispatches</span>
        </button>

        {/* Reading tools: Font size, Audio player, Bookmark */}
        <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300">
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 rounded p-0.5 border border-stone-200 dark:border-stone-700">
            <button
              onClick={() => setFontSize('normal')}
              className={`px-2 py-1 rounded text-xs font-semibold ${
                fontSize === 'normal'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
              title="Standard text size"
            >
              A
            </button>
            <button
              onClick={() => setFontSize('large')}
              className={`px-2 py-1 rounded text-sm font-semibold ${
                fontSize === 'large'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
              title="Larger text size"
            >
              A+
            </button>
            <button
              onClick={() => setFontSize('xlarge')}
              className={`px-2 py-1 rounded text-base font-semibold ${
                fontSize === 'xlarge'
                  ? 'bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 shadow-sm'
                  : 'text-stone-500 dark:text-stone-400'
              }`}
              title="Maximum text size"
            >
              A++
            </button>
          </div>

          <button
            onClick={handleToggleAudio}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              isPlayingAudio
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
            title="Listen to this report"
          >
            {isPlayingAudio ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>Stop Audio</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                <span>Listen to Story</span>
              </>
            )}
          </button>

          <button
            onClick={() => onToggleBookmark(article.id)}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border transition-colors ${
              isBookmarked
                ? 'bg-amber-100 dark:bg-amber-950 text-amber-900 dark:text-amber-300 border-amber-300 dark:border-amber-700 font-semibold'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-amber-800 dark:fill-amber-400 text-amber-800 dark:text-amber-400' : ''}`} />
            <span>{isBookmarked ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* Category and Metadata Kicker (Clean unboxed typography) */}
      <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-stone-500 dark:text-stone-400 mb-3 uppercase tracking-wider">
        {article.isBlogPost && (
          <span className="inline-flex items-center gap-1 text-amber-900 dark:text-amber-400 font-bold bg-amber-100/70 dark:bg-amber-950/80 px-2 py-0.5 rounded text-[11px] normal-case">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Healthcare Blog: {article.blogSeries || 'Clinician Dispatch'}</span>
          </span>
        )}
        <span className="text-amber-900 dark:text-amber-400 font-bold">{article.category}</span>
        <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">/</span>
        <span>{article.articleType}</span>
        <span aria-hidden="true" className="text-stone-300 dark:text-stone-700">/</span>
        <span className="font-normal normal-case">{article.readTime}</span>
      </div>

      {/* Main Headline */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-950 dark:text-stone-50 tracking-tight leading-tight text-balance mb-4">
        {article.title}
      </h1>

      {/* Introduction Deck */}
      <p className="text-lg sm:text-xl text-stone-600 dark:text-stone-300 font-normal leading-relaxed mb-6 font-serif italic text-balance">
        {article.deck}
      </p>

      {/* Byline, Publication Date, Medical Review Notice */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-stone-200 dark:border-stone-800 mb-8 text-xs text-stone-600 dark:text-stone-400">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-stone-300 dark:bg-stone-800 flex items-center justify-center font-serif font-bold text-stone-800 dark:text-stone-200 text-sm shrink-0">
            {article.author.name.split(' ').map((n) => n[0]).join('')}
          </div>
          <div>
            <div className="font-bold text-stone-900 dark:text-stone-100 text-sm">{article.author.name}</div>
            <div className="text-stone-500 dark:text-stone-400">{article.author.role}</div>
          </div>
        </div>

        <div className="text-right">
          <div className="text-stone-700 dark:text-stone-300 font-medium">Published: {formatNewsDate(article.publishedAt)}</div>
          {article.medicalReviewer && (
            <div className="flex items-center justify-end gap-1 text-emerald-800 dark:text-emerald-400 font-medium mt-0.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Medical Review: {article.medicalReviewer}</span>
            </div>
          )}
        </div>
      </div>

      {/* Featured Photojournalism Visual */}
      <figure className="mb-8">
        <div className="relative aspect-16/9 overflow-hidden rounded-sm bg-stone-200 dark:bg-stone-800">
          <img
            src={article.imageUrl}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        {(article.imageCaption || article.imageCredit) && (
          <figcaption className="mt-2 text-xs text-stone-500 dark:text-stone-400 font-serif italic flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span>{article.imageCaption}</span>
            {article.imageCredit && (
              <span className="not-italic text-stone-400 dark:text-stone-500 font-sans font-medium shrink-0">
                Photo: {article.imageCredit}
              </span>
            )}
          </figcaption>
        )}
      </figure>

      {/* Audio Playback Status Notice */}
      {isPlayingAudio && (
        <div className="mb-6 p-3 bg-amber-50 dark:bg-amber-950/60 border border-amber-200/80 dark:border-amber-800 rounded flex items-center justify-between text-xs text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-amber-800 dark:text-amber-400 animate-pulse" />
            <span>Voice narration active: reading article text</span>
          </div>
          <button
            onClick={() => {
              if ('speechSynthesis' in window) {
                window.speechSynthesis.cancel();
                setIsPlayingAudio(false);
              }
            }}
            className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-100"
          >
            Mute Narration
          </button>
        </div>
      )}

      {/* Key Takeaways Box */}
      {article.keyTakeaways && article.keyTakeaways.length > 0 && (
        <div className="mb-8 p-5 bg-stone-100/60 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 rounded-sm">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-amber-800 dark:bg-amber-400 rounded-full" />
            <span>Essential Executive Findings</span>
          </h2>
          <ul className="space-y-2 text-sm text-stone-700 dark:text-stone-300">
            {article.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-amber-900 dark:text-amber-400 font-bold shrink-0 mt-0.5">·</span>
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Article Body Content */}
      <div className={`prose-editorial ${fontSizeClass} text-stone-800 dark:text-stone-200`}>
        {article.content.map((paragraph, index) => {
          const isFirst = index === 0;
          return (
            <React.Fragment key={index}>
              <p className={isFirst ? 'editorial-dropcap font-sans' : 'font-sans'}>
                {paragraph}
              </p>

              {/* Insert Pull Quote after second paragraph if available */}
              {index === 1 && article.pullQuote && (
                <div className="my-8 py-6 border-y border-stone-200 dark:border-stone-800 text-center px-4">
                  <blockquote className="text-xl sm:text-2xl font-serif italic text-stone-900 dark:text-stone-100 leading-snug">
                    “{article.pullQuote.text}”
                  </blockquote>
                  <cite className="block mt-3 text-xs font-sans not-italic font-semibold text-stone-500 dark:text-stone-400 uppercase tracking-wider">
                    — {article.pullQuote.attribution}
                  </cite>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Verified Sources & Attributions */}
      {article.sources && article.sources.length > 0 && (
        <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-3 flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-stone-500 dark:text-stone-400" />
            <span>Verified Sources & Document Attributions</span>
          </h3>
          <ul className="space-y-1.5 text-xs text-stone-600 dark:text-stone-400 font-mono">
            {article.sources.map((src, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-900 dark:text-amber-400 font-bold">[{i + 1}]</span>
                <span>{src}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Transparency & Corrections Record Ledger */}
      {article.corrections && article.corrections.length > 0 && (
        <div className="mt-8 p-4 bg-amber-50/70 dark:bg-amber-950/50 border border-amber-200/80 dark:border-amber-900/60 rounded-sm">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-900 dark:text-amber-400 mb-2 uppercase tracking-wider">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>Editorial Correction & Update Record</span>
          </div>
          {article.corrections.map((corr) => (
            <div key={corr.id} className="text-xs text-amber-950/80 dark:text-amber-200/80 space-y-1">
              <div className="font-semibold">{formatNewsDate(corr.date)} — {corr.editor}:</div>
              <p className="leading-relaxed font-sans">{corr.note}</p>
            </div>
          ))}
        </div>
      )}

      {/* Mandatory Critical Eye Medical Disclaimer */}
      <div className="mt-8 p-4 bg-stone-100 dark:bg-stone-900/80 border border-stone-200/80 dark:border-stone-800 rounded-sm text-xs text-stone-600 dark:text-stone-400">
        <div className="font-bold text-stone-900 dark:text-stone-100 mb-1 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-amber-800 dark:text-amber-400" />
          <span>Critical Eye Medical Journalism Notice</span>
        </div>
        <p className="leading-relaxed text-stone-600 dark:text-stone-400">
          This article is published strictly for informational, educational, and public accountability reporting purposes. It does not provide clinical diagnoses, individualized treatment recommendations, or medical advice. Readers experiencing health symptoms should seek care from a licensed healthcare provider or authorized medical clinic.
        </p>
      </div>

      {/* Social Sharing & Action Bar */}
      <div className="mt-10 pt-6 border-t border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-stone-700 dark:text-stone-300 mr-2">Share this report:</span>
          <button
            onClick={handleShareWhatsApp}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </button>
          <button
            onClick={handleShareTwitter}
            className="px-3 py-1.5 bg-stone-900 dark:bg-stone-800 hover:bg-stone-800 dark:hover:bg-stone-700 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>X (Twitter)</span>
          </button>
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Link Copied!' : 'Copy Link'}</span>
          </button>
        </div>

        <button
          onClick={handlePrint}
          className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-medium flex items-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Related Articles Section */}
      {relatedArticles.length > 0 && (
        <section className="mt-14 pt-8 border-t border-stone-300 dark:border-stone-800">
          <h2 className="text-lg font-serif font-bold text-stone-900 dark:text-stone-100 mb-6">
            Related Healthcare Coverage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedArticles.map((rel) => (
              <div
                key={rel.id}
                onClick={() => onSelectArticle(rel)}
                className="group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-16/10 overflow-hidden rounded-sm bg-stone-200 dark:bg-stone-800 mb-2">
                    <img
                      src={rel.imageUrl}
                      alt={rel.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-[11px] font-semibold text-amber-900 dark:text-amber-400 mb-1">
                    {rel.category}
                  </div>
                  <h3 className="font-serif font-bold text-sm text-stone-900 dark:text-stone-100 group-hover:text-amber-900 dark:group-hover:text-amber-400 leading-snug line-clamp-2">
                    {rel.title}
                  </h3>
                </div>
                <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
                  {formatNewsDate(rel.publishedAt)} · {rel.readTime}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </article>
  );
};
