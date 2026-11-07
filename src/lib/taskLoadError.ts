type SupabaseTaskError = { code?: string; message?: string; details?: string; hint?: string }

export function getTaskLoadErrorMessage(error: unknown): string {
  const value = (error && typeof error === 'object' ? error : {}) as SupabaseTaskError
  const code = value.code || ''
  const message = value.message || (error instanceof Error ? error.message : '')

  if (code === '42P01' || code === 'PGRST205' || /relation .*tasks.* does not exist|could not find the table .*tasks/i.test(message)) {
    return 'The tasks table is missing from this Supabase project. Apply supabase/migrations/20250915000000_initial_schema.sql in the Supabase SQL Editor, then reload the app.'
  }
  if (code === '42501' || /permission denied|row-level security|violates row-level security/i.test(message)) {
    return 'Supabase denied access to the tasks table. Check that the tasks RLS policies from the Taskflow migration are installed and that you are signed in with the correct account.'
  }
  if (code === 'PGRST301' || code === '401' || /invalid jwt|jwt expired|invalid token/i.test(message)) {
    return 'Your Supabase session or public API key is invalid or expired. Sign out and sign in again, then verify the Vercel Supabase URL and anon/publishable key.'
  }
  if (/failed to fetch|networkerror|fetch failed|name_not_resolved/i.test(message)) {
    return 'The browser cannot reach Supabase. Check the VITE_SUPABASE_URL in Vercel, the project status, and your network connection.'
  }
  return message || 'Unknown Supabase error. Verify the Vercel environment variables and Supabase project configuration.'
}
