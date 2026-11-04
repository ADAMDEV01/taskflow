import { z } from 'zod'
export const taskInputSchema = z.object({
  title: z.string().trim().min(1, 'Give your task a clear title.').max(120),
  description: z.string().trim().max(500).optional(),
  status: z.enum(['todo', 'in_progress', 'done']),
  priority: z.enum(['low', 'medium', 'high']),
  due_date: z.string().nullable().optional(),
})
export const profileSchema = z.object({ display_name: z.string().trim().max(60) })
