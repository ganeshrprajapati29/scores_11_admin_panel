import { useState, useEffect, useMemo } from 'react'
import { 
  DollarSign, TrendingUp, TrendingDown, CreditCard,
  Wallet, Users, ArrowUpRight, ArrowDownRight,
  Download, Calendar, Filter, PieChart as PieChartIcon,
  BarChart3, Activity, Search, X
} from 'lucide-react'

import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Loader from '../../components/common/Loader'
import LineChart from '../../components/charts/LineChart'
import BarChart from '../../components/charts/BarChart'
import PieChart from '../../components/charts/PieChart'
import Table from '../../components/common/Table'
import adminService from '../../services/admin.service'

import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const FinancialOverview = () => {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [financialData, setFinancialData] = useState({
    overview: {},
    revenue: [],
    transactions: [],
    subscriptions: [],
    breakdown: []
  })

  // Debounce search query
  useEffect(() => {
    setIsSearching(true)
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setIsSearching(false)
    }, 500) // 500ms debounce

    return () => clearTimeout(timer)
  }, [searchQuery])


  useEffect(() => {
    fetchFinancialData()
  }, [])

  const fetchFinancialData = async () => {
    try {
      setLoading(true)
      const response = await adminService.getFinancialOverview({
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      })
      setFinancialData(response.data || {})
    } catch (error) {
      toast.error('Failed to fetch financial data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await adminService.exportFinancialData({
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      })
      
      const blob = new Blob([response.data], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `financial-report-${new Date().toISOString().split('T')[0]}.csv`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Financial report exported')
    } catch (error) {
      toast.error('Failed to export data')
    }
  }

  const StatCard = ({ title, value, change, changeType, icon: Icon, color, subtitle }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {change && (
            <div className={`flex items-center gap-1 mt-2 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
              <span className="text-sm font-medium">{change}</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  // Advanced search algorithm for transactions
  const filteredTransactions = useMemo(() => {
    if (!debouncedSearchQuery.trim()) return financialData.transactions || []

    const query = debouncedSearchQuery.toLowerCase().trim()
    const queryWords = query.split(/\s+/).filter(word => word.length > 0)
    
    return (financialData.transactions || []).filter(transaction => {
      const user = transaction.user || {}
      const searchFields = [
        user.name?.toLowerCase() || '',
        user.email?.toLowerCase() || '',
        transaction.type?.toLowerCase() || '',
        transaction.status?.toLowerCase() || '',
        transaction.description?.toLowerCase() || '',
        transaction.amount?.toString() || '',
        transaction._id?.toLowerCase() || ''
      ]
      
      const searchText = searchFields.join(' ')
      
      // Check if all query words are present in search fields
      return queryWords.every(word => searchText.includes(word))
    }).sort((a, b) => {
      // Ranking algorithm: prioritize user name matches
      const aUser = a.user?.name?.toLowerCase() || ''
      const bUser = b.user?.name?.toLowerCase() || ''
      const queryLower = query.toLowerCase()
      
      // Exact name match gets highest priority
      if (aUser === queryLower && bUser !== queryLower) return -1
      if (bUser === queryLower && aUser !== queryLower) return 1
      
      // Name starts with query gets second priority
      const aNameStarts = aUser.startsWith(queryLower)
      const bNameStarts = bUser.startsWith(queryLower)
      if (aNameStarts && !bNameStarts) return -1
      if (bNameStarts && !aNameStarts) return 1
      
      // Default: sort by date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }, [financialData.transactions, debouncedSearchQuery])

  const clearSearch = () => {
    setSearchQuery('')
    setDebouncedSearchQuery('')
  }

  const highlightMatch = (text, query) => {
    if (!query.trim() || !text) return text
    
    const queryLower = query.toLowerCase()
    const textLower = text.toLowerCase()
    
    if (!textLower.includes(queryLower)) return text
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, index) => 
      part.toLowerCase() === queryLower ? (
        <mark key={index} className="bg-yellow-200 text-gray-900 px-0.5 rounded">
          {part}
        </mark>
      ) : part
    )
  }

  const transactionColumns = [
    { key: 'date', title: 'Date', render: (t) => formatDate(t.createdAt, 'MMM DD, HH:mm') },
    { key: 'user', title: 'User', render: (t) => (
      <span className="text-sm">
        {highlightMatch(t.user?.name || 'Unknown', debouncedSearchQuery)}
      </span>
    )},
    { key: 'type', title: 'Type', render: (t) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        t.type === 'credit' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}>
        {highlightMatch(t.type, debouncedSearchQuery)}
      </span>
    )},
    { key: 'amount', title: 'Amount', render: (t) => (
      <span className={`font-medium ${t.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
        {t.type === 'credit' ? '+' : '-'}${t.amount?.toLocaleString()}
      </span>
    )},
    { key: 'status', title: 'Status', render: (t) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
        t.status === 'completed' ? 'bg-green-100 text-green-700' :
        t.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {highlightMatch(t.status, debouncedSearchQuery)}
      </span>
    )},
    { key: 'description', title: 'Description', render: (t) => (
      <p className="text-sm text-gray-600 truncate max-w-xs">
        {highlightMatch(t.description, debouncedSearchQuery)}
      </p>
    )},
  ]


  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Financial Overview</h1>
          <p className="text-gray-600 mt-1">Monitor revenue, transactions, and financial metrics</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-40"
            />
            <span className="text-gray-500">to</span>
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-40"
            />
          </div>
          <Button variant="secondary" onClick={fetchFinancialData}>
            <Filter className="w-4 h-4 mr-2" />
            Apply
          </Button>
          <Button variant="secondary" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Revenue"
          value={`$${financialData.overview?.totalRevenue?.toLocaleString() || '0'}`}
          change="+15.3%"
          changeType="positive"
          icon={DollarSign}
          color="bg-green-500"
          subtitle="All time revenue"
        />
        <StatCard
          title="This Month"
          value={`$${financialData.overview?.monthlyRevenue?.toLocaleString() || '0'}`}
          change="+8.2%"
          changeType="positive"
          icon={TrendingUp}
          color="bg-blue-500"
          subtitle="vs last month"
        />
        <StatCard
          title="Active Subscriptions"
          value={financialData.overview?.activeSubscriptions?.toLocaleString() || '0'}
          change="+12.5%"
          changeType="positive"
          icon={CreditCard}
          color="bg-purple-500"
          subtitle="Recurring revenue"
        />
        <StatCard
          title="Wallet Balance"
          value={`$${financialData.overview?.totalWalletBalance?.toLocaleString() || '0'}`}
          icon={Wallet}
          color="bg-orange-500"
          subtitle="User wallets total"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
          <div className="h-80">
            <LineChart
              data={financialData.revenue || []}
              xKey="date"
              yKey="amount"
              color="#10B981"
            />
          </div>
        </div>

        {/* Revenue by Source */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue by Source</h3>
          <div className="h-80">
            <PieChart
              data={financialData.breakdown || []}
              nameKey="source"
              valueKey="amount"
            />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Subscription Plans */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Subscriptions by Plan</h3>
          <div className="h-64">
            <BarChart
              data={financialData.subscriptions || []}
              xKey="plan"
              yKey="count"
              color="#8B5CF6"
            />
          </div>
        </div>

        {/* Transaction Volume */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 lg:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Transaction Volume</h3>
          <div className="h-64">
            <BarChart
              data={financialData.transactions?.slice(0, 30) || []}
              xKey="date"
              yKey="count"
              color="#3B82F6"
            />
          </div>
        </div>
      </div>

      {/* Search and Recent Transactions */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isSearching ? 'text-primary-500 animate-pulse' : 'text-gray-400'}`} />
              <Input
                type="text"
                placeholder="Search by user, type, status..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 w-64"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                  title="Clear search"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
            <Button variant="secondary" size="sm">View All</Button>
          </div>
        </div>
        
        {/* Search Results Info */}
        {debouncedSearchQuery && (
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 flex items-center justify-between text-sm text-gray-600">
            <span>
              Found {filteredTransactions.length} result{filteredTransactions.length !== 1 ? 's' : ''} 
              {isSearching ? ' (searching...)' : ''}
            </span>
            {filteredTransactions.length > 0 && (
              <span className="text-gray-500">Sorted by relevance</span>
            )}
          </div>
        )}
        
        <Table
          columns={transactionColumns}
          data={filteredTransactions.slice(0, 10)}
          emptyMessage={debouncedSearchQuery ? `No results found for "${debouncedSearchQuery}"` : "No transactions found"}
        />
      </div>


      {/* Financial Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">MRR Growth</p>
              <p className="text-xl font-bold text-gray-900">+18.5%</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Monthly Recurring Revenue growth rate</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">ARPU</p>
              <p className="text-xl font-bold text-gray-900">$24.50</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Average Revenue Per User</p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Churn Rate</p>
              <p className="text-xl font-bold text-gray-900">2.3%</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">Monthly subscription churn rate</p>
        </div>
      </div>
    </div>
  )
}

export default FinancialOverview
