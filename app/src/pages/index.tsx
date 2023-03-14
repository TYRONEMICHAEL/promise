import Head from 'next/head'
import Image from 'next/image'
import { ReactElement, useState } from 'react'
import bg from '../../assets/bg.jpg'
import justin from '../../assets/justin.jpeg'
import paige from '../../assets/paige.png'
import tyrone from '../../assets/tyrone.jpg'
import { colorsOutline } from '../colors'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import CardBox from '../components/CardBox'
import CardBoxPricing from '../components/CardBoxPricing'
import SectionFullScreen from '../components/SectionFullScreen'
import SectionMain from '../components/SectionMain'
import SectionTitle from '../components/SectionTitle'
import WalletNavBarButton from '../components/navbar/items/WalletNavBarButton'
import { getPageTitle } from '../config'
import { PricingItem } from '../interfaces'
import LayoutApp from '../layouts/App'
import { useAppSelector } from '../stores/hooks'
import { useRouter } from 'next/router'

const WelcomePage = () => {
  const router = useRouter()
  const [period, setPeriod] = useState('mo')
  const [teamMember, setTeamMember] = useState('ty')

  const isConnected = useAppSelector((state) => state.main.isConnected)
  if (isConnected) {
    router.push('/profile')
  }

  const pricing = {
    mo: {
      beginner: 0,
      standard: 19,
      pro: 49,
    },
    yr: {
      beginner: 0,
      standard: 199,
      pro: 499,
    },
  }

  const itemBeginner: PricingItem = {
    title: 'Free',
    subTitle: 'Absolute Beginners',
    label: 'Good Start',
    labelType: 'contrast',
    options: [
      {
        main: '1',
        sub: 'squad',
      },
      {
        main: '5',
        sub: 'matches',
      },
      {
        main: '0.1 SOL',
        sub: 'per match',
      },
    ],
  }

  const itemStandard: PricingItem = {
    title: 'Enthusiasts',
    subTitle: 'Regular Players',
    label: 'Most Popular',
    labelType: 'info',
    options: [
      {
        main: '5',
        sub: 'squads',
      },
      {
        main: '25',
        sub: 'matches',
      },
      {
        main: '0.1 SOL',
        sub: 'per match',
      },
      {
        main: 'NFT',
        sub: 'minting',
      },
      {
        main: '3',
        sub: 'free matches',
      },
    ],
  }

  const itemPro: PricingItem = {
    title: 'Pro',
    subTitle: 'Fully Equipped',
    label: 'Pro Leagues',
    labelType: 'contrast',
    options: [
      {
        main: 'unlimited',
        sub: 'squads',
      },
      {
        main: 'unlimited',
        sub: 'matches',
      },
      {
        main: '0.01 SOL',
        sub: 'per match',
      },
      {
        main: 'NFT',
        sub: 'minting',
      },
      {
        main: '10',
        sub: 'free matches',
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
            <h2 className="text-2xl mb-12">padel</h2>
            <BaseButtons type="justify-center" noWrap>
              <WalletNavBarButton />
            </BaseButtons>
          </SectionTitle>
        </div>
      </SectionFullScreen>

      <SectionTitle custom>
        <h1 className="text-5xl lg:text-6xl font-black">Pricing</h1>
        <h2 className="text-2xl mb-12">coming soon</h2>
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
        <SectionTitle custom>
          <h1 className="text-5xl lg:text-6xl font-black">Team</h1>
          <h2 className="text-2xl mb-12">creators of two x two</h2>
          <BaseButtons type="justify-center" noWrap>
            <BaseButton
              label="Tyrone"
              outline={teamMember == 'ty'}
              color="contrast"
              roundedFull
              onClick={() => setTeamMember('ty')}
            />
            <BaseButton
              label="Justin"
              outline={teamMember == 'ju'}
              color="contrast"
              roundedFull
              onClick={() => setTeamMember('ju')}
            />
            <BaseButton
              label="Paige"
              outline={teamMember == 'pa'}
              color="contrast"
              roundedFull
              onClick={() => setTeamMember('pa')}
            />
          </BaseButtons>
        </SectionTitle>
        <SectionTitle>
          {teamMember == 'ty' && (
            <div>
              <CardBox flex="flex-row" className="items-center mt-20 lg:mt-0 flex-1">
                <div className="flex flex-col items-center justify-around lg:justify-center">
                  <Image
                    src={tyrone.src}
                    alt="Tyrone"
                    width={300}
                    height={300}
                    className="mb-4 -mt-20 lg:mb-0 rounded-full"
                  />
                  <div className="text-center lg:mx-12 mt-6">
                    <h1 className="text-2xl">
                      <b className={colorsOutline['contrast']}>Tyrone</b> Avnit
                    </h1>
                    <p className="mt-6">
                      is a <b className={colorsOutline['contrast']}>web3 solutions architect</b>{' '}
                      with more than a decade of experience building production software &{' '}
                      <b className={colorsOutline['contrast']}>padel enthusiast</b>
                    </p>
                  </div>
                </div>
              </CardBox>
            </div>
          )}
          {teamMember == 'ju' && (
            <div>
              <CardBox flex="flex-row" className="items-center mt-20 lg:mt-0 flex-1">
                <div className="flex flex-col items-center justify-around lg:justify-center">
                  <Image
                    src={justin.src}
                    alt="Justin"
                    width={300}
                    height={300}
                    className="mb-4 -mt-20 lg:mb-0 rounded-full"
                  />
                  <div className="text-center lg:mx-12 mt-6">
                    <h1 className="text-2xl">
                      <b className={colorsOutline['contrast']}>Justin</b> Guedes
                    </h1>
                    <p className="mt-6">
                      is a <b className={colorsOutline['contrast']}>10x engineer</b> with more than
                      10 years experience building production software &{' '}
                      <b className={colorsOutline['contrast']}>padel enthusiast</b>
                    </p>
                  </div>
                </div>
              </CardBox>
            </div>
          )}
          {teamMember == 'pa' && (
            <div>
              <CardBox flex="flex-row" className="items-center mt-20 lg:mt-0 flex-1">
                <div className="flex flex-col items-center justify-around lg:justify-center">
                  <Image
                    src={paige.src}
                    alt="Paige"
                    width={300}
                    height={300}
                    className="mb-4 -mt-20 lg:mb-0 rounded-full"
                  />
                  <div className="text-center lg:mx-12 mt-6">
                    <h1 className="text-2xl">
                      <b className={colorsOutline['contrast']}>Paige</b> Avnit
                    </h1>
                    <p className="mt-6">
                      is a <b className={colorsOutline['contrast']}>creative strategist</b> with
                      more than a decade of experience in the advertising industry &{' '}
                      <b className={colorsOutline['contrast']}>padel enthusiast</b>
                    </p>
                  </div>
                </div>
              </CardBox>
            </div>
          )}
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
