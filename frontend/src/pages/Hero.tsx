import { motion } from 'framer-motion'
import Particles, { initParticlesEngine } from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'
import { useEffect, useState } from 'react'
import AnimatedCounter from '../components/ui/AnimatedCounter'
import { Link } from 'react-router-dom'
import { Gavel, Scale, BrainCircuit, ArrowRight, Zap } from 'lucide-react'

export default function Hero() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  const headline1 = "Every Decision".split(" ")
  const headline2 = "Has Two Sides.".split(" ")

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.4 } }}
      className="relative w-full flex flex-col bg-csa-bg min-h-screen"
    >
      <section className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center pt-10 px-6 overflow-hidden">
        
        {/* tsParticles Background */}
        {init && (
          <Particles
            className="absolute inset-0 z-0 opacity-20 pointer-events-none"
            options={{
              background: { color: { value: 'transparent' } },
              fpsLimit: 60,
              particles: {
                color: { value: '#C9A84C' },
                move: { enable: true, speed: 0.3, direction: 'none', random: true, straight: false, outModes: { default: 'out' } },
                number: { density: { enable: true }, value: 80 },
                opacity: { value: { min: 0.1, max: 0.5 } },
                shape: { type: 'circle' },
                size: { value: { min: 1, max: 2 } }
              }
            }}
          />
        )}

        {/* Orbiting Orbs */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none opacity-40">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            className="w-[600px] h-[600px] rounded-full border border-csa-parchment/5 relative"
          >
            <div className="absolute top-0 left-1/2 -ml-3 w-6 h-6 rounded-full bg-csa-primary shadow-[0_0_30px_var(--csa-primary)] blur-[2px]" />
            <div className="absolute bottom-0 left-1/2 -ml-3 w-6 h-6 rounded-full bg-csa-shadow shadow-[0_0_30px_var(--csa-shadow)] blur-[2px]" />
            <motion.div 
              animate={{ opacity: [0.1, 0.3, 0.1] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute top-6 bottom-6 left-1/2 w-[1px] bg-gradient-to-b from-csa-primary via-csa-parchment to-csa-shadow opacity-20"
            />
          </motion.div>
        </div>

        <div className="z-10 flex flex-col items-center max-w-5xl w-full text-center mt-[-10vh]">
          {/* Top Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, type: "spring" }}
            className="flex items-center gap-2 mb-10"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-csa-parchment animate-pulse" />
            <span className="text-sm font-cinzel text-csa-parchment uppercase tracking-[0.2em] font-semibold flex items-center gap-2">
              [ Court is Now in Session ]
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="font-cinzel font-bold text-5xl md:text-[68px] leading-[1.1] mb-6 flex flex-col items-center">
            <div className="flex justify-center gap-[0.3em] flex-wrap text-text-primary h-[80px]">
              {headline1.map((word, i) => (
                <motion.span
                  key={`line1-${i}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.4 + i * 0.2, type: "spring", stiffness: 80, damping: 18 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="flex justify-center gap-[0.3em] flex-wrap text-csa-parchment md:mt-2 h-[80px]">
              {headline2.map((word, i) => (
                <motion.span
                  key={`line2-${i}`}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.8 + i * 0.2, type: "spring", stiffness: 80, damping: 18 }}
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h1>

          {/* Animated SVG Divider */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "200px", opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: "anticipate" }}
            className="h-[1px] bg-gradient-to-r from-transparent via-csa-parchment to-transparent my-8"
          />

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.5 }}
            className="text-[18px] text-text-muted max-w-2xl mb-14 font-inter leading-relaxed"
          >
            CSA deploys two opposing AI counsel against every decision. <br className="hidden md:block"/>
            Bias has nowhere to hide when the opposition never sleeps.
          </motion.p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 w-full mb-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 1.8, type: "spring" }}
              className="flex flex-col items-center px-8 py-4 rounded border border-csa-primary/20 bg-[rgba(123,111,255,0.02)] shadow-[inset_0_0_30px_rgba(123,111,255,0.05)] w-64"
            >
              <div className="text-csa-primary mb-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="tracking-widest">...</motion.div>
              </div>
              <span className="font-cinzel text-sm text-text-primary tracking-widest uppercase relative z-10">Primary Counsel</span>
              <span className="text-[10px] text-csa-primary mt-1 font-mono uppercase opacity-70">Standing by</span>
            </motion.div>

            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 1, delay: 2.2, type: "spring" }}
              className="text-csa-parchment/60 animate-[spin_8s_linear_infinite]"
            >
              <Scale size={28} strokeWidth={1} />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 2, type: "spring" }}
              className="flex flex-col items-center px-8 py-4 rounded border border-csa-shadow/20 bg-[rgba(255,71,87,0.02)] shadow-[inset_0_0_30px_rgba(255,71,87,0.05)] w-64"
            >
              <div className="text-csa-shadow mb-3">
                <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }} className="tracking-widest">...</motion.div>
              </div>
              <span className="font-cinzel text-sm text-text-primary tracking-widest uppercase relative z-10">Shadow Counsel</span>
              <span className="text-[10px] text-csa-shadow mt-1 font-mono uppercase opacity-70">Standing by</span>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 2.6 }}
            className="flex flex-col items-center justify-center gap-6 w-full mt-4"
          >
            <Link 
              to="/submit"
              className="group relative px-8 py-4 bg-csa-surface text-csa-parchment rounded border border-csa-parchment shadow-lg font-cinzel font-bold text-lg tracking-wider transition-all duration-300 hover:bg-csa-parchment hover:text-csa-bg hover:scale-[1.03] flex items-center gap-3 overflow-hidden"
            >
              <span className="relative z-10 uppercase">Enter the Courtroom</span> 
              <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 bg-transparent text-text-primary/70 font-inter font-medium hover:text-text-primary transition-colors flex items-center gap-2"
            >
              Watch a Live Trial ↓
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 3 }}
            className="flex flex-wrap justify-center gap-12 mt-16 pb-8"
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl font-mono text-csa-parchment mb-1"><AnimatedCounter from={0} to={10000} suffix="+" /></span>
              <span className="text-[11px] text-text-muted uppercase tracking-widest font-inter">Decisions Audited</span>
            </div>
            <div className="w-px h-12 bg-border-subtle hidden md:block" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-mono text-csa-parchment mb-1"><AnimatedCounter from={0} to={94} suffix="%" /></span>
              <span className="text-[11px] text-text-muted uppercase tracking-widest font-inter">Bias Detection Rate</span>
            </div>
            <div className="w-px h-12 bg-border-subtle hidden md:block" />
            <div className="flex flex-col items-center">
              <span className="text-3xl font-mono text-csa-parchment mb-1">&lt; <AnimatedCounter from={0} to={2} suffix="s" /></span>
              <span className="text-[11px] text-text-muted uppercase tracking-widest font-inter">Response Time</span>
            </div>
          </motion.div>
        </div>

        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="absolute bottom-8 text-csa-parchment/60"
        >
          <Gavel className="w-6 h-6 rotate-[-15deg]" />
        </motion.div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="py-32 px-6 bg-[#07080F] relative border-t border-border-subtle z-10 w-full overflow-hidden">
        <div className="max-w-6xl mx-auto w-full">
          <div className="text-center mb-20 relative">
            <h2 className="font-cinzel text-3xl md:text-5xl font-bold mb-6 tracking-wide text-text-primary">The Trial of Every Decision</h2>
            <p className="text-text-muted text-lg font-inter">Three minds. One truth.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-20">
            {/* Primary Counsel */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, type: "spring" }}
              className="group relative bg-[#0F1218] p-8 rounded-lg border-l-2 border-l-csa-primary border-t border-r border-b border-white/5 transition-all duration-500 hover:shadow-[inset_4px_0_0_var(--csa-primary),0_0_30px_rgba(123,111,255,0.15)] flex flex-col h-full overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 text-[120px] font-cinzel font-bold text-white/[0.02] pointer-events-none select-none z-0">01</div>
              <div className="mb-8 p-4 bg-csa-bg rounded inline-block border border-white/5 relative z-10 text-csa-primary">
                <BrainCircuit className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-cinzel tracking-wider font-bold mb-4 text-text-primary relative z-10">Primary Counsel</h3>
              <p className="text-text-muted font-inter leading-relaxed relative z-10">Makes the decision with full confidence. Presents its case with structured reasoning and evidence.</p>
            </motion.div>

            {/* The Arbiter */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2, type: "spring" }}
              className="group relative bg-[#12161E] p-8 rounded-lg border border-csa-parchment/20 transition-all duration-500 hover:shadow-[0_0_40px_rgba(201,168,76,0.15)] flex flex-col h-full transform md:-translate-y-4 overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 text-[120px] font-cinzel font-bold text-white/[0.02] pointer-events-none select-none z-0">02</div>
              <div className="mb-8 p-4 bg-csa-bg rounded inline-block border border-csa-parchment/20 relative z-10 text-csa-parchment shadow-[inset_0_0_20px_rgba(201,168,76,0.1)]">
                <Gavel className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-cinzel tracking-wider font-bold mb-4 text-csa-parchment relative z-10">The Arbiter</h3>
              <p className="text-text-muted font-inter leading-relaxed relative z-10">Pure logic. No bias. Weighs both sides and measures the tension between them.</p>
            </motion.div>

            {/* Shadow Counsel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.4, type: "spring" }}
              className="group relative bg-[#0F1218] p-8 rounded-lg border-l-2 border-l-csa-shadow border-t border-r border-b border-white/5 transition-all duration-500 hover:shadow-[inset_4px_0_0_var(--csa-shadow),0_0_30px_rgba(255,71,87,0.15)] flex flex-col h-full overflow-hidden"
            >
              <div className="absolute -right-4 -bottom-4 text-[120px] font-cinzel font-bold text-white/[0.02] pointer-events-none select-none z-0">03</div>
              <div className="mb-8 p-4 bg-csa-bg rounded inline-block border border-white/5 relative z-10 text-csa-shadow">
                <Zap className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-cinzel tracking-wider font-bold mb-4 text-text-primary relative z-10">Shadow Counsel</h3>
              <p className="text-text-muted font-inter leading-relaxed relative z-10">Trained to oppose. Finds every flaw, every bias, every overlooked factor. Never rests.</p>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-20 flex flex-col items-center justify-center relative w-full"
          >
            {/* Animated Flow Line */}
            <div className="flex items-center justify-center gap-4 text-sm font-mono tracking-widest text-text-muted/60 w-full max-w-xl mx-auto px-6">
               <span className="text-csa-primary font-bold">PRIMARY</span>
               <div className="w-12 sm:w-24 h-[1px] bg-gradient-to-r from-transparent via-csa-primary/80 to-transparent relative overflow-hidden">
                 <motion.div 
                   animate={{ x: ["-100%", "300%"] }} 
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-csa-primary to-transparent opacity-50"
                 />
               </div>
               <div className="px-6 py-2 border border-csa-parchment/30 bg-[#0F1218] text-csa-parchment animate-[pulse-slow] whitespace-nowrap shadow-[0_0_20px_rgba(201,168,76,0.1)]">
                 [ TENSION SCORE ]
               </div>
               <div className="w-12 sm:w-24 h-[1px] bg-gradient-to-l from-transparent via-csa-shadow/80 to-transparent relative overflow-hidden">
                 <motion.div 
                   animate={{ x: ["300%", "-100%"] }} 
                   transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                   className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-csa-shadow to-transparent opacity-50"
                 />
               </div>
               <span className="text-csa-shadow font-bold">SHADOW</span>
            </div>
          </motion.div>
        </div>
      </section>
    </motion.div>
  )
}
