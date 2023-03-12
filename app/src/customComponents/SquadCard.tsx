import { mdiCheckDecagram } from '@mdi/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Field, Form, Formik } from 'formik'
import { colorsOutline } from '../colors'
import CardBox from '../components/CardBox'
import FormCheckRadio from '../components/FormCheckRadio'
import { LoadingIndicator } from '../components/LoadingIndicator'
import PillTag from '../components/PillTag'
import { useMatches } from '../hooks/matches'
import { Squad } from '../interfaces/squads'
import { getSquadName, getUsername } from '../utils/names'
import { MembersAvatar } from './MembersAvatar'
import { UserAvatarType } from './UserAvatar'
import UserAvatarCurrentUser from './UserAvatarCurrentUser'

const UserCard = ({ squad, avatar }: { squad: Squad; avatar: UserAvatarType }) => {
  const username = getSquadName(new PublicKey(squad.address))

  return (
    <CardBox flex="flex-row" className="items-center mt-20 lg:mt-0 flex-1">
      <div className="flex flex-col items-center justify-around lg:justify-center">
        <UserAvatarCurrentUser className='mb-4 -mt-20 lg:mb-0' avatar={avatar} username={username} />
        <div className="space-y-3 text-center  lg:mx-12">
          <h1 className="text-2xl">
            Howdy, <b>{username}</b>!
          </h1>
          <p>This is your team name and avatar. A fresh NFT. Your squad has a current score of <b className={colorsOutline['success']}>4.5</b> after playing <b>{3}</b> matches.</p>
          <hr className="h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
          <MembersAvatar squad={squad} />
        </div>
      </div>
    </CardBox>
  )
}

export default UserCard
