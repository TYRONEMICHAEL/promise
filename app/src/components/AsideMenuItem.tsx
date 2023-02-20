import { mdiChevronRight, mdiMinus, mdiPlus } from '@mdi/js'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { MenuAsideItemPremium } from '../interfaces'
import { getButtonColor } from '../colors'
import { useAppSelector } from '../stores/hooks'
import BaseIcon from '../components/BaseIcon'
import AsideMenuList from './AsideMenuList'
import UpdateMark from './UpdateMark'

type Props = {
  item: MenuAsideItemPremium
  activeSecondaryMenuKey?: string
  isDropdownList?: boolean
  isCompact?: boolean
  onMenuClick?: (item: MenuAsideItemPremium) => void
}

const AsideMenuItem = ({
  item,
  activeSecondaryMenuKey,
  isDropdownList,
  isCompact,
  onMenuClick,
}: Props) => {
  const stateAsideMenuItemStyle = useAppSelector((state) => state.style.asideMenuItemStyle)
  const stateAsideMenuItemInactiveStyle = useAppSelector(
    (state) => state.style.asideMenuItemInactiveStyle
  )
  const stateAsideMenuItemActiveBgStyle = useAppSelector(
    (state) => state.style.asideMenuItemActiveBgStyle
  )
  const stateAsideMenuItemActiveStyle = useAppSelector(
    (state) => state.style.asideMenuItemActiveStyle
  )
  const stateAsideMenuDropdownStyle = useAppSelector((state) => state.style.asideMenuDropdownStyle)

  const hasColor = !!item.color

  const asideMenuItemInactiveStyle = hasColor
    ? ''
    : `${stateAsideMenuItemInactiveStyle} dark:text-gray-300`

  const asideMenuItemActiveBgStyle = `${stateAsideMenuItemActiveBgStyle} dark:bg-slate-700/25`

  const asideMenuItemActiveStyle = hasColor ? '' : stateAsideMenuItemActiveStyle

  const [isDropdownActive, setIsDropdownActive] = useState(false)
  const [isLinkActive, setIsLinkActive] = useState(false)

  const asideMenuItemStyle = isLinkActive ? asideMenuItemActiveStyle : asideMenuItemInactiveStyle

  const { asPath, isReady } = useRouter()

  useEffect(() => {
    if (item.href && isReady) {
      const linkPathName = new URL(item.href, location.href).pathname

      const activePathname = new URL(asPath, location.href).pathname

      setIsLinkActive(linkPathName === activePathname)
    }
  }, [item.href, isReady, asPath])

  useEffect(() => {
    if (isCompact) {
      setIsDropdownActive(false)
    }
  }, [isCompact])

  const isSecondaryMenuActive =
    activeSecondaryMenuKey && item.key && item.key === activeSecondaryMenuKey

  const componentClass = [
    'flex cursor-pointer',
    isDropdownList ? 'py-3 px-6 text-sm' : 'py-3',
    hasColor
      ? getButtonColor(item.color, false, true)
      : `${stateAsideMenuItemStyle} dark:hover:bg-gray-700/50`,
  ]

  if (
    (!hasColor && (isDropdownActive || isSecondaryMenuActive)) ||
    (isLinkActive && !activeSecondaryMenuKey)
  ) {
    componentClass.push(asideMenuItemActiveBgStyle)
  }

  const componentClassName = componentClass.join(' ')

  const hasDropdown = !!item.menu

  const hasSecondary = !!item.menuSecondary

  const hasSub = hasDropdown || hasSecondary

  let subIcon = isDropdownActive ? mdiMinus : mdiPlus

  if (hasSecondary) {
    subIcon = mdiChevronRight
  }

  const handleNonLinkClick = () => {
    if (hasDropdown) {
      setIsDropdownActive(!isDropdownActive)
    }

    if (onMenuClick) {
      onMenuClick(item)
    }
  }

  const updateMarkPositionBase = 'top-0.5 right-4'

  const updateMarkPosition = isCompact
    ? `${updateMarkPositionBase} lg:right-6`
    : updateMarkPositionBase

  const innerContents = (
    <>
      {!!item.icon && (
        <BaseIcon
          path={item.icon}
          className={`flex-none transition-size ${asideMenuItemStyle} ${
            item.updateMark ? 'relative' : ''
          }`}
          w={isCompact ? 'w-16 lg:w-20' : 'w-16'}
          size={18}
        >
          {!!item.updateMark && (
            <UpdateMark color={item.updateMark} position={updateMarkPosition} />
          )}
        </BaseIcon>
      )}
      <span
        className={`grow animate-fade-in text-ellipsis line-clamp-1 ${asideMenuItemStyle} ${
          isCompact ? 'lg:hidden' : ''
        } ${hasSub ? '' : 'pr-12'}`}
      >
        {item.label}
      </span>
      {hasSub && (
        <BaseIcon
          path={subIcon}
          className={`flex-none animate-fade-in-fast ${asideMenuItemStyle} ${
            isCompact ? 'lg:hidden' : ''
          }`}
          w="w-12"
        />
      )}
    </>
  )

  return (
    <li>
      {!item.href && (
        <div className={componentClassName} onClick={handleNonLinkClick}>
          {innerContents}
        </div>
      )}
      {item.href && (
        <Link href={item.href} target={item.target} className={`${componentClassName}`}>
          {innerContents}
        </Link>
      )}
      {hasDropdown && (
        <AsideMenuList
          menu={item.menu}
          className={`${stateAsideMenuDropdownStyle} ${
            isDropdownActive ? 'block dark:bg-slate-800/50' : 'hidden'
          }`}
          isDropdownList
        />
      )}
    </li>
  )
}

export default AsideMenuItem
