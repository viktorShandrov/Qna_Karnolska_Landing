import { neon } from '@neondatabase/serverless';

function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_AUTHENTICATED_URL ||
    process.env.POSTGRES_PRISMA_URL
  );
}

export default async function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate');

  const domain = process.env.SITE_URL || 'https://yanakarnolska.com';
  const currentDate = new Date().toISOString().split('T')[0];

  let dynamicArticleUrls = '';

  try {
    const dbUrl = getDatabaseUrl();
    if (dbUrl) {
      const sql = neon(dbUrl);
      const articles = await sqlSELECT id, created_at FROM articles ORDER BY created_at DESC;;
      
      dynamicArticleUrls = articles
        .map((a: any) => {
          const modDate = a.created_at ? new Date(a.created_at).toISOString().split('T')[0] : currentDate;
          return   <url>
    <loc>/?article=</loc>
    <lastmod></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>;
        })
        .join('\n');
    }
  } catch (err) {
    console.warn('Could not load dynamic articles for sitemap, fallback to static:', err);
  }

  const sitemapXml = <?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>/</loc>
    <lastmod></lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>/#services</loc>
    <lastmod></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>/#about</loc>
    <lastmod></lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>/#articles</loc>
    <lastmod></lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>

</urlset>;

  return res.status(200).send(sitemapXml);
}
