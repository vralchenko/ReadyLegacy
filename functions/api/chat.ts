import type { CFContext } from './_lib/types';
import { search } from '../../api/knowledge/search';
import { checkRateLimit } from './_lib/rateLimit';

const GREETINGS: Record<string, RegExp> = {
  en: /^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings)\b/i,
  de: /^(hallo|hi|hey|guten\s*(morgen|tag|abend)|grüß\s*gott|servus|moin)\b/i,
  ru: /^(привет|здравствуй|добр(ый|ое|ого)\s*(утро|день|вечер)|салют|хай)\b/i,
  ua: /^(привіт|здрастуй|добр(ий|е|ого)\s*(ранок|день|вечір)|салют|хай)\b/i,
};

const GREETING_RESPONSES: Record<string, string> = {
  en: "Hello! I'm the Ready Legacy assistant. I can help you with estate planning, legal documents, tools navigation, and more. What would you like to know?",
  de: 'Hallo! Ich bin der Ready Legacy-Assistent. Ich kann Ihnen bei Nachlassplanung, Rechtsdokumenten, Navigation und mehr helfen. Was möchten Sie wissen?',
  ru: 'Привет! Я ассистент Ready Legacy. Могу помочь с планированием наследства, юридическими документами, навигацией по платформе и многим другим. Что бы вы хотели узнать?',
  ua: 'Привіт! Я асистент Ready Legacy. Можу допомогти з плануванням спадщини, юридичними документами, навігацією платформою та багато чим іншим. Що б ви хотіли дізнатися?',
};

const FALLBACK_RESPONSES: Record<string, string> = {
  en: "I couldn't find a specific answer for that. Try asking about our tools (Will Builder, Asset Overview, Legal Documents), estate planning topics, or how to navigate the platform. You can also visit the **Get in Touch** page to contact our team directly.",
  de: 'Dazu konnte ich keine spezifische Antwort finden. Fragen Sie nach unseren Tools (Testament-Planer, Vermögensübersicht, Rechtsdokumente), Nachlassplanung oder Navigation. Sie können auch die **Kontakt**-Seite besuchen.',
  ru: 'Не удалось найти конкретный ответ. Попробуйте спросить о наших инструментах (Конструктор завещания, Обзор активов, Юридические документы), планировании наследства или навигации. Также можете посетить страницу **Контакт**.',
  ua: 'Не вдалося знайти конкретну відповідь. Спробуйте запитати про наші інструменти (Конструктор заповіту, Огляд активів, Юридичні документи), планування спадщини або навігацію. Також можете відвідати сторінку **Контакт**.',
};

const FOLLOW_UPS: Record<string, Record<string, string[]>> = {
  platform: {
    en: ['What are the 3 pillars?', 'Who is on the team?', 'What tools are available?'],
    de: ['Was sind die 3 Säulen?', 'Wer ist im Team?', 'Welche Tools gibt es?'],
    ru: ['Какие 3 столпа?', 'Кто в команде?', 'Какие есть инструменты?'],
    ua: ['Які 3 стовпи?', 'Хто в команді?', 'Які є інструменти?'],
  },
  tool: {
    en: ['How to write a will?', 'What templates exist?', 'Is my data safe?'],
    de: ['Wie schreibe ich ein Testament?', 'Welche Vorlagen gibt es?', 'Sind meine Daten sicher?'],
    ru: ['Как составить завещание?', 'Какие есть шаблоны?', 'Мои данные в безопасности?'],
    ua: ['Як скласти заповіт?', 'Які є шаблони?', 'Мої дані в безпеці?'],
  },
  legal: {
    en: ['What is a Living Will?', 'How to write a will?', 'What templates exist?'],
    de: ['Was ist eine Patientenverfügung?', 'Wie schreibe ich ein Testament?', 'Welche Vorlagen gibt es?'],
    ru: ['Что такое завещание при жизни?', 'Как составить завещание?', 'Какие есть шаблоны?'],
    ua: ['Що таке заповіт за життя?', 'Як скласти заповіт?', 'Які є шаблони?'],
  },
  checklist: {
    en: ['What are the first steps?', 'Who to notify?', 'How to cope with grief?'],
    de: ['Was sind die ersten Schritte?', 'Wen benachrichtigen?', 'Wie mit Trauer umgehen?'],
    ru: ['Какие первые шаги?', 'Кого уведомить?', 'Как справиться с горем?'],
    ua: ['Які перші кроки?', 'Кого повідомити?', 'Як впоратися з горем?'],
  },
  team: {
    en: ['What is Ready Legacy?', 'What tools are available?', 'How to get started?'],
    de: ['Was ist Ready Legacy?', 'Welche Tools gibt es?', 'Wie fange ich an?'],
    ru: ['Что такое Ready Legacy?', 'Какие есть инструменты?', 'Как начать?'],
    ua: ['Що таке Ready Legacy?', 'Які є інструменти?', 'Як почати?'],
  },
  pricing: {
    en: ['What tools are available?', 'How to get started?', 'Is my data safe?'],
    de: ['Welche Tools gibt es?', 'Wie fange ich an?', 'Sind meine Daten sicher?'],
    ru: ['Какие есть инструменты?', 'Как начать?', 'Мои данные в безопасности?'],
    ua: ['Які є інструменти?', 'Як почати?', 'Мої дані в безпеці?'],
  },
  account: {
    en: ['What plans are available?', 'Where are my documents?', 'Is my data safe?'],
    de: ['Welche Pläne gibt es?', 'Wo sind meine Dokumente?', 'Sind meine Daten sicher?'],
    ru: ['Какие есть тарифы?', 'Где мои документы?', 'Мои данные в безопасности?'],
    ua: ['Які є тарифи?', 'Де мої документи?', 'Мої дані в безпеці?'],
  },
  support: {
    en: ['What support groups exist?', 'What to do after death?', 'What tools are available?'],
    de: ['Welche Selbsthilfegruppen gibt es?', 'Was tun im Todesfall?', 'Welche Tools gibt es?'],
    ru: ['Какие есть группы поддержки?', 'Что делать после смерти?', 'Какие есть инструменты?'],
    ua: ['Які є групи підтримки?', 'Що робити після смерті?', 'Які є інструменти?'],
  },
  faq: {
    en: ['What tools are available?', 'How to write a will?', 'Who is on the team?'],
    de: ['Welche Tools gibt es?', 'Wie schreibe ich ein Testament?', 'Wer ist im Team?'],
    ru: ['Какие есть инструменты?', 'Как составить завещание?', 'Кто в команде?'],
    ua: ['Які є інструменти?', 'Як скласти заповіт?', 'Хто в команді?'],
  },
};

function getFollowUps(category: string, lang: string): string[] {
  const cat = FOLLOW_UPS[category] || FOLLOW_UPS.faq;
  return cat[lang] || cat.en;
}

function corsJson(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function onRequest(context: CFContext): Promise<Response> {
  // CORS preflight
  if (context.request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  if (context.request.method !== 'POST') {
    return corsJson({ error: 'Method not allowed' }, 405);
  }

  const ip = context.request.headers.get('cf-connecting-ip') || 'unknown';
  const rl = checkRateLimit(`chat:${ip}`, 30, 60 * 1000); // 30 per minute
  if (!rl.allowed) return corsJson({ error: 'Too many requests. Please slow down.' }, 429);

  const { query, language = 'en' } = (await context.request.json()) as any;

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return corsJson({ error: 'Query is required' }, 400);
  }

  const lang = ['en', 'de', 'ru', 'ua'].includes(language) ? language : 'en';
  const trimmed = query.trim();

  // Check for greeting
  const greetingPattern = GREETINGS[lang] || GREETINGS.en;
  if (greetingPattern.test(trimmed)) {
    return corsJson({
      answer: GREETING_RESPONSES[lang] || GREETING_RESPONSES.en,
      sources: [],
      type: 'greeting',
    });
  }

  // Search knowledge base
  const results = search(trimmed, lang, 3);

  if (results.length === 0) {
    return corsJson({
      answer: FALLBACK_RESPONSES[lang] || FALLBACK_RESPONSES.en,
      sources: [],
      type: 'fallback',
    });
  }

  // Build answer from top result(s)
  const top = results[0];
  let answer = top.chunk.content[lang] || top.chunk.content.en || '';

  if (results.length > 1 && results[1].score > results[0].score * 0.7) {
    const second = results[1].chunk.content[lang] || results[1].chunk.content.en || '';
    answer += '\n\n' + second;
  }

  const sources = results.map((r) => ({
    id: r.chunk.id,
    route: r.chunk.route || null,
    score: Math.round(r.score * 10) / 10,
  }));

  const category = top.chunk.category;
  const followUps = getFollowUps(category, lang);

  return corsJson({
    answer,
    sources,
    type: 'result',
    followUps,
  });
}
