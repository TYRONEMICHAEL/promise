import Link from 'next/link'
import { ReactNode } from 'react'
import { BgKeyPremium } from '../interfaces'
import { gradientBgDark, gradientBgPinkRed, gradientBgPurplePink } from '../colors'
import { gradientBgYellowRed, gradientBgRedYellow } from '../colors'
import { useAppSelector } from '../stores/hooks'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import JustboilLogo from './PadelLogo'

type Props = {
  bg: BgKeyPremium
  hasPromo?: boolean
  children: ReactNode
}

const SectionFormScreen = ({ bg, hasPromo, children }: Props) => {
  const darkMode = useAppSelector((state) => state.style.darkMode)

  let colorClass = ''

  if (darkMode) {
    colorClass = gradientBgDark
  }

  switch (bg) {
    case 'purplePink':
      colorClass = gradientBgPurplePink
      break
    case 'pinkRed':
      colorClass = gradientBgPinkRed
      break
    case 'yellowRed':
      colorClass = gradientBgYellowRed
      break
    case 'redYellow':
      colorClass = gradientBgRedYellow
  }

  const routes = ['login', 'signup', 'remind', 'error']

  return (
    <section
      className={`flex flex-col items-center md:flex-row md:justify-around md:px-6 min-h-screen transition-background-image duration-1000 ${colorClass}`}
    >
      {hasPromo && (
        <div className="space-y-12 px-12">
          <div className="hidden lg:block">
            <BaseButtons type="justify-center">
              {routes.map((route) => (
                <BaseButton key={route} href={route} label={route} color="whiteDark" />
              ))}
            </BaseButtons>
          </div>

          <div className="text-center text-white py-12 md:py-0">
            <h1 className="text-5xl lg:text-6xl font-black">All instances</h1>
            <h2 className="text-2xl">managed from one place</h2>
          </div>
          <div className="hidden md:block py-12 md:py-0 text-center text-white text-opacity-50 dark:text-opacity-80">
            <Link href="/">Instagram</Link>
            <Link href="/">Telegram</Link>
            <Link href="/">Teletype</Link>
          </div>
          <div className="hidden md:block text-white">
            <Link href="/">
              <JustboilLogo className="w-auto h-12 mx-auto" />
            </Link>
          </div>
        </div>
      )}

      {children}

      {/* <slot card-className="w-11/12 md:w-7/12 lg:w-5/12 xl:w-4/12 shadow-2xl" /> */}

      {hasPromo && (
        <div v-if="hasPromo" className="md:hidden space-y-12 py-12">
          <div className="text-white text-opacity-50">
            <Link href="/">Instagram</Link>
            <Link href="/">Telegram</Link>
            <Link href="/">Teletype</Link>
          </div>
          <div className="text-white">
            <Link href="/">
              <JustboilLogo className="w-auto h-8 mx-auto" />
            </Link>
          </div>
        </div>
      )}
    </section>
  )
}

export default SectionFormScreen
