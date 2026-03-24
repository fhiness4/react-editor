<div align="center">

```
██████╗ ███████╗██╗   ██╗██╗ ██████╗
██╔══██╗██╔════╝██║   ██║██║██╔═══██╗
██║  ██║█████╗  ██║   ██║██║██║   ██║
██║  ██║██╔══╝  ╚██╗ ██╔╝██║██║   ██║
██████╔╝███████╗ ╚████╔╝ ██║╚██████╔╝
╚═════╝ ╚══════╝  ╚═══╝  ╚═╝ ╚═════╝
```

**Write. Run. Save. Share. Get Reviewed.**

A full-stack developer platform for writing, executing, saving, and sharing code — with peer code review built in.

[![License: MIT](https://img.shields.io/badge/License-MIT-white.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-4.x-white?logo=express&logoColor=black)](https://expressjs.com)

[Live Demo](https://devio.io) · [Report Bug](https://github.com/your-username/devio/issues) · [Request Feature](https://github.com/your-username/devio/issues)

---

![DEVIO Banner](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&q=80&fit=crop)

</div>

---

## Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Models](#data-models)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Pages & Components](#pages--components)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## About

**DEVIO** is an open-source developer platform that lets you write, run, save, and share code snippets directly in the browser — no local setup required. Once posted, other developers can browse your project, view the live code, leave line-level comments, fork it, and give full peer code reviews.

Think of it as a combination of CodePen, GitHub Gist, and a developer social platform — built with a dark, terminal-inspired aesthetic and real-time collaboration features.

### Why DEVIO?

Most code-sharing platforms are either too minimal (no community) or too heavyweight (full Git workflows). DEVIO hits the sweet spot: post a working snippet, get real feedback, and discover what other developers are building — all in one place.

---

## Features

### ✍️ Code Editor
- In-browser live code editor with syntax highlighting
- Support for **HTML**, **CSS**, and **JavaScript**
- Sandboxed live preview pane (side-by-side or split view)
- Auto-closing brackets, code folding, and keyboard shortcuts
- Debounced auto-run with manual override

### 💾 Save & Organise
- Save snippets to your personal code library
- Tag snippets by language or topic
- Search and filter your saved collection
- Version history — every save is tracked

### 🔗 Share
- One-click shareable links for any snippet
- Embeddable via `<iframe>` on any external site
- URL hash encoding for instant snippet sharing (no account needed)

### 👥 Peer Code Review
- Post projects publicly for community review
- Line-level inline comments
- Threaded discussions on each post
- Like and fork other developers' work
- Review feed on the dashboard

### 🖼️ Posts & Explore
- Browse all public posts with cover image, title, description, and poster
- Filter by language tag, sort by popularity / newest / most viewed
- Featured project spotlight on the explore page
- Grid and list view toggle
- Pagination (6 posts per page)

### 📊 Dashboard
- Personal stats: total snippets, views, reviews received
- Weekly activity charts (Recharts — AreaChart, BarChart)
- Snippet management table with inline edit/share actions
- Profile card with follower stats and saved slot meter
- Recent reviews feed

### 🏠 Landing Page
- Animated typewriter hero
- Interactive live code editor preview with tab switching (JS / HTML / CSS)
- Features grid, how-it-works steps, testimonials, and pricing tiers
- Scroll-reveal animations using `IntersectionObserver`
- Sticky scroll-aware navbar with frosted glass effect

---

## Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| React | 18 | UI framework |
| Syne | — | Display / heading font |
| DM Mono | — | Monospace / code font |
| Recharts | 2.x | Dashboard charts |
| IntersectionObserver API | native | Scroll reveal animations |
| CSS Custom Properties | native | Theme system |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Node.js | 18+ | Runtime |
| Express | 4.x | HTTP server & routing |
| MongoDB | 7.0 | Primary database |
| Mongoose | 8.x | ODM / schema validation |
| Joi | — | Request body validation |
| JWT | — | Authentication tokens |
| Bcrypt | — | Password hashing |
| Multer | — | File / image uploads |
| Cloudinary | — | Image hosting (postPic) |

### DevOps
| Technology | Purpose |
|---|---|
| Vercel | Frontend deployment |
| Railway / Render | Backend deployment |
| MongoDB Atlas | Managed database |
| Cloudinary | CDN image delivery |

---

## Project Structure

```
devio/
├── client/                        # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Avatar.jsx
│   │   │   ├── CodeBlock.jsx
│   │   │   ├── Reveal.jsx         # Scroll-reveal wrapper
│   │   │   ├── PostCard.jsx
│   │   │   ├── CommentDrawer.jsx
│   │   │   └── Pagination.jsx
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # devio-landing.jsx
│   │   │   ├── Dashboard.jsx      # devio-dashboard.jsx
│   │   │   ├── PostsExplore.jsx   # devio-posts.jsx
│   │   │   └── PostDetail.jsx     # devio-post-detail.jsx
│   │   ├── hooks/
│   │   │   ├── useReveal.js
│   │   │   └── useAuthStore.js
│   │   ├── utils/
│   │   │   └── timeAgo.js
│   │   └── App.jsx
│   └── package.json
│
├── server/                        # Express backend
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── postController.js
│   │   ├── codeController.js
│   │   └── commentController.js
│   ├── middleware/
│   │   ├── auth.js                # JWT verification
│   │   ├── upload.js              # Multer config
│   │   └── validate.js            # Joi validation
│   ├── models/
│   │   ├── User.js
│   │   ├── Post.js                # See Data Models below
│   │   ├── HtmlData.js            # codeId reference
│   │   └── Comment.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── code.js
│   │   └── comments.js
│   ├── .env.example
│   └── index.js
│
└── README.md
```

---

## Data Models

### Post

The core model for every project posted on DEVIO:

```js
// server/models/Post.js
const mongoose = require('mongoose')

const postSchema = mongoose.Schema({
    title: {
        type:     String,
        required: [true, 'title is required'],
        trim:     true
    },
    description: {
        type:     String,
        required: [true, 'description is required'],
        trim:     true
    },
    userId: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'user',
        required: true
    },
    codeId: {
        type:     mongoose.Schema.Types.ObjectId,
        ref:      'htmldata',
        required: true
    },
    postPic: {
        type:     String,
        default:  null,
        required: true
    }
}, {
    timestamps: true    // adds createdAt and updatedAt
})

module.exports = mongoose.model('Post', postSchema)
```

**Field reference:**

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `String` | ✅ | Display title of the posted project |
| `description` | `String` | ✅ | Description of what the project does |
| `userId` | `ObjectId` | ✅ | Reference to the `user` collection (poster) |
| `codeId` | `ObjectId` | ✅ | Reference to the `htmldata` collection (live code) |
| `postPic` | `String` | ✅ | URL of the cover image (hosted on Cloudinary) |
| `createdAt` | `Date` | auto | Timestamp added by Mongoose `timestamps: true` |
| `updatedAt` | `Date` | auto | Auto-updated on every save |

### User

```js
// server/models/User.js
const userSchema = mongoose.Schema({
    name:     { type: String, required: true, trim: true },
    handle:   { type: String, required: true, unique: true, trim: true },
    email:    { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bio:      { type: String, default: '' },
    avatar:   { type: String, default: null },
    role:     { type: String, enum: ['free', 'pro', 'team'], default: 'free' }
}, { timestamps: true })
```

### HtmlData (codeId reference)

```js
// server/models/HtmlData.js
const htmlDataSchema = mongoose.Schema({
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    html:     { type: String, default: '' },
    css:      { type: String, default: '' },
    js:       { type: String, default: '' },
    language: { type: String, default: 'JavaScript' },
    title:    { type: String, default: 'Untitled' }
}, { timestamps: true })
```

### Comment

```js
// server/models/Comment.js
const commentSchema = mongoose.Schema({
    postId:   { type: mongoose.Schema.Types.ObjectId, ref: 'Post',    required: true },
    userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'user',    required: true },
    text:     { type: String, required: true, trim: true },
    likes:    { type: Number, default: 0 },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }
}, { timestamps: true })
```

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org)
- **npm** v9+ or **yarn** v1.22+
- **MongoDB** — local instance or [Atlas](https://cloud.mongodb.com) free tier
- **Git** — [Download](https://git-scm.com)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/devio.git
cd devio
```

### 2. Install dependencies

```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 3. Configure environment variables

```bash
# In /server, copy the example env file
cp .env.example .env
```

Fill in your values (see [Environment Variables](#environment-variables) below).

### 4. Run the development servers

Open two terminal windows:

**Terminal 1 — Backend:**
```bash
cd server
npm run dev
# Server starts on http://localhost:5000
```

**Terminal 2 — Frontend:**
```bash
cd client
npm run dev
# App starts on http://localhost:5173
```

### 5. Open in browser

```
http://localhost:5173
```

---

## Environment Variables

Create a `.env` file inside `/server` with the following keys:

```env
# ── SERVER ────────────────────────────
PORT=5000
NODE_ENV=development

# ── DATABASE ──────────────────────────
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/devio?retryWrites=true&w=majority

# ── AUTHENTICATION ────────────────────
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# ── CLOUDINARY (image uploads) ────────
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# ── CLIENT ────────────────────────────
CLIENT_URL=http://localhost:5173
```

> **Never commit your `.env` file.** It is already in `.gitignore`.

---

## API Reference

Base URL: `http://localhost:5000/api`

### Authentication

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `POST` | `/auth/register` | Register a new user | ❌ |
| `POST` | `/auth/login` | Login and receive JWT | ❌ |
| `GET` | `/auth/me` | Get current user profile | ✅ |
| `PUT` | `/auth/me` | Update profile | ✅ |

### Posts

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/posts` | Get all public posts | ❌ |
| `GET` | `/posts/:id` | Get a single post | ❌ |
| `POST` | `/posts` | Create a new post | ✅ |
| `PUT` | `/posts/:id` | Update a post | ✅ owner |
| `DELETE` | `/posts/:id` | Delete a post | ✅ owner |
| `GET` | `/posts/user/:userId` | Get posts by user | ❌ |

**POST `/posts` — Request Body:**
```json
{
  "title":       "My Awesome Project",
  "description": "A short description of what this project does.",
  "codeId":      "665f1a2b3c4d5e6f7a8b9c01",
  "postPic":     "https://res.cloudinary.com/devio/image/upload/v1/posts/cover.jpg"
}
```

### Code (HtmlData)

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/code/:id` | Get a saved code snippet | ❌ |
| `POST` | `/code` | Save a new snippet | ✅ |
| `PUT` | `/code/:id` | Update a snippet | ✅ owner |
| `DELETE` | `/code/:id` | Delete a snippet | ✅ owner |

### Comments

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| `GET` | `/comments/:postId` | Get all comments on a post | ❌ |
| `POST` | `/comments` | Add a comment | ✅ |
| `DELETE` | `/comments/:id` | Delete a comment | ✅ owner |
| `PUT` | `/comments/:id/like` | Like / unlike a comment | ✅ |

---

## Pages & Components

### Pages

| Page | File | Route | Description |
|---|---|---|---|
| Landing | `devio-landing.jsx` | `/` | Hero, features, pricing, CTA |
| Dashboard | `devio-dashboard.jsx` | `/dashboard` | User stats, charts, snippet manager |
| Explore | `devio-posts.jsx` | `/explore` | Browse all public posts |
| Post Detail | `devio-post-detail.jsx` | `/post/:id` | Single post with full content, comments, sidebar |

### Key Components

| Component | Description |
|---|---|
| `PostCard` | Displays `postPic`, `title`, `description`, `userId.name`, tags, like/comment/share actions |
| `CommentDrawer` | Slide-in panel for reading and posting comments on a project |
| `Avatar` | Initials-based avatar generated from `userId.name` |
| `CodeBlock` | Syntax-highlighted code display with copy button and scanline animation |
| `Reveal` | `IntersectionObserver`-based scroll-reveal wrapper component |
| `Pagination` | Prev/Next + numbered page buttons with smart ellipsis |
| `FilterBar` | Sticky tag filter bar with live search and sort controls |

---

## Screenshots

| Landing Page | Dashboard |
|---|---|
| ![Landing](https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=75) | ![Dashboard](https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&q=75) |

| Explore / Posts | Post Detail |
|---|---|
| ![Explore](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&q=75) | ![Detail](https://images.unsplash.com/photo-1542831371-29b0f74f9713?w=600&q=75) |

---

## Contributing

Contributions are what make DEVIO better. Any contribution you make is **genuinely appreciated**.

### How to contribute

1. **Fork** the repository
2. **Create** your feature branch: `git checkout -b feature/your-feature-name`
3. **Commit** your changes: `git commit -m 'feat: add your feature'`
4. **Push** to the branch: `git push origin feature/your-feature-name`
5. **Open a Pull Request** on GitHub

### Commit message convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat:     a new feature
fix:      a bug fix
docs:     documentation changes only
style:    formatting, no logic change
refactor: code refactoring
test:     adding or updating tests
chore:    build process or tooling changes
```

### Good first issues

Look for issues labelled [`good first issue`](https://github.com/your-username/devio/labels/good%20first%20issue) to get started.

---

## Roadmap

- [x] Landing page with live code editor preview
- [x] User dashboard with charts and snippet manager
- [x] Explore page with tag filtering, search, and pagination
- [x] Post detail page with comment section
- [x] Post model: title, description, userId, codeId, postPic
- [ ] Real-time collaborative editing (WebSockets + OT)
- [ ] GitHub OAuth login
- [ ] Dark / light theme toggle
- [ ] Mobile app (React Native)
- [ ] Embeddable snippet widget
- [ ] AI code suggestions (Claude integration)
- [ ] Notifications system

---

## License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

## Acknowledgements

- [Unsplash](https://unsplash.com) — cover images used in demos
- [Recharts](https://recharts.org) — dashboard charting library
- [Syne](https://fonts.google.com/specimen/Syne) & [DM Mono](https://fonts.google.com/specimen/DM+Mono) — typography
- [MongoDB Atlas](https://cloud.mongodb.com) — free hosted database tier
- [Cloudinary](https://cloudinary.com) — image upload and CDN

---

<div align="center">

Built with ❤️ by developers, for developers.

**[devio.io](https://devio.io)** · [@devio_app](https://twitter.com/devio_app)

</div>
