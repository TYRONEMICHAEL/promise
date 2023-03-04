import { mdiPencil } from '@mdi/js'
import Head from 'next/head'
import { ReactElement } from 'react'
import IconRounded from '../components/IconRounded'
import SectionFullScreen from '../components/SectionFullScreen'
import SectionTitle from '../components/SectionTitle'
import { getPageTitle } from '../config'
import LayoutApp from '../layouts/App'

const WelcomePage = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle('Welcome')}</title>
      </Head>
      {/* Introduction */}
      <SectionFullScreen>
        <SectionTitle>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus, erat quis maximus
          interdum, nibh felis interdum diam, at luctus diam purus ut tortor. Curabitur vitae
          tincidunt eros. Phasellus eget lorem eget nisi euismod faucibus. Etiam ac accumsan augue.
          Quisque lectus arcu, interdum eget consequat sit amet, iaculis fringilla lacus. Donec
          posuere diam elit. In non orci suscipit, cursus metus eu, aliquet libero.
        </SectionTitle>
      </SectionFullScreen>

      {/* What is it? */}
      <SectionFullScreen>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <SectionTitle>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus, erat quis maximus
            interdum, nibh felis interdum diam, at luctus diam purus ut tortor. Curabitur vitae
            tincidunt eros. Phasellus eget lorem eget nisi euismod faucibus.
          </SectionTitle>
          <IconRounded icon={mdiPencil} color="light" />
        </div>
      </SectionFullScreen>
    </>
  )
}

WelcomePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp requiresWallet={false}>{page}</LayoutApp>
}

export default WelcomePage
