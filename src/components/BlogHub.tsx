import React, { useState } from 'react';
import { Article, BlogPitch } from '../types';
import {
  PenTool,
  Bookmark,
  Share2,
  Clock,
  Sparkles,
  HeartPulse,
  Send,
  X,
  CheckCircle2,
  Filter,
  MessageSquare,
  ShieldCheck,
  Stethoscope,
  BookOpen,
} from 'lucide-react';

interface BlogHubProps {
  articles: Article[];
  onSelectArticle: (article: Article) => void;
  bookmarks: string[];
  onToggleBookmark: (id: string) => void;
  onNavigateHome: () => void;
}

export const BlogHub: React.FC<BlogHubProps> = ({
  articles,
  onSelectArticle,
  bookmarks,
  onToggleBookmark,
  onNavigateHome,
}) => {
  const [selectedSeries, setSelectedSeries] = useState<string>('All');
  const [showPitchModal, setShowPitchModal] = useState<boolean>(false);
  const [pitchSuccess, setPitchSuccess] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form state
  const [pitchForm, setPitchForm] = useState({
    name: '',
    profession: '',
    institution: '',
    email: '',
    topic: '',
    summary: '',
  });

  // Filter blog posts
  const blogPosts = articles.filter(
    (a) => a.isBlogPost || a.articleType === 'Opinion' || a.blogSeries
  );

  const seriesOptions = [
    'All',
    'Clinician Perspective',
    'Field Dispatches',
    "Doctor's Notebook",
    'Health Policy Column',
    'Research Reflection',
  ];

  const filteredPosts =
    selectedSeries === 'All'
      ? blogPosts
      : blogPosts.filter((a) => a.blogSeries === selectedSeries);

  const featuredPost = filteredPosts[0] || blogPosts[0];
  const remainingPosts = filteredPosts.slice(1);

  const handleShare = (post: Article, e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.deck,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(`${window.location.origin}#${post.slug}`);
      setCopiedId(post.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handlePitchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pitchForm.name || !pitchForm.email || !pitchForm.summary) return;

    const newPitch: BlogPitch = {
      id: `pitch-${Date.now()}`,
      name: pitchForm.name,
      profession: pitchForm.profession,
      institution: pitchForm.institution,
      email: pitchForm.email,
      topic: pitchForm.topic,
      summary: pitchForm.summary,
      submittedAt: new Date().toISOString(),
    };

    try {
      const stored = localStorage.getItem('critical_eye_blog_pitches_v1');
      const pitches: BlogPitch[] = stored ? JSON.parse(stored) : [];
      pitches.push(newPitch);
      localStorage.setItem('critical_eye_blog_pitches_v1', JSON.stringify(pitches));
    } catch (err) {
      console.error('Failed to store pitch', err);
    }

    setPitchSuccess(true);
    setTimeout(() => {
      setPitchSuccess(false);
      setShowPitchModal(false);
      setPitchForm({
        name: '',
        profession: '',
        institution: '',
        email: '',
        topic: '',
        summary: '',
      });
    }, 2500);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* 1. Blog Header Masthead */}
      <div className="border-b border-stone-200 dark:border-stone-800 pb-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-bold">
              <Stethoscope className="w-4 h-4 text-amber-800 dark:text-amber-500" />
              <span>Critical Eye Healthcare Blog</span>
              <span className="text-stone-300 dark:text-stone-700">·</span>
              <span>Frontline Dispatches & Commentary</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-950 dark:text-stone-50 mt-2 tracking-tight">
              Clinical Perspectives & Field Notes
            </h1>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
              Unvarnished reflections, frontline clinical experiences, and evidence-based health commentary
              authored by Ghanaian physicians, rural midwives, pharmacists, and global health researchers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => setShowPitchModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-900 hover:bg-amber-950 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded text-xs font-semibold tracking-wide shadow-xs transition-colors"
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>Submit a Clinician Dispatch</span>
            </button>
            <button
              onClick={onNavigateHome}
              className="px-3.5 py-2 border border-stone-300 dark:border-stone-700 hover:bg-stone-100 dark:hover:bg-stone-900 text-stone-700 dark:text-stone-300 rounded text-xs font-medium transition-colors"
            >
              Main Newsroom
            </button>
          </div>
        </div>

        {/* Series Filter Strip */}
        <div className="flex items-center gap-2 mt-6 overflow-x-auto pb-2 scrollbar-none text-xs">
          <span className="flex items-center gap-1.5 text-stone-500 dark:text-stone-400 font-mono uppercase text-[11px] font-semibold shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Series:</span>
          </span>
          {seriesOptions.map((series) => (
            <button
              key={series}
              onClick={() => setSelectedSeries(series)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
                selectedSeries === series
                  ? 'bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-950 font-semibold shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800'
              }`}
            >
              {series}
            </button>
          ))}
        </div>
      </div>

      {/* 2. Featured Lead Blog Post */}
      {featuredPost && (
        <div className="mb-12 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden shadow-xs hover:border-amber-800/40 dark:hover:border-amber-500/40 transition-colors">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Visual Side */}
            <div
              onClick={() => onSelectArticle(featuredPost)}
              className="lg:col-span-7 cursor-pointer group relative overflow-hidden aspect-16/10 lg:aspect-auto"
            >
              <img
                src={featuredPost.imageUrl}
                alt={featuredPost.title}
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute top-3 left-3 bg-stone-950/85 backdrop-blur-xs text-amber-400 text-[10px] font-mono uppercase tracking-widest px-2.5 py-1 rounded font-bold">
                {featuredPost.blogSeries || 'Featured Healthcare Dispatch'}
              </div>
            </div>

            {/* Content Side */}
            <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Meta zero-pill strip */}
                <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mb-2">
                  <span className="font-semibold text-amber-900 dark:text-amber-400 uppercase tracking-wider text-[11px]">
                    {featuredPost.category}
                  </span>
                  <span className="text-stone-300 dark:text-stone-700">·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{featuredPost.readTime}</span>
                  </span>
                </div>

                <h2
                  onClick={() => onSelectArticle(featuredPost)}
                  className="text-2xl sm:text-3xl font-serif font-black text-stone-950 dark:text-stone-50 hover:text-amber-900 dark:hover:text-amber-400 cursor-pointer transition-colors leading-tight tracking-tight"
                >
                  {featuredPost.title}
                </h2>

                <p className="text-stone-600 dark:text-stone-300 text-sm mt-3 leading-relaxed">
                  {featuredPost.deck}
                </p>

                {/* Key takeaway highlight */}
                {featuredPost.keyTakeaways && featuredPost.keyTakeaways.length > 0 && (
                  <div className="mt-4 p-3 bg-stone-50 dark:bg-stone-800/60 border-l-2 border-amber-800 dark:border-amber-500 rounded-r text-xs text-stone-700 dark:text-stone-300 italic">
                    <span className="font-semibold text-stone-900 dark:text-stone-100 not-italic block mb-0.5 text-[11px] uppercase tracking-wider">
                      Author's Core Thesis:
                    </span>
                    "{featuredPost.keyTakeaways[0]}"
                  </div>
                )}
              </div>

              {/* Author Footer & Utility */}
              <div className="pt-6 border-t border-stone-200 dark:border-stone-800 mt-6 flex items-center justify-between">
                <div>
                  <div className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {featuredPost.author.name}
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    {featuredPost.author.role}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleBookmark(featuredPost.id);
                    }}
                    className="p-2 text-stone-500 hover:text-amber-900 dark:hover:text-amber-400 rounded transition-colors"
                    title={bookmarks.includes(featuredPost.id) ? 'Remove saved' : 'Save for reading'}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        bookmarks.includes(featuredPost.id)
                          ? 'fill-amber-800 text-amber-800 dark:fill-amber-500 dark:text-amber-500'
                          : ''
                      }`}
                    />
                  </button>
                  <button
                    onClick={(e) => handleShare(featuredPost, e)}
                    className="p-2 text-stone-500 hover:text-amber-900 dark:hover:text-amber-400 rounded transition-colors"
                    title="Share dispatch"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Voices from the Frontline: Quotation Broadside */}
      <div className="mb-12 bg-stone-100 dark:bg-stone-900/90 border border-stone-300/80 dark:border-stone-800 rounded-lg p-6 sm:p-8">
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-bold mb-4">
          <Sparkles className="w-4 h-4" />
          <span>Voices from the Wards & Clinic Verandas</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border-l-2 border-amber-800 dark:border-amber-500 pl-4 py-1">
            <p className="text-sm font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
              "A young doctor does not leave Ghana because they do not love their people; they leave because watching patients die from preventable equipment failure breaks the soul."
            </p>
            <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 font-medium">
              — Dr. Akosua Ansah-Sarpong, <span className="text-[11px] text-stone-500">Medical Editor</span>
            </div>
          </div>

          <div className="border-l-2 border-amber-800 dark:border-amber-500 pl-4 py-1">
            <p className="text-sm font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
              "Out here in the plains, you are the obstetrician, the counselor, the pharmacist, and often the prayer warrior. You do not panic; you listen for the heartbeat."
            </p>
            <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 font-medium">
              — Comfort Tetteh, SRN, <span className="text-[11px] text-stone-500">Afram Plains CHPS</span>
            </div>
          </div>

          <div className="border-l-2 border-amber-800 dark:border-amber-500 pl-4 py-1">
            <p className="text-sm font-serif italic text-stone-800 dark:text-stone-200 leading-relaxed">
              "You cannot upload a patient to the cloud when the clinic has no running water for handwashing. First the physical fundamentals, then the digital algorithms."
            </p>
            <div className="mt-2 text-xs text-stone-600 dark:text-stone-400 font-medium">
              — Emmanuel Kwesi Appiah, <span className="text-[11px] text-stone-500">Tech Reporter</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Blog Posts Stream */}
      <div className="mb-12">
        <div className="flex items-center justify-between border-b border-stone-200 dark:border-stone-800 pb-3 mb-6">
          <h3 className="text-xl font-serif font-black text-stone-900 dark:text-stone-100">
            {selectedSeries === 'All' ? 'All Frontline Dispatches' : `${selectedSeries} Archive`}
          </h3>
          <span className="text-xs font-mono text-stone-500 dark:text-stone-400">
            {remainingPosts.length} commentary pieces
          </span>
        </div>

        {remainingPosts.length === 0 ? (
          <div className="py-12 text-center text-stone-500 dark:text-stone-400 bg-white dark:bg-stone-900 rounded border border-stone-200 dark:border-stone-800">
            <p className="text-sm font-serif font-semibold text-stone-700 dark:text-stone-300">
              No dispatches currently listed under {selectedSeries}.
            </p>
            <button
              onClick={() => setSelectedSeries('All')}
              className="mt-2 text-xs text-amber-900 dark:text-amber-400 underline font-medium"
            >
              View all dispatches
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <article
                key={post.id}
                onClick={() => onSelectArticle(post)}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg overflow-hidden flex flex-col justify-between cursor-pointer group hover:border-amber-800/40 dark:hover:border-amber-500/40 shadow-2xs transition-all"
              >
                <div>
                  <div className="relative aspect-16/10 overflow-hidden bg-stone-100 dark:bg-stone-800">
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    />
                    <div className="absolute top-2 left-2 bg-stone-950/80 backdrop-blur-xs text-amber-400 text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded font-bold">
                      {post.blogSeries || post.articleType}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 dark:text-stone-400 mb-2 font-medium">
                      <span className="text-amber-900 dark:text-amber-400 font-semibold uppercase tracking-wider">
                        {post.category}
                      </span>
                      <span className="text-stone-300 dark:text-stone-700">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{post.readTime}</span>
                      </span>
                    </div>

                    <h4 className="text-lg font-serif font-bold text-stone-950 dark:text-stone-50 group-hover:text-amber-900 dark:group-hover:text-amber-400 transition-colors leading-snug">
                      {post.title}
                    </h4>

                    <p className="text-stone-600 dark:text-stone-300 text-xs mt-2 line-clamp-3 leading-relaxed">
                      {post.deck}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 border-t border-stone-100 dark:border-stone-800/80 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-stone-800 dark:text-stone-200 text-xs">
                      {post.author.name}
                    </div>
                    <div className="text-[10px] text-stone-500 dark:text-stone-400">
                      {post.author.role.split('&')[0]}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleBookmark(post.id);
                      }}
                      className="p-1.5 text-stone-400 hover:text-amber-900 dark:hover:text-amber-400 rounded transition-colors"
                      title={bookmarks.includes(post.id) ? 'Saved' : 'Save'}
                    >
                      <Bookmark
                        className={`w-3.5 h-3.5 ${
                          bookmarks.includes(post.id)
                            ? 'fill-amber-800 text-amber-800 dark:fill-amber-500 dark:text-amber-500'
                            : ''
                        }`}
                      />
                    </button>
                    <button
                      onClick={(e) => handleShare(post, e)}
                      className="p-1.5 text-stone-400 hover:text-amber-900 dark:hover:text-amber-400 rounded transition-colors"
                      title="Share"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* 5. Editorial Invitation Card for Medical Professionals */}
      <div className="bg-amber-900 dark:bg-stone-900 text-white rounded-lg p-6 sm:p-8 border border-amber-950 dark:border-stone-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-300 dark:text-amber-400 font-bold">
            <ShieldCheck className="w-4 h-4" />
            <span>Practitioner Submissions</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-black tracking-tight">
            Are You a Doctor, Nurse, Pharmacist, or Health Researcher in Ghana?
          </h3>
          <p className="text-stone-200 dark:text-stone-400 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Critical Eye accepts frontline essays, clinical case reflections, and policy critique.
            We uphold strict peer-reviewed editorial standards and protect author confidentiality where required.
          </p>
        </div>

        <button
          onClick={() => setShowPitchModal(true)}
          className="shrink-0 px-5 py-2.5 bg-white text-stone-900 hover:bg-stone-100 font-semibold text-xs tracking-wide rounded shadow-sm transition-colors flex items-center gap-2"
        >
          <PenTool className="w-3.5 h-3.5 text-amber-900" />
          <span>Pitch a Guest Column</span>
        </button>
      </div>

      {/* 6. Pitch Submission Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/70 backdrop-blur-xs">
          <div className="bg-white dark:bg-stone-900 rounded-lg max-w-lg w-full p-6 border border-stone-300 dark:border-stone-800 shadow-xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setShowPitchModal(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 p-1 rounded"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {pitchSuccess ? (
              <div className="py-8 text-center space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-stone-100">
                  Dispatch Pitch Received
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 max-w-sm mx-auto">
                  Thank you for contributing your voice. Our medical editor will review your proposal
                  within 48 hours.
                </p>
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-900 dark:text-amber-400 font-bold mb-1">
                  <HeartPulse className="w-4 h-4" />
                  <span>Clinical Perspective Submission</span>
                </div>
                <h3 className="text-xl font-serif font-black text-stone-900 dark:text-stone-100">
                  Pitch to Critical Eye Healthcare Blog
                </h3>
                <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 mb-4">
                  Please share your background, proposed topic, and central clinical thesis.
                </p>

                <form onSubmit={handlePitchSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={pitchForm.name}
                      onChange={(e) => setPitchForm({ ...pitchForm, name: e.target.value })}
                      placeholder="e.g. Dr. Kwadwo Mensah / Midwife Comfort"
                      className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Profession / Role *
                      </label>
                      <input
                        type="text"
                        required
                        value={pitchForm.profession}
                        onChange={(e) => setPitchForm({ ...pitchForm, profession: e.target.value })}
                        placeholder="e.g. Pediatrician, Midwife, Pharmacist"
                        className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                        Institution / Clinic
                      </label>
                      <input
                        type="text"
                        value={pitchForm.institution}
                        onChange={(e) => setPitchForm({ ...pitchForm, institution: e.target.value })}
                        placeholder="e.g. Korle Bu / GHS Afram Plains"
                        className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={pitchForm.email}
                      onChange={(e) => setPitchForm({ ...pitchForm, email: e.target.value })}
                      placeholder="e.g. doctor@hospital.gov.gh"
                      className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Proposed Column Title / Topic *
                    </label>
                    <input
                      type="text"
                      required
                      value={pitchForm.topic}
                      onChange={(e) => setPitchForm({ ...pitchForm, topic: e.target.value })}
                      placeholder="e.g. Why Rural Antenatal Clinics Need Instant Blood Crossmatching"
                      className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 dark:text-stone-300 mb-1">
                      Brief Outline or Thesis (200 words) *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={pitchForm.summary}
                      onChange={(e) => setPitchForm({ ...pitchForm, summary: e.target.value })}
                      placeholder="Summarize the core clinical experience, evidence base, and policy recommendation..."
                      className="w-full px-3 py-2 rounded border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:border-amber-800 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowPitchModal(false)}
                      className="px-3 py-2 rounded border border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 rounded bg-amber-900 hover:bg-amber-950 dark:bg-amber-600 dark:hover:bg-amber-500 text-white font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Submit Pitch</span>
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
