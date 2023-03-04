import BaseIcon from '../components/BaseIcon'

type Props = {
  icon: string
  h: string
  isRight?: boolean
  clickable?: boolean
  textColor?: string
  onClick?: () => void
}

const FormControlIcon = ({ textColor = 'text-gray-500', ...props }: Props) => {
  return (
    <button className="flex items-center justify-center" onClick={props.onClick}>
      <BaseIcon
        path={props.icon}
        w="w-10"
        h={props.h}
        className={`absolute top-0 z-10 ${props.isRight ? 'right-0' : 'left-0'} ${
          props.clickable ? 'cursor-pointer' : 'pointer-events-none'
        } ${textColor}`}
      />
    </button>
  )
}

export default FormControlIcon
