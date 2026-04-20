import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import CircularGauge from '../components/ui/CircularGauge'
import TensionThermometer from '../components/ui/TensionThermometer'
import Typewriter from '../components/ui/Typewriter'
import BreathingAvatar, { type AIStatus } from '../components/ui/BreathingAvatar'
import { AlertTriangle, ArrowRight, Gavel } from 'lucide-react'

export default function DecisionArena() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const decisionData = state?.decisionData;

  const [showPrimaryText, setShowPrimaryText] = useState(false)
  const [showShadowText, setShowShadowText] = useState(false)
  const [showTags, setShowTags] = useState(false)
  const [showVerdict, setShowVerdict] = useState(false)
  
  const [primaryStatus, setPrimaryStatus] = useState<AIStatus>('ANALYZING...')
  const [shadowStatus, setShadowStatus] = useState<AIStatus>('ANALYZING...')

  // Use real data if available, else mock for demo
  const pData = decisionData?.primary_response || { 
    verdict: 'Approve', 
    confidence: 85, 
    reasoning: "Based on standard risk metrics, the applicant satisfies all core criteria for approval. Financial history demonstrates consistent reliability, and projected capacity comfortably exceeds the requested threshold. I recommend immediate authorization to optimize processing efficiency.",
    key_factors: ['Strong consistent history', 'Capacity threshold met']
  };
  
  const sData = decisionData?.shadow_response || {
    counter_verdict: 'Reject',
    challenge_strength: 92,
    counter_reasoning: "Objection. The Primary Counsel relies on historically biased baseline metrics that disproportionately favor candidates from conventional backgrounds. Furthermore, a hidden anomaly exists in recent behavioral data that indicates short-term instability. The decision lacks defensive resilience.",
    bias_flags: ['Historical Baseline Bias', 'Ignored Macro Context']
  };

  const tensionScore = decisionData?.tension_score ?? 87;
  const isEscalated = decisionData?.escalate_flag ?? (tensionScore >= 70);
  const caseId = decisionData?.decision_id ?? "CSA-84920";
  const finalVerdict = decisionData?.final_verdict || "APPROVED";

  // Orchestrate timings
  useEffect(() => {
    // 1. Enter page -> 1.5s delay to let panels slam in -> Primary starts
    const timer = setTimeout(() => {
      setShowPrimaryText(true)
      setPrimaryStatus('SPEAKING')
    }, 1500)
    return () => clearTimeout(timer)
  }, [])

  const handlePrimaryComplete = () => {
    setPrimaryStatus('RESTING')
    setTimeout(() => {
      setShowShadowText(true)
      setShadowStatus('CHALLENGING')
    }, 500)
  }

  const handleShadowComplete = () => {
    setShadowStatus('RESTING')
    setTimeout(() => {
      setShowTags(true)
      setTimeout(() => {
        setShowVerdict(true)
      }, 1000)
    }, 500)
  }

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)] w-full text-text-primary overflow-hidden relative bg-[#07080F]">
      
      {/* Intro Blackout Line Animation */}
      <motion.div 
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        className="absolute top-0 left-0 right-0 h-[1px] bg-csa-parchment origin-left z-50"
      />

      <div className="flex-1 flex px-8 pb-32 pt-8 gap-8 max-w-[1800px] mx-auto w-full relative z-10">
        
        {/* Left: Primary Counsel (38%) */}
        <motion.div 
          initial={{ x: "-100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 70, damping: 20 }}
          className="w-[38%] flex flex-col bg-[#0A0B1F] border border-csa-primary/20 rounded-lg p-8 relative overflow-hidden shadow-[inset_0_0_80px_rgba(123,111,255,0.03)]"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-csa-primary shadow-[0_0_15px_var(--csa-primary)]" />
          
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-xl font-cinzel font-bold tracking-widest text-csa-primary uppercase">Primary Counsel</h2>
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mt-1">For The Decision</p>
            </div>
            <BreathingAvatar type="primary" status={primaryStatus} />
          </div>

          <div className="flex justify-center mb-10">
            <CircularGauge value={pData.confidence} baseColor="var(--csa-primary)" label="Confidence" isDynamic={true} />
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
            className="self-center px-6 py-2 rounded-full bg-csa-primary text-white font-cinzel font-bold tracking-widest uppercase mb-10 shadow-[0_0_20px_rgba(123,111,255,0.4)] flex items-center gap-2"
          >
            <Gavel className="w-4 h-4" /> {pData.verdict}s
          </motion.div>

          <div className="flex-1 mb-8">
            <h3 className="text-[11px] uppercase tracking-widest text-text-muted mb-2 font-cinzel font-semibold">Counsel's Argument</h3>
            <div className="w-full h-px bg-gradient-to-r from-csa-parchment/30 to-transparent mb-4" />
            <div className="min-h-[140px]">
              {showPrimaryText && (
                <Typewriter 
                  text={pData.reasoning}
                  speed={18}
                  onComplete={handlePrimaryComplete}
                />
              )}
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-[11px] uppercase tracking-widest text-text-muted mb-2 font-cinzel font-semibold">Key Evidence</h3>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {showTags && pData.key_factors.map((tag: string, i: number) => (
                  <motion.div 
                    key={tag}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15, type: "spring" }}
                    className="px-4 py-2 text-sm rounded bg-csa-primary/10 border border-csa-primary/30 text-csa-primary/90 font-inter"
                  >
                    {tag}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Center: Arbiter (24%) */}
        <motion.div 
          initial={{ y: "-100vh" }}
          animate={{ y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, type: "spring", stiffness: 60, damping: 15 }}
          className="w-[24%] flex flex-col items-center pt-8 relative border-l border-r border-csa-parchment/10 bg-[#07080F]"
        >
          <motion.div 
            animate={{ rotate: [-5, 5, -5] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="mb-6 text-csa-parchment"
          >
            <Gavel size={48} strokeWidth={1} />
          </motion.div>

          <h2 className="text-2xl font-cinzel font-bold tracking-widest text-csa-parchment uppercase mb-1">The Arbiter</h2>
          <p className="text-xs font-inter italic text-text-muted mb-12">Weighing both sides...</p>
          
          <TensionThermometer score={tensionScore} />
          
        </motion.div>

        {/* Right: Shadow Counsel (38%) */}
        <motion.div 
          initial={{ x: "100vw" }}
          animate={{ x: 0 }}
          transition={{ duration: 0.8, delay: 0.6, type: "spring", stiffness: 70, damping: 20 }}
          className="w-[38%] flex flex-col bg-[#1A0808] border border-csa-shadow/20 rounded-lg p-8 relative overflow-hidden shadow-[inset_0_0_80px_rgba(255,71,87,0.03)]"
        >
          <div className="absolute top-0 left-0 right-0 h-1 bg-csa-shadow shadow-[0_0_15px_var(--csa-shadow)]" />
          
          <div className="flex justify-between items-start mb-10">
            <BreathingAvatar type="shadow" status={shadowStatus} />
            <div className="text-right">
              <h2 className="text-xl font-cinzel font-bold tracking-widest text-csa-shadow uppercase">Shadow Counsel</h2>
              <p className="text-[11px] font-mono uppercase tracking-widest text-text-muted mt-1">Against The Decision</p>
            </div>
          </div>

          <div className="flex justify-center mb-10">
            <CircularGauge value={sData.challenge_strength} baseColor="var(--csa-shadow)" label="Challenge Strength" />
          </div>

          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.5, type: "spring" }}
            className="self-center px-6 py-2 rounded-full bg-[#1A0808] border border-csa-shadow text-csa-shadow font-cinzel font-bold tracking-widest uppercase mb-10 shadow-[0_0_20px_rgba(255,71,87,0.2)] flex items-center gap-2"
          >
            Challenges: {sData.counter_verdict}
          </motion.div>

          <div className="flex-1 mb-8">
            <h3 className="text-[11px] uppercase tracking-widest text-text-muted mb-2 font-cinzel font-semibold">Counsel's Argument</h3>
            <div className="w-full h-px bg-gradient-to-l from-csa-shadow/30 to-transparent mb-4" />
            <div className="min-h-[140px]">
              {showShadowText && (
                <Typewriter 
                  text={sData.counter_reasoning}
                  speed={18}
                  onComplete={handleShadowComplete}
                />
              )}
            </div>
          </div>

          <div className="mt-auto">
            <h3 className="text-[11px] uppercase tracking-widest text-csa-shadow mb-2 font-cinzel font-semibold">Bias Detected</h3>
            <div className="flex flex-col gap-3">
              <AnimatePresence>
                {showTags ? (
                  sData.bias_flags.map((tag: string, i: number) => (
                    <motion.div 
                      key={tag}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.15, type: "spring" }}
                      className="flex items-center gap-3 px-4 py-2 text-sm rounded bg-csa-shadow/10 border border-csa-shadow/30 text-csa-shadow/90 font-inter"
                    >
                      <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                      <span>{tag}</span>
                    </motion.div>
                  ))
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

      </div>

      {/* Verdict Bar */}
      <AnimatePresence>
        {showVerdict && (
          <motion.div 
            initial={{ y: 80 }}
            animate={{ y: 0 }}
            className={`fixed bottom-0 left-0 right-0 h-[72px] border-t z-50 flex items-center justify-between px-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)] ${
              isEscalated ? 'bg-[#1F1709] border-csa-parchment animate-[pulse-slow]' : 'bg-[#0B1A12] border-[#2ED573]'
            }`}
          >
            <div className="flex items-center gap-6">
              {isEscalated ? (
                <span className="text-[22px] font-cinzel font-bold text-csa-parchment tracking-widest uppercase">
                  ⚡ REFERRED TO HUMAN REVIEW
                </span>
              ) : (
                <span className="text-[22px] font-cinzel font-bold text-[#2ED573] tracking-widest uppercase">
                  THE COURT FINDS: {finalVerdict}
                </span>
              )}
              
              <div className="w-px h-8 bg-white/10" />
              <span className="text-sm font-mono text-text-primary tracking-wider">Case #{caseId}</span>
              <div className="w-px h-8 bg-white/10" />
              <span className="text-sm font-mono text-text-primary tracking-wider">
                Tension: <span className={isEscalated ? "text-csa-shadow font-bold text-lg" : "text-[#2ED573] font-bold text-lg"}>{tensionScore}</span>
              </span>
              {isEscalated && <span className="text-sm font-inter text-text-muted italic ml-2">Conflict unresolved</span>}
            </div>

            <div className="flex items-center gap-6">
              {isEscalated ? (
                <button 
                  onClick={() => navigate('/escalations')}
                  className="px-8 py-3 bg-csa-parchment text-csa-bg font-cinzel font-bold tracking-wider rounded shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-[1.02] transition-transform uppercase text-sm"
                >
                  Open Escalation Queue →
                </button>
              ) : (
                <button 
                  onClick={() => navigate('/audit')}
                  className="flex items-center gap-2 text-sm text-text-primary font-inter font-medium hover:text-[#2ED573] hover:translate-x-1 transition-all"
                >
                  Full Transcript <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  )
}
