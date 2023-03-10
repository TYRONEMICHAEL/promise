import { mdiChevronLeftCircleOutline, mdiChevronRightCircleOutline, mdiClose } from '@mdi/js'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { MenuAsideItemPremium } from '../interfaces'
import { useAppSelector } from '../stores/hooks'
import BaseIcon from '../components/BaseIcon'
import OverlayLayer from '../components/OverlayLayer'
import AsideMenuItem from './AsideMenuItem'
import AsideMenuLayer from './AsideMenuLayer'

type Props = {
  menu: MenuAsideItemPremium[]
}

const AsideMenu = ({ menu }: Props) => {
  const [isPrimaryMenuCompact, setIsPrimaryMenuCompact] = useState(true)

  const isAsideMobileExpanded = useAppSelector((state) => state.layout.isAsideMobileExpanded)
  const isAsideLgActive = useAppSelector((state) => state.layout.isAsideLgActive)

  let overlayLayerDisplayType = 'hidden'

  if (!isPrimaryMenuCompact) {
    overlayLayerDisplayType = 'hidden lg:flex'
  }

  const menuClickPrimaryMenu = (item: MenuAsideItemPremium) => {
    if (item.menu) {
      setIsPrimaryMenuCompact(false)
    }
  }

  const overlayClick = () => {
    if (!isPrimaryMenuCompact) {
      setIsPrimaryMenuCompact(true)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (!isPrimaryMenuCompact)) {
        overlayClick()
      }
    })
  })

  const expandCollapseItem: MenuAsideItemPremium = {
    label: isPrimaryMenuCompact ? 'Exapand' : 'Collapse',
    icon: isPrimaryMenuCompact ? mdiChevronRightCircleOutline : mdiChevronLeftCircleOutline,
    color: 'info',
  }

  const asideMenuLayerClassName = [
    isAsideMobileExpanded ? 'left-0' : '-left-60 lg:left-0',
    isPrimaryMenuCompact ? 'lg:w-22' : 'lg-w-64',
    isAsideLgActive ? '' : 'lg:hidden xl:flex',
  ].join(' ')

  const router = useRouter()

  useEffect(() => {
    const handleRouteChangeStart = () => {
      setIsPrimaryMenuCompact(true)
    }

    router.events.on('routeChangeStart', handleRouteChangeStart)

    // If the component is unmounted, unsubscribe
    // from the event with the `off` method:
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart)
    }
  }, [router.events])

  return (
    <>
      <AsideMenuLayer
        menu={menu}
        className={asideMenuLayerClassName}
        isCompact={isPrimaryMenuCompact}
        zIndex='z-50'
        onMenuClick={menuClickPrimaryMenu}
        footer={
          <ul className="hidden lg:block">
            <AsideMenuItem
              item={expandCollapseItem}
              isCompact={isPrimaryMenuCompact}
              onMenuClick={() => setIsPrimaryMenuCompact(!isPrimaryMenuCompact)}
            />
          </ul>
        }
      >
        <div className="flex-1 px-3 flex justify-center">
          {!isPrimaryMenuCompact && (<b className="font-black">two x two</b>)}
        </div>
      </AsideMenuLayer>
      <OverlayLayer type={overlayLayerDisplayType} zIndex="z-40" onClick={overlayClick} />
    </>
  )
}

export default AsideMenu
