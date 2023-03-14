import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'
import { useEffect, useState } from 'react'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import CardBox from '../components/CardBox'
import CardBoxComponentEmpty from '../components/CardBoxComponentEmpty'
import { LoadingIndicator } from '../components/LoadingIndicator'
import PillTag from '../components/PillTag'
import { Match } from '../interfaces/matches'
import { getMatchesForUser } from '../services/matches'
import { catchAll, truncate } from '../utils/helpers'
import { mdiTableTennis, mdiTennisBall } from '@mdi/js'
import SectionTitleLineWithButton from '../components/SectionTitleLineWithButton'
import { getMatchName } from '../utils/names'
import { PublicKey } from '@solana/web3.js'
import Link from 'next/link'

const MatchInvoices = () => {
  const [matches, setMatches] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    getMatchesForUser()
      .then(setMatches)
      .catch(catchAll)
      .finally(() => {
        setIsLoading(false)
      })
  }, [setMatches, setIsLoading])

  return (
    <>
      <SectionTitleLineWithButton icon={mdiTableTennis} title="Matches" excludeButton>
        {matches.length > 0 && (
          <BaseButton
            href="/matches/create"
            label="Create"
            icon={mdiTennisBall}
            color="contrast"
            roundedFull
            small
          />
        )}
      </SectionTitleLineWithButton>
      {isLoading && <LoadingIndicator />}
      {!isLoading && matches.length === 0 && (
        <CardBoxComponentEmpty message="Currently don't have any matches">
          <BaseButton
            href="/matches/create"
            label="Create"
            icon={mdiTennisBall}
            color="contrast"
            roundedFull
            small
          />
        </CardBoxComponentEmpty>
      )}
      {matches.map((match) => (
        <Link key={match.address} href={`/matches/${match.address}`}>
          <MatchInvoice match={match} />
        </Link>
      ))}
    </>
  )
}

const MatchInvoice = ({ match }: { match: Match }) => {
  return (
    <CardBox className="mb-6">
      <div className="md:flex md:justify-between md:items-center">
        <BaseButtons type="justify-center justify-start">
          <p className="text-xl">
            <b>{truncate(getMatchName(new PublicKey(match.address)), 16)}...</b>
          </p>
        </BaseButtons>
        <div className="mt-6 md:mt-0 flex justify-between md:justify-end items-center">
          <p className="text-gray-500 mr-6">{match.endDate?.toDateString()}</p>
          {match.state === PromiseState.active && match.numberOfPromisees < 2 && (
            <PillTag color="warning" label="Pending" className="mr-6" />
          )}
          {match.state === PromiseState.active && match.numberOfPromisees === 2 && (
            <PillTag color="success" label="Active" className="mr-6" />
          )}
          {match.state === PromiseState.completed && (
            <PillTag color="success" label="Completed" className="mr-6" />
          )}
          <h2 className="text-2xl font-semibold">${match.promiseeWager ?? 0} SOL</h2>
        </div>
      </div>
    </CardBox>
  )
}

export default MatchInvoices
