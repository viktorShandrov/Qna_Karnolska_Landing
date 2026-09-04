import { neon } from '@neondatabase/serverless';

const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASSWORD || 'yana2026';

function getDatabaseUrl(): string | undefined {
  return (
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_AUTHENTICATED_URL ||
    process.env.POSTGRES_PRISMA_URL
  );
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
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `;

    // 2. Check if table is empty and seed default articles if needed
    const countResult = await sql`SELECT COUNT(*)::int as count FROM articles;`;
    if (countResult[0]?.count === 0) {
      const seedArticles = [
        {
          id: "navigating-anxiety",
          title: "Пътят през тревожността: От съпротива към вътрешен мир",
          category: "Психотерапия & Спокойствие",
          read_time: "4 мин четене",
          date: "Септември 2026",
          excerpt: "Защо непрекъснатите опити за контрол хранят безпокойството и как осъзнатото приемане отваря врата към истинско облекчение.",
          image: "/Articles Images/pic1.jpeg",
          quote: "Тревожността не е признак за слабост или дефект. Тя е вътрешен сигнал, който ни кани да спрем и да се вслушаме в себе си.",
          full_content: JSON.stringify([
            "Всеки от нас се е сблъсквал с онова специфично стягане в гърдите, рояка от натрапчиви мисли за бъдещето и усещането, че губим почва под краката си. Тревожността в съвременния свят се е превърнала в почти постоянен спътник за мнозина.",
            "Често първата ни естествена реакция е съпротивата – опитваме се да 'изгоним' тревожните мисли, да се разсеем с работа или да наложим пълен контрол върху всяка житейска ситуация. Парадоксът обаче е, че колкото повече воюваме с тревожността, толкова по-голяма сила й придаваме.",
            "В терапевтичния процес ние се учим на коренно различен подход: да се отнесем с любопитство и доброжелателност към нашите телесни усещания. Когато си позволим да дишаме през дискомфорта, без да го съдим, тревожната вълна постепенно започва да спада.",
            "Истинската устойчивост не означава никога повече да не се тревожим, а да изградим доверие в собствената си способност да посрещнем неизвестното със спокойствие и яснота."
          ]),
          key_takeaways: JSON.stringify([
            "Разпознаване на телесните тригери още в самото начало",
            "Техники за заземяване (5-4-3-2-1) и диафрагмено дишане",
            "Прекъсване на автоматичния спираловиден вътрешен монолог",
            "Състрадание към себе си вместо самокритика"
          ])
        },
        {
          id: "boundaries-and-self-worth",
          title: "Граници и себеуважение: Как да казваме „не“ без вина",
          category: "Личностно развитие",
          read_time: "5 мин четене",
          date: "Август 2026",
          excerpt: "Изкуството да пазим собствената си жизнена енергия и душевен мир, без страх от отхвърляне или конфликт с околните.",
          image: "/Articles Images/pic2.jpeg",
          quote: "Поставянето на здравословни граници не е стена срещу света. То е врата с ясен ключ към взаимно уважение и автентичност.",
          full_content: JSON.stringify([
            "Колко често ви се случва да кажете 'да' на чужда молба, докато цялото ви същество вика 'не'? Зад този модел на поведение обикновено стои дълбоко вкоренен страх от неодобрение или убеждението, че нашата стойност зависи от това колко сме удобни за radiation.",
            "Личните граници са невидимата линия, която очертава къде свършвате вие и къде започва другият човек. Без тях ние бързо стигаме до емоционално изтощение, тиха обида и хронично разочарование.",
            "Да поставиш граница не означава да бъдеш агресивен или студен. Това е спокоен и зрял акт на себеуважение. Когато казвате 'не' на нещо, което ви натоварва, вие казвате 'да' на своето здраве, спокойствие и автентични приоритети.",
            "Хората, които истински ви ценят, ще уважат вашите граници. А онези, които се сърдят, най-често са имали изгода от липсата им."
          ]),
          key_takeaways: JSON.stringify([
            "Как да различим здравословния компромис от саможертвата",
            "Формулиране на ясни и добронамерени откази без оправдания",
            "Справяне с първоначалното чувство за вина",
            "Изграждане на стабилна вътрешна опора и самооценка"
          ])
        },
        {
          id: "overcoming-burnout",
          title: "Прегарянето (Бърнаут) в модерния ритъм: Сигнали и възстановяване",
          category: "Емоционален баланс",
          read_time: "6 мин четене",
          date: "Юли 2026",
          excerpt: "Кога умората спира да бъде просто физическа и се превръща в дълбок сигнал за необходимост от цялостно пренареждане на ежедневието.",
          image: "/Articles Images/pic3.jpeg",
          quote: "Възстановяването от прегаряне не е просто уикенд с повече сън, а смелостта да променим връзката със себе си и своите изисквания.",
          full_content: JSON.stringify([
            "Синдромът на прегаряне не се появява за една нощ. Той е бавен и постепенен процес, при който дългосрочният стрес изчерпва емоционалните, физическите и менталните ни ресурси.",
            "Често първите симптоми остават неразпознати: цинизъм, чувство на безсилие, намалена концентрация, безсъние и загуба на радост от неща, които преди са ни вдъхновявали. Опитите просто 'да стиснем зъби и да продължим' само задълбочават състоянието.",
            "Възстановяването изисква цялостен поглед върху живота: преоценка на вътрешния ни перфекционизъм, създаване на пространство за истинска почивка и въвеждане на малки ежедневни ритуали за грижа към себе си.",
            "В терапевтичната среда изследваме вярванията, които са ви довели до претоварването, и изграждаме устойчиви навици за устойчиво благополучие."
          ]),
          key_takeaways: JSON.stringify([
            "Разпознаване на 4-те фази на бърнаут преди критичната точка",
            "Разграничаване между пасивна почивка и истинско презареждане",
            "Работа с вътрешния критик и свръхотговорността",
            "Стратегии за възстановяване на житейската радост и фокус"
          ])
        }
      ];

      for (const item of seedArticles) {
        await sql`
          INSERT INTO articles (id, title, category, read_time, date, excerpt, image, quote, full_content, key_takeaways)
          VALUES (${item.id}, ${item.title}, ${item.category}, ${item.read_time}, ${item.date}, ${item.excerpt}, ${item.image}, ${item.quote}, ${item.full_content}::jsonb, ${item.key_takeaways}::jsonb)
          ON CONFLICT (id) DO NOTHING;
        `;
      }
    }

    // Helper to authenticate
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
          created_at as "createdAt"
        FROM articles
        ORDER BY created_at DESC;
      `;
      return res.status(200).json(rows);
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

      await sql`
        INSERT INTO articles (id, title, category, read_time, date, excerpt, image, quote, full_content, key_takeaways)
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
          ${keyTakeawaysJson}::jsonb
        );
      `;

      return res.status(201).json({ success: true, article: { ...article, id } });
    }

    // --- PUT: Update existing article ---
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
          key_takeaways = ${keyTakeawaysJson}::jsonb
        WHERE id = ${article.id};
      `;

      return res.status(200).json({ success: true, article });
    }

    // --- DELETE: Delete article ---
    if (req.method === 'DELETE') {
      const { id } = req.query || {};
      const body = typeof req.body === 'string' && req.body ? JSON.parse(req.body) : (req.body || {});
      const articleId = id || body.id;
      const password = body.password || req.headers['x-admin-password'];

      if (!isAuth(password)) {
        return res.status(401).json({ error: 'Невалидна администраторска парола.' });
      }

      if (!articleId) {
        return res.status(400).json({ error: 'Липсва ID на статията за изтриване.' });
      }

      await sql`
        DELETE FROM articles WHERE id = ${articleId};
      `;

      return res.status(200).json({ success: true, message: 'Статията е изтрита успешно.' });
    }

    return res.status(405).json({ error: 'Методът не се поддържа.' });
  } catch (error: any) {
    console.error('Neon DB Error:', error);
    return res.status(500).json({ error: error?.message || 'Грешка при комуникация с базата данни Neon.' });
  }
}
