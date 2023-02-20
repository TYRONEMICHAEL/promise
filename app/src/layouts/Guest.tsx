import { ReactNode } from 'react'
import FooterBar from '../components/FooterBar'
import NavBar from '../components/NavBar'
import SnackBar from '../components/SnackBar'
import guestMenuNavBar from '../menus/guestMenuNavBar'
import { useAppSelector } from '../stores/hooks'

type Props = {
  children: ReactNode
}

export default function LayoutGuest({ children }: Props) {
  const darkMode = useAppSelector((state) => state.style.darkMode)

  return (
    <div className={`${darkMode ? 'dark' : ''} overflow-hidden lg:overflow-visible`}>
      <div
        className={`pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100`}
      >
        <NavBar menu={guestMenuNavBar} />
        {children}
        <FooterBar />
        <SnackBar />
      </div>
    </div>
  )
}
