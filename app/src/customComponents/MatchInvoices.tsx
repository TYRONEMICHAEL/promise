import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import CardBox from '../components/CardBox'
import CardBoxComponentEmpty from '../components/CardBoxComponentEmpty'
import { LoadingIndicator } from '../components/LoadingIndicator'
import PillTag from '../components/PillTag'
import { useMatches } from '../hooks/matches'
import { Match } from '../interfaces/matches'

const MatchInvoices = () => {
  const [matches, isLoadingMatches] = useMatches(true)

  return (
    <>
      {isLoadingMatches && <LoadingIndicator /> }
      {!isLoadingMatches && matches.length === 0 && <CardBoxComponentEmpty />} 
      {matches.map((match) => <MatchInvoice key={match.address} match={match} />) }
    </>
  )
}


const MatchInvoice = ({ match }: { match: Match }) => {
  return (
    <CardBox className="mb-6">
      <div className="md:flex md:justify-between md:items-center">
        <BaseButtons type="justify-center justify-start">
          <BaseButton href={`/matches/${match.address}`} label="View" color="lightDark" small />
          <BaseButton href={`/matches/${match.address}`} label="Validate" color="lightDark" small />
        </BaseButtons>
        <div className="mt-6 md:mt-0 flex justify-between md:justify-end items-center">
          <p className="text-gray-500 mr-6">{match.endDate?.toDateString()}</p>
          {match.state === PromiseState.active && match.numberOfPromisees < 2 && 
            <PillTag color="warning" label="Pending" className="mr-6" />
          }
          {match.state === PromiseState.active && match.numberOfPromisees === 2 && 
            <PillTag color="success" label="Active" className="mr-6" />
          }
          {match.state === PromiseState.completed && 
            <PillTag color="success" label="Completed" className="mr-6" />
          }
          <h2 className="text-2xl font-semibold">${match.promiseeWager ?? 0} SOL</h2>
        </div>
      </div>
    </CardBox>
  )
}

export default MatchInvoices
