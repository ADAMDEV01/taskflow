import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
const mocks = vi.hoisted(() => ({ listTasks: vi.fn() }))
vi.mock('../services/tasks', () => ({ ...mocks, createTask:vi.fn(), deleteTask:vi.fn(), updateTask:vi.fn(), updateTaskStatus:vi.fn() }))
import { useTasks, taskKeys } from './useTasks'
const client = new QueryClient({ defaultOptions:{ queries:{ retry:false } } })
function wrapper({children}:{children:ReactNode}) { return createElement(QueryClientProvider,{client},children) }
describe('useTasks',()=>{
 beforeEach(()=>{client.clear();mocks.listTasks.mockResolvedValue([{id:'one',user_id:'u1',title:'Task',description:null,status:'todo',priority:'low',due_date:null,created_at:'',updated_at:''}])})
 it('loads tasks for an authenticated user',async()=>{
  const {result}=renderHook(()=>useTasks('u1'),{wrapper})
  await waitFor(()=>expect(result.current.data).toHaveLength(1))
  expect(mocks.listTasks).toHaveBeenCalledWith('u1')
 })
 it('isolates cache keys by user id',()=>{expect(taskKeys.list('u1')).not.toEqual(taskKeys.list('u2'))})
})
