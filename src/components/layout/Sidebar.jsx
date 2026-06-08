// src/components/layout/Sidebar.jsx
import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Shield, Globe,
  Map, FlaskConical, BrainCircuit,
  LogOut, Menu, X, Zap, Flame
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUserProgress } from '../../hooks/useUserProgress'

const navItems = [
  { label: 'Dashboard',       icon: LayoutDashboard, path: '/',             color: '#06b6d4' },
  { label: 'Fundamentals',    icon: Shield,           path: '/fundamentals', color: '#8b5cf6' },
  { label: 'Domains',         icon: Globe,            path: '/domains',      color: '#3b82f6' },
  { label: 'Career Roadmaps', icon: Map,              path: '/roadmaps',     color: '#10b981' },
  { label: 'Visual Labs',     icon: FlaskConical,     path: '/labs',         color: '#f97316' },
  { label: 'Quizzes',         icon: BrainCircuit,     path: '/quizzes',      color: '#ec4899' },
]

function NavItem({ item, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group overflow-hidden
        ${isActive ? 'text-white' : 'text-gray-500 hover:text-white'}`
      }
    >
      {({ isActive }) => (
        <>
          {/* Active background */}
          {isActive && (
            <motion.div
              layoutId="activeNav"
              className="absolute inset-0 rounded-xl"
              style={{
                background: `linear-gradient(135deg, ${item.color}20, ${item.color}10)`,
                border:     `1px solid ${item.color}30`,
              }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          {/* Hover background */}
          {!isActive && hovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 rounded-xl bg-gray-800/50"
            />
          )}

          {/* Icon */}
          <div
            className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200"
            style={{
              backgroundColor: isActive ? item.color + '20' : 'transparent',
              boxShadow:       isActive ? `0 0 12px ${item.color}30` : 'none',
            }}
          >
            <item.icon
              size={16}
              style={{ color: isActive ? item.color : hovered ? '#9ca3af' : '#6b7280' }}
            />
          </div>

          {/* Label */}
          <span className="relative z-10 flex-1">{item.label}</span>

          {/* Active dot */}
          {isActive && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="relative z-10 w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

function SidebarContent({ onClose }) {
  const { user, logout }        = useAuth()
  const { progress }            = useUserProgress()
  const totalXP                 = progress?.totalXP ?? 0
  const streak                  = progress?.streak ?? 1
  const completedModules        = progress?.completedModules?.length ?? 0
  const completionPct           = Math.round((completedModules / 7) * 100)

  return (
    <div className="flex flex-col h-full">

      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:  'linear-gradient(135deg, #06b6d4, #0891b2)',
                boxShadow:   '0 0 20px rgba(6,182,212,0.3)',
              }}
            >
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <span className="text-white font-bold text-lg leading-none">
                Cyber<span className="text-cyan-400">Flow</span>
              </span>
              <p className="text-gray-600 text-xs mt-0.5">Security Platform</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="lg:hidden text-gray-500 hover:text-white">
              <X size={18} />
            </button>
          )}
        </div>
      </div>

      {/* XP + Streak bar */}
      <div className="px-4 py-3 border-b border-gray-800/50">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Flame size={13} className="text-orange-400" />
            <span className="text-orange-400 text-xs font-semibold">{streak} day streak</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap size={13} className="text-yellow-400" />
            <span className="text-yellow-400 text-xs font-semibold">{totalXP} XP</span>
          </div>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }}
            initial={{ width: 0 }}
            animate={{ width: `${completionPct}%` }}
            transition={{ duration: 0.8, delay: 0.3 }}
          />
        </div>
        <p className="text-gray-600 text-xs mt-1">{completionPct}% complete</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavItem key={item.path} item={item} onClick={onClose} />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-gray-800/50 space-y-3">
        <div
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
            style={{ background: 'linear-gradient(135deg, #06b6d4, #8b5cf6)' }}
          >
            {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
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
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-gray-800/50 transition-all text-sm"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </div>
  )
}

function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Desktop */}
      <aside
        className="hidden lg:flex fixed top-0 left-0 h-screen w-64 flex-col z-50"
        style={{
          background:   'rgba(10, 12, 16, 0.95)',
          backdropFilter: 'blur(20px)',
          borderRight:  '1px solid rgba(255,255,255,0.06)',
          boxShadow:    '4px 0 24px rgba(0,0,0,0.3)',
        }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile top bar */}
      <div
        className="lg:hidden fixed top-0 left-0 right-0 z-50 px-4 py-3 flex items-center justify-between"
        style={{
          background:    'rgba(10,12,16,0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom:  '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
            <Shield size={14} className="text-white" />
          </div>
          <span className="text-white font-bold text-lg">Cyber<span className="text-cyan-400">Flow</span></span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white p-1">
          <Menu size={22} />
        </button>
      </div>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="lg:hidden fixed top-0 left-0 h-screen w-72 z-50 flex flex-col"
            style={{
              background:     'rgba(10,12,16,0.98)',
              backdropFilter: 'blur(20px)',
              borderRight:    '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  )
}

export default Sidebar