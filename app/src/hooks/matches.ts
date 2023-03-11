import { useEffect, useState } from 'react'
import { Match } from '../interfaces/matches'
import { getMatches } from '../services/matches'
import { nothing } from '../utils/helpers'

export const useMatches: (onlyShowYourMatches) => [Match[], boolean] = (onlyShowYourMatches) => {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getMatches(onlyShowYourMatches)
      .then(setMatches)
      .catch(nothing)
      .finally(() => {
        setIsLoading(false)
      })
  }, [onlyShowYourMatches, setMatches, setIsLoading])

  return [matches, isLoading]
}
