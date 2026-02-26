import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save } from 'lucide-react'
import { settingsAPI } from '../../services/api'
import toast from 'react-hot-toast'

const Settings = () => {
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetchSettings() }, [])

  const fetchSettings = async () => {
    try {
      setLoading(true)
      const response = await settingsAPI.get()
      setSettings(response.data || {})
    } catch (error) { toast.error('Failed to fetch settings') } 
    finally { setLoading(false) }
  }

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await settingsAPI.update(settings)
      toast.success('Settings saved')
    } catch (error) { toast.error('Failed to save') } 
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-2xl font-bold text-gray-800">Settings</h1><p className="text-gray-500">Manage application settings</p></div>
        <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
          <Save size={18} />{saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        {loading ? <div className="p-8 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div> : (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">General Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label><input type="text" value={settings.siteName || ''} onChange={(e) => handleChange('siteName', e.target.value)} className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Support Email</label><input type="email" value={settings.supportEmail || ''} onChange={(e) => handleChange('supportEmail', e.target.value)} className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Currency</label><input type="text" value={settings.currency || ''} onChange={(e) => handleChange('currency', e.target.value)} className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label><input type="text" value={settings.timezone || ''} onChange={(e) => handleChange('timezone', e.target.value)} className="input" /></div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Social Links</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Facebook</label><input type="url" value={settings.facebook || ''} onChange={(e) => handleChange('facebook', e.target.value)} className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Twitter</label><input type="url" value={settings.twitter || ''} onChange={(e) => handleChange('twitter', e.target.value)} className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">Instagram</label><input type="url" value={settings.instagram || ''} onChange={(e) => handleChange('instagram', e.target.value)} className="input" /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-2">YouTube</label><input type="url" value={settings.youtube || ''} onChange={(e) => handleChange('youtube', e.target.value)} className="input" /></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Settings
