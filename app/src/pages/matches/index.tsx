import { mdiTableTennis, mdiTennisBall } from '@mdi/js'
import Head from 'next/head'
import Link from 'next/link'
import { ReactElement } from 'react'
import BaseButton from '../../components/BaseButton'
import CardBoxComponentEmpty from '../../components/CardBoxComponentEmpty'
import { MatchComponent } from '../../components/MatchComponent'
import { PageLoadingIndicator } from '../../components/PageLoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import { useMatches } from '../../hooks/matches'
import LayoutApp from '../../layouts/App'

const MatchesPage = () => {
  const [allMatches, isLoadingAllMatches] = useMatches(false)

  return (
    <>
      <Head>
        <title>{getPageTitle('Matches')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiTableTennis} title="Matches" excludeButton>
          <BaseButton
            href="/matches/create"
            label="Create"
            icon={mdiTennisBall}
            color="contrast"
            roundedFull
            small
          />
        </SectionTitleLineWithButton>
        {isLoadingAllMatches && <PageLoadingIndicator />}
        {!isLoadingAllMatches && allMatches.length <= 0 && (
          <CardBoxComponentEmpty message="Currently don't have any active matches" />
        )}
        {!isLoadingAllMatches && allMatches.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2 mb-6">
            {allMatches.map((match, index) => {
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
