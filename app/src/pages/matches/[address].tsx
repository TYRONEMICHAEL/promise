import { mdiAccountMultiple, mdiCheck, mdiTableTennis } from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { PromiseState } from 'promise-sdk/lib/sdk/src/promise/PromiseState'
import { ReactElement, useEffect, useState } from 'react'
import { AddressComponent } from '../../components/AddressComponent'
import BaseButton from '../../components/BaseButton'
import BaseButtons from '../../components/BaseButtons'
import BaseDivider from '../../components/BaseDivider'
import CardBox from '../../components/CardBox'
import FormField from '../../components/FormField'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import { useMatches } from '../../hooks/matches'
import { useSquads } from '../../hooks/squads'
import { SnackBarPushedMessage } from '../../interfaces'
import { stateToString } from '../../interfaces/matches'
import LayoutApp from '../../layouts/App'
import {
  acceptMatchForSquad,
  completeMatchForSquad,
  getSquadsForMatch,
} from '../../services/matches'
import { nothing, truncate } from '../../utils/helpers'

const MatchDetails = () => {
  const router = useRouter()
  const { connection } = useConnection()
  const wallet = useWallet()
  const [isAccepting, setIsAccepting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [squadsInMatch, setSquadsInMatch] = useState([])
  const [squads] = useSquads()
  // TODO add match filter
  const [matches, isLoadingMatches] = useMatches(false)

  const { address } = router.query
  const match = matches.find((match) => match.address == address)
  const isOwner = match?.state == PromiseState.active // TODO
  const squadsNotInMatch = squads.filter(
    (squad) => !squadsInMatch.map((squad) => squad.address).includes(squad.address)
  )

  useEffect(() => {
    if (match && wallet?.publicKey) {
      setIsAccepting(true)
      getSquadsForMatch(connection, wallet, match)
        .then((squads) => setSquadsInMatch(squads))
        .finally(() => {
          setIsAccepting(false)
        })
    }
  }, [connection, wallet, match, setIsAccepting, setSquadsInMatch])

  const acceptMatch = async ({ squad }) => {
    const selected = squads.find((sq) => sq.address == squad)
    if (selected == undefined) return
    setIsAccepting(true)
    acceptMatchForSquad(connection, wallet, match, selected)
      .then(() => {
        router.reload()
      })
      .catch(nothing)
      .finally(() => {
        setIsAccepting(false)
      })
  }

  const completeMatch = async (squad) => {
    setIsCompleting(true)
    completeMatchForSquad(connection, wallet, match, squad)
      .then(() => {
        router.reload()
      })
      .catch(nothing)
      .finally(() => {
        setIsCompleting(false)
      })
  }

  const createSnackbarMessage: (message, success) => SnackBarPushedMessage = (
    message: string,
    success: boolean
  ) => {
    return {
      text: message,
      lifetime: 3000,
      color: success ? 'success' : 'danger',
    }
  }

  return (
    <>
      <Head>
        <title>{getPageTitle(`Match ${match?.address}`)}</title>
      </Head>

      <SectionMain>
        {isLoadingMatches && <LoadingIndicator />}
        {!isLoadingMatches && match && (
          <>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
              <CardBox flex="flex-row" className="xl:col-span-2">
                <SectionTitleLineWithButton icon={mdiTableTennis} title="Details" excludeButton />

                <div className="flex items-center justify-between">
                  <p>
                    <b>Address</b>
                  </p>
                  <AddressComponent address={match.address} />
                </div>

                <BaseDivider />

                <div className="flex items-center justify-between">
                  <p>
                    <b>State</b>
                  </p>
                  <p>{stateToString(match.state)}</p>
                </div>

                <BaseDivider />

                <div className="flex items-center justify-between">
                  <p>
                    <b>Created At</b>
                  </p>
                  <p>{match.createdAt.toDateString()}</p>
                </div>

                <BaseDivider />

                <div className="flex items-center justify-between">
                  <p>
                    <b>Updated At</b>
                  </p>
                  <p>{match.updatedAt.toDateString()}</p>
                </div>

                <BaseDivider />

                {match.promiseeWager && (
                  <>
                    <div className="flex items-center justify-between">
                      <p>
                        <b>Wager</b>
                      </p>
                      <p>{match.promiseeWager}</p>
                    </div>

                    <BaseDivider />
                  </>
                )}

                {match.endDate && (
                  <>
                    <div className="flex items-center justify-between">
                      <p>
                        <b>End Date</b>
                      </p>
                      <p>{match.endDate.toDateString()}</p>
                    </div>

                    <BaseDivider />
                  </>
                )}
              </CardBox>

              <CardBox className="mb-6">
                <SectionTitleLineWithButton
                  icon={mdiAccountMultiple}
                  title="Squads"
                  excludeButton
                />
                {squadsInMatch.map((squad) => {
                  return (
                    <div key={squad.address}>
                      <div className="flex items-center justify-between">
                        <AddressComponent address={squad.address} />
                        {isCompleting && isOwner && <LoadingIndicator />}
                        {!isCompleting && isOwner && (
                          <BaseButton
                            onClick={() => completeMatch(squad)}
                            label="Complete"
                            icon={mdiCheck}
                            color="contrast"
                            small
                          />
                        )}
                      </div>

                      <BaseDivider />
                    </div>
                  )
                })}
                {squadsInMatch.length <= 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <p>No squads participating</p>
                    </div>

                    <BaseDivider />
                  </>
                )}

                {match.state == PromiseState.active && squadsNotInMatch.length > 0 && (
                  <Formik
                    initialValues={{
                      squad: squadsNotInMatch[0],
                    }}
                    onSubmit={(values) => acceptMatch(values)}
                  >
                    <Form>
                      <FormField label="Add Squad" labelFor="squad">
                        <Field name="squad" component="select">
                          <option value="">None</option>
                          {squadsNotInMatch.map((squad) => {
                            return (
                              <option key={squad.address} value={squad.address}>
                                {truncate(squad.address)}...
                              </option>
                            )
                          })}
                        </Field>
                      </FormField>

                      {isAccepting && <LoadingIndicator />}
                      {!isAccepting && (
                        <BaseButtons>
                          <BaseButton type="submit" color="info" label="Accept" />
                        </BaseButtons>
                      )}
                    </Form>
                  </Formik>
                )}
              </CardBox>
            </div>
          </>
        )}
      </SectionMain>
    </>
  )
}

MatchDetails.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default MatchDetails
