import { neon } from '@neondatabase/serverless';

export const config = {
  runtime: 'edge',
};

const domain = process.env.SITE_URL || 'https://yanapsychology.com';
const dbUrl = process.env.DATABASE_URL || process.env.POSTGRES_URL || 'postgresql://neondb_owner:npg_1tFEpgW2HJfN@ep-nameless-frost-awk2q7z1-pooler.c-12.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require';

const DEFAULT_ARTICLES = [
  'navigating-anxiety',
  'boundaries-and-self-worth',
  'overcoming-burnout'
];

export default async function handler(req: Request) {
  const currentDate = new Date().toISOString().split('T')[0];
  let articleUrls = '';

  try {
    if (dbUrl) {
      const sql = neon(dbUrl);
      const articles = await sql`SELECT id, created_at FROM articles ORDER BY created_at DESC;`;
      
      if (articles && articles.length > 0) {
        articleUrls = articles
          .map((a: any) => {
            const modDate = a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : currentDate;
            return `  <url>
    <loc>${domain}/bg/?article=${encodeURIComponent(a.id)}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/en/?article=${encodeURIComponent(a.id)}</loc>
    <lastmod>${modDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
          })
          .join('\n');
      }
    }
  } catch (err: any) {
    console.warn('Live sitemap DB query warning:', err?.message || err);
  }

  // Fallback to default articles if DB query returned nothing
  if (!articleUrls) {
    articleUrls = DEFAULT_ARTICLES
      .map((id) => `  <url>
    <loc>${domain}/bg/?article=${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/en/?article=${id}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`)
      .join('\n');
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${domain}/bg/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/en/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
${articleUrls}
</urlset>`;

  return new Response(sitemapXml.trimStart(), {
    status: 200,
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      'Access-Control-Allow-Origin': '*',
    },
  });
}