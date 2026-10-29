export type Language = 'bg' | 'en';

export interface ServiceTranslation {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  duration: string;
  suitableFor: string[];
}

export interface ApproachTranslation {
  id: string;
  title: string;
  description: string;
  iconName: 'heart' | 'leaf' | 'shield';
}

export interface TestimonialTranslation {
  id: string;
  quote: string;
  author: string;
  details?: string;
}

export interface ArticleTranslation {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  image: string;
  quote?: string;
  fullContent: string[];
  keyTakeaways?: string[];
}

export interface Translations {
  nav: {
    home: string;
    services: string;
    about: string;
    articles: string;
    approach: string;
    testimonials: string;
    contact: string;
    bookSession: string;
    menuLabel: string;
  };
  hero: {
    name: string;
    title: string;
    slogan: string;
    description: string;
    descriptionLines: string[];
    ctaButton: string;
    imageAlt: string;
  };
  services: {
    sectionTitle: string;
    learnMore: string;
    items: ServiceTranslation[];
  };
  about: {
    sectionTitle: string;
    paragraphs: string[];
    extendedBio: string;
    credentials: string[];
    ctaButtonMore: string;
    ctaButtonLess: string;
    imageAlt: string;
  };
  approach: {
    sectionTitle: string;
    items: ApproachTranslation[];
  };
  testimonials: {
    sectionTitle: string;
    items: TestimonialTranslation[];
  };
  articles: {
    badge: string;
    sectionTitle: string;
    subtitle: string;
    leadDescription: string;
    readArticle: string;
    bottomNote: string;
    items: ArticleTranslation[];
  };
  footer: {
    followMe: string;
    copyright: string;
    privacyPolicy: string;
    adminLogin: string;
    adminTitle: string;
  };
  bookingModal: {
    title: string;
    subtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    serviceLabel: string;
    dateLabel: string;
    timeSlotLabel: string;
    timeSlots: {
      morning: string;
      afternoon: string;
      evening: string;
    };
    notesLabel: string;
    notesPlaceholder: string;
    submitButton: string;
    submitting: string;
    closeLabel: string;
    validation: {
      nameRequired: string;
      nameMin: string;
      phoneRequired: string;
      phoneInvalid: string;
      emailRequired: string;
      emailInvalid: string;
      dateRequired: string;
      datePast: string;
      generalError: string;
    };
    success: {
      title: string;
      message: string;
      closeNote: string;
    };
  };
  serviceModal: {
    badge: string;
    suitableForTitle: string;
    durationLabel: string;
    bookButton: string;
    closeLabel: string;
  };
  articleModal: {
    closeLabel: string;
    authorAttribution: string;
    keyTakeawaysTitle: string;
    ctaHeading: string;
    ctaDescription: string;
    ctaButton: string;
  };
  seo: {
    defaultTitle: string;
    defaultDescription: string;
    locale: string;
    siteName: string;
  };
  floatingButton: string;
}

export const translations: Record<Language, Translations> = {
  bg: {
    nav: {
      home: 'НАЧАЛО',
      services: 'УСЛУГИ',
      about: 'ЗА МЕН',
      articles: 'СТАТИИ',
      approach: 'ПОДХОД',
      testimonials: 'ОТЗИВИ',
      contact: 'КОНТАКТИ',
      bookSession: 'ЗАПАЗИ ЧАС',
      menuLabel: 'Меню',
    },
    hero: {
      name: 'Яна Кърнолска',
      title: 'ПСИХОЛОГ',
      slogan: 'Подкрепа. Разбиране. Промяна.',
      description: 'Тук ще намерите пространство, в което да бъдете чути, разбрани и приети такива, каквито сте.',
      descriptionLines: [
        'Тук ще намерите пространство,',
        'в което да бъдете чути, разбрани и',
        'приети такива, каквито сте.',
      ],
      ctaButton: 'ЗАПАЗИ ЧАС',
      imageAlt: 'Яна Кърнолска – Психолог и Психотерапевт София',
    },
    services: {
      sectionTitle: 'УСЛУГИ',
      learnMore: 'НАУЧИ ПОВЕЧЕ',
      items: [
        {
          id: 'individual',
          title: 'ИНДИВИДУАЛНА ТЕРАПИЯ',
          subtitle: 'Лично пространство за растеж и спокойствие',
          image: '/service-individual.png',
          shortDescription: 'Лична работа, насочена към разбиране на себе си, преодоляване на трудности и постигане на вътрешен баланс.',
          fullDescription: 'Индивидуалната психотерапия предоставя защитено и конфиденциално пространство за изследване на вашите мисли, емоции и житейски предизвикателства. Заедно ще открием първопричините за тревожност, стрес, прегаряне (бърнаут) или чувство на неудовлетвореност, за да изградим трайни стратегии за вътрешен мир и увереност.',
          duration: '50 минути',
          suitableFor: [
            'Тревожност, паник атаки и постоянен стрес',
            'Депресивни състояния и липса на мотивация',
            'Трудности в самооценката и поставянето на лични граници',
            'Преминаване през житейски кризи и загуби'
          ]
        },
        {
          id: 'couples',
          title: 'ТЕРАПИЯ ЗА ДВОЙКИ',
          subtitle: 'Възстановяване на близостта и доверието',
          image: '/service-couples.png',
          shortDescription: 'Подобряване на комуникацията, разбиране и изграждане на по-здрава и пълноценна връзка.',
          fullDescription: 'Всяка връзка преминава през периоди на неразбиране, отчуждение или конфликти. Терапията за двойки е възможност да погледнете отвъд споровете, да чуете истинските потребности на партньора си и да възстановите емоционалната интимност, уважение и взаимна подкрепа.',
          duration: '75 минути',
          suitableFor: [
            'Хронични конфликти и нарушена комуникация',
            'Преодоляване на криза на доверието и изневяра',
            'Емоционално отчуждение и дистанцираност',
            'Напасване при нови житейски етапи (брак, родителство)'
          ]
        },
        {
          id: 'online',
          title: 'ОНЛАЙН КОНСУЛТАЦИИ',
          subtitle: 'Гъвкава терапия без географски граници',
          image: '/service-online.png',
          shortDescription: 'Удобна и сигурна възможност за терапевтична подкрепа от комфорта на вашия дом.',
          fullDescription: 'Онлайн сесиите предлагат същата дълбочина, професионализъм и конфиденциалност както присъствените срещи, спестявайки време за пътуване. Идеално решение за българи в чужбина, хора с натоварен график или живеещи извън столицата.',
          duration: '50 минути',
          suitableFor: [
            'Живеещи и работещи в чужбина (на български език)',
            'Хора с динамичен график или чести пътувания',
            'Нужда от подкрепа без физическо присъствие в кабинета',
            'Всички видове индивидуални консултации'
          ]
        }
      ]
    },
    about: {
      sectionTitle: 'ЗА МЕН',
      paragraphs: [
        'Казвам се Яна Кърнолска и съм психолог с мисията да помагам на хората да опознаят себе си, да преодолеят вътрешните си бариери и да живеят по-пълноценен и осъзнат живот.',
        'Вярвам, че всеки човек носи отговорите в себе си – понякога имаме нужда само от подкрепа, за да ги открием.'
      ],
      extendedBio: 'С над 8 години професионален опит в индивидуалното и семейно консултиране, моята практика съчетава хуманистичен подход, когнитивно-поведенчески техники и фокус върху ресурсите на личността. Като естествено продължение на моето образование и професионално развитие, в момента стартирам надграждаща специализация в областта на Спортната психология – насочена към ментална устойчивост, мотивация, самоконтрол и преодоляване на вътрешните бариери при високи натоварвания. Кабинетът ми е защитено пространство за доверие, приемане и съзидателна промяна.',
      credentials: [
        'Магистър по Психология',
        'Сертифициран психотерапевт',
        'Продължаващо образование: Спортна психология'
      ],
      ctaButtonMore: 'ПОВЕЧЕ ЗА МЕН',
      ctaButtonLess: 'ПО-МАЛКО',
      imageAlt: 'Терапевтичен кабинет Яна Кърнолска',
    },
    approach: {
      sectionTitle: 'МОЯТ ПОДХОД',
      items: [
        {
          id: 'empathy',
          title: 'ЕМПАТИЯ',
          description: 'Създавам безопасна и подкрепяща среда, в която можете да бъдете истински и свободни.',
          iconName: 'heart'
        },
        {
          id: 'individual-approach',
          title: 'ИНДИВИДУАЛЕН ПОДХОД',
          description: 'Всеки човек е уникален и терапията се адаптира към вашите нужди и цели.',
          iconName: 'leaf'
        },
        {
          id: 'confidentiality',
          title: 'КОНФИДЕНЦИАЛНОСТ',
          description: 'Вашата история остава между нас – с уважение, етика и професионализъм.',
          iconName: 'shield'
        }
      ]
    },
    testimonials: {
      sectionTitle: 'КАКВО СПОДЕЛЯТ МОИТЕ КЛИЕНТИ',
      items: [
        {
          id: '1',
          quote: 'Терапията с Яна ми помогна да се върна към себе си и да намеря вътрешен мир. Благодарна съм за подкрепата и разбирането.',
          author: '– М.',
          details: 'Индивидуална терапия'
        },
        {
          id: '2',
          quote: 'Професионализъм, топлота и истинско желание да помогне. Препоръчвам с две ръце.',
          author: '– К.',
          details: 'Онлайн консултации'
        },
        {
          id: '3',
          quote: 'Сесиите с Яна са като разговор с приятел, който те разбира без думи. Това ми дава сила.',
          author: '– Д.',
          details: 'Терапия за двойки'
        }
      ]
    },
    articles: {
      badge: 'ПОРТАЛ КЪМ ПОЗНАНИЕТО',
      sectionTitle: 'СТАТИИ',
      subtitle: 'размисли и анализи',
      leadDescription: 'Потопете се в размисли, психологически анализи и практически насоки за вътрешна хармония и себепознание.',
      readArticle: 'Прочети статията',
      bottomNote: 'Всяка статия е покана за вътрешен диалог, по-дълбоко себепознание и осъзнати решения.',
      items: [
        {
          id: 'navigating-anxiety',
          title: 'Пътят през тревожността: От съпротива към вътрешен мир',
          category: 'Психотерапия & Спокойствие',
          readTime: '4 мин четене',
          date: 'Септември 2026',
          excerpt: 'Защо непрекъснатите опити за контрол хранят безпокойството и как осъзнатото приемане отваря врата към истинско облекчение.',
          image: '/Articles Images/pic1.jpeg',
          quote: 'Тревожността не е признак за слабост или дефект. Тя е вътрешен сигнал, който ни кани да спрем и да се вслушаме в себе си.',
          fullContent: [
            'Всеки от нас се е сблъсквал с онова специфично стягане в гърдите, рояка от натрапчиви мисли за бъдещето и усещането, че губим почва под краката си. Тревожността в съвременния свят се е превърнала в почти постоянен спътник за мнозина.',
            'Често първата ни естествена реакция е съпротивата – опитваме се да „изгоним“ тревожните мисли, да се разсеем с работа или да наложим пълен контрол върху всяка житейска ситуация. Парадоксът обаче е, че колкото повече воюваме с тревожността, толкова по-голяма сила ѝ придаваме.',
            'В терапевтичния процес ние се учим на коренно различен подход: да се отнесем с любопитство и доброжелателност към нашите телесни усещания. Когато си позволим да дишаме през дискомфорта, без да го съдим, тревожната вълна постепенно започва да спада.',
            'Истинската устойчивост не означава никога повече да не се тревожим, а да изградим доверие в собствената си способност да посрещнем неизвестното със спокойствие и яснота.'
          ],
          keyTakeaways: [
            'Разпознаване на телесните тригери още в самото начало',
            'Техники за заземяване (5-4-3-2-1) и диафрагмено дишане',
            'Прекъсване на автоматичния спираловиден вътрешен монолог',
            'Състрадание към себе си вместо самокритика'
          ]
        },
        {
          id: 'boundaries-and-self-worth',
          title: 'Граници и себеуважение: Как да казваме „не“ без вина',
          category: 'Личностно развитие',
          readTime: '5 мин четене',
          date: 'Август 2026',
          excerpt: 'Изкуството да пазим собствената си жизнена енергия и душевен мир, без страх от отхвърляне или конфликт с околните.',
          image: '/Articles Images/pic2.jpeg',
          quote: 'Поставянето на здравословни граници не е стена срещу света. То е врата с ясен ключ към взаимно уважение и автентичност.',
          fullContent: [
            'Колко често ви се случва да кажете „да“ на чужда молба, докато цялото ви същество вика „не“? Зад този модел на поведение обикновено стои дълбоко вкоренен страх от неодобрение или убеждението, че нашата стойност зависи от това колко сме удобни за другите.',
            'Личните граници са невидимата линия, която очертава къде свършвате вие и къде започва другият човек. Без тях ние бързо стигаме до емоционално изтощение, тиха обида и хронично разочарование.',
            'Да поставиш граница не означава да бъдеш агресивен или студен. Това е спокоен и зрял акт на себеуважение. Когато казвате „не“ на нещо, което ви натоварва, вие казвате „да“ на своето здраве, спокойствие и автентични приоритети.',
            'Хората, които истински ви ценят, ще уважат вашите граници. А онези, които се сърдят, най-често са имали изгода от липсата им.'
          ],
          keyTakeaways: [
            'Как да различим здравословния компромис от саможертвата',
            'Формулиране на ясни и добронамерени откази без оправдания',
            'Справяне с първоначалното чувство за вина',
            'Изграждане на стабилна вътрешна опора и самооценка'
          ]
        },
        {
          id: 'overcoming-burnout',
          title: 'Прегарянето (Бърнаут) в модерния ритъм: Сигнали и възстановяване',
          category: 'Емоционален баланс',
          readTime: '6 мин четене',
          date: 'Юли 2026',
          excerpt: 'Кога умората спира да бъде просто физическа и се превръща в дълбок сигнал за необходимост от цялостно пренареждане на ежедневието.',
          image: '/Articles Images/pic3.jpeg',
          quote: 'Възстановяването от прегаряне не е просто уикенд с повече сън, а смелостта да променим връзката със себе си и своите изисквания.',
          fullContent: [
            'Синдромът на прегаряне не се появява за една нощ. Той е бавен и постепенен процес, при който дългосрочният стрес изчерпва емоционалните, физическите и менталните ни ресурси.',
            'Често първите симптоми остават неразпознати: цинизъм, чувство на безсилие, намалена концентрация, безсъние и загуба на радост от неща, които преди са ни вдъхновявали. Опитите просто „да стиснем зъби и да продължим“ само задълбочават състоянието.',
            'Възстановяването изисква цялостен поглед върху живота: преоценка на вътрешния ни перфекционизъм, създаване на пространство за истинска почивка и въвеждане на малки ежедневни ритуали за грижа към себе си.',
            'В терапевтичната среда изследваме вярванията, които са ви довели до претоварването, и изграждаме здравословни навици за устойчиво благополучие.'
          ],
          keyTakeaways: [
            'Разпознаване на 4-те фази на бърнаут преди критичната точка',
            'Разграничаване между пасивна почивка и истинско презареждане',
            'Работа с вътрешния критик и свръхотговорността',
            'Стратегии за възстановяване на житейската радост и фокус'
          ]
        }
      ]
    },
    footer: {
      followMe: 'ПОСЛЕДВАЙ МЕ',
      copyright: '© 2026 Яна Кърнолска – Психолог. Всички права запазени.',
      privacyPolicy: 'Политика за поверителност',
      adminLogin: 'Вход за психолога',
      adminTitle: 'Вход за управление на статии',
    },
    bookingModal: {
      title: 'Запази час за консултация',
      subtitle: 'Изберете удобна дата и форма на психологическа подкрепа',
      nameLabel: 'Име и фамилия',
      namePlaceholder: 'Иван Иванов',
      phoneLabel: 'Телефон за връзка',
      phonePlaceholder: '088 123 4567',
      emailLabel: 'Имейл адрес',
      emailPlaceholder: 'ivan@example.com',
      serviceLabel: 'Избор на терапевтична услуга',
      dateLabel: 'Предпочитана дата',
      timeSlotLabel: 'Предпочитан часови диапазон',
      timeSlots: {
        morning: 'Сутрин (09:00 – 12:00)',
        afternoon: 'Обяд / Следобед (12:00 – 16:00)',
        evening: 'Късен следобед (16:00 – 19:00)'
      },
      notesLabel: 'Споделете накратко по каква тема бихте искали да работим (по желание)',
      notesPlaceholder: 'Например: тревожност на работното място, лични взаимоотношения, търсене на посока...',
      submitButton: 'Потвърди и изпрати запитване',
      submitting: 'Изпращане...',
      closeLabel: 'Затвори',
      validation: {
        nameRequired: 'Моля, въведете вашето име и фамилия.',
        nameMin: 'Името трябва да съдържа поне 2 символа.',
        phoneRequired: 'Моля, въведете телефон за обратна връзка.',
        phoneInvalid: 'Моля, въведете коректен телефонен номер (поне 7 цифри).',
        emailRequired: 'Моля, въведете вашия имейл адрес.',
        emailInvalid: 'Моля, въведете валиден формат за имейл (напр. име@domain.bg).',
        dateRequired: 'Моля, посочете предпочитана дата за срещата.',
        datePast: 'Моля, посочете днешна или бъдеща дата.',
        generalError: 'Възникна непредвидена грешка при изпращането. Моля, опитайте отново или се свържете по телефон.'
      },
      success: {
        title: 'Запитването е изпратено успешно!',
        message: 'Благодаря ви за доверието. Ще се свържа с вас възможно най-скоро за потвърждение на часа.',
        closeNote: 'Този прозорец ще се затвори автоматично след няколко секунди...'
      }
    },
    serviceModal: {
      badge: 'УСЛУГА',
      suitableForTitle: 'Подходяща при:',
      durationLabel: 'Продължителност на сесията:',
      bookButton: 'ЗАПАЗИ ЧАС ЗА ТАЗИ УСЛУГА',
      closeLabel: 'Затвори',
    },
    articleModal: {
      closeLabel: 'Затвори',
      authorAttribution: '– Яна Кърнолска, психолог',
      keyTakeawaysTitle: 'Практически насоки & ключови изводи:',
      ctaHeading: 'Имате ли нужда от лична подкрепа?',
      ctaDescription: 'Ако темите в тази статия резонират с вашата лична житейска ситуация, можете да запазите час за индивидуална консултация.',
      ctaButton: 'Запази час за консултация',
    },
    seo: {
      defaultTitle: 'Яна Кърнолска | Психолог & Психотерапевт София – Подкрепа. Разбиране. Промяна.',
      defaultDescription: 'Индивидуална терапия, терапия за двойки и онлайн консултации с Яна Кърнолска. Защитено пространство в София и онлайн за себепознание, преодоляване на тревожност, стрес и житейски кризи.',
      locale: 'bg_BG',
      siteName: 'Яна Кърнолска – Психолог & Психотерапевт',
    },
    floatingButton: 'Запази час',
  },
  en: {
    nav: {
      home: 'HOME',
      services: 'SERVICES',
      about: 'ABOUT',
      articles: 'ARTICLES',
      approach: 'APPROACH',
      testimonials: 'REVIEWS',
      contact: 'CONTACT',
      bookSession: 'BOOK A SESSION',
      menuLabel: 'Menu',
    },
    hero: {
      name: 'Yana Karnolska',
      title: 'PSYCHOLOGIST',
      slogan: 'Support. Understanding. Transformation.',
      description: 'Here you will find a safe space to be heard, understood, and accepted just as you are.',
      descriptionLines: [
        'Here you will find a safe space',
        'to be heard, understood, and',
        'accepted just as you are.',
      ],
      ctaButton: 'BOOK A SESSION',
      imageAlt: 'Yana Karnolska – Psychologist & Psychotherapist Sofia',
    },
    services: {
      sectionTitle: 'SERVICES',
      learnMore: 'LEARN MORE',
      items: [
        {
          id: 'individual',
          title: 'INDIVIDUAL THERAPY',
          subtitle: 'Personal space for growth and inner balance',
          image: '/service-individual.png',
          shortDescription: 'One-on-one sessions focused on self-discovery, overcoming challenges, and restoring inner peace.',
          fullDescription: 'Individual psychotherapy provides a safe, confidential space to explore your thoughts, emotions, and life challenges. Together we uncover the root causes of anxiety, chronic stress, burnout, or feelings of unfulfillment, building sustainable strategies for inner peace and confidence.',
          duration: '50 minutes',
          suitableFor: [
            'Anxiety, panic attacks, and chronic stress',
            'Depression, low energy, and lack of motivation',
            'Self-esteem and healthy boundary-setting',
            'Navigating life transitions, grief, and loss'
          ]
        },
        {
          id: 'couples',
          title: 'COUPLES THERAPY',
          subtitle: 'Restoring intimacy and mutual trust',
          image: '/service-couples.png',
          shortDescription: 'Improving communication, understanding emotional needs, and cultivating a healthier bond.',
          fullDescription: 'Every relationship encounters seasons of misunderstanding, distance, or recurring conflicts. Couples therapy offers an opportunity to look beyond arguments, hear your partner’s true needs, and rebuild emotional intimacy, mutual respect, and genuine connection.',
          duration: '75 minutes',
          suitableFor: [
            'Chronic conflicts and communication breakdown',
            'Rebuilding trust following infidelity or crises',
            'Emotional detachment and feeling disconnected',
            'Adapting to major transitions (marriage, parenthood)'
          ]
        },
        {
          id: 'online',
          title: 'ONLINE CONSULTATIONS',
          subtitle: 'Flexible psychological support worldwide',
          image: '/service-online.png',
          shortDescription: 'Convenient and confidential therapeutic support from the comfort of your home.',
          fullDescription: 'Online sessions offer the exact same depth, professionalism, and confidentiality as in-person therapy while saving travel time. Ideal for expatriates, busy professionals, or individuals living outside the capital.',
          duration: '50 minutes',
          suitableFor: [
            'Living or working abroad (in Bulgarian or English)',
            'Dynamic schedules and frequent travel',
            'Seeking psychological care from any location',
            'All individual counseling formats'
          ]
        }
      ]
    },
    about: {
      sectionTitle: 'ABOUT ME',
      paragraphs: [
        'My name is Yana Karnolska, and I am a psychologist dedicated to helping individuals discover themselves, overcome internal hurdles, and live a more conscious, fulfilled life.',
        'I believe every person holds the answers within – sometimes we just need the right guidance and encouragement to reveal them.'
      ],
      extendedBio: 'With over 8 years of professional experience in individual and family counseling, my practice integrates humanistic psychology, cognitive-behavioral principles, and a strengths-based perspective on the human psyche. As a natural evolution of my professional journey, I am also completing advanced specialization in Sports Psychology – centered on mental resilience, motivation, emotional regulation, and breaking through internal barriers under high pressure. My consulting room is a protected space of trust, acceptance, and constructive transformation.',
      credentials: [
        'Master’s Degree in Clinical Psychology',
        'Certified Psychotherapist',
        'Continuing Specialization: Sports Psychology'
      ],
      ctaButtonMore: 'MORE ABOUT ME',
      ctaButtonLess: 'LESS',
      imageAlt: 'Therapy Room Yana Karnolska',
    },
    approach: {
      sectionTitle: 'MY APPROACH',
      items: [
        {
          id: 'empathy',
          title: 'EMPATHY',
          description: 'I foster a safe and welcoming space where you can be authentic and free.',
          iconName: 'heart'
        },
        {
          id: 'individual-approach',
          title: 'INDIVIDUAL APPROACH',
          description: 'Every person is unique, and therapy is adapted to your specific goals and rhythm.',
          iconName: 'leaf'
        },
        {
          id: 'confidentiality',
          title: 'CONFIDENTIALITY',
          description: 'Your story is held in complete confidence – with ethics, respect, and discretion.',
          iconName: 'shield'
        }
      ]
    },
    testimonials: {
      sectionTitle: 'WHAT MY CLIENTS SAY',
      items: [
        {
          id: '1',
          quote: 'Therapy with Yana helped me reconnect with myself and find genuine inner peace. I am deeply grateful for her support and empathy.',
          author: '– M.',
          details: 'Individual Therapy'
        },
        {
          id: '2',
          quote: 'Warmth, profound professionalism, and a true commitment to helping. I wholeheartedly recommend her practice.',
          author: '– K.',
          details: 'Online Consultations'
        },
        {
          id: '3',
          quote: 'Sessions with Yana feel like speaking with someone who understands you without judgment. It gave me real strength.',
          author: '– D.',
          details: 'Couples Therapy'
        }
      ]
    },
    articles: {
      badge: 'PORTAL TO KNOWLEDGE',
      sectionTitle: 'ARTICLES',
      subtitle: 'insights and reflections',
      leadDescription: 'Explore reflections, psychological analyses, and practical guidance for emotional wellbeing and self-awareness.',
      readArticle: 'Read article',
      bottomNote: 'Every article is an open invitation for self-reflection, clarity, and intentional living.',
      items: [
        {
          id: 'navigating-anxiety',
          title: 'Navigating Anxiety: From Resistance to Inner Calm',
          category: 'Psychotherapy & Calm',
          readTime: '4 min read',
          date: 'September 2026',
          excerpt: 'Why continuous attempts to control every outcome fuel anxiety, and how mindful acceptance opens the door to genuine relief.',
          image: '/Articles Images/pic1.jpeg',
          quote: 'Anxiety is not a defect or a sign of weakness. It is an internal signal inviting us to pause and listen to ourselves.',
          fullContent: [
            'Most of us know the familiar tightness in the chest, the relentless spiral of future worries, and the sensation of losing our footing. In today’s fast-paced world, anxiety has become a near-constant companion for many.',
            'Often our instinctive reaction is resistance – attempting to push anxious thoughts away, burying ourselves in work, or obsessively trying to control every variable. The paradox is that the harder we fight anxiety, the more fuel we give it.',
            'In therapy, we cultivate a fundamentally different stance: turning toward bodily sensations with curiosity and gentle presence. When we allow ourselves to breathe through discomfort without judgment, the surge of anxiety naturally recedes.',
            'True resilience is not about never experiencing anxiety again, but about trusting our ability to meet the unknown with presence, clarity, and self-compassion.'
          ],
          keyTakeaways: [
            'Recognizing early physiological triggers before escalation',
            'Grounding practices (5-4-3-2-1) and diaphragmatic breathing',
            'Interrupting catastrophic internal self-talk',
            'Cultivating self-compassion over harsh self-criticism'
          ]
        },
        {
          id: 'boundaries-and-self-worth',
          title: 'Boundaries and Self-Worth: Saying "No" Without Guilt',
          category: 'Personal Growth',
          readTime: '5 min read',
          date: 'August 2026',
          excerpt: 'The art of protecting your energy and peace of mind without fear of rejection or interpersonal friction.',
          image: '/Articles Images/pic2.jpeg',
          quote: 'Healthy boundaries are not walls built to lock the world out. They are doors with a clear key to mutual respect and authenticity.',
          fullContent: [
            'How often do you say "yes" to external requests when your whole being is silently screaming "no"? Behind this pattern typically lies an ingrained fear of disapproval or the unconscious belief that our worth is tied to how agreeable we are.',
            'Personal boundaries are the invisible demarcation line defining where you end and another person begins. Without them, emotional exhaustion, quiet resentment, and chronic frustration inevitably follow.',
            'Setting a boundary is neither aggressive nor cold. It is a calm, mature act of self-respect. When you say "no" to what overwhelms you, you say "yes" to your health, peace, and values.',
            'People who genuinely care for you will respect your boundaries. Those who resist them usually benefited from their absence.'
          ],
          keyTakeaways: [
            'Distinguishing healthy compromise from self-sacrifice',
            'Formulating firm, kind refusals without over-explaining',
            'Navigating the initial discomfort and guilt of saying no',
            'Grounding self-worth in internal validation'
          ]
        },
        {
          id: 'overcoming-burnout',
          title: 'Overcoming Burnout in Modern Life: Signs & Restoration',
          category: 'Emotional Balance',
          readTime: '6 min read',
          date: 'July 2026',
          excerpt: 'When chronic exhaustion goes beyond physical fatigue and signals an urgent need to re-align your daily life.',
          image: '/Articles Images/pic3.jpeg',
          quote: 'Recovering from burnout is not simply sleeping longer on weekends; it requires the courage to transform how we relate to ourselves.',
          fullContent: [
            'Burnout syndrome does not happen overnight. It is a progressive accumulation of prolonged stress that gradually depletes our emotional, physical, and cognitive reserves.',
            'Early signs often go dismissed: cynicism, feeling helpless, diminished focus, insomnia, and an inability to feel joy from activities that once inspired us. Attempting to "push through" only deepens the cycle.',
            'True recovery demands a holistic view: evaluating internal perfectionism, creating real space for restorative rest, and weaving daily rituals of care into routine.',
            'In therapy, we examine the underlying beliefs that drove over-functioning and establish sustainable habits for lifelong well-being.'
          ],
          keyTakeaways: [
            'Recognizing the 4 stages of burnout before reaching a crisis',
            'Differentiating passive downtime from true restorative rejuvenation',
            'Softening internal perfectionism and hyper-responsibility',
            'Tangible strategies to restore vitality, focus, and joy'
          ]
        }
      ]
    },
    footer: {
      followMe: 'FOLLOW ME',
      copyright: '© 2026 Yana Karnolska – Psychologist. All rights reserved.',
      privacyPolicy: 'Privacy Policy',
      adminLogin: 'Psychologist Login',
      adminTitle: 'Access article management portal',
    },
    bookingModal: {
      title: 'Book a Consultation',
      subtitle: 'Select a convenient date and format for psychological support',
      nameLabel: 'Full Name',
      namePlaceholder: 'Jane Doe',
      phoneLabel: 'Phone Number',
      phonePlaceholder: '+359 88 123 4567',
      emailLabel: 'Email Address',
      emailPlaceholder: 'jane@example.com',
      serviceLabel: 'Select Therapeutic Service',
      dateLabel: 'Preferred Date',
      timeSlotLabel: 'Preferred Time Slot',
      timeSlots: {
        morning: 'Morning (09:00 – 12:00)',
        afternoon: 'Afternoon (12:00 – 16:00)',
        evening: 'Late Afternoon / Evening (16:00 – 19:00)'
      },
      notesLabel: 'Briefly describe what you would like to focus on (optional)',
      notesPlaceholder: 'E.g., anxiety at work, personal relationships, finding direction...',
      submitButton: 'Confirm & Send Request',
      submitting: 'Sending...',
      closeLabel: 'Close',
      validation: {
        nameRequired: 'Please enter your full name.',
        nameMin: 'Name must be at least 2 characters long.',
        phoneRequired: 'Please enter a contact phone number.',
        phoneInvalid: 'Please enter a valid phone number (at least 7 digits).',
        emailRequired: 'Please enter your email address.',
        emailInvalid: 'Please enter a valid email address (e.g. name@domain.com).',
        dateRequired: 'Please select a preferred consultation date.',
        datePast: 'Please choose today or a future date.',
        generalError: 'An unexpected error occurred while sending your request. Please try again or reach out by phone.'
      },
      success: {
        title: 'Request Sent Successfully!',
        message: 'Thank you for your trust. I will reach out shortly to confirm your session date and details.',
        closeNote: 'This window will close automatically in a few seconds...'
      }
    },
    serviceModal: {
      badge: 'SERVICE',
      suitableForTitle: 'Recommended for:',
      durationLabel: 'Session duration:',
      bookButton: 'BOOK THIS SERVICE',
      closeLabel: 'Close',
    },
    articleModal: {
      closeLabel: 'Close',
      authorAttribution: '– Yana Karnolska, Psychologist',
      keyTakeawaysTitle: 'Actionable Insights & Key Takeaways:',
      ctaHeading: 'Need Personal Psychological Support?',
      ctaDescription: 'If the topics in this article resonate with your personal journey, you can schedule an individual consultation session.',
      ctaButton: 'Book a Consultation',
    },
    seo: {
      defaultTitle: 'Yana Karnolska | Psychologist & Psychotherapist Sofia – Support. Understanding. Transformation.',
      defaultDescription: 'Individual therapy, couples therapy, and online consultations with Yana Karnolska. Safe therapeutic space in Sofia and online for anxiety, stress relief, and self-discovery.',
      locale: 'en_US',
      siteName: 'Yana Karnolska – Psychologist & Psychotherapist',
    },
    floatingButton: 'Book a Session',
  }
};
