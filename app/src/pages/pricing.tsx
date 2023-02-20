import Head from 'next/head'
import { useState } from 'react'
import type { ReactElement } from 'react'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import LayoutAuthenticated from '../layouts/Authenticated'
import CardBoxPricing from '../components/CardBoxPricing'
import SectionMain from '../components/SectionMain'
import SectionTitle from '../components/SectionTitle'
import type { PricingItem } from '../interfaces'
import { getPageTitle } from '../config'

const PricingPage = () => {
  const [period, setPeriod] = useState('mo')

  const pricing = {
    mo: {
      beginner: 19,
      standard: 29,
      pro: 39,
    },
    yr: {
      beginner: 199,
      standard: 299,
      pro: 399,
    },
  }

  const itemBeginner: PricingItem = {
    title: 'Beginner',
    subTitle: 'Essentials',
    label: 'Good start',
    labelType: 'contrast',
    options: [
      {
        main: '5',
        sub: 'units',
      },
      {
        main: '100',
        sub: 'minutes',
      },
      {
        main: '1',
        sub: 'user',
      },
    ],
  }

  const itemStandard: PricingItem = {
    title: 'Standard',
    subTitle: 'Basic options',
    label: 'Most popular',
    labelType: 'info',
    options: [
      {
        main: '25',
        sub: 'units',
      },
      {
        main: '1,000',
        sub: 'minutes',
      },
      {
        main: '10',
        sub: 'users',
      },
      {
        main: 'Hosted',
        sub: 'runners',
      },
    ],
  }

  const itemPro: PricingItem = {
    title: 'Pro',
    subTitle: 'All options',
    label: 'For large projects',
    labelType: 'contrast',
    options: [
      {
        main: '100',
        sub: 'units',
      },
      {
        main: '10,000',
        sub: 'minutes',
      },
      {
        main: 'Unlimited',
        sub: 'users',
      },
      {
        main: 'Hosted',
        sub: 'runners',
      },
      {
        main: 'SLA',
        sub: 'guaranteed',
      },
    ],
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Pricing sample')}</title>
      </Head>

      <SectionTitle custom>
        <h1 className="text-5xl lg:text-6xl font-black">Sample Pricing</h1>
        <h2 className="text-2xl mb-12">some catchy headline</h2>
        <BaseButtons type="justify-center" noWrap>
          <BaseButton
            label="Monthly"
            outline={period !== 'mo'}
            color="contrast"
            roundedFull
            onClick={() => setPeriod('mo')}
          />
          <BaseButton
            label="Yearly"
            outline={period !== 'yr'}
            color="contrast"
            roundedFull
            onClick={() => setPeriod('yr')}
          />
        </BaseButtons>
      </SectionTitle>

      <SectionMain>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <CardBoxPricing
            item={itemBeginner}
            price={pricing[period].beginner}
            period={period}
            className="xl:ml-12"
          />

          <CardBoxPricing
            item={itemStandard}
            price={pricing[period].standard}
            period={period}
            isMain
          />

          <CardBoxPricing
            item={itemPro}
            price={pricing[period].pro}
            period={period}
            className="xl:mr-12"
          />
        </div>
      </SectionMain>
    </>
  )
}

PricingPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default PricingPage
