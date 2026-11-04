import { beforeEach, describe, expect, it, vi } from 'vitest'
const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }))
vi.mock('../lib/supabase', () => ({ isDemoMode:true, supabase:{ from:fromMock } }))
import { getProfile, upsertProfile } from './profiles'
describe('profile service in demo mode',()=>{
 beforeEach(()=>localStorage.clear())
 it('returns an empty profile until a name is saved',async()=>{expect(await getProfile('demo-user')).toEqual({id:'demo-user',display_name:null,avatar_url:null})})
 it('persists and trims the display name',async()=>{await upsertProfile('demo-user','  Adam  ');expect(await getProfile('demo-user')).toMatchObject({display_name:'Adam'})})
})
