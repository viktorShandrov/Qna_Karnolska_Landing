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

const DEFAULT_FALLBACK_ARTICLES = [
  {
    id: "navigating-anxiety",
    title: "Пътят през тревожността: От съпротива към вътрешен мир",
    category: "Психотерапия & Спокойствие",
    readTime: "4 мин четене",
    date: "Септември 2026",
    excerpt: "Защо непрекъснатите опити за контрол хранят безпокойството и как осъзнатото приемане отваря врата към истинско облекчение.",
    image: "/Articles Images/pic1.jpeg",
    quote: "Тревожността не е признак за слабост или дефект. Тя е вътрешен сигнал, който ни кани да спрем и да се вслушаме в себе си.",
    fullContent: [
      "Всеки от нас се е сблъсквал с онова специфично стягане в гърдите, рояка от натрапчиви мисли за бъдещето и усещането, че губим почва под краката си. Тревожността в съвременния свят се е превърнала в почти постоянен спътник за мнозина.",
      "Често първата ни естествена реакция е съпротивата – опитваме се да „изгоним“ тревожните мисли, да се разсеем с работа или да наложим пълен контрол върху всяка житейска ситуация. Парадоксът обаче е, че колкото повече воюваме с тревожността, толкова по-голяма сила ѝ придаваме.",
      "В терапевтичния процес ние се учим на коренно различен подход: да се отнесем с любопитство и доброжелателност към нашите телесни усещания. Когато си позволим да дишаме през дискомфорта, без да го съдим, тревожната вълна постепенно започва да спада.",
      "Истинската устойчивост не означава никога повече да не се тревожим, а да изградим доверие в собствената си способност да посрещнем неизвестното със спокойствие и яснота."
    ],
    keyTakeaways: [
      "Разпознаване на телесните тригери още в самото начало",
      "Техники за заземяване (5-4-3-2-1) и диафрагмено дишане",
      "Прекъсване на автоматичния спираловиден вътрешен монолог",
      "Състрадание към себе си вместо самокритика"
    ],
    createdAt: "2026-09-01T08:00:00.000Z",
    titleEn: "Navigating Anxiety: From Resistance to Inner Peace",
    categoryEn: "Psychotherapy & Calm",
    readTimeEn: "4 min read",
    dateEn: "September 2026",
    excerptEn: "Why constant attempts to control fuel distress, and how mindful acceptance opens the door to genuine relief.",
    quoteEn: "Anxiety is not a sign of defect. It is an inner signal inviting us to pause and listen.",
    fullContentEn: [
      "We all know the tightness in the chest, the racing thoughts about the future, and the feeling of losing our footing. Anxiety has become a frequent companion for many.",
      "Our first instinct is often resistance: trying to expel distressing thoughts, drown them out with work, or force complete control over every situation. The paradox is that the harder we fight anxiety, the more fuel we give it.",
      "In therapy, we cultivate a fundamentally different approach: meeting our bodily sensations with curiosity and kindness. When we breathe through discomfort without judgment, the intensity gradually softens.",
      "True resilience is not the total absence of worry, but building deep trust in our ability to face the unknown with calm and clarity."
    ],
    keyTakeawaysEn: [
      "Recognizing bodily triggers early",
      "Grounding exercises (5-4-3-2-1) and diaphragmatic breathing",
      "Interrupting automatic spiraling inner dialogue",
      "Practicing self-compassion instead of harsh self-criticism"
    ]
  },
  {
    id: "boundaries-and-self-worth",
    title: "Граници и себеуважение: Как да казваме „не“ без вина",
    category: "Личностно развитие",
    readTime: "5 мин четене",
    date: "Август 2026",
    excerpt: "Изкуството да пазим собствената си жизнена енергия и душевен мир, без страх от отхвърляне или конфликт с околните.",
    image: "/Articles Images/pic2.jpeg",
    quote: "Поставянето на здравословни граници не е стена срещу света. То е врата с ясен ключ към взаимно уважение и автентичност.",
    fullContent: [
      "Колко често ви се случва да кажете „да“ на чужда молба, докато цялото ви същество вика „не“? Зад този модел на поведение обикновено стои дълбоко вкоренен страх от неодобрение или убеждението, че нашата стойност зависи от това колко сме удобни за другите.",
      "Личните граници са невидимата линия, която очертава къде свършвате вие и къде започва другият човек. Без тях ние бързо стигаме до емоционално изтощение, тиха обида и хронично разочарование.",
      "Да поставиш граница не означава да бъдеш агресивен или студен. Това е спокоен и зрял акт на себеуважение. Когато казвате „не“ на нещо, което ви натоварва, вие казвате „да“ на своето здраве, спокойствие и автентични приоритети.",
      "Хората, които истински ви ценят, ще уважат вашите граници. А онези, които се сърдят, най-често са имали изгода от липсата им."
    ],
    keyTakeaways: [
      "Как да различим здравословния компромис от саможертвата",
      "Формулиране на ясни и добронамерени откази без оправдания",
      "Справяне с първоначалното чувство за вина",
      "Изграждане на стабилна вътрешна опора и самооценка"
    ],
    createdAt: "2026-08-01T08:00:00.000Z",
    titleEn: "Boundaries and Self-Worth: Saying 'No' Without Guilt",
    categoryEn: "Personal Growth",
    readTimeEn: "5 min read",
    dateEn: "August 2026",
    excerptEn: "The subtle art of preserving your vital energy and peace of mind without fear of rejection or confrontation.",
    quoteEn: "Setting healthy boundaries is not building a wall. It is creating a doorway with clear keys of mutual respect.",
    fullContentEn: [
      "How often do you say 'yes' to someone else while your whole body screams 'no'? Behind this pattern usually lies a deep fear of rejection or the belief that our value depends on pleasing others.",
      "Personal boundaries define where you end and others begin. Without them, emotional exhaustion and quiet resentment quickly take over.",
      "Setting a boundary is neither aggressive nor cold. It is a calm, grounded act of self-respect. Saying 'no' to overextension is saying 'yes' to your well-being.",
      "Those who truly care about you will respect your boundaries; those who react with anger often benefited from your lack of them."
    ],
    keyTakeawaysEn: [
      "Distinguishing healthy compromise from self-sacrifice",
      "Formulating clear, kind refusals without over-explaining",
      "Working through initial waves of guilt",
      "Building a solid internal sense of self-worth"
    ]
  },
  {
    id: "overcoming-burnout",
    title: "Прегарянето (Бърнаут) в модерния ритъм: Сигнали и възстановяване",
    category: "Емоционален баланс",
    readTime: "6 мин четене",
    date: "Юли 2026",
    excerpt: "Кога умората спира да бъде просто физическа и се превръща в дълбок сигнал за необходимост от цялостно пренареждане на ежедневието.",
    image: "/Articles Images/pic3.jpeg",
    quote: "Възстановяването от прегаряне не е просто уикенд с повече сън, а смелостта да променим връзката със себе си и своите изисквания.",
    fullContent: [
      "Синдромът на прегаряне не се появява за една нощ. Той е бавен и постепенен процес, при който дългосрочният стрес изчерпва емоционалните, физическите и менталните ни ресурси.",
      "Често първите симптоми остават неразпознати: цинизъм, чувство на безсилие, намалена концентрация, безсъние и загуба на радост от неща, които преди са ни вдъхновявали. Опитите просто „да стиснем зъби и да продължим“ само задълбочават състоянието.",
      "Възстановяването изисква цялостен поглед върху живота: преоценка на вътрешния ни перфекционизъм, създаване на пространство за истинска почивка и въвеждане на малки ежедневни ритуали за грижа към себе си.",
      "В терапевтичната среда изследваме вярванията, които са ви довели до претоварването, и изграждаме здравословни навици за устойчиво благополучие."
    ],
    keyTakeaways: [
      "Разпознаване на 4-те фази на бърнаут преди критичната точка",
      "Разграничаване между пасивна почивка и истинско презареждане",
      "Работа с вътрешния критик и свръхотговорността",
      "Стратегии за възстановяване на житейската радост и фокус"
    ],
    createdAt: "2026-07-01T08:00:00.000Z",
    titleEn: "Burnout in Fast-Paced Life: Warning Signs and Recovery",
    categoryEn: "Emotional Balance",
    readTimeEn: "6 min read",
    dateEn: "July 2026",
    excerptEn: "When fatigue goes beyond the physical and signals an urgent need to re-align daily living and expectations.",
    quoteEn: "Recovering from burnout is not just an extra weekend of sleep. It is the courage to reshape your inner expectations.",
    fullContentEn: [
      "Burnout does not occur overnight. It is a slow, cumulative exhaustion of mental, physical, and emotional reserves under prolonged strain.",
      "Early warning signs often go unheeded: emotional cynicism, detached frustration, sleep fragmentation, and loss of joy in once loved activities.",
      "Recovery requires stepping back to examine inner perfectionism, learning what restorative rest looks like, and introducing sustainable self-care routines.",
      "Through therapeutic support, we unpack the beliefs that drove the overload and build habits for long-term psychological equilibrium."
    ],
    keyTakeawaysEn: [
      "Recognizing the 4 phases of burnout early",
      "Distinguishing passive screen-scrolling from authentic restorative rest",
      "Taming inner self-criticism and over-responsibility",
      "Practical strategies to restore joy and mental clarity"
    ]
  }
];

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

  let requestedArticleId: string | null = null;
  if (req.query?.id) {
    requestedArticleId = String(req.query.id);
  } else if (req.url) {
    try {
      const parsedUrl = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      requestedArticleId = parsedUrl.searchParams.get('id');
    } catch {
      // ignore
    }
  }

  try {
    // Helper to authenticate
    const isAuth = (headerOrBodyPass?: string) => {
      const pass = headerOrBodyPass || (req.headers && req.headers['x-admin-password']);
      return pass === DEFAULT_ADMIN_PASS;
    };

    // --- GET: Fetch articles ---
    if (req.method === 'GET') {
      const articleId = requestedArticleId;

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

    // If GET request fails (e.g. Neon quota exceeded or DB offline):
    // Return default articles with 200 OK and CDN Cache-Control headers.
    // This allows Vercel / Cloudflare to cache the response for 24h, stopping the barrage on Neon!
    if (req.method === 'GET') {
      if (requestedArticleId) {
        const found = DEFAULT_FALLBACK_ARTICLES.find((a) => a.id === requestedArticleId);
        if (found) {
          return respondJson(found, 200, true);
        }
      } else {
        const summaries = DEFAULT_FALLBACK_ARTICLES.map((a) => ({
          id: a.id,
          title: a.title,
          category: a.category,
          readTime: a.readTime,
          date: a.date,
          excerpt: a.excerpt,
          image: a.image,
          createdAt: a.createdAt || '2026-09-01T08:00:00.000Z',
          titleEn: a.titleEn,
          categoryEn: a.categoryEn,
          readTimeEn: a.readTimeEn,
          dateEn: a.dateEn,
          excerptEn: a.excerptEn,
        }));
        return respondJson(summaries, 200, true);
      }
    }

    return respondJson({ 
      error: 'Грешка при комуникация с базата данни.', 
      details: err?.message || String(err) 
    }, 500, false);
  }
}
