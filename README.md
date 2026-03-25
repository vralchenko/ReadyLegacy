# Ready Legacy

**The Future of Legacy** — a Swiss-made digital platform that helps you organize your life, preserve memories, and support your loved ones.

🌐 [readylegacy.ch](https://readylegacy.ch)

## Vision

Innovation is not just about growth — it's about life. Ready Legacy reduces the emotional and organizational burden of legacy planning through clean design, secure data handling, and AI-powered personalization.

### Three Pillars

1. **Be Ready** — Organize your documents, assets, and wishes with digital vault, will builder, and legal framework tools
2. **Leave Behind** — Create lasting memories: messages, photos, videos, and voice recordings for your loved ones
3. **Be Honored** — Support for families during bereavement: grief guidance, executor dashboards, and memorial services

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 7
- **Routing**: React Router DOM 7
- **Styling**: Custom CSS with light/dark theme system (CSS custom properties)
- **Hosting**: Vercel
- **AI**: Claude-powered chat assistant & AI Avatar (beta)
- **Persistence**: Local storage with auto-save

## Features

- **Estate Planning Tools**: Asset overview, will builder, legal framework tracking, death checklist, executor task management
- **Digital Legacy Vault**: Store text messages, photos, videos, audio recordings for loved ones
- **Document Templates**: Power of Attorney, Living Will, Funeral Directive, Gift Declaration, and more — guided wizards with PDF export
- **AI Chat Assistant**: Context-aware assistant for navigating the platform
- **Email Reminders**: Configurable reminders to keep estate documents up to date
- **Bereavement Support**: Emotional and practical support resources for those left behind
- **Multi-language**: English & German (EN/DE)
- **Light & Dark Theme**: Clean light theme (default) inspired by modern fintech design, with dark mode option
- **GDPR & nDSG Compliant**: Swiss privacy standards at its core

## Project Structure

```text
src/
├── assets/          # Static assets (images, fonts)
├── components/      # Reusable UI components (Header, Footer, ChatWidget, Tools)
├── context/         # React Context (Language, Theme)
├── hooks/           # Custom hooks (usePersistedState)
├── pages/           # Page components (Home, Mission, Tools, Team, etc.)
├── main.tsx         # Application entry point
└── App.tsx          # Root component & routing
public/
└── assets/locales/  # Translation JSON files (en, de)
api/
├── chat.ts          # Chat API endpoint
└── knowledge/       # Knowledge base for AI assistant
```

## Getting Started

```bash
git clone https://github.com/vralchenko/ReadyLegacy.git
cd ReadyLegacy
npm install
npm run dev       # Development server at http://localhost:3000
npm run build     # Production build
npm run preview   # Preview production build
```

## Team

- **Dr. Inna Praxmarer** — Co-Founder & CEO
- **Olga Sushchinskaya** — Co-Founder & COO
- **Viktor Ralchenko** — Co-Founder & CTO

## Compliance

- 🇨🇭 Swiss Made
- 🔒 GDPR Ready
- 🛡️ nDSG Compliant

## License

Ready Legacy Ecosystem. All Rights Reserved. © 2026

---
*Be Ready. Leave Behind. Be Honored.*
