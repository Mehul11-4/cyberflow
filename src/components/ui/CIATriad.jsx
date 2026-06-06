// src/components/ui/CIATriad.jsx
import { motion } from 'framer-motion'

const points = [
  {
    label: 'Confidentiality',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/30',
    desc: 'Only authorized users can access data',
    position: 'top',
  },
  {
    label: 'Integrity',
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/30',
    desc: 'Data is accurate and untampered',
    position: 'bottom-left',
  },
  {
    label: 'Availability',
    color: 'text-green-400',
    bg: 'bg-green-500/10 border-green-500/30',
    desc: 'Systems are accessible when needed',
    position: 'bottom-right',
  },
]

function CIATriad() {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mt-4">
      <h3 className="text-white font-semibold text-center mb-6">
        CIA Triad — Visual Model
      </h3>

      {/* Triangle Layout */}
      <div className="relative flex flex-col items-center gap-4">

        {/* Top */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={`border rounded-xl px-6 py-4 text-center w-56 ${points[0].bg}`}
        >
          <p className={`font-bold text-lg ${points[0].color}`}>{points[0].label}</p>
          <p className="text-gray-400 text-xs mt-1">{points[0].desc}</p>
        </motion.div>

        {/* Connector lines visual */}
        <div className="text-gray-700 text-2xl">▼</div>

        {/* Bottom Row */}
        <div className="flex gap-6">
          {points.slice(1).map((point, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.1 }}
              className={`border rounded-xl px-6 py-4 text-center w-48 ${point.bg}`}
            >
              <p className={`font-bold ${point.color}`}>{point.label}</p>
              <p className="text-gray-400 text-xs mt-1">{point.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Center badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 border border-gray-700 rounded-full px-5 py-2"
        >
          <p className="text-white text-sm font-bold">🔺 CIA Triad</p>
        </motion.div>

      </div>
    </div>
  )
}

export default CIATriad