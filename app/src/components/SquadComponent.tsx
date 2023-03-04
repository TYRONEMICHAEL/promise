import { mdiAccountMultiple, mdiTag } from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useEffect, useState } from 'react'
import { colorsText } from '../colors'
import { Squad, SquadStatus } from '../interfaces/squads'
import { isSquadWaitingApproval } from '../services/squads'
import { truncate } from '../utils/helpers'
import BaseIcon from './BaseIcon'
import CardBox from './CardBox'
import PillTagTrend from './PillTagTrend'
import { ColorKey, TrendType } from '../interfaces'
import BaseButton from './BaseButton'

type Props = {
  squad: Squad
}

export const SquadComponent = ({ squad }: Props) => {
  let statusLabel = 'Active'
  let statusType = 'success'
  switch (squad.status) {
    case SquadStatus.active:
      statusLabel = 'Active'
      statusType = 'success'
      break
    case SquadStatus.waitingApproval:
      statusLabel = 'Waiting Approval'
      statusType = 'info'
      break
    case SquadStatus.requiresApproval:
      statusLabel = 'Requires Approval'
      statusType = 'warning'
      break
  }
  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between mb-3">
          <PillTagTrend
            label={statusLabel}
            type={statusType as TrendType}
            color={statusType as ColorKey}
            small
          />
          <BaseButton icon={mdiTag} color="lightDark" small />
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400">Squad</h3>
            <h1 className="text-3xl leading-tight font-semibold">{truncate(squad.address)}...</h1>
          </div>
          <BaseIcon
            path={mdiAccountMultiple}
            size="48"
            w=""
            h="h-16"
            className={colorsText[statusType]}
          />
        </div>
      </CardBox>
    </>
  )
}
