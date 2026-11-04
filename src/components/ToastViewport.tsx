import { useEffect, useState } from 'react'
type ToastItem = { id: number; message: string }
export function ToastViewport() {
  const [items,setItems]=useState<ToastItem[]>([])
  useEffect(()=>{
    let nextId=0
    const onToast=(event:Event)=>{
      const message=(event as CustomEvent<string>).detail
      const id=++nextId
      setItems(current=>[...current,{id,message}])
      window.setTimeout(()=>setItems(current=>current.filter(item=>item.id!==id)),3500)
    }
    window.addEventListener('taskflow:toast',onToast)
    return ()=>window.removeEventListener('taskflow:toast',onToast)
  },[])
  return <div className="toast-viewport" aria-live="polite">{items.map(item=><div className="toast" role="status" key={item.id}>{item.message}</div>)}</div>
}
