// src/pages/Dashboard/Dashboard.jsx
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  BookOpen, Trophy, Flame, BarChart3,
  ChevronRight, Clock, Shield, Globe,
  Network, Bug, Zap, ArrowRight,
  FlaskConical, BrainCircuit, Map
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUserProgress } from '../../hooks/useUserProgress'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const item = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function AnimatedNumber({ value }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {value}
    </motion.span>
  )
}

function GlowCard({ children, color = '#06b6d4', className = '', onClick }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={onClick ? { scale: 0.98 } : {}}
      onClick={onClick}
      className={`relative rounded-2xl overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={{
        background:  'rgba(17,24,39,0.8)',
        border:      `1px solid rgba(255,255,255,0.06)`,
        boxShadow:   `0 4px 24px rgba(0,0,0,0.3)`,
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Top glow line */}
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}40, transparent)` }} />
      {children}
    </motion.div>
  )
}

function StatCard({ icon: Icon, label, value, suffix, color, gradient }) {
  return (
    <GlowCard color={color}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: color + '15', boxShadow: `0 0 20px ${color}20` }}>
            <Icon size={18} style={{ color }} />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-white leading-none">
              <AnimatedNumber value={value} />
              <span className="text-gray-500 text-sm font-normal">{suffix}</span>
            </p>
          </div>
        </div>
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">{label}</p>
        <div className="mt-2 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${color}40, transparent)` }} />
      </div>
    </GlowCard>
  )
}

const quickActions = [
  { label: 'Fundamentals',    icon: Shield,        path: '/fundamentals', color: '#8b5cf6', desc: '5 core topics'        },
  { label: 'Domains',         icon: Globe,         path: '/domains',      color: '#3b82f6', desc: '8 security domains'    },
  { label: 'Career Roadmaps', icon: Map,           path: '/roadmaps',     color: '#10b981', desc: '4 career paths'       },
  { label: 'Visual Labs',     icon: FlaskConical,  path: '/labs',         color: '#f97316', desc: '3 interactive labs'   },
  { label: 'Quizzes',         icon: BrainCircuit,  path: '/quizzes',      color: '#ec4899', desc: '5 topic quizzes'      },
]

function Dashboard() {
  const { user }                             = useAuth()
  const { progress, loading, updateStreak } = useUserProgress()
  const navigate                            = useNavigate()

  useEffect(() => { if (progress) updateStreak() }, [progress?.lastActiveDate])

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const completedModules = progress?.completedModules?.length ?? 0
  const quizScores       = progress?.quizScores ?? {}
  const quizValues       = Object.values(quizScores).map(q => q.score)
  const avgQuizScore     = quizValues.length
    ? Math.round(quizValues.reduce((a, b) => a + b, 0) / quizValues.length) : 0
  const totalModules     = 7
  const completionPct    = Math.round((completedModules / totalModules) * 100)
  const streak           = progress?.streak ?? 1
  const totalXP          = progress?.totalXP ?? 0

  const stats = [
    { icon: BookOpen,  label: 'Modules Completed', value: completedModules, suffix: `/${totalModules}`, color: '#06b6d4' },
    { icon: Trophy,    label: 'Quiz Score',         value: avgQuizScore,     suffix: '%',               color: '#8b5cf6' },
    { icon: Flame,     label: 'Learning Streak',    value: streak,           suffix: ' days',           color: '#f97316' },
    { icon: BarChart3, label: 'Completion',         value: completionPct,    suffix: '%',               color: '#10b981' },
  ]

  const recentActivity = [
    { icon: Shield,  text: 'Platform setup complete',          time: 'Setup',     color: '#06b6d4' },
    { icon: Globe,   text: 'Domains module unlocked',          time: 'Available', color: '#8b5cf6' },
    { icon: Network, text: 'Network Lab ready',                time: 'Available', color: '#3b82f6' },
    { icon: Bug,     text: 'SQL Injection Simulator unlocked', time: 'Available', color: '#ef4444' },
    ...Object.values(quizScores).map(q => ({
      icon:  Trophy,
      text:  `${q.title} — ${q.score}%`,
      time:  new Date(q.completedAt).toLocaleDateString(),
      color: q.score >= 80 ? '#10b981' : q.score >= 60 ? '#f59e0b' : '#ef4444',
    })),
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden p-6 lg:p-8"
        style={{
          background:  'linear-gradient(135deg, rgba(6,182,212,0.12) 0%, rgba(139,92,246,0.08) 50%, rgba(10,12,16,0.9) 100%)',
          border:      '1px solid rgba(6,182,212,0.15)',
          boxShadow:   '0 0 60px rgba(6,182,212,0.08)',
        }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5" style={{ background: 'radial-gradient(circle, #06b6d4, transparent)', transform: 'translate(30%, -30%)' }} />

        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-cyan-400 text-sm font-medium mb-1">{greeting} 👋</p>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">
              {user?.displayName?.split(' ')[0] || 'Student'}
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {totalXP > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: 'rgba(234,179,8,0.1)', border: '1px solid rgba(234,179,8,0.2)', color: '#eab308' }}>
                <Zap size={12} /> {totalXP} XP earned
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold" style={{ background: 'rgba(6,182,212,0.1)', border: '1px solid rgba(6,182,212,0.2)', color: '#06b6d4' }}>
              🎯 60-Day Challenge
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="relative mt-5">
          <div className="flex justify-between text-xs text-gray-500 mb-1.5">
            <span>Overall Progress</span>
            <span className="text-cyan-400 font-semibold">{completionPct}%</span>
          </div>
          <div className="w-full bg-gray-800/50 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completionPct}%` }}
              transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-28 animate-pulse" />
          ))}
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 lg:grid-cols-4 gap-3"
        >
          {stats.map((stat, i) => (
            <motion.div key={i} variants={item}>
              <StatCard {...stat} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Quick Actions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Quick Access</h2>
        </div>
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          {quickActions.map((action, i) => (
            <motion.div key={i} variants={item}>
              <GlowCard color={action.color} onClick={() => navigate(action.path)}>
                <div className="p-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: action.color + '15' }}>
                    <action.icon size={18} style={{ color: action.color }} />
                  </div>
                  <p className="text-white font-semibold text-sm">{action.label}</p>
                  <p className="text-gray-600 text-xs mt-0.5">{action.desc}</p>
                  <div className="flex items-center gap-1 mt-3 text-xs font-medium" style={{ color: action.color }}>
                    Open <ArrowRight size={11} />
                  </div>
                </div>
              </GlowCard>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Continue Learning */}
        <GlowCard color="#06b6d4" onClick={() => navigate(completedModules === 0 ? '/fundamentals' : '/domains')}>
          <div className="p-5">
            <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
              {completedModules === 0 ? '▶ Start Here' : '▶ Continue Learning'}
            </p>
            <h3 className="text-white font-bold text-lg mb-1">
              {completedModules === 0 ? 'Cybersecurity Fundamentals' : `${completedModules} of ${totalModules} modules done`}
            </h3>
            <p className="text-gray-500 text-sm mb-4">
              {completedModules === 0 ? 'Begin with CIA Triad, Threat Actors and Attack Types.' : `Keep going — you're ${completionPct}% through.`}
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-cyan-400">
              {completedModules === 0 ? 'Begin now' : 'Continue'} <ChevronRight size={15} />
            </div>
          </div>
        </GlowCard>

        {/* Recent Activity */}
        <GlowCard color="#8b5cf6">
          <div className="p-5">
            <h3 className="text-white font-bold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.slice(0, 4).map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: item.color + '15' }}>
                    <item.icon size={13} style={{ color: item.color }} />
                  </div>
                  <p className="text-gray-400 text-xs flex-1 leading-tight">{item.text}</p>
                  <div className="flex items-center gap-1 text-gray-600 text-xs flex-shrink-0">
                    <Clock size={10} /> {item.time}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </GlowCard>

      </div>
    </div>
  )
}

export default Dashboard