import { mdiTennis, mdiTennisBall } from '@mdi/js'
import { PublicKey } from '@solana/web3.js'
import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'
import React, { useCallback, useEffect } from 'react'
import BaseButton from '../components/BaseButton'
import CardBox from '../components/CardBox'
import IconRounded from '../components/IconRounded'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { getBalanceForAccount } from '../services/account'
import { getMatchesForUser } from '../services/matches'
import { catchAll } from '../utils/helpers'

const CardBoxSquad = () => {
  const icon = mdiTennisBall
  const [amount, setAmount] = React.useState(0)
  const [matches, setMatches] = React.useState([])
  const [isLoading, setIsLoading] = React.useState(false)

  useEffect(() => {
    setIsLoading(true)
    getMatchesForUser()
      .then((matches) => matches.filter((match) => match.state == PromiseState.active))
      .then(setMatches)
      .catch(catchAll)
      .finally(() => {
        setIsLoading(false)
      })
  }, [setMatches, setIsLoading])

  const getAmount = useCallback(async () => {
    const balances = matches.map(
      async (match) => await getBalanceForAccount(new PublicKey(match.address))
    )
    const amount = await Promise.all(balances).then((balances) => {
      return balances.reduce((a, b) => a + b, 0)
    })
    setAmount(amount)
  }, [matches])

  useEffect(() => {
    getAmount()
  }, [getAmount])

  return (
    <CardBox className="mb-6 last:mb-0">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center justify-start mb-6 md:mb-0">
          <IconRounded icon={icon} color="info" className="md:mr-6 mb-6 md:mb-0" />
          {isLoading && <LoadingIndicator />}
          {!isLoading && (
            <div className="text-center space-y-1 md:text-left md:mr-6">
              <h4 className="text-xl">
                {matches.length === 1 ? `1 Match` : `${matches.length} Matches`}
              </h4>
              <p className="text-gray-500 dark:text-slate-400">
                <b>Potential Earnings: {amount} SOL</b>
                <br />
                <small>Matches you have accepted</small>
              </p>
            </div>
          )}
        </div>
        <div className="text-center md:text-right space-y-2">
          <BaseButton
            href="/matches/create"
            label="Create a new match"
            icon={mdiTennis}
            color="info"
            roundedFull
            small
            disabled={isLoading}
          />
        </div>
      </div>
    </CardBox>
  )
}

export default CardBoxSquad
