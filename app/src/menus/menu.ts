import {
  mdiAccountCircle,
  mdiAccountMultiple,
  mdiGithub,
  mdiHome,
  mdiTableTennis
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
    href: '/profile',
    icon: mdiAccountCircle,
    label: 'Profile',
  },
  {
    href: '/squads',
    icon: mdiAccountMultiple,
    label: 'Squads',
  },
  {
    href: '/matches',
    icon: mdiTableTennis,
    label: 'Matches',
  },
  {
    href: githubUrl,
    label: 'Github',
    icon: mdiGithub,
  },
]

export default menu
