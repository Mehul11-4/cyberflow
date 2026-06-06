// src/pages/Roadmaps/Roadmaps.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle, Clock,
  TrendingUp, DollarSign, Award,
  ExternalLink, ChevronDown, ChevronUp
} from 'lucide-react'
import { roadmapsData } from '../../data/roadmaps'

const colorMap = {
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30'   },
  red:    { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30'   },
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30'  },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
}

const difficultyColor = {
  'Beginner Friendly':        'bg-green-500/10 text-green-400 border-green-500/20',
  'Intermediate':             'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Intermediate to Advanced': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
}

const certLevelColor = {
  'Beginner':     'bg-green-500/10 text-green-400 border-green-500/30',
  'Intermediate': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
  'Advanced':     'bg-red-500/10 text-red-400 border-red-500/30',
}

// ── Roadmap Selection Card ─────────────────────────────────────
function RoadmapCard({ roadmap, onClick, completed, delay }) {
  const c = colorMap[roadmap.color]
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      onClick={onClick}
      className={`relative bg-gray-900 border rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] group ${c.border}`}
    >
      {completed && (
        <div className="absolute top-4 right-4">
          <CheckCircle size={18} className="text-green-400" />
        </div>
      )}

      <div className="text-4xl mb-4">{roadmap.icon}</div>
      <h3 className={`text-xl font-bold mb-1 ${c.text}`}>{roadmap.title}</h3>
      <p className="text-gray-500 text-sm mb-4 leading-relaxed">{roadmap.summary}</p>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Clock size={12} className={c.text} />
          <span>{roadmap.timeline}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <TrendingUp size={12} className={c.text} />
          <span>{roadmap.difficulty}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <DollarSign size={12} className={c.text} />
          <span>{roadmap.salary}</span>
        </div>
      </div>

      <div className={`mt-4 text-xs font-semibold flex items-center gap-1 ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
        View Roadmap →
      </div>
    </motion.div>
  )
}

// ── Stage Step Component ───────────────────────────────────────
function StageStep({ stage, index, total, domainColor }) {
  const [open, setOpen] = useState(index === 0)
  const c = colorMap[stage.color] || colorMap[domainColor]

  return (
    <div className="relative">
      {index < total - 1 && (
        <div className="absolute left-6 top-14 w-0.5 h-8 bg-gray-700 z-0" />
      )}

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`relative z-10 bg-gray-900 border rounded-xl overflow-hidden ${c.border}`}
      >
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-4 p-4 hover:bg-gray-800/50 transition-colors"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm border-2 ${c.bg} ${c.border} ${c.text}`}>
            {stage.step}
          </div>
          <div className="flex-1 text-left">
            <p className={`font-semibold text-sm ${c.text}`}>{stage.title}</p>
            <p className="text-gray-600 text-xs mt-0.5">{stage.duration}</p>
          </div>
          {open
            ? <ChevronUp size={16} className="text-gray-500 flex-shrink-0" />
            : <ChevronDown size={16} className="text-gray-500 flex-shrink-0" />
          }
        </button>

        {open && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">
              {stage.description}
            </p>

            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${c.text}`}>
                What to Learn
              </p>
              <ul className="space-y-1.5">
                {stage.skills.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-400">
                    <span className={`mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.bg} border ${c.border}`} />
                    {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${c.text}`}>
                Free Resources
              </p>
              <div className="space-y-1.5">
                {stage.resources.map((res, i) => (
  <a
    key={i}
    href={res.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors group"
  >
    <ExternalLink
      size={12}
      className={`flex-shrink-0 ${c.text}`}
    />
    <span className="group-hover:underline">
      {res.name}
    </span>
  </a>
))}
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  )
}

// ── Detail View ────────────────────────────────────────────────
function RoadmapDetail({ roadmap, done, onBack, onComplete }) {
  const c = colorMap[roadmap.color]

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Roadmaps
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-6 ${c.bg} ${c.border}`}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{roadmap.icon}</span>
            <div>
              <h1 className={`text-2xl font-bold ${c.text}`}>{roadmap.title}</h1>
              <p className="text-gray-400 mt-1 text-sm">{roadmap.summary}</p>
            </div>
          </div>
          <span className={`text-xs px-3 py-1.5 rounded-full border ${difficultyColor[roadmap.difficulty]}`}>
            {roadmap.difficulty}
          </span>
        </div>

        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-gray-700/50">
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock size={14} className={c.text} />
            <span>{roadmap.timeline}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <DollarSign size={14} className={c.text} />
            <span>{roadmap.salary}</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5"
      >
        <h3 className={`font-semibold mb-2 ${c.text}`}>About This Career</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{roadmap.description}</p>
      </motion.div>

      <div>
        <h2 className="text-white font-bold text-lg mb-4">
          🗺️ Step-by-Step Learning Path
        </h2>
        <div className="space-y-3">
          {roadmap.stages.map((stage, i) => (
            <StageStep
              key={i}
              stage={stage}
              index={i}
              total={roadmap.stages.length}
              domainColor={roadmap.color}
            />
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 border border-gray-800 rounded-xl p-5"
      >
        <h3 className={`font-semibold mb-4 flex items-center gap-2 ${c.text}`}>
          <Award size={16} /> Certifications — In Order of Priority
        </h3>
        <div className="space-y-3">
          {roadmap.certifications.map((cert, i) => (
            <div key={i} className="flex items-start gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${c.bg} ${c.text} border ${c.border}`}>
                {cert.priority}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white text-sm font-semibold">{cert.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${certLevelColor[cert.level]}`}>
                    {cert.level}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-0.5">{cert.note}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end pb-8"
      >
        <button
          onClick={onComplete}
          disabled={done}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${done ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed' : `${c.bg} ${c.text} border ${c.border} hover:scale-105`}`}
        >
          <CheckCircle size={18} />
          {done ? 'Roadmap Saved ✓' : 'Save This Roadmap'}
        </button>
      </motion.div>

    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
function Roadmaps() {
  const [selected, setSelected]   = useState(null)
  const [completed, setCompleted] = useState([])

  const roadmap = roadmapsData.find(r => r.id === selected)

  function markComplete(id) {
    if (!completed.includes(id)) setCompleted([...completed, id])
    setSelected(null)
  }

  if (!selected) {
    return (
      <div className="max-w-5xl mx-auto space-y-8">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-white">🗺️ Career Roadmaps</h1>
          <p className="text-gray-400 mt-2">
            Choose a career path and follow a step-by-step guide from beginner to job-ready.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roadmapsData.map((roadmap, i) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              onClick={() => setSelected(roadmap.id)}
              completed={completed.includes(roadmap.id)}
              delay={i * 0.1}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <RoadmapDetail
      roadmap={roadmap}
      done={completed.includes(roadmap.id)}
      onBack={() => setSelected(null)}
      onComplete={() => markComplete(roadmap.id)}
    />
  )
}

export default Roadmaps