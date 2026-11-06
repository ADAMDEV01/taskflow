import { describe, expect, it } from 'vitest'
import { filterAndSortTasks, paginateTasks } from './taskFilters'
import type { Task } from '../types'
const tasks: Task[] = [
 {id:'1',user_id:'u',title:'Write tests',description:'API coverage',status:'todo',priority:'high',due_date:'2026-11-10',created_at:'2026-11-01',updated_at:''},
 {id:'2',user_id:'u',title:'Ship UI',description:null,status:'done',priority:'low',due_date:null,created_at:'2026-11-03',updated_at:''},
 {id:'3',user_id:'u',title:'Review API',description:'security checks',status:'in_progress',priority:'medium',due_date:'2026-11-08',created_at:'2026-11-02',updated_at:''},
]
describe('task filtering, search and sorting',()=>{
 it('searches title and description case-insensitively',()=>expect(filterAndSortTasks(tasks,'SECURITY','all','all','created').map(t=>t.id)).toEqual(['3']))
 it('combines status and priority filters',()=>expect(filterAndSortTasks(tasks,'','todo','high','created').map(t=>t.id)).toEqual(['1']))
 it('sorts by due date with undated tasks last',()=>expect(filterAndSortTasks(tasks,'','all','all','due').map(t=>t.id)).toEqual(['3','1','2']))
 it('sorts newest first by creation date',()=>expect(filterAndSortTasks(tasks,'','all','all','created').map(t=>t.id)).toEqual(['2','3','1']))
 it('paginates the filtered result in stable order',()=>expect(paginateTasks(filterAndSortTasks(tasks,'','all','all','created'),2).map(t=>t.id)).toEqual(['2','3']))
})
