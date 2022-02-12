import { useState, useImperativeHandle, useRef, useEffect, Ref, forwardRef } from 'react'
import TextareaAutosize from 'react-textarea-autosize';
import { TaskModel } from './TaskModel'
import { getCursorPosition, isSelecting, canGoUp, canGoDown } from 'src/lib/textarea'
import cx from 'classnames'

interface TaskTextProps {
  onNewTask: () => void;
  onGoUp: () => void;
  onGoDown: () => void;
  onChange: (text: string) => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
  onToggleCheck: () => void;
  text: string;
  checked: boolean;
}

function TaskText(
  props: TaskTextProps,
  ref: Ref<HTMLTextAreaElement>
) {
  const [text, setText] = useState('')
  const [cls, setCls] = useState('bg-neutral-50')
  useEffect(() => {
    setText(props.text)
  }, [props.text])
  useEffect(() => {
    setCls(props.checked ? 'bg-amber-300' : 'bg-neutral-50/50')
  }, [props.checked])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  useImperativeHandle(ref, () => textareaRef.current!, [ref])
  useEffect(() => {
    if (!textareaRef.current) {
      return
    }
    const textarea: HTMLTextAreaElement = textareaRef.current
    function handleKeypress(e: KeyboardEvent) {
      if (e.key === 'Enter') {
        if (e.ctrlKey) {
          props.onToggleCheck()
          e.preventDefault()
        } else if (!e.shiftKey) {
          props.onNewTask()
          e.preventDefault()
        }
      }
    }
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === 'ArrowUp') {
        if (e.ctrlKey) {
          props.onMoveUp()
        } else if (canGoUp(textarea)) {
          props.onGoUp()
        }
      }
      if (e.key === 'ArrowDown') {
        if (e.ctrlKey) {
          props.onMoveDown()
        } else if (canGoDown(textarea)) {
          props.onGoDown()
        }
      }
      if (e.key === 'Backspace') {
        if (getCursorPosition(textarea) === 0 && !isSelecting(textarea)) {
          props.onDelete()
          e.preventDefault()
        }
      }
    }
    textarea.addEventListener('keypress', handleKeypress)
    textarea.addEventListener('keydown', handleKeydown)
    return () => {
      textarea.removeEventListener('keypress', handleKeypress)
      textarea.removeEventListener('keydown', handleKeydown)
    }
  }, [])
  const defaultCls = `resize-none w-full text-lg
    outline-none bg-white bg-opacity-0
    px-2 pb-1 relative top-1 rounded-lg
    antialiased text-gray-800`
  return <div style={{fontFamily: "'Lato', sans-serif"}}>
    <TextareaAutosize className={defaultCls}
      style={{
        opacity: '.8',
        textShadow: 'rgb(31 41 55 / 32%) 1px 1px 1px',
      }}
      onChange={(e) => {
        setText(e.target.value)
        props.onChange(e.target.value)
      }}
      ref={textareaRef}
      value={text}
    />
  </div>
}

export default forwardRef(TaskText)
