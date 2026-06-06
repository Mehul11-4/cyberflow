// src/App.jsx
import { Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './pages/Dashboard/Dashboard'
import Fundamentals from './pages/Fundamentals/Fundamentals'
import Domains from './pages/Domains/Domains'
import Roadmaps from './pages/Roadmaps/Roadmaps'
import Labs from './pages/Labs/Labs'
import NetworkLab from './pages/Labs/NetworkLab'
import SQLLab from './pages/Labs/SQLLab'
import PhishingLab from './pages/Labs/PhishingLab'
import Quizzes from './pages/Quizzes/Quizzes'
import Login from './pages/Auth/Login'
import Signup from './pages/Auth/Signup'

function Protected({ children }) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login"  element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/"                element={<Protected><Dashboard /></Protected>} />
      <Route path="/fundamentals"    element={<Protected><Fundamentals /></Protected>} />
      <Route path="/domains"         element={<Protected><Domains /></Protected>} />
      <Route path="/roadmaps"        element={<Protected><Roadmaps /></Protected>} />
      <Route path="/labs"            element={<Protected><Labs /></Protected>} />
      <Route path="/labs/network"    element={<Protected><NetworkLab /></Protected>} />
      <Route path="/labs/sql"        element={<Protected><SQLLab /></Protected>} />
      <Route path="/labs/phishing"   element={<Protected><PhishingLab /></Protected>} />
      <Route path="/quizzes"         element={<Protected><Quizzes /></Protected>} />
    </Routes>
  )
}

export default App