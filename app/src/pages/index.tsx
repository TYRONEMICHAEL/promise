import Head from 'next/head'
import Image from 'next/image'
import { ReactElement, useState } from 'react'
import bg from '../../assets/bg.jpg'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import CardBoxPricing from '../components/CardBoxPricing'
import SectionFullScreen from '../components/SectionFullScreen'
import SectionMain from '../components/SectionMain'
import SectionTitle from '../components/SectionTitle'
import WalletNavBarButton from '../components/navbar/items/WalletNavBarButton'
import { getPageTitle } from '../config'
import { PricingItem } from '../interfaces'
import LayoutApp from '../layouts/App'

const WelcomePage = () => {
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
    <div>
      <Head>
        <title>{getPageTitle('Welcome')}</title>
      </Head>
      <SectionFullScreen>
        <Image src={bg.src} alt="background" fill className="opacity-75 object-cover" />
        <div className="z-10 -mt-96">
          <SectionTitle custom>
            <h1 className="text-5xl lg:text-6xl font-black">two x two</h1>
            <h2 className="text-2xl mb-12">some catchy headline</h2>
            <BaseButtons type="justify-center" noWrap>
              <WalletNavBarButton />
            </BaseButtons>
          </SectionTitle>
        </div>
      </SectionFullScreen>

      <SectionTitle custom>
        <h1 className="text-5xl lg:text-6xl font-black">Pricing</h1>
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
      <SectionFullScreen>
        <SectionTitle>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. In cursus, erat quis maximus
          interdum, nibh felis interdum diam, at luctus diam purus ut tortor. Curabitur vitae
          tincidunt eros. Phasellus eget lorem eget nisi euismod faucibus.
        </SectionTitle>
      </SectionFullScreen>
    </div>
  )
}

WelcomePage.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutApp requiresWallet={false} showsNavBar={false}>
      {page}
    </LayoutApp>
  )
}

export default WelcomePage
