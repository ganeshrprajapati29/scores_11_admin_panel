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

// Settings
import Settings from '../pages/settings/Settings'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      
      {/* Protected Routes */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Users */}
        <Route path="/users" element={<UsersList />} />
        <Route path="/users/create" element={<CreateUser />} />
        <Route path="/users/:id" element={<ViewUser />} />
        
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
        
        {/* Settings */}
        <Route path="/settings" element={<Settings />} />
      </Route>
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default AppRoutes
