import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Filter, Search, ChevronRight, Download, Scale } from 'lucide-react'
import Typewriter from '../components/ui/Typewriter'
import { api } from '../services/api'

export default function AuditTrail() {
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['decisions', page],
    queryFn: () => api.getDecisions(page, 20),
    placeholderData: keepPreviousData,
  })

  // Loading state placeholder
  if (isLoading) return <div className="p-20 text-center text-csa-parchment animate-pulse font-cinzel tracking-widest">Consulting the Archives...</div>
  
  if (error) return <div className="p-20 text-center text-csa-shadow">Error loading the archives. The court recorder is offline.</div>
  
  const audits = data?.decisions || []

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)] w-full text-text-primary p-8 max-w-[1500px] mx-auto">
      
      <div className="flex justify-between items-end mb-12 relative z-10 border-b border-csa-parchment/10 pb-6">
        <div>
          <h1 className="text-4xl font-cinzel font-bold mb-3 tracking-wide text-csa-parchment">The Court Records</h1>
          <p className="text-text-muted font-inter text-lg">Permanent, immutable logs of all automated counsel decisions.</p>
        </div>
        
        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-csa-parchment/50 group-focus-within:text-csa-parchment transition-colors" />
            <input 
              type="text" 
              placeholder="Search Case ID..." 
              className="pl-11 pr-4 py-3 bg-[#0A0C13] border border-csa-parchment/20 rounded text-sm outline-none focus:border-csa-parchment text-white font-mono w-64 transition-colors placeholder:font-inter"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#0A0C13] border border-csa-parchment/20 text-csa-parchment font-cinzel font-bold tracking-widest uppercase rounded hover:bg-csa-parchment/10 transition-colors text-sm">
            <Filter className="w-4 h-4" /> Filter
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-[#0A0C13] border border-csa-parchment/20 text-csa-parchment font-cinzel font-bold tracking-widest uppercase rounded hover:bg-csa-parchment/10 transition-colors text-sm">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="bg-[#0A0C13] border border-csa-parchment/10 rounded-xl overflow-hidden shadow-[inset_0_0_40px_rgba(201,168,76,0.02)]">
        <div className="grid grid-cols-[60px_120px_1fr_1fr_1fr_1fr_150px_150px] gap-4 p-5 border-b border-csa-parchment/10 bg-[#07080F] text-[11px] uppercase font-cinzel font-bold tracking-widest text-text-muted">
          <div></div>
          <div>Case ID</div>
          <div>Domain</div>
          <div>Timestamp</div>
          <div>Primary Counsel</div>
          <div>Shadow Counsel</div>
          <div>Tension Score</div>
          <div>Status</div>
        </div>

        <div className="flex flex-col">
          {audits.map((audit, index) => {
            const isExpanded = expandedId === audit.decision_id
            const tension = audit.tension_score || 0
            const tensionColor = tension >= 70 ? 'bg-csa-shadow shadow-[0_0_12px_rgba(255,71,87,0.6)]' :
                               tension >= 40 ? 'bg-csa-parchment shadow-[0_0_12px_rgba(201,168,76,0.6)]' :
                               'bg-csa-primary shadow-[0_0_12px_rgba(123,111,255,0.6)]'
            
            const timestamp = audit.created_at ? new Date(audit.created_at).toLocaleString() : '---'
            
            return (
              <motion.div 
                key={audit.decision_id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                className="border-b border-csa-parchment/5 last:border-b-0"
              >
                <div 
                  className={`grid grid-cols-[60px_120px_1fr_1fr_1fr_1fr_150px_150px] gap-4 p-5 items-center cursor-pointer transition-all duration-300 ${isExpanded ? 'bg-csa-parchment/5 border-l-2 border-csa-parchment' : 'hover:bg-white/[0.02] border-l-2 border-transparent'}`}
                  onClick={() => setExpandedId(isExpanded ? null : audit.decision_id)}
                >
                  <div className="flex justify-center text-text-muted">
                    <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
                      <ChevronRight className="w-5 h-5 text-csa-parchment/60" />
                    </motion.div>
                  </div>
                  <div className="font-mono text-[13px] text-white tracking-wider">{audit.decision_id.slice(0, 8)}...</div>
                  <div className="text-sm">
                    <span className="px-3 py-1 rounded bg-white/5 text-xs font-inter text-text-muted">{audit.domain}</span>
                  </div>
                  <div className="text-[13px] text-text-muted font-mono">{timestamp}</div>
                  <div className="text-[13px] text-text-primary font-inter">{audit.primary_verdict}</div>
                  <div className="text-[13px] text-text-primary font-inter">{audit.shadow_verdict}</div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${tensionColor}`} style={{ width: `${tension}%` }} />
                    </div>
                    <span className="font-mono text-[13px] font-bold text-white">{tension}</span>
                  </div>
                  <div>
                    <span className={`px-4 py-1.5 rounded text-[10px] uppercase font-cinzel font-bold tracking-widest flex items-center justify-center w-fit ${
                      audit.escalate_flag ? 'text-[#FF4757] bg-[#FF4757]/10 border border-[#FF4757]/20 shadow-[0_0_10px_rgba(255,71,87,0.1)]' : 
                      'text-csa-parchment bg-csa-parchment/10 border border-csa-parchment/20'
                    }`}>
                      {audit.resolved_by_human ? 'RESOLVED' : audit.escalate_flag ? 'ESCALATED' : 'FINALIZED'}
                    </span>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-[#07080F]"
                    >
                      <div className="p-8 grid grid-cols-2 gap-10 border-t border-csa-parchment/5 shadow-[inset_0_10px_20px_rgba(0,0,0,0.2)]">
                        {/* Primary Counsel Log */}
                        <div className="bg-[#0A0B1F] p-6 rounded border border-csa-primary/20 relative shadow-[inset_0_0_30px_rgba(123,111,255,0.02)]">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-csa-primary opacity-50" />
                          <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xs uppercase font-cinzel tracking-widest text-csa-primary font-bold">Primary Counsel Argument</h4>
                            <Scale className="w-5 h-5 text-csa-primary/30" />
                          </div>
                          <div className="text-sm font-mono text-[#D0CACA] leading-relaxed italic min-h-[100px]">
                            <Typewriter text={audit.primary_reasoning || 'No details available.'} speed={15} />
                          </div>
                        </div>

                        {/* Shadow Counsel Log */}
                        <div className="bg-[#1A0808] p-6 rounded border border-csa-shadow/20 relative shadow-[inset_0_0_30px_rgba(255,71,87,0.02)]">
                          <div className="absolute top-0 left-0 right-0 h-0.5 bg-csa-shadow opacity-50" />
                          <div className="flex justify-between items-center mb-6">
                            <h4 className="text-xs uppercase font-cinzel tracking-widest text-csa-shadow font-bold">Shadow Counsel Argument</h4>
                            <Scale className="w-5 h-5 text-csa-shadow/30" />
                          </div>
                          <div className="text-sm font-mono text-[#D0CACA] leading-relaxed italic min-h-[100px]">
                            <Typewriter text={audit.shadow_reasoning || 'No details available.'} speed={15} />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-between items-center px-4">
        <button 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="text-csa-parchment/60 hover:text-csa-parchment font-cinzel tracking-widest text-sm uppercase flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          ← Previous Ledger
        </button>
        <span className="font-mono text-sm text-text-muted">PAGE {page}</span>
        <button 
          onClick={() => setPage(p => p + 1)}
          disabled={!data || audits.length < 20}
          className="text-csa-parchment/60 hover:text-csa-parchment font-cinzel tracking-widest text-sm uppercase flex items-center gap-2 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        >
          Next Ledger →
        </button>
      </div>
    </div>
  )
}
