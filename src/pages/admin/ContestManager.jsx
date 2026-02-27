import { useState, useEffect } from 'react'
import { 
  Trophy, Users, DollarSign, Calendar, Clock, 
  CheckCircle, XCircle, AlertTriangle, TrendingUp,
  Filter, Search, Plus, Eye, Edit2, Trash2, Play, Pause
} from 'lucide-react'
import { Button } from '../../components/common/Button'
import { Input } from '../../components/common/Input'
import { Modal } from '../../components/common/Modal'
import { Table } from '../../components/common/Table'
import { ConfirmDialog } from '../../components/common/ConfirmDialog'
import { Loader } from '../../components/common/Loader'
import { LineChart } from '../../components/charts/LineChart'
import { BarChart } from '../../components/charts/BarChart'
import { adminService } from '../../services/admin.service'
import { toast } from 'react-hot-toast'
import { formatDate } from '../../utils/formatDate'

const ContestManager = () => {
  const [activeTab, setActiveTab] = useState('contests')
  const [loading, setLoading] = useState(true)
  const [contests, setContests] = useState([])
  const [prizePools, setPrizePools] = useState([])
  const [stats, setStats] = useState({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedContest, setSelectedContest] = useState(null)
  const [filterStatus, setFilterStatus] = useState('all')

  const [contestForm, setContestForm] = useState({
    name: '',
    match: '',
    entryFee: '',
    prizePool: '',
    maxEntries: '',
    startTime: '',
    endTime: '',
    rules: '',
    isGuaranteed: false,
    isMultiEntry: false
  })

  useEffect(() => {
    fetchData()
  }, [activeTab])

  const fetchData = async () => {
    try {
      setLoading(true)
      if (activeTab === 'contests') {
        const response = await adminService.getContests({ status: filterStatus })
        setContests(response.data?.contests || [])
      } else if (activeTab === 'prize-pools') {
        const response = await adminService.getPrizePools()
        setPrizePools(response.data || [])
      } else if (activeTab === 'stats') {
        const response = await adminService.getContestStats()
        setStats(response.data || {})
      }
    } catch (error) {
      toast.error('Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveContest = async () => {
    try {
      if (selectedContest) {
        await adminService.updateContest(selectedContest._id, contestForm)
        toast.success('Contest updated')
      } else {
        await adminService.createContest(contestForm)
        toast.success('Contest created')
      }
      setIsModalOpen(false)
      setSelectedContest(null)
      resetForm()
      fetchData()
    } catch (error) {
      toast.error('Failed to save contest')
    }
  }

  const handleDeleteContest = async () => {
    try {
      await adminService.deleteContest(selectedContest._id)
      toast.success('Contest deleted')
      setIsDeleteDialogOpen(false)
      setSelectedContest(null)
      fetchData()
    } catch (error) {
      toast.error('Failed to delete contest')
    }
  }

  const handleUpdateStatus = async (contestId, status) => {
    try {
      await adminService.updateContestStatus(contestId, { status })
      toast.success(`Contest ${status}`)
      fetchData()
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  const resetForm = () => {
    setContestForm({
      name: '',
      match: '',
      entryFee: '',
      prizePool: '',
      maxEntries: '',
      startTime: '',
      endTime: '',
      rules: '',
      isGuaranteed: false,
      isMultiEntry: false
    })
  }

  const openEditModal = (contest) => {
    setSelectedContest(contest)
    setContestForm({
      name: contest.name,
      match: contest.match?._id || '',
      entryFee: contest.entryFee,
      prizePool: contest.prizePool,
      maxEntries: contest.maxEntries,
      startTime: contest.startTime ? new Date(contest.startTime).toISOString().slice(0, 16) : '',
      endTime: contest.endTime ? new Date(contest.endTime).toISOString().slice(0, 16) : '',
      rules: contest.rules || '',
      isGuaranteed: contest.isGuaranteed,
      isMultiEntry: contest.isMultiEntry
    })
    setIsModalOpen(true)
  }

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-blue-100 text-blue-700',
      live: 'bg-green-100 text-green-700',
      completed: 'bg-gray-100 text-gray-700',
      cancelled: 'bg-red-100 text-red-700'
    }
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || styles.upcoming}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const contestColumns = [
    { key: 'name', title: 'Contest', render: (c) => (
      <div>
        <p className="font-medium text-gray-900">{c.name}</p>
        <p className="text-sm text-gray-500">{c.match?.name || 'No match'}</p>
      </div>
    )},
    { key: 'entryFee', title: 'Entry Fee', render: (c) => (
      <span className="font-medium text-gray-900">${c.entryFee}</span>
    )},
    { key: 'prizePool', title: 'Prize Pool', render: (c) => (
      <span className="font-medium text-green-600">${c.prizePool?.toLocaleString()}</span>
    )},
    { key: 'entries', title: 'Entries', render: (c) => (
      <div className="text-sm">
        <span className="font-medium">{c.currentEntries || 0}</span>
        <span className="text-gray-500"> / {c.maxEntries}</span>
        <div className="w-20 h-1.5 bg-gray-200 rounded-full mt-1">
          <div 
            className="h-full bg-primary-500 rounded-full" 
            style={{ width: `${Math.min((c.currentEntries / c.maxEntries) * 100, 100)}%` }}
          />
        </div>
      </div>
    )},
    { key: 'status', title: 'Status', render: (c) => getStatusBadge(c.status) },
    { key: 'startTime', title: 'Start', render: (c) => (
      <span className="text-sm text-gray-600">{formatDate(c.startTime, 'MMM DD, HH:mm')}</span>
    )},
    { key: 'actions', title: 'Actions', render: (c) => (
      <div className="flex items-center gap-1">
        <button
          onClick={() => openEditModal(c)}
          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
        >
          <Edit2 className="w-4 h-4" />
        </button>
        {c.status === 'upcoming' && (
          <button
            onClick={() => handleUpdateStatus(c._id, 'live')}
            className="p-2 text-green-600 hover:bg-green-50 rounded-lg"
            title="Start Contest"
          >
            <Play className="w-4 h-4" />
          </button>
        )}
        {c.status === 'live' && (
          <button
            onClick={() => handleUpdateStatus(c._id, 'completed')}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
            title="End Contest"
          >
            <Pause className="w-4 h-4" />
          </button>
        )}
        <button
          onClick={() => {
            setSelectedContest(c)
            setIsDeleteDialogOpen(true)
          }}
          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    )},
  ]

  if (loading) return <Loader />

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contest Manager</h1>
          <p className="text-gray-600 mt-1">Create and manage fantasy contests</p>
        </div>
        <Button onClick={() => {
          setSelectedContest(null)
          resetForm()
          setIsModalOpen(true)
        }} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Create Contest
        </Button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {[
            { id: 'contests', label: 'Contests', icon: Trophy },
            { id: 'prize-pools', label: 'Prize Pools', icon: DollarSign },
            { id: 'stats', label: 'Statistics', icon: TrendingUp },
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

      {/* Contests Tab */}
      {activeTab === 'contests' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input type="text" placeholder="Search contests..." className="pl-10" />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg"
            >
              <option value="all">All Status</option>
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <Table
            columns={contestColumns}
            data={contests}
            emptyMessage="No contests found"
          />
        </div>
      )}

      {/* Prize Pools Tab */}
      {activeTab === 'prize-pools' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {prizePools.map((pool) => (
              <div key={pool._id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">{pool.name}</h3>
                  <span className="px-2 py-1 bg-primary-100 text-primary-700 rounded-full text-xs">
                    {pool.contestCount} contests
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Prize</span>
                    <span className="font-medium text-gray-900">${pool.totalPrize?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Winner %</span>
                    <span className="font-medium text-gray-900">{pool.winnerPercentage}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">1st Prize</span>
                    <span className="font-medium text-green-600">${pool.firstPrize?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Stats Tab */}
      {activeTab === 'stats' && (
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { title: 'Total Contests', value: stats.totalContests || 0, icon: Trophy },
              { title: 'Live Contests', value: stats.liveContests || 0, icon: Clock },
              { title: 'Total Entries', value: stats.totalEntries || 0, icon: Users },
              { title: 'Total Prize Distributed', value: `$${stats.totalPrizeDistributed?.toLocaleString() || 0}`, icon: DollarSign },
            ].map((stat, index) => (
              <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
                <stat.icon className="w-8 h-8 text-primary-500 mb-2" />
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.title}</p>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Contest Participation</h3>
              <div className="h-64">
                <LineChart
                  data={stats.participationTrend || []}
                  xKey="date"
                  yKey="entries"
                  color="#8B5CF6"
                />
              </div>
            </div>
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Entry Fee Distribution</h3>
              <div className="h-64">
                <BarChart
                  data={stats.entryFeeDistribution || []}
                  xKey="fee"
                  yKey="count"
                  color="#10B981"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedContest(null)
          resetForm()
        }}
        title={selectedContest ? 'Edit Contest' : 'Create Contest'}
        size="lg"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contest Name *</label>
              <Input
                type="text"
                value={contestForm.name}
                onChange={(e) => setContestForm({ ...contestForm, name: e.target.value })}
                placeholder="e.g., Mega Contest"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Match *</label>
              <select
                value={contestForm.match}
                onChange={(e) => setContestForm({ ...contestForm, match: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                required
              >
                <option value="">Select a match...</option>
                <option value="match1">India vs Australia</option>
                <option value="match2">England vs Pakistan</option>
                <option value="match3">New Zealand vs South Africa</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee ($) *</label>
              <Input
                type="number"
                value={contestForm.entryFee}
                onChange={(e) => setContestForm({ ...contestForm, entryFee: e.target.value })}
                placeholder="49"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prize Pool ($) *</label>
              <Input
                type="number"
                value={contestForm.prizePool}
                onChange={(e) => setContestForm({ ...contestForm, prizePool: e.target.value })}
                placeholder="10000"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Max Entries *</label>
              <Input
                type="number"
                value={contestForm.maxEntries}
                onChange={(e) => setContestForm({ ...contestForm, maxEntries: e.target.value })}
                placeholder="1000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Time *</label>
              <Input
                type="datetime-local"
                value={contestForm.startTime}
                onChange={(e) => setContestForm({ ...contestForm, startTime: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Time *</label>
              <Input
                type="datetime-local"
                value={contestForm.endTime}
                onChange={(e) => setContestForm({ ...contestForm, endTime: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Rules & Description</label>
            <textarea
              value={contestForm.rules}
              onChange={(e) => setContestForm({ ...contestForm, rules: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
              rows={3}
              placeholder="Contest rules and description..."
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={contestForm.isGuaranteed}
                onChange={(e) => setContestForm({ ...contestForm, isGuaranteed: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm text-gray-700">Guaranteed Prize Pool</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={contestForm.isMultiEntry}
                onChange={(e) => setContestForm({ ...contestForm, isMultiEntry: e.target.checked })}
                className="w-4 h-4 text-primary-600 rounded"
              />
              <span className="text-sm text-gray-700">Allow Multiple Entries</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => {
              setIsModalOpen(false)
              setSelectedContest(null)
              resetForm()
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveContest} disabled={!contestForm.name || !contestForm.match}>
              {selectedContest ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setSelectedContest(null)
        }}
        onConfirm={handleDeleteContest}
        title="Delete Contest"
        message="Are you sure you want to delete this contest? All entries and data will be lost."
        confirmText="Delete"
        type="danger"
      />
    </div>
  )
}

export default ContestManager
