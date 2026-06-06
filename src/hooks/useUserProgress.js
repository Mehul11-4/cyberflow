// src/hooks/useUserProgress.js
import { useState, useEffect } from 'react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { useAuth } from '../context/AuthContext'

export function useUserProgress() {
  const { user }                        = useAuth()
  const [progress, setProgress]         = useState(null)
  const [loading, setLoading]           = useState(true)

  // Load user progress from Firestore
  useEffect(() => {
    if (!user?.uid) { setLoading(false); return }
    async function load() {
      try {
        const docRef  = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) setProgress(docSnap.data())
      } catch (err) {
        console.error('Error loading progress:', err)
      }
      setLoading(false)
    }
    load()
  }, [user])

  // Save quiz score to Firestore
  async function saveQuizScore(quizId, quizTitle, score) {
    if (!user?.uid) return
    try {
      const docRef     = doc(db, 'users', user.uid)
      const quizScores = { ...(progress?.quizScores || {}), [quizId]: { score, title: quizTitle, completedAt: new Date().toISOString() } }
      await updateDoc(docRef, { quizScores })
      setProgress(prev => ({ ...prev, quizScores }))
    } catch (err) {
      console.error('Error saving quiz score:', err)
    }
  }

  // Save completed module to Firestore
  async function saveCompletedModule(moduleId) {
    if (!user?.uid) return
    try {
      const docRef         = doc(db, 'users', user.uid)
      const completed      = progress?.completedModules || []
      if (completed.includes(moduleId)) return
      const completedModules = [...completed, moduleId]
      await updateDoc(docRef, { completedModules })
      setProgress(prev => ({ ...prev, completedModules }))
    } catch (err) {
      console.error('Error saving module:', err)
    }
  }

  return { progress, loading, saveQuizScore, saveCompletedModule }
}