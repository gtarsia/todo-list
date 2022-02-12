import { useRef, Ref, forwardRef, useImperativeHandle } from 'react'
import { Checkbox } from './Checkbox'
import TaskText from './TaskText'
import { TaskModel } from './TaskModel'

interface TaskProps {
  onNewTask: () => void;
  onGoUp: () => void;
  onGoDown: () => void;
  onChange: (task: TaskModel) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  task: TaskModel;
}

export interface TaskRef {
  focus: () => void;
}

function Task(props: TaskProps, ref: Ref<TaskRef>) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  function focus() {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.focus()
    }
  }
  useImperativeHandle(ref, () => ({ focus }))
  function onCheckboxChange(checked: boolean) {
    props.onChange({ ...props.task, checked })
  }
  function onTextChange(text: string) {
    props.onChange({ ...props.task, text })
  }
  return <div className="flex mr-4 mb-2 select-none">
    <Checkbox onChange={onCheckboxChange} checked={props.task.checked}/>
    <div className="ml-2 grow -m-2">
      <TaskText
        text={props.task.text}
        checked={props.task.checked}
        onNewTask={props.onNewTask}
        onChange={onTextChange}
        ref={textareaRef}
        onMoveUp={props.onMoveUp}
        onMoveDown={props.onMoveDown}
        onGoUp={props.onGoUp}
        onGoDown={props.onGoDown}
        onDelete={props.onDelete}
        onToggleCheck={() => onCheckboxChange(!props.task.checked)}
      />
    </div>
  </div>
}

export default forwardRef(Task)
