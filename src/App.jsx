import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import DashboardLayout from './layout/DashboardLayout'
import ProtectedRoute from './layout/ProtectedRoute'
import Login from './pages/auth/Login'
import Dashboard from './pages/dashboard/Dashboard'
import UsersList from './pages/users/UsersList'
import ViewUser from './pages/users/ViewUser'
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
import './App.css'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route path="/" element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UsersList />} />
            <Route path="users/:id" element={<ViewUser />} />
            <Route path="users/:id/edit" element={<EditUser />} />
            <Route path="teams" element={<TeamsList />} />
            <Route path="teams/create" element={<CreateTeam />} />
            <Route path="teams/:id" element={<CreateTeam />} />
            <Route path="teams/:id/edit" element={<CreateTeam />} />
            <Route path="players" element={<PlayersList />} />
            <Route path="players/create" element={<CreatePlayer />} />
            <Route path="players/:id/edit" element={<CreatePlayer />} />
            <Route path="matches" element={<MatchesList />} />
            <Route path="matches/create" element={<CreateMatch />} />
            <Route path="matches/:id/edit" element={<CreateMatch />} />
            <Route path="matches/:id/live" element={<LiveControl />} />
            <Route path="tournaments" element={<TournamentList />} />
            <Route path="tournaments/create" element={<CreateTournament />} />
            <Route path="tournaments/:id/edit" element={<CreateTournament />} />
            <Route path="contests" element={<ContestsList />} />
            <Route path="contests/create" element={<CreateContest />} />
            <Route path="contests/:id/edit" element={<CreateContest />} />
            <Route path="leaderboard" element={<LeaderboardList />} />
            <Route path="blogs" element={<BlogList />} />
            <Route path="blogs/create" element={<CreateBlog />} />
            <Route path="blogs/:id" element={<CreateBlog />} />
            <Route path="blogs/:id/edit" element={<CreateBlog />} />
            <Route path="news" element={<NewsList />} />
            <Route path="news/create" element={<CreateNews />} />
            <Route path="news/:id/edit" element={<CreateNews />} />
            <Route path="community/posts" element={<PostsList />} />
            <Route path="community/reported" element={<ReportedPosts />} />
            <Route path="store/products" element={<ProductsList />} />
            <Route path="store/products/add" element={<AddProduct />} />
            <Route path="store/products/:id/edit" element={<AddProduct />} />
            <Route path="store/add-product" element={<AddProduct />} />
            <Route path="store/orders" element={<OrdersList />} />
            <Route path="clubs" element={<ClubsList />} />
            <Route path="clubs/create" element={<CreateClub />} />
            <Route path="clubs/:id/edit" element={<CreateClub />} />
            <Route path="associations" element={<AssociationList />} />
            <Route path="associations/create" element={<CreateAssociation />} />
            <Route path="associations/:id/edit" element={<CreateAssociation />} />
            <Route path="awards" element={<AwardsList />} />
            <Route path="awards/create" element={<CreateAward />} />
            <Route path="awards/:id/edit" element={<CreateAward />} />
            <Route path="subscriptions/plans" element={<PlansList />} />
            <Route path="subscriptions/subscribers" element={<SubscribersList />} />
            <Route path="wallet" element={<Wallet />} />
            <Route path="reports" element={<Reports />} />
            <Route path="notifications" element={<NotificationsList />} />
            <Route path="contact" element={<ContactList />} />
            <Route path="reviews" element={<ReviewsList />} />
            <Route path="performance" element={<PerformanceList />} />
            <Route path="profiles" element={<PlayerProfilesList />} />
            <Route path="settings" element={<Settings />} />
          </Route>
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
    </Router>
  )
}

export default App
