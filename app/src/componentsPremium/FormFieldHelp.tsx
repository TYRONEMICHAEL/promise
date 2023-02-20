import { controlTextColor } from '../colorsPremium'

type Props = {
  help?: string
  error?: string
  success?: string
  className?: string
}

const FormFieldHelp = ({ help, error, success, className }: Props) => {
  const computedHelp = error && typeof error === 'string' ? error : help

  if (!computedHelp) {
    return null
  }

  const color = controlTextColor(error, success)

  return (
    <div className={`text-xs ${color ?? 'text-gray-500 dark:text-gray-400'} ${className}`}>
      {computedHelp}
    </div>
  )
}

export default FormFieldHelp
