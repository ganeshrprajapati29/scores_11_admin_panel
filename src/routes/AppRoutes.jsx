import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'
import ProtectedRoute from '../layout/ProtectedRoute'

// Auth
import Login from '../pages/auth/Login'

// Search
import SearchResults from '../pages/search/SearchResults'

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard'

// Users
import UsersList from '../pages/users/UsersList'
import ViewUser from '../pages/users/ViewUser'
import CreateUser from '../pages/users/CreateUser'
import EditUser from '../pages/users/EditUser'
import VerifiedUsers from '../pages/users/VerifiedUsers'
import Scorers from '../pages/users/Scorers'
import SuspendedUsers from '../pages/users/SuspendedUsers'

// Players
import PlayersList from '../pages/players/PlayersList'
import CreatePlayer from '../pages/players/CreatePlayer'

// Teams
import TeamsList from '../pages/teams/TeamsList'
import CreateTeam from '../pages/teams/CreateTeam'

// Matches
import MatchesList from '../pages/matches/MatchesList'
import CreateMatch from '../pages/matches/CreateMatch'
import LiveControl from '../pages/matches/LiveControl'

// Tournaments
import TournamentList from '../pages/tournaments/TournamentList'
import CreateTournament from '../pages/tournaments/CreateTournament'

// Contests
import ContestsList from '../pages/contests/ContestsList'
import CreateContest from '../pages/contests/CreateContest'

// Leaderboard
import LeaderboardList from '../pages/leaderboard/LeaderboardList'
import PlayerLeaderboard from '../pages/leaderboard/PlayerLeaderboard'
import TeamLeaderboard from '../pages/leaderboard/TeamLeaderboard'
import PlayerDetails from '../pages/players/PlayerDetails'
import AssociationDetails from '../pages/associations/AssociationDetails'

// Player Profiles
import PlayerProfilesList from '../pages/profiles/PlayerProfilesList'

// Blogs
import BlogList from '../pages/blogs/BlogList'
import CreateBlog from '../pages/blogs/CreateBlog'

// News
import NewsList from '../pages/news/NewsList'
import CreateNews from '../pages/news/CreateNews'

// Community
import PostsList from '../pages/community/PostsList'
import ReportedPosts from '../pages/community/ReportedPosts'

// Store
import ProductsList from '../pages/store/ProductsList'
import OrdersList from '../pages/store/OrdersList'
import AddProduct from '../pages/store/AddProduct'

// Clubs
import ClubsList from '../pages/clubs/ClubsList'
import CreateClub from '../pages/clubs/CreateClub'

// Associations
import AssociationList from '../pages/associations/AssociationList'
import CreateAssociation from '../pages/associations/CreateAssociation'

// Awards
import AwardsList from '../pages/awards/AwardsList'
import CreateAward from '../pages/awards/CreateAward'

// Subscriptions
import PlansList from '../pages/subscriptions/PlansList'
import SubscribersList from '../pages/subscriptions/SubscribersList'

// Wallet
import Wallet from '../pages/wallet/Wallet'

// Performance
import PerformanceList from '../pages/performance/PerformanceList'

// Notifications
import NotificationsList from '../pages/notifications/NotificationsList'

// Contact
import ContactList from '../pages/contact/ContactList'

// Reviews
import ReviewsList from '../pages/reviews/ReviewsList'

// Reports
import Reports from '../pages/reports/Reports'

// Settings
import Settings from '../pages/settings/Settings'
import FeatureToggles from '../pages/settings/FeatureToggles'

// Admin Pages
import RoleManagement from '../pages/admin/RoleManagement'
import SystemLogs from '../pages/admin/SystemLogs'
import BackupRestore from '../pages/admin/BackupRestore'
import EmailTemplates from '../pages/admin/EmailTemplates'
import Analytics from '../pages/admin/Analytics'
import ContentModeration from '../pages/admin/ContentModeration'
import FinancialOverview from '../pages/admin/FinancialOverview'
import UserVerifications from '../pages/admin/UserVerifications'
import APIManagement from '../pages/admin/APIManagement'
import MobileAppManager from '../pages/admin/MobileAppManager'
import StoreManager from '../pages/admin/StoreManager'
import ContestManager from '../pages/admin/ContestManager'

// Banners
import BannerManagement from '../pages/banners/BannerManagement'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes with Dashboard Layout */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        
        {/* Dashboard - Default Route */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Search */}
        <Route path="/search" element={<SearchResults />} />
        
        {/* ========== USER MANAGEMENT ========== */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/:id/edit" element={<EditUser />} />
        <Route path="/users/:id" element={<ViewUser />} />
        <Route path="/users/verified" element={<VerifiedUsers />} />
        <Route path="/users/scorers" element={<Scorers />} />
        <Route path="/users/suspended" element={<SuspendedUsers />} />
        
        {/* Admin User Routes */}
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/users/:id/edit" element={<EditUser />} />
        <Route path="/admin/users/:id" element={<ViewUser />} />
        
        {/* ========== CRICKET OPERATIONS ========== */}
        {/* Teams */}
        <Route path="/teams" element={<TeamsList />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/teams/:id" element={<TeamsList />} />
        <Route path="/teams/:id/edit" element={<CreateTeam />} />
        <Route path="/teams/approvals" element={<TeamsList />} />
        
        {/* Matches - Order matters: static routes before dynamic */}
        <Route path="/matches" element={<MatchesList />} />
        <Route path="/matches/create" element={<CreateMatch />} />
        <Route path="/matches/live" element={<LiveControl />} />
        <Route path="/matches/:id" element={<MatchesList />} />
        <Route path="/matches/:id/live" element={<LiveControl />} />
        <Route path="/matches/:id/edit" element={<CreateMatch />} />
        
        {/* Tournaments */}
        <Route path="/tournaments" element={<TournamentList />} />
        <Route path="/tournaments/create" element={<CreateTournament />} />
        <Route path="/tournaments/:id" element={<TournamentList />} />
        <Route path="/tournaments/:id/edit" element={<CreateTournament />} />
        
        {/* Players */}
        <Route path="/players" element={<PlayersList />} />
        <Route path="/players/create" element={<CreatePlayer />} />
        <Route path="/players/:id/details" element={<PlayerDetails />} />
        <Route path="/players/:id/edit" element={<CreatePlayer />} />
        <Route path="/players/:id" element={<PlayersList />} />
        
        {/* Contests */}
        <Route path="/contests" element={<ContestsList />} />
        <Route path="/contests/create" element={<CreateContest />} />
        <Route path="/contests/:id" element={<ContestsList />} />
        <Route path="/contests/:id/edit" element={<CreateContest />} />
        
        {/* Leaderboard */}
        <Route path="/leaderboard" element={<LeaderboardList />} />
        <Route path="/leaderboard/players" element={<PlayerLeaderboard />} />
        <Route path="/leaderboard/teams" element={<TeamLeaderboard />} />
        <Route path="/leaderboard/:id" element={<LeaderboardList />} />
        <Route path="/leaderboard/:id/edit" element={<LeaderboardList />} />
        
        {/* Player Profiles */}
        <Route path="/profiles" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/edit" element={<PlayerProfilesList />} />
        
        {/* ========== COMMERCE & FINANCE ========== */}
        {/* Store */}
        <Route path="/store/products" element={<ProductsList />} />
        <Route path="/store/products/add" element={<AddProduct />} />
        <Route path="/store/add-product" element={<AddProduct />} />
        <Route path="/store/orders" element={<OrdersList />} />
        <Route path="/store/products/:id" element={<ProductsList />} />
        <Route path="/store/products/:id/edit" element={<AddProduct />} />
        
        {/* Wallet */}
        <Route path="/wallet" element={<Wallet />} />
        
        {/* Subscriptions */}
        <Route path="/subscriptions/plans" element={<PlansList />} />
        <Route path="/subscriptions/subscribers" element={<SubscribersList />} />
        
        {/* ========== CONTENT MANAGEMENT ========== */}
        {/* Blogs */}
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/blogs/:id" element={<BlogList />} />
        
        {/* News */}
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/create" element={<CreateNews />} />
        <Route path="/news/:id" element={<NewsList />} />
        
        {/* Community */}
        <Route path="/community/posts" element={<PostsList />} />
        <Route path="/community/reported" element={<ReportedPosts />} />
        
        {/* ========== ORGANIZATIONS ========== */}
        {/* Clubs */}
        <Route path="/clubs" element={<ClubsList />} />
        <Route path="/clubs/create" element={<CreateClub />} />
        <Route path="/clubs/:id" element={<ClubsList />} />
        <Route path="/clubs/:id/edit" element={<CreateClub />} />
        
        {/* Associations */}
        <Route path="/associations" element={<AssociationList />} />
        <Route path="/associations/create" element={<CreateAssociation />} />
        <Route path="/associations/:id" element={<AssociationDetails />} />
        <Route path="/associations/:id/edit" element={<CreateAssociation />} />
        
        {/* Awards */}
        <Route path="/awards" element={<AwardsList />} />
        <Route path="/awards/create" element={<CreateAward />} />
        <Route path="/awards/:id" element={<AwardsList />} />
        <Route path="/awards/:id/edit" element={<CreateAward />} />
        
        {/* ========== ANALYTICS & REPORTS ========== */}
        <Route path="/performance" element={<PerformanceList />} />
        <Route path="/reports" element={<Reports />} />
        
        {/* ========== SYSTEM & SETTINGS ========== */}
        <Route path="/notifications" element={<NotificationsList />} />
        <Route path="/contact" element={<ContactList />} />
        <Route path="/reviews" element={<ReviewsList />} />
        <Route path="/settings" element={<Settings />} />
        
        {/* ========== ADMIN ROUTES ========== */}
        {/* Core Admin - Mobile App Control */}
        <Route path="/admin/mobile-app" element={<MobileAppManager />} />
        
        {/* Core Admin - Store Manager */}
        <Route path="/admin/store-manager" element={<StoreManager />} />
        
        {/* Core Admin - Contest Manager */}
        <Route path="/admin/contest-manager" element={<ContestManager />} />
        
        {/* User Management Admin */}
        <Route path="/admin/roles" element={<RoleManagement />} />
        <Route path="/admin/verifications" element={<UserVerifications />} />
        
        {/* System Admin */}
        <Route path="/admin/logs" element={<SystemLogs />} />
        <Route path="/admin/backups" element={<BackupRestore />} />
        <Route path="/admin/email-templates" element={<EmailTemplates />} />
        <Route path="/admin/api" element={<APIManagement />} />
        
        {/* Analytics Admin */}
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/finance" element={<FinancialOverview />} />
        
        {/* Content Admin */}
        <Route path="/admin/moderation" element={<ContentModeration />} />
        
      {/* Banner Management */}
        <Route path="/banners" element={<BannerManagement />} />
        <Route path="/admin/banners" element={<BannerManagement />} />
        
        {/* Feature Toggles */}
        <Route path="/settings/features" element={<FeatureToggles />} />
        <Route path="/admin/features" element={<FeatureToggles />} />
        
      </Route>
      
      {/* Catch all - Redirect to Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
