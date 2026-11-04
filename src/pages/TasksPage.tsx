import { useMemo, useState } from 'react'
import { useAuth } from '../auth/AuthProvider'
import { useCreateTask, useDeleteTask, useTasks, useUpdateTask, useUpdateTaskStatus } from '../hooks/useTasks'
import { TaskCard } from '../components/TaskCard'
import { TaskBoard } from '../components/TaskBoard'
import { TaskForm } from '../components/TaskForm'
import { EmptyState } from '../components/EmptyState'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types'

export function TasksPage() {
 const {user}=useAuth()
 const {data:tasks=[],isLoading,error,refetch}=useTasks(user?.id)
 const create=useCreateTask(user!.id),update=useUpdateTask(user!.id),updateStatus=useUpdateTaskStatus(user!.id),remove=useDeleteTask(user!.id)
 const [query,setQuery]=useState(''),[visibleCount,setVisibleCount]=useState(10),[filter,setFilter]=useState<'all'|TaskStatus>('all')
 const [priority,setPriority]=useState<'all'|TaskPriority>('all'),[sort,setSort]=useState<'created'|'due'|'priority'>('created')
 const [editing,setEditing]=useState<Task|null>(null),[open,setOpen]=useState(false),[view,setView]=useState<'list'|'board'>('list')
 const shown=useMemo(()=>{
  const rank:Record<TaskPriority,number>={high:0,medium:1,low:2}
  return tasks.filter(task=>(filter==='all'||task.status===filter)&&(priority==='all'||task.priority===priority)&&`${task.title} ${task.description||''}`.toLowerCase().includes(query.toLowerCase()))
   .sort((a,b)=>sort==='priority'?rank[a.priority]-rank[b.priority]:sort==='due'?(a.due_date||'9999-12-31').localeCompare(b.due_date||'9999-12-31'):b.created_at.localeCompare(a.created_at))
 },[tasks,filter,priority,query,sort])
 async function save(input:TaskInput){if(editing)await update.mutateAsync({taskId:editing.id,input});else await create.mutateAsync(input);setOpen(false);setEditing(null)}
 function removeTask(task:Task){if(window.confirm(`Delete “${task.title}”? `))remove.mutate(task.id)}
 return <div className="dashboard">
  <section className="welcome-row compact"><div><p className="eyebrow">Workspace</p><h1>All tasks<span className="accent">.</span></h1><p className="muted">Keep the details moving forward.</p></div><button className="button primary" onClick={()=>{setEditing(null);setOpen(true)}}>+ New task</button></section>
  <section className="tasks-section full">
   <div className="toolbar"><div className="search-box"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks…" aria-label="Search tasks"/></div>
    <div className="filter-tabs" role="tablist" aria-label="Filter tasks">{(['all','todo','in_progress','done'] as const).map(item=><button key={item} className={filter===item?'active':''} onClick={()=>setFilter(item)} role="tab" aria-selected={filter===item}>{item==='all'?'All':item==='todo'?'To do':item==='in_progress'?'In progress':'Done'}</button>)}</div>
   </div>
   <div className="toolbar secondary-toolbar"><label className="toolbar-field">Priority<select value={priority} onChange={e=>setPriority(e.target.value as 'all'|TaskPriority)}><option value="all">All priorities</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
    <label className="toolbar-field">Sort by<select value={sort} onChange={e=>setSort(e.target.value as 'created'|'due'|'priority')}><option value="created">Newest</option><option value="due">Due date</option><option value="priority">Priority</option></select></label>
    <div className="view-toggle" aria-label="Task view"><button className={view==='list'?'active':''} onClick={()=>setView('list')}>List</button><button className={view==='board'?'active':''} onClick={()=>setView('board')}>Kanban</button></div>
   </div>
   {isLoading?<div className="loading-list"><span className="spinner"/>Loading tasks…</div>:error?<div className="error-panel">Couldn’t load your tasks. Check your Supabase connection and try again.<button className="button secondary" onClick={()=>refetch()}>Try again</button></div>:shown.length===0?<EmptyState filtered={tasks.length>0} onAdd={()=>setOpen(true)}/>:view==='board'?<TaskBoard tasks={shown} onStatusChange={(taskId,status)=>updateStatus.mutate({taskId,status})}/>:<><div className="task-list">{shown.slice(0,visibleCount).map(task=><TaskCard key={task.id} task={task} onStatusChange={status=>updateStatus.mutate({taskId:task.id,status})} onEdit={()=>{setEditing(task);setOpen(true)}} onDelete={()=>removeTask(task)}/>)}</div>{shown.length>visibleCount&&<div className="load-more"><button className="button secondary" onClick={()=>setVisibleCount(count=>count+10)}>Load more tasks</button><span>{Math.min(visibleCount,shown.length)} of {shown.length}</span></div>}</>}
  </section>
  {open&&<div className="modal-backdrop" role="presentation"><div className="modal" role="dialog" aria-modal="true" aria-label={editing?'Edit task':'New task'}><TaskForm task={editing} onSubmit={save} onCancel={()=>{setOpen(false);setEditing(null)}} isSaving={create.isPending||update.isPending}/></div></div>}
 </div>
}
