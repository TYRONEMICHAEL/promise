import { mdiAccountGroup, mdiTableTennis, mdiTennis, mdiTennisBall, mdiWallet } from '@mdi/js'
import { Match } from '../interfaces/matches'
import BaseButtons from './BaseButtons'
import CardBox from './CardBox'
import IconRounded from './IconRounded'
import PillTagPlain from './PillTagPlain'
import UserCardProfileNumber from './UserCardProfileNumber'
import PillTagTrend from './PillTagTrend'
import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'
import { ColorKey, TrendType } from '../interfaces'
import BaseButton from './BaseButton'
import { truncate } from '../utils/helpers'
import BaseIcon from './BaseIcon'
import { colorsText } from '../colors'

type Props = {
  match: Match
}

export const MatchComponent = ({ match }: Props) => {
  let statusLabel = 'Active'
  let statusType = 'success'
  switch (match.state) {
    case PromiseState.created:
      statusLabel = 'Created'
      statusType = 'warning'
      break
    case PromiseState.active:
      statusLabel = 'Active'
      statusType = 'info'
      break
    case PromiseState.completed:
      statusLabel = 'Completed'
      statusType = 'success'
      break
    case PromiseState.voided:
      statusLabel = 'Cancelled'
      statusType = 'danger'
      break
  }
  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400">Match</h3>
            <h1 className="text-3xl leading-tight font-semibold">{truncate(match.address)}...</h1>
          </div>
          <div>
            <PillTagTrend
              label={statusLabel}
              type={statusType as TrendType}
              color={statusType as ColorKey}
              small
            />
          </div>
        </div>
        <div className='py-2' />
        <div className="flex items-center justify-between">
          {match.promiseeWager && (
            <div>
              <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400">Wager</h3>
              <h1 className="text-3xl leading-tight font-semibold">{match.promiseeWager}</h1>
            </div>
          )}
          <div>
            <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400">
              Participants
            </h3>
            <h1 className="text-3xl leading-tight font-semibold">{match.numberOfPromisees}</h1>
          </div>
          <BaseIcon path={mdiTableTennis} size="48" w="" h="h-16" className={colorsText[statusType]} />
        </div>
      </CardBox>
    </>
  )
}
