import { useState, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, Users, DollarSign, Trophy,
  Calendar, Download, RefreshCw
} from 'lucide-react'
import { 
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend 
} from 'recharts'
import { usersAPI, teamsAPI, matchesAPI, tournamentsAPI, walletAPI } from '../../services/api'
import toast from 'react-hot-toast'

const Reports = () => {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('30')
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeams: 0,
    totalMatches: 0,
    totalTournaments: 0,
    totalRevenue: 0,
    activeUsers: 0
  })

  useEffect(() => {
    fetchReports()
  }, [dateRange])

  const fetchReports = async () => {
    try {
      setLoading(true)
      const [usersRes, teamsRes, matchesRes, tournamentsRes, walletRes] = await Promise.allSettled([
        usersAPI.getAll({ limit: 1 }),
        teamsAPI.getAll({ limit: 1 }),
        matchesAPI.getAll({ limit: 100 }),
        tournamentsAPI.getAll({ limit: 1 }),
        walletAPI.getAdminOverview().catch(() => null)
      ])

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
    } catch (error) {
      console.error('Error fetching reports:', error)
    } finally {
      setLoading(false)
    }
  }

  // Mock data for charts - In production, this would come from API
  const monthlyData = [
    { name: 'Jan', users: 120, matches: 15, revenue: 25000, teams: 8 },
    { name: 'Feb', users: 150, matches: 20, revenue: 32000, teams: 12 },
    { name: 'Mar', users: 180, matches: 25, revenue: 40000, teams: 15 },
    { name: 'Apr', users: 220, matches: 30, revenue: 48000, teams: 18 },
    { name: 'May', users: 280, matches: 35, revenue: 55000, teams: 22 },
    { name: 'Jun', users: 350, matches: 40, revenue: 68000, teams: 28 },
  ]

  const matchStatusData = [
    { name: 'Completed', value: 45, color: '#10b981' },
    { name: 'Scheduled', value: 25, color: '#3b82f6' },
    { name: 'Live', value: 10, color: '#f59e0b' },
    { name: 'Cancelled', value: 5, color: '#ef4444' },
  ]

  const userRoleData = [
    { name: 'Users', value: 60, color: '#3b82f6' },
    { name: 'Players', value: 25, color: '#8b5cf6' },
    { name: 'Admins', value: 5, color: '#ef4444' },
    { name: 'Umpires', value: 10, color: '#f59e0b' },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    }).format(amount || 0)
  }

  const handleExport = () => {
    toast.success('Report exported successfully')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View detailed analytics and performance metrics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="input w-40"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button onClick={fetchReports} className="btn-secondary inline-flex items-center gap-2">
            <RefreshCw size={18} />
            Refresh
          </button>
          <button onClick={handleExport} className="btn-primary inline-flex items-center gap-2">
            <Download size={18} />
            Export
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              8%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalTeams.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Teams</p>
        </div>

        <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <Calendar className="w-6 h-6 text-green-600" />
            </div>
            <span className="flex items-center gap-1 text-sm text-green-600">
              <TrendingUp size={16} />
              15%
            </span>
          </div>
          <p className="text-3xl font-bold text-gray-900">{stats.totalMatches.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">Total Matches</p>
        </div>

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
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
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
                  dataKey="teams" 
                  stroke="#8b5cf6" 
                  strokeWidth={2}
                  dot={{ fill: '#8b5cf6' }}
                  name="Teams"
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

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Overview */}
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

        {/* User Roles Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Roles Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={userRoleData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {userRoleData.map((entry, index) => (
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

      {/* Matches per Month */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Matches & Tournaments Trend</h3>
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
              />
              <Legend />
              <Bar dataKey="matches" fill="#10b981" radius={[4, 4, 0, 0]} name="Matches" />
              <Bar dataKey="teams" fill="#f59e0b" radius={[4, 4, 0, 0]} name="Teams" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default Reports
