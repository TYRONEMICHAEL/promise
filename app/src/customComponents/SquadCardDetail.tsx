import {
  mdiAccountCircle,
  mdiAccountMultiple,
  mdiAccountMultiplePlus,
  mdiCheckDecagram,
  mdiPencil,
  mdiSafe,
} from '@mdi/js'
import { PublicKey } from '@solana/web3.js'
import React, { useCallback, useEffect } from 'react'
import { colorsOutline } from '../colors'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import BaseIcon from '../components/BaseIcon'
import CardBox from '../components/CardBox'
import CardBoxComponentEmpty from '../components/CardBoxComponentEmpty'
import { LoadingIndicator } from '../components/LoadingIndicator'
import PillTagPlain from '../components/PillTagPlain'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import UserCardProfileNumber from '../components/UserCardProfileNumber'
import { useSquads } from '../hooks/squads'
import { Squad } from '../interfaces/squads'
import { getBalanceForAccount } from '../services/account'
import { getAuthorityKeyForSquad } from '../services/squads'
import { truncate } from '../utils/helpers'
import { getSquadName } from '../utils/names'
import { UserAvatarType } from './UserAvatar'
import UserAvatarCurrentUser from './UserAvatarCurrentUser'

const SquadCardDetails = () => {
  const [squads, isLoadingMatches] = useSquads()

  return (
    <>
      <SectionTitleLineWithButton icon={mdiAccountMultiple} title="Squads" main excludeButton>
        {squads.length > 0 && (
          <BaseButton
            href="/squads/create"
            label="Create"
            icon={mdiAccountMultiplePlus}
            color="contrast"
            roundedFull
            small
          />
        )}
      </SectionTitleLineWithButton>
      {isLoadingMatches && <LoadingIndicator />}
      {!isLoadingMatches && squads.length === 0 && (
        <CardBoxComponentEmpty message="Currently don't belong to any squads">
          <BaseButton
            href="/squads/create"
            label="Create"
            icon={mdiAccountMultiplePlus}
            color="contrast"
            roundedFull
            small
          />
        </CardBoxComponentEmpty>
      )}
      {squads.map((squad) => (
        <SquadCardDetail avatar={UserAvatarType.bot} key={squad.address} squad={squad} />
      ))}
    </>
  )
}

const SquadCardDetail = ({ squad, avatar }: { squad: Squad; avatar?: UserAvatarType }) => {
  const username = getSquadName(new PublicKey(squad.address))
  const [amount, setAmount] = React.useState(0)

  const getAmount = useCallback(async () => {
    const balance = await getBalanceForAccount(getAuthorityKeyForSquad(squad.address))
    setAmount(balance)
  }, [squad.address])

  useEffect(() => {
    getAmount()
  }, [getAmount])

  return (
    <CardBox flex="flex-row" className="items-center mb-6">
      <div className="flex flex-col justify-center items-center md:flex-row md:items-start md:justify-start">
        <UserAvatarCurrentUser
          className="-mt-10 md:mt-0 w-48 h-48 md:w-36 md:h-36 md:mr-6 mb-6 md:mb-2"
          avatar={avatar}
          username={username}
        />
        <div className="flex-1">
          <div className="flex justify-between items-center">
            <div className="flex justify-start items-center mb-3">
              <h1 className="text-2xl mr-1.5">{username}</h1>
              <BaseIcon path={mdiCheckDecagram} size={22} className="text-blue-400" />
            </div>
            <BaseButton
              href={`/squads/${squad.address}`}
              icon={mdiPencil}
              color="lightDark"
              small
              roundedFull
            />
          </div>

          <BaseButtons className="text-gray-500">
            <PillTagPlain label={`${truncate(squad.address)}...`} icon={mdiAccountCircle} />
            <PillTagPlain label={`${truncate(squad.createKey)}...`} icon={mdiSafe} />
          </BaseButtons>
          <BaseButtons className="mt-6" classAddon="mr-9 last:mr-0 mb-3">
            <UserCardProfileNumber className={colorsOutline['success']} number={5} label="Wins" />
            <UserCardProfileNumber className={colorsOutline['danger']} number={1} label="Losses" />
            <UserCardProfileNumber number={4.2} label="Score" />
            <UserCardProfileNumber number={amount} label="SOL" />
          </BaseButtons>
        </div>
      </div>
    </CardBox>
  )
}

export default SquadCardDetails
