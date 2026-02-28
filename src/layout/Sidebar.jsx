import { NavLink, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard, Users, Users2, Calendar, Trophy,
  MessageSquare, ShoppingCart, Building2, Award,
  CreditCard, Settings, FileText, DollarSign,
  BarChart3, Flag, X, ChevronDown, ChevronRight,
  Shield, Lock, Database, Mail, Activity, Globe,
  Bell, ClipboardList, Wallet, TrendingUp,
  UserCheck, Code, FileBarChart, Smartphone, Store, Target,
  Zap, Crown, Gamepad2, PieChart, LineChart, Settings2,
  ChevronLeft, ChevronRightIcon, LogOut, UserCircle
} from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs) {
  return twMerge(clsx(inputs))
}


// Menu Groups with Dropdown Support
const menuGroups = [
  {
    id: 'dashboard',
    name: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    type: 'single',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'users',
    name: 'User Management',
    icon: Users,
    type: 'dropdown',
    color: 'from-emerald-500 to-emerald-600',
    items: [
      { name: 'All Users', path: '/users', icon: Users, description: 'Manage all users' },
      { name: 'Players', path: '/players', icon: Users2, description: 'Player profiles' },
      { name: 'Player Profiles', path: '/profiles', icon: UserCircle, description: 'Player profiles list' },
      { name: 'Verifications', path: '/admin/verifications', icon: UserCheck, description: 'KYC & verification' },
      { name: 'Roles & Permissions', path: '/admin/roles', icon: Lock, description: 'Access control' },
    ]
  },
  {
    id: 'cricket',
    name: 'Cricket Operations',
    icon: Trophy,
    type: 'dropdown',
    color: 'from-amber-500 to-amber-600',
    items: [
      { name: 'Teams', path: '/teams', icon: Users2, description: 'Team management' },
      { name: 'Matches', path: '/matches', icon: Calendar, description: 'Match scheduling' },
      { name: 'Tournaments', path: '/tournaments', icon: Trophy, description: 'Tournament setup' },
      { name: 'Contests', path: '/contests', icon: Target, description: 'Fantasy contests' },
      { name: 'Live Scoring', path: '/matches/live', icon: Activity, description: 'Real-time scoring' },
    ]
  },
  {
    id: 'commerce',
    name: 'Commerce & Finance',
    icon: ShoppingCart,
    type: 'dropdown',
    color: 'from-purple-500 to-purple-600',
    items: [
      { name: 'Store Products', path: '/store/products', icon: Store, description: 'Product catalog' },
      { name: 'Orders', path: '/store/orders', icon: ClipboardList, description: 'Order management' },
      { name: 'Wallet', path: '/wallet', icon: Wallet, description: 'User wallets' },
      { name: 'Subscriptions', path: '/subscriptions/plans', icon: CreditCard, description: 'Plans & billing' },
      { name: 'Financial Overview', path: '/admin/finance', icon: DollarSign, description: 'Revenue & reports' },
    ]
  },
  {
    id: 'content',
    name: 'Content Management',
    icon: FileText,
    type: 'dropdown',
    color: 'from-pink-500 to-pink-600',
    items: [
      { name: 'Blogs', path: '/blogs', icon: FileText, description: 'Blog posts' },
      { name: 'News', path: '/news', icon: MessageSquare, description: 'News articles' },
      { name: 'Community', path: '/community/posts', icon: MessageSquare, description: 'User posts' },
      { name: 'Moderation', path: '/admin/moderation', icon: Shield, description: 'Content review' },
    ]
  },
  {
    id: 'organizations',
    name: 'Organizations',
    icon: Building2,
    type: 'dropdown',
    color: 'from-cyan-500 to-cyan-600',
    items: [
      { name: 'Clubs', path: '/clubs', icon: Building2, description: 'Cricket clubs' },
      { name: 'Associations', path: '/associations', icon: Flag, description: 'Cricket boards' },
      { name: 'Awards', path: '/awards', icon: Award, description: 'Awards & recognition' },
    ]
  },
  {
    id: 'analytics',
    name: 'Analytics & Reports',
    icon: BarChart3,
    type: 'dropdown',
    color: 'from-indigo-500 to-indigo-600',
    items: [
      { name: 'Leaderboard', path: '/leaderboard', icon: Trophy, description: 'Rankings' },
      { name: 'Performance', path: '/performance', icon: TrendingUp, description: 'Player stats' },
      { name: 'Reports', path: '/reports', icon: FileBarChart, description: 'System reports' },
      { name: 'Advanced Analytics', path: '/admin/analytics', icon: PieChart, description: 'Deep insights' },
    ]
  },
  {
    id: 'core-admin',
    name: 'Core Admin',
    icon: Crown,
    type: 'dropdown',
    color: 'from-rose-500 to-rose-600',
    badge: 'PRO',
    items: [
      { name: 'Mobile App Manager', path: '/admin/mobile-app', icon: Smartphone, description: 'App configuration' },
      { name: 'Store Manager', path: '/admin/store-manager', icon: Store, description: 'E-commerce control' },
      { name: 'Contest Manager', path: '/admin/contest-manager', icon: Gamepad2, description: 'Contest engine' },
    ]
  },
  {
    id: 'system',
    name: 'System & Settings',
    icon: Settings2,
    type: 'dropdown',
    color: 'from-slate-500 to-slate-600',
    items: [
      { name: 'Notifications', path: '/notifications', icon: Bell, description: 'Push & email' },
      { name: 'System Logs', path: '/admin/logs', icon: Database, description: 'Audit trails' },
      { name: 'Email Templates', path: '/admin/email-templates', icon: Mail, description: 'Template editor' },
      { name: 'API Management', path: '/admin/api', icon: Code, description: 'API keys & webhooks' },
      { name: 'Backups', path: '/admin/backups', icon: Database, description: 'Data backup' },
      { name: 'Settings', path: '/settings', icon: Settings, description: 'System config' },
    ]
  },
]

const Sidebar = ({ isOpen, onClose, isMobile }) => {
  const location = useLocation()
  const [openGroups, setOpenGroups] = useState(['core-admin'])
  const [isCollapsed, setIsCollapsed] = useState(false)

  // Auto-expand group based on current route
  useEffect(() => {
    const currentPath = location.pathname
    menuGroups.forEach(group => {
      if (group.type === 'dropdown') {
        const isActive = group.items.some(item => 
          currentPath === item.path || currentPath.startsWith(item.path + '/')
        )
        if (isActive && !openGroups.includes(group.name)) {
          setOpenGroups(prev => [...prev, group.name])
        }
      }
    })
  }, [location.pathname])

  const toggleGroup = (groupName) => {
    setOpenGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(g => g !== groupName)
        : [...prev, groupName]
    )
  }

  const isActiveRoute = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className={cn(
      "h-full bg-white flex flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-72",
      "border-r border-gray-200/80 shadow-xl shadow-gray-100/50"
    )}>
      
      {/* Logo Section */}
      <div className="flex items-center justify-between h-20 px-5 border-b border-gray-100 bg-gradient-to-r from-white to-gray-50/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 flex-shrink-0">
            <Trophy className="w-5 h-5 text-white" />
          </div>
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-700 to-purple-700 bg-clip-text text-transparent tracking-tight">
                Crick11
              </span>
              <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Admin Panel</span>
            </div>
          )}
        </div>

        {isMobile ? (
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        ) : (
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors hidden lg:flex"
          >
            {isCollapsed ? <ChevronRightIcon size={16} className="text-gray-400" /> : <ChevronLeft size={16} className="text-gray-400" />}
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
        <ul className="space-y-1.5">
          {menuGroups.map((group) => (
            <li key={group.id} className="group">
              {group.type === 'single' ? (
                // Single Item
                <NavLink
                  to={group.path}
                  onClick={() => isMobile && onClose()}
                  className={cn(
                    "flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                    isActiveRoute(group.path)
                      ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 shadow-sm shadow-indigo-100"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <div className={cn(
                    "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                    isActiveRoute(group.path)
                      ? "bg-gradient-to-br " + group.color + " text-white shadow-md"
                      : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm"
                  )}>
                    <group.icon size={18} />
                  </div>
                  {!isCollapsed && (
                    <span className="font-semibold text-sm">Dashboard</span>
                  )}
                </NavLink>
              ) : (
                // Dropdown Group
                <>
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200",
                      openGroups.includes(group.name)
                        ? "bg-gray-50 text-gray-900"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all",
                        openGroups.includes(group.name)
                          ? "bg-gradient-to-br " + group.color + " text-white shadow-md"
                          : "bg-gray-100 text-gray-500 group-hover:bg-white group-hover:shadow-sm"
                      )}>
                        <group.icon size={18} />
                      </div>
                      {!isCollapsed && (
                        <div className="flex flex-col items-start">
                          <span className="font-semibold text-sm">{group.name}</span>
                          {group.badge && (
                            <span className="text-[9px] font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 px-1.5 py-0.5 rounded">
                              {group.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    {!isCollapsed && (
                      <ChevronDown 
                        size={16} 
                        className={cn(
                          "text-gray-400 transition-transform duration-200",
                          openGroups.includes(group.name) ? "rotate-180" : ""
                        )} 
                      />
                    )}
                  </button>
                  
                  {/* Dropdown Items */}
                  {!isCollapsed && openGroups.includes(group.name) && (
                    <ul className="mt-1.5 ml-4 space-y-0.5 border-l-2 border-gray-100 pl-3 animate-in slide-in-from-top-1 duration-200">
                      {group.items.map((item) => {
                        const active = isActiveRoute(item.path)
                        return (
                          <li key={item.path}>
                            <NavLink
                              to={item.path}
                              onClick={() => isMobile && onClose()}
                              className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group/item",
                                active
                                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 border-l-2 border-indigo-500 -ml-[2px] pl-[14px]"
                                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                              )}
                            >
                              <item.icon size={16} className={cn(
                                "flex-shrink-0 transition-colors",
                                active ? "text-indigo-600" : "text-gray-400 group-hover/item:text-gray-600"
                              )} />
                              <div className="flex flex-col">
                                <span className={cn(
                                  "text-sm font-medium",
                                  active ? "text-indigo-700" : ""
                                )}>{item.name}</span>
                                <span className="text-[10px] text-gray-400 leading-tight">{item.description}</span>
                              </div>
                              {active && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-500" />
                              )}
                            </NavLink>
                          </li>
                        )
                      })}
                    </ul>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Section */}
      <div className="p-4 border-t border-gray-100 bg-gradient-to-b from-white to-gray-50/50">
        {/* Quick Actions */}
        {!isCollapsed && (
          <div className="mb-4 grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-medium transition-colors">
              <Zap size={14} />
              Quick Action
            </button>
            <button className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-medium transition-colors">
              <LineChart size={14} />
              Reports
            </button>
          </div>
        )}

        {/* User Profile */}
        <div className={cn(
          "flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100 shadow-sm",
          isCollapsed ? "justify-center" : ""
        )}>
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-md">
            A
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">Admin User</p>
              <p className="text-xs text-gray-500 truncate">admin@crick11.com</p>
            </div>
          )}
          {!isCollapsed && (
            <button className="p-2 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-lg transition-colors" title="Logout">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>

    </div>
  )
}

export default Sidebar
