import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { getMatches } from '../services/matches'
import { nothing } from '../utils/helpers'
import { Match } from '../interfaces/matches'

export const useMatches: (onlyShowYourMatches) => [Match[], boolean] = (onlyShowYourMatches) => {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const { connection } = useConnection()
  const wallet = useWallet()

  useEffect(() => {
    if (!connection || !wallet) return

    setIsLoading(true)
    getMatches(connection, wallet, onlyShowYourMatches)
      .then(setMatches)
      .catch(nothing)
      .finally(() => {
        setIsLoading(false)
      })
  }, [wallet, connection, onlyShowYourMatches, setMatches, setIsLoading])

  return [matches, isLoading]
}
