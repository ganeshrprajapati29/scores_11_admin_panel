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
import LoginHistory from '../pages/users/LoginHistory'
import UserReports from '../pages/users/UserReports'

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
import AdminPlayersList from '../pages/admin/AdminPlayersList'
import MergePlayers from '../pages/admin/MergePlayers'

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
        <Route path="/users/login-history" element={<LoginHistory />} />
        <Route path="/users/:id/login-history" element={<LoginHistory />} />
        <Route path="/users/reports" element={<UserReports />} />
        <Route path="/users/reports/:reportId/action" element={<UserReports />} />
        
        
        {/* Admin User Routes */}
        <Route path="/admin/users" element={<UsersList />} />
        <Route path="/admin/users/create" element={<CreateUser />} />
        <Route path="/admin/users/:id/edit" element={<EditUser />} />
        <Route path="/admin/users/:id" element={<ViewUser />} />
        <Route path="/admin/users/verified" element={<VerifiedUsers />} />
        <Route path="/admin/users/scorers" element={<Scorers />} />
        <Route path="/admin/users/suspended" element={<SuspendedUsers />} />
        
        
        {/* ========== CRICKET OPERATIONS ========== */}
        {/* Teams */}
        <Route path="/teams" element={<TeamsList />} />
        <Route path="/teams/create" element={<CreateTeam />} />
        <Route path="/teams/:id" element={<TeamsList />} />
        <Route path="/teams/:id/edit" element={<CreateTeam />} />
        <Route path="/teams/approvals" element={<TeamsList />} />
        <Route path="/teams/rankings" element={<TeamsList />} />
        <Route path="/teams/search" element={<TeamsList />} />
        <Route path="/teams/:id/players" element={<TeamsList />} />
        <Route path="/teams/:id/matches" element={<TeamsList />} />
        <Route path="/teams/:id/logo" element={<CreateTeam />} />
        <Route path="/teams/:id/transfer" element={<CreateTeam />} />
        <Route path="/teams/:id/verify" element={<CreateTeam />} />
        <Route path="/teams/:id/captain" element={<CreateTeam />} />
        <Route path="/teams/:id/vice-captain" element={<CreateTeam />} />
        <Route path="/teams/:id/players/add" element={<CreateTeam />} />
        <Route path="/teams/:id/players/remove" element={<CreateTeam />} />
        <Route path="/teams/:id/players/:playerId" element={<CreateTeam />} />
        <Route path="/teams/:id/players/:playerId/edit" element={<CreateTeam />} />
        <Route path="/teams/:id/players/:playerId/remove" element={<CreateTeam />} />
        <Route path="/teams/:id/players/:playerId/captain" element={<CreateTeam />} />
        <Route path="/teams/:id/players/:playerId/vice-captain" element={<CreateTeam />} />
        <Route path="/teams/:id/players/:playerId/logo" element={<CreateTeam />} />
        <Route path="/teams/:id/players/:playerId/transfer" element={<CreateTeam />} />
        <Route path="/teams/:id/players/:playerId/verify" element={<CreateTeam />} />
        
        {/* Matches - Order matters: static routes before dynamic */}
        <Route path="/matches" element={<MatchesList />} />
        <Route path="/matches/create" element={<CreateMatch />} />
        <Route path="/matches/live" element={<LiveControl />} />
        <Route path="/matches/:id" element={<MatchesList />} />
        <Route path="/matches/:id/live" element={<LiveControl />} />
        <Route path="/matches/:id/edit" element={<CreateMatch />} />
        <Route path="/matches/:id/score" element={<LiveControl />} />
        <Route path="/matches/:id/status" element={<LiveControl />} />
        <Route path="/matches/:id/teams" element={<MatchesList />} />
        <Route path="/matches/:id/players" element={<MatchesList />} />
        <Route path="/matches/:id/analytics" element={<MatchesList />} />
        <Route path="/matches/:id/notifications" element={<MatchesList />} />
        <Route path="/matches/:id/reports" element={<MatchesList />} />
        <Route path="/matches/:id/contests" element={<MatchesList />} />
        <Route path="/matches/:id/tournaments" element={<MatchesList />} />
        <Route path="/matches/:id/leaderboard" element={<MatchesList />} />
        <Route path="/matches/:id/venue" element={<MatchesList />} />
        <Route path="/matches/:id/umpires" element={<MatchesList />} />
        <Route path="/matches/:id/scorers" element={<MatchesList />} />
        
        
        {/* Tournaments */}
        <Route path="/tournaments" element={<TournamentList />} />
        <Route path="/tournaments/create" element={<CreateTournament />} />
        <Route path="/tournaments/:id" element={<TournamentList />} />
        <Route path="/tournaments/:id/edit" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams" element={<TournamentList />} />
        <Route path="/tournaments/:id/matches" element={<TournamentList />} />
        <Route path="/tournaments/:id/contests" element={<TournamentList />} />
        <Route path="/tournaments/:id/leaderboard" element={<TournamentList />} />
        <Route path="/tournaments/:id/analytics" element={<TournamentList />} />
        <Route path="/tournaments/:id/notifications" element={<TournamentList />} />
        <Route path="/tournaments/:id/reports" element={<TournamentList />} />
        <Route path="/tournaments/:id/venue" element={<TournamentList />} />
        <Route path="/tournaments/:id/umpires" element={<TournamentList />} />
        <Route path="/tournaments/:id/scorers" element={<TournamentList />} />
        <Route path="/tournaments/:id/players" element={<TournamentList />} />
        <Route path="/tournaments/:id/captain" element={<CreateTournament />} />
        <Route path="/tournaments/:id/vice-captain" element={<CreateTournament />} />
        <Route path="/tournaments/:id/transfer" element={<CreateTournament />} />
        <Route path="/tournaments/:id/verify" element={<CreateTournament />} />
        <Route path="/tournaments/:id/logo" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/add" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/remove" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/:teamId" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/:teamId/edit" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/:teamId/remove" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/:teamId/captain" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/:teamId/vice-captain" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/:teamId/transfer" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/:teamId/verify" element={<CreateTournament />} />
        <Route path="/tournaments/:id/teams/:teamId/logo" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/add" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/remove" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/:playerId" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/:playerId/edit" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/:playerId/captain" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/:playerId/vice-captain" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/:playerId/transfer" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/:playerId/verify" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/:playerId/logo" element={<CreateTournament />} />
        <Route path="/tournaments/:id/players/:playerId/remove" element={<CreateTournament />} />

        {/* Players */}
        <Route path="/players" element={<PlayersList />} />
        <Route path="/players/create" element={<CreatePlayer />} />
        <Route path="/players/:id/details" element={<PlayerDetails />} />
        <Route path="/players/:id/edit" element={<CreatePlayer />} />
        <Route path="/players/:id" element={<PlayersList />} />
        <Route path="/players/:id/teams" element={<PlayersList />} />
        <Route path="/players/:id/matches" element={<PlayersList />} />
        <Route path="/players/:id/tournaments" element={<PlayersList />} />
        <Route path="/players/:id/contests" element={<PlayersList />} />
        <Route path="/players/:id/leaderboard" element={<PlayersList />} />
        <Route path="/players/:id/analytics" element={<PlayersList />} />
        <Route path="/players/:id/notifications" element={<PlayersList />} />
        <Route path="/players/:id/reports" element={<PlayersList />} />
          <Route path="/players/:id/transfer" element={<CreatePlayer />} />
          <Route path="/players/:id/verify" element={<CreatePlayer />} />
          <Route path="/players/:id/logo" element={<CreatePlayer />} />
          <Route path="/players/:id/captain" element={<CreatePlayer />} />
          <Route path="/players/:id/vice-captain" element={<CreatePlayer />} />
          <Route path="/players/:id/remove" element={<CreatePlayer />} />
          <Route path="/players/:id/edit" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/add" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/remove" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/:teamId" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/:teamId/edit" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/:teamId/remove" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/:teamId/captain" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/:teamId/vice-captain" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/:teamId/transfer" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/:teamId/verify" element={<CreatePlayer />} />
          <Route path="/players/:id/teams/:teamId/logo" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/add" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/remove" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/edit" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/score" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/status" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/teams" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/players" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/analytics" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/notifications" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/reports" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/contests" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/tournaments" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/leaderboard" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/venue" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/umpires" element={<CreatePlayer />} />
          <Route path="/players/:id/matches/:matchId/scorers" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/add" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/remove" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/edit" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/teams" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/matches" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/contests" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/leaderboard" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/analytics" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/notifications" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/reports" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/venue" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/umpires" element={<CreatePlayer />} />
          <Route path="/players/:id/tournaments/:tournamentId/scorers" element={<CreatePlayer />} />
          <Route path="/players/:id/contests/add" element={<CreatePlayer />} />
          <Route path="/players/:id/contests/remove" element={<CreatePlayer />} />
          <Route path="/players/:id/contests/:contestId" element={<CreatePlayer />} />
          <Route path="/players/:id/contests/:contestId/edit" element={<CreatePlayer />} />
          <Route path="/players/:id/leaderboard" element={<CreatePlayer />} />
          <Route path="/players/:id/analytics" element={<CreatePlayer />} />
          <Route path="/players/:id/notifications" element={<CreatePlayer />} />
          <Route path="/players/:id/reports" element={<CreatePlayer />} />
          <Route path="/players/:id/transfer" element={<CreatePlayer />} />
          <Route path="/players/:id/verify" element={<CreatePlayer />} />
          <Route path="/players/:id/logo" element={<CreatePlayer />} />
          <Route path="/players/:id/captain" element={<CreatePlayer />} />
          <Route path="/players/:id/vice-captain" element={<CreatePlayer />} />
          <Route path="/players/:id/remove" element={<CreatePlayer />} />
          <Route path="/players/:id/edit" element={<CreatePlayer />} />





        
        {/* Contests */}
        <Route path="/contests" element={<ContestsList />} />
        <Route path="/contests/create" element={<CreateContest />} />
        <Route path="/contests/:id" element={<ContestsList />} />
        <Route path="/contests/:id/edit" element={<CreateContest />} />
          <Route path="/contests/:id/teams" element={<ContestsList />} />
          <Route path="/contests/:id/players" element={<ContestsList />} />
          <Route path="/contests/:id/matches" element={<ContestsList />} />
          <Route path="/contests/:id/tournaments" element={<ContestsList />} />
          <Route path="/contests/:id/leaderboard" element={<ContestsList />} />
          <Route path="/contests/:id/analytics" element={<ContestsList />} />
          <Route path="/contests/:id/notifications" element={<ContestsList />} />
          <Route path="/contests/:id/reports" element={<ContestsList />} />
          <Route path="/contests/:id/venue" element={<ContestsList />} />
          <Route path="/contests/:id/umpires" element={<ContestsList />} />
          <Route path="/contests/:id/scorers" element={<ContestsList />} />
          <Route path="/contests/:id/captain" element={<CreateContest />} />
          <Route path="/contests/:id/vice-captain" element={<CreateContest />} />
          <Route path="/contests/:id/transfer" element={<CreateContest />} />
          <Route path="/contests/:id/verify" element={<CreateContest />} />
          <Route path="/contests/:id/logo" element={<CreateContest />} />
          <Route path="/contests/:id/teams/add" element={<CreateContest />} />
          <Route path="/contests/:id/teams/remove" element={<CreateContest />} />
          <Route path="/contests/:id/teams/:teamId" element={<CreateContest />} />
          <Route path="/contests/:id/teams/:teamId/edit" element={<CreateContest />} />
          <Route path="/contests/:id/teams/:teamId/remove" element={<CreateContest />} />
          <Route path="/contests/:id/teams/:teamId/captain" element={<CreateContest />} />
          <Route path="/contests/:id/teams/:teamId/vice-captain" element={<CreateContest />} />
          <Route path="/contests/:id/teams/:teamId/transfer" element={<CreateContest />} />
          <Route path="/contests/:id/teams/:teamId/verify" element={<CreateContest />} />
          <Route path="/contests/:id/teams/:teamId/logo" element={<CreateContest />} />
          <Route path="/contests/:id/players/add" element={<CreateContest />} />
          <Route path="/contests/:id/players/remove" element={<CreateContest />} />
          <Route path="/contests/:id/players/:playerId" element={<CreateContest />} />
          <Route path="/contests/:id/players/:playerId/edit" element={<CreateContest />} />
          <Route path="/contests/:id/players/:playerId/captain" element={<CreateContest />} />
          <Route path="/contests/:id/players/:playerId/transfer" element={<CreateContest />} />
          <Route path="/contests/:id/players/:playerId/verify" element={<CreateContest />} />
          <Route path="/contests/:id/players/:playerId/logo" element={<CreateContest />} />
          <Route path="/contests/:id/players/:playerId/remove" element={<CreateContest />} />
          <Route path="/contests/:id/players/:playerId/vice-captain" element={<CreateContest />} />
          <Route path="/contests/:id/matches/add" element={<CreateContest />} />
          <Route path="/contests/:id/matches/remove" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/edit" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/score" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/status" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/teams" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/players" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/analytics" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/notifications" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/reports" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/contests" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/tournaments" element={<CreateContest />} />
            <Route path="/contests/:id/matches/:matchId/leaderboard" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/venue" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/umpires" element={<CreateContest />} />
          <Route path="/contests/:id/matches/:matchId/scorers" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/add" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/remove" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/edit" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/teams" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/matches" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/contests" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/leaderboard" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/analytics" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/notifications" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/reports" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/venue" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/umpires" element={<CreateContest />} />
          <Route path="/contests/:id/tournaments/:tournamentId/scorers" element={<CreateContest />} />

        
        {/* Leaderboard */}
        <Route path="/leaderboard" element={<LeaderboardList />} />
        <Route path="/leaderboard/players" element={<PlayerLeaderboard />} />
        <Route path="/leaderboard/teams" element={<TeamLeaderboard />} />
        <Route path="/leaderboard/:id" element={<LeaderboardList />} />
        <Route path="/leaderboard/:id/edit" element={<LeaderboardList />} />
        <Route path="/leaderboard/players/:id" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/edit" element={<PlayerDetails />} />
        <Route path="/leaderboard/teams/:id" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/edit" element={<TeamsList />} />
        <Route path="/leaderboard/associations/:id" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/edit" element={<AssociationDetails />} />
        <Route path="/leaderboard/awards/:id" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/edit" element={<AwardsList />} />
        <Route path="/leaderboard/clubs/:id" element={<ClubsList />} />
        <Route path="/leaderboard/clubs/:id/edit" element={<ClubsList />} />
        <Route path="/leaderboard/tournaments/:id" element={<TournamentList />} />
        <Route path="/leaderboard/tournaments/:id/edit" element={<TournamentList />} />
        <Route path="/leaderboard/contests/:id" element={<ContestsList />} />
        <Route path="/leaderboard/contests/:id/edit" element={<ContestsList />} />
        <Route path="/leaderboard/matches/:id" element={<MatchesList />} />
        <Route path="/leaderboard/matches/:id/edit" element={<MatchesList />} />
        <Route path="/leaderboard/players/:id/teams" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/matches" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/tournaments" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/contests" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/analytics" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/notifications" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/reports" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/transfer" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/verify" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/logo" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/captain" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/vice-captain" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/remove" element={<PlayerDetails />} />
        <Route path="/leaderboard/players/:id/edit" element={<PlayerDetails />} />
        <Route path="/leaderboard/teams/:id/players" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/matches" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/tournaments" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/contests" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/analytics" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/notifications" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/reports" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/transfer" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/verify" element={<TeamsList />} />
        <Route path="/leaderboard/teams/:id/logo" element={<TeamsList />} />
        <Route path="/leaderboard/associations/:id/teams" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/matches" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/tournaments" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/contests" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/analytics" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/notifications" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/reports" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/transfer" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/verify" element={<AssociationDetails />} />
        <Route path="/leaderboard/associations/:id/logo" element={<AssociationDetails />} />
        <Route path="/leaderboard/awards/:id/players" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/teams" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/matches" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/tournaments" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/contests" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/analytics" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/notifications" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/reports" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/transfer" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/verify" element={<AwardsList />} />
        <Route path="/leaderboard/awards/:id/logo" element={<AwardsList />} />

        
        {/* Player Profiles */}
        <Route path="/profiles" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/edit" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/contests" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/leaderboard" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/analytics" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/notifications" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/reports" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/transfer" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/verify" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/logo" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/captain" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/vice-captain" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/remove" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/edit" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/add" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/remove" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/:teamId" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/:teamId/edit" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/:teamId/remove" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/:teamId/captain" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/:teamId/vice-captain" element={<PlayerProfilesList />} />  
        <Route path="/profiles/:id/teams/:teamId/transfer" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/:teamId/verify" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/teams/:teamId/logo" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/add" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/remove" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/edit" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/score" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/status" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/teams" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/players" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/analytics" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/notifications" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/reports" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/contests" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/tournaments" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/leaderboard" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/venue" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/umpires" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/matches/:matchId/scorers" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/add" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/remove" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/edit" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/teams" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/matches" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/contests" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/leaderboard" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/analytics" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/notifications" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/reports" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/venue" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/umpires" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/tournaments/:tournamentId/scorers" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/contests/add" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/contests/remove" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/contests/:contestId" element={<PlayerProfilesList />} />
        <Route path="/profiles/:id/contests/:contestId/edit" element={<PlayerProfilesList />} />
        
        {/* ========== COMMERCE & FINANCE ========== */}
        {/* Store */}
        <Route path="/store/products" element={<ProductsList />} />
        <Route path="/store/products/add" element={<AddProduct />} />
        <Route path="/store/add-product" element={<AddProduct />} />
        <Route path="/store/orders" element={<OrdersList />} />
        <Route path="/store/products/:id" element={<ProductsList />} />
        <Route path="/store/products/:id/edit" element={<AddProduct />} />
        <Route path="/store/orders/:id" element={<OrdersList />} />
        <Route path="/store/orders/:id/edit" element={<OrdersList />} />
        <Route path="/store/orders/:id/status" element={<OrdersList />} />
        <Route path="/store/orders/:id/refund" element={<OrdersList />} />
        <Route path="/store/orders/:id/analytics" element={<OrdersList />} /> 
        <Route path="/store/orders/:id/notifications" element={<OrdersList />} />
        <Route path="/store/orders/:id/reports" element={<OrdersList />} />
        <Route path="/store/orders/:id/products" element={<OrdersList />} />
        <Route path="/store/orders/:id/customer" element={<OrdersList />} />
        <Route path="/store/orders/:id/transactions" element={<OrdersList />} />
        <Route path="/store/orders/:id/teams" element={<OrdersList />} />
        <Route path="/store/orders/:id/players" element={<OrdersList />} />
        <Route path="/store/orders/:id/tournaments" element={<OrdersList />} />
        <Route path="/store/orders/:id/contests" element={<OrdersList />} />
        <Route path="/store/orders/:id/leaderboard" element={<OrdersList />} />
        <Route path="/store/orders/:id/analytics" element={<OrdersList />} />
        <Route path="/store/orders/:id/notifications" element={<OrdersList />} />
        <Route path="/store/orders/:id/reports" element={<OrdersList />} />

        
        {/* Wallet */}
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/wallet/transactions" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/edit" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/refund" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/analytics" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/notifications" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/reports" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/players" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/teams" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/tournaments" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/contests" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/leaderboard" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/analytics" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/notifications" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/reports" element={<TransactionsList />} />
        <Route path="/wallet/transactions/:id/refund" element={<TransactionsList />} />
        <Route path="/wallet/analytics" element={<TransactionsList />} />
        <Route path="/wallet/notifications" element={<TransactionsList />} />
        <Route path="/wallet/reports" element={<TransactionsList />} />
        <Route path="/wallet/players" element={<TransactionsList />} /> 
        <Route path="/wallet/teams" element={<TransactionsList />} />
        <Route path="/wallet/tournaments" element={<TransactionsList />} />
        <Route path="/wallet/contests" element={<TransactionsList />} />
        <Route path="/wallet/leaderboard" element={<TransactionsList />} />

        
        {/* Subscriptions */}
        <Route path="/subscriptions/plans" element={<PlansList />} />
        <Route path="/subscriptions/subscribers" element={<SubscribersList />} />
        <Route path="/subscriptions/plans/create" element={<CreatePlan />} />
        <Route path="/subscriptions/plans/:id" element={<PlansList />} />
        <Route path="/subscriptions/plans/:id/edit" element={<CreatePlan />} />
        <Route path="/subscriptions/subscribers/:id" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/edit" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/analytics" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/notifications" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/reports" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/plans" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/transactions" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/refunds" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/cancel" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/activate" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/suspend" element={<SubscribersList />} />
        <Route path="/subscriptions/subscribers/:id/unsuspend" element={<SubscribersList />} />
        
        
        {/* ========== CONTENT MANAGEMENT ========== */}
        {/* Blogs */}
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/create" element={<CreateBlog />} />
        <Route path="/blogs/:id" element={<BlogList />} />
        <Route path="/blogs/:id/edit" element={<CreateBlog />} />
        <Route path="/blogs/:id/comments" element={<BlogList />} />
        <Route path="/blogs/:id/analytics" element={<BlogList />} />
        <Route path="/blogs/:id/notifications" element={<BlogList />} />
        <Route path="/blogs/:id/reports" element={<BlogList />} />
        <Route path="/blogs/:id/author" element={<BlogList />} />
        <Route path="/blogs/:id/tags" element={<BlogList />} />
        <Route path="/blogs/:id/categories" element={<BlogList />} />
        <Route path="/blogs/:id/related" element={<BlogList />} />
        <Route path="/blogs/:id/featured" element={<BlogList />} />
        <Route path="/blogs/:id/pinned" element={<BlogList />} />
        <Route path="/blogs/:id/archived" element={<BlogList />} />
        <Route path="/blogs/:id/drafts" element={<BlogList />} />
        <Route path="/blogs/:id/scheduled" element={<BlogList />} />
        <Route path="/blogs/:id/publish" element={<BlogList />} />
        <Route path="/blogs/:id/unpublish" element={<BlogList />} />
        <Route path="/blogs/:id/seo" element={<BlogList />} />
        <Route path="/blogs/:id/social" element={<BlogList />} />
        <Route path="/blogs/:id/monetization" element={<BlogList />} />
        <Route path="/blogs/:id/ads" element={<BlogList />} />
        <Route path="/blogs/:id/sponsorships" element={<BlogList />} />
        
        {/* News */}
        <Route path="/news" element={<NewsList />} />
        <Route path="/news/create" element={<CreateNews />} />
        <Route path="/news/:id" element={<NewsList />} />
        <Route path="/news/:id/edit" element={<CreateNews />} />
        <Route path="/news/:id/comments" element={<NewsList />} />
        <Route path="/news/:id/analytics" element={<NewsList />} />
        <Route path="/news/:id/notifications" element={<NewsList />} />
        <Route path="/news/:id/reports" element={<NewsList />} />
        <Route path="/news/:id/author" element={<NewsList />} />
        <Route path="/news/:id/tags" element={<NewsList />} />
        <Route path="/news/:id/categories" element={<NewsList />} />
        <Route path="/news/:id/related" element={<NewsList />} />
        <Route path="/news/:id/featured" element={<NewsList />} />
        <Route path="/news/:id/pinned" element={<NewsList />} />
        <Route path="/news/:id/archived" element={<NewsList />} />
        <Route path="/news/:id/drafts" element={<NewsList />} />
        <Route path="/news/:id/scheduled" element={<NewsList />} />
        <Route path="/news/:id/publish" element={<NewsList />} />
        <Route path="/news/:id/unpublish" element={<NewsList />} />
        <Route path="/news/:id/seo" element={<NewsList />} />
        <Route path="/news/:id/social" element={<NewsList />} />
        <Route path="/news/:id/monetization" element={<NewsList />} />
        <Route path="/news/:id/ads" element={<NewsList />} />
        <Route path="/news/:id/sponsorships" element={<NewsList />} />
        
        {/* Community */}
        <Route path="/community/posts" element={<PostsList />} />
        <Route path="/community/reported" element={<ReportedPosts />} />
        <Route path="/community/posts/create" element={<CreatePost />} />
        <Route path="/community/posts/:id" element={<PostsList />} />
        <Route path="/community/posts/:id/edit" element={<CreatePost />} />
        <Route path="/community/posts/:id/comments" element={<PostsList />} />
        <Route path="/community/posts/:id/analytics" element={<PostsList />} />
        <Route path="/community/posts/:id/notifications" element={<PostsList />} />
        <Route path="/community/posts/:id/reports" element={<PostsList />} />
        <Route path="/community/posts/:id/author" element={<PostsList />} />
        <Route path="/community/posts/:id/tags" element={<PostsList />} />
        <Route path="/community/posts/:id/categories" element={<PostsList />} />
        <Route path="/community/posts/:id/related" element={<PostsList />} />
        <Route path="/community/posts/:id/featured" element={<PostsList />} />
        <Route path="/community/posts/:id/pinned" element={<PostsList />} />
        <Route path="/community/posts/:id/archived" element={<PostsList />} />
        <Route path="/community/posts/:id/drafts" element={<PostsList />} />
        <Route path="/community/posts/:id/scheduled" element={<PostsList />} />
        <Route path="/community/posts/:id/publish" element={<PostsList />} />
        <Route path="/community/posts/:id/unpublish" element={<PostsList />} />
        <Route path="/community/posts/:id/seo" element={<PostsList />} />
        <Route path="/community/posts/:id/social" element={<PostsList />} />
        <Route path="/community/posts/:id/monetization" element={<PostsList />} />
        <Route path="/community/posts/:id/ads" element={<PostsList />} />
        <Route path="/community/posts/:id/sponsorships" element={<PostsList />} />
        <Route path="/community/reported/:id" element={<ReportedPosts />} />
        <Route path="/community/reported/:id/action" element={<ReportedPosts />} />
        <Route path="/community/reported/:id/resolve" element={<ReportedPosts />} />

        
        {/* ========== ORGANIZATIONS ========== */}
        {/* Clubs */}
        <Route path="/clubs" element={<ClubsList />} />
        <Route path="/clubs/create" element={<CreateClub />} />
        <Route path="/clubs/:id" element={<ClubsList />} />
        <Route path="/clubs/:id/edit" element={<CreateClub />} />
        <Route path="/clubs/:id/teams" element={<ClubsList />} />
        <Route path="/clubs/:id/matches" element={<ClubsList />} />
        <Route path="/clubs/:id/tournaments" element={<ClubsList />} />
        <Route path="/clubs/:id/contests" element={<ClubsList />} />
        <Route path="/clubs/:id/leaderboard" element={<ClubsList />} />
        <Route path="/clubs/:id/analytics" element={<ClubsList />} />
        <Route path="/clubs/:id/notifications" element={<ClubsList />} />
        <Route path="/clubs/:id/reports" element={<ClubsList />} />
        <Route path="/clubs/:id/transfer" element={<CreateClub />} />
        <Route path="/clubs/:id/verify" element={<CreateClub />} />
        <Route path="/clubs/:id/logo" element={<CreateClub />} />
        <Route path="/clubs/:id/captain" element={<CreateClub />} />
        <Route path="/clubs/:id/vice-captain" element={<CreateClub />} />
        <Route path="/clubs/:id/remove" element={<CreateClub />} />
        <Route path="/clubs/:id/edit" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/add" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/remove" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/:teamId" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/:teamId/edit" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/:teamId/remove" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/:teamId/captain" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/:teamId/vice-captain" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/:teamId/transfer" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/:teamId/verify" element={<CreateClub />} />
        <Route path="/clubs/:id/teams/:teamId/logo" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/add" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/remove" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/:matchId" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/:matchId/edit" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/:matchId/score" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/:matchId/status" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/:matchId/teams" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/:matchId/players" element={<CreateClub />} />
        <Route path="/clubs/:id/matches/:matchId/analytics" element={<CreateClub />} />
    

        
        {/* Associations */}
        <Route path="/associations" element={<AssociationList />} />
        <Route path="/associations/create" element={<CreateAssociation />} />
        <Route path="/associations/:id" element={<AssociationDetails />} />
        <Route path="/associations/:id/edit" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams" element={<AssociationDetails />} />
        <Route path="/associations/:id/matches" element={<AssociationDetails />} />
        <Route path="/associations/:id/tournaments" element={<AssociationDetails />} />
        <Route path="/associations/:id/contests" element={<AssociationDetails />} />
        <Route path="/associations/:id/leaderboard" element={<AssociationDetails />} />
        <Route path="/associations/:id/analytics" element={<AssociationDetails />} />
        <Route path="/associations/:id/notifications" element={<AssociationDetails />} />
        <Route path="/associations/:id/reports" element={<AssociationDetails />} />
        <Route path="/associations/:id/transfer" element={<CreateAssociation />} />
        <Route path="/associations/:id/verify" element={<CreateAssociation />} />
        <Route path="/associations/:id/logo" element={<CreateAssociation />} />
        <Route path="/associations/:id/captain" element={<CreateAssociation />} />
        <Route path="/associations/:id/vice-captain" element={<CreateAssociation />} />
        <Route path="/associations/:id/remove" element={<CreateAssociation />} />
        <Route path="/associations/:id/edit" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/add" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/remove" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/:teamId" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/:teamId/edit" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/:teamId/remove" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/:teamId/captain" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/:teamId/vice-captain" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/:teamId/transfer" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/:teamId/verify" element={<CreateAssociation />} />
        <Route path="/associations/:id/teams/:teamId/logo" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/add" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/remove" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/edit" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/score" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/status" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/teams" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/players" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/analytics" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/notifications" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/reports" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/contests" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/tournaments" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/leaderboard" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/venue" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/umpires" element={<CreateAssociation />} />
        <Route path="/associations/:id/matches/:matchId/scorers" element={<CreateAssociation />} />

        
        {/* Awards */}
        <Route path="/awards" element={<AwardsList />} />
        <Route path="/awards/create" element={<CreateAward />} />
        <Route path="/awards/:id" element={<AwardsList />} />
        <Route path="/awards/:id/edit" element={<CreateAward />} />
        <Route path="/awards/:id/players" element={<AwardsList />} />
        <Route path="/awards/:id/teams" element={<AwardsList />} />
        <Route path="/awards/:id/matches" element={<AwardsList />} />
        <Route path="/awards/:id/tournaments" element={<AwardsList />} />
        <Route path="/awards/:id/contests" element={<AwardsList />} />
        <Route path="/awards/:id/leaderboard" element={<AwardsList />} />
        <Route path="/awards/:id/analytics" element={<AwardsList />} />
        <Route path="/awards/:id/notifications" element={<AwardsList />} />
        <Route path="/awards/:id/reports" element={<AwardsList />} />
        <Route path="/awards/:id/transfer" element={<CreateAward />} />
        <Route path="/awards/:id/verify" element={<CreateAward />} />
        <Route path="/awards/:id/logo" element={<CreateAward />} />
        <Route path="/awards/:id/captain" element={<CreateAward />} />
        <Route path="/awards/:id/vice-captain" element={<CreateAward />} />
        <Route path="/awards/:id/remove" element={<CreateAward />} />
        <Route path="/awards/:id/edit" element={<CreateAward />} />
        <Route path="/awards/:id/players/add" element={<CreateAward />} />
        <Route path="/awards/:id/players/remove" element={<CreateAward />} />
        <Route path="/awards/:id/players/:playerId" element={<CreateAward />} />
        <Route path="/awards/:id/players/:playerId/edit" element={<CreateAward />} />
        <Route path="/awards/:id/players/:playerId/remove" element={<CreateAward />} />
        <Route path="/awards/:id/teams/add" element={<CreateAward />} />
        <Route path="/awards/:id/teams/remove" element={<CreateAward />} />
        <Route path="/awards/:id/teams/:teamId" element={<CreateAward />} />
        <Route path="/awards/:id/teams/:teamId/edit" element={<CreateAward />} />
        <Route path="/awards/:id/teams/:teamId/remove" element={<CreateAward />} />
        <Route path="/awards/:id/matches/add" element={<CreateAward />} />
        <Route path="/awards/:id/matches/remove" element={<CreateAward />} />
        <Route path="/awards/:id/matches/:matchId" element={<CreateAward />} />
        <Route path="/awards/:id/matches/:matchId/edit" element={<CreateAward />} />
        <Route path="/awards/:id/tournaments/add" element={<CreateAward />} />
        <Route path="/awards/:id/tournaments/remove" element={<CreateAward />} />
        <Route path="/awards/:id/tournaments/:tournamentId" element={<CreateAward />} />
        <Route path="/awards/:id/tournaments/:tournamentId/edit" element={<CreateAward />} />
        <Route path="/awards/:id/contests/add" element={<CreateAward />} />
        <Route path="/awards/:id/contests/remove" element={<CreateAward />} />
        <Route path="/awards/:id/contests/:contestId" element={<CreateAward />} />
        <Route path="/awards/:id/contests/:contestId/edit" element={<CreateAward />} /> 
        
        
        {/* ========== ANALYTICS & REPORTS ========== */}
        <Route path="/performance" element={<PerformanceList />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/analytics/players" element={<Analytics />} />
        <Route path="/analytics/teams" element={<Analytics />} />
        <Route path="/analytics/matches" element={<Analytics />} />
        <Route path="/analytics/tournaments" element={<Analytics />} />
        <Route path="/analytics/contests" element={<Analytics />} />
        <Route path="/analytics/leaderboard" element={<Analytics />} />
        <Route path="/analytics/awards" element={<Analytics />} />
        <Route path="/analytics/finance" element={<Analytics />} />
        <Route path="/analytics/subscriptions" element={<Analytics />} />
        <Route path="/analytics/traffic" element={<Analytics />} />
        <Route path="/analytics/engagement" element={<Analytics />} />
        <Route path="/analytics/retention" element={<Analytics />} />
        <Route path="/analytics/churn" element={<Analytics />} />
        <Route path="/analytics/monetization" element={<Analytics />} />
        <Route path="/analytics/ads" element={<Analytics />} />
        
        {/* ========== SYSTEM & SETTINGS ========== */}
        <Route path="/notifications" element={<NotificationsList />} />
        <Route path="/contact" element={<ContactList />} />
        <Route path="/reviews" element={<ReviewsList />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/general" element={<Settings />} />
        <Route path="/settings/privacy" element={<Settings />} />
        <Route path="/settings/security" element={<Settings />} />
        <Route path="/settings/appearance" element={<Settings />} />
        <Route path="/settings/notifications" element={<Settings />} />
        <Route path="/settings/integrations" element={<Settings />} />
        <Route path="/settings/api" element={<Settings />} />
        <Route path="/settings/analytics" element={<Settings />} />
        <Route path="/settings/finance" element={<Settings />} />
        <Route path="/settings/subscriptions" element={<Settings />} />
        <Route path="/settings/players" element={<Settings />} />
        <Route path="/settings/teams" element={<Settings />} />
        <Route path="/settings/matches" element={<Settings />} />
        <Route path="/settings/tournaments" element={<Settings />} />
        <Route path="/settings/contests" element={<Settings />} />
        <Route path="/settings/leaderboard" element={<Settings />} />
        <Route path="/settings/awards" element={<Settings />} />


        
        {/* ========== ADMIN ROUTES ========== */}
        {/* Core Admin - Mobile App Control */}
        <Route path="/admin/mobile-app" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/add" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/edit" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/analytics" element={<MobileAppManager />} />  
        <Route path="/admin/mobile-app/versions/:id/notifications" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/reports" element={<MobileAppManager />} />  
        <Route path="/admin/mobile-app/versions/:id/players" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/teams" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/matches" element={<MobileAppManager />} />  
        <Route path="/admin/mobile-app/versions/:id/tournaments" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/contests" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/leaderboard" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/awards" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/analytics" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/notifications" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/reports" element={<MobileAppManager />} />
        <Route path="/admin/mobile-app/versions/:id/players" element={<MobileAppManager />} />
        
        {/* Core Admin - Store Manager */}
        <Route path="/admin/store-manager" element={<StoreManager />} />
        <Route path="/admin/store-manager/products" element={<StoreManager />} />
        <Route path="/admin/store-manager/products/add" element={<StoreManager />} />
        <Route path="/admin/store-manager/products/:id" element={<StoreManager />} />
        <Route path="/admin/store-manager/products/:id/edit" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders" element={<StoreManager />} /> 
        <Route path="/admin/store-manager/orders/:id" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/edit" element={<StoreManager />} />  
        <Route path="/admin/store-manager/orders/:id/status" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/refund" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/analytics" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/notifications" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/reports" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/products" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/customer" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/transactions" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/teams" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/players" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/tournaments" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/contests" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/leaderboard" element={<StoreManager />} />
        <Route path="/admin/store-manager/orders/:id/analytics" element={<StoreManager />} /> 
        <Route path="/admin/store-manager/orders/:id/notifications" element={<StoreManager />} /> 
        
        {/* Core Admin - Contest Manager */}
        <Route path="/admin/contest-manager" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/add" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/edit" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/analytics" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/notifications" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/reports" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/players" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/teams" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/tournaments" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/leaderboard" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/awards" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/analytics" element={<ContestManager />} />
        <Route path="/admin/contest-manager/contests/:id/notifications" element={<ContestManager />} />
       
        
        {/* User Management Admin */}
        <Route path="/admin/roles" element={<RoleManagement />} />
        <Route path="/admin/verifications" element={<UserVerifications />} />
        <Route path="/admin/permissions" element={<PermissionManagement />} />
        <Route path="/admin/roles/add" element={<RoleManagement />} />
        <Route path="/admin/roles/:id" element={<RoleManagement />} />
        <Route path="/admin/roles/:id/edit" element={<RoleManagement />} />
        <Route path="/admin/verifications/:id" element={<UserVerifications />} />
        <Route path="/admin/verifications/:id/action" element={<UserVerifications />} />
        <Route path="/admin/permissions/:id" element={<PermissionManagement />} />
        <Route path="/admin/permissions/:id/edit" element={<PermissionManagement />} />
        <Route path="/admin/permissions/:id/roles" element={<PermissionManagement />} />
        <Route path="/admin/permissions/:id/users" element={<PermissionManagement />} />
        <Route path="/admin/permissions/:id/analytics" element={<PermissionManagement />} />
        <Route path="/admin/permissions/:id/notifications" element={<PermissionManagement />} />
        <Route path="/admin/permissions/:id/reports" element={<PermissionManagement />} />
        <Route path="/admin/permissions/:id/assign" element={<PermissionManagement />} />
        <Route path="/admin/permissions/:id/revoke" element={<PermissionManagement />} />
   
        {/* System Admin */}
        <Route path="/admin/logs" element={<SystemLogs />} />
        <Route path="/admin/backups" element={<BackupRestore />} />
        <Route path="/admin/email-templates" element={<EmailTemplates />} />
        <Route path="/admin/api" element={<APIManagement />} />
        <Route path="/admin/logs/:id" element={<SystemLogs />} />
        <Route path="/admin/logs/:id/details" element={<SystemLogs />} />
        <Route path="/admin/backups/create" element={<BackupRestore />} />
        <Route path="/admin/backups/:id" element={<BackupRestore />} />
        <Route path="/admin/backups/:id/restore" element={<BackupRestore />} />
        <Route path="/admin/email-templates/create" element={<EmailTemplates />} />
        <Route path="/admin/email-templates/:id" element={<EmailTemplates />} />
        <Route path="/admin/email-templates/:id/edit" element={<EmailTemplates />} />
        <Route path="/admin/api/keys" element={<APIManagement />} />
        <Route path="/admin/api/keys/create" element={<APIManagement />} />
        <Route path="/admin/api/keys/:id" element={<APIManagement />} />
        <Route path="/admin/api/keys/:id/edit" element={<APIManagement />} />
        <Route path="/admin/api/keys/:id/revoke" element={<APIManagement />} />
        <Route path="/admin/api/keys/:id/analytics" element={<APIManagement />} />
        <Route path="/admin/api/keys/:id/notifications" element={<APIManagement />} />
        <Route path="/admin/api/keys/:id/reports" element={<APIManagement />} />
        <Route path="/admin/api/keys/:id/assign" element={<APIManagement />} />
        <Route path="/admin/api/keys/:id/revoke" element={<APIManagement />} />
        
        {/* Analytics Admin */}
        <Route path="/admin/analytics" element={<Analytics />} />
        <Route path="/admin/finance" element={<FinancialOverview />} />
        <Route path="/admin/subscriptions" element={<SubscriptionAnalytics />} />
        <Route path="/admin/traffic" element={<TrafficAnalytics />} />
        <Route path="/admin/engagement" element={<EngagementAnalytics />} />
        <Route path="/admin/retention" element={<RetentionAnalytics />} />
        <Route path="/admin/churn" element={<ChurnAnalytics />} />

        
        {/* Content Admin */}
        <Route path="/admin/moderation" element={<ContentModeration />} />
        <Route path="/admin/moderation/reported" element={<ReportedContent />} />
        <Route path="/admin/moderation/reported/:id" element={<ReportedContent />} />
        <Route path="/admin/moderation/reported/:id/action" element={<ContentModeration />} />
        <Route path="/admin/moderation/reported/:id/resolve" element={<ContentModeration />} />
        <Route path="/admin/moderation/analytics" element={<ContentModeration />} />
        <Route path="/admin/moderation/notifications" element={<ContentModeration />} />
        <Route path="/admin/moderation/reports" element={<ContentModeration />} />
        <Route path="/admin/moderation/players" element={<ContentModeration />} />  
        <Route path="/admin/moderation/teams" element={<ContentModeration />} />
        <Route path="/admin/moderation/matches" element={<ContentModeration />} />
        <Route path="/admin/moderation/tournaments" element={<ContentModeration />} />
        <Route path="/admin/moderation/contests" element={<ContentModeration />} />
        <Route path="/admin/moderation/leaderboard" element={<ContentModeration />} />
        <Route path="/admin/moderation/awards" element={<ContentModeration />} />




        
        {/* Player Management Admin */}
        <Route path="/admin/players" element={<AdminPlayersList />} />
        <Route path="/admin/players/merge" element={<MergePlayers />} />
        <Route path="/admin/players/:id" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/edit" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/merge" element={<MergePlayers />} />
        <Route path="/admin/players/:id/analytics" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/notifications" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/reports" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/teams" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/matches" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/tournaments" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/contests" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/leaderboard" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/awards" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/analytics" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/notifications" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/reports" element={<AdminPlayerDetails />} />
        <Route path="/admin/players/:id/merge" element={<MergePlayers />} />
        
      {/* Banner Management */}
        <Route path="/banners" element={<BannerManagement />} />
        <Route path="/admin/banners" element={<BannerManagement />} />
        <Route path="/banners/create" element={<BannerManagement />} />
        <Route path="/banners/:id" element={<BannerManagement />} />
        <Route path="/banners/:id/edit" element={<BannerManagement />} />
        <Route path="/banners/:id/analytics" element={<BannerManagement />} />
        <Route path="/banners/:id/notifications" element={<BannerManagement />} />
        <Route path="/banners/:id/reports" element={<BannerManagement />} />
        <Route path="/banners/:id/players" element={<BannerManagement />} />
        <Route path="/banners/:id/teams" element={<BannerManagement />} />
        <Route path="/banners/:id/matches" element={<BannerManagement />} />
        <Route path="/banners/:id/tournaments" element={<BannerManagement />} />
        <Route path="/banners/:id/contests" element={<BannerManagement />} />
        <Route path="/banners/:id/leaderboard" element={<BannerManagement />} />
        <Route path="/banners/:id/awards" element={<BannerManagement />} />
        <Route path="/banners/:id/analytics" element={<BannerManagement />} />
        <Route path="/banners/:id/notifications" element={<BannerManagement />} />  
        <Route path="/banners/:id/reports" element={<BannerManagement />} />

        {/* Feature Toggles */}
        <Route path="/settings/features" element={<FeatureToggles />} />
        <Route path="/admin/features" element={<FeatureToggles />} />
        <Route path="/settings/features/:id" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/edit" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/analytics" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/notifications" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/reports" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/players" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/teams" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/matches" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/tournaments" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/contests" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/leaderboard" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/awards" element={<FeatureToggles />} />
        <Route path="/settings/features/:id/analytics" element={<FeatureToggles />} />
        
      </Route>
      
      {/* Catch all - Redirect to Dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
