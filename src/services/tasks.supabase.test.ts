import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({ from: vi.fn(), eqCalls: [] as [string, string][] }))
vi.mock('../lib/supabase', () => ({ isDemoMode: false, supabase: { from: mocks.from } }))
import { deleteTask, updateTask } from './tasks'

describe('Supabase task ownership filters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.eqCalls.length = 0
    const updateChain = {
      eq: vi.fn((column: string, value: string) => { mocks.eqCalls.push([column, value]); return updateChain }),
      select: vi.fn(() => updateChain),
      single: vi.fn().mockResolvedValue({ data: { id:'t1', user_id:'owner-1', title:'Scoped', status:'todo', priority:'low', description:null, due_date:null, created_at:'', updated_at:'' }, error:null }),
    }
    let deleteStep = 0
    const deleteChain = {
      eq: vi.fn((column: string, value: string) => {
        mocks.eqCalls.push([column, value])
        deleteStep += 1
        return deleteStep === 1 ? deleteChain : Promise.resolve({ error:null })
      }),
    }
    mocks.from.mockReturnValue({
      update: vi.fn(() => updateChain),
      delete: vi.fn(() => deleteChain),
    })
  })
  it('filters task updates by both task id and owner id', async () => {
    await updateTask('owner-1','t1',{title:'Scoped'})
    expect(mocks.eqCalls).toEqual([['id','t1'],['user_id','owner-1']])
  })
  it('filters task deletes by both task id and owner id', async () => {
    await deleteTask('owner-1','t1')
    expect(mocks.eqCalls).toEqual([['id','t1'],['user_id','owner-1']])
  })
})
