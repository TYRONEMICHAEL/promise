import { ReactNode } from 'react'
import { MenuAsideItemPremium } from '../interfaces'
import { useAppSelector } from '../stores/hooks'
import AsideMenuList from './AsideMenuList'

type Props = {
  menu: MenuAsideItemPremium[]
  activeSecondaryMenuKey?: string | null
  zIndex?: string
  isCompact?: boolean
  children: ReactNode
  footer?: ReactNode
  className?: string
  onMenuClick?: (item: MenuAsideItemPremium) => void
}

const AsideMenuLayer = ({
  menu,
  activeSecondaryMenuKey,
  zIndex = 'z-50',
  isCompact,
  children,
  footer,
  className,
  onMenuClick,
}: Props) => {
  const asideStyle = useAppSelector((state) => state.style.asideStyle)
  const asideBrandStyle = useAppSelector((state) => state.style.asideBrandStyle)
  const asideScrollbarsStyle = useAppSelector((state) => state.style.asideScrollbarsStyle)

  return (
    <aside
      className={`lg:py-2 lg:pl-2 flex w-60 fixed top-0 h-screen transition-position overflow-hidden ${zIndex} ${className}`}
    >
      <div
        className={`lg:rounded-2xl flex-1 flex flex-col overflow-hidden dark:bg-slate-900 ${asideStyle}`}
      >
        <div
          className={`flex flex-row w-full shrink-0 h-14 items-center dark:bg-slate-900 ${asideBrandStyle}`}
        >
          {children}
        </div>
        <div className={`flex-1 overflow-y-auto overflow-x-hidden ${asideScrollbarsStyle}`}>
          <AsideMenuList
            menu={menu}
            isCompact={isCompact}
            activeSecondaryMenuKey={activeSecondaryMenuKey}
            onMenuClick={onMenuClick}
          />
        </div>

        {footer}
      </div>
    </aside>
  )
}

export default AsideMenuLayer
