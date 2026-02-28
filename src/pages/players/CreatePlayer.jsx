import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { playersAPI } from '../../services/api'
import toast from 'react-hot-toast'

const CreatePlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(!!id)

  // ✅ EXACT backend schema
  const [formData, setFormData] = useState({
    playerName: '',
    jerseyNumber: '',
    role: 'batsman',
    battingStyle: 'right-hand bat',
    bowlingStyle: 'none',
    team: '',
    isActive: true
  })

  // ================= FETCH PLAYER (EDIT MODE) =================
  useEffect(() => {
    if (!id) return

    const fetchPlayer = async () => {
      try {
        setInitialLoading(true)

        const res = await playersAPI.getById(id)
        const data = res?.data?.data ?? res?.data ?? {}

        setFormData({
          playerName: data.playerName || '',
          jerseyNumber: data.jerseyNumber || '',
          role: data.role || 'batsman',
          battingStyle: data.battingStyle || 'right-hand bat',
          bowlingStyle: data.bowlingStyle || 'none',
          team: data.team?._id || data.team || '',
          isActive: data.isActive ?? true
        })
      } catch {
        toast.error('Failed to load player')
      } finally {
        setInitialLoading(false)
      }
    }

    fetchPlayer()
  }, [id])

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.playerName.trim()) {
      toast.error('Player name is required')
      return
    }

    const payload = {
      playerName: formData.playerName.trim(),
      role: formData.role,
      battingStyle: formData.battingStyle,
      bowlingStyle: formData.bowlingStyle,
      isActive: formData.isActive,
      ...(formData.jerseyNumber && { jerseyNumber: Number(formData.jerseyNumber) }),
      ...(formData.team && { team: formData.team })
    }

    try {
      setLoading(true)

      if (id) {
        await playersAPI.update(id, payload)
        toast.success('Player updated successfully')
      } else {
        await playersAPI.create(payload)
        toast.success('Player created successfully')
      }

      navigate('/players')
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Validation error')
    } finally {
      setLoading(false)
    }
  }

  // ================= LOADER =================
  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  // ================= UI =================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/players')}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-2xl font-bold">
          {id ? 'Edit Player' : 'Create Player'}
        </h1>
      </div>

      {/* FORM */}
      <div className="bg-white p-6 rounded-xl shadow border">
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <input
            className="input w-full"
            placeholder="Player Name *"
            value={formData.playerName}
            onChange={(e) =>
              setFormData({ ...formData, playerName: e.target.value })
            }
            required
          />

          <input
            type="number"
            className="input w-full"
            placeholder="Jersey Number"
            value={formData.jerseyNumber}
            onChange={(e) =>
              setFormData({ ...formData, jerseyNumber: e.target.value })
            }
          />

          <select
            className="input w-full"
            value={formData.role}
            onChange={(e) =>
              setFormData({ ...formData, role: e.target.value })
            }
          >
            <option value="batsman">Batsman</option>
            <option value="bowler">Bowler</option>
            <option value="all-rounder">All Rounder</option>
            <option value="wicket-keeper">Wicket Keeper</option>
          </select>

          {/* ✅ EXACT ENUM */}
          <select
            className="input w-full"
            value={formData.battingStyle}
            onChange={(e) =>
              setFormData({ ...formData, battingStyle: e.target.value })
            }
          >
            <option value="right-hand bat">Right Hand Bat</option>
            <option value="left-hand bat">Left Hand Bat</option>
          </select>

          {/* ✅ EXACT ENUM */}
          <select
            className="input w-full"
            value={formData.bowlingStyle}
            onChange={(e) =>
              setFormData({ ...formData, bowlingStyle: e.target.value })
            }
          >
            <option value="none">None</option>
            <option value="right-arm fast">Right Arm Fast</option>
            <option value="right-arm medium">Right Arm Medium</option>
            <option value="left-arm fast">Left Arm Fast</option>
            <option value="left-arm medium">Left Arm Medium</option>
            <option value="off-spin">Off Spin</option>
            <option value="leg-spin">Leg Spin</option>
          </select>

          <input
            className="input w-full"
            placeholder="Team ObjectId (optional)"
            value={formData.team}
            onChange={(e) =>
              setFormData({ ...formData, team: e.target.value })
            }
          />

          <select
            className="input w-full"
            value={formData.isActive ? 'true' : 'false'}
            onChange={(e) =>
              setFormData({
                ...formData,
                isActive: e.target.value === 'true'
              })
            }
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>

          <div className="col-span-full flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/players')}
              className="btn-secondary"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center gap-2"
            >
              <Save size={18} />
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePlayer