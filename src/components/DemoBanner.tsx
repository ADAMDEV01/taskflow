import { isDemoMode } from '../lib/supabase'

export function DemoBanner() {
  if (!isDemoMode) return null
  return (
    <aside className="demo-banner" role="note" aria-label="Browser-only demo mode">
      <strong>Browser-only demo</strong>
      <span>Changes stay in this browser’s local storage. Each email has a separate demo workspace; nothing is sent to Supabase.</span>
    </aside>
  )
}
