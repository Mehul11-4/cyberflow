// src/pages/Quizzes/Quizzes.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, XCircle, Clock, Trophy,
  ArrowRight, RotateCcw, ChevronRight,
  Target, Zap, Star, TrendingUp
} from 'lucide-react'
import { quizzes } from '../../data/quizData'
import { useUserProgress } from '../../hooks/useUserProgress'

const colorMap = {
  cyan:   '#06b6d4', purple: '#8b5cf6',
  blue:   '#3b82f6', red:    '#ef4444',
  orange: '#f97316',
}

function getGrade(score) {
  if (score === 100) return { label: 'Perfect!',     color: '#06b6d4', emoji: '🏆', stars: 3 }
  if (score >= 80)  return { label: 'Excellent',     color: '#10b981', emoji: '⭐', stars: 3 }
  if (score >= 60)  return { label: 'Good',          color: '#f59e0b', emoji: '👍', stars: 2 }
  if (score >= 40)  return { label: 'Keep Going',    color: '#f97316', emoji: '📚', stars: 1 }
  return                   { label: 'Try Again',     color: '#ef4444', emoji: '💪', stars: 0 }
}

// ── Timer Bar ──────────────────────────────────────────────────
function TimerBar({ duration, onExpire, running }) {
  const [remaining, setRemaining] = useState(duration)
  const intervalRef               = useRef(null)

  useEffect(() => { setRemaining(duration) }, [duration])

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return }
    intervalRef.current = setInterval(() => {
      setRemaining(prev => {
        if (prev <= 1) { clearInterval(intervalRef.current); onExpire(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, duration])

  const pct   = (remaining / duration) * 100
  const color = pct > 60 ? '#10b981' : pct > 30 ? '#f59e0b' : '#ef4444'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 flex items-center gap-1"><Clock size={11} /> Time</span>
        <span className="font-bold font-mono" style={{ color }}>{remaining}s</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
        <motion.div
          className="h-1.5 rounded-full transition-all duration-1000"
          style={{ width: `${pct}%`, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

// ── Score Screen ───────────────────────────────────────────────
function ScoreScreen({ quiz, answers, onRestart, onBack }) {
  const correct = answers.filter((a, i) => a === quiz.questions[i].correct).length
  const score   = Math.round((correct / quiz.questions.length) * 100)
  const grade   = getGrade(score)
  const color   = colorMap[quiz.color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto space-y-5"
    >
      {/* Score hero */}
      <div
        className="rounded-2xl p-8 text-center relative overflow-hidden"
        style={{ background: `${grade.color}10`, border: `1px solid ${grade.color}30` }}
      >
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${grade.color}50, transparent)` }} />

        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="text-6xl mb-4"
        >
          {grade.emoji}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-5xl font-bold mb-1" style={{ color: grade.color }}>{score}%</h2>
          <p className="text-xl font-semibold text-white mb-1">{grade.label}</p>
          <p className="text-gray-400 text-sm">{correct} correct out of {quiz.questions.length} questions</p>
        </motion.div>

        {/* Stars */}
        <div className="flex justify-center gap-2 mt-4">
          {[0,1,2].map(i => (
            <motion.div
              key={i}
              initial={{ scale: 0, rotate: -30 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.3 + i * 0.1, type: 'spring', stiffness: 300 }}
            >
              <Star
                size={24}
                fill={i < grade.stars ? grade.color : 'transparent'}
                style={{ color: grade.color, opacity: i < grade.stars ? 1 : 0.3 }}
              />
            </motion.div>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex justify-center gap-8 mt-6 pt-4 border-t border-gray-700/30">
          <div className="text-center">
            <p className="text-green-400 font-bold text-2xl">{correct}</p>
            <p className="text-gray-500 text-xs">Correct</p>
          </div>
          <div className="text-center">
            <p className="text-red-400 font-bold text-2xl">{quiz.questions.length - correct}</p>
            <p className="text-gray-500 text-xs">Incorrect</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-2xl" style={{ color }}>{quiz.questions.length}</p>
            <p className="text-gray-500 text-xs">Total</p>
          </div>
        </div>
      </div>

      {/* Answer review */}
      <div className="space-y-3">
        <h3 className="text-white font-bold flex items-center gap-2">
          <TrendingUp size={16} className="text-cyan-400" /> Answer Review
        </h3>
        {quiz.questions.map((q, i) => {
          const wasCorrect = answers[i] === q.correct
          const wasSkipped = answers[i] === -1
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl p-4 overflow-hidden relative"
              style={{
                background: wasCorrect ? 'rgba(16,185,129,0.05)' : 'rgba(239,68,68,0.05)',
                border:     wasCorrect ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(239,68,68,0.15)',
              }}
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl" style={{ background: wasCorrect ? '#10b981' : '#ef4444' }} />
              <div className="flex items-start gap-3 pl-2">
                {wasCorrect
                  ? <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  : <XCircle    size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-2">{q.question}</p>
                  {!wasCorrect && !wasSkipped && (
                    <p className="text-red-400 text-xs mb-1">Your answer: {q.options[answers[i]]}</p>
                  )}
                  {wasSkipped && <p className="text-orange-400 text-xs mb-1">⏰ Time ran out</p>}
                  <p className="text-green-400 text-xs mb-2">✓ {q.options[q.correct]}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-8">
        <motion.button
          onClick={onRestart}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-white transition-all"
          style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)` }}
        >
          <RotateCcw size={14} /> Retake Quiz
        </motion.button>
        <motion.button
          onClick={onBack}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm text-gray-300 transition-all"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          All Quizzes
        </motion.button>
      </div>
    </motion.div>
  )
}

// ── Active Quiz ────────────────────────────────────────────────
function ActiveQuiz({ quiz, onFinish }) {
  const [qIndex, setQIndex]     = useState(0)
  const [answers, setAnswers]   = useState([])
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [timerKey, setTimerKey] = useState(0)

  const question = quiz.questions[qIndex]
  const color    = colorMap[quiz.color]
  const progress = Math.round((qIndex / quiz.questions.length) * 100)

  function handleSelect(index) {
    if (revealed) return
    setSelected(index)
    setRevealed(true)
  }

  function handleExpire() {
    if (!revealed) { setSelected(null); setRevealed(true) }
  }

  function handleNext() {
    const ans        = revealed ? (selected ?? -1) : -1
    const newAnswers = [...answers, ans]
    setAnswers(newAnswers)
    if (qIndex + 1 >= quiz.questions.length) {
      onFinish(newAnswers)
    } else {
      setQIndex(qIndex + 1)
      setSelected(null)
      setRevealed(false)
      setTimerKey(k => k + 1)
    }
  }

  function optionStyle(i) {
    if (!revealed) {
      return selected === i
        ? { background: `${color}15`, border: `1px solid ${color}50`, color: '#fff' }
        : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#d1d5db' }
    }
    if (i === question.correct)
      return { background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.4)', color: '#10b981' }
    if (i === selected && i !== question.correct)
      return { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444' }
    return { background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', color: '#6b7280' }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold">{quiz.title}</h2>
          <p className="text-gray-500 text-sm">Question {qIndex + 1} of {quiz.questions.length}</p>
        </div>
        <div className="text-2xl">{quiz.icon}</div>
      </div>

      {/* Progress */}
      <div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
          <motion.div
            className="h-1.5 rounded-full"
            animate={{ width: `${progress}%` }}
            style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>{qIndex} done</span>
          <span>{quiz.questions.length - qIndex} left</span>
        </div>
      </div>

      {/* Timer */}
      <TimerBar key={timerKey} duration={quiz.timePerQuestion} onExpire={handleExpire} running={!revealed} />

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={qIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Question card */}
          <div
            className="rounded-2xl p-5 relative overflow-hidden"
            style={{ background: 'rgba(17,24,39,0.8)', border: '1px solid rgba(255,255,255,0.07)' }}
          >
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}30, transparent)` }} />
            <p className="text-white font-semibold leading-relaxed">{question.question}</p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                whileHover={!revealed ? { scale: 1.01 } : {}}
                whileTap={!revealed ? { scale: 0.99 } : {}}
                className="w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-3"
                style={optionStyle(i)}
              >
                <span
                  className="w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={optionStyle(i)}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {revealed && i === question.correct && <CheckCircle size={15} className="text-green-400 flex-shrink-0" />}
                {revealed && i === selected && i !== question.correct && <XCircle size={15} className="text-red-400 flex-shrink-0" />}
              </motion.button>
            ))}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="rounded-2xl p-4 relative overflow-hidden"
                style={{
                  background: selected === question.correct ? 'rgba(16,185,129,0.05)' : 'rgba(17,24,39,0.8)',
                  border:     selected === question.correct ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)',
                }}
              >
                <p className="text-xs font-semibold mb-1" style={{ color: selected === question.correct ? '#10b981' : '#f59e0b' }}>
                  {selected === question.correct ? '✓ Correct!' : selected === null ? '⏰ Time ran out' : '✗ Not quite — here\'s why:'}
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">{question.explanation}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Next button */}
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-end"
            >
              <motion.button
                onClick={handleNext}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm text-gray-950"
                style={{ background: `linear-gradient(135deg, ${color}, ${color}cc)`, boxShadow: `0 0 20px ${color}40` }}
              >
                {qIndex + 1 >= quiz.questions.length
                  ? <><Trophy size={14} /> See Results</>
                  : <>Next Question <ArrowRight size={14} /></>
                }
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Quiz Grid ──────────────────────────────────────────────────
function QuizGrid({ scores, onStart }) {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08 } },
  }
  const cardAnim = {
    hidden: { opacity: 0, y: 20 },
    show:   { opacity: 1, y: 0, transition: { duration: 0.35 } },
  }

  const totalQuizzes = quizzes.length
  const taken        = Object.keys(scores).length
  const avgScore     = taken > 0 ? Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / taken) : 0

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.25)' }}>
            🧠
          </div>
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-white">Quizzes</h1>
            <p className="text-gray-500 text-sm">Test your knowledge — every quiz tracks your best score</p>
          </div>
        </div>

        {/* Stats bar */}
        {taken > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-4 grid grid-cols-3 gap-3"
          >
            {[
              { label: 'Quizzes Taken',  value: `${taken}/${totalQuizzes}`, color: '#ec4899', icon: Target   },
              { label: 'Average Score',  value: `${avgScore}%`,             color: '#10b981', icon: TrendingUp },
              { label: 'Best Score',     value: taken > 0 ? `${Math.max(...Object.values(scores))}%` : '—', color: '#f59e0b', icon: Star },
            ].map(({ label, value, color, icon: Icon }, i) => (
              <div key={i} className="rounded-xl p-3 text-center" style={{ background: `${color}10`, border: `1px solid ${color}20` }}>
                <Icon size={14} className="mx-auto mb-1" style={{ color }} />
                <p className="font-bold" style={{ color }}>{value}</p>
                <p className="text-gray-600 text-xs">{label}</p>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Quiz cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {quizzes.map((quiz, i) => {
          const color = colorMap[quiz.color]
          const score = scores[quiz.id]
          const grade = score !== undefined ? getGrade(score) : null

          return (
            <motion.div
              key={quiz.id}
              variants={cardAnim}
              onClick={() => onStart(quiz)}
              whileHover={{ scale: 1.02, y: -3 }}
              whileTap={{ scale: 0.98 }}
              className="relative rounded-2xl p-5 cursor-pointer overflow-hidden"
              style={{ background: 'rgba(17,24,39,0.8)', border: `1px solid ${color}25`, boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
            >
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />

              <div className="flex items-start justify-between mb-4">
                <span className="text-3xl">{quiz.icon}</span>
                {grade && (
                  <div className="text-right">
                    <p className="text-lg font-bold" style={{ color: grade.color }}>{score}%</p>
                    <div className="flex gap-0.5 justify-end mt-0.5">
                      {[0,1,2].map(j => (
                        <Star key={j} size={10} fill={j < grade.stars ? grade.color : 'transparent'} style={{ color: grade.color, opacity: j < grade.stars ? 1 : 0.3 }} />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <h3 className="font-bold mb-1" style={{ color }}>{quiz.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">{quiz.description}</p>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1"><Target size={10} /> {quiz.questions.length} questions</span>
                <span className="flex items-center gap-1"><Clock size={10} /> {quiz.timePerQuestion}s each</span>
              </div>

              {score !== undefined && (
                <div className="mt-3 w-full bg-gray-800 rounded-full h-1 overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${score}%`, background: `linear-gradient(90deg, ${color}, ${color}80)` }} />
                </div>
              )}

              <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                {score !== undefined ? 'Retake' : 'Start Quiz'} <ChevronRight size={12} />
              </div>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
function Quizzes() {
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [answers, setAnswers]       = useState(null)
  const [scores, setScores]         = useState({})
  const { progress, saveQuizScore } = useUserProgress()

  useEffect(() => {
    if (progress?.quizScores) {
      const loaded = {}
      Object.entries(progress.quizScores).forEach(([id, data]) => {
        loaded[Number(id)] = data.score
      })
      setScores(loaded)
    }
  }, [progress])

  function startQuiz(quiz) { setActiveQuiz(quiz); setAnswers(null) }

  async function finishQuiz(ans) {
    const correct = ans.filter((a, i) => a === activeQuiz.questions[i].correct).length
    const score   = Math.round((correct / activeQuiz.questions.length) * 100)
    setAnswers(ans)
    setScores(prev => ({ ...prev, [activeQuiz.id]: Math.max(score, prev[activeQuiz.id] ?? 0) }))
    await saveQuizScore(activeQuiz.id, activeQuiz.title, score)
  }

  function restartQuiz() { setAnswers(null) }
  function backToGrid()   { setActiveQuiz(null); setAnswers(null) }

  if (!activeQuiz) return <QuizGrid scores={scores} onStart={startQuiz} />
  if (answers)     return <ScoreScreen quiz={activeQuiz} answers={answers} onRestart={restartQuiz} onBack={backToGrid} />
  return <ActiveQuiz quiz={activeQuiz} onFinish={finishQuiz} />
}

export default Quizzes