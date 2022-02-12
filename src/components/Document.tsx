import { BsPencilFill } from 'react-icons/bs'
import cx from 'classnames'

interface DocumentProps {
  name: string;
  active: boolean;
  onActivate: () => void;
  onNameChange: (n: string) => void;
}

export default function Document(props: DocumentProps) {
  const elCls = `
  flex rounded-lg mb-1
  `
  const nameCls = `
  cursor-pointer grow
  focus:outline-none focus:ring focus:ring-blue-300
  active:bg-blue-600 active:text-slate-100
  rounded-l-lg
  `

  const inactiveCls = `
  bg-zinc-200 hover:bg-zinc-300
  `
  const activeCls = `
  bg-blue-500 hover:bg-blue-400
  text-slate-100
  `
  const buttonCls = `
  bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600
  focus:outline-none focus:ring focus:ring-emerald-300 text-white p-2
  rounded-r-lg
  `
  return <div className={elCls}>
    <button className={cx(nameCls, props.active ? activeCls : inactiveCls)}
      onClick={(e) => {
      props.onActivate()
    }}>
      {props.name}
    </button>
    <button className={buttonCls}
    onClick={(e) => {
      const n = prompt('Pick new name for task list')
      if (n) {
        props.onNameChange(n)
      }
      e.stopPropagation()
    }}><BsPencilFill />
    </button>
  </div>
}
