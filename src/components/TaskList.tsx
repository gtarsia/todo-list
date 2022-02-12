import { useState, useRef, useEffect, useCallback } from 'react'
import Task, { TaskRef } from './Task'
import { TaskModel } from './TaskModel'

function emptyTask(): TaskModel {
  return { checked: false, text: '' }
}

function taskKey(id: string) {
  return `tasks:${id}`
}

function load(id: string): TaskModel[] {
  const tasksItem = window.localStorage.getItem(taskKey(id))
  let tasks: TaskModel[] = []
  if (tasksItem) {
    tasks = JSON.parse(tasksItem) as TaskModel[]
  }
  return tasks
}

export function TaskList(props: { id: string }) {
  const [tasks, setTasks] = useState<TaskModel[]>([])
  const [loadFocus, setLoadFocus] = useState(false)
  const tasksRef = useRef<Array<TaskRef | null>>([])
  function save() {
    window.localStorage.setItem(taskKey(props.id), JSON.stringify(tasks))
  }
  useEffect(() => {
    let t = load(props.id)
    if (t && t.length === 0) {
      t = [emptyTask()]
    }
    setTasks(t)
  }, [props.id])
  useEffect(() => {
    if (!loadFocus && tasksRef.current?.[0]) {
      tasksRef.current[0].focus()
      setLoadFocus(true)
    }
  }, [tasksRef.current])
  useEffect(() => {
     tasksRef.current = tasksRef.current.slice(0, tasks.length);
     save()
  }, [tasks]);
  const createTask = useCallback((i: number) => {
    setTasks(tasks => {
      const t = tasks.slice()
      t.splice(i + 1, 0, emptyTask())
      setTasks(t)
      return t
    })
    tasksRef.current[i + 1]?.focus()
  }, [tasks])
  const deleteTask = useCallback((i: number) => {
    tasksRef.current[i - 1]?.focus()
    setTasks(tasks => {
      const t = tasks.slice()
      t.splice(i, 1)
      return t
    })
  }, [tasks])
  const moveTaskToEnd = useCallback((i: number, task: TaskModel) => {
    const found = tasksRef.current[i - 1] || tasksRef.current[i + 1]
    if (found) {
      found.focus()
    }
    setTasks(tasks => {
      const t = tasks.slice()
      t.splice(i, 1)
      t.push(task)
      return t
    })
  }, [tasks])
  function onTaskChange(i: number, task: TaskModel) {
    if (task.checked) {
      moveTaskToEnd(i, task)
    } else {
      setTasks(tasks => {
        const t = tasks.slice()
        t[i] = task
        return t
      })
    }
  }
  function moveTaskUp(i: number) {
    if (i === 0) {
      return
    }
    setTasks(tasks => {
      tasks = tasks.slice()
      const [rem] = tasks.splice(i, 1)
      tasks.splice(i - 1, 0, rem)
      return tasks
    })
    tasksRef.current[i - 1]?.focus()
  }
  function moveTaskDown(i: number) {
    if (i >= tasks.length - 1) {
      return
    }
    setTasks(tasks => {
      tasks = tasks.slice()
      const [rem] = tasks.splice(i, 1)
      tasks.splice(i + 1, 0, rem)
      return tasks
    })
    tasksRef.current[i + 1]?.focus()
  }
  return <div className="overflow-y-scroll h-full p-4"
    style={{
      backgroundImage: 'url(paper-texture.png)',
    }}
  >
    {tasks.map((task, i) => <Task
      task={task}
      ref={el => tasksRef.current[i] = el}
      key={i}
      onNewTask={() => createTask(i)}
      onChange={(task) => onTaskChange(i, task)}
      onDelete={() => deleteTask(i)}
      onMoveUp={() => moveTaskUp(i)}
      onMoveDown={() => moveTaskDown(i)}
      onGoDown={() => {
        tasksRef.current[i+1]?.focus()
      }}
      onGoUp={() => {
        tasksRef.current[i-1]?.focus()
      }}
    />)}
  </div>
}
