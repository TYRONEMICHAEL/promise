import { mdiBackburger, mdiForwardburger, mdiMenu } from '@mdi/js'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
import AsideMenu from '../components/AsideMenu'
import BaseIcon from '../components/BaseIcon'
import FooterBar from '../components/FooterBar'
import NavBarItemPlain from '../components/NavBarItemPlain'
import { RequiresWallet } from '../components/RequiresWallet'
import SnackBar from '../components/SnackBar'
import TwoByTwoLogo from '../components/TwoByTwoLogo'
import NavBar from '../components/navbar/NavBar'
import menu from '../menus/menu'
import { useAppDispatch, useAppSelector } from '../stores/hooks'
import { asideLgToggle, asideMobileToggle, setIsAsideMobileExpanded } from '../stores/layoutSlice'

type Props = {
  requiresWallet?: boolean
  children: ReactNode
}

export default function LayoutApp({ requiresWallet = true, children }: Props) {
  const dispatch = useAppDispatch()
  const darkMode = useAppSelector((state) => state.style.darkMode)
  const isConnected = useAppSelector((state) => state.main.isConnected)
  const isAsideMobileExpanded = useAppSelector((state) => state.layout.isAsideMobileExpanded)
  const isAsideLgActive = useAppSelector((state) => state.layout.isAsideLgActive)

  const layoutAsidePadding = isAsideLgActive ? 'lg:pl-22' : 'xl:pl-22'

  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      dispatch(setIsAsideMobileExpanded(false))
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events, dispatch])

  return (
    <div className={`${darkMode ? 'dark' : ''} overflow-hidden lg:overflow-visible`}>
      <div
        className={`${layoutAsidePadding} ${
          isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''
        } pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100`}
      >
        <NavBar className={`${layoutAsidePadding} ${isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''}`}>
          <NavBarItemPlain display="flex lg:hidden" onClick={() => dispatch(asideMobileToggle())}>
            <BaseIcon path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger} size="24" />
          </NavBarItemPlain>
          <NavBarItemPlain
            display="hidden lg:flex xl:hidden"
            onClick={() => dispatch(asideLgToggle())}
          >
            <BaseIcon path={mdiMenu} size="24" />
          </NavBarItemPlain>
          <section className={`mb-6 flex items-center justify-center py-6`}>
            <div className="flex items-center justify-center">
              <TwoByTwoLogo />
              <div className="px-1" />
              <h1 className={`leading-tight text-3xl`}>two x two</h1>
            </div>
          </section>
        </NavBar>
        {isConnected && <AsideMenu menu={menu} />}
        {(!requiresWallet || isConnected) && children}
        {requiresWallet && !isConnected && <RequiresWallet />}
        <FooterBar />
        <SnackBar />
      </div>
    </div>
  )
}
