import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertCircle, FileText, CheckCircle2, Gavel, Scale, Zap } from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../services/api'

export default function EscalationQueue() {
  const queryClient = useQueryClient();
  const [activeActionId, setActiveActionId] = useState<string | null>(null)
  const [actionType, setActionType] = useState<'Primary'|'Shadow'|'Override'|null>(null)
  const [notes, setNotes] = useState('')

  const { data } = useQuery({
    queryKey: ['decisions'],
    queryFn: () => api.getDecisions(1, 100), // Get all to filter
  })

  const resolveMutation = useMutation({
    mutationFn: ({ id, verdict, notes }: { id: string, verdict: string, notes: string }) => 
      api.resolve(id, verdict, notes),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['decisions'] });
      setActiveActionId(null);
      setActionType(null);
      setNotes('');
    }
  });

  const handleActionClick = (id: string, type: 'Primary'|'Shadow'|'Override') => {
    if (activeActionId === id && actionType === type) {
      setActiveActionId(null)
      setActionType(null)
    } else {
      setActiveActionId(id)
      setActionType(type)
      setNotes('')
    }
  }

  const handleResolve = (id: string) => {
    if (!actionType) return;
    resolveMutation.mutate({ 
      id, 
      verdict: actionType === 'Primary' ? 'Uphold Primary' : actionType === 'Shadow' ? 'Uphold Shadow' : 'Manual Override',
      notes 
    });
  }

  const queue = data?.decisions.filter(d => d.escalate_flag && !d.resolved_by_human) || [];

  return (
    <div className="flex flex-col h-full min-h-[calc(100vh-64px)] w-full text-text-primary p-8 max-w-[1200px] mx-auto">
      
      <div className="flex justify-between items-end mb-12 border-b border-csa-parchment/10 pb-6 relative z-10">
        <div>
          <h1 className="text-4xl font-cinzel font-bold mb-3 flex items-center gap-4 text-csa-parchment tracking-wide">
            High Court Escalations
            <span className="px-4 py-1 bg-csa-parchment/10 text-csa-parchment text-sm rounded border border-csa-parchment/30 font-mono tracking-wider font-bold">
              {queue.length} PENDING
            </span>
          </h1>
          <p className="text-text-muted font-inter text-lg">Human Arbiter required for unresolved high-tension conflicts.</p>
        </div>
      </div>

      <div className="flex flex-col gap-10">
        <AnimatePresence>
          {queue.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="flex flex-col items-center justify-center p-24 bg-[#0A0C13] border border-csa-parchment/10 rounded-xl shadow-[inset_0_0_40px_rgba(201,168,76,0.02)]"
            >
              <CheckCircle2 className="w-20 h-20 text-csa-parchment mb-6 opacity-30" />
              <h2 className="text-2xl font-cinzel font-bold text-csa-parchment mb-2 tracking-widest">The Docket is Clear</h2>
              <p className="text-text-muted font-inter">All conflicts have been resolved. The court rests.</p>
            </motion.div>
          )}

          {queue.map((item, idx) => (
            <motion.div 
              key={item.decision_id}
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className="bg-[#0A0C13] rounded-xl overflow-hidden shadow-[inset_0_0_40px_rgba(201,168,76,0.02)] border border-[#C9A84C]/20 border-l-[4px] border-l-[#C9A84C]"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center gap-4">
                    <span className="px-3 py-1 rounded bg-white/5 text-xs font-inter text-text-muted">{item.domain}</span>
                    <span className="font-mono text-white tracking-widest">{item.decision_id}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] uppercase text-text-muted tracking-widest font-cinzel font-bold">Tension Score</span>
                    <div className="px-4 py-1.5 rounded bg-csa-shadow/10 border border-csa-shadow/30 text-csa-shadow font-mono font-bold text-lg shadow-[0_0_15px_rgba(255,71,87,0.15)]">
                      {item.tension_score}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {/* Primary Box */}
                  <div className="p-6 rounded-lg bg-[#07080F] border border-csa-primary/20 relative shadow-[inset_0_0_20px_rgba(123,111,255,0.03)]">
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-csa-primary opacity-50" />
                    <div className="flex justify-between items-center mb-6">
                       <span className="block text-xs uppercase font-cinzel tracking-widest text-csa-primary font-bold">Primary Counsel</span>
                       <Scale className="w-5 h-5 text-csa-primary/30" />
                    </div>
                    <div className="font-bold text-2xl text-white font-inter">{item.primary_verdict}</div>
                  </div>

                  {/* Shadow Box */}
                  <div className="p-6 rounded-lg bg-[#1A0808] border border-csa-shadow/20 relative shadow-[inset_0_0_20px_rgba(255,71,87,0.03)]">
                    <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
                      <Zap className="w-16 h-16 text-csa-shadow" />
                    </div>
                    <div className="absolute top-0 left-0 right-0 h-0.5 bg-csa-shadow opacity-50" />
                    <div className="flex justify-between items-center mb-6 relative z-10">
                       <span className="block text-xs uppercase font-cinzel tracking-widest text-csa-shadow font-bold">Shadow Counsel</span>
                       <AlertCircle className="w-5 h-5 text-csa-shadow/50" />
                    </div>
                    
                    <div className="font-bold text-2xl text-white font-inter relative z-10 mb-6">{item.shadow_verdict}</div>
                    
                    <div className="pt-4 border-t border-csa-shadow/10 relative z-10">
                      <span className="block text-[10px] text-text-muted font-cinzel font-bold tracking-widest uppercase mb-3">Bias Flags Found</span>
                      <div className="flex flex-col gap-2">
                        {(item.shadow_bias_flags || []).map(f => (
                          <span key={f} className="px-3 py-1.5 bg-csa-shadow/10 border border-csa-shadow/20 rounded text-xs text-csa-shadow/90 font-inter truncate">
                            • {f}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-6 border-t border-csa-parchment/10">
                  <button className="flex items-center gap-2 text-sm text-csa-parchment/70 hover:text-csa-parchment font-inter transition-colors">
                    <FileText className="w-4 h-4" /> View Full Case History
                  </button>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleActionClick(item.decision_id, 'Primary')}
                      className={`px-6 py-3 rounded font-cinzel font-bold tracking-widest uppercase text-xs transition-all ${
                        activeActionId === item.decision_id && actionType === 'Primary' 
                          ? 'bg-csa-primary text-white shadow-[0_0_20px_rgba(123,111,255,0.4)] border border-transparent' 
                          : 'bg-[#07080F] border border-csa-primary/30 text-csa-primary hover:bg-csa-primary/10'
                      }`}
                    >
                      Uphold Primary
                    </button>
                    <button 
                      onClick={() => handleActionClick(item.decision_id, 'Shadow')}
                      className={`px-6 py-3 rounded font-cinzel font-bold tracking-widest uppercase text-xs transition-all ${
                        activeActionId === item.decision_id && actionType === 'Shadow' 
                          ? 'bg-csa-shadow text-white shadow-[0_0_20px_rgba(255,71,87,0.4)] border border-transparent' 
                          : 'bg-[#07080F] border border-csa-shadow/30 text-csa-shadow hover:bg-csa-shadow/10'
                      }`}
                    >
                      Uphold Shadow
                    </button>
                    <button 
                      onClick={() => handleActionClick(item.decision_id, 'Override')}
                      className={`px-6 py-3 rounded font-cinzel font-bold tracking-widest uppercase text-xs transition-all ${
                        activeActionId === item.decision_id && actionType === 'Override' 
                          ? 'bg-csa-parchment text-[#07080F] shadow-[0_0_20px_rgba(201,168,76,0.4)] border border-transparent' 
                          : 'bg-[#07080F] border border-csa-parchment/30 text-csa-parchment hover:bg-csa-parchment/10'
                      }`}
                    >
                      Override
                    </button>
                  </div>
                </div>
              </div>

              <AnimatePresence>
                {activeActionId === item.decision_id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="bg-[#07080F] border-t border-csa-parchment/10"
                  >
                    <div className="p-8">
                      <label className="block text-xs uppercase tracking-widest text-csa-parchment/80 font-cinzel font-bold mb-3 flex items-center gap-2">
                        <Gavel className="w-4 h-4" /> Official Judgment Rationale 
                      </label>
                      <textarea 
                        value={notes}
                        onChange={e => setNotes(e.target.value)}
                        className="w-full bg-[#0A0C13] border border-csa-parchment/20 rounded p-4 outline-none focus:border-csa-parchment transition-colors font-inter text-white resize-none mb-6"
                        rows={3}
                        placeholder={`Provide justification for choosing: ${actionType === 'Primary' ? 'Primary Counsel' : actionType === 'Shadow' ? 'Shadow Counsel' : 'Manual Override'}...`}
                      />
                      <div className="flex justify-end">
                        <button 
                          onClick={() => handleResolve(item.decision_id)}
                          className="px-8 py-3 rounded bg-csa-parchment text-[#07080F] font-cinzel font-bold tracking-widest uppercase shadow-[0_0_20px_rgba(201,168,76,0.3)] hover:scale-[1.02] transition-transform text-sm disabled:opacity-50"
                          disabled={resolveMutation.isPending}
                        >
                          {resolveMutation.isPending ? 'Confirming...' : 'Confirm Judgment'}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          ))}
        </AnimatePresence>
      </div>

    </div>
  )
}
