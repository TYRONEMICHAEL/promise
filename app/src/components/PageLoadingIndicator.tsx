import { PacmanLoader } from 'react-spinners'
import SectionFullScreen from './SectionFullScreen'

export const PageLoadingIndicator = () => {
  return (
    <div className='grid place-items-center h-64'>
        <PacmanLoader
          color={'#ffffff'}
          loading={true}
          size={32}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
    </div>
  )
}