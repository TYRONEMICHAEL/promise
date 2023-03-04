import { useEffect, useState } from 'react'
import { colorsBgLight } from '../colors'
import type { ColorKey } from '../interfaces'

type Props = {
  color: ColorKey
  position?: string
}

const UpdateMark = ({ color, position = 'top-0 right-0' }: Props) => {
  const [hasPing, setHasPing] = useState(true)

  useEffect(() => {
    setTimeout(() => {
      setHasPing(false)
    }, 3000)
  })

  return (
    <div
      className={`w-2.5 h-2.5 rounded-full absolute ${position} ${colorsBgLight[color]} ${
        hasPing ? 'animate-ping' : ''
      }`}
    />
  )
}

export default UpdateMark
