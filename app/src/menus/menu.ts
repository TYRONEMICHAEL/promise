import {
  mdiAccountCircle,
  mdiAccountGroup,
  mdiGamepadVariant,
  mdiGithub,
  mdiHome,
  mdiMonitor
} from '@mdi/js'
import { githubUrl } from '../config'
import type { MenuAsideItemPremium } from '../interfaces'

const menu: MenuAsideItemPremium[] = [
  {
    href: '/',
    icon: mdiHome,
    label: 'Home',
  },
  {
    href: '/dashboard',
    icon: mdiMonitor,
    label: 'Dashboard',
  },
  {
    href: '/profile',
    icon: mdiAccountCircle,
    label: 'Profile'
  },
  {
    href: '/squads',
    icon: mdiAccountGroup,
    label: 'Squads'
  },
  {
    href: '/matches',
    icon: mdiGamepadVariant,
    label: 'Matches'
  },
  {
    href: githubUrl,
    label: 'Github',
    icon: mdiGithub,
  },
]

export default menu
