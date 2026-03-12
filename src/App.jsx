import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useEffect } from 'react'
import DashboardLayout from './layout/DashboardLayout'
import ProtectedRoute from './layout/ProtectedRoute'
import Login from './pages/auth/Login'
import SearchResults from './pages/search/SearchResults'
import Dashboard from './pages/dashboard/Dashboard'
import UsersList from './pages/users/UsersList'
import ViewUser from './pages/users/ViewUser'
import CreateUser from './pages/users/CreateUser'
import EditUser from './pages/users/EditUser'
import TeamsList from './pages/teams/TeamsList'
import CreateTeam from './pages/teams/CreateTeam'
import PlayersList from './pages/players/PlayersList'
import CreatePlayer from './pages/players/CreatePlayer'
import MatchesList from './pages/matches/MatchesList'
import CreateMatch from './pages/matches/CreateMatch'
import LiveControl from './pages/matches/LiveControl'
import TournamentList from './pages/tournaments/TournamentList'
import CreateTournament from './pages/tournaments/CreateTournament'
import BlogList from './pages/blogs/BlogList'
import CreateBlog from './pages/blogs/CreateBlog'
import NewsList from './pages/news/NewsList'
import CreateNews from './pages/news/CreateNews'
import PostsList from './pages/community/PostsList'
import ReportedPosts from './pages/community/ReportedPosts'
import ProductsList from './pages/store/ProductsList'
import OrdersList from './pages/store/OrdersList'
import AddProduct from './pages/store/AddProduct'
import ClubsList from './pages/clubs/ClubsList'
import CreateClub from './pages/clubs/CreateClub'
import AssociationList from './pages/associations/AssociationList'
import CreateAssociation from './pages/associations/CreateAssociation'
import AwardsList from './pages/awards/AwardsList'
import CreateAward from './pages/awards/CreateAward'
import PlansList from './pages/subscriptions/PlansList'
import SubscribersList from './pages/subscriptions/SubscribersList'
import Settings from './pages/settings/Settings'
import Wallet from './pages/wallet/Wallet'
import Reports from './pages/reports/Reports'
import NotificationsList from './pages/notifications/NotificationsList'
import ContactList from './pages/contact/ContactList'
import ReviewsList from './pages/reviews/ReviewsList'
import PerformanceList from './pages/performance/PerformanceList'
import PlayerProfilesList from './pages/profiles/PlayerProfilesList'
import ContestsList from './pages/contests/ContestsList'
import CreateContest from './pages/contests/CreateContest'
import LeaderboardList from './pages/leaderboard/LeaderboardList'

// Admin Pages
import RoleManagement from './pages/admin/RoleManagement'
import SystemLogs from './pages/admin/SystemLogs'
import BackupRestore from './pages/admin/BackupRestore'
import EmailTemplates from './pages/admin/EmailTemplates'
import Analytics from './pages/admin/Analytics'
import ContentModeration from './pages/admin/ContentModeration'
import FinancialOverview from './pages/admin/FinancialOverview'
import UserVerifications from './pages/admin/UserVerifications'
import APIManagement from './pages/admin/APIManagement'
import MobileAppManager from './pages/admin/MobileAppManager'
import StoreManager from './pages/admin/StoreManager'
import ContestManager from './pages/admin/ContestManager'

import './App.css'
import CreateProfile from './pages/profiles/CreateProfile'
import BannerManagement from './pages/banners/BannerManagement'
import FeatureToggles from './pages/settings/FeatureToggles'

// Professional Logger Utility
const Logger = {
  // Timestamp formatter
  _timestamp: () => {
    return new Date().toISOString()
  },

  // Route logging
  route: (message, data = {}) => {
    console.log(
      `%c[ROUTE] ${Logger._timestamp()} - ${message}`,
      'color: #2196F3; font-weight: bold; background: #E3F2FD; padding: 2px 4px; border-radius: 2px;',
      data
    )
  },

  // Error logging
  error: (message, error = {}, location = '') => {
    console.error(
      `%c[ERROR] ${Logger._timestamp()} - ${message}`,
      'color: #F44336; font-weight: bold; background: #FFEBEE; padding: 2px 4px; border-radius: 2px;',
      {
        location,
        error: error.message || error,
        stack: error.stack,
        timestamp: Logger._timestamp()
      }
    )
  },

  // Warning logging
  warn: (message, data = {}) => {
    console.warn(
      `%c[WARN] ${Logger._timestamp()} - ${message}`,
      'color: #FF9800; font-weight: bold; background: #FFF3E0; padding: 2px 4px; border-radius: 2px;',
      data
    )
  },

  // Success logging
  success: (message, data = {}) => {
    console.log(
      `%c[SUCCESS] ${Logger._timestamp()} - ${message}`,
      'color: #4CAF50; font-weight: bold; background: #E8F5E9; padding: 2px 4px; border-radius: 2px;',
      data
    )
  },

  // Info logging
  info: (message, data = {}) => {
    console.log(
      `%c[INFO] ${Logger._timestamp()} - ${message}`,
      'color: #9C27B0; font-weight: bold; background: #F3E5F5; padding: 2px 4px; border-radius: 2px;',
      data
    )
  },

  // Navigation logging
  navigation: (from, to, matched) => {
    console.log(
      `%c[NAVIGATION] ${Logger._timestamp()}`,
      'color: #FF5722; font-weight: bold; background: #FBE9E7; padding: 2px 4px; border-radius: 2px;',
      {
        from,
        to,
        matched,
        timestamp: Logger._timestamp()
      }
    )
  },

  // Component loading logging
  component: (name, status, props = {}) => {
    console.log(
      `%c[COMPONENT] ${Logger._timestamp()} - ${name}: ${status}`,
      'color: #795548; font-weight: bold; background: #EFEBE9; padding: 2px 4px; border-radius: 2px;',
      props
    )
  }
}

// Route Debug Component
function RouteDebugger({ children }) {
  const location = useLocation()
  const routes = [
    '/', '/dashboard', '/search', '/users', '/users/create', '/users/:id', '/users/:id/edit',
    '/teams', '/teams/create', '/players', '/players/create', '/matches', '/matches/create',
    '/matches/live', '/tournaments', '/tournaments/create', '/contests', '/contests/create',
    '/leaderboard', '/blogs', '/blogs/create', '/news', '/news/create',
    '/community/posts', '/community/reported', '/store/products', '/store/products/add',
    '/store/orders', '/clubs', '/clubs/create', '/associations', '/associations/create',
    '/awards', '/awards/create', '/subscriptions/plans', '/subscriptions/subscribers',
    '/wallet', '/reports', '/notifications', '/contact', '/reviews', '/performance',
    '/profiles', '/profiles/create', '/settings', '/banners', '/settings/features',
    '/admin/roles', '/admin/verifications', '/admin/logs', '/admin/backups',
    '/admin/email-templates', '/admin/api', '/admin/analytics', '/admin/finance',
    '/admin/moderation', '/admin/mobile-app', '/admin/store-manager', '/admin/contest-manager'
  ]

  useEffect(() => {
    // Log current route
    Logger.route(`Current location: ${location.pathname}`, {
      pathname: location.pathname,
      search: location.search,
      hash: location.hash,
      state: location.state
    })

    // Check if route matches any defined route
    const matchedRoute = routes.some(route => {
      // Convert route pattern to regex
      const pattern = route.replace(/:\w+/g, '([^/]+)')
      const regex = new RegExp(`^${pattern}$`)
      return regex.test(location.pathname)
    })

    if (!matchedRoute && location.pathname !== '/login') {
      Logger.warn(`Route not matched: ${location.pathname}`, {
        availableRoutes: routes,
        currentPath: location.pathname
      })
    }

    // Log all available routes on app start
    if (location.pathname === '/') {
      Logger.info('Available routes:', routes)
    }
  }, [location])

  return children
}

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    Logger.error('React Error Boundary caught an error', error, errorInfo)
    this.setState({ errorInfo })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', background: '#f8d7da', color: '#721c24', borderRadius: '4px' }}>
          <h2>Something went wrong</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            <summary>View Error Details</summary>
            <p>{this.state.error?.toString()}</p>
            <p>{this.state.errorInfo?.componentStack}</p>
          </details>
        </div>
      )
    }
    return this.props.children
  }
}

function App() {
  useEffect(() => {
    // Log app initialization
    Logger.success('Application initialized', {
      version: '1.0.0',
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    })

    // Log window events
    const handleError = (event) => {
      Logger.error('Uncaught error:', event.error, event.message)
    }

    const handleUnhandledRejection = (event) => {
      Logger.error('Unhandled promise rejection:', event.reason)
    }

    window.addEventListener('error', handleError)
    window.addEventListener('unhandledrejection', handleUnhandledRejection)

    return () => {
      window.removeEventListener('error', handleError)
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
    }
  }, [])

  // Component load logging wrapper
  const withLogging = (Component, name) => {
    return (props) => {
      useEffect(() => {
        Logger.component(name, 'loaded', props)
        return () => Logger.component(name, 'unmounted')
      }, [])
      return <Component {...props} />
    }
  }

  return (
    <ErrorBoundary>
      <Router>
        <RouteDebugger>
          <div className="min-h-screen bg-gray-50">
            <Routes>
              {/* Public Routes */}
              <Route 
                path="/login" 
                element={
                  <Login />
                } 
              />
              
              {/* Protected Routes */}
              <Route path="/" element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="search" element={<SearchResults />} />
                
                {/* User Routes */}
                <Route path="users" element={<UsersList />} />
                <Route path="users/create" element={<CreateUser />} />
                <Route path="users/:id" element={<ViewUser />} />
                <Route path="users/:id/edit" element={<EditUser />} />
                <Route path="users/:id/toggle-status" element={<EditUser />} />
                
                {/* Team Routes */}
                <Route path="teams" element={<TeamsList />} />
                <Route path="teams/create" element={<CreateTeam />} />
                <Route path="teams/:id" element={<CreateTeam />} />
                <Route path="teams/:id/edit" element={<CreateTeam />} />
                
                {/* Player Routes */}
                <Route path="players" element={<PlayersList />} />
                <Route path="players/create" element={<CreatePlayer />} />
                <Route path="players/:id" element={<CreatePlayer />} />
                <Route path="players/:id/edit" element={<CreatePlayer />} />
                
                {/* Match Routes */}
                <Route path="matches" element={<MatchesList />} />
                <Route path="matches/create" element={<CreateMatch />} />
                <Route path="matches/live" element={<LiveControl />} />
                <Route path="matches/:id/edit" element={<CreateMatch />} />
                <Route path="matches/:id/live" element={<LiveControl />} />
                
                {/* Tournament Routes */}
                <Route path="tournaments" element={<TournamentList />} />
                <Route path="tournaments/create" element={<CreateTournament />} />
                <Route path="tournaments/:id/edit" element={<CreateTournament />} />
                
                {/* Contest Routes */}
                <Route path="contests" element={<ContestsList />} />
                <Route path="contests/create" element={<CreateContest />} />
                <Route path="contests/:id/edit" element={<CreateContest />} />
                
                {/* Leaderboard */}
                <Route path="leaderboard" element={<LeaderboardList />} />
                
                {/* Blog Routes */}
                <Route path="blogs" element={<BlogList />} />
                <Route path="blogs/create" element={<CreateBlog />} />
                <Route path="blogs/:id" element={<CreateBlog />} />
                <Route path="blogs/:id/edit" element={<CreateBlog />} />
                
                {/* News Routes */}
                <Route path="news" element={<NewsList />} />
                <Route path="news/create" element={<CreateNews />} />
                <Route path="news/:id/edit" element={<CreateNews />} />
                
                {/* Community Routes */}
                <Route path="community/posts" element={<PostsList />} />
                <Route path="community/reported" element={<ReportedPosts />} />
                
                {/* Store Routes */}
                <Route path="store/products" element={<ProductsList />} />
                <Route path="store/products/add" element={<AddProduct />} />
                <Route path="store/products/:id/edit" element={<AddProduct />} />
                <Route path="store/add-product" element={<AddProduct />} />
                <Route path="store/orders" element={<OrdersList />} />
                
                {/* Club Routes */}
                <Route path="clubs" element={<ClubsList />} />
                <Route path="clubs/create" element={<CreateClub />} />
                <Route path="clubs/:id/edit" element={<CreateClub />} />
                
                {/* Association Routes */}
                <Route path="associations" element={<AssociationList />} />
                <Route path="associations/create" element={<CreateAssociation />} />
                <Route path="associations/:id/edit" element={<CreateAssociation />} />
                
                {/* Award Routes */}
                <Route path="awards" element={<AwardsList />} />
                <Route path="awards/create" element={<CreateAward />} />
                <Route path="awards/:id/edit" element={<CreateAward />} />
                
                {/* Subscription Routes */}
                <Route path="subscriptions/plans" element={<PlansList />} />
                <Route path="subscriptions/subscribers" element={<SubscribersList />} />
                
                {/* Wallet & Reports */}
                <Route path="wallet" element={<Wallet />} />
                <Route path="reports" element={<Reports />} />
                
                {/* Notifications & Contact */}
                <Route path="notifications" element={<NotificationsList />} />
                <Route path="contact" element={<ContactList />} />
                <Route path="reviews" element={<ReviewsList />} />
                <Route path="performance" element={<PerformanceList />} />
                
                {/* Profile Routes */}
                <Route path="profiles" element={<PlayerProfilesList />} />
                <Route path="/profiles/create" element={<CreateProfile />} />
                
                {/* Settings & Banners */}
                <Route path="settings" element={<Settings />} />
                <Route path="banners" element={<BannerManagement />} />
                <Route path="settings/features" element={<FeatureToggles />} />
                
                {/* Admin Routes */}
                <Route path="admin/roles" element={<RoleManagement />} />
                <Route path="admin/verifications" element={<UserVerifications />} />
                <Route path="admin/logs" element={<SystemLogs />} />
                <Route path="admin/backups" element={<BackupRestore />} />
                <Route path="admin/email-templates" element={<EmailTemplates />} />
                <Route path="admin/api" element={<APIManagement />} />
                <Route path="admin/analytics" element={<Analytics />} />
                <Route path="admin/finance" element={<FinancialOverview />} />
                <Route path="admin/moderation" element={<ContentModeration />} />
                <Route path="admin/mobile-app" element={<MobileAppManager />} />
                <Route path="admin/store-manager" element={<StoreManager />} />
                <Route path="admin/contest-manager" element={<ContestManager />} />
                <Route path="admin/users/create" element={<CreateUser />} />
              </Route>

              {/* Catch-all route for 404 */}
              <Route path="*" element={
                <div style={{ padding: '40px', textAlign: 'center' }}>
                  <h1>404 - Page Not Found</h1>
                  <p>The route you're looking for doesn't exist.</p>
                  <button 
                    onClick={() => window.location.href = '/'}
                    style={{
                      padding: '10px 20px',
                      background: '#2196F3',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Go to Dashboard
                  </button>
                </div>
              } />
            </Routes>
            
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </RouteDebugger>
      </Router>
    </ErrorBoundary>
  )
}

export default App