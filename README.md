# PromptGenius

AI-powered prompt optimization, evaluation, and management tool. Write better prompts, get better results.

## Features

- **Prompt Optimizer** — Paste any prompt and get an enhanced, structured version optimized for clarity and effectiveness
- **Prompt Evaluator** — Score your prompts across multiple dimensions with actionable improvement suggestions
- **Prompt Library** — Save, organize, and search your prompts with folders and favorites
- **Templates** — Start from pre-built prompt templates for common use cases
- **Context Snippets** — Reusable context blocks you can inject into any prompt
- **History** — Track all your optimization and evaluation activity
- **Dark Mode** — Full light/dark theme support

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **Auth & Database:** Supabase
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project
- An [OpenAI](https://platform.openai.com) API key (for AI-powered optimization & evaluation)

### Installation

```bash
git clone https://github.com/Collins76/prompt-genius.git
cd prompt-genius
npm install
```

### Environment Variables

Copy the example env file and fill in your keys:

```bash
cp .env.local.example .env.local
```

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |
| `OPENAI_API_KEY` | Your OpenAI API key |

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & signup pages
│   ├── (dashboard)/     # Main app pages
│   │   ├── dashboard/   # Home dashboard
│   │   ├── optimizer/   # Prompt optimization
│   │   ├── evaluator/   # Prompt evaluation
│   │   ├── library/     # Saved prompts
│   │   ├── templates/   # Prompt templates
│   │   ├── contexts/    # Context snippets
│   │   ├── history/     # Activity history
│   │   └── settings/    # User settings
│   └── api/             # API routes
├── components/          # Reusable UI components
├── contexts/            # React context providers
├── hooks/               # Custom hooks
├── lib/                 # Utilities, AI engine, store
└── types/               # TypeScript type definitions
```

## License

MIT
