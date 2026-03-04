import { STOPWORDS } from './stopwords';
import { KNOWLEDGE_BASE, KnowledgeChunk } from './base';

// ─── Unicode-aware tokenizer ─────────────────────────────────────────────────
function tokenize(text: string, lang: string): string[] {
  const words = text.toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
  const stops = STOPWORDS[lang] || STOPWORDS.en;
  return words.filter(w => w.length > 1 && !stops.has(w));
}

// ─── BM25 Search Engine ──────────────────────────────────────────────────────
const K1 = 1.5;
const B = 0.75;

export interface SearchResult {
  chunk: KnowledgeChunk;
  score: number;
}

export function search(query: string, language: string, topK = 5): SearchResult[] {
  const lang = language || 'en';
  const queryTokens = tokenize(query, lang);
  if (queryTokens.length === 0) return [];

  // Build corpus from chunk content in the requested language
  const docs = KNOWLEDGE_BASE.map(chunk => {
    const text = chunk.content[lang] || chunk.content.en || '';
    const tags = chunk.tags.join(' ');
    const kw = (chunk.keywords[lang] || chunk.keywords.en || []).join(' ');
    return tokenize(`${text} ${tags} ${kw}`, lang);
  });

  // Average document length
  const avgDl = docs.reduce((sum, d) => sum + d.length, 0) / (docs.length || 1);

  // IDF: inverse document frequency for each query token
  const N = docs.length;
  const idf: Record<string, number> = {};
  for (const token of queryTokens) {
    const df = docs.filter(d => d.includes(token)).length;
    idf[token] = Math.log((N - df + 0.5) / (df + 0.5) + 1);
  }

  // Score each document
  const results: SearchResult[] = KNOWLEDGE_BASE.map((chunk, i) => {
    const doc = docs[i];
    const dl = doc.length;

    // BM25 core score
    let score = 0;
    for (const token of queryTokens) {
      const tf = doc.filter(t => t === token).length;
      const tfNorm = (tf * (K1 + 1)) / (tf + K1 * (1 - B + B * (dl / avgDl)));
      score += (idf[token] || 0) * tfNorm;
    }

    // Bonus: tag match
    const queryLower = query.toLowerCase();
    for (const tag of chunk.tags) {
      if (queryLower.includes(tag.toLowerCase())) score += 2;
    }

    // Bonus: keyword match
    const kws = chunk.keywords[lang] || chunk.keywords.en || [];
    for (const kw of kws) {
      if (queryLower.includes(kw.toLowerCase())) score += 1.5;
    }

    // Priority tiebreaker
    score += 0.1 * chunk.priority;

    return { chunk, score };
  });

  return results
    .filter(r => r.score > 0.5)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}
