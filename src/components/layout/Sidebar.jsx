// src/components/layout/Sidebar.jsx
import { useAuth } from '../../context/AuthContext'
import { LogOut } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Shield,
  Globe,
  Map,
  FlaskConical,
  BrainCircuit,
  ChevronRight
} from 'lucide-react'

const navItems = [
  { label: 'Dashboard',       icon: LayoutDashboard, path: '/' },
  { label: 'Fundamentals',    icon: Shield,           path: '/fundamentals' },
  { label: 'Domains',         icon: Globe,            path: '/domains' },
  { label: 'Career Roadmaps', icon: Map,              path: '/roadmaps' },
  { label: 'Visual Labs',     icon: FlaskConical,     path: '/labs' },
  { label: 'Quizzes',         icon: BrainCircuit,     path: '/quizzes' },
]

function Sidebar() {
  const { user, logout } = useAuth()
  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-gray-900 border-r border-gray-800 flex flex-col z-50">
      
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
            <Shield size={18} className="text-gray-950" />
          </div>
          <span className="text-white font-bold text-xl tracking-wide">
            Cyber<span className="text-cyan-400">Flow</span>
          </span>
        </div>
        <p className="text-gray-500 text-xs mt-2 ml-11">
          Security Learning Platform
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group
              ${isActive
                ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={18} className={isActive ? 'text-cyan-400' : 'text-gray-500 group-hover:text-white'} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight size={14} className="text-cyan-400" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
<div className="px-4 py-4 border-t border-gray-800 space-y-3">
  <div className="flex items-center gap-3 px-2">
    <div className="w-8 h-8 rounded-full bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center flex-shrink-0">
      <span className="text-cyan-400 text-xs font-bold">
        {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
      </span>
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-white text-xs font-semibold truncate">
        {user?.displayName || 'Student'}
      </p>
      <p className="text-gray-600 text-xs truncate">{user?.email}</p>
    </div>
  </div>
  <button
    onClick={logout}
    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-gray-500 hover:text-white hover:bg-gray-800 transition-all text-sm"
  >
    <LogOut size={15} />
    Sign Out
  </button>
</div>

    </aside>
  )
}

export default Sidebar