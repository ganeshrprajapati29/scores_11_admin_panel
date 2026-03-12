import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Heart, MessageCircle, Share2, Eye, Users, Clock } from 'lucide-react'

const EngagementAnalytics = () => {
  const [timeRange, setTimeRange] = useState('7d')

  const stats = [
    { label: 'Total Interactions', value: '89,234', change: '+15.3%', trend: 'up', icon: Heart },
    { label: 'Comments', value: '12,456', change: '+8.7%', trend: 'up', icon: MessageCircle },
    { label: 'Shares', value: '5,678', change: '+22.1%', trend: 'up', icon: Share2 },
    { label: 'Avg. View Time', value: '3m 45s', change: '-3.2%', trend: 'down', icon: Clock },
  ]

  const topContent = [
    { title: 'IPL 2024 Final Highlights', views: 45234, likes: 3421, comments: 1234, shares: 567 },
    { title: 'Player Interview: Virat Kohli', views: 38234, likes: 2890, comments: 987, shares: 432 },
    { title: 'Tournament Results: State Cup', views: 29321, likes: 1987, comments: 654, shares: 321 },
    { title: 'Match Preview: India vs Australia', views: 25432, likes: 1654, comments: 543, shares: 287 },
  ]

  const userEngagement = [
    { level: 'High', users: 1234, percentage: 15, avgActions: 25 },
    { level: 'Medium', users: 4567, percentage: 35, avgActions: 12 },
    { level: 'Low', users: 6234, percentage: 40, avgActions: 3 },
    { level: 'Churned', users: 1234, percentage: 10, avgActions: 0 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Engagement Analytics</h1>
          <p className="text-gray-500">Track user engagement and content performance</p>
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
              <div className="p-2 bg-pink-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-pink-600" />
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
        {/* Top Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
          <div className="space-y-4">
            {topContent.map((content, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-gray-900">{content.title}</span>
                  <span className="text-sm text-gray-500">#{index + 1}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <div className="text-center">
                    <Eye className="w-4 h-4 text-gray-400 mx-auto mb-1" />
                    <span className="text-gray-600">{content.views.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <Heart className="w-4 h-4 text-pink-400 mx-auto mb-1" />
                    <span className="text-gray-600">{content.likes.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <MessageCircle className="w-4 h-4 text-blue-400 mx-auto mb-1" />
                    <span className="text-gray-600">{content.comments.toLocaleString()}</span>
                  </div>
                  <div className="text-center">
                    <Share2 className="w-4 h-4 text-green-400 mx-auto mb-1" />
                    <span className="text-gray-600">{content.shares.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* User Engagement */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">User Engagement Levels</h3>
          <div className="space-y-4">
            {userEngagement.map((item) => (
              <div key={item.level}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-900 font-medium">{item.level}</span>
                  <span className="text-gray-500">{item.users.toLocaleString()} users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-1">
                  <div 
                    className={`h-2 rounded-full ${
                      item.level === 'High' ? 'bg-green-500' :
                      item.level === 'Medium' ? 'bg-blue-500' :
                      item.level === 'Low' ? 'bg-yellow-500' : 'bg-red-500'
                    }`} 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">{item.percentage}% • Avg. {item.avgActions} actions/day</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EngagementAnalytics

