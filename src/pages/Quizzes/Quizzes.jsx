// src/pages/Quizzes/Quizzes.jsx
import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CheckCircle, XCircle, Clock,
  Trophy, ArrowRight, RotateCcw,
  ChevronRight, Target, Zap
} from 'lucide-react'
import { quizzes } from '../../data/quizData'

const colorMap = {
  cyan:   { text: 'text-cyan-400',   bg: 'bg-cyan-500/10',   border: 'border-cyan-500/30',   solid: 'bg-cyan-500'   },
  purple: { text: 'text-purple-400', bg: 'bg-purple-500/10', border: 'border-purple-500/30', solid: 'bg-purple-500' },
  blue:   { text: 'text-blue-400',   bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   solid: 'bg-blue-500'   },
  red:    { text: 'text-red-400',    bg: 'bg-red-500/10',    border: 'border-red-500/30',    solid: 'bg-red-500'    },
  orange: { text: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/30', solid: 'bg-orange-500' },
}

function getGrade(score) {
  if (score === 100) return { label: 'Perfect!',     color: 'text-cyan-400',   emoji: '🏆' }
  if (score >= 80)  return { label: 'Excellent',     color: 'text-green-400',  emoji: '⭐' }
  if (score >= 60)  return { label: 'Good',          color: 'text-yellow-400', emoji: '👍' }
  if (score >= 40)  return { label: 'Keep Studying', color: 'text-orange-400', emoji: '📚' }
  return                   { label: 'Try Again',     color: 'text-red-400',    emoji: '💪' }
}

// ── Timer Bar ──────────────────────────────────────────────────
function TimerBar({ duration, onExpire, running }) {
  const [remaining, setRemaining] = useState(duration)
  const intervalRef = useRef(null)

  useEffect(() => {
    setRemaining(duration)
  }, [duration])

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

  const pct = (remaining / duration) * 100
  const color = pct > 60 ? '#10b981' : pct > 30 ? '#f59e0b' : '#ef4444'

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-gray-500 flex items-center gap-1">
          <Clock size={11} /> Time remaining
        </span>
        <span style={{ color }} className="font-bold font-mono">{remaining}s</span>
      </div>
      <div className="w-full bg-gray-800 rounded-full h-1.5">
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
  const c       = colorMap[quiz.color]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto space-y-6"
    >
      {/* Score hero */}
      <div className={`rounded-2xl border p-8 text-center ${c.bg} ${c.border}`}>
        <div className="text-5xl mb-3">{grade.emoji}</div>
        <h2 className={`text-4xl font-bold mb-1 ${grade.color}`}>{score}%</h2>
        <p className={`text-lg font-semibold ${grade.color}`}>{grade.label}</p>
        <p className="text-gray-400 text-sm mt-2">
          {correct} correct out of {quiz.questions.length} questions
        </p>

        <div className="flex justify-center gap-6 mt-6">
          <div className="text-center">
            <p className="text-green-400 font-bold text-2xl">{correct}</p>
            <p className="text-gray-500 text-xs">Correct</p>
          </div>
          <div className="w-px bg-gray-800" />
          <div className="text-center">
            <p className="text-red-400 font-bold text-2xl">{quiz.questions.length - correct}</p>
            <p className="text-gray-500 text-xs">Incorrect</p>
          </div>
          <div className="w-px bg-gray-800" />
          <div className="text-center">
            <p className={`font-bold text-2xl ${c.text}`}>{quiz.questions.length}</p>
            <p className="text-gray-500 text-xs">Total</p>
          </div>
        </div>
      </div>

      {/* Answer review */}
      <div className="space-y-3">
        <h3 className="text-white font-semibold">Answer Review</h3>
        {quiz.questions.map((q, i) => {
          const wasCorrect = answers[i] === q.correct
          const wasSkipped = answers[i] === -1
          return (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`rounded-xl border p-4 ${
                wasCorrect
                  ? 'bg-green-500/5 border-green-500/20'
                  : 'bg-red-500/5 border-red-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {wasCorrect
                  ? <CheckCircle size={16} className="text-green-400 flex-shrink-0 mt-0.5" />
                  : <XCircle    size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
                }
                <div className="flex-1">
                  <p className="text-white text-sm font-medium mb-2">{q.question}</p>

                  {!wasCorrect && !wasSkipped && (
                    <p className="text-red-400 text-xs mb-1">
                      Your answer: {q.options[answers[i]]}
                    </p>
                  )}
                  {wasSkipped && (
                    <p className="text-orange-400 text-xs mb-1">Skipped (time ran out)</p>
                  )}
                  <p className="text-green-400 text-xs mb-2">
                    ✓ Correct: {q.options[q.correct]}
                  </p>
                  <p className="text-gray-500 text-xs leading-relaxed">{q.explanation}</p>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-3 pb-8">
        <button
          onClick={onRestart}
          className={`flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm transition-all ${c.solid} text-white hover:opacity-90`}
        >
          <RotateCcw size={15} /> Retake Quiz
        </button>
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm bg-gray-800 border border-gray-700 text-gray-300 hover:text-white transition-all"
        >
          All Quizzes
        </button>
      </div>
    </motion.div>
  )
}

// ── Active Quiz ────────────────────────────────────────────────
function ActiveQuiz({ quiz, onFinish }) {
  const [qIndex, setQIndex]       = useState(0)
  const [answers, setAnswers]     = useState([])
  const [selected, setSelected]   = useState(null)
  const [revealed, setRevealed]   = useState(false)
  const [timerKey, setTimerKey]   = useState(0)

  const question = quiz.questions[qIndex]
  const c        = colorMap[quiz.color]
  const progress = Math.round((qIndex / quiz.questions.length) * 100)

  function handleSelect(index) {
    if (revealed) return
    setSelected(index)
    setRevealed(true)
  }

  function handleExpire() {
    if (!revealed) {
      setSelected(null)
      setRevealed(true)
    }
  }

  function handleNext() {
    const ans = revealed ? (selected ?? -1) : -1
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
        ? `${c.bg} ${c.border} ${c.text}`
        : 'bg-gray-800 border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white'
    }
    if (i === question.correct)
      return 'bg-green-500/10 border-green-500/40 text-green-400'
    if (i === selected && i !== question.correct)
      return 'bg-red-500/10 border-red-500/40 text-red-400'
    return 'bg-gray-800/50 border-gray-800 text-gray-600'
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Quiz header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-white font-bold text-lg">{quiz.title}</h2>
          <p className="text-gray-500 text-sm">
            Question {qIndex + 1} of {quiz.questions.length}
          </p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-semibold ${c.bg} ${c.text} border ${c.border}`}>
          {quiz.icon} {quiz.title}
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="w-full bg-gray-800 rounded-full h-1.5 mb-1">
          <motion.div
            className={`h-1.5 rounded-full ${c.solid}`}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600">
          <span>{qIndex} done</span>
          <span>{quiz.questions.length - qIndex} remaining</span>
        </div>
      </div>

      {/* Timer */}
      <TimerBar
        key={timerKey}
        duration={quiz.timePerQuestion}
        onExpire={handleExpire}
        running={!revealed}
      />

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
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
            <p className="text-white font-semibold text-base leading-relaxed">
              {question.question}
            </p>
          </div>

          {/* Options */}
          <div className="space-y-2.5">
            {question.options.map((option, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => handleSelect(i)}
                disabled={revealed}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 flex items-center gap-3 ${optionStyle(i)}`}
              >
                <span className={`w-6 h-6 rounded-full border flex-shrink-0 flex items-center justify-center text-xs font-bold ${optionStyle(i)}`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="flex-1">{option}</span>
                {revealed && i === question.correct && (
                  <CheckCircle size={15} className="text-green-400 flex-shrink-0" />
                )}
                {revealed && i === selected && i !== question.correct && (
                  <XCircle size={15} className="text-red-400 flex-shrink-0" />
                )}
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
                className={`rounded-xl border p-4 ${
                  selected === question.correct
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-gray-800 border-gray-700'
                }`}
              >
                <p className={`text-xs font-semibold mb-1 ${
                  selected === question.correct ? 'text-green-400' : 'text-yellow-400'
                }`}>
                  {selected === question.correct
                    ? '✓ Correct!'
                    : selected === null
                    ? '⏰ Time ran out'
                    : '✗ Not quite'
                  }
                </p>
                <p className="text-gray-400 text-xs leading-relaxed">
                  {question.explanation}
                </p>
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
              <button
                onClick={handleNext}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all hover:scale-105 ${c.solid} text-white`}
              >
                {qIndex + 1 >= quiz.questions.length ? (
                  <><Trophy size={15} /> See Results</>
                ) : (
                  <>Next Question <ArrowRight size={15} /></>
                )}
              </button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ── Quiz Selection Grid ────────────────────────────────────────
function QuizGrid({ scores, onStart }) {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-white">🧠 Quizzes</h1>
        <p className="text-gray-400 mt-2">
          Test your knowledge across all modules. Each quiz tracks your best score.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {quizzes.map((quiz, i) => {
          const c     = colorMap[quiz.color]
          const score = scores[quiz.id]
          const grade = score !== undefined ? getGrade(score) : null

          return (
            <motion.div
              key={quiz.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-gray-900 border rounded-2xl p-5 cursor-pointer hover:scale-[1.02] transition-all duration-200 group ${c.border} ${c.bg}`}
              onClick={() => onStart(quiz)}
            >
              <div className="flex items-start justify-between mb-3">
                <span className="text-3xl">{quiz.icon}</span>
                {grade && (
                  <span className={`text-sm font-bold ${grade.color}`}>
                    {grade.emoji} {score}%
                  </span>
                )}
              </div>

              <h3 className={`font-bold mb-1 ${c.text}`}>{quiz.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed mb-4">
                {quiz.description}
              </p>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <Target size={11} /> {quiz.questions.length} questions
                </span>
                <span className="flex items-center gap-1">
                  <Clock size={11} /> {quiz.timePerQuestion}s per question
                </span>
              </div>

              {score !== undefined && (
                <div className="mt-3">
                  <div className="w-full bg-gray-800 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${score}%`,
                        backgroundColor:
                          score >= 80 ? '#10b981' :
                          score >= 60 ? '#f59e0b' : '#ef4444'
                      }}
                    />
                  </div>
                </div>
              )}

              <div className={`mt-3 flex items-center gap-1 text-xs font-semibold ${c.text} opacity-0 group-hover:opacity-100 transition-opacity`}>
                {score !== undefined ? 'Retake Quiz' : 'Start Quiz'} <ChevronRight size={12} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Overall stats */}
      {Object.keys(scores).length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gray-900 border border-gray-800 rounded-2xl p-5"
        >
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Zap size={15} className="text-yellow-400" /> Your Performance
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-white font-bold text-2xl">{Object.keys(scores).length}</p>
              <p className="text-gray-500 text-xs">Quizzes Taken</p>
            </div>
            <div>
              <p className="text-green-400 font-bold text-2xl">
                {Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length)}%
              </p>
              <p className="text-gray-500 text-xs">Average Score</p>
            </div>
            <div>
              <p className="text-cyan-400 font-bold text-2xl">
                {Math.max(...Object.values(scores))}%
              </p>
              <p className="text-gray-500 text-xs">Best Score</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

// ── Main Component ─────────────────────────────────────────────
function Quizzes() {
  const [activeQuiz, setActiveQuiz] = useState(null)
  const [answers, setAnswers]       = useState(null)
  const [scores, setScores]         = useState({})

  function startQuiz(quiz) {
    setActiveQuiz(quiz)
    setAnswers(null)
  }

  function finishQuiz(ans) {
    const correct = ans.filter((a, i) => a === activeQuiz.questions[i].correct).length
    const score   = Math.round((correct / activeQuiz.questions.length) * 100)
    setAnswers(ans)
    setScores(prev => ({
      ...prev,
      [activeQuiz.id]: Math.max(score, prev[activeQuiz.id] ?? 0),
    }))
  }

  function restartQuiz() {
    setAnswers(null)
  }

  function backToGrid() {
    setActiveQuiz(null)
    setAnswers(null)
  }

  if (!activeQuiz) {
    return <QuizGrid scores={scores} onStart={startQuiz} />
  }

  if (answers) {
    return (
      <ScoreScreen
        quiz={activeQuiz}
        answers={answers}
        onRestart={restartQuiz}
        onBack={backToGrid}
      />
    )
  }

  return (
    <ActiveQuiz
      quiz={activeQuiz}
      onFinish={finishQuiz}
    />
  )
}

export default Quizzes