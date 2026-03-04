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

  return res.status(200).json({
    answer,
    sources,
    type: 'result',
  });
}
