// src/pages/Labs/SQLLab.jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronRight, ChevronLeft, Shield,
  ShieldAlert, Eye, EyeOff, CheckCircle,
  AlertTriangle, Lock, Unlock, Code
} from 'lucide-react'
import { challenges } from '../../data/sqlLab'

const colorMap = {
  green:  { text: 'text-green-400',  bg: 'bg-green-500/10',  border: 'border-green-500/30'  },
  yellow: { text: 'text-yellow-400', bg: 'bg-yellow-500/10', border: 'border-yellow-500/30' },
  red:    { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30'    },
}

// Highlights injected parts of the query in red
function QueryVisualizer({ query, isAttack, isSecure }) {
  if (!query) return null

  const lines = query.split('\n')

  return (
    <div className={`rounded-xl border p-4 font-mono text-sm transition-all duration-500 ${
      isAttack
        ? 'bg-red-500/5 border-red-500/30'
        : isSecure
        ? 'bg-green-500/5 border-green-500/30'
        : 'bg-gray-800 border-gray-700'
    }`}>
      {lines.map((line, i) => (
        <div key={i} className="leading-7">
          {renderLine(line, isAttack)}
        </div>
      ))}
    </div>
  )
}

function renderLine(line, isAttack) {
  if (!isAttack) {
    return <span className="text-green-300">{line}</span>
  }

  // Keywords
  const keywords = ['SELECT', 'FROM', 'WHERE', 'AND', 'OR', 'UNION', 'LIKE', 'INSERT', 'UPDATE', 'DELETE', 'DROP']
  const injectionMarkers = ["'", '--', '#', '1=1', 'OR', 'UNION', 'information_schema']

  let hasInjection = injectionMarkers.some(m => line.includes(m))

  // Tokenize and colorize
  const parts = []
  let remaining = line
  let key = 0

  keywords.forEach(kw => {
    remaining = remaining // just for processing below
  })

  // Simple colorization by splitting on spaces
  const tokens = line.split(/(\s+)/)
  return (
    <span>
      {tokens.map((token, i) => {
        const isKeyword  = keywords.includes(token.trim().toUpperCase())
        const isInject   = hasInjection && injectionMarkers.some(m => token.includes(m))
        const isString   = token.includes("'")
        const isComment  = token.startsWith('--') || token.startsWith('#')

        if (isComment)  return <span key={i} className="text-red-400 font-bold bg-red-500/20 px-0.5 rounded">{token}</span>
        if (isInject && !isKeyword) return <span key={i} className="text-red-300 font-bold bg-red-500/10 px-0.5 rounded">{token}</span>
        if (isKeyword)  return <span key={i} className="text-cyan-400 font-semibold">{token}</span>
        if (isString)   return <span key={i} className={hasInjection ? 'text-red-300' : 'text-yellow-300'}>{token}</span>
        return <span key={i} className="text-gray-300">{token}</span>
      })}
    </span>
  )
}

// Fake database result table
function ResultTable({ rows, isAttack }) {
  if (!rows || rows.length === 0) return null
  return (
    <div className={`rounded-xl border overflow-hidden ${isAttack ? 'border-red-500/30' : 'border-green-500/30'}`}>
      <div className={`px-3 py-2 text-xs font-semibold flex items-center gap-2 ${isAttack ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400'}`}>
        {isAttack ? <ShieldAlert size={13} /> : <Shield size={13} />}
        {isAttack ? 'Database Response — Attack Succeeded' : 'Database Response — Login Failed (Secure)'}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs font-mono">
          <thead>
            <tr className="border-b border-gray-800">
              {Object.keys(rows[0]).map(col => (
                <th key={col} className="px-3 py-2 text-left text-gray-500 font-medium">{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i} className={`border-b border-gray-800/50 ${isAttack ? 'text-red-300' : 'text-green-300'}`}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="px-3 py-2">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const fakeUsers = [
  { id: 1, username: 'admin',    password: 'sup3r$ecret', role: 'administrator' },
  { id: 2, username: 'john_doe', password: 'john1234',    role: 'user'          },
  { id: 3, username: 'alice',    password: 'alice@99',    role: 'user'          },
]

const fakeProducts = [
  { name: "' UNION SELECT username, password FROM users--", price: '—' },
  ...fakeUsers.map(u => ({ name: u.username, price: u.password })),
]

function SQLLab() {
  const [challengeIndex, setChallengeIndex] = useState(0)
  const [username, setUsername]             = useState('')
  const [password, setPassword]             = useState('')
  const [showPass, setShowPass]             = useState(false)
  const [submitted, setSubmitted]           = useState(false)
  const [isAttack, setIsAttack]             = useState(false)
  const [showSecure, setShowSecure]         = useState(false)
  const [showPrevention, setShowPrevention] = useState(false)

  const challenge = challenges[challengeIndex]
  const c = colorMap[challenge.color]

  const liveQuery = challenge.vulnerableQuery(
    username || 'username',
    password || 'password'
  )

  const isTypingAttack =
    challenge.successPayloads.some(p =>
      username.toLowerCase().includes(p.toLowerCase().slice(0, 6)) ||
      password.toLowerCase().includes(p.toLowerCase().slice(0, 6))
    )

  function handleSubmit() {
    const success = challenge.successPayloads.some(payload =>
      username.toLowerCase().replace(/\s+/g, ' ').trim() ===
      payload.toLowerCase().replace(/\s+/g, ' ').trim() ||
      username.toLowerCase().includes(payload.toLowerCase().split("'")[1]?.slice(0, 8) ?? '~~~')
    ) || challenge.successPayloads.some(p =>
      username.includes(p.slice(0, Math.floor(p.length * 0.6)))
    )
    setIsAttack(success)
    setSubmitted(true)
    setShowSecure(false)
  }

  function resetChallenge() {
    setUsername('')
    setPassword('')
    setSubmitted(false)
    setIsAttack(false)
    setShowSecure(false)
    setShowPrevention(false)
  }

  function switchChallenge(index) {
    resetChallenge()
    setChallengeIndex(index)
  }

  const dbResult = submitted && isAttack
    ? challenge.id === 3
      ? fakeProducts
      : fakeUsers
    : null

  return (
    <div className="max-w-6xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">💉 SQL Injection Simulator</h1>
        <p className="text-gray-400 mt-1">
          A safe educational simulation. Learn how SQL injection works — and how to stop it.
        </p>
      </motion.div>

      {/* Challenge selector */}
      <div className="flex gap-3 flex-wrap">
        {challenges.map((ch, i) => {
          const cc = colorMap[ch.color]
          return (
            <button
              key={ch.id}
              onClick={() => switchChallenge(i)}
              className={`px-4 py-2 rounded-xl border text-sm font-semibold transition-all duration-200 ${
                challengeIndex === i
                  ? `${cc.bg} ${cc.border} ${cc.text}`
                  : 'bg-gray-900 border-gray-800 text-gray-500 hover:border-gray-600'
              }`}
            >
              {ch.level}: {ch.title}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* ── Left: Challenge + Form ──────────────────────────── */}
        <div className="space-y-4">

          {/* Challenge info */}
          <motion.div
            key={challenge.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border p-5 ${c.bg} ${c.border}`}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text} border ${c.border}`}>
                {challenge.level}
              </span>
              <h2 className={`font-bold ${c.text}`}>{challenge.title}</h2>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">{challenge.description}</p>
            <p className="text-gray-600 text-xs mt-2 italic">Context: {challenge.context}</p>
          </motion.div>

          {/* Login / Search Form */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              {submitted && isAttack
                ? <Unlock size={16} className="text-red-400" />
                : submitted
                ? <Lock size={16} className="text-green-400" />
                : <Lock size={16} className="text-gray-500" />
              }
              <h3 className="text-white font-semibold text-sm">
                {challenge.id === 3 ? 'Product Search' : 'Login Form'} — Vulnerable Target
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-gray-500 text-xs mb-1 block">
                  {challenge.id === 3 ? 'Search Products' : 'Username'}
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => { setUsername(e.target.value); setSubmitted(false); setIsAttack(false) }}
                  placeholder={challenge.id === 3 ? "Search for a product..." : "Enter username..."}
                  className={`w-full bg-gray-800 border rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none transition-all font-mono ${
                    isTypingAttack
                      ? 'border-red-500/50 focus:border-red-500'
                      : 'border-gray-700 focus:border-cyan-500'
                  }`}
                />
                {isTypingAttack && (
                  <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                    <AlertTriangle size={11} /> Injection payload detected in input
                  </p>
                )}
              </div>

              {challenge.id !== 3 && (
                <div>
                  <label className="text-gray-500 text-xs mb-1 block">Password</label>
                  <div className="relative">
                    <input
                      type={showPass ? 'text' : 'password'}
                      value={password}
                      onChange={e => { setPassword(e.target.value); setSubmitted(false); setIsAttack(false) }}
                      placeholder="Enter password..."
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-600 outline-none focus:border-cyan-500 transition-all font-mono pr-10"
                    />
                    <button
                      onClick={() => setShowPass(!showPass)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                    >
                      {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-2">
                <button
                  onClick={handleSubmit}
                  className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-cyan-500 hover:bg-cyan-400 text-gray-950 transition-all"
                >
                  {challenge.id === 3 ? 'Search' : 'Login'}
                </button>
                <button
                  onClick={resetChallenge}
                  className="px-4 py-2.5 rounded-xl text-sm text-gray-500 bg-gray-800 hover:bg-gray-700 border border-gray-700 transition-all"
                >
                  Reset
                </button>
              </div>
            </div>

            {/* Hint */}
            <p className="text-gray-700 text-xs mt-3 italic">
              💡 Hint: {challenge.hint}
            </p>
          </div>

          {/* Result Banner */}
          <AnimatePresence>
            {submitted && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className={`rounded-xl border p-4 ${
                  isAttack
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-green-500/10 border-green-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {isAttack
                    ? <><ShieldAlert size={16} className="text-red-400" /><p className="text-red-400 font-bold text-sm">Attack Succeeded! 🚨</p></>
                    : <><CheckCircle size={16} className="text-green-400" /><p className="text-green-400 font-bold text-sm">Login Failed — No Injection Detected</p></>
                  }
                </div>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {isAttack
                    ? challenge.explanation
                    : 'The input did not trigger an injection. Try the hint above to see the attack in action.'
                  }
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* DB Result Table */}
          <AnimatePresence>
            {dbResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ResultTable rows={dbResult} isAttack={true} />
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* ── Right: Query Visualizer + Prevention ───────────── */}
        <div className="space-y-4">

          {/* Live Query */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <h3 className="text-white font-semibold text-sm mb-1 flex items-center gap-2">
              <Code size={14} className="text-cyan-400" />
              Live Query Visualizer
            </h3>
            <p className="text-gray-500 text-xs mb-3">
              Watch the SQL query being built as you type. Injected code highlighted in red.
            </p>

            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 mb-1">
                  {isTypingAttack || (submitted && isAttack)
                    ? '⚠️ Vulnerable Query — Injection Active'
                    : '📝 Vulnerable Query — Live Preview'
                  }
                </p>
                <QueryVisualizer
                  query={challenge.vulnerableQuery(username || 'username', password || 'password')}
                  isAttack={isTypingAttack || (submitted && isAttack)}
                  isSecure={false}
                />
              </div>

              {/* Toggle secure query */}
              <button
                onClick={() => setShowSecure(!showSecure)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-gray-800 border border-gray-700 text-xs text-gray-400 hover:text-white hover:border-green-500/30 transition-all"
              >
                <span className="flex items-center gap-2">
                  <Shield size={12} className="text-green-400" />
                  {showSecure ? 'Hide' : 'Show'} Secure Version (Parameterized Query)
                </span>
                <ChevronRight size={12} className={`transition-transform ${showSecure ? 'rotate-90' : ''}`} />
              </button>

              <AnimatePresence>
                {showSecure && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    <p className="text-xs text-green-600">✅ Secure Query — Parameterized</p>
                    <QueryVisualizer
                      query={challenge.secureQuery}
                      isAttack={false}
                      isSecure={true}
                    />
                    <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-3">
                      <p className="text-green-400 text-xs leading-relaxed">
                        {challenge.secureExplanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Prevention Guide */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <button
              onClick={() => setShowPrevention(!showPrevention)}
              className="w-full flex items-center justify-between"
            >
              <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                <Shield size={14} className="text-green-400" />
                How to Prevent This Attack
              </h3>
              <ChevronRight
                size={14}
                className={`text-gray-500 transition-transform ${showPrevention ? 'rotate-90' : ''}`}
              />
            </button>

            <AnimatePresence>
              {showPrevention && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 space-y-4"
                >
                  <ul className="space-y-2">
                    {challenge.prevention.map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="flex items-start gap-2 text-sm text-gray-400"
                      >
                        <CheckCircle size={14} className="text-green-400 flex-shrink-0 mt-0.5" />
                        {item}
                      </motion.li>
                    ))}
                  </ul>

                  {/* Code example */}
                  <div className="space-y-2">
                    <p className="text-xs text-gray-600">Example — Node.js with parameterized query:</p>
                    <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 font-mono text-xs leading-relaxed">
                      <p className="text-gray-500">{'// ❌ Vulnerable'}</p>
                      <p className="text-red-400">{'`SELECT * FROM users WHERE username = \'${username}\'`'}</p>
                      <br />
                      <p className="text-gray-500">{'// ✅ Secure (parameterized)'}</p>
                      <p className="text-green-400">{'db.query('}</p>
                      <p className="text-cyan-300 ml-4">{'  "SELECT * FROM users WHERE username = ?",'}</p>
                      <p className="text-yellow-300 ml-4">{'  [username]'}</p>
                      <p className="text-green-400">{')'}</p>
                    </div>
                  </div>

                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* OWASP reference */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <p className="text-gray-500 text-xs leading-relaxed">
              <span className="text-cyan-400 font-semibold">OWASP A03:2021 — Injection</span> is the
              3rd most critical web application security risk. SQL Injection has been in the OWASP
              Top 10 since its creation and remains one of the most exploited vulnerabilities in real-world attacks.
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default SQLLab