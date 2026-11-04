import { useState, type ReactNode } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthProvider'
import { useProfile } from '../hooks/useProfile'
import { Logo } from './Logo'
import { DemoBanner } from './DemoBanner'

export function AppShell({ children }: { children: ReactNode }) {
  const { user, signOut } = useAuth()
  const { data: profile } = useProfile(user?.id)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()
  const initials = (profile?.display_name || user?.email || 'U').slice(0, 2).toUpperCase()
  async function handleSignOut() { await signOut(); navigate('/login') }
  return <div className="app-layout">
    <header className="topbar"><Logo />
      <button className="mobile-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label="Toggle navigation">☰</button>
      <nav className={`main-nav ${menuOpen ? 'open' : ''}`} aria-label="Main navigation">
        <NavLink to="/app" end onClick={() => setMenuOpen(false)}>Overview</NavLink>
        <NavLink to="/app/tasks" onClick={() => setMenuOpen(false)}>All tasks</NavLink>
      </nav>
      <div className="user-menu"><Link to="/app/settings" className="avatar" aria-label="Open settings">{initials}</Link><button className="signout-button" onClick={handleSignOut}>Sign out</button></div>
    </header>
    <DemoBanner />
    <main className="main-content">{children}</main>
    <footer className="footer">Built for focus · <span>{new Date().getFullYear()} Taskflow</span></footer>
  </div>
}
