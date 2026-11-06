import { beforeEach, describe, expect, it, vi } from 'vitest'
const mocks = vi.hoisted(() => ({
  from: vi.fn(),
  eq: vi.fn(),
  update: vi.fn(),
  delete: vi.fn(),
  select: vi.fn(),
  single: vi.fn(),
  then: vi.fn(),
}))
vi.mock('../lib/supabase', () => ({ isDemoMode: false, supabase: { from: mocks.from } }))
import { deleteTask, updateTask } from './tasks'

describe('Supabase task ownership filters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const builder = {
      update: mocks.update.mockReturnThis(),
      delete: mocks.delete.mockReturnThis(),
      eq: mocks.eq.mockReturnThis(),
      select: mocks.select.mockReturnThis(),
      single: mocks.single.mockResolvedValue({ data: { id:'t1', user_id:'owner-1', title:'Scoped', status:'todo', priority:'low', description:null, due_date:null, created_at:'', updated_at:'' }, error:null }),
      then: (resolve: (value: { error: null }) => unknown) => Promise.resolve({ error:null }).then(resolve),
    }
    mocks.from.mockReturnValue(builder)
  })
  it('filters task updates by both task id and owner id', async () => {
    await updateTask('owner-1','t1',{title:'Scoped'})
    expect(mocks.eq.mock.calls).toEqual([['id','t1'],['user_id','owner-1']])
  })
  it('filters task deletes by both task id and owner id', async () => {
    await deleteTask('owner-1','t1')
    expect(mocks.eq.mock.calls).toEqual([['id','t1'],['user_id','owner-1']])
  })
})
