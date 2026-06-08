// src/pages/Domains/Domains.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, CheckCircle, Wrench,
  Lightbulb, Briefcase, BookOpen,
  Award, ChevronDown, ChevronUp
} from 'lucide-react'
import { domainsData } from '../../data/domains'
import { useUserProgress } from '../../hooks/useUserProgress'

const colorMap = {
  cyan:   '#06b6d4', purple: '#8b5cf6', blue:   '#3b82f6',
  green:  '#10b981', yellow: '#f59e0b', red:    '#ef4444',
  orange: '#f97316', pink:   '#ec4899',
}

const stageColors = {
  green:  '#10b981',
  yellow: '#f59e0b',
  red:    '#ef4444',
}

const certLevel = {
  'Beginner':     { bg: 'rgba(16,185,129,0.1)',  text: '#10b981', border: 'rgba(16,185,129,0.2)'  },
  'Intermediate': { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b', border: 'rgba(245,158,11,0.2)'  },
  'Advanced':     { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444', border: 'rgba(239,68,68,0.2)'   },
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}
const cardAnim = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show:   { opacity: 1, y: 0,  scale: 1, transition: { duration: 0.35 } },
}

function Section({ title, icon: Icon, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-white/5 transition-colors"
      >
        <h3 className="font-semibold flex items-center gap-2 text-sm" style={{ color }}>
          <Icon size={15} /> {title}
        </h3>
        {open ? <ChevronUp size={15} className="text-gray-600" /> : <ChevronDown size={15} className="text-gray-600" />}
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

function DomainGrid({ completed, onSelect }) {
  const pct = Math.round((completed.length / domainsData.length) * 100)

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.25)' }}>
            🌍
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Cybersecurity Domains</h1>
            <p className="text-gray-500 text-sm">Explore each domain and find your specialization</p>
          </div>
        </div>

        <div className="mt-5 p-4 rounded-2xl" style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-400">{completed.length} of {domainsData.length} domains explored</span>
            <span className="font-bold" style={{ color: '#8b5cf6' }}>{pct}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899)' }}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6 }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {domainsData.map(domain => {
          const color = colorMap[domain.color]
          const done  = completed.includes(domain.id)
          return (
            <motion.div
              key={domain.id}
              variants={cardAnim}
              onClick={() => onSelect(domain.id)}
              whileHover={{ scale: 1.03, y: -3 }}
              whileTap={{ scale: 0.97 }}
              className="relative rounded-2xl p-5 cursor-pointer overflow-hidden"
              style={{
                background: `rgba(17,24,39,0.8)`,
                border:     `1px solid ${color}30`,
                boxShadow:  done ? 'none' : `0 4px 20px rgba(0,0,0,0.2)`,
              }}
            >
              {/* Top glow */}
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />

              {done && (
                <div className="absolute top-3 right-3">
                  <CheckCircle size={15} className="text-green-400" />
                </div>
              )}

              <div className="text-3xl mb-3">{domain.icon}</div>
              <h3 className="text-white font-semibold text-sm mb-1" style={{ color: done ? '#6b7280' : '#fff' }}>{domain.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-3">{domain.summary}</p>
              <div className="flex items-center gap-1 text-xs font-medium" style={{ color }}>
                Explore <ChevronDown size={11} className="rotate-[-90deg]" />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

function DomainDetail({ domain, done, onBack, onComplete }) {
  const color = colorMap[domain.color]

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        whileHover={{ x: -3 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
      >
        <ArrowLeft size={15} /> Back to Domains
      </motion.button>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-6"
        style={{ background: `${color}10`, border: `1px solid ${color}30`, boxShadow: `0 0 40px ${color}10` }}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">{domain.icon}</span>
          <div>
            <h1 className="text-2xl font-bold" style={{ color }}>{domain.title}</h1>
            <p className="text-gray-400 mt-1 text-sm">{domain.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* What is it */}
      <Section title={`What is ${domain.title}?`} icon={Lightbulb} color={color}>
        <p className="text-gray-400 text-sm leading-relaxed">{domain.what}</p>
      </Section>

      {/* Role */}
      <Section title="What Do Professionals Do?" icon={Briefcase} color={color}>
        <p className="text-gray-400 text-sm leading-relaxed">{domain.role}</p>
      </Section>

      {/* Learning Path */}
      <Section title="Learning Path" icon={BookOpen} color={color}>
        <div className="space-y-3">
          {domain.learningPath.map((stage, i) => {
            const sc = stageColors[stage.color]
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="rounded-xl p-4"
                style={{ background: `${sc}10`, border: `1px solid ${sc}25` }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-sm" style={{ color: sc }}>
                    {i + 1}. {stage.stage}
                  </span>
                  <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: `${sc}20`, color: sc }}>
                    {stage.duration}
                  </span>
                </div>
                <ol className="space-y-1.5">
                  {stage.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-xs text-gray-400">
                      <span className="font-bold flex-shrink-0" style={{ color: sc }}>{j + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </motion.div>
            )
          })}
        </div>
      </Section>

      {/* Knowledge */}
      <Section title="Knowledge Requirements" icon={Lightbulb} color={color}>
        <div className="space-y-3">
          {domain.knowledge.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className="w-1 rounded-full flex-shrink-0" style={{ background: color, minHeight: 16 }} />
              <div>
                <p className="text-sm font-semibold" style={{ color }}>{item.area}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Concepts + Tools */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section title="Key Concepts" icon={Lightbulb} color={color}>
          <ul className="space-y-2">
            {domain.concepts.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                {c}
              </li>
            ))}
          </ul>
        </Section>
        <Section title="Common Tools" icon={Wrench} color={color}>
          <div className="flex flex-wrap gap-2">
            {domain.tools.map((tool, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-full font-medium" style={{ background: `${color}15`, border: `1px solid ${color}30`, color }}>
                {tool}
              </span>
            ))}
          </div>
        </Section>
      </div>

      {/* Certifications */}
      <Section title="Recommended Certifications" icon={Award} color={color}>
        <div className="space-y-3">
          {domain.certifications.map((cert, i) => {
            const cl = certLevel[cert.level]
            return (
              <div key={i} className="flex gap-3 items-start">
                <span className="text-lg flex-shrink-0">🏅</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white text-sm font-semibold">{cert.name}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: cl.bg, color: cl.text, border: `1px solid ${cl.border}` }}>
                      {cert.level}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs mt-1 leading-relaxed">{cert.relevance}</p>
                </div>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Careers */}
      <Section title="Career Paths" icon={Briefcase} color={color}>
        <div className="flex flex-wrap gap-2">
          {domain.careers.map((c, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-full font-medium" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}>
              {c}
            </span>
          ))}
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
            : { background: `linear-gradient(135deg, ${color}, ${color}bb)`, color: '#000', boxShadow: `0 0 20px ${color}40` }
          }
        >
          <CheckCircle size={16} />
          {done ? 'Explored ✓' : 'Mark as Explored'}
        </motion.button>
      </motion.div>
    </div>
  )
}

function Domains() {
  const [selected, setSelected]   = useState(null)
  const [completed, setCompleted] = useState([])
  const { saveCompletedModule }   = useUserProgress()

  const domain = domainsData.find(d => d.id === selected)

  function markComplete(id) {
    if (!completed.includes(id)) {
      setCompleted([...completed, id])
      saveCompletedModule(`domains-${id}`)
    }
    setSelected(null)
  }

  if (!selected) return <DomainGrid completed={completed} onSelect={setSelected} />

  return (
    <DomainDetail
      domain={domain}
      done={completed.includes(domain.id)}
      onBack={() => setSelected(null)}
      onComplete={() => markComplete(domain.id)}
    />
  )
}

export default Domains