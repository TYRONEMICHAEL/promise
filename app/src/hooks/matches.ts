import { useEffect, useState } from 'react'
import { Match } from '../interfaces/matches'
import { getMatches } from '../services/matches'
import { useAppDispatch } from '../stores/hooks'
import { catchAll } from '../utils/helpers'

export const useMatches: (onlyShowYourMatches) => [Match[], boolean] = (onlyShowYourMatches) => {
  const dispatch = useAppDispatch()
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getMatches(onlyShowYourMatches)
      .then(setMatches)
      .catch(catchAll(dispatch, 'Failed to get matches'))
      .finally(() => {
        setIsLoading(false)
      })
  }, [dispatch, onlyShowYourMatches, setMatches, setIsLoading])

  return [matches, isLoading]
}
