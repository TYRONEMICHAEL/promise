import { mdiMonitor } from '@mdi/js'
import { ReactElement } from 'react'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import LayoutApp from '../layouts/App'

const DashboardPage = () => {
  return (
    <>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiMonitor} title="Dashboard" />
      </SectionMain>
    </>
  )
}

DashboardPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default DashboardPage
