import { useState, useEffect } from 'react'
import { 
  ShoppingBag, Package, Truck, CreditCard, Users, 
  TrendingUp, DollarSign, Box, AlertCircle, CheckCircle,
  Clock, XCircle, Eye, Download, Filter, Search,
  ChevronDown, ChevronUp, MoreHorizontal
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { Table } from '../../components/common/Table'
import { Loader } from '../../components/common/Loader'
import { LineChart } from '../../components/charts/LineChart'
import { BarChart } from '../../components/charts/BarChart'
import { PieChart } from '../../components/charts/PieChart'
import { adminService } from '../../services/admin.service'
import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const StoreManager = () => {
  const [activeTab, setActiveTab] = useState('overview')
  const [loading, setLoading] = useState(true)
  const [storeData, setStoreData] = useState({
    overview: {},
    orders: [],
    products: [],
    categories: [],
    revenue: [],
    topProducts: []
  })
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] = useState('all')
  const [dateRange, setDateRange] = useState({ start: '', end: '' })

  useEffect(() => {
    fetchStoreData()
  }, [activeTab])

  const fetchStoreData = async () => {
    try {
      setLoading(true)
      const response = await adminService.getStoreData({
        tab: activeTab,
        status: filterStatus !== 'all' ? filterStatus : undefined,
        startDate: dateRange.start || undefined,
        endDate: dateRange.end || undefined
      })
      setStoreData(response.data || {})
    } catch (error) {
      toast.error('Failed to fetch store data')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await adminService.updateOrderStatus(orderId, { status })
      toast.success(`Order marked as ${status}`)
      fetchStoreData()
      setIsOrderModalOpen(false)
    } catch (error) {
      toast.error('Failed to update order')
    }
  }

  const getStatusBadge = (status) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-700',
      processing: 'bg-blue-100 text-blue-700',
      shipped: 'bg-purple-100 text-purple-700',
      delivered: 'bg-green-100 text-green-700',
      cancelled: 'bg-red-100 text-red-700',
      refunded: 'bg-gray-100 text-gray-700'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.pending}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const orderColumns = [
    { key: 'orderId', title: 'Order ID', render: (o) => (
      <span className="font-mono text-sm text-primary-600">#{o.orderId}</span>
    )},
    { key: 'customer', title: 'Customer', render: (o) => (
      <div>
        <p className="font-medium text-gray-900">{o.customer?.name}</p>
        <p className="text-sm text-gray-500">{o.customer?.email}</p>
      </div>
    )},
    { key: 'items', title: 'Items', render: (o) => (
      <span className="text-sm text-gray-600">{o.items?.length || 0} items</span>
    )},
    { key: 'total', title: 'Total', render: (o) => (
      <span className="font-medium text-gray-900">${o.total?.toLocaleString()}</span>
    )},
    { key: 'status', title: 'Status', render: (o) => getStatusBadge(o.status) },
    { key: 'date', title: 'Date', render: (o) => (
      <span className="text-sm text-gray-600">{formatDate(o.createdAt, 'MMM DD, YYYY')}</span>
    )},
    { key: 'actions', title: 'Actions', render: (o) => (
      <button
        onClick={() => {
          setSelectedOrder(o)
          setIsOrderModalOpen(true)
        }}
        className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
      >
        <Eye className="w-4 h-4" />
      </button>
    )},
  ]

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Store Management</h1>
          <p className="text-gray-600 mt-1">Complete e-commerce control center</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'orders', label: 'Orders', icon: Package },
            { id: 'products', label: 'Products', icon: Box },
            { id: 'customers', label: 'Customers', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: ShoppingBag },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { 
                title: 'Total Revenue', 
                value: `$${storeData.overview?.totalRevenue?.toLocaleString() || '0'}`, 
                change: '+12.5%', 
                icon: DollarSign,
                color: 'bg-green-500'
              },
              { 
                title: 'Total Orders', 
                value: storeData.overview?.totalOrders?.toLocaleString() || '0', 
                change: '+8.2%', 
                icon: Package,
                color: 'bg-blue-500'
              },
              { 
                title: 'Products Sold', 
                value: storeData.overview?.productsSold?.toLocaleString() || '0', 
                change: '+15.3%', 
                icon: Box,
                color: 'bg-purple-500'
              },
              { 
                title: 'Active Customers', 
                value: storeData.overview?.activeCustomers?.toLocaleString() || '0', 
                change: '+5.7%', 
                icon: Users,
                color: 'bg-orange-500'
              },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trend</h3>
              <div className="h-64">
                <LineChart
                  data={storeData.revenue || []}
                  xKey="date"
                  yKey="amount"
                  color="#10B981"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales by Category</h3>
              <div className="h-64">
                <PieChart
                  data={storeData.categories || []}
                  nameKey="name"
                  valueKey="sales"
                />
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Top Selling Products</h3>
            </div>
            <div className="divide-y divide-gray-200">
              {(storeData.topProducts || []).map((product, index) => (
                <div key={index} className="p-4 flex items-center gap-4">
                  <span className="w-8 h-8 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                    {index + 1}
                  </span>
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${product.revenue?.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">{product.sold} sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 flex flex-wrap gap-4">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type="text" placeholder="Search orders..." className="pl-10" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <Input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              placeholder="Start Date"
            />
            <Input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              placeholder="End Date"
            />
            <Button variant="secondary" onClick={fetchStoreData}>
              <Filter className="w-4 h-4 mr-2" />
              Apply
            </Button>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <Table
              columns={orderColumns}
              data={storeData.orders || []}
              emptyMessage="No orders found"
            />
          </div>
        </div>
      )}

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(storeData.products || []).map((product) => (
              <div key={product._id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="relative h-48">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                  {product.stock < 10 && (
                    <div className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs rounded">
                      Low Stock
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h4 className="font-medium text-gray-900 mb-1">{product.name}</h4>
                  <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900">${product.price}</span>
                    <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      <Modal
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false)
          setSelectedOrder(null)
        }}
        title={`Order #${selectedOrder?.orderId}`}
        size="lg"
      >
        {selectedOrder && (
          <div className="space-y-6">
            {/* Order Status */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <div className="mt-1">{getStatusBadge(selectedOrder.status)}</div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium text-gray-900">{formatDate(selectedOrder.createdAt, 'MMM DD, YYYY HH:mm')}</p>
              </div>
            </div>

            {/* Customer Info */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Customer Information</h4>
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium text-gray-900">{selectedOrder.customer?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900\">{selectedOrder.customer?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900\">{selectedOrder.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="font-medium text-gray-900\">{selectedOrder.customer?._id}</p>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Shipping Address</h4>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900\">{selectedOrder.shippingAddress?.street}</p>
                <p className="text-gray-600\">{selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.state} {selectedOrder.shippingAddress?.zip}</p>
                <p className="text-gray-600\">{selectedOrder.shippingAddress?.country}</p>
              </div>
            </div>

            {/* Order Items */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Order Items</h4>
              <div className="space-y-3">
                {selectedOrder.items?.map((item, index) => (
                  <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900\">{item.name}</p>
                      <p className="text-sm text-gray-500\">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium text-gray-900\">${(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="border-t border-gray-200 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600\">Subtotal</span>
                  <span className="font-medium text-gray-900\">${selectedOrder.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600\">Shipping</span>
                  <span className="font-medium text-gray-900\">${selectedOrder.shipping?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600\">Tax</span>
                  <span className="font-medium text-gray-900\">${selectedOrder.tax?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t border-gray-200">
                  <span className="text-gray-900\">Total</span>
                  <span className="text-gray-900\">${selectedOrder.total?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {selectedOrder.status === 'pending' && (
                <>
                  <Button 
                    onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'processing')}
                    className="flex-1"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Process Order
                  </Button>
                  <Button 
                    variant="danger"
                    onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'cancelled')}
                    className="flex-1"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              )}
              {selectedOrder.status === 'processing' && (
                <Button 
                  onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'shipped')}
                  className="flex-1"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Mark as Shipped
                </Button>
              )}
              {selectedOrder.status === 'shipped' && (
                <Button 
                  onClick={() => handleUpdateOrderStatus(selectedOrder._id, 'delivered')}
                  className="flex-1"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark as Delivered
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default StoreManager
