// src/pages/Roadmaps/Roadmaps.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle, Clock,
  TrendingUp, Award, ExternalLink,
  ChevronDown, ChevronUp, BookOpen,
  Building2, GraduationCap, Briefcase,
  IndianRupee
} from 'lucide-react'
import { roadmapsData } from '../../data/roadmaps'
import { useUserProgress } from '../../hooks/useUserProgress'

const colorMap = {
  cyan:   '#06b6d4', red:    '#ef4444', blue:   '#3b82f6',
  green:  '#10b981', purple: '#8b5cf6', orange: '#f97316',
  yellow: '#f59e0b', pink:   '#ec4899',
}

const difficultyStyle = {
  'Beginner Friendly':        { bg: 'rgba(16,185,129,0.1)',  text: '#10b981', border: 'rgba(16,185,129,0.2)'  },
  'Intermediate':             { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b', border: 'rgba(245,158,11,0.2)'  },
  'Intermediate to Advanced': { bg: 'rgba(249,115,22,0.1)',  text: '#f97316', border: 'rgba(249,115,22,0.2)'  },
}

const certLevelStyle = {
  'Beginner':     { bg: 'rgba(16,185,129,0.1)',  text: '#10b981', border: 'rgba(16,185,129,0.2)'  },
  'Intermediate': { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b', border: 'rgba(245,158,11,0.2)'  },
  'Advanced':     { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444', border: 'rgba(239,68,68,0.2)'   },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const cardAnim = {
  hidden: { opacity: 0, y: 25 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
}

function Section({ title, icon: Icon, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors">
        <h3 className="font-semibold flex items-center gap-2 text-sm" style={{ color }}>
          <Icon size={15} /> {title}
        </h3>
        {open ? <ChevronUp size={15} className="text-gray-600" /> : <ChevronDown size={15} className="text-gray-600" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

function StageStep({ stage, index, total, domainColor }) {
  const [open, setOpen] = useState(index === 0)
  const stageC = { green: '#10b981', yellow: '#f59e0b', red: '#ef4444', cyan: '#06b6d4', blue: '#3b82f6', purple: '#8b5cf6', orange: '#f97316' }
  const color  = stageC[stage.color] || colorMap[domainColor] || '#06b6d4'

  return (
    <div className="relative">
      {index < total - 1 && (
        <div className="absolute left-[19px] top-14 w-0.5 h-8 z-0" style={{ background: `linear-gradient(${color}40, transparent)` }} />
      )}
      <motion.div
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.08 }}
        className="relative z-10 rounded-2xl overflow-hidden"
        style={{ background: 'rgba(17,24,39,0.8)', border: `1px solid ${color}25` }}
      >
        <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 p-4 hover:bg-white/5 transition-colors">
          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-sm border-2" style={{ background: `${color}15`, borderColor: `${color}40`, color }}>
            {stage.step}
          </div>
          <div className="flex-1 text-left">
            <p className="font-semibold text-sm" style={{ color }}>{stage.title}</p>
            <p className="text-gray-600 text-xs mt-0.5">{stage.duration}</p>
          </div>
          {open ? <ChevronUp size={15} className="text-gray-600 flex-shrink-0" /> : <ChevronDown size={15} className="text-gray-600 flex-shrink-0" />}
        </button>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-4 pb-4 space-y-4"
            >
              <p className="text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-3">{stage.description}</p>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color }}>What to Learn</p>
                <ul className="space-y-1.5">
                  {stage.skills.map((skill, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color }}>Free Resources</p>
                <div className="space-y-1.5">
                  {stage.resources.map((res, i) => (
                    <a key={i} href={res.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors group">
                      <ExternalLink size={11} style={{ color }} />
                      <span className="group-hover:underline">{res.name}</span>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

// ── Roadmap Grid Card ──────────────────────────────────────────
function RoadmapCard({ roadmap, onClick, completed }) {
  const color = colorMap[roadmap.color]
  const diff  = difficultyStyle[roadmap.difficulty]

  return (
    <motion.div
      variants={cardAnim}
      onClick={onClick}
      whileHover={{ scale: 1.02, y: -3 }}
      whileTap={{ scale: 0.98 }}
      className="relative rounded-2xl p-5 cursor-pointer overflow-hidden"
      style={{ background: 'rgba(17,24,39,0.8)', border: `1px solid ${color}25`, boxShadow: '0 4px 24px rgba(0,0,0,0.2)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />

      {completed && (
        <div className="absolute top-3 right-3">
          <CheckCircle size={15} className="text-green-400" />
        </div>
      )}

      <div className="text-3xl mb-3">{roadmap.icon}</div>
      <h3 className="font-bold mb-0.5" style={{ color }}>{roadmap.title}</h3>
      <p className="text-gray-500 text-xs mb-3 leading-relaxed">{roadmap.summary}</p>

      <div className="space-y-1.5 mb-3">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock size={10} style={{ color }} />
          <span>{roadmap.timeline}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <IndianRupee size={10} style={{ color }} />
          <span>{roadmap.salary.entry} entry</span>
        </div>
      </div>

      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
        {roadmap.difficulty}
      </span>
    </motion.div>
  )
}

// ── Roadmap Detail View ────────────────────────────────────────
function RoadmapDetail({ roadmap, done, onBack, onComplete }) {
  const color = colorMap[roadmap.color]
  const diff  = difficultyStyle[roadmap.difficulty]

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ x: -3 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={15} /> Back to Roadmaps
      </motion.button>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{ background: `${color}10`, border: `1px solid ${color}30`, boxShadow: `0 0 40px ${color}10` }}
      >
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <span className="text-5xl">{roadmap.icon}</span>
            <div>
              <h1 className="text-2xl font-bold" style={{ color }}>{roadmap.title}</h1>
              <p className="text-gray-400 mt-1 text-sm">{roadmap.summary}</p>
            </div>
          </div>
          <span className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: diff.bg, color: diff.text, border: `1px solid ${diff.border}` }}>
            {roadmap.difficulty}
          </span>
        </div>

        {/* Salary row */}
        <div className="grid grid-cols-3 gap-3 mt-5 pt-4 border-t border-gray-700/30">
          {[
            { label: 'Entry Level', value: roadmap.salary.entry },
            { label: 'Mid Level',   value: roadmap.salary.mid   },
            { label: 'Senior',      value: roadmap.salary.senior },
          ].map(({ label, value }, i) => (
            <div key={i} className="text-center">
              <p className="font-bold text-sm" style={{ color }}>{value}</p>
              <p className="text-gray-600 text-xs mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mt-3">
          <Clock size={12} className="text-gray-500" />
          <span className="text-gray-500 text-xs">{roadmap.timeline}</span>
        </div>
      </motion.div>

      {/* Description */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl p-5"
        style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}
      >
        <h3 className="font-semibold mb-2 text-sm" style={{ color }}>About This Career in India</h3>
        <p className="text-gray-400 text-sm leading-relaxed">{roadmap.description}</p>
      </motion.div>

      {/* Hiring Companies */}
      <Section title="Who's Hiring in India" icon={Building2} color={color}>
        <div className="flex flex-wrap gap-2">
          {roadmap.hiringCompanies.map((company, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: `${color}10`, border: `1px solid ${color}25`, color }}>
              {company}
            </span>
          ))}
        </div>
      </Section>

      {/* College vs Working Professional Path */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-2xl p-4" style={{ background: 'rgba(17,24,39,0.8)', border: `1px solid ${color}20` }}>
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3" style={{ color }}>
            <GraduationCap size={14} /> College Student Path
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">{roadmap.collegeStudentPath}</p>
        </div>
        <div className="rounded-2xl p-4" style={{ background: 'rgba(17,24,39,0.8)', border: `1px solid ${color}20` }}>
          <h3 className="font-semibold text-sm flex items-center gap-2 mb-3" style={{ color }}>
            <Briefcase size={14} /> Working Professional Path
          </h3>
          <p className="text-gray-400 text-xs leading-relaxed">{roadmap.workingProfessionalPath}</p>
        </div>
      </div>

      {/* Learning Path */}
      <div>
        <h2 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
          <BookOpen size={18} style={{ color }} /> Step-by-Step Learning Path
        </h2>
        <div className="space-y-3">
          {roadmap.stages.map((stage, i) => (
            <StageStep key={i} stage={stage} index={i} total={roadmap.stages.length} domainColor={roadmap.color} />
          ))}
        </div>
      </div>

      {/* Certifications with India pricing */}
      <Section title="Certifications — With India Pricing" icon={Award} color={color}>
        <div className="space-y-3">
          {roadmap.certifications.map((cert, i) => {
            const cl = certLevelStyle[cert.level]
            return (
              <div key={i} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0" style={{ background: `${color}15`, color, border: `1px solid ${color}30` }}>
                  {cert.priority}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white text-sm font-semibold">{cert.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cl.bg, color: cl.text, border: `1px solid ${cl.border}` }}>
                      {cert.level}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(234,179,8,0.1)', color: '#eab308', border: '1px solid rgba(234,179,8,0.2)' }}>
                      {cert.costINR}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-0.5">{cert.note}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Mark Complete */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="flex justify-end pb-8">
        <motion.button
          onClick={onComplete}
          disabled={done}
          whileHover={!done ? { scale: 1.05 } : {}}
          whileTap={!done ? { scale: 0.97 } : {}}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm"
          style={done
            ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)', cursor: 'not-allowed' }
            : { background: `linear-gradient(135deg, ${color}, ${color}cc)`, color: '#000', boxShadow: `0 0 20px ${color}40` }
          }
        >
          <CheckCircle size={16} />
          {done ? 'Saved ✓' : 'Save This Roadmap'}
        </motion.button>
      </motion.div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
function Roadmaps() {
  const [selected, setSelected]   = useState(null)
  const [completed, setCompleted] = useState([])
  const [filter, setFilter]       = useState('All')
  const { saveCompletedModule }   = useUserProgress()

  const roadmap  = roadmapsData.find(r => r.id === selected)
  const filters  = ['All', 'Beginner Friendly', 'Intermediate', 'Intermediate to Advanced']

  const filtered = filter === 'All'
    ? roadmapsData
    : roadmapsData.filter(r => r.difficulty === filter)

  function markComplete(id) {
    if (!completed.includes(id)) {
      setCompleted([...completed, id])
      saveCompletedModule(`roadmaps-${id}`)
    }
    setSelected(null)
  }

  if (!selected) {
    return (
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.25)' }}>
              🗺️
            </div>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-white">Career Roadmaps</h1>
              <p className="text-gray-500 text-sm">India-specific paths with salary data, hiring companies, and certification costs</p>
            </div>
          </div>
        </motion.div>

        {/* India banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl p-4 flex items-center gap-3"
          style={{ background: 'rgba(255,153,0,0.06)', border: '1px solid rgba(255,153,0,0.2)' }}
        >
          <span className="text-2xl">🇮🇳</span>
          <div>
            <p className="text-orange-300 font-semibold text-sm">India-Specific Career Data</p>
            <p className="text-gray-500 text-xs">All salaries in INR · Certification costs updated · Indian hiring companies included</p>
          </div>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex-shrink-0"
              style={{
                background: filter === f ? 'rgba(6,182,212,0.1)' : 'transparent',
                border:     filter === f ? '1px solid rgba(6,182,212,0.3)' : '1px solid rgba(255,255,255,0.08)',
                color:      filter === f ? '#06b6d4' : '#6b7280',
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          {filtered.map(r => (
            <RoadmapCard
              key={r.id}
              roadmap={r}
              onClick={() => setSelected(r.id)}
              completed={completed.includes(r.id)}
            />
          ))}
        </motion.div>

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