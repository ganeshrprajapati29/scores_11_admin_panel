import { useState, useEffect } from 'react'
import { Users } from 'lucide-react'
import { subscriptionsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const SubscribersList = () => {
  const [subscribers, setSubscribers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchSubscribers() }, [])

  const fetchSubscribers = async () => {
    try {
      setLoading(true)
      const response = await subscriptionsAPI.getSubscribers({ limit: 50 })
      setSubscribers(response.data || [])
    } catch (error) { toast.error('Failed to fetch') } 
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Subscribers</h1><p className="text-gray-500">Manage subscribers</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : subscribers.length === 0 ? <div className="p-8 text-center"><Users className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No subscribers found</p></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50"><tr><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">User</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Plan</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th><th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Expires</th></tr></thead>
              <tbody>{subscribers.map((sub) => (
                <tr key={sub._id} className="border-t border-gray-100">
                  <td className="py-3 px-4 text-gray-800">{sub.user?.name || 'N/A'}</td>
                  <td className="py-3 px-4 text-gray-600">{sub.plan?.name || 'N/A'}</td>
                  <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${sub.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{sub.status || 'N/A'}</span></td>
                  <td className="py-3 px-4 text-gray-600">{sub.endDate ? new Date(sub.endDate).toLocaleDateString() : 'N/A'}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscribersList
