import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function Navbar() {
  const location = useLocation()

  const links = [
    { name: 'The Court', path: '/' },
    { name: 'File a Case', path: '/submit' },
    { name: 'Archives', path: '/audit' },
    { name: 'Escalations', path: '/escalations' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-[20px] bg-[rgba(7,8,15,0.85)] border-b border-csa-parchment/20 h-16 flex items-center px-6">
      <div className="flex items-center gap-3 w-1/4 md:w-[30%]">
        <Link to="/" className="font-cinzel font-bold text-xl text-csa-parchment flex items-center gap-2">
          <span className="text-2xl">⚖</span> CSA
        </Link>
      </div>

      <div className="flex-1 flex justify-center gap-8">
        {links.map((link) => {
          const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path))
          return (
            <Link
              key={link.name}
              to={link.path}
              className={clsx(
                "relative text-sm font-medium transition-all duration-300 hover:tracking-[0.05em]",
                isActive ? "text-text-primary" : "text-text-muted hover:text-text-primary"
              )}
            >
              {link.name}
              {isActive && (
                <motion.div
                  layoutId="nav-pill"
                  className="absolute -bottom-[21px] left-0 right-0 h-[2px] bg-csa-parchment w-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
            </Link>
          )
        })}
      </div>

      <div className="w-1/4 flex justify-end">
        <div className="px-3 py-1 flex items-center gap-2 rounded border border-csa-parchment/20 bg-csa-surface/50">
          <div className="w-2 h-2 rounded-full bg-csa-arbiter animate-pulse shadow-[0_0_8px_var(--csa-arbiter)]" />
          <span className="text-[11px] uppercase tracking-widest text-text-muted font-cinzel font-semibold">Court In Session</span>
        </div>
      </div>
    </nav>
  )
}
