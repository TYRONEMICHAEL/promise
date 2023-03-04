import { mdiThemeLightDark } from '@mdi/js'
import { useAppDispatch } from '../../../stores/hooks'
import { setDarkMode } from '../../../stores/styleSlice'
import BaseIcon from '../../BaseIcon'

export default function StyleModeNavBarButton() {
  const dispatch = useAppDispatch()
  const handleMenuClick = () => {
    dispatch(setDarkMode(null))
  }
  return (
    <div className='flex items-center lg:flex relative cursor-pointer lg:w-16 lg:justify-center' onClick={handleMenuClick}>
      <BaseIcon path={mdiThemeLightDark} className="transition-colors" />
      <span className='px-2 transition-colors lg:hidden'>Toggle Light/Dark</span>
    </div>
  )
}
