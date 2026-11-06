import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement, type ReactNode } from 'react'
const mocks = vi.hoisted(() => ({ listTasks:vi.fn(), updateTaskStatus:vi.fn() }))
vi.mock('../services/tasks', () => ({ ...mocks, createTask:vi.fn(), deleteTask:vi.fn(), updateTask:vi.fn() }))
import { useTasks, useUpdateTaskStatus, taskKeys } from './useTasks'
const task={id:'one',user_id:'u1',title:'Task',description:null,status:'todo' as const,priority:'low' as const,due_date:null,created_at:'',updated_at:''}
function makeWrapper(client:QueryClient){return function Wrapper({children}:{children:ReactNode}){return createElement(QueryClientProvider,{client},children)}}
describe('task query hooks',()=>{
 let client:QueryClient
 beforeEach(()=>{client=new QueryClient({defaultOptions:{queries:{retry:false},mutations:{retry:false}}});mocks.listTasks.mockResolvedValue([task]);mocks.updateTaskStatus.mockReset()})
 it('loads tasks for the active user and scopes cache keys',async()=>{
  const {result}=renderHook(()=>useTasks('u1'),{wrapper:makeWrapper(client)})
  await waitFor(()=>expect(result.current.data).toHaveLength(1))
  expect(mocks.listTasks).toHaveBeenCalledWith('u1')
  expect(taskKeys.list('u1')).not.toEqual(taskKeys.list('u2'))
 })
 it('exposes query failures for the page retry state',async()=>{
  mocks.listTasks.mockRejectedValueOnce(new Error('offline'))
  const {result}=renderHook(()=>useTasks('u1'),{wrapper:makeWrapper(client)})
  await waitFor(()=>expect(result.current.isError).toBe(true))
  expect(result.current.error?.message).toBe('offline')
 })
 it('does not fetch without an authenticated user',async()=>{
  const {result}=renderHook(()=>useTasks(undefined),{wrapper:makeWrapper(client)})
  expect(result.current.fetchStatus).toBe('idle')
  expect(mocks.listTasks).not.toHaveBeenCalled()
 })
 it('optimistically updates task status and rolls back when persistence fails',async()=>{
  client.setQueryData(taskKeys.list('u1'),[task])
  mocks.updateTaskStatus.mockRejectedValueOnce(new Error('network unavailable'))
  const toast=vi.spyOn(window,'dispatchEvent')
  const {result}=renderHook(()=>useUpdateTaskStatus('u1'),{wrapper:makeWrapper(client)})
  await act(async()=>{await expect(result.current.mutateAsync({taskId:'one',status:'done'})).rejects.toThrow('network unavailable')})
  await waitFor(()=>expect(client.getQueryData(taskKeys.list('u1'))).toEqual([task]))
  expect(toast).toHaveBeenCalled()
 })
})
