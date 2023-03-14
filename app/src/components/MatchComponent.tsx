import { mdiTableTennis } from '@mdi/js'
import { PublicKey } from '@solana/web3.js'
import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'
import { colorsText } from '../colors'
import { ColorKey, TrendType } from '../interfaces'
import { Match } from '../interfaces/matches'
import { getMatchName, getSquadName } from '../utils/names'
import BaseIcon from './BaseIcon'
import CardBox from './CardBox'
import PillTagTrend from './PillTagTrend'
import { useEffect, useState } from 'react'
import { getSquadsForMatch } from '../services/matches'
import { LoadingIndicator } from './LoadingIndicator'
import UserAvatarCurrentUser from '../customComponents/UserAvatarCurrentUser'
import { UserAvatarType } from '../customComponents/UserAvatar'
import { truncate } from '../utils/helpers'

type Props = {
  match: Match
}

export const MatchComponent = ({ match }: Props) => {
  const matchName = getMatchName(new PublicKey(match.address))
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

  const [isLoading, setIsLoading] = useState(false)
  const [squadsInMatch, setSquadsInMatch] = useState([])

  useEffect(() => {
    setIsLoading(true)
    getSquadsForMatch(match)
      .then((squads) => setSquadsInMatch(squads))
      .finally(() => {
        setIsLoading(false)
      })
  }, [match, setIsLoading, setSquadsInMatch])
  return (
    <>
      <CardBox>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400">Match</h3>
            <h1 className="text-3xl leading-tight font-semibold">{truncate(matchName, 16)}...</h1>
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
        <div className="py-2" />
        <div className="flex items-center justify-between">
          {match.promiseeWager && (
            <div>
              <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400">Wager</h3>
              <h1 className="text-3xl leading-tight font-semibold">{match.promiseeWager}</h1>
            </div>
          )}
          {isLoading && <LoadingIndicator />}
          {!isLoading && squadsInMatch.length > 0 && (
            <div>
              <h3 className="text-lg leading-tight text-gray-500 dark:text-slate-400 mb-1">
                Squads
              </h3>
              <div className="flex items-center justify-center">
                {squadsInMatch.map((squad) => {
                  const username = getSquadName(new PublicKey(squad.address))
                  return (
                    <UserAvatarCurrentUser
                      key={squad.address}
                      className="w-8"
                      avatar={UserAvatarType.bot}
                      username={username}
                    />
                  )
                })}
              </div>
            </div>
          )}
          {/* <div>
            {!isLoading && squadsInMatch.length <= 0 && (
              <h1 className="text-3xl leading-tight font-semibold">0</h1>
            )}
            {!isLoading && squadsInMatch.length > 0 && }
          </div> */}
          <BaseIcon
            path={mdiTableTennis}
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
