import { mdiAccountGroup } from '@mdi/js'
import { ReactElement, useEffect, useState } from 'react'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import LayoutApp from '../../layouts/App'
import BaseButton from '../../components/BaseButton'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Squad, createSquadForWallet, getSquadsForWallet } from '../../services/squads'
import { setSquads } from '../../stores/mainSlice'
import CardBox from '../../components/CardBox'
import CardBoxComponentEmpty from '../../components/CardBoxComponentEmpty'
import Head from 'next/head'
import { getPageTitle } from '../../config'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import IconRounded from '../../components/IconRounded'
import UserCardProfileNumber from '../../components/UserCardProfileNumber'

const SquadsPage = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.main)
  const wallet = useWallet()
  const { connection } = useConnection()
  const [isLoadingSquads, setIsLoadingSquads] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) return

    setIsLoadingSquads(true)
    getSquadsForWallet(connection, wallet)
      .then((squads) => {
        dispatch(setSquads({ squads }))
      })
      .finally(() => {
        setIsLoadingSquads(false)
      })
  }, [dispatch, wallet, connection])

  return (
    <>
      <Head>
        <title>{getPageTitle('Squads')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiAccountGroup} title="Squads">
          <BaseButton
            href="/squads/create"
            label="Create"
            icon={mdiAccountGroup}
            color="contrast"
            roundedFull
            small
          />
        </SectionTitleLineWithButton>
        {isLoadingSquads && <LoadingIndicator />}
        {!isLoadingSquads && user.squads.length <= 0 && (
          <CardBoxComponentEmpty message="Currently don't belong to any squads" />
        )}
        {!isLoadingSquads && user.squads.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            {user.squads.map((squad, index) => {
              return <SquadComponent key={index} squad={squad} />
            })}
          </div>
        )}
      </SectionMain>
    </>
  )
}

type Props = {
  squad: Squad
}

const SquadComponent = ({ squad }: Props) => {
  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <div>
            <IconRounded icon={mdiAccountGroup} color="light" className="mr-3" bg />
            <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400">
              {squad.name}
            </h3>

            <UserCardProfileNumber number={squad.members.length} label="Members" />
          </div>
        </div>
      </CardBox>
    </>
  )
}

SquadsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default SquadsPage
