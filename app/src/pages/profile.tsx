import { mdiAccount } from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ReactElement, useEffect, useState } from 'react'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import CardBoxHistory from '../customComponents/CardBoxHistory'
import CardBoxMatches from '../customComponents/CardBoxMatches'
import CardBoxSquad from '../customComponents/CardBoxSquads'
import { UserAvatarType } from '../customComponents/UserAvatar'
import UserCard from '../customComponents/UserCard'
import LayoutApp from '../layouts/App'
import { getWalletBalance } from '../services/account'
import { useAppDispatch } from '../stores/hooks'
import { setAccountInfo } from '../stores/mainSlice'

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const wallet = useWallet()
  const { connection } = useConnection()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setIsLoadingSol] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) return
    setIsLoadingSol(true)
    getWalletBalance()
      .then((balance) => {
        dispatch(setAccountInfo({ solBalance: balance }))
      })
      .finally(() => {
        setIsLoadingSol(false)
      })
  }, [dispatch, wallet, connection])

  return (
    <>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiAccount} title="Profile" main excludeButton />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <UserCard avatar={UserAvatarType.avatar} />
          <div className='flex-1'>
            <CardBoxSquad />
            <CardBoxMatches />
            <CardBoxHistory />
          </div>
        </div>
      </SectionMain>
    </>
  )
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default ProfilePage
