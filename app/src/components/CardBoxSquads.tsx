import { mdiAccountMultiple, mdiAccountMultiplePlus, mdiNaturePeople } from '@mdi/js'
import { useConnection } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import React, { useCallback, useEffect } from 'react'
import { useSquads } from '../hooks/squads'
import { getBalanceForAccount } from '../services/account'
import BaseButton from './BaseButton'
import CardBox from './CardBox'
import IconRounded from './IconRounded'


const CardBoxSquad = () => {
  const icon = mdiAccountMultiple;
  const [amount, setAmount] = React.useState(0)
  const [squads] = useSquads()
  const { connection } = useConnection();

  const getAmount = useCallback(async () => {
    const balances = squads.map(async (s) => await getBalanceForAccount(connection, new PublicKey(s.address)));
    const amount = await Promise.all(balances).then((balances) => {
      return balances.reduce((a, b) => a + b, 0);
    });
    setAmount(amount);
  }, [connection, squads]);

  useEffect(() => {
    getAmount();
  }, [getAmount, squads])

  return (
    <CardBox className="mb-6 last:mb-0">
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="flex flex-col md:flex-row items-center justify-start mb-6 md:mb-0">
          <IconRounded icon={icon} color='success' className="md:mr-6 mb-6 md:mb-0" />
          <div className="text-center space-y-1 md:text-left md:mr-6">
            <h4 className="text-xl">{squads.length === 1 ? `1 Squad` : `${squads.length} Squads`}</h4>
            <p className="text-gray-500 dark:text-slate-400">
              <b>{amount} SOL </b>
            </p>
          </div>
        </div>
        <div className="text-center md:text-right space-y-2">
          <BaseButton
            href="/squads/create"
            label="Create"
            icon={mdiAccountMultiplePlus}
            color="success"
            roundedFull
            small
          />
        </div>
      </div>
    </CardBox>
  )
}

export default CardBoxSquad
