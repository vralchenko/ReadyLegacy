# Ready Legacy

Ready Legacy is a modern digital ecosystem designed to redefine how humans handle legacy, estate planning, and remembrance. It provides a structured, empathetic platform for organizing essential decisions and documents before they are needed, and offers guided support for loved ones during bereavement.

## Vision

Innovation is not just about growth; it's about life. Ready Legacy aims to reduce the emotional and organizational burden of the most certain part of existence through clean design, secure data handling, and AI-powered personalization.

## Technology Stack

- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Routing**: React Router 7
- **Styling**: Vanilla CSS (Custom properties-based design system)
- **Internationalization**: Custom JSON-based fetching system
- **Deployment**: Vercel

## Features

- **Multi-language Support**: Full support for English, German, Russian, and Ukrainian.
- **Dynamic Theme System**: Seamless switching between premium Dark and Light modes.
- **Estate Planning Tools**:
    - **Asset Overview Wizard**: Step-by-step calculation of assets and liabilities.
    - **Will Structure Builder**: Guided outline for handwritten wills.
    - **Legal Framework**: Tracking of Living Wills and Advance Care Directives.
    - **Bereavement Path**: Emotional and practical support for those left behind.
- **AI Chat Assistant**: Context-aware assistant for navigating the platform.
- **Local Persistence**: All user progress is automatically saved to `localStorage`.
- **Premium Aesthetics**: Dark-mode design with glassmorphism, gold accents, and fluid animations.

## Project Structure

```text
src/
├── assets/          # Static assets (Images, Global CSS)
├── components/      # Reusable UI components (Header, Footer, Tools)
├── context/         # React Context (Language, Theme)
├── hooks/           # Custom hooks (usePersistedState)
├── pages/           # Main page components
├── main.tsx         # Application entry point
└── App.tsx          # Root component & Routing
public/
└── assets/locales/  # Translation JSON files (en, de, ru, ua)
api/
├── chat.ts          # Chat API endpoint
└── knowledge/       # Knowledge base for AI assistant
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- [npm](https://www.npmjs.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/vralchenko/ReadyLegacy.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```

## License

Ready Legacy Ecosystem. All Rights Reserved.

---
*Be Ready. Leave Behind. Be Honored.*
