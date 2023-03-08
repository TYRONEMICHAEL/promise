import { PulseLoader } from 'react-spinners'

export const LoadingIndicator = () => {
  return (
    <>
      <PulseLoader
        color={'#ffffff'}
        loading={true}
        size={6}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </>
  )
}
