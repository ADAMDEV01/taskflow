import type { DragEvent } from 'react'
import type { Task, TaskStatus } from '../types'
const columns: {status:TaskStatus;label:string}[]=[{status:'todo',label:'To do'},{status:'in_progress',label:'In progress'},{status:'done',label:'Done'}]
export function TaskBoard({tasks,onStatusChange}:{tasks:Task[];onStatusChange:(id:string,status:TaskStatus)=>void}) {
 const drop=(event:DragEvent<HTMLElement>,status:TaskStatus)=>{event.preventDefault();const id=event.dataTransfer.getData('text/taskflow-id');if(id)onStatusChange(id,status)}
 return <div className="kanban-board">{columns.map(column=><section className="kanban-column" key={column.status} onDragOver={event=>event.preventDefault()} onDrop={event=>drop(event,column.status)} aria-label={column.label}>
  <header><h2>{column.label}</h2><span>{tasks.filter(task=>task.status===column.status).length}</span></header>
  {tasks.filter(task=>task.status===column.status).map(task=><article className="kanban-card" key={task.id} draggable onDragStart={event=>event.dataTransfer.setData('text/taskflow-id',task.id)}>
   <strong>{task.title}</strong>{task.description&&<p>{task.description}</p>}<span className={`priority priority-${task.priority}`}>{task.priority}</span>
  </article>)}
 </section>)}</div>
}
