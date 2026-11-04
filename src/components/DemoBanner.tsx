import { isDemoMode } from '../lib/supabase'
export function DemoBanner() {
  if (!isDemoMode) return null
  return <aside className="demo-banner" role="note"><strong>Demo mode</strong><span>Data is saved only in your browser. Any email address is accepted; no account is needed.</span></aside>
}
