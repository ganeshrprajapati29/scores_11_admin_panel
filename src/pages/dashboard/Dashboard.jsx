import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  Users, Users2, Trophy, Calendar, IndianRupee, 
  TrendingUp, TrendingDown, Activity, Eye, Play,
  Bell, MessageSquare, ShoppingCart, Globe, Award,
  ChevronRight, RefreshCw, BarChart3, Target,
  Clock, Zap, Star, Filter
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, RadialBarChart, RadialBar 
} from 'recharts'
import { adminAPI, tournamentsAPI, matchesAPI } from '../../services/api'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalMatches: 0,
    totalTournaments: 0,
    totalRevenue: 0,
    activeTournaments: 0,
    liveMatches: 0,
    totalPlayers: 0,
    totalClubs: 0,
    completedMatches: 0,
    upcomingMatches: 0
  })
  const [recentMatches, setRecentMatches] = useState([])
  const [recentTournaments, setRecentTournaments] = useState([])
  const [liveMatches, setLiveMatches] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [matchStatusData, setMatchStatusData] = useState([])
  const [tournamentStatusData, setTournamentStatusData] = useState([])
  const [revenueData, setRevenueData] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('6m')

  useEffect(() => {
    fetchDashboardData()
  }, [selectedPeriod])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch all data in parallel
      const [dashboardRes, tournamentsRes, matchesRes] = await Promise.allSettled([
        adminAPI.getDashboard(),
        tournamentsAPI.getAll({ limit: 5, status: 'in_progress' }),
        matchesAPI.getAll({ limit: 10, status: 'live' })
      ])

      // Process dashboard data
      if (dashboardRes.status === 'fulfilled') {
        const data = dashboardRes.value.data
        setStats({
          totalUsers: data.stats?.totalUsers || 0,
          totalTeams: data.stats?.totalTeams || 0,
          totalMatches: data.stats?.totalMatches || 0,
          totalTournaments: data.stats?.totalTournaments || 0,
          totalRevenue: data.stats?.totalRevenue || 0,
          activeTournaments: data.stats?.activeTournaments || 0,
          liveMatches: data.stats?.liveMatches || 0,
          totalPlayers: data.stats?.totalPlayers || 0,
          totalClubs: data.stats?.totalClubs || 0,
          completedMatches: data.stats?.completedMatches || 0,
          upcomingMatches: data.stats?.upcomingMatches || 0
        })

        setRecentMatches(data.recentMatches || [])
        setRecentTournaments(data.recentTournaments || [])

        // Process monthly data
        if (data.monthlyData?.length > 0) {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
          setMonthlyData(data.monthlyData.map(item => {
            const [, month] = item.month.split('-')
            return {
              name: monthNames[parseInt(month) - 1],
              users: item.users || 0,
              matches: item.matches || 0,
              revenue: item.revenue || 0
            }
          }))
          setRevenueData(data.monthlyData.map(item => {
            const [, month] = item.month.split('-')
            return {
              name: monthNames[parseInt(month) - 1],
              revenue: item.revenue || 0,
              expenses: Math.floor((item.revenue || 0) * 0.4),
              profit: Math.floor((item.revenue || 0) * 0.6)
            }
          }))
        }
      }

      // Process live matches
      if (matchesRes.status === 'fulfilled') {
        setLiveMatches(matchesRes.value.data?.data || [])
      }

      // Process tournament status
      if (tournamentsRes.status === 'fulfilled') {
        const tournamentData = tournamentsRes.value.data?.data || []
        const statusCounts = {
          draft: 0,
          published: 0,
          in_progress: 0,
          completed: 0,
          cancelled: 0
        }
        tournamentData.forEach(t => {
          if (statusCounts[t.status] !== undefined) {
            statusCounts[t.status]++
          }
        })
        setTournamentStatusData([
          { name: 'In Progress', value: statusCounts.in_progress, color: '#10b981' },
          { name: 'Completed', value: statusCounts.completed, color: '#3b82f6' },
          { name: 'Published', value: statusCounts.published, color: '#f59e0b' },
          { name: 'Draft', value: statusCounts.draft, color: '#6b7280' }
        ])
      }

      // Default charts data if not provided
      if (monthlyData.length === 0) {
        setMonthlyData(generateDefaultMonthlyData())
      }
      if (matchStatusData.length === 0) {
        setMatchStatusData(generateDefaultMatchStatusData())
      }
      if (tournamentStatusData.length === 0) {
        setTournamentStatusData(generateDefaultTournamentData())
      }
      if (revenueData.length === 0) {
        setRevenueData(generateDefaultRevenueData())
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      // Set defaults on error
      setMonthlyData(generateDefaultMonthlyData())
      setMatchStatusData(generateDefaultMatchStatusData())
      setTournamentStatusData(generateDefaultTournamentData())
      setRevenueData(generateDefaultRevenueData())
    } finally {
      setLoading(false)
    }
  }

  const generateDefaultMonthlyData = () => [
    { name: 'Jan', users: 45, matches: 12, revenue: 125000 },
    { name: 'Feb', users: 52, matches: 18, revenue: 168000 },
    { name: 'Mar', users: 61, matches: 22, revenue: 195000 },
    { name: 'Apr', users: 55, matches: 19, revenue: 142000 },
    { name: 'May', users: 78, matches: 28, revenue: 225000 },
    { name: 'Jun', users: 92, matches: 35, revenue: 285000 },
  ]

  const generateDefaultMatchStatusData = () => [
    { name: 'Completed', value: 156, color: '#10b981' },
    { name: 'Scheduled', value: 42, color: '#3b82f6' },
    { name: 'Live', value: 8, color: '#f59e0b' },
    { name: 'Cancelled', value: 12, color: '#ef4444' },
  ]

  const generateDefaultTournamentData = () => [
    { name: 'In Progress', value: 5, color: '#10b981' },
    { name: 'Completed', value: 12, color: '#3b82f6' },
    { name: 'Upcoming', value: 8, color: '#f59e0b' },
    { name: 'Draft', value: 3, color: '#6b7280' },
  ]

  const generateDefaultRevenueData = () => [
    { name: 'Jan', revenue: 125000, expenses: 50000, profit: 75000 },
    { name: 'Feb', revenue: 168000, expenses: 67200, profit: 100800 },
    { name: 'Mar', revenue: 195000, expenses: 78000, profit: 117000 },
    { name: 'Apr', revenue: 142000, expenses: 56800, profit: 85200 },
    { name: 'May', revenue: 225000, expenses: 90000, profit: 135000 },
    { name: 'Jun', revenue: 285000, expenses: 114000, profit: 171000 },
  ]

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    setRefreshing(false)
  }

  const getMatchStatusLabel = (status) => {
    const labels = {
      scheduled: 'Scheduled',
      live: 'Live',
      completed: 'Completed',
      cancelled: 'Cancelled',
      ongoing: 'Ongoing'
    }
    return labels[status] || status || 'Unknown'
  }

  const getTournamentStatusColor = (status) => {
    const colors = {
      in_progress: 'bg-green-100 text-green-700',
      completed: 'bg-blue-100 text-blue-700',
      draft: 'bg-gray-100 text-gray-700',
      published: 'bg-yellow-100 text-yellow-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return colors[status] || 'bg-gray-100 text-gray-700'
  }

  const formatCurrency = (amount) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`
    } else if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`
    }
    return `₹${amount || 0}`
  }

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num?.toString() || '0'
  }

  // Calculate percentage change (mock for demo)
  const getPercentageChange = (key) => {
    const changes = {
      totalUsers: 12,
      totalTeams: 8,
      totalMatches: 15,
      totalTournaments: 5,
      totalRevenue: 23,
      liveMatches: -5
    }
    return changes[key] || 0
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <button 
              onClick={handleRefresh}
              className={`p-2 rounded-lg hover:bg-gray-100 transition-all ${refreshing ? 'animate-spin' : ''}`}
            >
              <RefreshCw size={20} className="text-gray-500" />
            </button>
          </div>
          <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your platform.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bell size={20} className="text-gray-500" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </div>
          <Link to="/" className="btn-secondary flex items-center gap-2">
            <Eye size={18} />
            View Site
          </Link>
        </div>
      </div>

      {/* Live Matches Alert */}
      {stats.liveMatches > 0 && (
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Play size={20} className="animate-pulse" />
            </div>
            <div>
              <p className="font-semibold">Live Matches Now!</p>
              <p className="text-sm text-white/80">{stats.liveMatches} match{stats.liveMatches > 1 ? 'es' : ''} currently in progress</p>
            </div>
          </div>
          <Link to="/matches?status=live" className="bg-white text-red-500 px-4 py-2 rounded-lg font-medium hover:bg-white/90 transition">
            Watch Now
          </Link>
        </div>
      )}

      {/* Stats Cards Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Users */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${getPercentageChange('totalUsers') > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getPercentageChange('totalUsers') > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(getPercentageChange('totalUsers'))}%
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalUsers)}</p>
              <p className="text-sm text-gray-500 mt-1">Total Users</p>
            </div>
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-blue-500" />
            </div>
          </div>
          <Link to="/users" className="text-sm text-blue-600 hover:text-blue-700 mt-3 block">View all users →</Link>
        </div>

        {/* Total Teams */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Users2 className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${getPercentageChange('totalTeams') > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getPercentageChange('totalTeams') > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(getPercentageChange('totalTeams'))}%
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalTeams)}</p>
              <p className="text-sm text-gray-500 mt-1">Total Teams</p>
            </div>
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Target size={20} className="text-purple-500" />
            </div>
          </div>
          <Link to="/teams" className="text-sm text-purple-600 hover:text-purple-700 mt-3 block">View all teams →</Link>
        </div>

        {/* Active Tournaments */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30">
              <Trophy className="w-6 h-6 text-white" />
            </div>
            <div className="flex items-center gap-1 text-sm text-green-600 font-medium">
              <Activity size={16} />
              Active
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{stats.activeTournaments}</p>
              <p className="text-sm text-gray-500 mt-1">Active Tournaments</p>
            </div>
            <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-green-500" />
            </div>
          </div>
          <Link to="/tournaments?status=in_progress" className="text-sm text-green-600 hover:text-green-700 mt-3 block">View tournaments →</Link>
        </div>

        {/* Total Revenue */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/30">
              <IndianRupee className="w-6 h-6 text-white" />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${getPercentageChange('totalRevenue') > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {getPercentageChange('totalRevenue') > 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(getPercentageChange('totalRevenue'))}%
            </div>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
              <p className="text-sm text-gray-500 mt-1">Total Revenue</p>
            </div>
            <div className="w-10 h-10 bg-yellow-50 rounded-lg flex items-center justify-center">
              <BarChart3 size={20} className="text-yellow-500" />
            </div>
          </div>
          <Link to="/wallet" className="text-sm text-yellow-600 hover:text-yellow-700 mt-3 block">View wallet →</Link>
        </div>
      </div>

      {/* Stats Cards Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Matches */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMatches}</p>
              <p className="text-xs text-gray-500">Total Matches</p>
            </div>
          </div>
        </div>

        {/* Live Matches */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <Activity className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.liveMatches}</p>
              <p className="text-xs text-gray-500">Live Matches</p>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Award className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.completedMatches}</p>
              <p className="text-xs text-gray-500">Completed</p>
            </div>
          </div>
        </div>

        {/* Upcoming */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.upcomingMatches}</p>
              <p className="text-xs text-gray-500">Upcoming</p>
            </div>
          </div>
        </div>

        {/* Total Tournaments */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <Star className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{stats.totalTournaments}</p>
              <p className="text-xs text-gray-500">Tournaments</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* User & Match Trends */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Growth Trends</h3>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1"
            >
              <option value="3m">Last 3 months</option>
              <option value="6m">Last 6 months</option>
              <option value="12m">Last 12 months</option>
            </select>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMatches" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
                <YAxis stroke="#9ca3af" fontSize={12} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
                <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" name="Users" />
                <Area type="monotone" dataKey="matches" stroke="#10b981" fillOpacity={1} fill="url(#colorMatches)" name="Matches" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Match Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Match Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={matchStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {matchStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Tournament Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tournament Status</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart innerRadius="30%" outerRadius="100%" data={tournamentStatusData} startAngle={90} endAngle={-270}>
                <RadialBar minAngle={15} background clockWise dataKey="value" cornerRadius={10} label={{ position: 'insideStart', fill: '#fff', fontSize: '12px' }}>
                  {tournamentStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </RadialBar>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                />
                <Legend />
              </RadialBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Overview</h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} barGap={0}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} />
              <YAxis stroke="#9ca3af" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px' }}
                formatter={(value) => formatCurrency(value)}
              />
              <Legend />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Revenue" />
              <Bar dataKey="expenses" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Expenses" />
              <Bar dataKey="profit" fill="#10b981" radius={[4, 4, 0, 0]} name="Profit" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity & Tournaments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Matches */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Matches</h3>
            <Link to="/matches" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : recentMatches.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No matches found</p>
              </div>
            ) : (
              recentMatches.slice(0, 5).map((match) => (
                <Link 
                  key={match._id} 
                  to={`/matches/${match._id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                    match.status === 'live' ? 'bg-green-100' : 
                    match.status === 'completed' ? 'bg-gray-100' : 'bg-blue-100'
                  }`}>
                    {match.status === 'live' ? (
                      <Play size={20} className="text-green-600 animate-pulse" />
                    ) : match.status === 'completed' ? (
                      <Activity size={20} className="text-gray-600" />
                    ) : (
                      <Calendar size={20} className="text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">
                      {match.team1?.name || 'TBD'} vs {match.team2?.name || 'TBD'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {match.venue?.name || 'TBD'} • {getMatchStatusLabel(match.status)}
                    </p>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Tournaments */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tournaments</h3>
            <Link to="/tournaments" className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1">
              View All <ChevronRight size={16} />
            </Link>
          </div>
          <div className="space-y-3">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-4 p-3 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))
            ) : recentTournaments.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Trophy className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No tournaments found</p>
              </div>
            ) : (
              recentTournaments.slice(0, 5).map((tournament) => (
                <Link 
                  key={tournament._id} 
                  to={`/tournaments/${tournament._id}`}
                  className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                    <Trophy size={20} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{tournament.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${getTournamentStatusColor(tournament.status)}`}>
                        {tournament.status?.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">
                        {tournament.teams?.length || 0} Teams
                      </span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-gray-400 group-hover:text-gray-600" />
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
          {[
            { to: '/matches/create', icon: Calendar, color: 'blue', label: 'Schedule Match' },
            { to: '/tournaments/create', icon: Trophy, color: 'green', label: 'Create Tournament' },
            { to: '/teams/create', icon: Users2, color: 'purple', label: 'Add Team' },
            { to: '/blogs/create', icon: MessageSquare, color: 'cyan', label: 'Write Blog' },
            { to: '/store/add-product', icon: ShoppingCart, color: 'yellow', label: 'Add Product' },
            { to: '/settings', icon: Globe, color: 'indigo', label: 'Settings' },
          ].map((action, index) => (
            <Link 
              key={index}
              to={action.to} 
              className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-primary-500 hover:bg-primary-50 transition-all group"
            >
              <div className={`w-12 h-12 bg-${action.color}-100 rounded-xl flex items-center justify-center group-hover:bg-${action.color}-200 transition`}>
                <action.icon className={`w-6 h-6 text-${action.color}-600`} />
              </div>
              <span className="text-sm font-medium text-gray-700 text-center">{action.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

