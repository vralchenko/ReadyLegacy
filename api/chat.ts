import type { VercelRequest, VercelResponse } from '@vercel/node';
import { search } from './knowledge/search';

const GREETINGS: Record<string, RegExp> = {
  en: /^(hi|hello|hey|good\s*(morning|afternoon|evening)|howdy|greetings)\b/i,
  de: /^(hallo|hi|hey|guten\s*(morgen|tag|abend)|grüß\s*gott|servus|moin)\b/i,
  ru: /^(привет|здравствуй|добр(ый|ое|ого)\s*(утро|день|вечер)|салют|хай)\b/i,
  ua: /^(привіт|здрастуй|добр(ий|е|ого)\s*(ранок|день|вечір)|салют|хай)\b/i,
};

const GREETING_RESPONSES: Record<string, string> = {
  en: 'Hello! I\'m the Continuum assistant. I can help you with estate planning, legal documents, tools navigation, and more. What would you like to know?',
  de: 'Hallo! Ich bin der Continuum-Assistent. Ich kann Ihnen bei Nachlassplanung, Rechtsdokumenten, Navigation und mehr helfen. Was möchten Sie wissen?',
  ru: 'Привет! Я ассистент Continuum. Могу помочь с планированием наследства, юридическими документами, навигацией по платформе и многим другим. Что бы вы хотели узнать?',
  ua: 'Привіт! Я асистент Continuum. Можу допомогти з плануванням спадщини, юридичними документами, навігацією платформою та багато чим іншим. Що б ви хотіли дізнатися?',
};

const FALLBACK_RESPONSES: Record<string, string> = {
  en: 'I couldn\'t find a specific answer for that. Try asking about our tools (Will Builder, Asset Overview, Legal Documents), estate planning topics, or how to navigate the platform. You can also visit the **Get in Touch** page to contact our team directly.',
  de: 'Dazu konnte ich keine spezifische Antwort finden. Fragen Sie nach unseren Tools (Testament-Planer, Vermögensübersicht, Rechtsdokumente), Nachlassplanung oder Navigation. Sie können auch die **Kontakt**-Seite besuchen.',
  ru: 'Не удалось найти конкретный ответ. Попробуйте спросить о наших инструментах (Конструктор завещания, Обзор активов, Юридические документы), планировании наследства или навигации. Также можете посетить страницу **Контакт**.',
  ua: 'Не вдалося знайти конкретну відповідь. Спробуйте запитати про наші інструменти (Конструктор заповіту, Огляд активів, Юридичні документи), планування спадщини або навігацію. Також можете відвідати сторінку **Контакт**.',
};

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { query, language = 'en' } = req.body || {};

  if (!query || typeof query !== 'string' || query.trim().length === 0) {
    return res.status(400).json({ error: 'Query is required' });
  }

  const lang = ['en', 'de', 'ru', 'ua'].includes(language) ? language : 'en';
  const trimmed = query.trim();

  // Check for greeting
  const greetingPattern = GREETINGS[lang] || GREETINGS.en;
  if (greetingPattern.test(trimmed)) {
    return res.status(200).json({
      answer: GREETING_RESPONSES[lang] || GREETING_RESPONSES.en,
      sources: [],
      type: 'greeting',
    });
  }

  // Search knowledge base
  const results = search(trimmed, lang, 3);

  if (results.length === 0) {
    return res.status(200).json({
      answer: FALLBACK_RESPONSES[lang] || FALLBACK_RESPONSES.en,
      sources: [],
      type: 'fallback',
    });
  }

  // Build answer from top result(s)
  const top = results[0];
  let answer = top.chunk.content[lang] || top.chunk.content.en || '';

  // If second result is also highly relevant, append it
  if (results.length > 1 && results[1].score > results[0].score * 0.7) {
    const second = results[1].chunk.content[lang] || results[1].chunk.content.en || '';
    answer += '\n\n' + second;
  }

  const sources = results.map(r => ({
    id: r.chunk.id,
    route: r.chunk.route || null,
    score: Math.round(r.score * 10) / 10,
  }));

  // Generate follow-up questions based on the top result's category
  const category = top.chunk.category;
  const followUps = getFollowUps(category, lang);

  return res.status(200).json({
    answer,
    sources,
    type: 'result',
    followUps,
  });
}

// ─── Contextual follow-up questions by category ──────────────────────────────
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
    en: ['What is Continuum?', 'What tools are available?', 'How to get started?'],
    de: ['Was ist Continuum?', 'Welche Tools gibt es?', 'Wie fange ich an?'],
    ru: ['Что такое Continuum?', 'Какие есть инструменты?', 'Как начать?'],
    ua: ['Що таке Continuum?', 'Які є інструменти?', 'Як почати?'],
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
