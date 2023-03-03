import { mdiGamepad, mdiGamepadVariant } from '@mdi/js'
import { ReactElement, useEffect, useState } from 'react'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import LayoutApp from '../../layouts/App'
import Head from 'next/head'
import { getPageTitle } from '../../config'
import BaseButton from '../../components/BaseButton'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { getYourMatchesForWallet } from '../../services/matches'
import { setMatches } from '../../stores/mainSlice'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import CardBoxComponentEmpty from '../../components/CardBoxComponentEmpty'
import { MatchComponent } from '../../components/MatchComponent'
import { useRouter } from 'next/router'
import Link from 'next/link'

const MatchesPage = () => {
  const dispatch = useAppDispatch()
  const user = useAppSelector((state) => state.main)
  const wallet = useWallet()
  const { connection } = useConnection()
  const [isLoadingMatches, setIsLoadingMatches] = useState(false)

  useEffect(() => {
    if (!wallet.publicKey) return

    setIsLoadingMatches(true)
    getYourMatchesForWallet(connection, wallet)
      .then((matches) => {
        dispatch(setMatches({ matches }))
      })
      .finally(() => {
        setIsLoadingMatches(false)
      })
  }, [dispatch, wallet, connection])

  return (
    <>
      <Head>
        <title>{getPageTitle('Matches')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiGamepadVariant} title="Your Matches">
          <BaseButton
            href="/matches/create"
            label="Create"
            icon={mdiGamepad}
            color="contrast"
            roundedFull
            small
          />
        </SectionTitleLineWithButton>
        {isLoadingMatches && <LoadingIndicator />}
        {!isLoadingMatches && user.matches.length <= 0 && (
          <CardBoxComponentEmpty message="Currently don't have any active matches" />
        )}
        {!isLoadingMatches && user.matches.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 mb-6">
            {user.matches.map((match, index) => {
              return (
                <Link key={index} href={`/matches/${match.address}`}>
                  <MatchComponent match={match} />
                </Link>
              )
            })}
          </div>
        )}
      </SectionMain>
    </>
  )
}

MatchesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default MatchesPage
