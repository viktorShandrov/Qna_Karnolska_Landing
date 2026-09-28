import { ArticleItem } from '../data/content';

export interface SeoConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  article?: ArticleItem;
}

const DEFAULT_SEO = {
  title: 'Яна Кърнолска | Психолог & Психотерапевт София – Подкрепа. Разбиране. Промяна.',
  description: 'Индивидуална терапия, терапия за двойки и онлайн консултации с Яна Кърнолска. Защитено пространство в София и онлайн за себепознание, преодоляване на тревожност, стрес и житейски кризи.',
  image: '/hero-portrait.jpg',
  type: 'website' as const,
};

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
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://qnakarnolskalanding.vercel.app';
  
  if (!config || !config.article) {
    // Default Homepage SEO
    const title = config?.title || DEFAULT_SEO.title;
    const description = config?.description || DEFAULT_SEO.description;
    const imgUrl = `${origin}${DEFAULT_SEO.image}`;
    const pageUrl = `${origin}/`;

    document.title = title;
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setCanonical(pageUrl);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', imgUrl);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', pageUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'website');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'bg_BG');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Яна Кърнолска – Психолог & Психотерапевт');

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
      name: 'Яна Кърнолска – Психолог и Психотерапевт',
      alternateName: 'Яна Кирилова Кърнолска',
      url: origin,
      image: `${origin}/hero-portrait.jpg`,
      logo: `${origin}/favicon.svg`,
      description: DEFAULT_SEO.description,
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
        name: 'Яна Кърнолска',
        jobTitle: 'Психолог и Психотерапевт',
        knowsAbout: [
          'Психология',
          'Психотерапия',
          'Индивидуална терапия',
          'Терапия за двойки',
          'Справяне с тревожност и паник атаки',
          'Преодоляване на бърнаут и стрес',
          'Онлайн психологическо консултиране',
        ],
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Психологически Услуги',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Индивидуална терапия',
              description: 'Лична работа, насочена към разбиране на себе си, тревожност, паник атаки и вътрешен баланс.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Терапия за двойки',
              description: 'Подобряване на комуникацията, възстановяване на близостта и доверието във връзката.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Онлайн консултации',
              description: 'Гъвкава терапевтична подкрепа за българи в чужбина и динамично ежедневие.',
            },
          },
        ],
      },
      sameAs: [
        'https://facebook.com',
        'https://instagram.com',
        'https://linkedin.com',
      ],
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
    const title = `${article.title} | Яна Кърнолска – Психолог`;
    const description = article.excerpt || (article.fullContent[0] ? article.fullContent[0].substring(0, 160) : DEFAULT_SEO.description);
    const imgUrl = article.image.startsWith('http') ? article.image : `${origin}${article.image.startsWith('/') ? '' : '/'}${article.image}`;
    const articleUrl = `${origin}/?article=${encodeURIComponent(article.id)}`;

    document.title = title;
    setMetaTag('meta[name="description"]', 'name', 'description', description);
    setCanonical(articleUrl);

    // Open Graph
    setMetaTag('meta[property="og:title"]', 'property', 'og:title', title);
    setMetaTag('meta[property="og:description"]', 'property', 'og:description', description);
    setMetaTag('meta[property="og:image"]', 'property', 'og:image', imgUrl);
    setMetaTag('meta[property="og:url"]', 'property', 'og:url', articleUrl);
    setMetaTag('meta[property="og:type"]', 'property', 'og:type', 'article');
    setMetaTag('meta[property="og:locale"]', 'property', 'og:locale', 'bg_BG');
    setMetaTag('meta[property="og:site_name"]', 'property', 'og:site_name', 'Яна Кърнолска – Психолог & Психотерапевт');

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
      inLanguage: 'bg-BG',
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': articleUrl,
      },
      articleSection: article.category,
      author: {
        '@type': 'Person',
        name: 'Яна Кърнолска',
        jobTitle: 'Психолог и Психотерапевт',
        url: `${origin}/#about`,
      },
      publisher: {
        '@type': 'Organization',
        name: 'Яна Кърнолска – Психологическо консултиране',
        url: origin,
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
