import { useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useProfile, useUpdateProfile } from '../hooks/useProfile'
import { profileSchema } from '../lib/validation'

export function SettingsPage() {
  const { user } = useAuth(); const { data: profile, isLoading } = useProfile(user?.id); const update = useUpdateProfile(user!.id)
  const [name, setName] = useState(''); const [saved, setSaved] = useState(false)
  if (isLoading) return <div className="loading-list"><span className="spinner" />Loading settings…</div>
  const currentName = name || profile?.display_name || ''
  async function save(e: React.FormEvent) { e.preventDefault(); const parsed = profileSchema.safeParse({ display_name: currentName }); if (!parsed.success) return; await update.mutateAsync(parsed.data.display_name); setName(parsed.data.display_name); setSaved(true); setTimeout(() => setSaved(false), 2500) }
  return <div className="dashboard settings-page"><section className="welcome-row compact"><div><p className="eyebrow">Workspace</p><h1>Settings<span className="accent">.</span></h1><p className="muted">Make Taskflow feel like yours.</p></div></section><div className="settings-card"><div className="settings-card-heading"><div className="avatar large">{(currentName || user?.email || 'U').slice(0, 2).toUpperCase()}</div><div><h2>Profile</h2><p>Personalise how you show up in your workspace.</p></div></div><form onSubmit={save} className="settings-form"><label>Display name<input value={currentName} onChange={(e) => setName(e.target.value)} placeholder="Your name" maxLength={60} required /></label><label>Email address<input value={user?.email || ''} disabled /></label><div className="form-actions"><button className="button primary" disabled={update.isPending}>{update.isPending ? 'Saving…' : 'Save profile'}</button>{saved && <span className="form-success">Saved successfully.</span>}</div></form></div></div>
}
