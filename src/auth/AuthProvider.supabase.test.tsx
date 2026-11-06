import { createElement, type ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ callback: null as null | ((event: string, session: unknown) => void), unsubscribe: vi.fn() }))
vi.mock('../lib/supabase', () => ({
  isDemoMode: false,
  supabase: { auth: {
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
    onAuthStateChange: vi.fn((callback: (event: string, session: unknown) => void) => {
      mocks.callback = callback
      return { data: { subscription: { unsubscribe: mocks.unsubscribe } } }
    }),
    signOut: vi.fn(async () => ({ error: null })),
    signInWithPassword: vi.fn(async () => ({ error: null })),
    signUp: vi.fn(async () => ({ error: null })),
  } },
}))
import { AuthProvider, useAuth } from './AuthProvider'
const wrapper = ({ children }: { children: ReactNode }) => createElement(AuthProvider, null, children)
describe('Supabase session lifecycle', () => {
  beforeEach(() => { mocks.callback = null; mocks.unsubscribe.mockClear() })
  it('reacts to refreshed and expired/sign-out sessions from Supabase Auth', async () => {
    const { result, unmount } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    const refreshed = { user: { id: 'user-a', email: 'a@example.test' }, access_token: 'refreshed', expires_at: Math.floor(Date.now()/1000)+3600 } as never
    act(() => { mocks.callback?.('TOKEN_REFRESHED', refreshed) })
    expect(result.current.session).toBe(refreshed)
    act(() => { mocks.callback?.('SIGNED_OUT', null) })
    expect(result.current.session).toBeNull()
    expect(result.current.user).toBeNull()
    unmount()
    expect(mocks.unsubscribe).toHaveBeenCalled()
  })
})
