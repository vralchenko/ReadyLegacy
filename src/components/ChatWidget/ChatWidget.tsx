import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import usePersistedState from '../../hooks/usePersistedState';
import type { ChatMessage, ChatApiResponse, QuickQuestion } from './types';
import './chatWidget.css';

// ─── Quick Questions (translated) ────────────────────────────────────────────
const QUICK_QUESTIONS: QuickQuestion[] = [
  {
    key: 'q_start',
    en: 'How do I get started?',
    de: 'Wie fange ich an?',
    ru: 'Как начать?',
    ua: 'Як почати?',
  },
  {
    key: 'q_will',
    en: 'How to write a will?',
    de: 'Wie schreibe ich ein Testament?',
    ru: 'Как составить завещание?',
    ua: 'Як скласти заповіт?',
  },
  {
    key: 'q_tools',
    en: 'What tools are available?',
    de: 'Welche Tools gibt es?',
    ru: 'Какие есть инструменты?',
    ua: 'Які є інструменти?',
  },
  {
    key: 'q_checklist',
    en: 'What to do after death?',
    de: 'Was tun im Todesfall?',
    ru: 'Что делать после смерти?',
    ua: 'Що робити після смерті?',
  },
  {
    key: 'q_templates',
    en: 'What templates exist?',
    de: 'Welche Vorlagen gibt es?',
    ru: 'Какие есть шаблоны?',
    ua: 'Які є шаблони?',
  },
  {
    key: 'q_data',
    en: 'Is my data safe?',
    de: 'Sind meine Daten sicher?',
    ru: 'Мои данные в безопасности?',
    ua: 'Мої дані в безпеці?',
  },
];

function formatTime(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Simple markdown-like bold parser: **text** → <strong>text</strong>
function renderBoldText(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

const ChatWidget: React.FC = () => {
  const { language, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = usePersistedState<ChatMessage[]>('chat_history', []);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const lang = (language || 'en') as 'en' | 'de' | 'ru' | 'ua';

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || isTyping) return;

    const userMsg: ChatMessage = { sender: 'user', text: text.trim(), time: formatTime() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: text.trim(), language: lang }),
      });

      if (!res.ok) throw new Error('API error');

      const data: ChatApiResponse = await res.json();
      const botMsg: ChatMessage = {
        sender: 'bot',
        text: data.answer,
        time: formatTime(),
        sources: data.sources?.filter(s => s.route) || [],
      };
      setMessages(prev => [...prev, botMsg]);
    } catch {
      // Fallback for local dev without serverless
      const fallbackTexts: Record<string, string> = {
        en: 'Sorry, I\'m having trouble connecting. Please try again later or explore the Tools section directly.',
        de: 'Entschuldigung, es gibt ein Verbindungsproblem. Bitte versuchen Sie es später oder erkunden Sie den Tools-Bereich direkt.',
        ru: 'Извините, проблема с подключением. Попробуйте позже или откройте раздел Инструменты напрямую.',
        ua: 'Вибачте, проблема з підключенням. Спробуйте пізніше або відкрийте розділ Інструменти напряму.',
      };
      const botMsg: ChatMessage = {
        sender: 'bot',
        text: fallbackTexts[lang] || fallbackTexts.en,
        time: formatTime(),
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  }, [lang, isTyping, setMessages]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const clearHistory = () => {
    setMessages([]);
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          className="chat-fab"
          onClick={() => setIsOpen(true)}
          title={t('chat_open') || 'Open Chat Assistant'}
          aria-label="Open Chat Assistant"
        >
          ✦
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="chat-window" role="dialog" aria-label="Chat Assistant">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-icon">✦</div>
            <div className="chat-header-info">
              <div className="chat-header-title">{t('chat_title') || 'Continuum Assistant'}</div>
              <div className="chat-header-status">● {t('chat_online') || 'Online'}</div>
            </div>
            <button className="chat-close-btn" onClick={() => setIsOpen(false)} aria-label="Close chat">×</button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="chat-msg-row">
                <div className="chat-msg-avatar">✦</div>
                <div className="chat-bubble chat-bubble--bot">
                  {renderBoldText(t('chat_welcome') || 'Hello! I\'m the **Continuum Assistant**. Ask me about estate planning, tools, or documents.')}
                  <div className="chat-bubble-time">{formatTime()}</div>
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div key={i} className={`chat-msg-row ${msg.sender === 'user' ? 'chat-msg-row--user' : ''}`}>
                {msg.sender === 'bot' && <div className="chat-msg-avatar">✦</div>}
                <div className={`chat-bubble chat-bubble--${msg.sender}`}>
                  {msg.sender === 'bot' ? (
                    <>
                      {msg.text.split('\n\n').map((paragraph, pi) => (
                        <p key={pi} style={{ margin: pi > 0 ? '8px 0 0' : 0 }}>
                          {renderBoldText(paragraph)}
                        </p>
                      ))}
                      {msg.sources && msg.sources.length > 0 && msg.sources[0].route && (
                        <a className="chat-bubble-link" href={msg.sources[0].route}>
                          {t('chat_learn_more') || 'Learn more →'}
                        </a>
                      )}
                    </>
                  ) : (
                    msg.text
                  )}
                  <div className="chat-bubble-time">{msg.time}</div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="chat-typing">
                <div className="chat-msg-avatar">✦</div>
                <div className="chat-typing-dots">
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                  <span className="chat-typing-dot" />
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Questions */}
          <div className="chat-quick">
            {QUICK_QUESTIONS.slice(0, 3).map(q => (
              <button
                key={q.key}
                className="chat-quick-btn"
                onClick={() => sendMessage(q[lang] || q.en)}
                disabled={isTyping}
              >
                {q[lang] || q.en}
              </button>
            ))}
          </div>

          {/* Input */}
          <div className="chat-input-row">
            <input
              ref={inputRef}
              className="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t('chat_placeholder') || 'Ask me anything...'}
              disabled={isTyping}
            />
            <button
              className="chat-send-btn"
              onClick={() => sendMessage(input)}
              disabled={isTyping || !input.trim()}
            >
              ↑
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatWidget;
