import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { User, Mail, Phone, Lock, ArrowLeft } from "lucide-react"
import toast from "react-hot-toast"
import { authAPI } from "../../services/api"

const CreateProfile = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  // ✅ BACKEND-COMPATIBLE STATE
  const [formData, setFormData] = useState({
    name: "",            // 🔥 FIXED (fullName ❌ → name ✅)
    email: "",
    password: "",
    phone: "",
    gender: "",
    dateOfBirth: "",
    role: "player"
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    console.log("SUBMIT DATA 👉", formData)

    try {
      setLoading(true)

      const res = await authAPI.register({
        ...formData,
        phone: formData.phone ? String(formData.phone) : ""
      })

      console.log("SUCCESS 👉", res.data)

      toast.success("Registration successful")

      // optional: token save
      if (res.data?.data?.accessToken) {
        localStorage.setItem("accessToken", res.data.data.accessToken)
      }

      navigate("/profiles")

    } catch (error) {
      console.log("FULL ERROR 👉", error)

      toast.error(
        error.response?.data?.message ||
        "Registration failed"
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/profiles" className="p-2 hover:bg-gray-100 rounded-lg">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Create Player Profile
          </h1>
          <p className="text-gray-500">
            Register a new player
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <form onSubmit={handleSubmit} className="space-y-6">

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  name="name"                  // ✅ FIXED
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                  placeholder="Enter full name"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Phone
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg"
                />
              </div>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Role
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg"
              >
                <option value="player">Player</option>
                <option value="admin">Admin</option>
              </select>
            </div>

          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4">
            <Link to="/profiles" className="px-6 py-2 border rounded-lg">
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg"
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default CreateProfile