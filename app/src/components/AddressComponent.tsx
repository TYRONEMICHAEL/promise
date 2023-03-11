import { mdiContentCopy } from '@mdi/js'
import { SnackBarPushedMessage } from '../interfaces'
import { useAppDispatch } from '../stores/hooks'
import { pushMessage } from '../stores/snackBarSlice'
import { truncate } from '../utils/helpers'
import BaseButton from './BaseButton'

type Props = {
  address: string
  size?: string | number
}

export const AddressComponent = ({ address, size }: Props) => {
  const dispatch = useAppDispatch()

  const createSnackbarMessage: (message, success) => SnackBarPushedMessage = (
    message: string,
    success: boolean
  ) => {
    return {
      text: message,
      lifetime: 3000,
      color: success ? 'success' : 'danger',
    }
  }

  const copyText = (text: string) => {
    navigator.clipboard.writeText(text)
    const message = createSnackbarMessage('Copied text', true)
    dispatch(pushMessage(message))
  }

  return (
    <>
      <div>
        {truncate(address)}...&nbsp;
        <BaseButton
          onClick={() => copyText(address)}
          icon={mdiContentCopy}
          iconSize={size}
          color="void"
          outline={false}
          small
          border={false}
        />
      </div>
    </>
  )
}
