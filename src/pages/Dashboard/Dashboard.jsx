// src/pages/Dashboard/Dashboard.jsx
import { motion } from 'framer-motion'
import {
  BookOpen, Trophy, Flame,
  BarChart3, Play, ChevronRight,
  Clock, Shield, Globe, Network, Bug
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUserProgress } from '../../hooks/useUserProgress'
import StatCard from '../../components/ui/StatCard'
import TopicCard from '../../components/ui/TopicCard'

const topics = [
  { title: 'CIA Triad',         description: 'Understand the three pillars of cybersecurity.',                        tag: 'Fundamentals', tagColor: 'bg-cyan-500/10 text-cyan-400',   delay: 0.1 },
  { title: 'Network Security',  description: 'Explore how firewalls and secure protocols protect data in transit.',   tag: 'Domains',      tagColor: 'bg-purple-500/10 text-purple-400', delay: 0.2 },
  { title: 'SQL Injection',     description: 'See how attackers exploit database queries and how to prevent it.',     tag: 'Visual Lab',   tagColor: 'bg-red-500/10 text-red-400',     delay: 0.3 },
  { title: 'SOC Analyst Path',  description: 'Follow the complete roadmap to becoming a SOC analyst.',               tag: 'Career',       tagColor: 'bg-green-500/10 text-green-400', delay: 0.4 },
]

function Dashboard() {
  const { user }              = useAuth()
  const { progress, loading } = useUserProgress()

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  })

  // Calculate real stats from Firestore data
  const completedModules = progress?.completedModules?.length ?? 0
  const quizScores       = progress?.quizScores ?? {}
  const quizValues       = Object.values(quizScores).map(q => q.score)
  const avgQuizScore     = quizValues.length
    ? Math.round(quizValues.reduce((a, b) => a + b, 0) / quizValues.length)
    : 0
  const totalModules     = 7
  const completionPct    = Math.round((completedModules / totalModules) * 100)
  const streak           = progress?.streak ?? 1

  const stats = [
    { icon: BookOpen,  label: 'Modules Completed', value: String(completedModules), suffix: `/${totalModules}`,  color: 'bg-cyan-500/20 text-cyan-400'     },
    { icon: Trophy,    label: 'Quiz Score',         value: String(avgQuizScore),     suffix: '%',                 color: 'bg-purple-500/20 text-purple-400'  },
    { icon: Flame,     label: 'Learning Streak',    value: String(streak),           suffix: ' day',              color: 'bg-orange-500/20 text-orange-400'  },
    { icon: BarChart3, label: 'Completion',         value: String(completionPct),    suffix: '%',                 color: 'bg-green-500/20 text-green-400'    },
  ]

  const recentActivity = [
    { icon: Shield,  text: 'Platform setup complete',          time: 'Just now',   color: 'text-cyan-400'   },
    { icon: Globe,   text: 'Domains module unlocked',          time: '1 min ago',  color: 'text-purple-400' },
    { icon: Network, text: 'Network Lab ready',                time: '2 mins ago', color: 'text-blue-400'   },
    { icon: Bug,     text: 'SQL Injection Simulator unlocked', time: '2 mins ago', color: 'text-red-400'    },
    ...Object.values(quizScores).map(q => ({
      icon:  Trophy,
      text:  `${q.title} quiz — ${q.score}%`,
      time:  new Date(q.completedAt).toLocaleDateString(),
      color: q.score >= 80 ? 'text-green-400' : 'text-yellow-400',
    })),
  ]

  return (
    <div className="max-w-6xl mx-auto space-y-8">

      {/* Header */}
<motion.div
  initial={{ opacity: 0, y: -10 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4 }}
  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3"
>
  <div>
    <h1 className="text-2xl lg:text-3xl font-bold text-white">
      Welcome back, {user?.displayName?.split(' ')[0] || 'Student'} 👋
    </h1>
    <p className="text-gray-500 mt-1 text-sm">{today}</p>
  </div>
  <div className="bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-medium px-3 py-2 rounded-full self-start sm:self-auto">
    🎯 60-Day Challenge Active
  </div>
</motion.div>

      {/* Stats Row */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, i) => <StatCard key={i} {...stat} />)}
        </div>
      )}

      {/* Continue Learning Banner */}
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.4, delay: 0.2 }}
  className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 border border-cyan-500/20 rounded-2xl p-5 lg:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
>
  <div>
    <p className="text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-1">
      {completedModules === 0 ? 'Start Here' : 'Continue Learning'}
    </p>
    <h2 className="text-white text-lg lg:text-xl font-bold">
      {completedModules === 0
        ? 'Cybersecurity Fundamentals'
        : `${completedModules} of ${totalModules} modules complete`
      }
    </h2>
    <p className="text-gray-400 text-sm mt-1">
      {completedModules === 0
        ? 'Begin with the CIA Triad, Threat Actors, and Types of Attacks.'
        : `Keep going — you're ${completionPct}% through the curriculum.`
      }
    </p>
  </div>
  <button className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-5 py-3 rounded-xl transition-all duration-200 hover:scale-105 flex-shrink-0">
    <Play size={16} />
    {completedModules === 0 ? 'Begin' : 'Continue'}
  </button>
</motion.div>

      {/* Recommended Topics */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-bold text-lg">Recommended Topics</h2>
          <button className="text-cyan-400 text-sm flex items-center gap-1 hover:text-cyan-300">
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {topics.map((topic, i) => <TopicCard key={i} {...topic} />)}
        </div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-6"
      >
        <h2 className="text-white font-bold text-lg mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.slice(0, 6).map((item, i) => (
            <div key={i} className="flex items-center gap-4">
              <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center flex-shrink-0">
                <item.icon size={15} className={item.color} />
              </div>
              <div className="flex-1">
                <p className="text-gray-300 text-sm">{item.text}</p>
              </div>
              <div className="flex items-center gap-1 text-gray-600 text-xs">
                <Clock size={11} />
                {item.time}
              </div>
            </div>
          ))}
        </div>
      </motion.div>

    </div>
  )
}

export default Dashboard