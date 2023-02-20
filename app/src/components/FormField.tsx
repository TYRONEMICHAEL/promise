import { Children, ReactNode } from 'react'
import { controlTextColor } from '../colors'
import FormFieldHelp from './FormFieldHelp'

type Props = {
  label?: string
  help?: string
  error?: string
  success?: string
  horizontal: boolean
  addons: boolean
  grouped: boolean
  multiline: boolean
  children: ReactNode
}

const FormField = ({ children, ...props }: Props) => {
  const upperWrapperClass = [props.multiline ? '-mb-3' : 'mb-6']

  if (props.horizontal) {
    upperWrapperClass.push('lg:gap-6 lg:grid-cols-5')
  }

  const wrapperClass = []
  const slotsLength = Children.count(children)

  if (props.horizontal) {
    wrapperClass.push('lg:col-span-4')

    if (!props.label) {
      wrapperClass.push('lg:col-start-2')
    }
  }

  if (props.addons || props.grouped || props.multiline) {
    wrapperClass.push('flex justify-start')
  } else {
    if (slotsLength > 1) {
      wrapperClass.push('grid grid-cols-1 gap-3')
    }

    if (slotsLength === 2) {
      wrapperClass.push('md:grid-cols-2')
    }

    if (slotsLength >= 3) {
      wrapperClass.push('md:grid-cols-3')
    }
  }

  if (props.grouped) {
    wrapperClass.push('space-x-3')
  }

  if (props.multiline) {
    wrapperClass.push('flex-wrap')
  }

  const labelClass = []

  if (props.horizontal) {
    labelClass.push('lg:mb-0')
  }

  const textColor = controlTextColor(props.error, props.success)

  if (textColor) {
    labelClass.push(textColor)
  }

  return (
    <div className={`grid grid-cols-1 last:mb-0 ${upperWrapperClass.join(' ')}`}>
      {props.label && (
        <label v-if="label" className={`block font-bold mb-2 ${labelClass.join(' ')}`}>
          {props.label}
        </label>
      )}

      <div className={wrapperClass.join(' ')}>{children}</div>
      <FormFieldHelp
        className={`mt-1 ${props.horizontal ? 'lg:col-start-2 lg:col-span-4 lg:-mt-5' : ''}`}
        help={props.help}
        error={props.error}
        success={props.success}
      />
    </div>
  )
}

export default FormField
