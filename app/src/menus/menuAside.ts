import {
  mdiAccountCircle,
  mdiMonitor,
  mdiLock,
  mdiAlertCircle,
  mdiSquareEditOutline,
  mdiTable,
  mdiTelevisionGuide,
  mdiPalette,
  mdiCardAccountDetailsOutline,
  mdiFormDropdown,
  mdiMenuOpen,
  mdiOpenInNew,
  mdiViewQuilt,
  mdiHelpCircle,
  mdiBarcode,
} from '@mdi/js'
import type { MenuAsideItemPremium } from '../interfaces'

const menuAside: MenuAsideItemPremium[] = [
  {
    href: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    href: '/tables',
    label: 'Tables',
    icon: mdiTable,
  },
  {
    href: '/forms',
    label: 'Forms',
    icon: mdiSquareEditOutline,
  },
  {
    href: '/ui',
    label: 'UI Base',
    icon: mdiTelevisionGuide,
  },
  {
    href: '/moreui',
    label: 'UI Advanced',
    icon: mdiViewQuilt,
    updateMark: 'info',
  },
  {
    href: '/styles',
    label: 'Styles',
    icon: mdiPalette,
    updateMark: 'info',
  },
  {
    href: '/pricing',
    label: 'Pricing layout',
    icon: mdiBarcode,
    updateMark: 'info',
  },
  {
    href: '/moreProfile',
    label: 'Profile',
    icon: mdiAccountCircle,
    updateMark: 'info',
  },
  {
    href: '/login',
    label: 'Login',
    icon: mdiLock,
  },
  {
    href: '/error',
    label: 'Error',
    icon: mdiAlertCircle,
  },
  {
    // Key should be unique for each submenus object
    // It is required for open/close logic
    key: 'submenus-1',
    label: 'Sub',
    icon: mdiMenuOpen,
    menuSecondary: [
      {
        href: '/premium/profile',
        label: 'Sample Link',
        icon: mdiCardAccountDetailsOutline,
      },
      {
        label: 'External link',
        href: 'https://justboil.me',
        icon: mdiOpenInNew,
        target: '_blank',
      },
      {
        label: 'Dropdown',
        icon: mdiFormDropdown,
        menu: [
          {
            label: 'Dropdown item One',
          },
          {
            label: 'Dropdown item Two',
          },
        ],
      },
    ],
  },
  {
    href: 'https://justboil.me/tailwind-admin-templates/react-dashboard/',
    label: 'About',
    icon: mdiHelpCircle,
  },
]

export default menuAside
