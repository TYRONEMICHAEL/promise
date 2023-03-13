import { useEffect, useState } from 'react'
import { Squad } from '../interfaces/squads'
import { getSquads } from '../services/squads'
import { useAppDispatch } from '../stores/hooks'
import { catchAll } from '../utils/helpers'

export const useSquads: () => [Squad[], boolean] = () => {
  const dispatch = useAppDispatch()
  const [squads, setSquads] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getSquads()
      .then(setSquads)
      .catch(catchAll(dispatch, 'Failed to get squads'))
      .finally(() => {
        setIsLoading(false)
      })
  }, [dispatch, setSquads, setIsLoading])

  return [squads, isLoading]
}
