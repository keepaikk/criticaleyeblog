export type Category =
  | 'Ghana Health'
  | 'Public Health'
  | 'Healthcare Policy'
  | 'Hospitals & Healthcare'
  | 'Medicines & Pharmaceuticals'
  | 'Maternal & Child Health'
  | 'Medical Research'
  | 'Health Technology'
  | 'Mental Health'
  | 'Nutrition & Lifestyle'
  | 'Africa Health'
  | 'Global Health';

export type ArticleType = 'News' | 'Analysis' | 'Investigation' | 'Opinion' | 'Feature';

export type ArticleStatus = 'Draft' | 'Review' | 'Approved' | 'Published';

export interface CorrectionRecord {
  id: string;
  date: string;
  note: string;
  editor: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  deck: string;
  category: Category;
  articleType: ArticleType;
  status: ArticleStatus;
  featured: boolean;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  publishedAt: string;
  updatedAt?: string;
  readTime: string;
  imageUrl: string;
  imageCaption: string;
  imageCredit: string;
  content: string[]; // paragraphs and sections
  keyTakeaways?: string[];
  pullQuote?: {
    text: string;
    attribution: string;
  };
  sources?: string[];
  medicalReviewer?: string;
  corrections?: CorrectionRecord[];
  isBlogPost?: boolean;
  blogSeries?: 'Clinician Perspective' | 'Field Dispatches' | "Doctor's Notebook" | 'Health Policy Column' | 'Patient Journey' | 'Research Reflection';
}

export interface BlogPitch {
  id: string;
  name: string;
  profession: string;
  institution: string;
  email: string;
  topic: string;
  summary: string;
  submittedAt: string;
}

export interface Author {
  id: string;
  name: string;
  role: string;
  bio: string;
  email: string;
  articlesCount: number;
}

export interface BrandSettings {
  logoUrl: string;
  bannerUrl: string;
  tagline: string;
  showBanner: boolean;
}
