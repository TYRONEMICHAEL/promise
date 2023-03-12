import { mdiTennis, mdiTennisBall } from '@mdi/js'
import { PublicKey } from '@solana/web3.js'
import React, { useCallback, useEffect } from 'react'
import BaseButton from '../components/BaseButton'
import CardBox from '../components/CardBox'
import IconRounded from '../components/IconRounded'
import { LoadingIndicator } from '../components/LoadingIndicator'
import { useMatches } from '../hooks/matches'
import { getBalanceForAccount } from '../services/account'


const CardBoxSquad = () => {
  const icon = mdiTennisBall;
  const [amount, setAmount] = React.useState(0)
  const [yourMatches, isLoadingMatches] = useMatches(true)

  const getAmount = useCallback(async () => {
    const balances = yourMatches.map(async (s) => await getBalanceForAccount(new PublicKey(s.address)));
    const amount = await Promise.all(balances).then((balances) => {
      return balances.reduce((a, b) => a + b, 0);
    });
    setAmount(amount);
  }, [yourMatches]);

  useEffect(() => {
    getAmount();
  }, [getAmount, yourMatches])

  return (
    <CardBox className="mb-6 last:mb-0">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center justify-start mb-6 md:mb-0">
          <IconRounded icon={icon} color='info' className="md:mr-6 mb-6 md:mb-0" />
          {isLoadingMatches && <LoadingIndicator /> }
          {!isLoadingMatches && 
            <div className="text-center space-y-1 md:text-left md:mr-6">
              <h4 className="text-xl">{yourMatches.length === 1 ? `1 Match` : `${yourMatches.length} Matches`}</h4>
              <p className="text-gray-500 dark:text-slate-400">
                <b>Potential Earnings: {amount} SOL</b><br/>
                <small>Matches you have accepted</small>
              </p>            
            </div>
          }
        </div>
        <div className="text-center md:text-right space-y-2">
          <BaseButton
            href="/matches/create"
            label="Join a new match"
            icon={mdiTennis}
            color="info"
            roundedFull
            small
            disabled={isLoadingMatches}
          />
        </div>
      </div>
    </CardBox>
  )
}

export default CardBoxSquad
