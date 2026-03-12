import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Users, PageViews, Clock, Globe } from 'lucide-react'

const TrafficAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const stats = [
    { 
      label: 'Total Visitors', 
      value: '45,231', 
      change: '+12.5%', 
      trend: 'up',
      icon: Users 
    },
    { 
      label: 'Page Views', 
      value: '128,432', 
      change: '+8.2%', 
      trend: 'up',
      icon: PageViews 
    },
    { 
      label: 'Avg. Session', 
      value: '4m 32s', 
      change: '-2.1%', 
      trend: 'down',
      icon: Clock 
    },
    { 
      label: 'Bounce Rate', 
      value: '42.3%', 
      change: '-5.4%', 
      trend: 'up',
      icon: Globe 
    },
  ]

  const topPages = [
    { page: '/dashboard', views: 12453, unique: 8921 },
    { page: '/players', views: 8234, unique: 6234 },
    { page: '/matches', views: 6721, unique: 5123 },
    { page: '/tournaments', views: 5432, unique: 4123 },
    { page: '/teams', views: 4321, unique: 3421 },
  ]

  const trafficSources = [
    { source: 'Direct', visits: 18234, percentage: 40 },
    { source: 'Search', visits: 12345, percentage: 27 },
    { source: 'Social', visits: 8234, percentage: 18 },
    { source: 'Referral', visits: 4567, percentage: 10 },
    { source: 'Email', visits: 2351, percentage: 5 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Traffic Analytics</h1>
          <p className="text-gray-500">Track your website traffic and user behavior</p>
        </div>
        <div className="flex items-center gap-2">
          {['24h', '7d', '30d', '90d'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                timeRange === range
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Pages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Pages</h3>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={page.page} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-900 font-medium">{page.page}</span>
                </div>
                <div className="text-right">
                  <p className="text-gray-900 font-medium">{page.views.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{page.unique.toLocaleString()} unique</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Traffic Sources</h3>
          <div className="space-y-4">
            {trafficSources.map((source) => (
              <div key={source.source}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-900 font-medium">{source.source}</span>
                  <span className="text-gray-500">{source.visits.toLocaleString()} visits</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${source.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrafficAnalytics

