// src/pages/Labs/Labs.jsx
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const labs = [
  {
    id: 'network',
    title: 'Network Visualization Lab',
    icon: '🌐',
    color: 'cyan',
    description: 'Interact with a live network diagram. Simulate packet flow and learn how firewalls, routers, and switches work.',
    path: '/labs/network',
    status: 'Available',
  },
  {
    id: 'sql',
    title: 'SQL Injection Simulator',
    icon: '💉',
    color: 'red',
    description: 'See how SQL injection attacks work in real time. Type payloads, watch the query break, and learn prevention.',
    path: '/labs/sql',
    status: 'Available',
  },
  {
    id: 'phishing',
    title: 'Phishing Simulator',
    icon: '🎣',
    color: 'orange',
    description: 'Analyze fake emails and login pages. Learn to identify social engineering attacks.',
    path: '/labs/phishing',
    status: 'Available',
  },
]

const colorMap = {
  cyan:   'bg-cyan-500/10 border-cyan-500/20 text-cyan-400',
  red:    'bg-red-500/10 border-red-500/20 text-red-400',
  orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
}

function Labs() {
  const navigate = useNavigate()
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">⚗️ Visual Labs</h1>
        <p className="text-gray-400 mt-2">
          Hands-on interactive simulations. Learn by doing, not just reading.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {labs.map((lab, i) => (
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => lab.status === 'Available' && navigate(lab.path)}
            className={`bg-gray-900 border border-gray-800 rounded-2xl p-5 transition-all duration-200
              ${lab.status === 'Available'
                ? 'cursor-pointer hover:border-gray-600 hover:scale-[1.02]'
                : 'opacity-60 cursor-not-allowed'
              }`}
          >
            <div className="text-3xl mb-3">{lab.icon}</div>
            <h3 className="text-white font-semibold text-sm mb-2">{lab.title}</h3>
            <p className="text-gray-500 text-xs leading-relaxed mb-3">{lab.description}</p>
            <span className={`text-xs px-2 py-0.5 rounded-full border ${colorMap[lab.color]}`}>
              {lab.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default Labs