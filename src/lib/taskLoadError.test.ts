import { describe, expect, it } from 'vitest'
import { getTaskLoadErrorMessage } from './taskLoadError'

describe('getTaskLoadErrorMessage', () => {
  it('explains when the hosted tasks table has not been migrated', () => {
    expect(getTaskLoadErrorMessage({ code: '42P01', message: 'relation "public.tasks" does not exist' })).toContain('Apply supabase/migrations/20250915000000_initial_schema.sql')
  })
  it('explains RLS and permission failures', () => {
    expect(getTaskLoadErrorMessage({ code: '42501', message: 'permission denied for table tasks' })).toContain('RLS policies')
  })
  it('explains invalid session or API key errors', () => {
    expect(getTaskLoadErrorMessage({ code: 'PGRST301', message: 'JWT expired' })).toContain('Sign out and sign in again')
  })
  it('explains network failures without hiding the actual problem', () => {
    expect(getTaskLoadErrorMessage(new Error('Failed to fetch'))).toContain('cannot reach Supabase')
  })
})
