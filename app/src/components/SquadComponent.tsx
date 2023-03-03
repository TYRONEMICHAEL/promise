import { mdiAccountGroup, mdiCheck } from '@mdi/js'
import { Squad, approveTransactionForSquad, waitingForApprovalForSquad } from '../services/squads'
import CardBox from './CardBox'
import IconRounded from './IconRounded'
import UserCardProfileNumber from './UserCardProfileNumber'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import BaseButton from './BaseButton'

type Props = {
  squad: Squad
}

export const SquadComponent = ({ squad }: Props) => {
  const { connection } = useConnection()
  const wallet = useWallet()
  const [requiresApproval, setRequiresApproval] = useState(false)

  const approveSquad = async () => {
    approveTransactionForSquad(connection, wallet, squad)
        .then((status) => {
            console.log(status)
        })
  }

  useEffect(() => {
    setRequiresApproval(false)
    waitingForApprovalForSquad(connection, wallet, squad).then((status) => {
      setRequiresApproval(status)
    })
  }, [connection, wallet, squad, setRequiresApproval])

  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <div>
            <IconRounded icon={mdiAccountGroup} color="light" className="mr-3" bg />
            <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400">
              {squad.name}
            </h3>

            <UserCardProfileNumber number={squad.members.length} label="Members" />

            {requiresApproval && (
              <>
                <h3>Requires Approval</h3>

                <BaseButton
                  onClick={approveSquad}
                  label="Complete"
                  icon={mdiCheck}
                  color="success"
                  roundedFull
                  small
                />
              </>
            )}
          </div>
        </div>
      </CardBox>
    </>
  )
}
