import { Routes, Route, Navigate } from 'react-router-dom'
import DashboardLayout from '../layout/DashboardLayout'
import ProtectedRoute from '../layout/ProtectedRoute'

// Auth
import Login from '../pages/auth/Login'

// Dashboard
import Dashboard from '../pages/dashboard/Dashboard'

// Users
import UsersList from '../pages/users/UsersList'
import ViewUser from '../pages/users/ViewUser'
import CreateUser from '../pages/users/CreateUser'
import EditUser from '../pages/users/EditUser'

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

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Users - Note: /users/create must come BEFORE /users/:id to avoid route matching issues */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/:id/edit" element={<EditUser />} />
        <Route path="/users/:id" element={<ViewUser />} />
        
        {/* Admin Users - Routes with /admin prefix */}
        {/* Note: /admin/users/create must come BEFORE /admin/users/:id to avoid route matching issues */}
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/users/:id/edit" element={<EditUser />} />
        <Route path="/admin/users/:id" element={<ViewUser />} />


        
        {/* Teams */}
        <Route path="/teams" element={<TeamsList />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        
        {/* Matches */}
        <Route path="/matches" element={<MatchesList />} />
        <Route path="/matches/create" element={<CreateMatch />} />
        <Route path="/matches/:id/live" element={<LiveControl />} />
        
        {/* Tournaments */}
        <Route path="/tournaments" element={<TournamentList />} />
        <Route path="/tournaments/create" element={<CreateTournament />} />
        
        {/* Blogs */}
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        
        {/* News */}
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/create" element={<CreateNews />} />
        
        {/* Community */}
        <Route path="/community/posts" element={<PostsList />} />
        <Route path="/community/reported" element={<ReportedPosts />} />
        
        {/* Store */}
        <Route path="/store/products" element={<ProductsList />} />
        <Route path="/store/products/add" element={<AddProduct />} />
        <Route path="/store/add-product" element={<AddProduct />} />
        <Route path="/store/orders" element={<OrdersList />} />
        
        {/* Clubs */}
        <Route path="/clubs" element={<ClubsList />} />
        <Route path="/clubs/create" element={<CreateClub />} />
        
        {/* Associations */}
        <Route path="/associations" element={<AssociationList />} />
        <Route path="/associations/create" element={<CreateAssociation />} />
        
        {/* Awards */}
        <Route path="/awards" element={<AwardsList />} />
        <Route path="/awards/create" element={<CreateAward />} />
        
        {/* Subscriptions */}
        <Route path="/subscriptions/plans" element={<PlansList />} />
        <Route path="/subscriptions/subscribers" element={<SubscribersList />} />
        
        {/* Players */}
        <Route path="/players" element={<PlayersList />} />
        <Route path="/players/create" element={<CreatePlayer />} />
        <Route path="/players/:id" element={<CreatePlayer />} />
        <Route path="/players/:id/edit" element={<CreatePlayer />} />
        
        {/* Contests */}
        <Route path="/contests" element={<ContestsList />} />
        <Route path="/contests/create" element={<CreateContest />} />
        
        {/* Leaderboard */}
        <Route path="/leaderboard" element={<LeaderboardList />} />
        
        {/* Player Profiles */}
        <Route path="/profiles" element={<PlayerProfilesList />} />
        
        {/* Wallet */}
        <Route path="/wallet" element={<Wallet />} />
        
        {/* Performance */}
        <Route path="/performance" element={<PerformanceList />} />
        
        {/* Notifications */}
        <Route path="/notifications" element={<NotificationsList />} />
        
        {/* Contact */}
        <Route path="/contact" element={<ContactList />} />
        
        {/* Reviews */}
        <Route path="/reviews" element={<ReviewsList />} />
        
        {/* Reports */}
        <Route path="/reports" element={<Reports />} />
        
        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
        
        {/* Admin Routes */}
        <Route path="/admin/roles" element={<RoleManagement />} />
        <Route path="/admin/logs" element={<SystemLogs />} />
        <Route path="/admin/backups" element={<BackupRestore />} />
        <Route path="/admin/email-templates" element={<EmailTemplates />} />
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/moderation" element={<ContentModeration />} />
        <Route path="/admin/finance" element={<FinancialOverview />} />
        <Route path="/admin/verifications" element={<UserVerifications />} />
        <Route path="/admin/api" element={<APIManagement />} />
        
        {/* New Core Admin Routes */}
        <Route path="/admin/mobile-app" element={<MobileAppManager />} />
        <Route path="/admin/store-manager" element={<StoreManager />} />
        <Route path="/admin/contest-manager" element={<ContestManager />} />
      </Route>

      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
