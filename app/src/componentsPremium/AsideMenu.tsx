import { mdiChevronLeftCircleOutline, mdiChevronRightCircleOutline, mdiClose } from '@mdi/js'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import type { MenuAsideItemPremium } from '../interfaces/premium'
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

  const [secondaryMenuItem, setSecondaryMenuItem] = useState(null)

  const isAsideMobileExpanded = useAppSelector((state) => state.layout.isAsideMobileExpanded)
  const isAsideLgActive = useAppSelector((state) => state.layout.isAsideLgActive)

  let overlayLayerDisplayType = 'hidden'

  if (secondaryMenuItem) {
    overlayLayerDisplayType = 'flex'
  } else if (!isPrimaryMenuCompact) {
    overlayLayerDisplayType = 'hidden lg:flex'
  }

  const closeSecondaryMenu = () => {
    setSecondaryMenuItem(null)
  }

  const menuClickPrimaryMenu = (item: MenuAsideItemPremium) => {
    if (item.menu) {
      setIsPrimaryMenuCompact(false)
    }

    if (item.menuSecondary) {
      if (secondaryMenuItem && item.key === secondaryMenuItem.key) {
        closeSecondaryMenu()
      } else {
        setSecondaryMenuItem(item)
      }
    }
  }

  const menuClickSecondaryMenu = () => {
    //
  }

  const overlayClick = () => {
    if (secondaryMenuItem) {
      closeSecondaryMenu()
    } else if (!isPrimaryMenuCompact) {
      setIsPrimaryMenuCompact(true)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && (secondaryMenuItem || !isPrimaryMenuCompact)) {
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
        zIndex={secondaryMenuItem ? 'z-40 md:z-50' : 'z-50'}
        activeSecondaryMenuKey={secondaryMenuItem?.key}
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
          <b className="font-black">One</b>
        </div>
      </AsideMenuLayer>
      {!!secondaryMenuItem && (
        <AsideMenuLayer
          menu={secondaryMenuItem.menuSecondary}
          className={`right-0 md:right-auto animate-fade-in-right-fast lg:animate-fade-in-left-fast ${
            isPrimaryMenuCompact ? 'lg:left-22' : 'md:left-60'
          }`}
          onMenuClick={menuClickSecondaryMenu}
        >
          {!!secondaryMenuItem.icon && <BaseIcon path={secondaryMenuItem.icon} w="w-16" />}
          <div className="flex-1">{secondaryMenuItem.label}</div>
          <button onClick={closeSecondaryMenu} className="flex items-center justify-center">
            <BaseIcon path={mdiClose} w="w-12" />
          </button>
        </AsideMenuLayer>
      )}

      <OverlayLayer type={overlayLayerDisplayType} zIndex="z-40" onClick={overlayClick} />
    </>
  )
}

export default AsideMenu
