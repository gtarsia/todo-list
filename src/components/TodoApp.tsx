import { useState } from 'react'
import { TaskList } from './TaskList'
import DocumentSelector from './DocumentSelector'

export default function TodoApp() {
  const [listId, setListId] = useState('')
  console.log(listId)
  return <div className="flex h-full">
    <div className="w-52">
      <DocumentSelector onListChange={(id) => setListId(id)}/>
    </div>
    <div className="grow">
      {listId && <TaskList id={listId} />}
    </div>
  </div>
}
