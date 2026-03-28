# Ready Legacy

Digital platform for estate planning, legacy management, and bereavement support.

[readylegacy.ch](https://readylegacy.ch)

## Services

1. **Be Ready** — Estate planning: asset overview, will builder, legal documents, checklists, executor tasks, document templates
2. **Leave Behind** — Digital legacy: personal messages, media vault, AI Avatar (beta)
3. **Be Honored** — Bereavement support: grief resources, support groups, guided healing

## Pricing

| Plan | Price | Highlights |
|------|-------|-----------|
| Free | CHF 0/forever | Basic vault (5 docs), readiness score, checklists, 1 trusted contact |
| Premium | CHF 15/mo | Unlimited storage, AI assistant, video/audio messages, PDF export |
| Family | CHF 25/mo | Everything in Premium + 5 family members, shared vault, AI Avatar |

## Tech Stack

- **Frontend**: React 19 + TypeScript, Vite 7, React Router 7
- **Backend**: Vercel serverless functions, Neon PostgreSQL, Drizzle ORM
- **Auth**: JWT (jose) + bcrypt — real accounts with persistent data
- **AI**: Claude-powered chat assistant & AI Avatar (beta)
- **Data**: Server-synced with localStorage fallback (useSyncedState)
- **i18n**: English & German (EN/DE)
- **Themes**: Light (default) & Dark

## Project Structure

```
src/
├── components/      # UI components (Header, Footer, ChatWidget, Tools)
├── context/         # React Context (Language, Theme, Auth)
├── hooks/           # usePersistedState, useSyncedState
├── lib/             # API client (fetch wrapper with JWT)
├── pages/           # Home, Login, Tools, Documents, Profile, etc.
└── App.tsx          # Root component, routing, providers

api/
├── auth/            # register, login, me (JWT auth)
├── documents/       # CRUD for user documents
├── user-data/       # Key-value store + bulk sync
├── db/              # Drizzle schema + Neon connection
├── lib/             # Auth helpers, middleware
├── chat.ts          # AI chat endpoint
└── knowledge/       # Knowledge base for AI assistant

public/assets/locales/  # Translation files (en.json, de.json)
```

## Database Schema

```
users           — id, email, password_hash, name, provider, plan
documents       — id, user_id, title, type, icon, status, data (JSONB)
user_data       — id, user_id, key, value (JSONB) — mirrors localStorage
```

## Getting Started

```bash
git clone https://github.com/vralchenko/ReadyLegacy.git
cd ReadyLegacy
npm install
cp .env.local.example .env.local   # Add DATABASE_URL + JWT_SECRET
npm run db:push                     # Push schema to Neon
npm run dev                         # http://localhost:3000
```

## Team

- **Dr. Inna Praxmarer** — Co-Founder & CEO
- **Olga Sushchinskaya** — Co-Founder & COO
- **Viktor Ralchenko** — Co-Founder & CTO

## Compliance

- Swiss Made
- GDPR Ready
- nDSG Compliant

## License

Ready Legacy Ecosystem. All Rights Reserved. © 2026
