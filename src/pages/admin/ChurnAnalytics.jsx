import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Users, AlertTriangle, TrendingDown, Calendar } from 'lucide-react'

const ChurnAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d')

  const stats = [
    { label: 'Churn Rate', value: '12.3%', change: '-2.1%', trend: 'up', icon: TrendingDown },
    { label: 'At Risk Users', value: '1,234', change: '+156', trend: 'down', icon: AlertTriangle },
    { label: 'Churned This Month', value: '456', change: '-89', trend: 'up', icon: Users },
    { label: 'Avg. Days Before Churn', value: '23', change: '+3', trend: 'down', icon: Calendar },
  ]

  const atRiskUsers = [
    { id: 1, user: 'John Doe', email: 'john@example.com', riskScore: 85, lastActive: '5 days ago', reason: 'No login in 5 days' },
    { id: 2, user: 'Jane Smith', email: 'jane@example.com', riskScore: 72, lastActive: '4 days ago', reason: 'Declining engagement' },
    { id: 3, user: 'Mike Johnson', email: 'mike@example.com', riskScore: 68, lastActive: '3 days ago', reason: 'Support ticket unresolved' },
    { id: 4, user: 'Sarah Williams', email: 'sarah@example.com', riskScore: 65, lastActive: '2 days ago', reason: 'Payment failed' },
  ]

  const churnTimeline = [
    { month: 'Jan', churned: 234, retained: 4500 },
    { month: 'Feb', churned: 198, retained: 4600 },
    { month: 'Mar', churned: 287, retained: 4700 },
    { month: 'Apr', churned: 312, retained: 4550 },
    { month: 'May', churned: 189, retained: 4800 },
    { month: 'Jun', churned: 156, retained: 4900 },
  ]

  const getRiskColor = (score) => {
    if (score >= 70) return 'bg-red-100 text-red-700'
    if (score >= 50) return 'bg-yellow-100 text-yellow-700'
    return 'bg-green-100 text-green-700'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Churn Analytics</h1>
          <p className="text-gray-500">Identify and prevent user churn</p>
        </div>
        <div className="flex items-center gap-2">
          {['7d', '30d', '90d', '1y'].map((range) => (
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
              <div className="p-2 bg-red-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-red-600" />
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
        {/* At Risk Users */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users At Risk</h3>
          <div className="space-y-4">
            {atRiskUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-gray-900">{user.user}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getRiskColor(user.riskScore)}`}>
                      {user.riskScore}% Risk
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  <p className="text-xs text-gray-400 mt-1">{user.reason} • {user.lastActive}</p>
                </div>
                <button className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700">
                  Re-engage
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Churn Timeline */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn vs Retention Trend</h3>
          <div className="space-y-3">
            {churnTimeline.map((item) => (
              <div key={item.month} className="flex items-center gap-4">
                <span className="w-12 text-sm text-gray-500">{item.month}</span>
                <div className="flex-1 flex gap-1">
                  <div 
                    className="h-6 bg-red-400 rounded" 
                    style={{ width: `${(item.churned / (item.churned + item.retained)) * 100}%` }}
                  />
                  <div 
                    className="h-6 bg-green-400 rounded" 
                    style={{ width: `${(item.retained / (item.churned + item.retained)) * 100}%` }}
                  />
                </div>
                <div className="w-24 text-right text-sm">
                  <span className="text-red-600">{item.churned}</span>
                  <span className="text-gray-300 mx-1">/</span>
                  <span className="text-green-600">{item.retained}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-400 rounded" />
              <span className="text-sm text-gray-500">Churned</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded" />
              <span className="text-sm text-gray-500">Retained</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChurnAnalytics

