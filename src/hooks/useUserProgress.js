// src/hooks/useUserProgress.js
import { useState, useEffect, useCallback } from 'react'
import { doc, updateDoc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function useUserProgress() {
  const { user }                = useAuth()
  const [progress, setProgress] = useState(null)
  const [loading, setLoading]   = useState(true)

  // ── Load progress from Firestore ─────────────────────────────
  const loadProgress = useCallback(async () => {
    if (!user?.uid) { setLoading(false); return }
    try {
      const docRef  = doc(db, 'users', user.uid)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        setProgress(docSnap.data())
      } else {
        // Create document if it doesn't exist
        const defaultData = {
          displayName:      user.displayName || 'Student',
          email:            user.email,
          createdAt:        new Date().toISOString(),
          quizScores:       {},
          completedModules: [],
          streak:           1,
          lastActiveDate:   new Date().toDateString(),
          totalXP:          0,
        }
        await setDoc(docRef, defaultData)
        setProgress(defaultData)
      }
    } catch (err) {
      console.error('Error loading progress:', err)
    }
    setLoading(false)
  }, [user])

  useEffect(() => { loadProgress() }, [loadProgress])

  // ── Save quiz score ──────────────────────────────────────────
  const saveQuizScore = useCallback(async (quizId, quizTitle, score) => {
    if (!user?.uid) return
    try {
      const docRef     = doc(db, 'users', user.uid)
      const current    = progress?.quizScores || {}
      const prevBest   = current[quizId]?.score ?? 0
      const newBest    = Math.max(score, prevBest)
      const quizScores = {
        ...current,
        [quizId]: {
          score:       newBest,
          lastScore:   score,
          title:       quizTitle,
          completedAt: new Date().toISOString(),
          attempts:    (current[quizId]?.attempts ?? 0) + 1,
        },
      }

      // Calculate XP
      const xpGain   = Math.round(score / 10) * 5
      const totalXP  = (progress?.totalXP || 0) + xpGain

      await updateDoc(docRef, { quizScores, totalXP })

      // Update local state immediately — this fixes the dashboard not updating
      setProgress(prev => ({ ...prev, quizScores, totalXP }))
    } catch (err) {
      console.error('Error saving quiz score:', err)
    }
  }, [user, progress])

  // ── Save completed module ────────────────────────────────────
  const saveCompletedModule = useCallback(async (moduleId) => {
    if (!user?.uid) return
    try {
      const docRef   = doc(db, 'users', user.uid)
      const existing = progress?.completedModules || []
      if (existing.includes(moduleId)) return // already completed

      const completedModules = [...existing, moduleId]
      const xpGain           = 50
      const totalXP          = (progress?.totalXP || 0) + xpGain

      await updateDoc(docRef, { completedModules, totalXP })

      // Update local state immediately
      setProgress(prev => ({ ...prev, completedModules, totalXP }))
    } catch (err) {
      console.error('Error saving module:', err)
    }
  }, [user, progress])

  // ── Update streak ────────────────────────────────────────────
  const updateStreak = useCallback(async () => {
    if (!user?.uid) return
    try {
      const docRef        = doc(db, 'users', user.uid)
      const today         = new Date().toDateString()
      const lastActive    = progress?.lastActiveDate
      const currentStreak = progress?.streak ?? 1

      if (lastActive === today) return // already updated today

      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const wasYesterday = lastActive === yesterday.toDateString()

      // If active yesterday — increase streak. Otherwise reset to 1
      const newStreak = wasYesterday ? currentStreak + 1 : 1

      await updateDoc(docRef, {
        streak:         newStreak,
        lastActiveDate: today,
      })

      setProgress(prev => ({ ...prev, streak: newStreak, lastActiveDate: today }))
    } catch (err) {
      console.error('Error updating streak:', err)
    }
  }, [user, progress])

  return {
    progress,
    loading,
    saveQuizScore,
    saveCompletedModule,
    updateStreak,
    reloadProgress: loadProgress,
  }
}