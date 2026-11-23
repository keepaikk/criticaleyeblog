import { INITIAL_ARTICLES, AUTHORS } from '../src/data/newsData';
import { ARCHIVE_STORIES } from '../src/data/archiveStories';
import { Article } from '../src/types';
import { writeFileSync } from 'fs';

const toDatabaseArticle = (a: Article) => ({
  id: a.id,
  slug: a.slug,
  title: a.title,
  deck: a.deck,
  category: a.category,
  article_type: a.articleType,
  status: a.status,
  featured: a.featured,
  author_name: a.author.name,
  author_role: a.author.role,
  author_avatar: a.author.avatar,
  published_at: a.publishedAt,
  updated_at: a.updatedAt,
  read_time: a.readTime,
  image_url: a.imageUrl,
  image_caption: a.imageCaption,
  image_credit: a.imageCredit,
  content: a.content,
  key_takeaways: a.keyTakeaways,
  pull_quote_text: a.pullQuote?.text,
  pull_quote_attribution: a.pullQuote?.attribution,
  sources: a.sources,
  medical_reviewer: a.medicalReviewer,
  is_blog_post: a.isBlogPost,
  blog_series: a.blogSeries,
});

const dbArticles = INITIAL_ARTICLES.map(toDatabaseArticle);
const archiveArticles = ARCHIVE_STORIES.map(toDatabaseArticle);

const dbAuthors = AUTHORS.map(a => ({
  id: a.id,
  name: a.name,
  role: a.role,
  bio: a.bio,
  email: a.email,
  articles_count: a.articlesCount,
}));

writeFileSync('server/seed-data.json', JSON.stringify({ articles: dbArticles, archiveArticles, authors: dbAuthors }, null, 2));
console.log('Exported', dbArticles.length + archiveArticles.length, 'articles and', dbAuthors.length, 'authors');
