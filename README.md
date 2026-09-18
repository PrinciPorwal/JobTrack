# 🚀 JobTrack — Full-Stack Job Application Tracker

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

**JobTrack** is a modern, responsive full-stack web application engineered to streamline the entire software job search lifecycle. From managing applications across diverse stages to tracking multi-round technical interviews and visualizing hiring analytics, JobTrack keeps your career pipeline organized in one intuitive dashboard.

---

## 🌟 Key Features

- **📊 Comprehensive Analytics Dashboard**
  - Instant KPI metrics: Total Applications, In Review, Interviews Scheduled, Offers Received, and Rejection rates.
  - Interactive application activity trends and conversion rates powered by Recharts.
  - Monthly application distribution charts and upcoming interview countdowns.

- **💼 Dynamic Application Tracker**
  - Track applications with granular details: Company, Job Title, Work Mode (Remote/Hybrid/Onsite), Salary Range, Job URL, Recruiter Details, and Notes.
  - Switch between visual status badges (`SAVED`, `APPLIED`, `INTERVIEW`, `OFFER`, `REJECTED`, `WITHDRAWN`).
  - Search, filter by status, and sort by date or company name.

- **🗓️ Multi-Round Interview Manager**
  - Track every round from Online Assessment (OA), Technical Coding, System Design, to Behavioral and HR.
  - Record meeting links, interview dates/times, interviewers, and debrief notes.
  - Track pass/fail/pending statuses for individual rounds.

- **📄 Dedicated Resume Management**
  - Store and preview your master cloud resume link (Google Drive, Dropbox, Notion, etc.) with 1-click clipboard copy and direct access.

- **🎨 Modern & Responsive UI**
  - Built with Tailwind CSS, Lucide icons, glassmorphism cards, responsive navigation, and animated state transitions.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer
- **Charts**: Recharts
- **Icons**: Lucide React
- **HTTP Client**: Axios (with custom baseURL dynamic resolution)

### Backend
- **Runtime**: Node.js & Express.js
- **Database**: MongoDB Atlas with Mongoose ODM
- **Middleware**: CORS, Morgan (HTTP request logger), Custom Global Error Handlers
- **Environment Management**: Dotenv

---

## 📂 Project Structure

```text
JobTrack/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── components/         # Reusable UI components & Layouts
│   │   ├── pages/              # Dashboard, Applications, Interviews, Resume
│   │   ├── services/           # Axios instance & centralized API services
│   │   ├── App.jsx             # App routing and layout scaffolding
│   │   └── main.jsx            # React root entrypoint
│   ├── .env.example            # Client env template (VITE_API_URL)
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js          # Vite config with dev proxy
│
├── server/                     # Backend API (Node.js + Express)
│   ├── src/
│   │   ├── config/             # Database connection (MongoDB Atlas)
│   │   ├── controllers/        # Request handlers (Applications, Interviews, etc.)
│   │   ├── middleware/         # Error & 404 handler middlewares
│   │   ├── models/             # Mongoose schemas (Application, Interview, Resume)
│   │   ├── routes/             # Express API routes
│   │   ├── utils/              # Database seed script
│   │   ├── app.js              # Express app initialization & middleware
│   │   └── server.js           # Server listen entrypoint
│   ├── .env.example            # Server env template (PORT, MONGO_URI)
│   └── package.json
│
├── .gitignore                  # Git ignore rules for dependencies & secrets
└── README.md                   # Project documentation
```

---

## ⚙️ Environment Variables Reference

### Backend (`server/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `PORT` | Port for Express server to listen on | `5000` |
| `NODE_ENV` | Environment mode | `development` or `production` |
| `MONGO_URI` | MongoDB connection URI string | `mongodb+srv://<user>:<password>@cluster.mongodb.net/jobtrack` |

> ⚠️ **Important**: Whitelist `0.0.0.0/0` (Allow access from anywhere) in MongoDB Atlas under **Network Access** if deploying to cloud hosting like Render.

### Frontend (`client/.env`)

| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of deployed backend | `https://jobtrack-backend.onrender.com` (leave empty for local dev proxy) |

---

## 💻 Local Development Setup

### 1. Clone the repository
```bash
git clone <your-github-repo-url>
cd JobTrack
```

### 2. Configure Backend
```bash
cd server
npm install
cp .env.example .env
# Edit .env with your MongoDB Atlas connection string
```

Seed the database with sample applications & interview rounds:
```bash
npm run seed
```

Start the backend server:
```bash
npm run dev
# Server runs on http://localhost:5000
```

### 3. Configure Frontend
Open a new terminal tab:
```bash
cd client
npm install
npm run dev
# Client runs on http://localhost:5173
```

---

## 📡 API Endpoints Reference

### Applications
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/applications` | Retrieve all applications (with status & search query filtering) |
| `GET` | `/api/applications/:id` | Get single application with linked interviews |
| `POST` | `/api/applications` | Create a new job application |
| `PUT` | `/api/applications/:id` | Update an existing application |
| `PATCH` | `/api/applications/:id/status`| Update only application status |
| `DELETE` | `/api/applications/:id` | Delete an application and associated interview rounds |

### Interviews
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/interviews` | Retrieve all interview rounds |
| `GET` | `/api/interviews/:id` | Get single interview round details |
| `POST` | `/api/interviews` | Schedule new interview round for an application |
| `PUT` | `/api/interviews/:id` | Update interview details or result |
| `DELETE` | `/api/interviews/:id` | Delete an interview round |

### Resume & Analytics
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/resume` | Retrieve current resume document link |
| `POST` | `/api/resume` | Update or create master resume link |
| `DELETE`| `/api/resume` | Delete master resume entry |
| `GET` | `/api/analytics/dashboard` | Aggregated dashboard metrics & status breakdown |
| `GET` | `/api/analytics/monthly` | Monthly application submissions timeline |

---

## 🌐 Deployment Guide

### Phase 1: Deploy Backend (Render)
1. Push your repository to GitHub.
2. Sign in to [Render](https://render.com/) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set the following build configuration:
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add your **Environment Variables** in Render:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGO_URI`: `your-mongodb-atlas-connection-string`
6. Click **Deploy**. Note your assigned backend URL (e.g. `https://jobtrack-backend.onrender.com`).

### Phase 2: Deploy Frontend (Vercel)
1. Sign in to [Vercel](https://vercel.com/) and click **Add New Project**.
2. Select your JobTrack GitHub repository.
3. Configure the project:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
4. Expand **Environment Variables** and add:
   - **Key**: `VITE_API_URL`
   - **Value**: `https://jobtrack-backend.onrender.com` *(your Render backend URL)*
5. Click **Deploy**.
6. Your JobTrack web application is now live and fully connected!

---

## 📜 License
Distributed under the ISC License. Created with ❤️ for aspiring software engineers.
