import fs from 'fs';
import path from 'path';
import { neon } from '@neondatabase/serverless';

const domain = process.env.SITE_URL || 'https://qnakarnolskalanding.vercel.app';
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_1tFEpgW2HJfN@ep-nameless-frost-awk2q7z1-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const DEFAULT_ARTICLES = [
  'navigating-anxiety',
  'boundaries-and-self-worth',
  'overcoming-burnout'
];

async function generate() {
  console.log('Generating static sitemap.xml...');
  const currentDate = new Date().toISOString().split('T')[0];
  let articleUrls = '';

  try {
    if (dbUrl) {
      const sql = neon(dbUrl);
      const articles = await sql`SELECT id, created_at FROM articles ORDER BY created_at DESC;`;
      if (articles && articles.length > 0) {
        articleUrls = articles
          .map((a) => {
            const modDate = a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : currentDate;
            return `  <!-- Article: ${a.id} -->
  <url>
    <loc>${domain}/?article=${encodeURIComponent(a.id)}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
          })
          .join('\n');
        console.log(`Found ${articles.length} articles in database for sitemap.`);
      }
    }
  } catch (err) {
    console.warn('Could not query DB during sitemap generation, using fallback articles:', err.message);
  }

  if (!articleUrls) {
    articleUrls = DEFAULT_ARTICLES
      .map((id) => `  <!-- Article: ${id} -->
  <url>
    <loc>${domain}/?article=${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
      .join('\n');
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
  
  <!-- Main Landing Page -->
  <url>
    <loc>${domain}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${articleUrls}
</urlset>
`;

  const publicDir = path.resolve('public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml.trim(), 'utf8');
  console.log('Successfully written public/sitemap.xml');
}

generate().catch((err) => {
  console.error('Sitemap generator error:', err);
});