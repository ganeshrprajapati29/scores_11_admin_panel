# Crick11 Admin Dashboard

A comprehensive admin dashboard for cricket tournament management built with React, Vite, and Tailwind CSS. This is the frontend application that connects to the Crick11 Backend API.

![React](https://img.shields.io/badge/React-18.2-blue)
![Vite](https://img.shields.io/badge/Vite-5.0-purple)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![License](https://img.shields.io/badge/License-MIT-yellow)

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [API Integration](#api-integration)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Key Components](#key-components)
- [State Management](#state-management)
- [Routing](#routing)
- [API Endpoints Reference](#api-endpoints-reference)
- [Real-time Features](#real-time-features)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Crick11 Admin Dashboard is a full-featured administration panel for managing cricket tournaments, matches, teams, players, contests, and more. It provides a modern, responsive interface for administrators to manage all aspects of a cricket platform similar to CricHeroes or Dream11.

### Core Capabilities

- **Complete Cricket Management**: Manage tournaments, matches, teams, and players
- **Fantasy Contest System**: Create and manage fantasy cricket contests
- **Real-time Updates**: Live match scoring with Socket.io
- **E-commerce Store**: Manage products and orders
- **Content Management**: Blogs, news, and community posts
- **User Management**: Role-based access control (Admin, User)
- **Wallet System**: Deposit, withdraw, and transaction management

---

## Features

### Core Features
- **Dashboard** - Overview with statistics, charts, and key metrics
- **User Management** - Create, view, edit users, role management
- **Team Management** - CRUD operations, player management, captain/vice-captain selection
- **Match Management** - Create, schedule, live control, completed matches
- **Ball-by-Ball Scoring** - Real-time scoring with over summaries
- **Tournament Management** - League, Knockout, Points Table generation
- **Player Management** - Profiles, stats, batting/bowling/fielding records
- **Fantasy Contests** - Create contests, join contests, leaderboards
- **Wallet Management** - Deposits, withdrawals, transfers, contest entries
- **Leaderboards** - Player rankings, team rankings, tournament rankings

### Additional Features
- **Player Profiles** - Detailed player career statistics
- **Blog & News** - Content management system
- **Store** - E-commerce product and order management
- **Community** - Post moderation and management
- **Performance Tracking** - Player performance analytics
- **Reviews** - User review management
- **Notifications** - Push notification management
- **Subscriptions** - Subscription plan management
- **Clubs & Associations** - Cricket clubs and associations
- **Awards** - Award management
- **Contact Management** - Contact form submissions
- **Settings** - Application configuration

---

## Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| React | UI Framework | 18.2.0 |
| Vite | Build Tool | 5.0.8 |
| Tailwind CSS | Styling | 3.4.19 |
| Zustand | State Management | 4.4.7 |
| React Router DOM | Routing | 6.20.0 |
| Axios | HTTP Client | 1.6.2 |
| Lucide React | Icons | 0.294.0 |
| Recharts | Charts | 2.10.3 |
| React Select | Dropdowns | 5.8.0 |
| React Dropzone | File Upload | 14.2.3 |
| React Quill | Rich Text Editor | 2.0.0 |
| React Hot Toast | Notifications | 2.4.1 |
| Date-fns | Date Utilities | 2.30.0 |
| clsx | Class Utilities | 2.0.0 |
| tailwind-merge | Tailwind Merge | 2.1.0 |
| React Paginate | Pagination | 8.2.0 |

---

## Project Structure

```
frontend/
├── src/
│   ├── assets/                  # Static assets (images, icons)
│   │
│   ├── components/              # Reusable React components
│   │   ├── charts/              # Chart components
│   │   │   ├── LineChart.jsx
│   │   │   ├── BarChart.jsx
│   │   │   └── PieChart.jsx
│   │   │
│   │   ├── common/              # Common UI components
│   │   │   ├── Button.jsx       # Reusable button component
│   │   │   ├── Input.jsx        # Form input component
│   │   │   ├── Modal.jsx         # Modal/dialog component
│   │   │   ├── Table.jsx        # Data table component
│   │   │   ├── Loader.jsx       # Loading spinner
│   │   │   ├── Pagination.jsx   # Pagination controls
│   │   │   └── ConfirmDialog.jsx # Confirmation dialog
│   │   │
│   │   └── forms/               # Form components
│   │       ├── UserForm.jsx
│   │       ├── TeamForm.jsx
│   │       ├── MatchForm.jsx
│   │       ├── ProductForm.jsx
│   │       ├── BlogForm.jsx
│   │       └── AwardForm.jsx
│   │
│   ├── config/                  # Configuration files
│   │   ├── axiosConfig.js       # Axios instance setup
│   │   └── routesConfig.js      # Route definitions
│   │
│   ├── context/                 # React Context providers
│   │   ├── AuthContext.jsx      # Authentication context
│   │   ├── ThemeContext.jsx     # Theme management
│   │   └── SocketContext.jsx    # Socket.io connection
│   │
│   ├── hooks/                   # Custom React hooks
│   │   ├── useAuth.js           # Authentication hook
│   │   ├── useFetch.js          # Data fetching hook
│   │   └── useSocket.js         # Socket connection hook
│   │
│   ├── layout/                  # Layout components
│   │   ├── DashboardLayout.jsx  # Main dashboard layout
│   │   ├── Navbar.jsx           # Top navigation bar
│   │   ├── Sidebar.jsx          # Side navigation
│   │   └── ProtectedRoute.jsx   # Route protection
│   │
│   ├── pages/                   # Page components
│   │   ├── auth/
│   │   │   └── Login.jsx        # Login page
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx   # Dashboard overview
│   │   ├── users/
│   │   │   ├── UsersList.jsx
│   │   │   ├── CreateUser.jsx
│   │   │   ├── EditUser.jsx
│   │   │   └── ViewUser.jsx
│   │   ├── teams/
│   │   │   ├── TeamsList.jsx
│   │   │   └── CreateTeam.jsx
│   │   ├── matches/
│   │   │   ├── MatchesList.jsx
│   │   │   ├── CreateMatch.jsx
│   │   │   └── LiveControl.jsx
│   │   ├── tournaments/
│   │   │   ├── TournamentList.jsx
│   │   │   └── CreateTournament.jsx
│   │   ├── players/
│   │   │   ├── PlayersList.jsx
│   │   │   └── CreatePlayer.jsx
│   │   ├── contests/
│   │   │   ├── ContestsList.jsx
│   │   │   └── CreateContest.jsx
│   │   ├── leaderboard/
│   │   │   └── LeaderboardList.jsx
│   │   ├── wallet/
│   │   │   └── Wallet.jsx
│   │   ├── blogs/
│   │   │   ├── BlogList.jsx
│   │   │   └── CreateBlog.jsx
│   │   ├── news/
│   │   │   ├── NewsList.jsx
│   │   │   └── CreateNews.jsx
│   │   ├── community/
│   │   │   ├── PostsList.jsx
│   │   │   └── ReportedPosts.jsx
│   │   ├── store/
│   │   │   ├── ProductsList.jsx
│   │   │   ├── AddProduct.jsx
│   │   │   └── OrdersList.jsx
│   │   ├── clubs/
│   │   │   ├── ClubsList.jsx
│   │   │   └── CreateClub.jsx
│   │   ├── associations/
│   │   │   ├── AssociationList.jsx
│   │   │   └── CreateAssociation.jsx
│   │   ├── awards/
│   │   │   ├── AwardsList.jsx
│   │   │   └── CreateAward.jsx
│   │   ├── subscriptions/
│   │   │   └── PlansList.jsx
│   │   ├── performance/
│   │   │   └── PerformanceList.jsx
│   │   ├── profiles/
│   │   │   └── PlayerProfilesList.jsx
│   │   ├── notifications/
│   │   │   └── NotificationsList.jsx
│   │   ├── contact/
│   │   │   └── ContactList.jsx
│   │   ├── reviews/
│   │   │   └── ReviewsList.jsx
│   │   ├── reports/
│   │   │   └── Reports.jsx
│   │   ├── settings/
│   │   │   └── Settings.jsx
│   │   └── subscriptions/
│   │       └── SubscribersList.jsx
│   │
│   ├── routes/                  # Routing configuration
│   │   ├── AppRoutes.jsx        # Main routes
│   │   └── App.jsx              # App component
│   │
│   ├── services/                 # API service modules
│   │   ├── api.js               # Base API configuration
│   │   ├── auth.service.js      # Authentication API
│   │   ├── user.service.js      # User management API
│   │   ├── team.service.js      # Team API
│   │   ├── player.service.js    # Player API
│   │   ├── match.service.js     # Match API
│   │   ├── tournament.service.js # Tournament API
│   │   ├── blog.service.js      # Blog API
│   │   ├── wallet.service.js    # Wallet API
│   │   ├── contest.service.js   # Contest API
│   │   ├── leaderboard.service.js
│   │   ├── notification.service.js
│   │   ├── contact.service.js
│   │   ├── review.service.js
│   │   └── performance.service.js
│   │
│   ├── store/                   # Zustand stores
│   │   ├── index.js             # Store configuration
│   │   ├── userSlice.js         # User state
│   │   ├── matchSlice.js        # Match state
│   │   ├── tournamentSlice.js   # Tournament state
│   │   └── authStore.js         # Auth state
│   │
│   ├── utils/                   # Utility functions
│   │   ├── helpers.js           # Helper functions
│   │   ├── constants.js         # App constants
│   │   ├── formatDate.js        # Date formatting
│   │   └── permissions.js        # Permission utilities
│   │
│   ├── App.css                  # Global styles
│   ├── App.jsx                  # Root component
│   ├── index.css                # Tailwind imports
│   └── main.jsx                 # Entry point
│
├── public/                      # Public assets
│   └── vite.svg                # Vite logo
│
├── index.html                   # HTML entry point
├── package.json                 # Dependencies
├── tailwind.config.js           # Tailwind configuration
├── postcss.config.js            # PostCSS configuration
├── vite.config.js               # Vite configuration
└── eslint.config.js             # ESLint configuration
```

---

## API Integration

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (React)                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐│
│  │  Components │  │    Hooks     │  │      Zustand Store      ││
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
│  │                      Routes                                ││
│  │  /api/v1/auth, /api/v1/users, /api/v1/teams, ...           ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Controllers                             ││
│  │  AuthController, UserController, TeamController, ...      ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Services                                ││
│  │  AuthService, UserService, TeamService, ...                ││
│  └─────────────────────────────────────────────────────────────┘│
│                              │                                  │
│                              ▼                                  │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │              Database (MongoDB via Mongoose)               ││
│  │  Users, Teams, Players, Matches, Tournaments, ...         ││
│  └─────────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘
```

### Service Layer Pattern

Each feature has its own service file that encapsulates API calls:

```
javascript
// Example: team.service.js
import axios from './api';

export const teamService = {
  getAll: () => axios.get('/teams'),
  getById: (id) => axios.get(`/teams/${id}`),
  create: (data) => axios.post('/teams', data),
  update: (id, data) => axios.put(`/teams/${id}`, data),
  delete: (id) => axios.delete(`/teams/${id}`),
  addPlayer: (teamId, playerId) => axios.post(`/teams/${teamId}/players`, { playerId }),
  removePlayer: (teamId, playerId) => axios.delete(`/teams/${teamId}/players/${playerId}`),
  setCaptain: (teamId, playerId) => axios.post(`/teams/${teamId}/captain`, { playerId }),
  uploadLogo: (teamId, formData) => axios.post(`/teams/${teamId}/logo`, formData),
};
```

---

## Data Flow Diagrams

### User Authentication Flow

```
┌──────────┐     ┌──────────┐     ┌──────────┐     ┌──────────┐
│  Login   │────▶│  Axios   │────▶│  Backend │────▶│ MongoDB  │
│  Page    │     │ Service  │     │   API    │     │   DB     │
└──────────┘     └──────────┘     └──────────┘     └──────────┘
      │                                                    │
      │ Response                                           │
      │ (JWT Token)                                        │
      ▼                                                    │
┌──────────┐                                               │
│  Zustand │◀──────────────────┘
│  Store   │
└──────────┘
      │
      ▼
┌──────────┐
│ Protected │
│  Routes   │
└──────────┘
```

### Match Management Flow

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

### Tournament & Points Table Flow

```
┌─────────────┐     ┌────────────────┐     ┌─────────────┐
│  Tournament │     │   Tournament   │     │   Points    │
│  Creation   │────▶│    Service     │────▶│   Table     │
└─────────────┘     └────────────────┘     └─────────────┘
                           │                       │
                           │ Generate              │
                           ▼                       ▼
                    ┌─────────────┐         ┌─────────────┐
                    │   Match     │         │   MongoDB   │
                    │  Generation │         │     DB      │
                    └─────────────┘         └─────────────┘
```

### Fantasy Contest Flow

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

### Real-time Score Updates

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Scoring   │     │   Socket    │     │  Frontend   │
│   Panel     │────▶│   Server    │────▶│  (Live)     │
└─────────────┘     └─────────────┘     └─────────────┘
                           │
                           │ Events:
                           │ - ballUpdate
                           │ - overComplete
                           │ - inningsStart
                           │ - matchUpdate
                           ▼
                    ┌─────────────┐
                    │   Socket    │
                    │  Context    │
                    └─────────────┘
```

---

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn
- Running backend server (typically at http://localhost:5000)

### Installation

1. **Clone the repository**
   
```
bash
   cd crick11
   
```

2. **Navigate to frontend directory**
   
```
bash
   cd frontend
   
```

3. **Install dependencies**
   
```bash
   npm install
   # or
   yarn install
   
```

4. **Create environment file**
   
```
bash
   cp .env.example .env
   
```

5. **Start development server**
   
```
bash
   npm run dev
   
```

The application will be available at `http://localhost:5173`

---

## Environment Variables

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

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |

---

## Key Components

### Common Components

1. **Button** - Reusable button with variants (primary, secondary, danger)
2. **Input** - Form input with validation support
3. **Modal** - Reusable modal/dialog
4. **Table** - Data table with sorting and pagination
5. **Loader** - Loading spinner
6. **Pagination** - Page navigation
7. **ConfirmDialog** - Confirmation dialog

### Chart Components

1. **LineChart** - For trends over time
2. **BarChart** - For comparisons
3. **PieChart** - For distribution

---

## State Management

The application uses **Zustand** for state management with the following stores:

```
javascript
// Store structure
├── authStore.js      // User authentication state
├── userSlice.js      // User data
├── matchSlice.js     // Match data
└── tournamentSlice.js // Tournament data
```

### Example: Auth Store

```
javascript
import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  
  login: (user, token) => set({ user, token, isAuthenticated: true }),
  logout: () => set({ user: null, token: null, isAuthenticated: false }),
}));
```

---

## Routing

The application uses React Router v6 with protected routes:

```
javascript
// Route Structure
<Routes>
  <Route path="/login" element={<Login />} />
  
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/users" element={<UsersList />} />
    <Route path="/teams" element={<TeamsList />} />
    <Route path="/matches" element={<MatchesList />} />
    {/* ... more routes */}
  </Route>
</Routes>
```

---

## API Endpoints Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/register` | Register new user |
| POST | `/api/v1/auth/login` | User login |
| POST | `/api/v1/auth/logout` | User logout |
| POST | `/api/v1/auth/refresh-token` | Refresh access token |
| POST | `/api/v1/auth/forgot-password` | Forgot password |
| POST | `/api/v1/auth/reset-password` | Reset password |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/users` | Get all users |
| GET | `/api/v1/users/me` | Get current user |
| GET | `/api/v1/users/:id` | Get user by ID |
| PUT | `/api/v1/users/me` | Update current user |
| DELETE | `/api/v1/users/:id` | Delete user |

### Teams

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/teams` | Create team |
| GET | `/api/v1/teams` | Get all teams |
| GET | `/api/v1/teams/:id` | Get team by ID |
| PUT | `/api/v1/teams/:id` | Update team |
| DELETE | `/api/v1/teams/:id` | Delete team |
| POST | `/api/v1/teams/:id/players` | Add player to team |
| POST | `/api/v1/teams/:id/captain` | Set team captain |

### Matches

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/matches` | Create match |
| GET | `/api/v1/matches` | Get all matches |
| GET | `/api/v1/matches/live` | Get live matches |
| GET | `/api/v1/matches/upcoming` | Get upcoming matches |
| GET | `/api/v1/matches/completed` | Get completed matches |
| PATCH | `/api/v1/matches/:id/status` | Update match status |
| PATCH | `/api/v1/matches/:id/toss` | Update toss |

### Tournaments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/tournaments` | Create tournament |
| GET | `/api/v1/tournaments` | Get all tournaments |
| GET | `/api/v1/tournaments/ongoing` | Get ongoing tournaments |
| GET | `/api/v1/tournaments/:id` | Get tournament by ID |
| PUT | `/api/v1/tournaments/:id` | Update tournament |
| POST | `/api/v1/tournaments/:id/register` | Register team |
| GET | `/api/v1/tournaments/:id/points-table` | Get points table |

### Contests

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/contests` | Create contest |
| GET | `/api/v1/contests` | Get all contests |
| GET | `/api/v1/contests/match/:matchId` | Get match contests |
| POST | `/api/v1/contests/:id/join` | Join contest |
| GET | `/api/v1/contests/:id/leaderboard` | Get leaderboard |

### Wallet

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/wallet` | Get wallet |
| GET | `/api/v1/wallet/transactions` | Get transactions |
| POST | `/api/v1/wallet/deposit` | Deposit money |
| POST | `/api/v1/wallet/withdraw` | Withdraw money |
| POST | `/api/v1/wallet/transfer` | Transfer to user |

### Leaderboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/leaderboard/players` | Player rankings |
| GET | `/api/v1/leaderboard/teams` | Team rankings |
| GET | `/api/v1/leaderboard/tournament/:id` | Tournament rankings |

---

## Real-time Features

The application uses Socket.io for real-time updates:

```
javascript
// Socket Events
const socketEvents = {
  // Match events
  ballUpdate: 'ballUpdate',          // New ball bowled
  overComplete: 'overComplete',      // Over completed
  inningsStart: 'inningsStart',      // Innings started
  inningsEnd: 'inningsEnd',          // Innings ended
  matchUpdate: 'matchUpdate',         // Match status changed
  matchResult: 'matchResult',        // Match completed
  
  // Notification events
  notification: 'notification',      // New notification
};
```

### Using Socket in Components

```
javascript
import { useSocket } from '../hooks/useSocket';

const MatchLiveControl = () => {
  const { socket } = useSocket();
  
  useEffect(() => {
    socket.on('ballUpdate', (data) => {
      // Update score
    });
    
    return () => socket.off('ballUpdate');
  }, [socket]);
};
```

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License.

---

<p align="center">Made with ❤️ for Cricket Management</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18.2-blue?style=for-the-badge&logo=react" alt="React">
  <img src="https://img.shields.io/badge/Vite-5.0-purple?style=for-the-badge&logo=vite" alt="Vite">
  <img src="https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css" alt="Tailwind">
</p>
#   s c o r e s _ 1 1 _ a d m i n _ p a n e l  
 