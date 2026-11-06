import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTask, deleteTask, listTasks, updateTask, updateTaskStatus } from '../services/tasks'
import type { Task, TaskInput, TaskStatus } from '../types'

export const taskKeys = { all: ['tasks'] as const, list: (userId: string) => ['tasks', userId] as const }
export function useTasks(userId?: string) {
  return useQuery({ queryKey: taskKeys.list(userId || 'anonymous'), queryFn: () => listTasks(userId!), enabled: Boolean(userId) })
}
export function useCreateTask(userId: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: (input: TaskInput) => createTask(userId, input), onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.list(userId) }) })
}
export function useUpdateTask(userId: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: ({ taskId, input }: { taskId: string; input: Partial<TaskInput> }) => updateTask(userId, taskId, input), onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.list(userId) }) })
}
export function useUpdateTaskStatus(userId: string) {
  const client = useQueryClient()
  return useMutation({
    mutationFn: ({ taskId, status }: { taskId: string; status: TaskStatus }) => updateTaskStatus(userId, taskId, status),
    onMutate: async ({ taskId, status }) => {
      await client.cancelQueries({ queryKey: taskKeys.list(userId) })
      const previous = client.getQueryData<Task[]>(taskKeys.list(userId))
      client.setQueryData<Task[]>(taskKeys.list(userId), old => old?.map(task => task.id === taskId ? { ...task, status } : task))
      return { previous }
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) client.setQueryData(taskKeys.list(userId), context.previous)
      window.dispatchEvent(new CustomEvent('taskflow:toast', { detail: 'Could not update task status. Changes were reverted.' }))
    },
    onSettled: () => client.invalidateQueries({ queryKey: taskKeys.list(userId) }),
  })
}
export function useDeleteTask(userId: string) {
  const client = useQueryClient()
  return useMutation({ mutationFn: (taskId: string) => deleteTask(userId, taskId), onSuccess: () => client.invalidateQueries({ queryKey: taskKeys.list(userId) }) })
}
