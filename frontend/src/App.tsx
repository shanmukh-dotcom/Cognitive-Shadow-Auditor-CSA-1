import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Navbar from './components/layout/Navbar'
import PageTransition from './components/layout/PageTransition'
import Hero from './pages/Hero'
import Submission from './pages/Submission'
import DecisionArena from './pages/DecisionArena'
import AuditTrail from './pages/AuditTrail'
import EscalationQueue from './pages/EscalationQueue'

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Hero /></PageTransition>} />
        <Route path="/submit" element={<PageTransition><Submission /></PageTransition>} />
        <Route path="/arena" element={<PageTransition><DecisionArena /></PageTransition>} />
        <Route path="/audit" element={<PageTransition><AuditTrail /></PageTransition>} />
        <Route path="/escalations" element={<PageTransition><EscalationQueue /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col relative w-full h-full">
          <AnimatedRoutes />
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
