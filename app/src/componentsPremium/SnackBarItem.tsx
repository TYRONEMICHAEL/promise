import { useState } from 'react'
import { SnackBarMessage } from '../interfaces/premium'
import { getButtonColor } from '../colors'
import { useAppDispatch } from '../stores/hooks'
import { cancelMessage } from '../stores/snackBarSlice'

const SnackBarItem = ({ lifetime, timestamp, text, color }: SnackBarMessage) => {
  const [isActive, setIsActive] = useState(true)

  const dispatch = useAppDispatch()

  if (lifetime) {
    setTimeout(() => {
      setIsActive(false)
      dispatch(cancelMessage(timestamp))
    }, lifetime)
  }

  const cancelClick = () => {
    setIsActive(false)

    if (!lifetime) {
      dispatch(cancelMessage(timestamp))
    }
  }

  if (!isActive) {
    return null
  }

  return (
    <div
      v-show="isActive"
      className={`${getButtonColor(
        color,
        false,
        true
      )} self-end my-1.5 md:my-3 first:mb-0 px-6 py-4 shadow overflow-hidden w-full md:rounded-xl md:w-auto md:max-w-full cursor-pointer pointer-events-auto animate-fade-in-up-fast`}
      onClick={cancelClick}
    >
      {text}
    </div>
  )
}

export default SnackBarItem
