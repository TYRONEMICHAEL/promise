import { mdiAccountMultiple, mdiAccountMultiplePlus } from '@mdi/js'
import Head from 'next/head'
import { ReactElement } from 'react'
import BaseButton from '../../components/BaseButton'
import CardBoxComponentEmpty from '../../components/CardBoxComponentEmpty'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { SquadComponent } from '../../components/SquadComponent'
import { getPageTitle } from '../../config'
import { useSquads } from '../../hooks/squads'
import LayoutApp from '../../layouts/App'
import Link from 'next/link'

const SquadsPage = () => {
  const [squads, isLoadingSquads] = useSquads()

  return (
    <>
      <Head>
        <title>{getPageTitle('Squads')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiAccountMultiple} title="Squads">
          <BaseButton
            href="/squads/create"
            label="Create"
            icon={mdiAccountMultiplePlus}
            color="contrast"
            roundedFull
            small
          />
        </SectionTitleLineWithButton>

        {isLoadingSquads && <LoadingIndicator />}
        {!isLoadingSquads && squads.length <= 0 && (
          <CardBoxComponentEmpty message="You currently don't have/belong to any squads." />
        )}
        {!isLoadingSquads && squads.length > 0 && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 md:grid-cols-2 mb-6">
            {squads.map((squad, index) => {
              return (
                <Link key={index} href={`/squads/${squad.address}`}>
                  <SquadComponent key={index} squad={squad} />
                </Link>
              )
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
