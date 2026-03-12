import { useState } from 'react'
import { ArrowUpRight, ArrowDownRight, Users, Clock, RefreshCw, TrendingUp } from 'lucide-react'

const RetentionAnalytics = () => {
  const [timeRange, setTimeRange] = useState('30d')

  const stats = [
    { label: 'Day 1 Retention', value: '45%', change: '+2.3%', trend: 'up', icon: Users },
    { label: 'Day 7 Retention', value: '28%', change: '-1.2%', trend: 'down', icon: TrendingUp },
    { label: 'Day 30 Retention', value: '18%', change: '+0.8%', trend: 'up', icon: Clock },
    { label: 'Churn Rate', value: '12%', change: '-3.5%', trend: 'up', icon: RefreshCw },
  ]

  const cohorts = [
    { period: 'Week 1', users: 1000, week1: 45, week2: 32, week3: 25, week4: 20 },
    { period: 'Week 2', users: 1200, week1: 48, week2: 35, week3: 28, week4: null },
    { period: 'Week 3', users: 950, week1: 42, week2: 30, week3: null, week4: null },
    { period: 'Week 4', users: 1100, week1: 46, week2: null, week3: null, week4: null },
  ]

  const churnReasons = [
    { reason: 'No relevant matches', percentage: 28, users: 1234 },
    { reason: 'App performance issues', percentage: 22, users: 987 },
    { reason: 'Found alternative app', percentage: 18, users: 812 },
    { reason: 'Not enough features', percentage: 15, users: 678 },
    { reason: 'Account issues', percentage: 10, users: 456 },
    { reason: 'Other', percentage: 7, users: 321 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Retention Analytics</h1>
          <p className="text-gray-500">Understand user retention and churn patterns</p>
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
              <div className="p-2 bg-blue-100 rounded-lg">
                <stat.icon className="w-5 h-5 text-blue-600" />
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
        {/* Cohort Analysis */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Cohort Retention Analysis</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Cohort</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Users</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Week 1</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Week 2</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Week 3</th>
                  <th className="px-4 py-2 text-center text-sm font-medium text-gray-500">Week 4</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((cohort, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="px-4 py-3 text-sm text-gray-900 font-medium">{cohort.period}</td>
                    <td className="px-4 py-3 text-sm text-gray-600 text-center">{cohort.users}</td>
                    <td className="px-4 py-3 text-sm text-center">
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{cohort.week1}%</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {cohort.week2 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{cohort.week2}%</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {cohort.week3 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{cohort.week3}%</span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-center">
                      {cohort.week4 ? (
                        <span className="px-2 py-1 bg-green-100 text-green-700 rounded">{cohort.week4}%</span>
                      ) : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Churn Reasons */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Churn Reasons</h3>
          <div className="space-y-4">
            {churnReasons.map((item) => (
              <div key={item.reason}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-gray-900 font-medium">{item.reason}</span>
                  <span className="text-gray-500">{item.users.toLocaleString()} users</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full" 
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">{item.percentage}% of churned users</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RetentionAnalytics

