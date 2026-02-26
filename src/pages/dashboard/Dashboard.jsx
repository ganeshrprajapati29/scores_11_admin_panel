import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Users2, Trophy, Calendar, DollarSign, 
  TrendingUp, TrendingDown, Activity, Eye,
  Bell, MessageSquare, ShoppingCart, CreditCard,
  ChevronRight, Play, Award, Globe, Flag
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { usersAPI, teamsAPI, matchesAPI, tournamentsAPI, walletAPI, adminAPI } from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalMatches: 0,
    totalTournaments: 0,
    totalRevenue: 0,
    activeUsers: 0
  })
  const [recentMatches, setRecentMatches] = useState([])
  const [recentTournaments, setRecentTournaments] = useState([])
  const [walletOverview, setWalletOverview] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [usersRes, teamsRes, matchesRes, tournamentsRes, walletRes] = await Promise.allSettled([
        usersAPI.getAll({ limit: 1 }),
        teamsAPI.getAll({ limit: 1 }),
        matchesAPI.getAll({ limit: 10 }),
        tournamentsAPI.getAll({ limit: 6 }),
        walletAPI.getAdminOverview().catch(() => null)
      ])

      // Update stats
      setStats({
        totalUsers: usersRes.status === 'fulfilled' ? (usersRes.value.pagination?.total || 0) : 0,
        totalTeams: teamsRes.status === 'fulfilled' ? (teamsRes.value.pagination?.total || 0) : 0,
        totalMatches: matchesRes.status === 'fulfilled' ? (matchesRes.value.pagination?.total || 0) : 0,
        totalTournaments: tournamentsRes.status === 'fulfilled' ? (tournamentsRes.value.pagination?.total || 0) : 0,
        totalRevenue: walletRes.status === 'fulfilled' && walletRes.value ? (walletRes.value.totalRevenue || 0) : 0,
        activeUsers: usersRes.status === 'fulfilled' 
          ? (usersRes.value.data?.filter(u => u.isActive).length || 0) 
          : 0
      })

      // Set recent matches
      if (matchesRes.status === 'fulfilled') {
        setRecentMatches(matchesRes.value.data || [])
      }

      // Set recent tournaments
      if (tournamentsRes.status === 'fulfilled') {
        setRecentTournaments(tournamentsRes.value.data || [])
      }

      // Set wallet overview
      if (walletRes.status === 'fulfilled' && walletRes.value) {
        setWalletOverview(walletRes.value)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts
  const monthlyData = [
    { name: 'Jan', users: 120, matches: 15, revenue: 25000 },
    { name: 'Feb', users: 150, matches: 20, revenue: 32000 },
    { name: 'Mar', users: 180, matches: 25, revenue: 40000 },
    { name: 'Apr', users: 220, matches: 30, revenue: 48000 },
    { name: 'May', users: 280, matches: 35, revenue: 55000 },
    { name: 'Jun', users: 350, matches: 40, revenue: 68000 },
  ]

  const matchStatusData = [
    { name: 'Completed', value: 45, color: '#10b981' },
    { name: 'Scheduled', value: 25, color: '#3b82f6' },
    { name: 'Live', value: 10, color: '#f59e0b' },
    { name: 'Cancelled', value: 5, color: '#ef4444' },
  ]

  const getMatchStatusLabel = (status) => {
    switch (status) {
      case 'scheduled': return 'Scheduled'
      case 'live': return 'Live'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      default: return status
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-secondary flex items-center gap-2">
            <Eye size={18} />
            View Site
          </button>
          <button className="btn-primary flex items-center gap-2">
            <Bell size={18} />
            Notifications
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              12%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Users</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/users" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all users <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Total Teams */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Users2 className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              8%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTeams.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Teams</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/teams" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all teams <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Total Matches */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              15%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalMatches.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Matches</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/matches" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View all matches <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              23%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
          <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/wallet" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View wallet <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                  name="Users"
                />
                <Line 
                  type="monotone" 
                  dataKey="matches" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981' }}
                  name="Matches"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={matchStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {matchStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
                formatter={(value) => formatCurrency(value)}
              />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Matches & Tournaments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Matches</h3>
            <Link to="/matches" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : recentMatches.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No matches found</p>
            ) : (
              recentMatches.slice(0, 5).map((match) => (
                <Link 
                  key={match._id} 
                  to={`/matches/${match._id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    match.status === 'live' ? 'bg-green-100' : 
                    match.status === 'completed' ? 'bg-gray-100' : 'bg-blue-100'
                  }`}>
                    {match.status === 'live' ? (
                      <Play size={18} className="text-green-600" />
                    ) : match.status === 'completed' ? (
                      <Activity size={18} className="text-gray-600" />
                    ) : (
                      <Calendar size={18} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {match.team1?.name || 'Team 1'} vs {match.team2?.name || 'Team 2'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {match.venue?.name || 'TBD'} • {getMatchStatusLabel(match.status)}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Tournaments</h3>
            <Link to="/tournaments" className="text-sm text-primary-600 hover:text-primary-700">
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : recentTournaments.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No tournaments found</p>
            ) : (
              recentTournaments.slice(0, 5).map((tournament) => (
                <Link 
                  key={tournament._id} 
                  to={`/tournaments/${tournament._id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <Trophy size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{tournament.name}</p>
                    <p className="text-sm text-gray-500">
                      {tournament.venue?.name || 'TBD'} • {tournament.teams?.length || 0} Teams
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400" />
                </Link>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <Link 
            to="/matches/create" 
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-primary-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Schedule Match</span>
          </Link>
          
          <Link 
            to="/tournaments/create" 
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="w-12 h-12 bg-secondary-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-secondary-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Create Tournament</span>
          </Link>
          
          <Link 
            to="/teams/create" 
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Add Team</span>
          </Link>
          
          <Link 
            to="/blogs/create" 
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-green-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Write Blog</span>
          </Link>
          
          <Link 
            to="/store/add-product" 
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-yellow-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Add Product</span>
          </Link>
          
          <Link 
            to="/settings" 
            className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-colors"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <span className="text-sm font-medium text-gray-700">Settings</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
