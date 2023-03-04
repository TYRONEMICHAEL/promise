import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { getSquads } from '../services/squads'
import { Squad } from '../interfaces/squads'
import { nothing } from '../utils/helpers'

export const useSquads: () => [Squad[], boolean] = () => {
  const [squads, setSquads] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { connection } = useConnection()
  const wallet = useWallet()

  useEffect(() => {
    if (!connection || !wallet) return
    setIsLoading(true)
    getSquads(connection, wallet)
      .then(setSquads)
      .catch(nothing)
      .finally(() => {
        setIsLoading(false)
      })
  }, [wallet, connection, setSquads, setIsLoading])

  return [squads, isLoading]
}
