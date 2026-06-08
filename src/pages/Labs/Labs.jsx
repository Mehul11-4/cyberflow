// src/pages/Labs/Labs.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Lock } from 'lucide-react'

const labs = [
  {
    id: 'network',
    title: 'Network Visualization Lab',
    icon: '🌐',
    color: '#06b6d4',
    description: 'Interact with a live network diagram. Simulate HTTP, HTTPS, DNS, and attack scenarios step by step.',
    path: '/labs/network',
    status: 'Available',
    tag: 'Networking',
    steps: 6,
  },
  {
    id: 'sql',
    title: 'SQL Injection Simulator',
    icon: '💉',
    color: '#ef4444',
    description: 'Watch SQL queries break in real time. Three challenge levels from basic bypass to UNION extraction.',
    path: '/labs/sql',
    status: 'Available',
    tag: 'Web Security',
    steps: 3,
  },
  {
    id: 'phishing',
    title: 'Phishing Simulator',
    icon: '🎣',
    color: '#f97316',
    description: 'Analyze real phishing tactics. Click suspicious email elements and see credential theft in action.',
    path: '/labs/phishing',
    status: 'Available',
    tag: 'Social Engineering',
    steps: 3,
  },
]

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
}
const cardAnim = {
  hidden: { opacity: 0, y: 25 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function Labs() {
  const navigate = useNavigate()

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)' }}>
            ⚗️
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Visual Labs</h1>
            <p className="text-gray-500 text-sm">Hands-on simulations — learn by doing, not just reading</p>
          </div>
        </div>
      </motion.div>

      {/* Lab Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {labs.map(lab => (
          <motion.div
            key={lab.id}
            variants={cardAnim}
            onClick={() => lab.status === 'Available' && navigate(lab.path)}
            whileHover={lab.status === 'Available' ? { scale: 1.02, y: -3 } : {}}
            whileTap={lab.status === 'Available' ? { scale: 0.98 } : {}}
            className="relative rounded-2xl overflow-hidden"
            style={{
              background:  'rgba(17,24,39,0.8)',
              border:      `1px solid ${lab.color}25`,
              cursor:      lab.status === 'Available' ? 'pointer' : 'not-allowed',
              opacity:     lab.status === 'Available' ? 1 : 0.6,
              boxShadow:   `0 4px 24px rgba(0,0,0,0.2)`,
            }}
          >
            {/* Top glow */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${lab.color}60, transparent)` }} />

            {/* Color bar */}
            <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: `linear-gradient(${lab.color}, ${lab.color}40)` }} />

            <div className="p-5 pl-6">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{lab.icon}</div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${lab.color}15`, color: lab.color, border: `1px solid ${lab.color}30` }}>
                    {lab.tag}
                  </span>
                  {lab.status === 'Available'
                    ? <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-green-500/10 text-green-400 border border-green-500/20">Available</span>
                    : <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-800 text-gray-500 border border-gray-700 flex items-center gap-1"><Lock size={9} /> Soon</span>
                  }
                </div>
              </div>

              <h3 className="text-white font-bold mb-2">{lab.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">{lab.description}</p>

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{lab.steps} {lab.id === 'network' ? 'simulations' : 'challenges'}</span>
                {lab.status === 'Available' && (
                  <div className="flex items-center gap-1 text-sm font-semibold" style={{ color: lab.color }}>
                    Launch Lab <ArrowRight size={14} />
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Info banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.15)' }}
      >
        <p className="text-gray-400 text-sm leading-relaxed">
          <span className="text-cyan-400 font-semibold">🔒 Safety Notice:</span> All simulations are educational demonstrations only. No real attacks are performed. SQL injection and phishing simulations run entirely in your browser — no data is transmitted to any external server.
        </p>
      </motion.div>

    </div>
  )
}

export default Labs