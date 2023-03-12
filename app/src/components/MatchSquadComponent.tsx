import { PublicKey } from '@solana/web3.js'
import { UserAvatarType } from '../customComponents/UserAvatar'
import UserAvatarCurrentUser from '../customComponents/UserAvatarCurrentUser'
import { Squad } from '../interfaces/squads'
import { getSquadName } from '../utils/names'
import { AddressComponent } from './AddressComponent'

type Props = {
  squad: Squad
}

export const MatchSquadComponent = ({ squad }: Props) => {
  const username = getSquadName(new PublicKey(squad.address))
  return (
    <div className="grid place-items-center">
      <UserAvatarCurrentUser className="w-1/2" avatar={UserAvatarType.bot} username={username} />
      <p>
        <b>{username}</b>
      </p>
      <div className="text-gray-500 dark:text-slate-400">
        <small>
          <AddressComponent address={squad.address} size={12} />
        </small>
      </div>
    </div>
  )
}
