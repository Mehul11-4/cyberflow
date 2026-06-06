// src/pages/Domains/Domains.jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft, CheckCircle, Wrench,
  Lightbulb, Briefcase, BookOpen,
  Award, ChevronDown, ChevronUp
} from 'lucide-react'
import { domainsData } from '../../data/domains'
import DomainCard from '../../components/ui/DomainCard'

const colorMap = {
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30'   },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30' },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30'   },
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30'  },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  red:    { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30' },
  pink:   { text: 'text-pink-400',   bg: 'bg-pink-500/10',   border: 'border-pink-500/30'   },
}

const stageColor = {
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30',  badge: 'bg-green-500/20 text-green-400'  },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', badge: 'bg-yellow-500/20 text-yellow-400' },
  red:    { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    badge: 'bg-red-500/20 text-red-400'      },
}

const certLevel = {
  'Beginner':     'bg-green-500/10 text-green-400 border-green-500/20',
  'Intermediate': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Advanced':     'bg-red-500/10 text-red-400 border-red-500/20',
}

// Collapsible section wrapper
function Section({ title, icon: Icon, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-800/50 transition-colors"
      >
        <h3 className={`font-semibold flex items-center gap-2 ${color}`}>
          <Icon size={16} /> {title}
        </h3>
        {open
          ? <ChevronUp size={16} className="text-gray-500" />
          : <ChevronDown size={16} className="text-gray-500" />
        }
      </button>
      {open && <div className="px-5 pb-5">{children}</div>}
    </motion.div>
  )
}

// ── Grid View ──────────────────────────────────────────────────
function GridView({ completed, onSelect }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">🌍 Cybersecurity Domains</h1>
        <p className="text-gray-400 mt-2">
          Explore each domain in depth — learn the path, required knowledge, and certifications.
        </p>
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-500 mb-1">
            <span>{completed.length} of {domainsData.length} domains explored</span>
            <span>{Math.round((completed.length / domainsData.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2">
            <motion.div
              className="bg-purple-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(completed.length / domainsData.length) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {domainsData.map((domain, i) => (
          <DomainCard
            key={domain.id}
            domain={domain}
            onClick={() => onSelect(domain.id)}
            completed={completed.includes(domain.id)}
            delay={i * 0.07}
          />
        ))}
      </div>
    </div>
  )
}

// ── Detail View ────────────────────────────────────────────────
function DetailView({ domain, done, onBack, onComplete }) {
  const c = colorMap[domain.color]

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        onClick={onBack}
        className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
      >
        <ArrowLeft size={16} /> Back to Domains
      </motion.button>

      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-6 ${c.bg} ${c.border}`}
      >
        <div className="flex items-center gap-4">
          <span className="text-5xl">{domain.icon}</span>
          <div>
            <h1 className={`text-2xl font-bold ${c.text}`}>{domain.title}</h1>
            <p className="text-gray-400 mt-1">{domain.summary}</p>
          </div>
        </div>
      </motion.div>

      {/* What is it */}
      <Section title={`What is ${domain.title}?`} icon={Lightbulb} color={c.text}>
        <p className="text-gray-400 text-sm leading-relaxed">{domain.what}</p>
      </Section>

      {/* Role */}
      <Section title="What Do Professionals Do?" icon={Briefcase} color={c.text}>
        <p className="text-gray-400 text-sm leading-relaxed">{domain.role}</p>
      </Section>

      {/* Learning Path */}
      <Section title="Learning Path" icon={BookOpen} color={c.text}>
        <div className="space-y-4">
          {domain.learningPath.map((stage, i) => {
            const sc = stageColor[stage.color]
            return (
              <div key={i} className={`rounded-xl border p-4 ${sc.bg} ${sc.border}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className={`font-bold text-sm ${sc.text}`}>
                    {i + 1}. {stage.stage}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sc.badge}`}>
                    {stage.duration}
                  </span>
                </div>
                <ol className="space-y-2">
                  {stage.steps.map((step, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                      <span className={`font-bold flex-shrink-0 ${sc.text}`}>{j + 1}.</span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            )
          })}
        </div>
      </Section>

      {/* Knowledge Requirements */}
      <Section title="Knowledge Requirements" icon={Lightbulb} color={c.text}>
        <div className="space-y-3">
          {domain.knowledge.map((item, i) => (
            <div key={i} className="flex gap-3">
              <div className={`w-1.5 rounded-full flex-shrink-0 mt-1 ${c.bg} border ${c.border}`} />
              <div>
                <p className={`text-sm font-semibold ${c.text}`}>{item.area}</p>
                <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{item.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Tools + Concepts side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Section title="Key Concepts" icon={Lightbulb} color={c.text} defaultOpen={true}>
          <ul className="space-y-2">
            {domain.concepts.map((concept, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-gray-400">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.bg} border ${c.border}`} />
                {concept}
              </li>
            ))}
          </ul>
        </Section>

        <Section title="Common Tools" icon={Wrench} color={c.text} defaultOpen={true}>
          <div className="flex flex-wrap gap-2">
            {domain.tools.map((tool, i) => (
              <span key={i} className={`text-xs px-2.5 py-1 rounded-full border ${c.bg} ${c.border} ${c.text}`}>
                {tool}
              </span>
            ))}
          </div>
        </Section>
      </div>

      {/* Certifications */}
      <Section title="Recommended Certifications" icon={Award} color={c.text}>
        <div className="space-y-3">
          {domain.certifications.map((cert, i) => (
            <div key={i} className="flex gap-3 items-start">
              <span className="text-lg flex-shrink-0">🏅</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-white text-sm font-semibold">{cert.name}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${certLevel[cert.level]}`}>
                    {cert.level}
                  </span>
                </div>
                <p className="text-gray-500 text-xs mt-1 leading-relaxed">{cert.relevance}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Career Paths */}
      <Section title="Career Paths" icon={Briefcase} color={c.text}>
        <div className="flex flex-wrap gap-2">
          {domain.careers.map((career, i) => (
            <span key={i} className="text-xs px-3 py-1.5 rounded-full bg-gray-800 border border-gray-700 text-gray-300">
              {career}
            </span>
          ))}
        </div>
      </Section>

      {/* Mark Complete */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end pb-8"
      >
        <button
          onClick={onComplete}
          disabled={done}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200
            ${done
              ? 'bg-green-500/10 text-green-400 border border-green-500/20 cursor-not-allowed'
              : 'bg-purple-500 hover:bg-purple-400 text-white hover:scale-105'
            }`}
        >
          <CheckCircle size={18} />
          {done ? 'Explored ✓' : 'Mark as Explored'}
        </button>
      </motion.div>

    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
function Domains() {
  const [selected, setSelected]   = useState(null)
  const [completed, setCompleted] = useState([])

  const domain = domainsData.find(d => d.id === selected)

  function markComplete(id) {
    if (!completed.includes(id)) setCompleted([...completed, id])
    setSelected(null)
  }

  if (!selected) {
    return <GridView completed={completed} onSelect={setSelected} />
  }

  return (
    <DetailView
      domain={domain}
      done={completed.includes(domain.id)}
      onBack={() => setSelected(null)}
      onComplete={() => markComplete(domain.id)}
    />
  )
}

export default Domains