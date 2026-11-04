import { useEffect, useState } from 'react'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types'
import { taskInputSchema } from '../lib/validation'
interface Props { task?: Task | null; onSubmit: (input: TaskInput) => Promise<void>; onCancel: () => void; isSaving?: boolean }
export function TaskForm({ task, onSubmit, onCancel, isSaving }: Props) {
  const [title,setTitle]=useState(task?.title||''); const [description,setDescription]=useState(task?.description||'')
  const [status,setStatus]=useState<TaskStatus>(task?.status||'todo'); const [priority,setPriority]=useState<TaskPriority>(task?.priority||'medium')
  const [dueDate,setDueDate]=useState(task?.due_date||''); const [error,setError]=useState('')
  useEffect(()=>{setTitle(task?.title||'');setDescription(task?.description||'');setStatus(task?.status||'todo');setPriority(task?.priority||'medium');setDueDate(task?.due_date||'');setError('')},[task])
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    const parsed=taskInputSchema.safeParse({title,description,status,priority,due_date:dueDate||null})
    if(!parsed.success){setError(parsed.error.issues[0]?.message||'Check the task details.');return}
    setError('')
    try { await onSubmit(parsed.data) } catch { setError('Could not save the task. Please try again.') }
  }
  return <form className="task-form" onSubmit={submit}>
    <div className="form-heading"><div><p className="eyebrow">{task?'Edit task':'New task'}</p><h2>{task?'Update the details':'What needs doing?'}</h2></div><button type="button" className="icon-button" onClick={onCancel} aria-label="Close form">×</button></div>
    <label>Title <input autoFocus value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Prepare launch notes" maxLength={120} required /></label>
    <label>Description <textarea value={description} onChange={e=>setDescription(e.target.value)} placeholder="Add a little context (optional)" rows={3} maxLength={500} /></label>
    <div className="form-grid"><label>Status <select value={status} onChange={e=>setStatus(e.target.value as TaskStatus)}><option value="todo">To do</option><option value="in_progress">In progress</option><option value="done">Done</option></select></label>
    <label>Priority <select value={priority} onChange={e=>setPriority(e.target.value as TaskPriority)}><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option></select></label></div>
    <label>Due date <input type="date" value={dueDate} onChange={e=>setDueDate(e.target.value)} /></label>
    {error&&<p className="form-error" role="alert">{error}</p>}
    <div className="form-actions"><button type="button" className="button secondary" onClick={onCancel}>Cancel</button><button className="button primary" disabled={isSaving}>{isSaving?'Saving…':task?'Save changes':'Add task'}</button></div>
  </form>
}
