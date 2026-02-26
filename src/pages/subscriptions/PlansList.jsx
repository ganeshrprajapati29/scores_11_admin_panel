import { useState, useEffect } from 'react'
import { Plus, CreditCard } from 'lucide-react'
import { subscriptionsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const PlansList = () => {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchPlans() }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      const response = await subscriptionsAPI.getPlans({ limit: 50 })
      // Handle different response formats
      const plansData = response?.data || response || []
      setPlans(Array.isArray(plansData) ? plansData : [])
    } catch (error) { 
      console.error('Failed to fetch plans:', error)
      toast.error('Failed to fetch plans') 
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-gray-800">Subscription Plans</h1><p className="text-gray-500">Manage plans</p></div>
        <button className="btn-primary"><Plus size={18} className="mr-2" />Create Plan</button>
      </div>
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : plans.length === 0 ? <div className="p-8 text-center"><CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" /><p className="text-gray-500">No plans found</p></div> : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            {plans.map((plan) => (
              <div key={plan._id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium text-gray-800">{plan.name}</h3>
                <p className="text-primary-600 font-bold text-2xl">${plan.price}<span className="text-sm text-gray-500">/month</span></p>
                <p className="text-sm text-gray-500 mt-2">{plan.features?.join(', ')}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default PlansList
