// src/pages/Fundamentals/Fundamentals.jsx
import { useUserProgress } from '../../hooks/useUserProgress'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ChevronRight, ArrowLeft } from 'lucide-react'
import { fundamentalsData } from '../../data/fundamentals'
import CIATriad from '../../components/ui/CIATriad'

const colorMap = {
  cyan:   { bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   text: 'text-cyan-400',   dot: 'bg-cyan-400'   },
  purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400', dot: 'bg-purple-400' },
  red:    { bg: 'bg-red-500/10',    border: 'border-red-500/30',    text: 'text-red-400',    dot: 'bg-red-400'    },
  orange: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400', dot: 'bg-orange-400' },
  green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400',  dot: 'bg-green-400'  },
}

function Fundamentals() {
  const { saveCompletedModule } = useUserProgress()
  const [selected, setSelected]   = useState(null)
  const [completed, setCompleted] = useState([])

  const topic = fundamentalsData.find(t => t.id === selected)

  function markComplete(id) {
  if (!completed.includes(id)) {
    setCompleted([...completed, id])
    saveCompletedModule(`fundamentals-${id}`)
  }
}

  // ── Topic List View ──────────────────────────────────────────
  if (!selected) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white">🛡️ Cybersecurity Fundamentals</h1>
          <p className="text-gray-400 mt-2">
            Master the core concepts that every cybersecurity professional must know.
          </p>

          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-500 mb-1">
              <span>{completed.length} of {fundamentalsData.length} topics completed</span>
              <span>{Math.round((completed.length / fundamentalsData.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2">
              <motion.div
                className="bg-cyan-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${(completed.length / fundamentalsData.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Topic Cards */}
        <div className="space-y-3">
          {fundamentalsData.map((topic, i) => {
            const c = colorMap[topic.color]
            const done = completed.includes(topic.id)
            return (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                onClick={() => setSelected(topic.id)}
                className={`flex items-center gap-4 p-5 rounded-xl border cursor-pointer transition-all duration-200
                  ${done
                    ? 'bg-gray-900/50 border-gray-700 opacity-75'
                    : `bg-gray-900 border-gray-800 hover:${c.border} hover:${c.bg}`
                  }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${c.bg} border ${c.border}`}>
                  {topic.icon}
                </div>
                <div className="flex-1">
                  <h3 className={`font-semibold text-white ${done ? 'line-through text-gray-500' : ''}`}>
                    {topic.title}
                  </h3>
                  <p className="text-gray-500 text-sm mt-0.5">{topic.summary}</p>
                </div>
                {done
                  ? <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  : <ChevronRight size={20} className="text-gray-600 flex-shrink-0" />
                }
              </motion.div>
            )
          })}
        </div>

      </div>
    )
  }

  // ── Topic Detail View ────────────────────────────────────────
  const c = colorMap[topic.color]
  const done = completed.includes(topic.id)

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => setSelected(null)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Topics
      </motion.button>

      {/* Topic Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-6 ${c.bg} ${c.border}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-4xl">{topic.icon}</span>
          <div>
            <h1 className={`text-2xl font-bold ${c.text}`}>{topic.title}</h1>
            <p className="text-gray-400 mt-1">{topic.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* CIA Triad Visual */}
      {topic.id === 2 && <CIATriad />}

      {/* Sections */}
      <div className="space-y-4">
        {topic.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-gray-900 border border-gray-800 rounded-xl p-5"
          >
            <h3 className={`font-semibold mb-2 ${c.text}`}>{section.heading}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>

      {/* Key Points */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5"
      >
        <h3 className="text-white font-semibold mb-3">⚡ Key Takeaways</h3>
        <ul className="space-y-2">
          {topic.keyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
              <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${c.dot}`} />
              {point}
            </li>
          ))}
        </ul>
      </motion.div>

      {/* Mark Complete */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-end pb-8"
      >
        <button
          onClick={() => { markComplete(topic.id); setSelected(null) }}
          disabled={done}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
            ${done
              ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed'
              : 'bg-cyan-500 hover:bg-cyan-400 text-gray-950 hover:scale-105'
            }`}
        >
          <CheckCircle size={18} />
          {done ? 'Completed ✓' : 'Mark as Complete'}
        </button>
      </motion.div>

    </div>
  )
}

export default Fundamentals