import { createElement, type ReactNode } from 'react'
import { act, renderHook, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

vi.mock('../lib/supabase', () => ({ isDemoMode: true, supabase: { auth: {} } }))
import { AuthProvider, useAuth } from './AuthProvider'

const wrapper = ({ children }: { children: ReactNode }) => createElement(AuthProvider, null, children)
describe('demo authentication lifecycle', () => {
  beforeEach(() => { localStorage.clear(); vi.stubGlobal('crypto', { randomUUID: vi.fn(() => `uuid-${Math.random()}`) }) })
  it('creates distinct per-email identities and restores the same identity after sign-out', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(result.current.loading).toBe(false))
    await act(async () => { await result.current.signIn('a@example.test', 'password') })
    const firstId = result.current.user?.id
    expect(firstId).toMatch(/^demo-/)
    await act(async () => { await result.current.signOut() })
    expect(result.current.user).toBeNull()
    await act(async () => { await result.current.signIn('b@example.test', 'password') })
    expect(result.current.user?.id).not.toBe(firstId)
    await act(async () => { await result.current.signOut() })
    await act(async () => { await result.current.signIn('a@example.test', 'password') })
    expect(result.current.user?.id).toBe(firstId)
  })
  it('restores the active demo identity after provider remount', async () => {
    const first = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(first.result.current.loading).toBe(false))
    await act(async () => { await first.result.current.signIn('restore@example.test', 'password') })
    const id = first.result.current.user?.id
    first.unmount()
    const second = renderHook(() => useAuth(), { wrapper })
    await waitFor(() => expect(second.result.current.loading).toBe(false))
    expect(second.result.current.user?.id).toBe(id)
  })
})
