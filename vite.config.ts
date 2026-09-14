import { defineConfig, loadEnv, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { neon } from '@neondatabase/serverless';

function neonApiPlugin(env: Record<string, string>): Plugin {
  return {
    name: 'neon-api-dev-middleware',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
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
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `;

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
                created_at as "createdAt"
              FROM articles
              ORDER BY created_at DESC;
            `;
            const normalized = rows.map((r: any) => ({
              ...r,
              fullContent: typeof r.fullContent === 'string' ? JSON.parse(r.fullContent) : (Array.isArray(r.fullContent) ? r.fullContent : []),
              keyTakeaways: typeof r.keyTakeaways === 'string' ? JSON.parse(r.keyTakeaways) : (Array.isArray(r.keyTakeaways) ? r.keyTakeaways : []),
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

            await sql`
              INSERT INTO articles (id, title, category, read_time, date, excerpt, image, quote, full_content, key_takeaways)
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
                ${keyTakeawaysJson}::jsonb
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
                key_takeaways = ${keyTakeawaysJson}::jsonb
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
