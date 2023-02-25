import { mdiAccountGroup } from '@mdi/js'
import { ReactElement } from 'react'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import LayoutApp from '../layouts/App'

const SquadsPage = () => {
  return (
    <>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiAccountGroup} title="Squads" />
      </SectionMain>
    </>
  )
}

SquadsPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default SquadsPage
