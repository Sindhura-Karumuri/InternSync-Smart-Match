# 🚀 InternSync Smart Match

**AI-Powered Internship Matching Platform**

[![Python](https://img.shields.io/badge/Python-3.8+-blue.svg)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green.svg)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2+-blue.svg)](https://reactjs.org)
[![Vercel](https://img.shields.io/badge/Frontend-Vercel-black.svg)](https://intern-sync-smart-match.vercel.app/)
[![Render](https://img.shields.io/badge/Backend-Render-46E3B7.svg)](https://internsync-smart-match.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

> **🌐 [Live Application](https://intern-sync-smart-match.vercel.app/)** — Try it now!

## Overview

InternSync Smart Match is an AI-powered internship recruitment platform that matches candidates with positions across 8 industry domains. HR managers can run AI matching, select/reject candidates, schedule interviews, view analytics, and manage closed internships.

### 🔑 Demo Credentials

| Department | Email | Password |
|---|---|---|
| IT & Software | `it.hr@example.com` | `it12345` |
| Banking & Finance | `bank.hr@example.com` | `bank12345` |
| FMCG | `fmcg.hr@example.com` | `fmcg12345` |
| Oil & Gas | `oil.hr@example.com` | `oil12345` |
| Manufacturing | `mfg.hr@example.com` | `mfg12345` |
| Healthcare | `health.hr@example.com` | `health12345` |
| Retail | `retail.hr@example.com` | `retail12345` |
| Hospitality | `hospitality.hr@example.com` | `hosp12345` |

## Features

- **AI Matching** — Score and rank candidates by skills, GPA, and experience
- **HR Dashboard** — View open positions, applicants, and recruitment stats
- **Candidate Management** — Select, reject, and schedule interviews
- **Email Simulation** — Send shortlist emails to top candidates
- **Analytics** — AI metrics, diversity metrics, geographic and educational distribution
- **Closed Internships** — Filled positions move automatically to a closed tab
- **Resume Preview/Download** — View candidate resumes in browser or download as text
- **Dark/Light Theme** — Full theme support across all pages

## Tech Stack

**Backend** — FastAPI (Python), in-memory data store, deployed on Render  
**Frontend** — React 18 + Vite, Tailwind CSS, Chart.js, deployed on Vercel

## Local Development

### Prerequisites
- Python 3.8+
- Node.js 16+

### 1. Clone the repo
```bash
git clone https://github.com/Sindhura-Karumuri/InternSync-Smart-Match.git
cd InternSync-Smart-Match
```

### 2. Start the backend
```bash
pip install -r requirements.txt
python -m uvicorn app:app --host 0.0.0.0 --port 8000 --reload
```
Backend runs at `http://localhost:8000`

### 3. Start the frontend
```bash
cd pm-internship-prototype2/frontend
npm install
npm run dev
```
Frontend runs at `http://localhost:5173`

The frontend reads `VITE_API_URL` from `.env` — defaults to `http://localhost:8000` if not set.

## Project Structure

```
InternSync-Smart-Match/
├── app.py                          # FastAPI backend (all routes)
├── requirements.txt                # Python dependencies
├── render.yaml                     # Render deployment config
├── vercel.json                     # Vercel deployment config
└── pm-internship-prototype2/
    └── frontend/
        ├── src/
        │   ├── pages/              # React page components
        │   │   ├── HRDashboard.jsx
        │   │   ├── PostDetail.jsx
        │   │   ├── ClosedInternships.jsx
        │   │   ├── HRAuth.jsx
        │   │   ├── SelectedTab.jsx
        │   │   ├── RejectedTab.jsx
        │   │   └── ...
        │   ├── components/
        │   │   ├── ThemeContext.jsx
        │   │   └── ProtectedRoute.jsx
        │   └── utils/
        │       └── api.js          # Axios instance with base URL
        ├── .env                    # VITE_API_URL for local dev
        ├── .env.production         # VITE_API_URL for production
        └── vite.config.js
```

## API Endpoints

```
GET  /health
POST /auth/login
GET  /departments/{dept_id}/posts
GET  /departments/{dept_id}/analytics
GET  /departments/{dept_id}/selected
GET  /departments/{dept_id}/rejected
GET  /departments/{dept_id}/closed
GET  /posts/{post_id}
GET  /departments/{dept_id}/posts/{post_id}/applicants
POST /posts/{post_id}/match
POST /posts/{post_id}/select
POST /posts/{post_id}/reject
POST /posts/{post_id}/schedule
POST /posts/{post_id}/send_top_emails
GET  /applicants/{id}/resume/preview
GET  /applicants/{id}/resume/download
```

## Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | https://intern-sync-smart-match.vercel.app |
| Backend | Render | https://internsync-smart-match.onrender.com |

Pushing to `main` triggers automatic redeployment on both platforms.

> **Note:** The backend uses an in-memory data store — state resets on each Render restart (free tier). This is intentional for demo purposes.

## License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">
Made with ❤️ by the InternSync Team &nbsp;|&nbsp; <a href="https://intern-sync-smart-match.vercel.app/">🌐 Live Demo</a>
</div>
