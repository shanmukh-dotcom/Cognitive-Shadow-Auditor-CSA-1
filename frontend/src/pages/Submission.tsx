import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import Typewriter from '../components/ui/Typewriter'
import { api } from '../services/api'
import { Scale, Users, HeartPulse, FileText, Check } from 'lucide-react'

const DOMAINS = [
  { id: 'Loan', label: 'Loan Approval', icon: Scale },
  { id: 'Hiring', label: 'Hiring Decision', icon: Users },
  { id: 'Medical', label: 'Medical Triage', icon: HeartPulse },
  { id: 'Legal', label: 'Legal Review', icon: FileText }
] as const

type Domain = typeof DOMAINS[number]['id']

export default function Submission() {
  const navigate = useNavigate()
  const [domain, setDomain] = useState<Domain>('Loan')
  const [formData, setFormData] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loadingStep, setLoadingStep] = useState(-1)
  const [caseId, setCaseId] = useState('')

  useEffect(() => {
    setCaseId(`CSA-${Math.floor(Math.random() * 90000) + 10000}`)
  }, [])

  const steps = [
    { text: "> Briefing Primary Counsel...", color: "var(--csa-primary)" },
    { text: "> Primary Counsel has reviewed the case.", color: "var(--csa-primary)", check: true },
    { text: "> Summoning Shadow Counsel...", color: "var(--csa-shadow)" },
    { text: "> Shadow Counsel has prepared opposition.", color: "var(--csa-shadow)", check: true },
    { text: "> The Arbiter is weighing the evidence...", color: "var(--csa-parchment)" },
    { text: "> The court is ready. Entering the chamber...", color: "var(--text-primary)" },
  ]

  const handleInputChange = (field: string, value: string) => {
    // Basic comma formatting for numbers
    if (field === 'income' || field === 'loan') {
      const num = value.replace(/,/g, '')
      if (!isNaN(Number(num)) && num !== '') {
        value = Number(num).toLocaleString('en-US')
      }
    }
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleTypewriterComplete = () => {
    if (loadingStep < steps.length - 1) {
      // If we're at the step where we wait for API, we only progress if we have the result
      if (loadingStep === 1 && !isSubmitting) {
        // Wait here
        return;
      }
      setTimeout(() => setLoadingStep(prev => prev + 1), 600)
    } else {
      setTimeout(() => {
        navigate('/arena', { state: { decisionData: isSubmitting } })
      }, 1000)
    }
  }

  // Effect to trigger next steps when API returns
  useEffect(() => {
    if (isSubmitting && typeof isSubmitting === 'object' && loadingStep === 2) {
       // We have data, continue
       // (Actually handleTypewriterComplete handles the flow, 
       // we just need to make sure the flow doesn't stall)
    }
  }, [isSubmitting, loadingStep])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setLoadingStep(0)
    
    try {
      const data = await api.decide(domain, formData, formData.context || '');
      setIsSubmitting(data as any) // Store result in isSubmitting state
    } catch (err) {
      console.error(err)
      alert("The Court has failed to convene. Check your connection to the High AI Council.")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-64px)] w-full text-text-primary overflow-hidden relative">
      
      {/* Title Area */}
      <div className="w-full max-w-7xl mx-auto px-6 pt-12 pb-8 text-center z-10 relative">
        <h1 className="text-4xl md:text-5xl font-cinzel font-bold mb-4 tracking-wide text-csa-parchment">File Your Case</h1>
        <p className="text-text-muted text-lg font-inter">Choose your domain. State your case. Watch the court convene.</p>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-6 pb-20 flex flex-col lg:flex-row gap-12 relative z-10">
        
        {/* Left Column: Form Area */}
        <div className="flex-1 flex flex-col">
          {/* Large Domain Selector Tabs */}
          <div className="flex gap-6 mb-12 border-b border-csa-parchment/10 pb-4 overflow-x-auto hide-scrollbar">
            {DOMAINS.map(d => {
              const isActive = domain === d.id
              const Icon = d.icon
              return (
                <button
                  key={d.id}
                  onClick={() => { setDomain(d.id); setFormData({}); }}
                  className="relative pb-4 flex flex-col items-center gap-3 min-w-[120px] transition-all duration-300"
                >
                  <motion.div animate={{ scale: isActive ? 1.05 : 1 }} transition={{ type: "spring" }}>
                    <Icon className={clsx("w-8 h-8", isActive ? "text-csa-parchment" : "text-text-muted")} />
                  </motion.div>
                  <span className={clsx("font-cinzel text-sm tracking-widest uppercase font-semibold whitespace-nowrap", isActive ? "text-text-primary" : "text-text-muted")}>
                    {d.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="active-domain-indicator"
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-csa-parchment"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </button>
              )
            })}
          </div>

          {/* Staggered Form */}
          <div className="bg-[#0A0C13] border border-csa-parchment/10 rounded-lg p-8 md:p-10 relative overflow-hidden shadow-[inset_0_0_40px_rgba(201,168,76,0.02)]">
            <form onSubmit={handleSubmit} className="flex flex-col gap-8 w-full max-w-2xl relative z-10">
              <AnimatePresence mode="popLayout">
                {domain === 'Loan' && (
                  <motion.div key="loan" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ staggerChildren: 0.1 }} className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-sm uppercase tracking-wider text-text-muted mb-3 font-cinzel font-semibold text-csa-parchment/80">Applicant Name</label>
                      <input type="text" onChange={e => handleInputChange('name', e.target.value)} required className="w-full bg-[rgba(255,255,255,0.02)] border border-csa-parchment/20 rounded p-4 outline-none focus:border-csa-parchment transition-colors text-lg text-white font-inter" placeholder="E.g., Jonathan Reed" />
                    </motion.div>
                    
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <div className="flex justify-between items-end mb-3">
                        <label className="block text-sm uppercase tracking-wider font-cinzel font-semibold text-csa-parchment/80">Credit Score</label>
                        <span className="text-xl font-mono text-csa-parchment font-bold">{formData.credit || '650'}</span>
                      </div>
                      <div className="relative pt-4 pb-2">
                        <input type="range" min="300" max="850" onChange={e => handleInputChange('credit', e.target.value)} defaultValue="650" className="w-full h-2 bg-gradient-to-r from-csa-shadow via-csa-parchment to-csa-arbiter rounded-full appearance-none outline-none slider-thumb-gold" />
                      </div>
                    </motion.div>

                    <div className="grid grid-cols-2 gap-6">
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <label className="block text-sm uppercase tracking-wider mb-3 font-cinzel font-semibold text-csa-parchment/80">Monthly Income</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted font-mono">₹</span>
                          <input type="text" onChange={e => handleInputChange('income', e.target.value)} value={formData.income || ''} required className="w-full bg-[rgba(255,255,255,0.02)] border border-csa-parchment/20 rounded py-4 pr-4 pl-8 outline-none focus:border-csa-parchment transition-colors text-lg text-white font-mono" placeholder="5,000" />
                        </div>
                      </motion.div>
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <label className="block text-sm uppercase tracking-wider mb-3 font-cinzel font-semibold text-csa-parchment/80">Employment Years</label>
                        <div className="flex items-center gap-4 bg-[rgba(255,255,255,0.02)] border border-csa-parchment/20 rounded p-2">
                          <button type="button" onClick={() => setFormData(p => ({...p, years: String(Math.max(0, parseInt(p.years||'3')-1))}))} className="w-10 h-10 rounded text-csa-parchment hover:bg-white/5 font-bold text-xl flex items-center justify-center">-</button>
                          <input type="number" readOnly value={formData.years || '3'} className="flex-1 bg-transparent text-center outline-none text-xl font-mono text-white" />
                          <button type="button" onClick={() => setFormData(p => ({...p, years: String(parseInt(p.years||'3')+1)}))} className="w-10 h-10 rounded text-csa-parchment hover:bg-white/5 font-bold text-xl flex items-center justify-center">+</button>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
                
                {domain !== 'Loan' && (
                  <motion.div key="other" layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <label className="block text-sm uppercase tracking-wider font-cinzel font-semibold text-csa-parchment/80 mb-3">Subject / Entity</label>
                      <input type="text" onChange={e => handleInputChange('subject', e.target.value)} required className="w-full bg-[rgba(255,255,255,0.02)] border border-csa-parchment/20 rounded p-4 outline-none focus:border-csa-parchment transition-colors text-lg text-white font-inter" />
                    </motion.div>
                  </motion.div>
                )}

                <motion.div layout initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <label className="block text-sm uppercase tracking-wider mb-3 font-cinzel font-semibold text-csa-parchment/80">Case Context (Optional)</label>
                  <textarea 
                    rows={4}
                    onChange={e => handleInputChange('context', e.target.value)}
                    className="w-full bg-[rgba(255,255,255,0.02)] border border-csa-parchment/20 rounded p-4 outline-none focus:border-csa-parchment transition-colors text-white font-inter resize-none"
                    placeholder="Provide any additional nuances required for the shadow audit..."
                  />
                </motion.div>
              </AnimatePresence>

              <div className="mt-6">
                <button 
                  type="submit"
                  className="w-full h-16 relative overflow-hidden rounded group border border-csa-parchment"
                >
                  <div className="absolute inset-0 bg-csa-bg z-0" />
                  <div className="absolute inset-0 bg-csa-parchment translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] z-10" />
                  <span className="relative z-20 font-cinzel font-bold text-[18px] tracking-[0.15em] text-csa-parchment group-hover:text-[#07080F] transition-colors duration-500 uppercase flex items-center justify-center gap-3">
                    Convene the Court
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Column: Live Document Preview */}
        <div className="hidden lg:block w-[400px] xl:w-[450px]">
          <div className="sticky top-24 w-full h-[600px] bg-[#C9A84C]/[0.02] border border-csa-parchment/15 rounded p-8 flex flex-col shadow-xl">
             <div className="text-center border-b border-csa-parchment/20 pb-6 mb-6">
               <h2 className="font-cinzel text-xl text-csa-parchment font-bold tracking-widest uppercase">Case File</h2>
               <div className="text-xs font-mono text-text-muted mt-2 tracking-wider">#{caseId}</div>
             </div>

             <div className="flex-1 overflow-y-auto hide-scrollbar space-y-6">
               <div className="flex justify-between items-end border-b border-white/5 pb-2">
                 <span className="font-cinzel text-xs text-text-muted uppercase">Domain</span>
                 <span className="font-cinzel text-sm text-text-primary capitalize">{domain}</span>
               </div>
               
               <div className="border-b border-white/5 pb-2">
                 <span className="font-cinzel text-xs text-text-muted uppercase block mb-1">Subject</span>
                 <span className="font-inter text-lg text-white font-medium">{formData.name || formData.subject || <span className="opacity-30">—</span>}</span>
               </div>

               {Object.entries(formData).filter(([k]) => k !== 'name' && k !== 'subject' && k !== 'context').map(([key, value]) => (
                <div key={key} className="flex justify-between items-end border-b border-white/5 pb-2">
                  <span className="font-cinzel text-xs text-text-muted uppercase">{key}</span>
                  <span className="font-mono text-sm text-csa-parchment">{value || <span className="opacity-30">—</span>}</span>
                </div>
               ))}

               <div className="pt-4">
                 <span className="font-cinzel text-xs text-text-muted uppercase block mb-3">Context Provided</span>
                 <p className="font-inter text-sm text-white/70 italic leading-relaxed whitespace-pre-wrap">
                   {formData.context ? `"${formData.context}"` : <span className="opacity-30">—</span>}
                 </p>
               </div>
             </div>
             
             <div className="mt-8 pt-6 border-t border-csa-parchment/20 flex justify-between items-center opacity-40">
               <span className="w-10 h-[1px] bg-csa-parchment" />
               <Scale className="w-5 h-5 text-csa-parchment" />
               <span className="w-10 h-[1px] bg-csa-parchment" />
             </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Loading Sequence overlay */}
      <AnimatePresence>
        {isSubmitting && (
          <motion.div 
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
            className="fixed inset-0 z-50 bg-[#07080F] flex flex-col items-center justify-center px-6"
          >
            <div className="w-full max-w-2xl">
              <h2 className="font-cinzel text-2xl text-csa-parchment mb-16 text-center opacity-80 tracking-widest uppercase">Initializing Audit Procedures</h2>
              
              <div className="space-y-6">
                {steps.map((step, idx) => {
                  if (idx > loadingStep) return null
                  const isComplete = idx < loadingStep || step.check
                  
                  return (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-start gap-4"
                    >
                      <div className="mt-1 flex-shrink-0 w-4 h-4 flex items-center justify-center">
                        {isComplete ? (
                          <Check className="w-4 h-4" style={{ color: step.color }} />
                        ) : (
                          <motion.div 
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: step.color, boxShadow: `0 0 10px ${step.color}` }}
                          />
                        )}
                      </div>
                      <div className="font-mono text-sm leading-relaxed" style={{ color: step.check ? 'var(--text-muted)' : step.color }}>
                        {idx === loadingStep ? (
                          <Typewriter text={step.text} speed={18} onComplete={handleTypewriterComplete} />
                        ) : (
                          step.text
                        )}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </div>
            
            <div className="absolute bottom-12 left-0 right-0 flex justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                className="opacity-20"
              >
                <Scale width={40} height={40} strokeWidth={1} className="text-csa-parchment" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .slider-thumb-gold::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #C9A84C;
          cursor: pointer;
          border: 2px solid #0F1218;
          box-shadow: 0 0 10px rgba(201,168,76,0.5);
        }
      `}</style>
    </div>
  )
}
