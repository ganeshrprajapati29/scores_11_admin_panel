import { useState, useEffect } from 'react'
import { 
  BarChart3, TrendingUp, Users, DollarSign, 
  Activity, Calendar, Download, Filter,
  ArrowUp, ArrowDown, Target, Globe
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Loader } from '../../components/common/Loader'
import { LineChart } from '../../components/charts/LineChart'
import { BarChart } from '../../components/charts/BarChart'
import { PieChart } from '../../components/charts/PieChart'
import { adminService } from '../../services/admin.service'
import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [analyticsData, setAnalyticsData] = useState({
    userStats: {},
    revenueStats: {},
    matchStats: {},
    engagementStats: {}
  })

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await adminService.getAdvancedAnalytics({
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      })
      setAnalyticsData(response.data || {})
    } catch (error) {
      toast.error('Failed to fetch analytics data')
    } finally {
      setLoading(false)
    }
  }

  const handleExport = async () => {
    try {
      const response = await adminService.exportAnalytics({
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      })
      
      const blob = new Blob([JSON.stringify(response.data, null, 2)], { type: 'application/json' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `analytics-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      
      toast.success('Analytics exported successfully')
    } catch (error) {
      toast.error('Failed to export analytics')
    }
  }

  const StatCard = ({ title, value, change, changeType, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-600 mb-1">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className={`flex items-center gap-1 mt-2 ${changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
              {changeType === 'positive' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
              <span className="text-sm font-medium">{change}</span>
              <span className="text-sm text-gray-500">vs last period</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  )

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and metrics</p>
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
          <Button variant="secondary" onClick={fetchAnalytics}>
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
          title="Total Users"
          value={analyticsData.userStats?.total?.toLocaleString() || '0'}
          change="+12.5%"
          changeType="positive"
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Revenue"
          value={`$${analyticsData.revenueStats?.total?.toLocaleString() || '0'}`}
          change="+8.2%"
          changeType="positive"
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Active Matches"
          value={analyticsData.matchStats?.active?.toString() || '0'}
          change="-3.1%"
          changeType="negative"
          icon={Activity}
          color="bg-orange-500"
        />
        <StatCard
          title="Engagement Rate"
          value={`${analyticsData.engagementStats?.rate?.toFixed(1) || '0'}%`}
          change="+5.7%"
          changeType="positive"
          icon={Target}
          color="bg-purple-500"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Growth</h3>
          <div className="h-80">
            <LineChart
              data={analyticsData.userStats?.growthData || []}
              xKey="date"
              yKey="users"
              color="#3B82F6"
            />
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
          <div className="h-80">
            <BarChart
              data={analyticsData.revenueStats?.trendData || []}
              xKey="date"
              yKey="revenue"
              color="#10B981"
            />
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="h-64">
            <PieChart
              data={analyticsData.engagementStats?.trafficSources || []}
              nameKey="source"
              valueKey="value"
            />
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Device Usage</h3>
          <div className="h-64">
            <PieChart
              data={analyticsData.engagementStats?.deviceBreakdown || []}
              nameKey="device"
              valueKey="value"
            />
          </div>
        </div>

        {/* Top Performing Content */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Content</h3>
          <div className="space-y-3">
            {(analyticsData.engagementStats?.topContent || []).map((content, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{content.title}</p>
                    <p className="text-xs text-gray-500">{content.type}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{content.views?.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">views</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Metrics Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Daily Metrics</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">New Users</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Users</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Matches</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Conversion</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(analyticsData.dailyMetrics || []).map((metric, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{formatDate(metric.date, 'MMM DD, YYYY')}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{metric.newUsers?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{metric.activeUsers?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">${metric.revenue?.toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{metric.matches}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{metric.orders}</td>
                  <td className="px-4 py-3 text-sm text-gray-600">{metric.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Geographic Distribution */}
      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {(analyticsData.userStats?.geoDistribution || []).map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-700">{country.name}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary-500 rounded-full"
                      style={{ width: `${country.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{country.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Map visualization coming soon</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
