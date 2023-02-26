import { mdiAccount, mdiAccountCircle, mdiCheckDecagram, mdiWalletMembership } from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { ReactElement, useEffect, useState } from 'react'
import BaseButtons from '../components/BaseButtons'
import BaseIcon from '../components/BaseIcon'
import CardBox from '../components/CardBox'
import IconRounded from '../components/IconRounded'
import PillTagPlain from '../components/PillTagPlain'
import SectionBannerProfile from '../components/SectionBannerProfile'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import UserCardProfileNumber from '../components/UserCardProfileNumber'
import LayoutApp from '../layouts/App'
import { getWalletPublicKey } from '../utils/wallet'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { setAccountInfo } from '../stores/mainSlice'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { LoadingIndicator } from '../components/LoadingIndicator'

const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.main)
  const wallet = useWallet()
  const { connection } = useConnection()
  const [isLoadingSol, setIsLoadingSol] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) return

    setIsLoadingSol(true)
    connection
      .getAccountInfo(wallet.publicKey)
      .then((info) => {
        if (info) {
          console.log(info.data);
          dispatch(setAccountInfo({ solBalance: info.lamports / LAMPORTS_PER_SOL }))
        }
      })
      .finally(() => {
        setIsLoadingSol(false)
      })
  }, [dispatch, wallet, connection])

  return (
    <>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiAccount} title="Profile" main />
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <CardBox flex="flex-row" className="items-center">
            <div className="flex justify-start items-start">
              <IconRounded
                icon={mdiWalletMembership}
                color="contrast"
                size="36"
                className="w-24 h-24 md:w-36 md:h-36 mr-6"
              />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center mb-3">
                    <h1 className="text-2xl mr-1.5">{getWalletPublicKey(wallet, 15)}</h1>
                    <BaseIcon path={mdiCheckDecagram} size={22} className="text-blue-400" />
                  </div>
                </div>

                <BaseButtons className="text-gray-500">
                  <PillTagPlain label="Promise Protocol" icon={mdiAccountCircle} />
                </BaseButtons>
                <BaseButtons className="mt-6" classAddon="mr-9 last:mr-0 mb-3">
                  {isLoadingSol && <LoadingIndicator />}
                  {!isLoadingSol && <UserCardProfileNumber number={user.solBalance} label="Balance" />}
                  <UserCardProfileNumber number={0} label="Squads" />
                  <UserCardProfileNumber number={0} label="Matches" />
                </BaseButtons>
              </div>
            </div>
          </CardBox>

          <SectionBannerProfile />
        </div>
      </SectionMain>
    </>
  )
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default ProfilePage
