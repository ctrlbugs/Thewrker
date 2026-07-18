<p align="center">
  <img src="public/logo/logo-dark.png" alt="TheWrker" width="180" />
</p>

<h1 align="center">TheWrker</h1>

<p align="center">
  <strong>One Workspace. Every File. Every Opportunity.</strong>
</p>

<p align="center">
  The AI-powered professional ecosystem for files, careers, teams, and tools — without switching apps.
</p>

<p align="center">
  <a href="https://www.thewrker.com">thewrker.com</a>
</p>

---

## What is TheWrker?

**TheWrker** is not a single tool. It is an **ecosystem** — a unified workspace where professionals edit documents, convert media, store files, collaborate as a team, and grow their careers from one place.

We are building the operating layer for modern work:

| Pillar | Promise |
|--------|---------|
| **Workspace Studios** | Open, edit, convert, and manage every common file type in-browser |
| **CareerOS** | Jobs, resume building, and career momentum in the same product |
| **Organisation HQ** | Team structure, tasks, leave, meetings, and announcements |
| **Vault (Files)** | A private drive for uploads, folders, previews, and sharing |
| **Developer Toolkit** | Everyday utilities — JSON, Base64, JWT, Hash, UUID, Regex |

One brand. One login. One surface. An ecosystem that keeps expanding.

---

## Vision

> *The AI-powered workspace built for professionals and teams to work smarter, collaborate seamlessly, manage projects, create documents, discover opportunities, and grow their careers.*

People today bounce between PDF apps, converters, job boards, cloud drives, and chat tools.  
**TheWrker collapses that stack** into a single branded workspace — and keeps growing around it.

---

## Ecosystem map

```text
                        ┌─────────────────────┐
                        │      TheWrker       │
                        │   Unified Workspace │
                        └──────────┬──────────┘
           ┌───────────────┬───────┴───────┬───────────────┐
           ▼               ▼               ▼               ▼
     ┌──────────┐   ┌──────────┐   ┌────────────┐   ┌──────────┐
     │ Studios  │   │ CareerOS │   │Organisation│   │  Vault   │
     │  Files   │   │  Career  │   │     HQ     │   │  Files   │
     └────┬─────┘   └────┬─────┘   └─────┬──────┘   └────┬─────┘
          │              │               │               │
   Text · PDF · Image   Jobs · Resume   Tasks · Chat    Upload
   Archive · Convert   Academy ⭐      Leave · Meet    Folders
   Compress · AI                      Directory       Share
          │
          ▼
   ┌──────────────┐
   │  Dev Toolkit │
   │ JSON · JWT · │
   │ Hash · UUID  │
   └──────────────┘
```

---

## Product structure

### 1. Workspace Studios
In-browser studios for real file work:

| Studio | What it does |
|--------|----------------|
| **Text Editor** | Markdown, notes, configs, plain text |
| **PDF Studio** | Merge, split, extract, rotate, reorder, stamp |
| **Image Studio** | Resize, compress, convert, remove backgrounds |
| **Archive Studio** | Create / extract / compress ZIP |
| **Converter Hub** | Audio & video format conversion |
| **Compressor Studio** | Shrink images, audio, and video |
| **AI Studio** | Originality & similarity checks |

### 2. CareerOS
Career momentum inside the workspace:

- Live job search & matching
- Resume import / builder / PDF export
- **TheWrker Academy** — learning path (expanding)

### 3. Organisation HQ
Team operations without leaving the product:

- Dashboard & directory  
- Tasks, leave, meetings, performance  
- Announcements & chat  

### 4. Vault (Files)
Dropbox-style file storage:

- Upload, folders, star, search  
- Preview for PDF, Office, images, media  
- Share links & member invites  

### 5. Developer Toolkit
Fast utilities for builders:

JSON · Base64 · UUID · Hash · JWT · Regex  

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Framework | **Next.js 14** (App Router) |
| Language | **TypeScript** |
| UI | **React 18** · Tailwind CSS · Lucide |
| Data | **Prisma** · PostgreSQL (Supabase-ready) |
| Auth | JWT + local staging mode for demos |
| Deploy | **Vercel** |

Brand colors: navy `#21386B` · teal `#76BEC5`

---

## Repository layout

```text
TheWrker/
├── app/                    # Next.js App Router (pages, API, styles)
│   ├── (dashboard)/        # Authenticated workspace shell
│   ├── api/                # Auth, jobs, org APIs
│   ├── login/ · register/  # Public auth flows
│   └── ...
├── components/             # UI by domain
│   ├── auth/               # Login landing
│   ├── careeros/           # Jobs & resume
│   ├── organisation/       # Org HQ views
│   ├── tools/              # Studio tools
│   ├── vault/              # Files / drive
│   └── workspace/          # Overview, shell, topbar
├── lib/                    # Domain logic & data
│   ├── tools/              # Studio engines (PDF, media, image…)
│   ├── careeros/ · vault/ · organisation/
│   └── brand.ts            # Brand constants
├── prisma/                 # Schema & seed
├── public/                 # Logos, icons, assets
└── README.md
```

---

#OpenSource .. U can Contribute to this Project