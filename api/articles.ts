import { neon } from '@neondatabase/serverless';

const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'yana2026';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.VITE_TELEGRAM_BOT_TOKEN || '8909434781:AAGk1jPav9l3QFcHGzdINNln-W5P3Enaolc';
const ADMIN_NOTIFY_CHAT_ID = process.env.ADMIN_NOTIFY_CHAT_ID || process.env.VITE_ADMIN_NOTIFY_CHAT_ID || '6259693114';

function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_AUTHENTICATED_URL ||
    process.env.POSTGRES_PRISMA_URL
  );
}

function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

async function ensureTableSchema(sql: any) {
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
}

export default async function handler(req: any, res?: any) {
  // CORS Headers
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-password, Authorization',
  };

  if (res && typeof res.setHeader === 'function') {
    Object.entries(corsHeaders).forEach(([k, v]) => res.setHeader(k, v));
  }

  if (req.method === 'OPTIONS') {
    if (res && typeof res.status === 'function') {
      res.status(200).end();
      return;
    }
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  // Response helper supporting both Node serverless (res) and Edge / Web-standard (Response)
  const respondJson = (data: any, status = 200, cache = false) => {
    const headers: Record<string, string> = {
      ...corsHeaders,
      'Content-Type': 'application/json',
    };

    if (cache) {
      // 24 hours edge cache, 12 hours stale-while-revalidate for Vercel & Cloudflare
      headers['Cache-Control'] = 'public, s-maxage=86400, stale-while-revalidate=43200';
    } else {
      headers['Cache-Control'] = 'no-store, no-cache, must-revalidate';
    }

    if (res && typeof res.setHeader === 'function') {
      Object.entries(headers).forEach(([k, v]) => res.setHeader(k, v));
      return res.status(status).json(data);
    }

    return new Response(JSON.stringify(data), {
      status,
      headers,
    });
  };

  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return respondJson({ 
      error: 'Липсва DATABASE_URL в средата на Vercel.',
      hint: 'Моля, уверете се, че Neon Postgres базата данни е свързана към проекта във Vercel.' 
    }, 500, false);
  }

  const sql = neon(dbUrl);

  try {
    // Helper to authenticate
    const isAuth = (headerOrBodyPass?: string) => {
      const pass = headerOrBodyPass || (req.headers && req.headers['x-admin-password']);
      return pass === DEFAULT_ADMIN_PASS;
    };

    // --- GET: Fetch articles ---
    if (req.method === 'GET') {
      let articleId: string | null = null;
      if (req.query?.id) {
        articleId = String(req.query.id);
      } else if (req.url) {
        try {
          const parsedUrl = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
          articleId = parsedUrl.searchParams.get('id');
        } catch {
          // ignore
        }
      }

      // 1. Fetch single article with full content when ID is requested
      if (articleId) {
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
          WHERE id = ${articleId}
          LIMIT 1;
        `;

        if (!rows || rows.length === 0) {
          return respondJson({ error: 'Статията не е намерена.' }, 404, false);
        }

        const r = rows[0];
        const normalized = {
          ...r,
          fullContent: typeof r.fullContent === 'string' ? JSON.parse(r.fullContent) : (Array.isArray(r.fullContent) ? r.fullContent : []),
          keyTakeaways: typeof r.keyTakeaways === 'string' ? JSON.parse(r.keyTakeaways) : (Array.isArray(r.keyTakeaways) ? r.keyTakeaways : []),
          fullContentEn: typeof r.fullContentEn === 'string' ? JSON.parse(r.fullContentEn) : (Array.isArray(r.fullContentEn) ? r.fullContentEn : []),
          keyTakeawaysEn: typeof r.keyTakeawaysEn === 'string' ? JSON.parse(r.keyTakeawaysEn) : (Array.isArray(r.keyTakeawaysEn) ? r.keyTakeawaysEn : []),
        };

        return respondJson(normalized, 200, true);
      }

      // 2. For list on homepage: query ONLY metadata (id, title, category, readTime, date, excerpt, image)
      // DO NOT pull full content or heavy fields
      const rows = await sql`
        SELECT 
          id, 
          title, 
          category, 
          read_time as "readTime", 
          date, 
          excerpt, 
          image, 
          created_at as "createdAt",
          title_en as "titleEn",
          category_en as "categoryEn",
          read_time_en as "readTimeEn",
          date_en as "dateEn",
          excerpt_en as "excerptEn"
        FROM articles
        ORDER BY created_at DESC;
      `;

      return respondJson(rows, 200, true);
    }

    // --- POST: Create new article ---
    if (req.method === 'POST') {
      await ensureTableSchema(sql);

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { password, ...article } = body;
      
      if (!isAuth(password)) {
        return respondJson({ error: 'Невалидна администраторска парола.' }, 401, false);
      }

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
          ${article.image || '/about-interior-v2.png'},
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

      // Send Telegram notification to Viktor about the new article
      try {
        const hasEn = Boolean(article.titleEn && article.titleEn.trim());
        const statusText = hasEn 
          ? '✅ Включен е английски превод' 
          : '⚠️ <b>Липсва английски превод – моля добавете го!</b>';
        
        const notifyText = 
          `🔔 <b>Нова статия в сайта!</b>\n\n` +
          `📌 <b>Заглавие:</b> ${escapeHtml(article.title)}\n` +
          `🏷️ <b>Категория:</b> ${escapeHtml(article.category || 'Обща')}\n` +
          `🌐 <b>Статус:</b> ${statusText}\n\n` +
          `👉 <b>Влезте тук за превод:</b> <a href="https://yanapsychology.com/#admin">yanapsychology.com/#admin</a>`;

        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: ADMIN_NOTIFY_CHAT_ID,
            text: notifyText,
            parse_mode: 'HTML',
          }),
        });
      } catch (tgErr) {
        console.warn('Telegram notification error for new article:', tgErr);
      }

      return respondJson({ success: true, article: { ...article, id } }, 201, false);
    }

    // --- PUT: Update existing article (or add translation) ---
    if (req.method === 'PUT') {
      await ensureTableSchema(sql);

      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { password, ...article } = body;

      if (!isAuth(password)) {
        return respondJson({ error: 'Невалидна администраторска парола.' }, 401, false);
      }

      if (!article.id) {
        return respondJson({ error: 'Липсва ID на статията.' }, 400, false);
      }

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
          image = ${article.image || '/about-interior-v2.png'},
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

      return respondJson({ success: true, article }, 200, false);
    }

    // --- DELETE: Delete article ---
    if (req.method === 'DELETE') {
      let articleId: string | null = null;
      if (req.query?.id) {
        articleId = String(req.query.id);
      } else if (req.url) {
        try {
          const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
          articleId = url.searchParams.get('id');
        } catch {
          // ignore
        }
      }

      const body = typeof req.body === 'string' ? (req.body ? JSON.parse(req.body) : {}) : (req.body || {});
      if (!articleId) {
        articleId = body?.id;
      }
      const pass = (req.headers && req.headers['x-admin-password']) || body?.password;

      if (!isAuth(pass)) {
        return respondJson({ error: 'Невалидна администраторска парола.' }, 401, false);
      }

      if (!articleId) {
        return respondJson({ error: 'Липсва ID на статията за изтриване.' }, 400, false);
      }

      await sql`DELETE FROM articles WHERE id = ${articleId};`;
      return respondJson({ success: true, message: 'Статията е изтрита успешно.' }, 200, false);
    }

    return respondJson({ error: 'Неподдържан HTTP метод.' }, 405, false);
  } catch (err: any) {
    console.error('Neon API Serverless Error:', err);
    return respondJson({ 
      error: 'Грешка при комуникация с базата данни.', 
      details: err?.message || String(err) 
    }, 500, false);
  }
}
