# RYNX Digital Media — Premium Portfolio Website

A modern, premium portfolio website built for **RYNX Digital Media**, featuring a cinematic dark theme, gold accents, portfolio video showcases, and an admin content management system.

🔗 **Live Website:** https://rynx-portfolio.vercel.app/

---

## 📌 About the Project

RYNX Digital Media is a client project designed to showcase creative work through a visually engaging, responsive portfolio website.

The project includes an administrative dashboard that allows authorized users to manage portfolio content without manually editing the website's source code.

The application integrates Supabase backend services for authentication, database operations, and media management.

## ✨ Key Features

- **Premium UI:** Dark-themed interface with gold accents and modern visual styling.
- **Portfolio Showcase:** Displays creative projects and video content.
- **Video Management:** Admin interface for managing portfolio videos and project details.
- **Admin Authentication:** Login and role-based access checks for dashboard access.
- **Content Management System:** Manage portfolio projects, categories, testimonials, enquiries, and other supported website content.
- **Custom Video Ordering:** Configure the display order of portfolio videos.
- **Before & After Showcase:** Present visual comparisons of creative work.
- **Responsive Design:** Designed to adapt to desktop, tablet, and mobile screens.
- **Database Integration:** Store and retrieve website content using Supabase.
- **Media Storage:** Supabase Storage integration for uploaded media, where configured.
- **Production Deployment:** Hosted on Vercel.

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| TypeScript | Type-safe application development |
| Vite | Development server and build tooling |
| React Router | Client-side navigation |
| Supabase | Backend-as-a-Service |
| PostgreSQL | Relational database |
| Supabase Auth | User authentication |
| Supabase Storage | Media storage |
| Vercel | Deployment and hosting |

## 🏗️ Architecture

```text
User / Admin
     |
     v
React + TypeScript + Vite
     |
     v
Supabase Client
     |
     +---- Supabase Authentication
     |
     +---- PostgreSQL Database
     |
     +---- Supabase Storage
     |
     v
Vercel Hosting
```

The frontend communicates with Supabase for supported authentication, data, and storage operations. Access to protected administrative functionality should be enforced through authentication, authorization checks, and appropriate database security policies.

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- Git
- A Supabase project with the required database schema and services configured

### 1. Clone the repository

```bash
git clone https://github.com/Sivaraj-T-hash/Rynx-media-website.git
cd Rynx-media-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root and add the environment variable names expected by the Supabase client implementation.

For example, if the project uses Vite environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

**Important:** Check the actual variable names in the project's Supabase client configuration before using these examples. Never commit `.env.local`, passwords, or Supabase service-role keys.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite in your terminal.

### 5. Build for production

```bash
npm run build
```

## 🔐 Security Considerations

- Keep environment files and credentials out of version control.
- Use Supabase Row Level Security (RLS) for protected database operations.
- Restrict administrative actions to authorized users.
- Never expose a Supabase service-role key in frontend code.
- Configure storage policies according to the intended upload and viewing permissions.

## 🚀 Deployment

The website is deployed using Vercel.

To deploy updates:

1. Commit and push the changes to GitHub.
2. Allow Vercel to build and deploy the updated application.
3. Verify the live website and admin functionality.

Large video files should be hosted using an appropriate media storage solution rather than committed directly to Git.

## 👨‍💻 Developer

**Sivaraj T**

- GitHub: [Sivaraj-T-hash](https://github.com/Sivaraj-T-hash)
- LinkedIn: [linkedin.com/in/sivaraj04](https://linkedin.com/in/sivaraj04)

## 📄 License

This repository was developed for RYNX Digital Media. Confirm the client's permission and the project's ownership terms before choosing a public license or redistributing client-owned assets.

---

*Built with React, TypeScript, Supabase, and Vercel.*
