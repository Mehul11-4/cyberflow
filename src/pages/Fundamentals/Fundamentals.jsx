// src/pages/Fundamentals/Fundamentals.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, ChevronRight, ArrowLeft, Lock, Unlock } from 'lucide-react'
import { fundamentalsData } from '../../data/fundamentals'
import CIATriad from '../../components/ui/CIATriad'
import { useUserProgress } from '../../hooks/useUserProgress'

const colorMap = {
  cyan:   { bg: 'rgba(6,182,212,0.08)',   border: 'rgba(6,182,212,0.25)',   text: '#06b6d4',  dot: '#06b6d4'  },
  purple: { bg: 'rgba(139,92,246,0.08)',  border: 'rgba(139,92,246,0.25)',  text: '#8b5cf6',  dot: '#8b5cf6'  },
  red:    { bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.25)',   text: '#ef4444',  dot: '#ef4444'  },
  orange: { bg: 'rgba(249,115,22,0.08)',  border: 'rgba(249,115,22,0.25)',  text: '#f97316',  dot: '#f97316'  },
  green:  { bg: 'rgba(16,185,129,0.08)',  border: 'rgba(16,185,129,0.25)',  text: '#10b981',  dot: '#10b981'  },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}
const itemAnim = {
  hidden: { opacity: 0, x: -20 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.35 } },
}

function Fundamentals() {
  const [selected, setSelected]   = useState(null)
  const [completed, setCompleted] = useState([])
  const { saveCompletedModule }   = useUserProgress()

  const topic = fundamentalsData.find(t => t.id === selected)

  function markComplete(id) {
    if (!completed.includes(id)) {
      setCompleted([...completed, id])
      saveCompletedModule(`fundamentals-${id}`)
    }
  }

  // ── List View ────────────────────────────────────────────────
  if (!selected) {
    const pct = Math.round((completed.length / fundamentalsData.length) * 100)

    return (
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(6,182,212,0.12)', border: '1px solid rgba(6,182,212,0.25)' }}>
              🛡️
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Cybersecurity Fundamentals</h1>
              <p className="text-gray-500 text-sm">Master the core concepts every professional must know</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-5 p-4 rounded-2xl" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">{completed.length} of {fundamentalsData.length} topics completed</span>
              <span className="font-bold" style={{ color: '#06b6d4' }}>{pct}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
              <motion.div
                className="h-full rounded-full"
                style={{ background: 'linear-gradient(90deg, #06b6d4, #8b5cf6)' }}
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.6 }}
              />
            </div>
          </div>
        </motion.div>

        {/* Topic List */}
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-3">
          {fundamentalsData.map((topic, i) => {
            const c    = colorMap[topic.color]
            const done = completed.includes(topic.id)

            return (
              <motion.div
                key={topic.id}
                variants={itemAnim}
                onClick={() => setSelected(topic.id)}
                whileHover={{ scale: 1.01, x: 4 }}
                whileTap={{ scale: 0.99 }}
                className="relative flex items-center gap-4 p-4 rounded-2xl cursor-pointer overflow-hidden transition-all duration-200"
                style={{
                  background: done ? 'rgba(17,24,39,0.5)' : 'rgba(17,24,39,0.8)',
                  border:     `1px solid ${done ? 'rgba(255,255,255,0.04)' : c.border}`,
                  boxShadow:  done ? 'none' : `0 4px 20px rgba(0,0,0,0.2)`,
                }}
              >
                {/* Left glow */}
                <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: done ? '#374151' : c.text }} />

                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
                  {topic.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-semibold ${done ? 'text-gray-500 line-through' : 'text-white'}`}>{topic.title}</h3>
                  <p className="text-gray-500 text-sm mt-0.5 truncate">{topic.summary}</p>
                </div>
                {done
                  ? <CheckCircle size={20} className="text-green-400 flex-shrink-0" />
                  : <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: c.bg }}>
                      <ChevronRight size={14} style={{ color: c.text }} />
                    </div>
                }
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    )
  }

  // ── Detail View ──────────────────────────────────────────────
  const c    = colorMap[topic.color]
  const done = completed.includes(topic.id)

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ x: -3 }}
        onClick={() => setSelected(null)}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={16} /> Back to Topics
      </motion.button>

      {/* Topic header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{ background: c.bg, border: `1px solid ${c.border}`, boxShadow: `0 0 40px ${c.text}10` }}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">{topic.icon}</span>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: c.text }}>{topic.title}</h1>
            <p className="text-gray-400 mt-1 text-sm">{topic.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* CIA Triad visual */}
      {topic.id === 2 && <CIATriad />}

      {/* Sections */}
      <div className="space-y-3">
        {topic.sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="rounded-2xl p-5 overflow-hidden relative"
            style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${c.text}30, transparent)` }} />
            <h3 className="font-semibold mb-2 text-sm" style={{ color: c.text }}>{section.heading}</h3>
            <p className="text-gray-400 text-sm leading-relaxed">{section.content}</p>
          </motion.div>
        ))}
      </div>

      {/* Key Takeaways */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
          <span style={{ color: c.text }}>⚡</span> Key Takeaways
        </h3>
        <ul className="space-y-2">
          {topic.keyPoints.map((point, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.07 }}
              className="flex items-start gap-2.5 text-sm text-gray-400"
            >
              <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: c.dot }} />
              {point}
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Mark Complete */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="flex justify-end pb-8">
        <motion.button
          onClick={() => { markComplete(topic.id); setSelected(null) }}
          disabled={done}
          whileHover={!done ? { scale: 1.05 } : {}}
          whileTap={!done ? { scale: 0.97 } : {}}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm transition-all"
          style={done
            ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', cursor: 'not-allowed' }
            : { background: `linear-gradient(135deg, ${c.text}, ${c.text}cc)`, color: '#000', boxShadow: `0 0 20px ${c.text}40` }
          }
        >
          {done ? <><CheckCircle size={16} /> Completed ✓</> : <><Unlock size={16} /> Mark as Complete</>}
        </motion.button>
      </motion.div>
    </div>
  )
}

export default Fundamentals