import { useAppSelector } from '../stores/hooks'
import SnackBarItem from './SnackBarItem'

const SnackBar = () => {
  const messages = useAppSelector((state) => state.snackBar.messages)

  return (
    <div className="fixed inset-0 flex flex-col-reverse md:p-9 overflow-hidden z-100 pointer-events-none">
      {messages.map((message) => (
        <SnackBarItem key={message.timestamp} {...message} />
      ))}
    </div>
  )
}

export default SnackBar
