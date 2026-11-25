# GreenLine Seed — Fullstack Corporate Website & CMS

A high-performance, modular corporate web application and content management system built with **React 19**, **TypeScript**, **Vite**, and **MongoDB**.

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript 7, Vite 8, React Router 7, Recharts, React Simple Maps
- **Backend**: Node.js, Express, MongoDB (MongoClient Native Driver)
- **Styling**: Vanilla CSS with modern custom design tokens & glassmorphism
- **Linter**: Oxlint (Rust-based ultra-fast linter)

---

## 🚀 Getting Started

### 1. Environment Setup

Create or verify `.env` in the root directory (based on `.env.example`):

```env
PORT=5000
MONGODB_URI=mongodb+srv://tahidtaha997_db_user:<password>@cluster0.fkko2hi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
DB_NAME=greenline_seed
VITE_API_URL=http://localhost:5000/api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Seed MongoDB Database

Populate your MongoDB database with the complete initial dataset (Hero, About, Services, Stats, Portfolio, Products, Blogs, Settings, Theme, and Categories):

```bash
npm run seed
```

### 4. Run Development Server

Run both the Express API backend (Port 5000) and the Vite frontend (Port 5173 with automatic `/api` proxy) concurrently:

```bash
npm run dev
```

Or run them individually:

```bash
npm run server      # Starts the Express MongoDB API on http://localhost:5000
npm run dev:client  # Starts the Vite client on http://localhost:5173
```

---

## 📡 REST API & CRUD Endpoints

All endpoints are prefixed with `/api`:

| Resource | Endpoints | Supported Methods | Description |
| :--- | :--- | :--- | :--- |
| **Health** | `/api/health` | `GET` | Cluster status, database ping, collections count |
| **Hero Content** | `/api/hero`, `/api/hero/reset` | `GET`, `PUT`, `POST` | Manage homepage hero title, description, buttons |
| **About Content** | `/api/about`, `/api/about/reset` | `GET`, `PUT`, `POST` | Manage story, milestones, values, team |
| **Services** | `/api/services`, `/api/services/:id` | `GET`, `POST`, `PUT`, `DELETE` | Full CRUD operations on services |
| **Services Meta** | `/api/services/meta/content` | `GET`, `PUT` | Services section heading & description |
| **Stats** | `/api/stats`, `/api/stats/:id` | `GET`, `POST`, `PUT`, `DELETE` | Full CRUD operations on metrics and counters |
| **Projects** | `/api/projects`, `/api/projects/:id` | `GET`, `POST`, `PUT`, `DELETE` | Full CRUD operations on portfolio projects |
| **Products** | `/api/products`, `/api/products/:id` | `GET`, `POST`, `PUT`, `DELETE` | Full CRUD operations on product catalogue |
| **Product Categories** | `/api/products/categories` | `GET`, `POST`, `PUT`, `DELETE` | Product category taxonomy |
| **Blogs** | `/api/blogs`, `/api/blogs/:id` | `GET`, `POST`, `PUT`, `DELETE` | Full CRUD operations on blog posts & articles |
| **Contact Inquiries** | `/api/contact` | `POST` | Public inquiry submission |
| **Contact Messages** | `/api/contact/messages/:id` | `GET`, `PATCH`, `DELETE` | Admin inquiry management & status tracking |
| **Settings & Theme** | `/api/settings/site`, `/sections`, `/theme` | `GET`, `PUT` | Configure site metadata, section order, colors |
| **Media Library** | `/api/media/upload`, `/api/media/:id` | `POST`, `GET`, `DELETE` | Upload & stream images stored in MongoDB |

---

## 🔒 Security & Admin Access

- Protected Admin Route: `/admin`
- Content Editor: `/admin/content`
- Local credentials (configurable in [src/auth/auth.config.ts](file:///Volumes/WorkSpace/Tahid/personal_project/greenline-seed/src/auth/auth.config.ts)):
  - **Admin**: `admin` / `Admin#321` (Role: `admin`)
  - **Editor**: `Editor` / `Editor#123` (Role: `editor`)

---

## 🧪 Build & Lint

```bash
npm run lint    # Run Oxlint
npm run build   # Type-check with tsc and bundle with Vite
```
