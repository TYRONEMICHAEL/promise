import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { getSquads } from '../services/squads'
import { Squad } from '../interfaces/squads'
import { nothing } from '../utils/helpers'

export const useSquads: () => [Squad[], boolean] = () => {
  const [squads, setSquads] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getSquads()
      .then(setSquads)
      .catch(nothing)
      .finally(() => {
        setIsLoading(false)
      })
  }, [setSquads, setIsLoading])

  return [squads, isLoading]
}
