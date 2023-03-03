import { mdiAccountGroup, mdiWallet } from '@mdi/js'
import { Match } from '../services/matches'
import BaseButtons from './BaseButtons'
import CardBox from './CardBox'
import IconRounded from './IconRounded'
import PillTagPlain from './PillTagPlain'
import UserCardProfileNumber from './UserCardProfileNumber'

type Props = {
  match: Match
}

export const MatchComponent = ({ match }: Props) => {
  return (
    <>
      <CardBox flex="flex-row" className="items-center">
        <div className="flex justify-start items-start">
          <IconRounded
            icon={mdiAccountGroup}
            color="contrast"
            size="24"
            className="w-24 h-24 md:w-36 md:h-36 mr-6"
          />
          <div className="flex-1">
            <div className="flex justify-between items-center">
              <div className="flex justify-start items-center mb-3">
                <h1 className="text-2xl mr-1.5">{match.id}</h1>
              </div>
            </div>

            <BaseButtons className="text-gray-500">
              <PillTagPlain label={`${match.address.substring(0, 10)}...`} icon={mdiWallet} />
            </BaseButtons>
            <BaseButtons className="mt-6" classAddon="mr-9 last:mr-0 mb-3">
              <UserCardProfileNumber number={Number(match.promisorReward)} label="Wager" />
              <UserCardProfileNumber number={match.numberOfPromisees} label="Promisees" />
            </BaseButtons>
          </div>
        </div>
      </CardBox>
    </>
  )
}
