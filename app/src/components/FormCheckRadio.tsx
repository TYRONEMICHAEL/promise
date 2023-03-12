import { ReactNode } from 'react'

type Props = {
  children: ReactNode
  type: 'checkbox' | 'radio' | 'switch'
  label?: string
  className?: string
}

const FormCheckRadio = (props: Props) => {
  return (
    <label className={`${props.type} ${props.className}`}>
      {props.children}
      <span className="check" />
      <span className="text-gray-500 dark:text-slate-400 pl-2"><small>{props.label}</small></span>
    </label>
  )
}

export default FormCheckRadio
