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

export default async function handler(req: any, res: any) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-admin-password, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const dbUrl = getDatabaseUrl();
  if (!dbUrl) {
    return res.status(500).json({ 
      error: 'Липсва DATABASE_URL в средата на Vercel.',
      hint: 'Моля, уверете се, че Neon Postgres базата данни е свързана към проекта във Vercel.' 
    });
  }

  const sql = neon(dbUrl);

  try {
    // 1. Ensure table exists
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

    // 2. Ensure English columns exist on existing table
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS title_en TEXT;`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS category_en TEXT;`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS read_time_en TEXT;`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS date_en TEXT;`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS excerpt_en TEXT;`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS quote_en TEXT;`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS full_content_en JSONB DEFAULT '[]'::jsonb;`;
    await sql`ALTER TABLE articles ADD COLUMN IF NOT EXISTS key_takeaways_en JSONB DEFAULT '[]'::jsonb;`;

    // 3. Helper to authenticate
    const isAuth = (headerOrBodyPass?: string) => {
      const pass = headerOrBodyPass || req.headers['x-admin-password'];
      return pass === DEFAULT_ADMIN_PASS;
    };

    // --- GET: Fetch all articles ---
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
      return res.status(200).json(normalized);
    }

    // --- POST: Create new article ---
    if (req.method === 'POST') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { password, ...article } = body;
      
      if (!isAuth(password)) {
        return res.status(401).json({ error: 'Невалидна администраторска парола.' });
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

      return res.status(201).json({ success: true, article: { ...article, id } });
    }

    // --- PUT: Update existing article (or add translation) ---
    if (req.method === 'PUT') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
      const { password, ...article } = body;

      if (!isAuth(password)) {
        return res.status(401).json({ error: 'Невалидна администраторска парола.' });
      }

      if (!article.id) {
        return res.status(400).json({ error: 'Липсва ID на статията.' });
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

      return res.status(200).json({ success: true, article });
    }

    // --- DELETE: Delete article ---
    if (req.method === 'DELETE') {
      const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
      const idFromQuery = url.searchParams.get('id');
      const body = typeof req.body === 'string' ? (req.body ? JSON.parse(req.body) : {}) : (req.body || {});
      const articleId = idFromQuery || body?.id;
      const pass = req.headers['x-admin-password'] || body?.password;

      if (!isAuth(pass)) {
        return res.status(401).json({ error: 'Невалидна администраторска парола.' });
      }

      if (!articleId) {
        return res.status(400).json({ error: 'Липсва ID на статията за изтриване.' });
      }

      await sql`DELETE FROM articles WHERE id = ${articleId};`;
      return res.status(200).json({ success: true, message: 'Статията е изтрита успешно.' });
    }

    return res.status(405).json({ error: 'Неподдържан HTTP метод.' });
  } catch (err: any) {
    console.error('Neon API Serverless Error:', err);
    return res.status(500).json({ 
      error: 'Грешка при комуникация с базата данни.', 
      details: err?.message || String(err) 
    });
  }
}
