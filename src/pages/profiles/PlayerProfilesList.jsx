import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Search, Plus, User, Mail, Phone, Trophy,
  Trash2, Edit, Eye, RefreshCw
} from "lucide-react"

import { playerProfilesAPI } from "../../services/api"
import toast from "react-hot-toast"

const PlayerProfilesList = () => {

  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 1
  })

  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchProfiles()
  }, [pagination.page, statusFilter])

 const fetchProfiles = async () => {

  try {

    setLoading(true)

    const params = {
      page: pagination.page,
      limit: pagination.limit,
      ...(search && { search }),
      ...(statusFilter && { status: statusFilter })
    }

    const response = await playerProfilesAPI.getAll(params)

    console.log("API response:", response)

    // Correct extraction
    const profilesData = response?.data?.data ?? []

    setProfiles(profilesData)

    setPagination(prev => ({
      ...prev,
      total: profilesData.length,
      totalPages: Math.ceil(profilesData.length / prev.limit) || 1
    }))

  } catch (error) {

    console.error("Fetch Profiles Error:", error)

    toast.error("Failed to fetch player profiles")

  } finally {

    setLoading(false)

  }

}

  const handleSearch = (e) => {

    e.preventDefault()

    setPagination(prev => ({
      ...prev,
      page: 1
    }))

    fetchProfiles()

  }

  const handleDelete = async (id) => {

    if (!window.confirm("Delete this profile?"))
      return

    try {

      await playerProfilesAPI.delete(id)

      toast.success("Profile deleted successfully")

      setProfiles(prev =>
        prev.filter(p => p._id !== id)
      )

    } catch (error) {

      console.error(error)

      toast.error("Delete failed")

    }

  }

  return (
    <div className="space-y-6">

      {/* Header */}

      <div className="flex justify-between items-center">

        <div>
          <h1 className="text-2xl font-bold">
            Player Profiles
          </h1>
          <p className="text-gray-500">
            Manage all player profiles
          </p>
        </div>

        <Link
          to="/profiles/create"
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={18}/>
          Add Profile
        </Link>

      </div>

      {/* Stats */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-white p-5 rounded-xl border">

          <div className="flex items-center gap-3">

            <User className="text-blue-600"/>

            <div>
              <p className="text-sm text-gray-500">
                Total Profiles
              </p>
              <p className="text-xl font-bold">
                {pagination.total}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white p-5 rounded-xl border">

          <div className="flex items-center gap-3">

            <Trophy className="text-green-600"/>

            <div>
              <p className="text-sm text-gray-500">
                Active Profiles
              </p>
              <p className="text-xl font-bold">
                {profiles?.filter(p => p?.isActive).length}
              </p>
            </div>

          </div>

        </div>

      </div>

      {/* Search */}

      <div className="bg-white p-4 rounded-xl border">

        <form
          onSubmit={handleSearch}
          className="flex gap-3"
        >

          <input
            type="text"
            placeholder="Search profiles"
            value={search}
            onChange={(e)=>setSearch(e.target.value)}
            className="input flex-1"
          />

          <select
            value={statusFilter}
            onChange={(e)=>setStatusFilter(e.target.value)}
            className="input"
          >
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <button className="btn-primary">
            <Search size={16}/>
          </button>

          <button
            type="button"
            onClick={fetchProfiles}
            className="btn-secondary flex gap-2 items-center"
          >
            <RefreshCw size={16}/>
            Refresh
          </button>

        </form>

      </div>

      {/* Table */}

      <div className="bg-white rounded-xl border overflow-x-auto">

  {loading ? (

    <div className="p-10 text-center">
      Loading profiles...
    </div>

  ) : !profiles || profiles.length === 0 ? (

    <div className="p-10 text-center text-gray-500">
      No profiles found
    </div>

  ) : (

    <table className="w-full">

      <thead className="bg-gray-50">
        <tr>
          <th className="p-4 text-left">Profile</th>
          <th className="p-4 text-left">Contact</th>
          <th className="p-4 text-left">Player</th>
          <th className="p-4 text-left">Actions</th>
        </tr>
      </thead>

      <tbody>

        {profiles?.map((profile) => (

          <tr key={profile?._id} className="border-t">

            <td className="p-4 flex items-center gap-3">

              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center">
                {profile?.name?.charAt(0) || "P"}
              </div>

              {profile?.name || "No Name"}

            </td>

            <td className="p-4">

              <div className="flex items-center gap-2">
                <Mail size={14}/>
                {profile?.email || "N/A"}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={14}/>
                {profile?.phone || "N/A"}
              </div>

            </td>

            <td className="p-4">
              {profile?.player?.name || "Not Assigned"}
            </td>

            <td className="p-4 flex gap-2">

              <Link to={`/profiles/${profile?._id}`}>
                <Eye size={18}/>
              </Link>

              <Link to={`/profiles/${profile?._id}/edit`}>
                <Edit size={18}/>
              </Link>

              <button onClick={() => handleDelete(profile?._id)}>
                <Trash2 size={18}/>
              </button>

            </td>

          </tr>

        ))}

      </tbody>

    </table>

  )}

</div>

    </div>
  )

}

export default PlayerProfilesList