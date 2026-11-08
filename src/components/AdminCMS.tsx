import React, { useState } from 'react';
import { Article, ArticleStatus, ArticleType, Category, Author, CorrectionRecord, BrandSettings } from '../types';
import { CATEGORIES } from '../data/newsData';
import { generateRssFeed, generateSitemapXml, formatNewsDate } from '../utils/formatters';
import { DEFAULT_BRAND_SETTINGS } from '../utils/storage';
import {
  LayoutDashboard,
  FileEdit,
  PlusCircle,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Users,
  Image as ImageIcon,
  Rss,
  Star,
  Trash2,
  Save,
  ArrowLeft,
  X,
  FileText,
  Sparkles,
  Shield,
  Layers,
  Palette,
  Upload,
} from 'lucide-react';

interface AdminCMSProps {
  articles: Article[];
  authors: Author[];
  brandSettings: BrandSettings;
  onSaveBrandSettings: (settings: BrandSettings) => void;
  onSaveArticle: (article: Article) => void;
  onDeleteArticle: (id: string) => void;
  onUpdateArticles: (articles: Article[]) => void;
  onSaveAuthor: (author: Author) => void;
  onExitAdmin: () => void;
  onPreviewArticle: (article: Article) => void;
}

export const AdminCMS: React.FC<AdminCMSProps> = ({
  articles,
  authors,
  brandSettings,
  onSaveBrandSettings,
  onSaveArticle,
  onDeleteArticle,
  onUpdateArticles,
  onSaveAuthor,
  onExitAdmin,
  onPreviewArticle,
}) => {
  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'articles' | 'editor' | 'homepage' | 'brand' | 'media' | 'seo' | 'authors'
  >('dashboard');

  // Brand form local state
  const [brandForm, setBrandForm] = useState<BrandSettings>(brandSettings);
  const [brandSavedToast, setBrandSavedToast] = useState(false);

  // Currently editing article (null means creating new)
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Filter state in article table
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Correction record modal state
  const [correctionModalArticle, setCorrectionModalArticle] = useState<Article | null>(null);
  const [newCorrectionNote, setNewCorrectionNote] = useState('');
  const [newCorrectionEditor, setNewCorrectionEditor] = useState('Editorial Board');

  // New Author modal
  const [isAddingAuthor, setIsAddingAuthor] = useState(false);
  const [newAuthor, setNewAuthor] = useState<Omit<Author, 'id' | 'articlesCount'>>({
    name: '',
    role: '',
    bio: '',
    email: '',
  });

  // Media Library presets
  const mediaLibrary = [
    {
      url: '/src/assets/images/featured_ghana_hospital_1793829875799.jpg',
      title: 'Accra Teaching Hospital Surgical & Renal Ward',
      category: 'Hospitals & Healthcare',
    },
    {
      url: '/src/assets/images/public_health_malaria_lab_1793829876940.jpg',
      title: 'Noguchi Memorial Institute Antigen Laboratory',
      category: 'Medical Research',
    },
    {
      url: '/src/assets/images/rural_drone_delivery_health_1793829876949.jpg',
      title: 'Zipline Drone Emergency Antivenom Delivery Clinic',
      category: 'Health Technology',
    },
    {
      url: '/src/assets/images/maternal_health_clinic_1793829877957.jpg',
      title: 'Rural Maternal and Newborn CHPS Healthcare Clinic',
      category: 'Maternal & Child Health',
    },
    {
      url: '/src/assets/images/doctor_clinical_journal_1794072083085.jpg',
      title: 'Ghanaian Physician Writing Clinical Journal & Case Notes',
      category: 'Clinician Perspectives & Healthcare Blog',
    },
    {
      url: '/src/assets/images/midwife_field_notes_1794072095489.jpg',
      title: 'Community Nurse-Midwife Holding CHPS Compound Clinic Records',
      category: 'Field Dispatches & Maternal Health',
    },
  ];

  // Helper to start creating a new article
  const handleStartCreate = () => {
    const blank: Article = {
      id: `art-${Date.now()}`,
      slug: `new-health-story-${Date.now().toString().slice(-4)}`,
      title: '',
      deck: '',
      category: 'Ghana Health',
      articleType: 'News',
      status: 'Draft',
      featured: false,
      author: {
        name: authors[0]?.name || 'Editorial Desk',
        role: authors[0]?.role || 'Staff Reporter',
      },
      publishedAt: new Date().toISOString(),
      readTime: '4 min read',
      imageUrl: mediaLibrary[0].url,
      imageCaption: '',
      imageCredit: 'Critical Eye',
      content: ['Enter the introductory paragraph of the healthcare story here...'],
      keyTakeaways: ['Key takeaway finding 1'],
      sources: ['Ministry of Health Ghana Bulletin'],
    };
    setEditingArticle(blank);
    setActiveTab('editor');
  };

  const handleEditClick = (art: Article) => {
    setEditingArticle({ ...art });
    setActiveTab('editor');
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingArticle) return;
    if (!editingArticle.title.trim()) {
      alert('Please provide an article headline.');
      return;
    }
    // Generate clean slug if not set
    const slug =
      editingArticle.slug ||
      editingArticle.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const updated = {
      ...editingArticle,
      slug,
      updatedAt: new Date().toISOString(),
    };

    onSaveArticle(updated);
    setActiveTab('articles');
  };

  // Status progression action
  const handleAdvanceStatus = (art: Article, nextStatus: ArticleStatus) => {
    const updated = {
      ...art,
      status: nextStatus,
      updatedAt: new Date().toISOString(),
    };
    onSaveArticle(updated);
  };

  // Pin as lead featured story
  const handleSetFeatured = (targetId: string) => {
    const updated = articles.map((a) => ({
      ...a,
      featured: a.id === targetId,
    }));
    onUpdateArticles(updated);
  };

  // Add correction to article
  const handleAddCorrection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!correctionModalArticle || !newCorrectionNote.trim()) return;

    const newRecord: CorrectionRecord = {
      id: `corr-${Date.now()}`,
      date: new Date().toISOString(),
      note: newCorrectionNote.trim(),
      editor: newCorrectionEditor.trim() || 'Managing Editor',
    };

    const currentCorrections = correctionModalArticle.corrections || [];
    const updatedArticle = {
      ...correctionModalArticle,
      corrections: [newRecord, ...currentCorrections],
      updatedAt: new Date().toISOString(),
    };

    onSaveArticle(updatedArticle);
    setCorrectionModalArticle(null);
    setNewCorrectionNote('');
  };

  // Quick stats
  const publishedCount = articles.filter((a) => a.status === 'Published').length;
  const inReviewCount = articles.filter((a) => a.status === 'Review').length;
  const approvedCount = articles.filter((a) => a.status === 'Approved').length;
  const draftCount = articles.filter((a) => a.status === 'Draft').length;

  return (
    <div className="min-h-screen bg-stone-100 dark:bg-stone-950 pb-16 transition-colors">
      {/* Top Editorial Control Bar */}
      <div className="bg-stone-900 text-stone-100 px-4 sm:px-6 py-3.5 border-b border-stone-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 px-3 py-1.5 rounded transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Return to Public Reader Mode</span>
            </button>
            <span className="text-stone-500">|</span>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-amber-500 text-sm">Critical Eye</span>
              <span className="text-xs text-stone-400 font-mono">Editorial CMS v2.4</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleStartCreate}
              className="inline-flex items-center gap-1.5 bg-amber-700 hover:bg-amber-600 text-white text-xs font-semibold px-3 py-1.5 rounded transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Compose Story</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main CMS Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b border-stone-300 mb-6 text-xs font-semibold text-stone-700">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t transition-colors ${
              activeTab === 'dashboard'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-sm'
                : 'hover:bg-stone-200'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Editorial Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('articles')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t transition-colors ${
              activeTab === 'articles'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-sm'
                : 'hover:bg-stone-200'
            }`}
          >
            <FileEdit className="w-4 h-4" />
            <span>Articles & Workflow ({articles.length})</span>
          </button>

          {editingArticle && (
            <button
              onClick={() => setActiveTab('editor')}
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t transition-colors ${
                activeTab === 'editor'
                  ? 'bg-white text-amber-900 border-t-2 border-amber-800 shadow-sm'
                  : 'hover:bg-stone-200'
              }`}
            >
              <FileText className="w-4 h-4 text-amber-800" />
              <span>Editing: {editingArticle.title ? editingArticle.title.slice(0, 24) + '...' : 'New Draft'}</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('homepage')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t transition-colors ${
              activeTab === 'homepage'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-sm'
                : 'hover:bg-stone-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Homepage Layout</span>
          </button>

          <button
            onClick={() => setActiveTab('brand')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t transition-colors ${
              activeTab === 'brand'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-sm'
                : 'hover:bg-stone-200'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>Logo & Brand Banner</span>
          </button>

          <button
            onClick={() => setActiveTab('authors')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t transition-colors ${
              activeTab === 'authors'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-sm'
                : 'hover:bg-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Authors & Roles</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t transition-colors ${
              activeTab === 'media'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-sm'
                : 'hover:bg-stone-200'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Media Assets</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-t transition-colors ${
              activeTab === 'seo'
                ? 'bg-white text-stone-900 border-t-2 border-amber-800 shadow-sm'
                : 'hover:bg-stone-200'
            }`}
          >
            <Rss className="w-4 h-4" />
            <span>SEO, RSS & Sitemap</span>
          </button>
        </div>

        {/* 1. DASHBOARD VIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Metric KPI cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded border border-stone-200">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Published Reports
                </div>
                <div className="text-3xl font-serif font-bold text-stone-900 mt-2 font-mono tabular-nums">
                  {publishedCount}
                </div>
                <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Live on website
                </div>
              </div>

              <div className="bg-white p-5 rounded border border-stone-200">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  In Editorial Review
                </div>
                <div className="text-3xl font-serif font-bold text-amber-900 mt-2 font-mono tabular-nums">
                  {inReviewCount}
                </div>
                <div className="text-[11px] text-amber-700 mt-1 flex items-center gap-1">
                  <Clock className="w-3 h-3" /> Awaiting fact-check
                </div>
              </div>

              <div className="bg-white p-5 rounded border border-stone-200">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Approved for Release
                </div>
                <div className="text-3xl font-serif font-bold text-blue-900 mt-2 font-mono tabular-nums">
                  {approvedCount}
                </div>
                <div className="text-[11px] text-blue-700 mt-1">Ready to publish</div>
              </div>

              <div className="bg-white p-5 rounded border border-stone-200">
                <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Working Drafts
                </div>
                <div className="text-3xl font-serif font-bold text-stone-600 mt-2 font-mono tabular-nums">
                  {draftCount}
                </div>
                <div className="text-[11px] text-stone-500 mt-1">In composition</div>
              </div>
            </div>

            {/* Editorial Workflow Explainer */}
            <div className="p-4 bg-white border border-stone-200 rounded">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-800" />
                <span>Editorial Pipeline Standards</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded">
                  <span className="font-bold text-stone-800 block mb-1">1. Draft</span>
                  <p className="text-stone-500">Reporters compile raw evidence, citations, and draft text.</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-200 rounded">
                  <span className="font-bold text-amber-900 block mb-1">2. Review</span>
                  <p className="text-amber-800">Fact-checkers and medical editor review primary sources.</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                  <span className="font-bold text-blue-900 block mb-1">3. Approved</span>
                  <p className="text-blue-800">Editor-in-Chief clears legal and medical disclaimers.</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded">
                  <span className="font-bold text-emerald-900 block mb-1">4. Published</span>
                  <p className="text-emerald-800">Live syndication via RSS, XML sitemap, and Google News.</p>
                </div>
              </div>
            </div>

            {/* Quick Actions & Recent Stories Table */}
            <div className="bg-white rounded border border-stone-200 overflow-hidden">
              <div className="p-4 border-b border-stone-200 flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-stone-900">
                  Recent Newsroom Dispatches
                </h3>
                <button
                  onClick={handleStartCreate}
                  className="text-xs font-semibold text-amber-900 hover:text-amber-950"
                >
                  + Add New Article
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4">Headline</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Featured</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {articles.slice(0, 5).map((art) => (
                      <tr key={art.id} className="hover:bg-stone-50/70">
                        <td className="py-3 px-4 max-w-xs font-medium text-stone-900">
                          <div className="line-clamp-1 font-serif text-sm">{art.title}</div>
                          <div className="text-[11px] text-stone-400 font-sans">
                            {formatNewsDate(art.publishedAt)} · {art.readTime}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-stone-600">{art.category}</td>
                        <td className="py-3 px-4 text-stone-600">{art.author.name}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              art.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : art.status === 'Approved'
                                ? 'bg-blue-100 text-blue-800'
                                : art.status === 'Review'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {art.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {art.featured ? (
                            <span className="text-amber-700 font-semibold flex items-center gap-1">
                              <Star className="w-3.5 h-3.5 fill-amber-600" />
                              <span>Lead</span>
                            </span>
                          ) : (
                            <span className="text-stone-400">—</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right space-x-2">
                          <button
                            onClick={() => onPreviewArticle(art)}
                            className="text-stone-600 hover:text-stone-900"
                            title="Preview article"
                          >
                            <Eye className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleEditClick(art)}
                            className="text-amber-800 hover:text-amber-950 font-semibold"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 2. ARTICLES & WORKFLOW VIEW */}
        {activeTab === 'articles' && (
          <div className="bg-white rounded border border-stone-200 p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Article Registry & Editorial Workflow
                </h2>
                <p className="text-xs text-stone-500">
                  Manage revisions, editorial peer-review, and publication states.
                </p>
              </div>

              <button
                onClick={handleStartCreate}
                className="bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold px-4 py-2 rounded inline-flex items-center gap-1.5 transition-colors"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create New Article</span>
              </button>
            </div>

            {/* Filter and search bar */}
            <div className="flex flex-wrap items-center gap-3">
              <input
                type="text"
                placeholder="Search headline or author..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="p-2 border border-stone-300 rounded text-xs flex-1 min-w-[200px]"
              />

              <div className="flex flex-wrap items-center gap-1 text-xs">
                <span className="text-stone-500">Workflow:</span>
                {['all', 'Draft', 'Review', 'Approved', 'Published', 'Blog Posts'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded text-xs font-medium ${
                      statusFilter === st
                        ? 'bg-amber-900 text-white'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-3">Headline</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3">Workflow Transition</th>
                    <th className="py-3 px-3">Corrections</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200">
                  {articles
                    .filter((a) => {
                      if (statusFilter === 'Blog Posts') {
                        if (!a.isBlogPost && a.articleType !== 'Opinion' && !a.blogSeries) return false;
                      } else if (statusFilter !== 'all' && a.status !== statusFilter) {
                        return false;
                      }
                      if (!searchFilter.trim()) return true;
                      const q = searchFilter.toLowerCase();
                      return (
                        a.title.toLowerCase().includes(q) ||
                        a.author.name.toLowerCase().includes(q) ||
                        a.category.toLowerCase().includes(q)
                      );
                    })
                    .map((art) => (
                      <tr key={art.id} className="hover:bg-stone-50">
                        <td className="py-3 px-3 max-w-sm">
                          <div className="font-serif font-bold text-sm text-stone-900 line-clamp-1">
                            {art.title}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            By {art.author.name} · {formatNewsDate(art.publishedAt)}
                          </div>
                        </td>
                        <td className="py-3 px-3 text-stone-600 whitespace-nowrap">
                          {art.category}
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                              art.status === 'Published'
                                ? 'bg-emerald-100 text-emerald-800'
                                : art.status === 'Approved'
                                ? 'bg-blue-100 text-blue-800'
                                : art.status === 'Review'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-stone-200 text-stone-700'
                            }`}
                          >
                            {art.status}
                          </span>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {art.status === 'Draft' && (
                              <button
                                onClick={() => handleAdvanceStatus(art, 'Review')}
                                className="px-2 py-0.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded text-[10px] font-medium"
                              >
                                Submit to Review →
                              </button>
                            )}
                            {art.status === 'Review' && (
                              <button
                                onClick={() => handleAdvanceStatus(art, 'Approved')}
                                className="px-2 py-0.5 bg-blue-100 hover:bg-blue-200 text-blue-900 rounded text-[10px] font-medium"
                              >
                                Approve →
                              </button>
                            )}
                            {art.status === 'Approved' && (
                              <button
                                onClick={() => handleAdvanceStatus(art, 'Published')}
                                className="px-2 py-0.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-900 rounded text-[10px] font-medium"
                              >
                                Publish Live →
                              </button>
                            )}
                            {art.status === 'Published' && (
                              <button
                                onClick={() => handleAdvanceStatus(art, 'Draft')}
                                className="px-2 py-0.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-[10px] font-medium"
                              >
                                Revert to Draft
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-3 whitespace-nowrap">
                          <button
                            onClick={() => setCorrectionModalArticle(art)}
                            className="text-[11px] text-amber-900 hover:underline font-medium"
                          >
                            {art.corrections?.length ? `${art.corrections.length} recorded` : '+ Add note'}
                          </button>
                        </td>
                        <td className="py-3 px-3 text-right whitespace-nowrap space-x-2">
                          <button
                            onClick={() => onPreviewArticle(art)}
                            className="p-1 text-stone-500 hover:text-stone-900"
                            title="Preview"
                          >
                            <Eye className="w-3.5 h-3.5 inline" />
                          </button>
                          <button
                            onClick={() => handleEditClick(art)}
                            className="p-1 text-amber-800 hover:text-amber-950 font-semibold"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${art.title}"?`)) {
                                onDeleteArticle(art.id);
                              }
                            }}
                            className="p-1 text-red-600 hover:text-red-800"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 3. FULL ARTICLE EDITOR VIEW */}
        {activeTab === 'editor' && editingArticle && (
          <form onSubmit={handleSaveEditor} className="bg-white rounded border border-stone-200 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-900 font-semibold">
                  Article Studio
                </span>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  {editingArticle.id.startsWith('art-') && editingArticle.title ? 'Edit Healthcare Article' : 'Compose New Dispatch'}
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onPreviewArticle(editingArticle)}
                  className="px-3 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Article</span>
                </button>
              </div>
            </div>

            {/* Title & Slug */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Headline / Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={editingArticle.title}
                  onChange={(e) => setEditingArticle({ ...editingArticle, title: e.target.value })}
                  placeholder="e.g. Ghana FDA Expands Quality Verification at Tema..."
                  className="w-full p-2.5 bg-white border border-stone-300 rounded text-base font-serif font-bold text-stone-900 focus:outline-none focus:border-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Introduction Deck / Summary Excerpt *
                </label>
                <textarea
                  rows={2}
                  required
                  value={editingArticle.deck}
                  onChange={(e) => setEditingArticle({ ...editingArticle, deck: e.target.value })}
                  placeholder="Concise 1-2 sentence lead explaining what happened and why it matters."
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs sm:text-sm text-stone-700 focus:outline-none focus:border-amber-800"
                />
              </div>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Healthcare Category
                </label>
                <select
                  value={editingArticle.category}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, category: e.target.value as Category })
                  }
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Editorial Type
                </label>
                <select
                  value={editingArticle.articleType}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, articleType: e.target.value as ArticleType })
                  }
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                >
                  <option value="News">News</option>
                  <option value="Analysis">Analysis</option>
                  <option value="Investigation">Investigation</option>
                  <option value="Feature">Feature</option>
                  <option value="Opinion">Opinion</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Workflow Status
                </label>
                <select
                  value={editingArticle.status}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, status: e.target.value as ArticleStatus })
                  }
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                >
                  <option value="Draft">Draft</option>
                  <option value="Review">Review</option>
                  <option value="Approved">Approved</option>
                  <option value="Published">Published</option>
                </select>
              </div>
            </div>

            {/* Author and Read time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Assigned Reporter / Author
                </label>
                <select
                  value={editingArticle.author.name}
                  onChange={(e) => {
                    const sel = authors.find((a) => a.name === e.target.value);
                    setEditingArticle({
                      ...editingArticle,
                      author: {
                        name: e.target.value,
                        role: sel?.role || 'Staff Reporter',
                      },
                    });
                  }}
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                >
                  {authors.map((auth) => (
                    <option key={auth.id} value={auth.name}>
                      {auth.name} ({auth.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Read Time Estimate
                </label>
                <input
                  type="text"
                  value={editingArticle.readTime}
                  onChange={(e) => setEditingArticle({ ...editingArticle, readTime: e.target.value })}
                  placeholder="e.g. 5 min read"
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Medical Reviewer
                </label>
                <input
                  type="text"
                  value={editingArticle.medicalReviewer || ''}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, medicalReviewer: e.target.value })
                  }
                  placeholder="e.g. Dr. Akosua Ansah-Sarpong, FWACP"
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* Featured Image Selection */}
            <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3">
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                Featured Photojournalism Asset
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {mediaLibrary.map((item) => (
                  <div
                    key={item.url}
                    onClick={() => setEditingArticle({ ...editingArticle, imageUrl: item.url })}
                    className={`cursor-pointer border-2 rounded overflow-hidden transition-all ${
                      editingArticle.imageUrl === item.url
                        ? 'border-amber-800 ring-2 ring-amber-800/20'
                        : 'border-transparent hover:border-stone-300'
                    }`}
                  >
                    <img src={item.url} alt={item.title} className="w-full h-24 object-cover" />
                    <div className="p-1.5 text-[10px] text-stone-600 truncate bg-white">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-[11px] text-stone-600 font-semibold mb-1">
                    Image Caption
                  </label>
                  <input
                    type="text"
                    value={editingArticle.imageCaption || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, imageCaption: e.target.value })
                    }
                    placeholder="Describe image scene..."
                    className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-stone-600 font-semibold mb-1">
                    Image Photo Credit
                  </label>
                  <input
                    type="text"
                    value={editingArticle.imageCredit || ''}
                    onChange={(e) =>
                      setEditingArticle({ ...editingArticle, imageCredit: e.target.value })
                    }
                    placeholder="e.g. Critical Eye / Staff Photographer"
                    className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Body Content Paragraphs */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Article Narrative Content (Separated by Paragraphs) *
              </label>
              <textarea
                rows={8}
                required
                value={editingArticle.content.join('\n\n')}
                onChange={(e) =>
                  setEditingArticle({
                    ...editingArticle,
                    content: e.target.value.split('\n\n').filter((p) => p.trim().length > 0),
                  })
                }
                placeholder="Write article paragraphs separated by double enter..."
                className="w-full p-3 bg-white border border-stone-300 rounded text-xs sm:text-sm font-sans leading-relaxed text-stone-800 focus:outline-none focus:border-amber-800"
              />
              <span className="text-[11px] text-stone-400">
                Tip: Press Enter twice to split into distinct editorial paragraphs. The first paragraph will automatically receive an editorial drop cap.
              </span>
            </div>

            {/* Key Takeaways & Pull Quote */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Key Takeaways (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingArticle.keyTakeaways?.join('\n') || ''}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      keyTakeaways: e.target.value.split('\n').filter((k) => k.trim()),
                    })
                  }
                  placeholder="Key point 1&#10;Key point 2"
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Verified Sources & Documents (One per line)
                </label>
                <textarea
                  rows={3}
                  value={editingArticle.sources?.join('\n') || ''}
                  onChange={(e) =>
                    setEditingArticle({
                      ...editingArticle,
                      sources: e.target.value.split('\n').filter((s) => s.trim()),
                    })
                  }
                  placeholder="WHO Technical Report 2026&#10;Ministry of Health Ghana Data"
                  className="w-full p-2 bg-white border border-stone-300 rounded text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
                <input
                  type="checkbox"
                  checked={editingArticle.featured}
                  onChange={(e) =>
                    setEditingArticle({ ...editingArticle, featured: e.target.checked })
                  }
                  className="w-4 h-4 accent-amber-800 rounded"
                />
                <span>Set as Lead Featured Story on Homepage</span>
              </label>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('articles')}
                  className="px-4 py-2 border border-stone-300 text-stone-600 rounded text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded text-xs font-semibold transition-colors"
                >
                  Save & Apply Changes
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 4. HOMEPAGE MANAGEMENT VIEW */}
        {activeTab === 'homepage' && (
          <div className="bg-white rounded border border-stone-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Homepage Lead & Section Configuration
              </h2>
              <p className="text-xs text-stone-500">
                Designate the top lead story and verify the ordered layout.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Current Lead Featured Story
              </h3>
              {articles.find((a) => a.featured) ? (
                <div className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded border border-stone-300">
                  <img
                    src={articles.find((a) => a.featured)?.imageUrl}
                    alt="Featured"
                    className="w-full sm:w-48 aspect-16/9 object-cover rounded"
                  />
                  <div>
                    <span className="text-[11px] font-semibold text-amber-900 uppercase">
                      {articles.find((a) => a.featured)?.category}
                    </span>
                    <h4 className="font-serif font-bold text-base text-stone-900 mt-0.5">
                      {articles.find((a) => a.featured)?.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                      {articles.find((a) => a.featured)?.deck}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-stone-500">No article marked as lead. Please select one below:</div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-3">
                Select Story to Pin as Lead Featured
              </h3>
              <div className="divide-y divide-stone-200 border border-stone-200 rounded overflow-hidden">
                {articles.map((art) => (
                  <div
                    key={art.id}
                    className="p-3 flex items-center justify-between hover:bg-stone-50 text-xs"
                  >
                    <div>
                      <span className="font-serif font-bold text-stone-900 text-sm block">
                        {art.title}
                      </span>
                      <span className="text-stone-500">
                        {art.category} · {art.author.name} · {art.status}
                      </span>
                    </div>
                    <button
                      onClick={() => handleSetFeatured(art.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold ${
                        art.featured
                          ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                          : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                      }`}
                    >
                      {art.featured ? 'Pinned as Lead' : 'Pin as Lead'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 4.5 BRAND, LOGO & BANNER ARTWORK MANAGEMENT VIEW */}
        {activeTab === 'brand' && (
          <div className="bg-white rounded border border-stone-200 p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-amber-900 font-semibold">
                  Visual Identity
                </span>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Logo & Brand Banner Artwork Space
                </h2>
                <p className="text-xs text-stone-500">
                  Configure the official publication logo emblem and panoramic brand banner artwork displayed on the site masthead.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setBrandForm(DEFAULT_BRAND_SETTINGS);
                    onSaveBrandSettings(DEFAULT_BRAND_SETTINGS);
                    setBrandSavedToast(true);
                    setTimeout(() => setBrandSavedToast(false), 2500);
                  }}
                  className="px-3 py-1.5 border border-stone-300 text-stone-700 hover:bg-stone-100 rounded text-xs font-medium"
                >
                  Reset to Official Defaults
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onSaveBrandSettings(brandForm);
                    setBrandSavedToast(true);
                    setTimeout(() => setBrandSavedToast(false), 2500);
                  }}
                  className="px-4 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Brand Settings</span>
                </button>
              </div>
            </div>

            {/* Saved Toast */}
            {brandSavedToast && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                <span>Brand logo and banner configuration saved successfully! Masthead updated.</span>
              </div>
            )}

            {/* Live Masthead Preview */}
            <div className="p-4 bg-stone-50 border border-stone-300 rounded space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                <span>Live Masthead Preview</span>
                <span className="text-[11px] font-normal text-stone-500">How readers see your publication</span>
              </div>

              <div className="bg-white p-4 rounded border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6">
                {/* Logo & title preview */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-16 h-16 rounded border border-stone-300 p-1 bg-white overflow-hidden shadow-xs">
                    <img
                      src={brandForm.logoUrl}
                      alt="Logo Preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="font-serif font-black text-2xl text-stone-950 tracking-tight">
                      CRITICAL EYE BLOG
                    </h3>
                    <p className="text-xs font-serif italic text-amber-900 font-medium">
                      {brandForm.tagline}
                    </p>
                    <p className="text-[10px] text-stone-500 mt-0.5">
                      Ghanaian Healthcare · African Public Health · Global Medical Policy
                    </p>
                  </div>
                </div>

                {/* Banner preview */}
                {brandForm.showBanner ? (
                  <div className="w-full md:max-w-md lg:max-w-lg aspect-3/1 rounded overflow-hidden border border-stone-300 shadow-xs bg-stone-900">
                    <img
                      src={brandForm.bannerUrl}
                      alt="Brand Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="text-xs text-stone-400 italic">
                    (Brand banner hidden by configuration)
                  </div>
                )}
              </div>
            </div>

            {/* Brand Settings Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column: Official Logo Management */}
              <div className="p-5 border border-stone-200 rounded space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                    <Palette className="w-4 h-4 text-amber-800" />
                    <span>Official Brand Logo</span>
                  </h3>
                  <span className="text-[11px] text-stone-500 font-mono">1:1 Square</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded border border-stone-300 p-1 bg-stone-50 shrink-0 overflow-hidden">
                    <img
                      src={brandForm.logoUrl}
                      alt="Current Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="text-xs space-y-1">
                    <p className="font-semibold text-stone-800">Current Logo Emblem</p>
                    <p className="text-stone-500 text-[11px]">
                      Displays in the primary masthead, mobile navigation, and metadata.
                    </p>
                    <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium cursor-pointer transition-colors border border-stone-300">
                      <Upload className="w-3 h-3 text-stone-500" />
                      <span>Upload Custom Logo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setBrandForm({ ...brandForm, logoUrl: ev.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Logo Image URL or Local Asset Path
                  </label>
                  <input
                    type="text"
                    value={brandForm.logoUrl}
                    onChange={(e) => setBrandForm({ ...brandForm, logoUrl: e.target.value })}
                    placeholder="/src/assets/images/... or https://..."
                    className="w-full p-2 border border-stone-300 rounded text-xs font-mono focus:outline-none focus:border-amber-800"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    value={brandForm.tagline}
                    onChange={(e) => setBrandForm({ ...brandForm, tagline: e.target.value })}
                    placeholder="Journalism with Perspective. Reporting with Purpose."
                    className="w-full p-2 border border-stone-300 rounded text-xs focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>

              {/* Right Column: Brand Banner Artwork Management */}
              <div className="p-5 border border-stone-200 rounded space-y-4 bg-white">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-stone-900 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-800" />
                    <span>Brand Banner Artwork</span>
                  </h3>
                  <span className="text-[11px] text-stone-500 font-mono">Panoramic (3:1 / 4:1)</span>
                </div>

                <div className="aspect-3/1 rounded border border-stone-300 overflow-hidden bg-stone-900">
                  <img
                    src={brandForm.bannerUrl}
                    alt="Current Banner"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 text-xs font-semibold text-stone-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={brandForm.showBanner}
                      onChange={(e) => setBrandForm({ ...brandForm, showBanner: e.target.checked })}
                      className="w-4 h-4 accent-amber-800 rounded"
                    />
                    <span>Display Brand Banner in Publication Masthead</span>
                  </label>

                  <label className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded text-xs font-medium cursor-pointer transition-colors border border-stone-300">
                    <Upload className="w-3 h-3 text-stone-500" />
                    <span>Upload Banner</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            if (ev.target?.result) {
                              setBrandForm({ ...brandForm, bannerUrl: ev.target.result as string });
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Banner Artwork URL or Local Asset Path
                  </label>
                  <input
                    type="text"
                    value={brandForm.bannerUrl}
                    onChange={(e) => setBrandForm({ ...brandForm, bannerUrl: e.target.value })}
                    placeholder="/src/assets/images/... or https://..."
                    className="w-full p-2 border border-stone-300 rounded text-xs font-mono focus:outline-none focus:border-amber-800"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-stone-200 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setBrandForm(brandSettings);
                }}
                className="px-4 py-2 border border-stone-300 rounded text-xs font-semibold text-stone-600 hover:bg-stone-100"
              >
                Discard Changes
              </button>
              <button
                type="button"
                onClick={() => {
                  onSaveBrandSettings(brandForm);
                  setBrandSavedToast(true);
                  setTimeout(() => setBrandSavedToast(false), 2500);
                }}
                className="px-5 py-2 bg-amber-900 hover:bg-amber-950 text-white rounded text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save & Apply Brand Artwork</span>
              </button>
            </div>
          </div>
        )}

        {/* 5. AUTHORS & ROLES VIEW */}
        {activeTab === 'authors' && (
          <div className="bg-white rounded border border-stone-200 p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div>
                <h2 className="text-xl font-serif font-bold text-stone-900">
                  Newsroom Authors, Masthead & Roles
                </h2>
                <p className="text-xs text-stone-500">
                  Journalists, medical editors, and clinical contributors.
                </p>
              </div>
              <button
                onClick={() => setIsAddingAuthor(true)}
                className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded inline-flex items-center gap-1.5"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Reporter</span>
              </button>
            </div>

            {isAddingAuthor && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newAuthor.name) return;
                  const created: Author = {
                    ...newAuthor,
                    id: `author-${Date.now()}`,
                    articlesCount: 0,
                  };
                  onSaveAuthor(created);
                  setIsAddingAuthor(false);
                  setNewAuthor({ name: '', role: '', bio: '', email: '' });
                }}
                className="p-4 bg-stone-50 border border-stone-200 rounded space-y-3 text-xs"
              >
                <h4 className="font-bold text-stone-900">Add New Team Member</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Kwaku Mensah)"
                    value={newAuthor.name}
                    onChange={(e) => setNewAuthor({ ...newAuthor, name: e.target.value })}
                    className="p-2 border border-stone-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Role (e.g. Public Health Correspondent)"
                    value={newAuthor.role}
                    onChange={(e) => setNewAuthor({ ...newAuthor, role: e.target.value })}
                    className="p-2 border border-stone-300 rounded bg-white"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="email"
                    required
                    placeholder="Email Address"
                    value={newAuthor.email}
                    onChange={(e) => setNewAuthor({ ...newAuthor, email: e.target.value })}
                    className="p-2 border border-stone-300 rounded bg-white"
                  />
                  <input
                    type="text"
                    placeholder="Bio summary"
                    value={newAuthor.bio}
                    onChange={(e) => setNewAuthor({ ...newAuthor, bio: e.target.value })}
                    className="p-2 border border-stone-300 rounded bg-white"
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddingAuthor(false)}
                    className="px-3 py-1 border border-stone-300 rounded text-stone-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-3 py-1 bg-amber-900 text-white rounded font-medium"
                  >
                    Add Member
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {authors.map((auth) => (
                <div key={auth.id} className="p-4 border border-stone-200 rounded flex gap-4 bg-stone-50/50">
                  <div className="w-12 h-12 rounded-full bg-amber-900/10 text-amber-900 font-serif font-bold flex items-center justify-center text-base shrink-0">
                    {auth.name.split(' ').map((n) => n[0]).join('')}
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-sm text-stone-900">{auth.name}</h3>
                    <p className="text-xs text-amber-900 font-medium">{auth.role}</p>
                    <p className="text-xs text-stone-600 mt-1 leading-relaxed">{auth.bio}</p>
                    <div className="text-[11px] text-stone-400 mt-2 flex items-center gap-3">
                      <span>{auth.email}</span>
                      <span>·</span>
                      <span>{auth.articlesCount} stories filed</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. MEDIA ASSETS VIEW */}
        {activeTab === 'media' && (
          <div className="bg-white rounded border border-stone-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                Media Library & Healthcare Assets
              </h2>
              <p className="text-xs text-stone-500">
                High-resolution authentic Ghanaian and African photojournalism assets.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {mediaLibrary.map((item, idx) => (
                <div key={idx} className="border border-stone-200 rounded overflow-hidden group">
                  <div className="aspect-16/10 overflow-hidden bg-stone-200">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-3 text-xs space-y-1">
                    <span className="text-[10px] font-semibold text-amber-900 uppercase">
                      {item.category}
                    </span>
                    <h4 className="font-semibold text-stone-900 leading-snug line-clamp-2">
                      {item.title}
                    </h4>
                    <p className="text-[10px] font-mono text-stone-400 truncate pt-1">
                      {item.url}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 7. SEO, RSS & SITEMAP VIEW */}
        {activeTab === 'seo' && (
          <div className="bg-white rounded border border-stone-200 p-6 space-y-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-stone-900">
                SEO, Google News Readiness & Syndication
              </h2>
              <p className="text-xs text-stone-500">
                Structured JSON-LD schema, live RSS 2.0 wire feed, and Google-compatible XML Sitemap.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* RSS 2.0 Feed preview */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                    <Rss className="w-4 h-4 text-amber-800" />
                    <span>Live RSS 2.0 Feed</span>
                  </h3>
                  <button
                    onClick={() => {
                      const xml = generateRssFeed(articles);
                      navigator.clipboard.writeText(xml);
                      alert('RSS XML copied to clipboard.');
                    }}
                    className="text-xs text-amber-900 font-semibold hover:underline"
                  >
                    Copy RSS XML
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-stone-900 text-stone-200 p-3 rounded max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {generateRssFeed(articles)}
                </pre>
              </div>

              {/* Sitemap.xml preview */}
              <div className="p-4 bg-stone-50 border border-stone-200 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-sm text-stone-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-800" />
                    <span>Google News XML Sitemap</span>
                  </h3>
                  <button
                    onClick={() => {
                      const sitemap = generateSitemapXml(articles);
                      navigator.clipboard.writeText(sitemap);
                      alert('Sitemap XML copied to clipboard.');
                    }}
                    className="text-xs text-amber-900 font-semibold hover:underline"
                  >
                    Copy Sitemap XML
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-stone-900 text-stone-200 p-3 rounded max-h-72 overflow-y-auto whitespace-pre-wrap">
                  {generateSitemapXml(articles)}
                </pre>
              </div>
            </div>

            {/* Google Search Console & News Readiness Checklist */}
            <div className="p-4 bg-amber-50/70 border border-amber-200 rounded space-y-2 text-xs">
              <h3 className="font-bold text-amber-950 uppercase tracking-wider">
                Google News Technical Compliance Audit
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-700">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Permanent 3-digit slug URL structure active</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Explicit bylines and transparent editorial masthead</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Schema.org NewsMediaOrganization & NewsArticle tags</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Transparent correction policy and error log ledger</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: Add Correction Record */}
      {correctionModalArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h3 className="font-serif font-bold text-base text-stone-900">
                Record Editorial Correction
              </h3>
              <button
                onClick={() => setCorrectionModalArticle(null)}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-stone-600">
              Article: <strong>{correctionModalArticle.title}</strong>
            </p>

            <form onSubmit={handleAddCorrection} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Correction / Clarification Note *
                </label>
                <textarea
                  required
                  rows={4}
                  value={newCorrectionNote}
                  onChange={(e) => setNewCorrectionNote(e.target.value)}
                  placeholder="Detail the exact factual adjustment made (e.g. 'Updated to clarify that regional rollout begins Nov 15')..."
                  className="w-full p-2.5 border border-stone-300 rounded focus:outline-none focus:border-amber-800"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">
                  Responsible Editor / Desk
                </label>
                <input
                  type="text"
                  value={newCorrectionEditor}
                  onChange={(e) => setNewCorrectionEditor(e.target.value)}
                  className="w-full p-2 border border-stone-300 rounded focus:outline-none focus:border-amber-800"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCorrectionModalArticle(null)}
                  className="px-3 py-1.5 border border-stone-300 rounded text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-amber-900 hover:bg-amber-950 text-white rounded font-medium"
                >
                  Append to Correction Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
