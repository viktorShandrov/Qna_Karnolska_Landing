import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { neon } from '@neondatabase/serverless';

function neonApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'neon-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // Handle dynamic live /sitemap.xml and /api/sitemap on every request
        if (req.url?.startsWith('/api/sitemap') || req.url === '/sitemap.xml' || req.url?.startsWith('/sitemap.xml?')) {
          const dbUrl = env.DATABASE_URL || env.POSTGRES_URL;
          const domain = env.SITE_URL || 'https://yanapsychology.com';
          const currentDate = new Date().toISOString().split('T')[0];

          let dynamicArticleUrls = '';

          try {
            if (dbUrl) {
              const sql = neon(dbUrl);
              const articles = await sql`SELECT id, created_at FROM articles ORDER BY created_at DESC;`;
              if (articles && articles.length > 0) {
                dynamicArticleUrls = articles
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
            console.warn('Neon dev sitemap error:', err.message);
          }

          if (!dynamicArticleUrls) {
            dynamicArticleUrls = `  <url>
    <loc>${domain}/bg/?article=navigating-anxiety</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/en/?article=navigating-anxiety</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/bg/?article=boundaries-and-self-worth</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/en/?article=boundaries-and-self-worth</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/bg/?article=overcoming-burnout</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${domain}/en/?article=overcoming-burnout</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
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
${dynamicArticleUrls}
</urlset>`;

          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/xml; charset=utf-8');
          res.end(sitemapXml);
          return;
        }

        if (!req.url?.startsWith('/api/articles')) {
          return next();
        }

        const dbUrl = env.DATABASE_URL || env.POSTGRES_URL;
        if (!dbUrl) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Missing DATABASE_URL in .env' }));
          return;
        }

        const sql = neon(dbUrl);

        try {
          // Parse body if method is POST, PUT, DELETE
          let body: any = null;
          if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method || '')) {
            const buffers = [];
            for await (const chunk of req) {
              buffers.push(chunk);
            }
            const data = Buffer.concat(buffers).toString();
            body = data ? JSON.parse(data) : {};
          }

          // Ensure table exists
          await sql`
            CREATE TABLE IF NOT EXISTS articles (
              id TEXT PRIMARY KEY,
              title TEXT NOT NULL,
              category TEXT NOT NULL,
              read_time TEXT NOT NULL,
              date TEXT NOT NULL,
              excerpt TEXT NOT NULL,
              image TEXT NOT NULL,
              quote TEXT,
              full_content JSONB NOT NULL DEFAULT '[]'::jsonb,
              key_takeaways JSONB DEFAULT '[]'::jsonb,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              title_en TEXT,
              category_en TEXT,
              read_time_en TEXT,
              date_en TEXT,
              excerpt_en TEXT,
              quote_en TEXT,
              full_content_en JSONB DEFAULT '[]'::jsonb,
              key_takeaways_en JSONB DEFAULT '[]'::jsonb
            );
          `;

          await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_en TEXT;`;
          await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS category_en TEXT;`;
          await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS read_time_en TEXT;`;
          await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS date_en TEXT;`;
          await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_en TEXT;`;
          await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS quote_en TEXT;`;
          await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS full_content_en JSONB DEFAULT '[]'::jsonb;`;
          await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS key_takeaways_en JSONB DEFAULT '[]'::jsonb;`;

          if (req.method === 'GET') {
            const rows = await sql`
              SELECT 
                id, 
                title, 
                category, 
                read_time as "readTime", 
                date, 
                excerpt, 
                image, 
                quote, 
                full_content as "fullContent", 
                key_takeaways as "keyTakeaways", 
                created_at as "createdAt",
                title_en as "titleEn",
                category_en as "categoryEn",
                read_time_en as "readTimeEn",
                date_en as "dateEn",
                excerpt_en as "excerptEn",
                quote_en as "quoteEn",
                full_content_en as "fullContentEn",
                key_takeaways_en as "keyTakeawaysEn"
              FROM articles
              ORDER BY created_at DESC;
            `;
            const normalized = rows.map((r: any) => ({
              ...r,
              fullContent: typeof r.fullContent === 'string' ? JSON.parse(r.fullContent) : (Array.isArray(r.fullContent) ? r.fullContent : []),
              keyTakeaways: typeof r.keyTakeaways === 'string' ? JSON.parse(r.keyTakeaways) : (Array.isArray(r.keyTakeaways) ? r.keyTakeaways : []),
              fullContentEn: typeof r.fullContentEn === 'string' ? JSON.parse(r.fullContentEn) : (Array.isArray(r.fullContentEn) ? r.fullContentEn : []),
              keyTakeawaysEn: typeof r.keyTakeawaysEn === 'string' ? JSON.parse(r.keyTakeawaysEn) : (Array.isArray(r.keyTakeawaysEn) ? r.keyTakeawaysEn : []),
            }));
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(normalized));
            return;
          }

          if (req.method === 'POST') {
            const article = body;
            const id = article.id || `article-${Date.now()}`;
            const fullContentJson = JSON.stringify(article.fullContent || []);
            const keyTakeawaysJson = JSON.stringify(article.keyTakeaways || []);
            const fullContentEnJson = JSON.stringify(article.fullContentEn || []);
            const keyTakeawaysEnJson = JSON.stringify(article.keyTakeawaysEn || []);

            await sql`
              INSERT INTO articles (
                id, title, category, read_time, date, excerpt, image, quote, full_content, key_takeaways,
                title_en, category_en, read_time_en, date_en, excerpt_en, quote_en, full_content_en, key_takeaways_en
              )
              VALUES (
                ${id},
                ${article.title},
                ${article.category},
                ${article.readTime || '5 мин четене'},
                ${article.date || '2026'},
                ${article.excerpt},
                ${article.image || '/Articles Images/pic1.jpeg'},
                ${article.quote || null},
                ${fullContentJson}::jsonb,
                ${keyTakeawaysJson}::jsonb,
                ${article.titleEn || null},
                ${article.categoryEn || null},
                ${article.readTimeEn || null},
                ${article.dateEn || null},
                ${article.excerptEn || null},
                ${article.quoteEn || null},
                ${fullContentEnJson}::jsonb,
                ${keyTakeawaysEnJson}::jsonb
              );
            `;
            res.statusCode = 201;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, article: { ...article, id } }));
            return;
          }

          if (req.method === 'PUT') {
            const article = body;
            const fullContentJson = JSON.stringify(article.fullContent || []);
            const keyTakeawaysJson = JSON.stringify(article.keyTakeaways || []);
            const fullContentEnJson = JSON.stringify(article.fullContentEn || []);
            const keyTakeawaysEnJson = JSON.stringify(article.keyTakeawaysEn || []);

            await sql`
              UPDATE articles
              SET
                title = ${article.title},
                category = ${article.category},
                read_time = ${article.readTime || '5 мин четене'},
                date = ${article.date || '2026'},
                excerpt = ${article.excerpt},
                image = ${article.image || '/Articles Images/pic1.jpeg'},
                quote = ${article.quote || null},
                full_content = ${fullContentJson}::jsonb,
                key_takeaways = ${keyTakeawaysJson}::jsonb,
                title_en = ${article.titleEn || null},
                category_en = ${article.categoryEn || null},
                read_time_en = ${article.readTimeEn || null},
                date_en = ${article.dateEn || null},
                excerpt_en = ${article.excerptEn || null},
                quote_en = ${article.quoteEn || null},
                full_content_en = ${fullContentEnJson}::jsonb,
                key_takeaways_en = ${keyTakeawaysEnJson}::jsonb
              WHERE id = ${article.id};
            `;
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true, article }));
            return;
          }

          if (req.method === 'DELETE') {
            const urlObj = new URL(req.url || '', `http://${req.headers.host}`);
            const articleId = urlObj.searchParams.get('id') || body?.id;

            if (articleId) {
              await sql`DELETE FROM articles WHERE id = ${articleId};`;
            }
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ success: true }));
            return;
          }

          next();
        } catch (err: any) {
          console.error('Neon dev API error:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react(), neonApiPlugin(env)],
  };
});
