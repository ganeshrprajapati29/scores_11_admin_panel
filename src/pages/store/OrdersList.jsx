import { useState, useEffect } from 'react'
import { ShoppingCart } from 'lucide-react'
import { storeAPI } from '../../services/api'
import toast from 'react-hot-toast'

const OrdersList = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchOrders() }, [])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await storeAPI.getOrders({ limit: 50 })
      setOrders(response.data || [])
    } catch (error) { toast.error('Failed to fetch') } 
    finally { setLoading(false) }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700'
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl font-bold text-gray-800">Orders</h1><p className="text-gray-500">Manage store orders</p></div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : orders.length === 0 ? <div className="p-8 text-center"><ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No orders found</p></div> : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Order ID</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Customer</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Total</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} className="border-t border-gray-100">
                    <td className="py-3 px-4 text-gray-800">#{order.orderNumber || order._id}</td>
                    <td className="py-3 px-4 text-gray-600">{order.user?.name || 'N/A'}</td>
                    <td className="py-3 px-4 text-gray-800 font-medium">${order.total}</td>
                    <td className="py-3 px-4"><span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status || 'pending'}</span></td>
                    <td className="py-3 px-4 text-gray-600">{order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersList
