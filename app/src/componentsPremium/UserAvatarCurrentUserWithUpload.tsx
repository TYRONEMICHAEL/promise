import { mdiCamera } from '@mdi/js'
import FormFilePicker from '../components/FormFilePicker'
import UserAvatarCurrentUser from '../components/UserAvatarCurrentUser'

type Props = {
  className?: string
}

const UserAvatarCurrentUserWithUpload = ({ className }: Props) => {
  return (
    <UserAvatarCurrentUser className={`relative ${className}`}>
      <div className="absolute right-0 bottom-0">
        <FormFilePicker icon={mdiCamera} color="info" isRoundIcon />
      </div>
    </UserAvatarCurrentUser>
  )
}

export default UserAvatarCurrentUserWithUpload
