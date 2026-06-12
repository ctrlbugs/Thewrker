<p align="center">
  <img src="public/logo.svg" alt="TheWrker" width="220" />
</p>

<h1 align="center">TheWrker</h1>

<p align="center">
  <strong>The Future of Workspace</strong><br />
  One workspace for every file, every tool, and every career move.
</p>

<p align="center">
  <a href="https://github.com/ctrlbugs/Thewrker/actions/workflows/ci.yml">
    <img src="https://github.com/ctrlbugs/Thewrker/actions/workflows/ci.yml/badge.svg" alt="CI" />
  </a>
  <a href="https://nextjs.org">
    <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  </a>
  <a href="https://react.dev">
    <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  </a>
  <a href="https://www.typescriptlang.org">
    <img src="https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com">
    <img src="https://img.shields.io/badge/Tailwind-4-38B2AC?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  </a>
</p>

---

## Overview

**TheWrker** is a browser-based productivity workspace that brings editing, conversion, AI tools, and career growth into a single, premium experience. No installs, no tab-hopping — open the app and work.

| Workspace | CareerOS |
|-----------|----------|
| Edit PDFs, images, text, and archives | Upload & upgrade your CV to ATS standard |
| Convert and compress media | Match jobs across 12+ job boards |
| Developer utilities (JSON, JWT, regex…) | Scholarships, bootcamps & upskill roadmaps |
| AI-powered analysis (plagiarism, OCR) | Interview prep & application tracking |

> CareerOS is not another job board. It is **the operating system for career growth** — helping users become employable, not just searchable.

---

## Features

### Workspace Studios

| Studio | What it does |
|--------|----------------|
| **Text Editor** | Rich text editing in the browser |
| **PDF Studio** | View, merge, split, and annotate PDFs |
| **Image Studio** | Edit images with optional cloud background removal |
| **Archive Studio** | Extract and browse ZIP archives |
| **Converter Hub** | Convert between audio, video, and image formats |
| **Compressor Studio** | Reduce file sizes for images, audio, and video |
| **AI Studio** | Plagiarism checks, OCR, and intelligent document analysis |

### Developer Tools

JSON formatter · Base64 encoder/decoder · UUID generator · Hash generator · JWT decoder · Regex tester

### CareerOS

The AI-powered career platform inside TheWrker:

- **Career DNA** — Auto-detect level, industry, role, and skills from your CV
- **Smart CV Builder** — Upload a CV, get an ATS score, one-click upgrade to a [FlowCV](https://flowcv.com/)-style standard format with live preview
- **Cover Letter Studio** — Personalized, ATS-optimized letters per job description
- **Job Search** — Intelligent matching across LinkedIn, Wellfound, Remote OK, Otta, and more — with match scores and filters
- **Scholarships** — Curated funding matched to your profile (Chevening, Erasmus, Commonwealth…)
- **Bootcamps** — Free, scholarship, and paid programs by niche
- **Upskill Engine** — 30 / 60 / 90-day learning roadmaps with free and paid resources
- **Application Tracker** — Pipeline from saved → applied → interview → offer
- **Interview Prep** — Role-specific questions, company prep, salary tips
- **Career Growth Agent** — 12-week milestone plans

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack) |
| UI | [React 19](https://react.dev), [Tailwind CSS v4](https://tailwindcss.com) |
| Language | [TypeScript](https://www.typescriptlang.org) |
| PDF | pdf-lib, pdfjs-dist |
| Media | FFmpeg (WASM), @imgly/background-removal |
| AI (optional) | OpenAI — CareerOS coaching, CV upgrade, cover letters |
| Search (optional) | SerpAPI — job discovery, web plagiarism scan |
| OCR (optional) | OCR.space — CV and document text extraction |

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **npm** (comes with Node)

### 1. Clone the repository

```bash
git clone https://github.com/ctrlbugs/Thewrker.git
cd Thewrker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your values. All API keys are **optional** — the app runs without them and falls back to local/browser-based logic where possible.

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Public URL for Open Graph / social sharing |
| `OPENAI_API_KEY` | CareerOS AI features (CV upgrade, cover letters, interview prep) |
| `OPENAI_MODEL` | OpenAI model (default: `gpt-4o-mini`) |
| `SERPAPI_API_KEY` | Job discovery & web plagiarism search |
| `OCR_SPACE_API_KEY` | CV / document text extraction from uploads |
| `REMOVE_BG_API_KEY` | Cloud background removal in Image Studio |
| `GOOGLE_CSE_API_KEY` + `GOOGLE_CSE_CX` | Alternative web search for plagiarism |

> **Never commit `.env` or `.env.local`.** They are listed in `.gitignore`.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Production build

```bash
npm run build
npm start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |
| `npm run test:tools` | Run tool logic tests |

---

## Project Structure

```
Thewrker/
├── public/                  # Static assets (logos, icons)
├── src/
│   ├── app/                 # Next.js App Router pages & API routes
│   │   ├── careeros/        # CareerOS platform pages
│   │   ├── studio/          # Media & document studios
│   │   ├── tools/           # Developer utilities
│   │   └── api/             # Server-side API routes
│   ├── components/          # React components
│   │   ├── careeros/        # CareerOS UI
│   │   ├── layout/          # Shell, header, sidebar
│   │   └── tools/           # Studio tool components
│   ├── hooks/               # React hooks
│   └── lib/                 # Business logic, API clients, types
│       ├── careeros/        # Career DNA, resume templates, upskill
│       └── api/             # Server & client API helpers
├── scripts/                 # Test & utility scripts
└── .github/workflows/       # CI pipeline
```

---

## API Routes

| Route | Method | Description |
|-------|--------|-------------|
| `/api/careeros/ai` | POST | CareerOS AI actions (CV analyze, upgrade, cover letter…) |
| `/api/careeros/opportunities` | POST | Job discovery via SerpAPI |
| `/api/ocr/extract` | POST | OCR text extraction from uploaded files |
| `/api/image/remove-background` | POST | Cloud background removal |
| `/api/plagiarism/web-check` | POST | Web plagiarism scan |
| `/api/integrations` | GET | Integration status (keys configured or not) |

---

## Brand

| Token | Value |
|-------|-------|
| Name | TheWrker |
| Tagline | The Future of Workspace |
| Accent | `#01F0D0` |
| Navy | `#072635` |

---

## Roadmap

- [ ] Voice Interview Coach (real-time mock interviews)
- [ ] PDF / DOCX resume export
- [ ] User accounts & cloud sync
- [ ] Thwrker AI continuous learning (vector store + outcome feedback)
- [ ] Mobile-optimized CareerOS experience

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please do not commit secrets. Use `.env.local` for local keys only.

---

## License

This project is private. All rights reserved unless a license file is added.

---

<p align="center">
  Built with purpose — helping people work smarter and land better opportunities.<br />
  <strong>TheWrker</strong> · The Future of Workspace
</p>
