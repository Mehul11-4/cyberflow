// src/pages/Labs/PhishingLab.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Mail, AlertTriangle, CheckCircle,
  ShieldAlert, Shield, ArrowLeft,
  ChevronRight, Lock, User, KeyRound, Eye
} from 'lucide-react'
import { scenarios } from '../../data/phishingLab'

const colorMap = {
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30'  },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  red:    { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
}

// ── Fake Login Page ────────────────────────────────────────────
function FakeLoginPage({ scenario, onBack }) {
  const [clicked, setClicked] = useState(false)
  const [user, setUser]       = useState('')
  const [pass, setPass]       = useState('')

  if (clicked) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="space-y-4"
      >
        <div className="flex flex-col items-center justify-center text-center p-6 space-y-4">
          <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <ShieldAlert size={28} className="text-red-400" />
          </div>
          <h2 className="text-white font-bold text-xl">Credentials Stolen! 🚨</h2>
          <p className="text-gray-400 text-sm max-w-sm leading-relaxed">
            You just submitted your credentials to an attacker's server.
          </p>
          <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-left w-full max-w-sm">
            <p className="text-red-400 text-xs font-semibold mb-2">What the attacker received:</p>
            <p className="font-mono text-xs text-gray-400">username: <span className="text-red-300">{user || 'your_username'}</span></p>
            <p className="font-mono text-xs text-gray-400">password: <span className="text-red-300">{pass || 'your_password'}</span></p>
            <p className="font-mono text-xs text-gray-400 mt-1">sent_to: <span className="text-red-300 break-all">{scenario.fakeLoginUrl}</span></p>
          </div>
          <p className="text-gray-500 text-xs max-w-sm">
            After stealing credentials, attackers redirect you to the real website so you never realize you were phished.
          </p>
        </div>
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={14} /> Back to Analysis
        </button>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-3 flex items-start gap-2">
        <AlertTriangle size={14} className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-yellow-400 text-xs leading-relaxed">
          <strong>Educational only.</strong> No real data is transmitted.
        </p>
      </div>

      {/* Fake browser */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
        <div className="flex items-center gap-2 px-3 py-2 border-b border-gray-700 bg-gray-900">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/40" />
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/40" />
          </div>
          <div className="flex-1 flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 overflow-hidden">
            <AlertTriangle size={10} className="text-red-400 flex-shrink-0" />
            <span className="text-red-400 text-xs font-mono truncate text-ellipsis">
              http://{scenario.fakeLoginUrl}
            </span>
          </div>
        </div>

        <div className="p-5 space-y-4" style={{ backgroundColor: '#f8f9fa' }}>
          <div className="text-center">
            <div className="w-10 h-10 rounded-lg mx-auto mb-2 flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: scenario.fakeLoginColor }}>
              {scenario.fakeLoginBrand?.charAt(0)}
            </div>
            <h3 className="text-gray-800 font-bold">{scenario.fakeLoginBrand}</h3>
            <p className="text-gray-500 text-sm">Sign in to your account</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-gray-600 text-xs font-medium block mb-1">Email or Username</label>
              <div className="relative">
                <User size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={user} onChange={e => setUser(e.target.value)} placeholder="Enter your email" className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 bg-white" />
              </div>
            </div>
            <div>
              <label className="text-gray-600 text-xs font-medium block mb-1">Password</label>
              <div className="relative">
                <KeyRound size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="password" value={pass} onChange={e => setPass(e.target.value)} placeholder="Enter your password" className="w-full border border-gray-300 rounded-lg pl-8 pr-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 bg-white" />
              </div>
            </div>
            <button onClick={() => setClicked(true)} className="w-full py-2.5 rounded-lg text-sm font-semibold text-white" style={{ backgroundColor: scenario.fakeLoginColor }}>
              Sign In
            </button>
          </div>
        </div>
      </div>

      <button onClick={onBack} className="flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors">
        <ArrowLeft size={14} /> Back to Email
      </button>
    </motion.div>
  )
}

// ── Email Viewer ───────────────────────────────────────────────
function EmailViewer({ scenario, onViewLogin }) {
  const [foundFlags, setFoundFlags]       = useState([])
  const [activeFlag, setActiveFlag]       = useState(null)
  const [showChecklist, setShowChecklist] = useState(false)
  const [checkedItems, setCheckedItems]   = useState([])

  const c     = colorMap[scenario.color]
  const score = Math.round((foundFlags.length / scenario.indicators.length) * 100)

  function clickBodyPart(part) {
    if (!part.suspicious) return
    setActiveFlag(activeFlag?.id === part.id ? null : part)
    if (!foundFlags.includes(part.id)) setFoundFlags(prev => [...prev, part.id])
  }

  function toggleCheck(id) {
    setCheckedItems(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  return (
    <div className="space-y-4">

      {/* Score */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-white font-semibold">Red Flags Found</span>
          <span className={`text-sm font-bold ${c.text}`}>{foundFlags.length} / {scenario.indicators.length}</span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <motion.div className="h-2 rounded-full transition-all duration-500" style={{ width: `${score}%`, backgroundColor: score === 100 ? '#10b981' : score > 50 ? '#f59e0b' : '#ef4444' }} />
        </div>
        {score === 100 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-xs mt-2 flex items-center gap-1">
            <CheckCircle size={12} /> Excellent! You found all red flags.
          </motion.p>
        )}
      </div>

      {/* Email */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">

        {/* Email headers */}
        <div className="border-b border-gray-800 p-4 space-y-1.5">
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs w-14 flex-shrink-0 pt-0.5">From:</span>
            <span className="text-red-400 text-xs font-mono font-semibold break-all">{scenario.email.fromDisplay}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs w-14 flex-shrink-0">To:</span>
            <span className="text-gray-400 text-xs font-mono break-all">{scenario.email.to}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs w-14 flex-shrink-0">Subject:</span>
            <span className="text-yellow-300 text-xs font-semibold">{scenario.email.subject}</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-gray-600 text-xs w-14 flex-shrink-0">Date:</span>
            <span className="text-gray-500 text-xs font-mono">{scenario.email.date}</span>
          </div>
        </div>

        {/* Email body */}
        <div className="p-4 space-y-2">
          <p className="text-yellow-400 text-xs flex items-center gap-1 mb-3">
            <Eye size={11} /> Tap on suspicious parts to identify red flags
          </p>

          {scenario.email.body.map(part => (
            <div key={part.id}>
              <motion.div
                onClick={() => clickBodyPart(part)}
                whileTap={part.suspicious ? { scale: 0.98 } : {}}
                className={`text-sm leading-relaxed rounded-lg px-3 py-2 transition-all duration-200 ${
                  part.suspicious
                    ? activeFlag?.id === part.id
                      ? 'bg-red-500/20 border border-red-500/40 text-red-300 cursor-pointer'
                      : foundFlags.includes(part.id)
                      ? 'bg-red-500/10 border border-red-500/20 text-red-400 cursor-pointer'
                      : 'bg-yellow-500/5 border border-yellow-500/10 text-gray-300 cursor-pointer'
                    : 'text-gray-400'
                }`}
              >
                {part.suspicious && (
                  <AlertTriangle size={11} className={`inline mr-1.5 ${foundFlags.includes(part.id) ? 'text-red-400' : 'text-yellow-600'}`} />
                )}
                {part.text}
                {part.suspicious && foundFlags.includes(part.id) && (
                  <span className="ml-2 text-xs text-red-400 font-semibold">⚑ {part.flag}</span>
                )}
              </motion.div>

              <AnimatePresence>
                {activeFlag?.id === part.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-red-500/10 border border-red-500/20 rounded-b-lg px-4 py-3 -mt-1"
                  >
                    <p className="text-red-400 text-xs font-semibold mb-1">🚩 {part.flag}</p>
                    <p className="text-gray-400 text-xs leading-relaxed">{part.explanation}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}

          {scenario.fakeLoginUrl && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <button onClick={onViewLogin} className="flex items-center gap-2 text-xs text-blue-400 underline hover:text-blue-300 transition-colors">
                <Lock size={11} /> See what happens if you click the phishing link →
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Checklist */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <button onClick={() => setShowChecklist(!showChecklist)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-800/50 transition-colors">
          <span className="text-white font-semibold text-sm flex items-center gap-2">
            <Shield size={14} className="text-cyan-400" />
            Red Flag Checklist ({checkedItems.length}/{scenario.indicators.length})
          </span>
          <ChevronRight size={14} className={`text-gray-500 transition-transform ${showChecklist ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showChecklist && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="px-4 pb-4 space-y-3">
              {scenario.indicators.map(indicator => (
                <button key={indicator.id} onClick={() => toggleCheck(indicator.id)} className="w-full flex items-start gap-3 text-left group">
                  <div className={`w-4 h-4 rounded border flex-shrink-0 mt-0.5 flex items-center justify-center transition-all ${checkedItems.includes(indicator.id) ? 'bg-green-500 border-green-500' : 'border-gray-600'}`}>
                    {checkedItems.includes(indicator.id) && <CheckCircle size={10} className="text-white" />}
                  </div>
                  <div>
                    <p className={`text-xs font-medium ${checkedItems.includes(indicator.id) ? 'text-green-400 line-through' : 'text-gray-300'}`}>{indicator.label}</p>
                    <p className="text-gray-600 text-xs mt-0.5 leading-relaxed">{indicator.explanation}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
function PhishingLab() {
  const [scenarioIndex, setScenarioIndex] = useState(0)
  const [viewingLogin, setViewingLogin]   = useState(false)

  const scenario = scenarios[scenarioIndex]
  const c        = colorMap[scenario.color]

  function switchScenario(index) {
    setScenarioIndex(index)
    setViewingLogin(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-bold text-white">🎣 Phishing Simulator</h1>
        <p className="text-gray-400 mt-1 text-sm">Tap suspicious elements to identify red flags.</p>
      </motion.div>

      {/* Scenario selector — scrollable on mobile */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {scenarios.map((s, i) => {
          const sc = colorMap[s.color]
          return (
            <button
              key={s.id}
              onClick={() => switchScenario(i)}
              className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all flex-shrink-0 ${scenarioIndex === i ? `${sc.bg} ${sc.border} ${sc.text}` : 'bg-gray-900 border-gray-800 text-gray-500'}`}
            >
              {s.level}
            </button>
          )
        })}
      </div>

      {/* Scenario header */}
      <motion.div
        key={scenario.id}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-4 flex items-center gap-3 ${c.bg} ${c.border}`}
      >
        <Mail size={22} className={c.text} />
        <div>
          <h2 className={`font-bold ${c.text}`}>{scenario.title}</h2>
          <p className="text-gray-400 text-xs mt-0.5">{scenario.summary}</p>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {viewingLogin ? (
          <motion.div key="login" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <FakeLoginPage scenario={scenario} onBack={() => setViewingLogin(false)} />
          </motion.div>
        ) : (
          <motion.div key={`email-${scenarioIndex}`} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}>
            <EmailViewer scenario={scenario} onViewLogin={() => setViewingLogin(true)} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default PhishingLab