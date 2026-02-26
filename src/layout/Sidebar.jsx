import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Users, Users2, Calendar, Trophy,
  MessageSquare, ShoppingCart, Building2, Award,
  CreditCard, Settings, FileText, DollarSign,
  BarChart3, Flag, X
} from 'lucide-react'
import { clsx } from 'clsx'

const menuItems = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { name: 'Users', icon: Users, path: '/users' },
  { name: 'Teams', icon: Users2, path: '/teams' }, // ✅ FIXED
  { name: 'Matches', icon: Calendar, path: '/matches' },
  { name: 'Tournaments', icon: Trophy, path: '/tournaments' },
  { name: 'Blogs', icon: FileText, path: '/blogs' },
  { name: 'News', icon: MessageSquare, path: '/news' },
  { name: 'Community', icon: Users, path: '/community/posts' },
  { name: 'Store', icon: ShoppingCart, path: '/store/products' },
  { name: 'Clubs', icon: Building2, path: '/clubs' },
  { name: 'Associations', icon: Flag, path: '/associations' },
  { name: 'Awards', icon: Award, path: '/awards' },
  { name: 'Subscriptions', icon: CreditCard, path: '/subscriptions/plans' },
  { name: 'Wallet', icon: DollarSign, path: '/wallet' },
  { name: 'Reports', icon: BarChart3, path: '/reports' },
  { name: 'Settings', icon: Settings, path: '/settings' },
]

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  return (
    <div className="h-full bg-white border-r border-gray-200 flex flex-col">
      
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Crick11
          </span>
        </div>

        {isMobile && (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X size={20} className="text-gray-500" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-100'
                  )
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Users size={18} className="text-primary-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@crick11.com</p>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Sidebar