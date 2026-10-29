import { ArticleItem, CONTACT_DATA } from '../data/content';
import { Language, translations } from '../i18n/translations';

export interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: ArticleItem;
  language?: Language;
}

function setMetaTag(selector: string, attrName: string, attrValue: string, content: string) {
  let el = document.querySelector(selector) as HTMLMetaElement | null;
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attrName, attrValue);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', 'canonical');
    document.head.appendChild(el);
  }
  el.setAttribute('href', url);
}

function setJsonLd(id: string, data: object) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(data, null, 2);
}

export function updatePageSeo(config?: SeoConfig) {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://yanapsychology.com';
  
  // Resolve current active language
  let lang: Language = config?.language || 'bg';
  if (!config?.language && typeof window !== 'undefined') {
    if (window.location.pathname.startsWith('/en')) {
      lang = 'en';
    } else if (window.location.pathname.startsWith('/bg')) {
      lang = 'bg';
    } else if (document.documentElement.lang === 'en') {
      lang = 'en';
    }
  }

  const langConfig = translations[lang].seo;

  if (!config || !config.article) {
    // Default Homepage SEO
    const title = config?.title || langConfig.defaultTitle;
    const description = config?.description || langConfig.defaultDescription;
    const imgUrl = `${origin}/hero-portrait.jpg`;
    const hasBgPrefix = typeof window !== 'undefined' && window.location.pathname.startsWith('/bg');
    const pathPrefix = lang === 'en' ? '/en/' : (hasBgPrefix ? '/bg/' : '/');
    const pageUrl = `${origin}${pathPrefix}`;

    document.title = title;
    document.documentElement.lang = lang;
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setCanonical(pageUrl);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', imgUrl);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', langConfig.locale);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', langConfig.siteName);

    // Twitter
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imgUrl);

    // Schema.org: Professional Psychologist / MedicalBusiness / LocalBusiness (E-E-A-T)
    const localBusinessSchema = {
      '@context': 'https://schema.org',
      '@type': ['Psychologist', 'LocalBusiness', 'ProfessionalService'],
      '@id': `${origin}/#psychologist`,
      name: lang === 'en' ? 'Yana Karnolska – Psychologist & Psychotherapist' : 'Яна Кърнолска – Психолог и Психотерапевт',
      alternateName: 'Yana Kirilova Karnolska',
      url: `${origin}/${lang}/`,
      image: `${origin}/hero-portrait.jpg`,
      logo: `${origin}/favicon.svg`,
      description: description,
      telephone: '+359887344424',
      email: 'yanakarnolska@gmail.com',
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'ул. Оборище 42',
        addressLocality: 'София',
        postalCode: '1504',
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 42.6953,
        longitude: 23.3421,
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '19:00',
        },
      ],
      founder: {
        '@type': 'Person',
        name: lang === 'en' ? 'Yana Karnolska' : 'Яна Кърнолска',
        jobTitle: lang === 'en' ? 'Psychologist & Psychotherapist' : 'Психолог и Психотерапевт',
        knowsAbout: [
          'Psychology',
          'Psychotherapy',
          'Individual therapy',
          'Couples therapy',
          'Anxiety and panic attack treatment',
          'Burnout recovery and stress management',
          'Online psychological counseling',
          'Sports psychology',
        ],
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: lang === 'en' ? 'Psychological Services' : 'Психологически Услуги',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: lang === 'en' ? 'Individual Therapy' : 'Индивидуална терапия',
              description: lang === 'en' ? 'One-on-one sessions for personal growth and emotional balance.' : 'Лична работа, насочена към разбиране на себе си, тревожност, паник атаки и вътрешен баланс.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: lang === 'en' ? 'Couples Therapy' : 'Терапия за двойки',
              description: lang === 'en' ? 'Improving communication, emotional intimacy, and trust in relationships.' : 'Подобряване на комуникацията, възстановяване на близостта и доверието във връзката.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: lang === 'en' ? 'Online Consultations' : 'Онлайн консултации',
              description: lang === 'en' ? 'Flexible therapeutic support worldwide.' : 'Гъвкава терапевтична подкрепа за българи в чужбина и динамично ежедневие.',
            },
          },
        ],
      },
      sameAs: CONTACT_DATA.socials.map((s) => s.href),
    };

    setJsonLd('schema-org-main', localBusinessSchema);
    
    // Remove article schema if present
    const articleScript = document.getElementById('schema-org-article');
    if (articleScript) {
      articleScript.remove();
    }
  } else {
    // Dynamic Article SEO
    const { article } = config;
    const title = `${article.title} | ${lang === 'en' ? 'Yana Karnolska – Psychologist' : 'Яна Кърнолска – Психолог'}`;
    const description = article.excerpt || (article.fullContent[0] ? article.fullContent[0].substring(0, 160) : langConfig.defaultDescription);
    const imgUrl = article.image.startsWith('http') ? article.image : `${origin}${article.image.startsWith('/') ? '' : '/'}${article.image}`;
    const hasBgPrefix = typeof window !== 'undefined' && window.location.pathname.startsWith('/bg');
    const pathPrefix = lang === 'en' ? '/en' : (hasBgPrefix ? '/bg' : '');
    const articleUrl = `${origin}${pathPrefix}/?article=${encodeURIComponent(article.id)}`;

    document.title = title;
    document.documentElement.lang = lang;
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setCanonical(articleUrl);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', imgUrl);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', articleUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'article');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', langConfig.locale);
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', langConfig.siteName);

    // Twitter
    setMetaTag('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image');
    setMetaTag('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMetaTag('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMetaTag('meta[name="twitter:image"]', 'name', 'twitter:image', imgUrl);

    // Schema.org: BlogPosting / Article (E-E-A-T Compliant)
    const articleSchema = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      '@id': `${articleUrl}#article`,
      headline: article.title,
      description: description,
      image: [imgUrl],
      datePublished: '2026-01-01T08:00:00+02:00',
      dateModified: '2026-09-27T12:00:00+02:00',
      inLanguage: lang === 'en' ? 'en-US' : 'bg-BG',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      articleSection: article.category,
      author: {
        '@type': 'Person',
        name: lang === 'en' ? 'Yana Karnolska' : 'Яна Кърнолска',
        jobTitle: lang === 'en' ? 'Psychologist & Psychotherapist' : 'Психолог и Психотерапевт',
        url: `${origin}/${lang}/#about`,
      },
      publisher: {
        '@type': 'Organization',
        name: lang === 'en' ? 'Yana Karnolska – Psychological Counseling' : 'Яна Кърнолска – Психологическо консултиране',
        url: `${origin}/${lang}/`,
        logo: {
          '@type': 'ImageObject',
          url: `${origin}/favicon.svg`,
        },
      },
      articleBody: article.fullContent.join('\n\n'),
    };

    setJsonLd('schema-org-article', articleSchema);
  }
}
