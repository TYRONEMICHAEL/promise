import {
  mdiMenu,
  mdiClockOutline,
  mdiCloud,
  mdiCrop,
  mdiAccount,
  mdiCogOutline,
  mdiEmail,
  mdiLogout,
  mdiThemeLightDark,
  mdiHelpCircleOutline,
} from '@mdi/js'
import { MenuNavBarItem } from '../interfaces'

const menuNavBar: MenuNavBarItem[] = [
  {
    icon: mdiMenu,
    label: 'Sample menu',
    menu: [
      {
        icon: mdiClockOutline,
        label: 'Item One',
      },
      {
        icon: mdiCloud,
        label: 'Item Two',
      },
      {
        isDivider: true,
      },
      {
        icon: mdiCrop,
        label: 'Item Last',
      },
    ],
  },
  {
    isCurrentUser: true,
    menu: [
      {
        icon: mdiAccount,
        label: 'My Profile',
        href: '/moreProfile',
      },
      {
        icon: mdiCogOutline,
        label: 'Settings',
      },
      {
        icon: mdiEmail,
        label: 'Messages',
      },
      {
        isDivider: true,
      },
      {
        icon: mdiLogout,
        label: 'Log Out',
        isLogout: true,
      },
    ],
  },
  {
    icon: mdiThemeLightDark,
    label: 'Light/Dark',
    isDesktopNoLabel: true,
    isToggleLightDark: true,
  },
  {
    icon: mdiHelpCircleOutline,
    label: 'About',
    href: 'https://justboil.me/tailwind-admin-templates/react-dashboard/',
    isDesktopNoLabel: true,
  },
  {
    icon: mdiLogout,
    label: 'Log out',
    isDesktopNoLabel: true,
    isLogout: true,
  },
]

export default menuNavBar
