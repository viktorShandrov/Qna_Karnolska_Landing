import { neon } from '@neondatabase/serverless';

function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_AUTHENTICATED_URL ||
    process.env.POSTGRES_PRISMA_URL
  );
}

const DEFAULT_ARTICLES = [
  'navigating-anxiety',
  'boundaries-and-self-worth',
  'overcoming-burnout'
];

export default async function handler(req: any, res: any) {
  const domain = process.env.SITE_URL || 'https://yanakarnolska.com';
  const currentDate = new Date().toISOString().split('T')[0];

  let dynamicArticleUrls = '';

  try {
    const dbUrl = getDatabaseUrl();
    if (dbUrl) {
      const sql = neon(dbUrl);
      const articles = await sql`SELECT id, created_at FROM articles ORDER BY created_at DESC;`;
      
      if (articles && articles.length > 0) {
        dynamicArticleUrls = articles
          .map((a: any) => {
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
      }
    }
  } catch (err: any) {
    console.warn('Could not query DB for sitemap, using fallback:', err?.message || err);
  }

  // Fallback to static articles if DB was not reachable or empty
  if (!dynamicArticleUrls) {
    dynamicArticleUrls = DEFAULT_ARTICLES
      .map((id) => `  <url>
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
  <url>
    <loc>${domain}/</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${domain}/#services</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/#about</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/#articles</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
${dynamicArticleUrls}
</urlset>`;

  // Handle Edge runtime / Web Request
  if (typeof Response !== 'undefined' && (!res || typeof res.setHeader !== 'function')) {
    return new Response(sitemapXml, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }

  // Handle Node.js runtime (Vercel Serverless Function)
  if (res && typeof res.setHeader === 'function') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

    if (req.method === 'OPTIONS') {
      res.statusCode = 200;
      return res.end();
    }

    res.statusCode = 200;
    if (typeof res.send === 'function') {
      return res.send(sitemapXml);
    }
    return res.end(sitemapXml);
  }

  return sitemapXml;
}
