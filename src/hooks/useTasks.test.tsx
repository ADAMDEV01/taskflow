import { describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
vi.mock('../services/tasks',()=>({listTasks:vi.fn().mockResolvedValue([{id:'one',user_id:'u1',title:'Task',description:null,status:'todo',priority:'low',due_date:null,created_at:'',updated_at:''}]),createTask:vi.fn(),deleteTask:vi.fn(),updateTask:vi.fn(),updateTaskStatus:vi.fn().mockResolvedValue({})}))
import { useTasks, taskKeys } from './useTasks'
function wrapper({children}:{children:ReactNode}) { const client=new QueryClient({defaultOptions:{queries:{retry:false}}}); return createElement(QueryClientProvider,{client},children) }
describe('useTasks',()=>{
 it('loads data for an authenticated user',async()=>{const {result}=renderHook(()=>useTasks('u1'),{wrapper});await waitFor(()=>expect(result.current.data).toHaveLength(1))})
 it('isolates query cache by user id',()=>{expect(taskKeys.list('u1')).not.toEqual(taskKeys.list('u2'))})
})
