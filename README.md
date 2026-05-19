# 🚀 Smart Leads Dashboard

Professional MERN Stack Lead Management System with Role-Based Access Control (RBAC).

[![Deployment Status](https://img.shields.io/badge/Deployment-Live-success)](https://ais-pre-34ieobo6aallty4cyc4pcw-382512872120.asia-southeast1.run.app)
[![Tech Stack](https://img.shields.io/badge/Stack-MERN-blue)](https://mongodb.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## 📖 Project Overview
Smart Leads Dashboard is a clean, modern internship assignment project designed for sales teams to track and manage their pipeline. It features a robust backend with Node.js/Express and a type-safe React frontend, providing a seamless experience for both administrators and sales representatives.

## ✨ Features
- **🔐 Secure Authentication**: JWT-based login/register with bcrypt password hashing.
- **🛡️ Role-Based Access (RBAC)**: Distinct permissions for `Admin` and `Sales` roles.
- **📊 Interactive Dashboard**: Real-time sales pipeline overview.
- **🔍 Advanced Search & Filter**: Debounced search with multi-parameter filtering (status, source).
- **📄 Server-side Pagination**: Efficiently handle large datasets with backend-driven pagination.
- **📥 CSV Export**: Administrators can export lead data for offline reporting.
- **📱 Responsive UI**: Fully mobile-responsive design built with Tailwind CSS.
- **🏗️ Containerization**: Ready-to-use Docker configuration.

## 🛠 Tech Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Lucide React, Motion.
- **Backend**: Node.js, Express, TypeScript, Mongoose, JWT.
- **Database**: MongoDB Atlas.
- **Deployment**: Vercel (Frontend), Render (Backend).
## 📸 Screenshots
- <img width="1920" height="925" alt="login-page" src="https://github.com/user-attachments/assets/c73d2a0a-8b3e-434a-9038-63753102c6bd" />
- <img width="1920" height="903" alt="lead-form" src="https://github.com/user-attachments/assets/ff1350dc-4146-49fb-8342-f787254354b4" />
- <img width="1920" height="895" alt="dashboard" src="https://github.com/user-attachments/assets/1fc3329c-048b-4f09-be08-5526c516af9a" />
- <img width="1920" height="915" alt="advanced-filters" src="https://github.com/user-attachments/assets/764ef48d-ece5-4a52-88c2-e65acb366d6f" />


## 📁 Folder Structure
```text
/
├── src/
│   ├── api/          # Axios instance & interceptors
│   ├── components/    # Common UI & Layout components
│   ├── context/       # Auth State Management
│   ├── controllers/   # Express Business Logic
│   ├── middlewares/   # Auth & Error middlewares
│   ├── models/        # MongoDB Data Schemas
│   ├── pages/         # Application Views/Pages
│   ├── types/         # TypeScript Interfaces
│   └── utils/         # Error Classes & Helpers
├── server.ts          # Express Entry Point
├── Dockerfile         # Production Container
└── docker-compose.yml # Dev/Prod Orchestration
```

## 🚀 Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account or Local MongoDB
- Docker (Optional)

### 2. Environment Setup
Create a `.env` file in the root:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_secret
NODE_ENV=development
VITE_API_URL=http://localhost:3000/api
```

### 3. Install & Run
```bash
# Install dependencies
npm install

# Run in Development mode
npm run dev

# Build for Production
npm run build

# Start Production Server
npm run start
```

## 📡 API Reference

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/register` | POST | Create new account | Public |
| `/api/auth/login` | POST | User login | Public |
| `/api/leads` | GET | List leads (paginated) | Private |
| `/api/leads` | POST | Create new lead | Private |
| `/api/leads/export` | GET | Download CSV | Admin Only |

## 🐳 Docker Deployment
```bash
docker-compose up --build
```

## 🏗 Future Enhancements
- [ ] Email notifications for lead assignment.
- [ ] Drag-and-drop Kanban board for pipeline stages.
- [ ] Detailed analytics charts using Recharts.
- [ ] Google Calendar integration for follow-up reminders.

## 👤 Author
**Taha Bardanwala**
- GitHub: [@TahaBardanwala](https://github.com/TahaBardanwala)
- Email: tahabardanwala53@gmail.com

---
*Developed as an internship evaluation project focusing on clean code and professional standards.*
