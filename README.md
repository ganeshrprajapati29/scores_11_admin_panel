<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e3a8a,100:3b82f6&height=300&section=header&text=Crick11%20Admin%20Dashboard&fontSize=60&animation=fadeIn&fontAlignY=35" width="100%" />
</p>

<div align="center">

![React](https://img.shields.io/badge/React-18.2-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=for-the-badge&logo=tailwind-css&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-10B981?style=for-the-badge)

</div>

---

## 🎯 Introduction

> A comprehensive **Admin Dashboard** for cricket tournament management built with **React, Vite, and Tailwind CSS**. This is the frontend application that connects to the Crick11 Backend API, providing a modern, responsive interface for administrators to manage all aspects of a cricket platform.

---

## ✨ Key Features

<div align="left">

### 🏏 Cricket Management
| Feature | Description |
|---------|-------------|
| 🖥️ **Dashboard** | Overview with statistics, charts, and key metrics |
| 👥 **User Management** | Create, view, edit users, role management |
| 🏟️ **Team Management** | CRUD operations, player management, captain/vice-captain |
| 🎯 **Match Management** | Create, schedule, live control, completed matches |
| 📊 **Ball-by-Ball Scoring** | Real-time scoring with over summaries |
| 🏆 **Tournament Management** | League, Knockout, Points Table generation |
| 👨‍🎓 **Player Management** | Profiles, stats, batting/bowling/fielding records |

### 💰 Fantasy & Wallet
| Feature | Description |
|---------|-------------|
| 🎮 **Fantasy Contests** | Create contests, join contests, leaderboards |
| 💳 **Wallet Management** | Deposits, withdrawals, transfers, contest entries |
| 📈 **Leaderboards** | Player rankings, team rankings, tournament rankings |

### 📱 Additional Features
| Feature | Description |
|---------|-------------|
| 📝 **Player Profiles** | Detailed player career statistics |
| 📰 **Blog & News** | Content management system |
| 🛒 **Store** | E-commerce product and order management |
| 👥 **Community** | Post moderation and management |
| 📊 **Performance Tracking** | Player performance analytics |
| ⭐ **Reviews** | User review management |
| 🔔 **Notifications** | Push notification management |
| 💎 **Subscriptions** | Subscription plan management |
| 🏅 **Clubs & Associations** | Cricket clubs and associations |
| 🏅 **Awards** | Award management |
| 📞 **Contact Management** | Contact form submissions |
| ⚙️ **Settings** | Application configuration |

</div>

---

## 🛠️ Tech Stack

<div align="center">

| Technology | Purpose | Version |
|------------|---------|---------|
| <img src="https://img.shields.io/badge/React-18.2-61DAFB?style=flat-square" /> | UI Framework | 18.2.0 |
| <img src="https://img.shields.io/badge/Vite-5.0-646CFF?style=flat-square" /> | Build Tool | 5.0.8 |
| <img src="https://img.shields.io/badge/Tailwind-3.4-06B6D4?style=flat-square" /> | Styling | 3.4.19 |
| <img src="https://img.shields.io/badge/Zustand-4.4-9333EA?style=flat-square" /> | State Management | 4.4.7 |
| <img src="https://img.shields.io/badge/React%20Router-6.20-CA4245?style=flat-square" /> | Routing | 6.20.0 |
| <img src="https://img.shields.io/badge/Axios-1.6-5A29E4?style=flat-square" /> | HTTP Client | 1.6.2 |
| <img src="https://img.shields.io/badge/Lucide-React-0.294-10B981?style=flat-square" /> | Icons | 0.294.0 |
| <img src="https://img.shields.io/badge/Recharts-2.10-FF6F61?style=flat-square" /> | Charts | 2.10.3 |
| <img src="https://img.shields.io/badge/React%20Select-5.8-6332F6?style=flat-square" /> | Dropdowns | 5.8.0 |
| <img src="https://img.shields.io/badge/React%20Quill-2.0-FF9900?style=flat-square" /> | Rich Text Editor | 2.0.0 |
| <img src="https://img.shields.io/badge/React%20Hot%20Toast-2.4-FF6B6B?style=flat-square" /> | Notifications | 2.4.1 |
| <img src="https://img.shields.io/badge/Date--fns-2.30-F59E0B?style=flat-square" /> | Date Utilities | 2.30.0 |

</div>

---

## 📁 Project Structure

```
frontend/
├── 📂 src/
│   ├── 📂 assets/                  # Static assets (images, icons)
│   │
│   ├── 📂 components/              # Reusable React components
│   │   ├── 📂 charts/              # Chart components (LineChart, BarChart, PieChart)
│   │   ├── 📂 common/              # Common UI components (Button, Input, Modal, Table, etc.)
│   │   └── 📂 forms/               # Form components (UserForm, TeamForm, MatchForm, etc.)
│   │
│   ├── 📂 config/                  # Configuration files
│   │   ├── axiosConfig.js         # Axios instance setup
│   │   └── routesConfig.js        # Route definitions
│   │
│   ├── 📂 context/                 # React Context providers
│   │   ├── AuthContext.jsx        # Authentication context
│   │   ├── ThemeContext.jsx       # Theme management
│   │   └── SocketContext.jsx      # Socket.io connection
│   │
│   ├── 📂 hooks/                   # Custom React hooks
│   │   ├── useAuth.js             # Authentication hook
│   │   ├── useFetch.js            # Data fetching hook
│   │   └── useSocket.js           # Socket connection hook
│   │
│   ├── 📂 layout/                   # Layout components
│   │   ├── DashboardLayout.jsx    # Main dashboard layout
│   │   ├── Navbar.jsx             # Top navigation bar
│   │   ├── Sidebar.jsx            # Side navigation
│   │   └── ProtectedRoute.jsx     # Route protection
│   │
│   ├── 📂 pages/                   # Page components (30+ pages)
│   │   ├── auth/                  # Authentication pages
│   │   ├── dashboard/             # Dashboard overview
│   │   ├── users/                 # User management
│   │   ├── teams/                 # Team management
│   │   ├── matches/               # Match management & Live Control
│   │   ├── tournaments/           # Tournament management
│   │   ├── players/               # Player management
│   │   ├── contests/              # Fantasy contests
│   │   ├── leaderboard/           # Rankings
│   │   ├── wallet/                # Wallet management
│   │   ├── blogs/ & news/         # Content management
│   │   ├── store/                 # E-commerce
│   │   └── [more...]

│   ├── 📂 routes/                   # Routing configuration
│   ├── 📂 services/                 # API service modules (15+ services)
│   ├── 📂 store/                   # Zustand stores
│   └── 📂 utils/                    # Utility functions
│
├── 📄 index.html                   # HTML entry point
├── 📦 package.json                 # Dependencies
├── ⚙️ tailwind.config.js           # Tailwind configuration
├── 🔧 postcss.config.js            # PostCSS configuration
├── ⚡ vite.config.js               # Vite configuration
└── 📋 eslint.config.js             # ESLint configuration
```

---

## 🔄 API Integration Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│  │ Components │  │   Hooks     │  │    Zustand Store        ││
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘│
│         │                │                     │              │
│         └────────────────┼─────────────────────┘              │
│                          ▼                                      │
│                  ┌──────────────┐                               │
│                  │  Services    │                               │
│                  │  (Axios)     │                               │
│                  └──────┬───────┘                               │
└─────────────────────────┼───────────────────────────────────────┘
                          │ HTTP/HTTPS
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Backend (Express.js)                        │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                      Routes (25+)                           ││
│  │  /api/v1/auth, /api/v1/users, /api/v1/teams, ...          ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                   MongoDB Database                          ││
│  │  Users, Teams, Players, Matches, Tournaments, Contests...  ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Data Flow Diagrams

### 🔐 Authentication Flow
```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│  Axios   │────▶│  Backend │────▶│ MongoDB  │
│  Page    │     │ Service  │     │   API    │     │   DB     │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
      │                                                    │
      │ Response (JWT Token)                               │
      ▼                                                    │
┌──────────┐                                               │
│  Zustand │◀──────────────────┘
│  Store   │
└──────────┘
```

### 🏏 Match Management Flow
```
┌────────────┐     ┌────────────┐     ┌────────────┐
│   Admin    │     │   Match    │     │  Scoring  │
│  Creates   │────▶│  Service   │────▶│  System   │
│   Match    │     │            │     │            │
└────────────┘     └────────────┘     └────────────┘
                        │                    │
                        │ Create Match       │
                        ▼                    ▼
                   ┌────────────┐     ┌────────────┐
                   │  MongoDB   │     │  Socket.io │
                   │    DB      │◀───▶│ Real-time  │
                   └────────────┘     └────────────┘
```

### 🏆 Tournament & Points Table Flow
```
┌─────────────┐     ┌────────────────┐     ┌─────────────┐
│  Tournament │     │   Tournament   │     │   Points    │
│  Creation   │────▶│    Service     │────▶│   Table     │
└─────────────┘     └────────────────┘     └─────────────┘
                           │                       │
                           │ Generate              │
                           ▼                       ▼
                    ┌────────────┐         ┌────────────┐
                    │   Match     │         │   MongoDB   │
                    │  Generation │         │     DB      │
                    └────────────┘         └─────────────┘
```

### 🎮 Fantasy Contest Flow
```
┌──────────┐     ┌─────────────┐     ┌─────────────┐     ┌──────────┐
│  Admin   │────▶│  Contest   │────▶│   Wallet    │────▶│  MongoDB │
│  Creates │     │  Service   │     │  Service    │     │    DB    │
│ Contest  │     └─────────────┘     └─────────────┘     └──────────┘
└──────────┘           │                    │
                      │ Join                │
                      ▼                    ▼
                 ┌──────────┐         ┌──────────┐
                 │  User    │         │  Leader  │
                 │  Joins   │────────▶│  board   │
                 └──────────┘         └──────────┘
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- Running backend server (typically at `http://localhost:5000`)

### Installation
  
```
bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install
# or
yarn install

# 3. Create environment file
cp .env.example .env

# 4. Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

---

## ⚙️ Environment Variables

Create a `.env` file in the frontend directory:

```
env
# API Configuration
VITE_API_URL=http://localhost:5000/api/v1
VITE_APP_NAME=Crick11 Admin

# Socket.io (optional)
VITE_SOCKET_URL=http://localhost:5000

# App Configuration
VITE_APP_ENV=development
```

---

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## 🌐 API Endpoints Reference

### 🔑 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| POST | `/api/v1/auth/forgot-password` | Forgot password |

### 👥 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | Get all users |
| GET | `/api/v1/users/me` | Get current user |
| GET | `/api/v1/users/:id` | Get user by ID |
| PUT | `/api/v1/users/me` | Update current user |

### 🏟️ Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/teams` | Create team |
| GET | `/api/v1/teams` | Get all teams |
| GET | `/api/v1/teams/:id` | Get team by ID |
| PUT | `/api/v1/teams/:id` | Update team |
| POST | `/api/v1/teams/:id/players` | Add player to team |

### 🎯 Matches

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/matches` | Create match |
| GET | `/api/v1/matches` | Get all matches |
| GET | `/api/v1/matches/live` | Get live matches |
| PATCH | `/api/v1/matches/:id/status` | Update match status |
| PATCH | `/api/v1/matches/:id/toss` | Update toss |

### 🏆 Tournaments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tournaments` | Create tournament |
| GET | `/api/v1/tournaments` | Get all tournaments |
| GET | `/api/v1/tournaments/:id` | Get tournament by ID |
| POST | `/api/v1/tournaments/:id/register` | Register team |
| GET | `/api/v1/tournaments/:id/points-table` | Get points table |

### 🎮 Contests

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/contests` | Create contest |
| GET | `/api/v1/contests` | Get all contests |
| GET | `/api/v1/contests/match/:matchId` | Get match contests |
| POST | `/api/v1/contests/:id/join` | Join contest |
| GET | `/api/v1/contests/:id/leaderboard` | Get leaderboard |

### 💳 Wallet

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/wallet` | Get wallet |
| GET | `/api/v1/wallet/transactions` | Get transactions |
| POST | `/api/v1/wallet/deposit` | Deposit money |
| POST | `/api/v1/wallet/withdraw` | Withdraw money |

---

## 🔌 Real-time Features

The application uses Socket.io for real-time updates:

```
javascript
// Socket Events
const socketEvents = {
  // Match events
  ballUpdate: 'ballUpdate',          // New ball bowled
  overComplete: 'overComplete',      // Over completed
  inningsStart: 'inningsStart',      // Innings started
  matchUpdate: 'matchUpdate',        // Match status changed
  matchResult: 'matchResult',        // Match completed
  
  // Notification events
  notification: 'notification',     // New notification
};
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License**.

---

<p align="center">
  <strong>Made with ❤️ Ganesh</strong>
</p>

<p align="center">
  <img src="https://komarev.com/ghpvc/?username=crick11&label=Profile%20Views&color=0e75b6&style=flat" alt="Profile Views" />
  <img src="https://img.shields.io/github/stars/crick11?style=social" alt="GitHub Stars" />
  <img src="https://img.shields.io/github/forks/crick11?style=social" alt="GitHub Forks" />
</p>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:1e3a8a,100:3b82f6&height=100&section=footer" width="100%" />
</p>
