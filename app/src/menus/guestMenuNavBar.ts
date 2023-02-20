import {
    mdiLogout,
    mdiThemeLightDark
} from '@mdi/js'
import { MenuNavBarItem } from '../interfaces'
  
  const guestMenuNavBar: MenuNavBarItem[] = [
    {
      icon: mdiThemeLightDark,
      label: 'Light/Dark',
      isDesktopNoLabel: true,
      isToggleLightDark: true,
    },
    {
      icon: mdiLogout,
      label: 'Log out',
      isDesktopNoLabel: true,
      isLogout: true,
    },
  ]
  
  export default guestMenuNavBar
  