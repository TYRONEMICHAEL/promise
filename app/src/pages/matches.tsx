import { mdiGamepad } from '@mdi/js'
import { ReactElement } from 'react'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import LayoutApp from '../layouts/App'

const MatchesPage = () => {
  return (
    <>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiGamepad} title="Matches" />
      </SectionMain>
    </>
  )
}

MatchesPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default MatchesPage
