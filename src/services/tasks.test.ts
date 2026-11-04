import { beforeEach, describe, expect, it, vi } from 'vitest'
const { fromMock } = vi.hoisted(() => ({ fromMock: vi.fn() }))
vi.mock('../lib/supabase', () => ({ isDemoMode:true, supabase:{ from:fromMock } }))
import { createTask, deleteTask, listTasks, updateTask } from './tasks'
const task={id:'task-1',user_id:'u1',title:'Write tests',description:null,status:'todo' as const,priority:'medium' as const,due_date:null,created_at:'2026-01-01',updated_at:'2026-01-01'}
describe('demo task service',()=>{
 beforeEach(()=>localStorage.clear())
 it('creates and scopes tasks to a demo user',async()=>{
  vi.stubGlobal('crypto',{randomUUID:()=> 'task-1'})
  await createTask('u1',{title:task.title,status:'todo',priority:'medium'})
  expect(await listTasks('u1')).toHaveLength(1)
  expect(await listTasks('u2')).toHaveLength(0)
 })
 it('updates tasks and rejects missing ids',async()=>{
  localStorage.setItem('taskflow-demo-tasks',JSON.stringify([task]))
  await updateTask('task-1',{title:'Updated'})
  expect((await listTasks('u1'))[0].title).toBe('Updated')
  await expect(updateTask('missing',{title:'No'})).rejects.toThrow('Task not found')
 })
 it('deletes a selected task',async()=>{
  localStorage.setItem('taskflow-demo-tasks',JSON.stringify([task,{...task,id:'task-2'}]))
  await deleteTask('task-1')
  expect((await listTasks('u1')).map(t=>t.id)).toEqual(['task-2'])
 })
})
