
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff } from 'lucide-react'
import { useAuthStore } from '../../store/authStore'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading: isLoading } = useAuthStore()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  // 🔐 CAPTCHA STATES
  const [captcha, setCaptcha] = useState('')
  const [captchaInput, setCaptchaInput] = useState('')

  useEffect(() => {
    generateCaptcha()
  }, [])

  const generateCaptcha = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = ''
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setCaptcha(result)
    setCaptchaInput('')
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields')
      return
    }

    // 🔐 CAPTCHA CHECK
    if (captchaInput.toUpperCase() !== captcha) {
      setError('Captcha does not match')
      generateCaptcha()
      return
    }

    const result = await login(formData)

    if (result?.success) {
      navigate('/dashboard')
    } else {
      setError(result?.message || 'Login failed. Please check your credentials.')
      generateCaptcha()
    }
  }

  return (
    <div className="min-h-screen flex bg-white overflow-hidden">

      {/* ================= LEFT SECTION ================= */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute -left-40 top-0 w-[120%] h-full bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-br-[60%]" />
        </div>

        <div className="relative z-10 text-white max-w-lg px-10 text-center">
          <img
            src="https://i.ibb.co/Kz8Pzcjy/Whats-App-Image-2026-02-26-at-17-15-02-removebg-preview.png"
            alt="Score-11 Logo"
            className="w-32 h-32 mx-auto mb-6 object-contain rounded-full bg-white/90 p-4 shadow-2xl"
          />

          <h1 className="text-4xl font-bold mb-4">
            Score-11 Admin Panel
          </h1>

          <p className="text-white/90 text-lg">
            Securely manage users, live matches, wallets and platform activity.
          </p>
        </div>
      </div>

      {/* ================= RIGHT LOGIN SECTION ================= */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6">
        <div className="w-full max-w-md">

          <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
            WELCOME
          </h2>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm text-gray-500 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b-2 border-emerald-400 py-2 outline-none"
              />
            </div>

            {/* Password */}
            <div className="mb-5 relative">
              <label className="block text-sm text-gray-500 mb-1">Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full border-b-2 border-gray-300 py-2 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-8 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* 🔐 WORD + NUMBER CAPTCHA */}
            <div className="mb-8">
              <label className="block text-sm text-gray-500 mb-1">
                Enter Captcha
              </label>

              <div className="flex items-center gap-3">
                <div className="px-4 py-2 bg-gray-100 rounded-lg font-mono tracking-widest text-lg select-none">
                  {captcha}
                </div>

                <button
                  type="button"
                  onClick={generateCaptcha}
                  className="text-sm text-emerald-600 hover:underline"
                >
                  Refresh
                </button>
              </div>

              <input
                type="text"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Type captcha"
                className="mt-2 w-full border-b-2 border-gray-300 py-2 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-semibold text-lg shadow-lg hover:opacity-90 transition"
            >
              {isLoading ? 'Logging in...' : 'LOGIN'}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default Login