import { mdiAccountCircle } from '@mdi/js'
import { ReactElement } from 'react'
import SectionMain from '../components/SectionMain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import LayoutApp from '../layouts/App'

const ProfilePage = () => {
  return (
    <>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiAccountCircle} title="Profile" />
      </SectionMain>
    </>
  )
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default ProfilePage
