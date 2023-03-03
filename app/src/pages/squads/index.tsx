import { mdiAccountGroup } from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import Head from 'next/head'
import { ReactElement, useEffect, useState } from 'react'
import BaseButton from '../../components/BaseButton'
import CardBoxComponentEmpty from '../../components/CardBoxComponentEmpty'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import LayoutApp from '../../layouts/App'
import { getSquadsForWallet } from '../../services/squads'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { setSquads } from '../../stores/mainSlice'
import { SquadComponent } from '../../components/SquadComponent'

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

SquadsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default SquadsPage
