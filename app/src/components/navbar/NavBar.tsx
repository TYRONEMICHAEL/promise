import { mdiClose, mdiDotsVertical } from '@mdi/js'
import { ReactNode, useState } from 'react'
import { containerMaxW } from '../../config'
import { MenuNavBarItem } from '../../interfaces'
import BaseIcon from '../BaseIcon'
import NavBarItemPlain from '../NavBarItemPlain'
import StyleModeNavBarButton from './items/StyleModeNavBarButton'
import WalletNavBarButton from './items/WalletNavBarButton'

type Props = {
  menu?: MenuNavBarItem[]
  className?: string
  children?: ReactNode
}

export default function NavBar({ className = '', children }: Props) {
  const [isMenuNavBarActive, setIsMenuNavBarActive] = useState(false)

  const handleMenuNavBarToggleClick = () => {
    setIsMenuNavBarActive(!isMenuNavBarActive)
  }

  return (
    <nav
      className={`${className} top-0 inset-x-0 fixed bg-gray-50 h-14 z-30 transition-position w-screen lg:w-auto dark:bg-slate-800`}
    >
      <div className={`flex lg:items-stretch ${containerMaxW}`}>
        <div className="flex flex-1 items-stretch h-14">{children}</div>
        <div className="flex-none items-stretch flex h-14 lg:hidden">
          <NavBarItemPlain onClick={handleMenuNavBarToggleClick}>
            <BaseIcon path={isMenuNavBarActive ? mdiClose : mdiDotsVertical} size="24" />
          </NavBarItemPlain>
        </div>
        <div
          className={`${
            isMenuNavBarActive ? 'block' : 'hidden'
          } max-h-screen-menu overflow-y-auto lg:overflow-visible absolute w-screen top-14 left-0 bg-gray-50 shadow-lg lg:w-auto lg:flex lg:static lg:shadow-none dark:bg-slate-800`}
        >
          <WalletNavBarButton />
        </div>
      </div>
    </nav>
  )
}
