import { mdiContentCopy } from '@mdi/js'
import { SnackBarPushedMessage } from '../interfaces'
import { useAppDispatch } from '../stores/hooks'
import { pushMessage } from '../stores/snackBarSlice'
import { truncate } from '../utils/helpers'
import BaseButton from './BaseButton'

type Props = {
  address: string
}

export const AddressComponent = ({ address }: Props) => {
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
      <p>
        {truncate(address)}...&nbsp;
        <BaseButton
          onClick={() => copyText(address)}
          icon={mdiContentCopy}
          color="void"
          outline={false}
          small
        />
      </p>
    </>
  )
}
