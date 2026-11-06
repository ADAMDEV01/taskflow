import type { Task, TaskPriority, TaskStatus } from '../types'

export type TaskFilter = 'all' | TaskStatus
export type TaskSort = 'created' | 'due' | 'priority'

export function filterAndSortTasks(tasks: Task[], query: string, status: TaskFilter, priority: 'all' | TaskPriority, sort: TaskSort): Task[] {
  const rank: Record<TaskPriority, number> = { high: 0, medium: 1, low: 2 }
  const normalized = query.trim().toLowerCase()
  return tasks.filter(task =>
    (status === 'all' || task.status === status) &&
    (priority === 'all' || task.priority === priority) &&
    `${task.title} ${task.description || ''}`.toLowerCase().includes(normalized),
  ).sort((a, b) =>
    sort === 'priority' ? rank[a.priority] - rank[b.priority] :
    sort === 'due' ? (a.due_date || '9999-12-31').localeCompare(b.due_date || '9999-12-31') :
    b.created_at.localeCompare(a.created_at),
  )
}
