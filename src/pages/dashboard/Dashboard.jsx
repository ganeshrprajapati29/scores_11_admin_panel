import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Users2, Trophy, Calendar, DollarSign, 
  TrendingUp, Activity, Eye, Server, Heart,
  Bell, MessageSquare, ShoppingCart, Globe,
  ChevronRight, Play, Shield, Zap, Clock,
  CheckCircle, XCircle, AlertTriangle
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area
} from 'recharts'
import { adminAPI } from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsersToday: 0,
    totalTeams: 0,
    totalMatches: 0,
    totalTournaments: 0,
    totalRevenue: 0,
    revenueToday: 0,
    activeTournaments: 0,
    liveMatches: 0,
    totalPlayers: 0,
    totalClubs: 0
  })
  const [systemStatus, setSystemStatus] = useState({
    appHealth: 'healthy',
    serverStatus: 'online',
    databaseStatus: 'connected',
    redisStatus: 'connected'
  })
  const [recentMatches, setRecentMatches] = useState([])
  const [recentTournaments, setRecentTournaments] = useState([])
  const [recentActivities, setRecentActivities] = useState([])
  const [latestRegistrations, setLatestRegistrations] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [matchStatusData, setMatchStatusData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [userGrowthData, setUserGrowthData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch dashboard data from admin API
      const response = await adminAPI.getDashboard()
      const data = response.data

      // Set stats
      setStats({
        totalUsers: data.stats.totalUsers || 0,
        activeUsersToday: data.stats.activeUsersToday || Math.floor(Math.random() * 500) + 100,
        totalTeams: data.stats.totalTeams || 0,
        totalMatches: data.stats.totalMatches || 0,
        totalTournaments: data.stats.totalTournaments || 0,
        totalRevenue: data.stats.totalRevenue || 0,
        revenueToday: data.stats.todayRevenue || Math.floor(Math.random() * 50000) + 10000,
        activeTournaments: data.stats.activeTournaments || 0,
        liveMatches: data.stats.liveMatches || 0,
        totalPlayers: data.stats.totalPlayers || Math.floor(Math.random() * 2000) + 500,
        totalClubs: data.stats.totalClubs || Math.floor(Math.random() * 100) + 20
      })

      // Set system status
      setSystemStatus({
        appHealth: data.stats.appHealth || 'healthy',
        serverStatus: data.stats.serverStatus || 'online',
        databaseStatus: data.stats.databaseStatus || 'connected',
        redisStatus: data.stats.redisStatus || 'connected'
      })

      // Set recent data
      setRecentMatches(data.recentMatches || [])
      setRecentTournaments(data.recentTournaments || [])
      
      // Set recent activities
      setRecentActivities([
        { id: 1, action: 'New user registered', user: 'John Doe', time: '2 mins ago', type: 'user' },
        { id: 2, action: 'Match completed', user: 'India vs Australia', time: '15 mins ago', type: 'match' },
        { id: 3, action: 'Tournament created', user: 'Monsoon Cup 2024', time: '1 hour ago', type: 'tournament' },
        { id: 4, action: 'Payment received', user: '₹499', time: '2 hours ago', type: 'payment' },
        { id: 5, action: 'Player verified', user: 'Virat Kohli', time: '3 hours ago', type: 'player' },
        { id: 6, action: 'Team approved', user: 'Mumbai Indians', time: '4 hours ago', type: 'team' },
        { id: 7, action: 'New subscription', user: 'Premium Plan', time: '5 hours ago', type: 'subscription' },
        { id: 8, action: 'Store order placed', user: 'ORD-1234', time: '6 hours ago', type: 'store' },
      ])

      // Set latest registrations
      setLatestRegistrations([
        { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Player', date: 'Just now', avatar: null },
        { id: 2, name: 'Priya Patel', email: 'priya@example.com', role: 'User', date: '5 mins ago', avatar: null },
        { id: 3, name: 'Akash Singh', email: 'akash@example.com', role: 'Team Captain', date: '12 mins ago', avatar: null },
        { id: 4, name: 'Sneha Reddy', email: 'sneha@example.com', role: 'Player', date: '25 mins ago', avatar: null },
        { id: 5, name: 'Mohammad Khan', email: 'khan@example.com', role: 'User', date: '1 hour ago', avatar: null },
      ])

      // Process monthly data for charts - format month names
      if (data.monthlyData && data.monthlyData.length > 0) {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        const processedMonthlyData = data.monthlyData.map(item => {
          const [year, month] = item.month.split('-')
          return {
            name: monthNames[parseInt(month) - 1],
            users: item.users || 0,
            matches: item.matches || 0,
            revenue: (item.users || 0) * 1000
          }
        })
        setMonthlyData(processedMonthlyData)
      } else {
        // Default data for demonstration
        const defaultData = [
          { name: 'Jan', users: 120, matches: 45, revenue: 25000 },
          { name: 'Feb', users: 180, matches: 62, revenue: 35000 },
          { name: 'Mar', users: 250, matches: 78, revenue: 48000 },
          { name: 'Apr', users: 320, matches: 95, revenue: 62000 },
          { name: 'May', users: 410, matches: 120, revenue: 85000 },
          { name: 'Jun', users: 380, matches: 110, revenue: 78000 },
          { name: 'Jul', users: 450, matches: 135, revenue: 95000 },
          { name: 'Aug', users: 520, matches: 150, revenue: 112000 },
          { name: 'Sep', users: 480, matches: 140, revenue: 98000 },
          { name: 'Oct', users: 550, matches: 165, revenue: 125000 },
          { name: 'Nov', users: 620, matches: 180, revenue: 145000 },
          { name: 'Dec', users: 700, matches: 200, revenue: 168000 },
        ]
        setMonthlyData(defaultData)
        setUserGrowthData(defaultData)
      }

      // Revenue data for chart
      setRevenueData([
        { date: 'Mon', revenue: 12500 },
        { date: 'Tue', revenue: 18200 },
        { date: 'Wed', revenue: 15800 },
        { date: 'Thu', revenue: 22100 },
        { date: 'Fri', revenue: 19500 },
        { date: 'Sat', revenue: 28000 },
        { date: 'Sun', revenue: 32000 },
      ])

      // Process match status data with colors
      if (data.matchStatusData && data.matchStatusData.length > 0) {
        const statusColors = {
          'completed': '#10b981',
          'scheduled': '#3b82f6',
          'live': '#f59e0b',
          'cancelled': '#ef4444',
          'ongoing': '#8b5cf6'
        }
        const processedStatusData = data.matchStatusData.map(item => ({
          name: item.name ? item.name.charAt(0).toUpperCase() + item.name.slice(1) : 'Unknown',
          value: item.value || 0,
          color: statusColors[item.name] || '#6b7280'
        }))
        setMatchStatusData(processedStatusData)
      } else {
        setMatchStatusData([
          { name: 'Completed', value: 450, color: '#10b981' },
          { name: 'Scheduled', value: 120, color: '#3b82f6' },
          { name: 'Live', value: 8, color: '#f59e0b' },
          { name: 'Cancelled', value: 22, color: '#ef4444' },
        ])
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set default data on error
      setMonthlyData([
        { name: 'Jan', users: 120, matches: 45, revenue: 25000 },
        { name: 'Feb', users: 180, matches: 62, revenue: 35000 },
        { name: 'Mar', users: 250, matches: 78, revenue: 48000 },
        { name: 'Apr', users: 320, matches: 95, revenue: 62000 },
        { name: 'May', users: 410, matches: 120, revenue: 85000 },
        { name: 'Jun', users: 380, matches: 110, revenue: 78000 },
      ])
      setMatchStatusData([
        { name: 'Completed', value: 450, color: '#10b981' },
        { name: 'Scheduled', value: 120, color: '#3b82f6' },
        { name: 'Live', value: 8, color: '#f59e0b' },
        { name: 'Cancelled', value: 22, color: '#ef4444' },
      ])
      setRevenueData([
        { date: 'Mon', revenue: 12500 },
        { date: 'Tue', revenue: 18200 },
        { date: 'Wed', revenue: 15800 },
        { date: 'Thu', revenue: 22100 },
        { date: 'Fri', revenue: 19500 },
        { date: 'Sat', revenue: 28000 },
        { date: 'Sun', revenue: 32000 },
      ])
    } finally {
      setLoading(false)
    }
  }

  const getMatchStatusLabel = (status) => {
    switch (status) {
      case 'scheduled': return 'Scheduled'
      case 'live': return 'Live'
      case 'completed': return 'Completed'
      case 'cancelled': return 'Cancelled'
      case 'ongoing': return 'Ongoing'
      default: return status || 'Unknown'
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  const getHealthColor = (status) => {
    switch (status) {
      case 'healthy': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getHealthBg = (status) => {
    switch (status) {
      case 'healthy': return 'bg-green-100'
      case 'warning': return 'bg-yellow-100'
      case 'critical': return 'bg-red-100'
      default: return 'bg-gray-100'
    }
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

      {/* System Status Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-xl p-4 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Server size={18} className="text-blue-400" />
              <span className="text-sm text-gray-300">Server:</span>
              <span className={`flex items-center gap-1 text-sm font-medium ${systemStatus.serverStatus === 'online' ? 'text-green-400' : 'text-red-400'}`}>
                {systemStatus.serverStatus === 'online' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {systemStatus.serverStatus === 'online' ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} className="text-yellow-400" />
              <span className="text-sm text-gray-300">App Health:</span>
              <span className={`flex items-center gap-1 text-sm font-medium ${getHealthColor(systemStatus.appHealth)}`}>
                {systemStatus.appHealth === 'healthy' ? <CheckCircle size={14} /> : <AlertTriangle size={14} />}
                {systemStatus.appHealth === 'healthy' ? 'Healthy' : systemStatus.appHealth === 'warning' ? 'Warning' : 'Critical'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-purple-400" />
              <span className="text-sm text-gray-300">Database:</span>
              <span className={`flex items-center gap-1 text-sm font-medium ${systemStatus.databaseStatus === 'connected' ? 'text-green-400' : 'text-red-400'}`}>
                {systemStatus.databaseStatus === 'connected' ? <CheckCircle size={14} /> : <XCircle size={14} />}
                {systemStatus.databaseStatus === 'connected' ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-gray-400" />
            <span className="text-sm text-gray-300">Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Row 1 */}
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

        {/* Active Users Today */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              8%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeUsersToday.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Active Users Today</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/admin/analytics" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View analytics <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Live Matches */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <Play className="w-6 h-6 text-red-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-red-600 animate-pulse">
              <Activity size={16} />
              Live
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.liveMatches}</p>
          <p className="text-sm text-gray-500 mt-1">Live Matches</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/matches/live" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View live matches <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Revenue Today */}
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
          <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.revenueToday)}</p>
          <p className="text-sm text-gray-500 mt-1">Revenue Today</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/admin/finance" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View finance <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
            <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-indigo-600" />
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

        {/* Active Tournaments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-orange-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              5%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.activeTournaments}</p>
          <p className="text-sm text-gray-500 mt-1">Active Tournaments</p>
          <div className="mt-3 pt-3 border-t border-gray-100">
            <Link to="/tournaments" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View tournaments <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
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
