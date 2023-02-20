import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { gradientBgPurplePink } from '../colors'
import CardBox from '../components/CardBox'
import SectionMain from '../components/SectionMain'
import SectionTitle from '../components/SectionTitle'
import { appTitle, getPageTitle } from '../config'
import LayoutGuest from '../layouts/Guest'
import { useAppDispatch } from '../stores/hooks'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import { mdiChartTimelineVariant } from '@mdi/js'

const StyleSelect = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()

  return (
    <>
      <Head>
        <title>{getPageTitle('Welcome')}</title>
      </Head>
      <SectionMain>
        <SectionTitle>Welcome to Padel 2x2</SectionTitle>
      </SectionMain>
    </>
  )
}

StyleSelect.getLayout = function getLayout(page: ReactElement) {
  return <LayoutGuest>{page}</LayoutGuest>
}

export default StyleSelect
