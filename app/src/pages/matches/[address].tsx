import { mdiTableTennis, mdiTennisBall } from '@mdi/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import Link from 'next/link'
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
import { MatchSquadComponent } from '../../components/MatchSquadComponent'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import { useMatches } from '../../hooks/matches'
import { useSquads } from '../../hooks/squads'
import { stateToString } from '../../interfaces/matches'
import { Squad } from '../../interfaces/squads'
import LayoutApp from '../../layouts/App'
import { acceptMatch, completeMatch, getSquadsForMatch } from '../../services/matches'
import { useAppDispatch } from '../../stores/hooks'
import { catchAll } from '../../utils/helpers'
import { getMatchName, getSquadName } from '../../utils/names'

const MatchDetails = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const wallet = useWallet()
  const [isAccepting, setIsAccepting] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [squadsInMatch, setSquadsInMatch] = useState([])
  const [squads] = useSquads()
  const [matches] = useMatches(false)

  const { address } = router.query
  const match = matches.find((match) => match.address == address)

  useEffect(() => {
    if (match) {
      setIsAccepting(true)
      getSquadsForMatch(match)
        .then((squads) => setSquadsInMatch(squads))
        .catch(catchAll(dispatch))
        .finally(() => {
          setIsAccepting(false)
        })
    }
  }, [dispatch, match, setIsAccepting, setSquadsInMatch])

  const acceptMatchAction = async ({ squad }) => {
    const selected = squads.find((sq) => sq.address == squad)
    if (selected == undefined) return
    setIsAccepting(true)
    acceptMatch(match, selected)
      .then(() => {
        router.reload()
      })
      .catch(catchAll(dispatch, 'Failed to accept match'))
      .finally(() => {
        setIsAccepting(false)
      })
  }

  const completeMatchAction = async ({
    squad1FirstGame,
    squad2FirstGame,
    squad1SecondGame,
    squad2SecondGame,
    squad1ThirdGame,
    squad2ThirdGame,
  }) => {
    const game1 = squad1FirstGame > squad2FirstGame ? 1 : 0
    const game2 = squad1SecondGame > squad2SecondGame ? 1 : 0
    const game3 = squad1ThirdGame > squad2ThirdGame ? 1 : 0
    const score = game1 + game2 + game3
    setIsCompleting(true)
    completeMatch(match, score > 1 ? firstSquad : secondSquad)
      .then(() => {
        router.reload()
      })
      .catch(catchAll(dispatch, 'Failed to complete match'))
      .finally(() => {
        setIsCompleting(false)
      })
  }

  if (!match) {
    return <LoadingIndicator />
  }

  const matchName = getMatchName(new PublicKey(match.address))
  const firstSquad: Squad = squadsInMatch.length > 0 ? squadsInMatch[0] : null
  const secondSquad: Squad = squadsInMatch.length > 1 ? squadsInMatch[1] : null
  const matchInProgress = match.numberOfPromisees == 2 && firstSquad && secondSquad
  const matchComplete = match.state == PromiseState.completed
  const memberKey = wallet?.publicKey?.toBase58()
  const squadsNotInMatch = squads
    .filter((squad) => {
      return !squadsInMatch.map((squad) => squad.address).includes(squad.address)
    })
    .filter((squad) => {
      const squadsInMatchMembers = squadsInMatch.flatMap((squad) => squad.members)
      return squad.members.find((member) => squadsInMatchMembers.includes(member)) == null
    })
  const canAddSquads =
    match.numberOfPromisees < 2 &&
    squadsInMatch.find((squad) => squad.members.includes(memberKey)) == undefined &&
    squadsNotInMatch.length > 0
  const isOwner = match?.state == PromiseState.active && match?.isOwner

  return (
    <>
      <Head>
        <title>{getPageTitle(`Match ${match?.address}`)}</title>
      </Head>

      <SectionMain>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
          <div className="xl:col-span-2">
            <SectionTitleLineWithButton icon={mdiTableTennis} title={matchName} excludeButton />
            <CardBox className="mb-6">
              <div className="grid place-items-center mb-6">
                <h1 className="text-2xl">
                  <b>
                    {!matchComplete && matchInProgress && <>Match In Progress</>}
                    {!matchComplete && !matchInProgress && <>Waiting for Squads</>}
                    {matchComplete && <>Match Completed</>}
                  </b>
                </h1>
              </div>
              <div className="grid grid-cols-9 gap-6 justify-between place-items-center mb-6">
                <div className="col-span-4">
                  {!firstSquad && canAddSquads && (
                    <>
                      <Formik
                        initialValues={{
                          squad: '',
                        }}
                        onSubmit={(values) => acceptMatchAction(values)}
                      >
                        <Form>
                          <FormField label="Select Squad" labelFor="squad">
                            <Field name="squad" component="select">
                              <option value="">None</option>
                              {squadsNotInMatch.map((squad) => {
                                return (
                                  <option key={squad.address} value={squad.address}>
                                    {getSquadName(new PublicKey(squad.address))}
                                  </option>
                                )
                              })}
                            </Field>
                          </FormField>

                          {isAccepting && <LoadingIndicator />}
                          {!isAccepting && (
                            <div className="grid place-items-center">
                              <BaseButtons>
                                <BaseButton
                                  type="submit"
                                  color="contrast"
                                  label="Accept"
                                  small
                                  roundedFull
                                />
                              </BaseButtons>
                            </div>
                          )}
                        </Form>
                      </Formik>
                    </>
                  )}
                  {!firstSquad && !canAddSquads && (
                    <div className="text-gray-500 dark:text-slate-400">
                      <b>Waiting for Squad...</b>
                    </div>
                  )}
                  {firstSquad && firstSquad.members.includes(wallet.publicKey?.toBase58()) && (
                    <Link href={`/squads/${firstSquad.address}`}>
                      <MatchSquadComponent squad={firstSquad} />
                    </Link>
                  )}
                  {firstSquad && !firstSquad.members.includes(wallet.publicKey?.toBase58()) && (
                    <MatchSquadComponent squad={firstSquad} />
                  )}
                </div>
                <div className="col-span-1">
                  <b>vs</b>
                </div>
                <div className="col-span-4">
                  {!firstSquad && (
                    <div className="text-gray-500 dark:text-slate-400">
                      <b>Waiting for First Squad...</b>
                    </div>
                  )}
                  {firstSquad && canAddSquads && (
                    <>
                      <Formik
                        initialValues={{
                          squad: '',
                        }}
                        onSubmit={(values) => acceptMatchAction(values)}
                      >
                        <Form>
                          <FormField label="Select Squad" labelFor="squad">
                            <Field name="squad" component="select">
                              <option value="">None</option>
                              {squadsNotInMatch.map((squad) => {
                                return (
                                  <option key={squad.address} value={squad.address}>
                                    {getSquadName(new PublicKey(squad.address))}
                                  </option>
                                )
                              })}
                            </Field>
                          </FormField>

                          {isAccepting && <LoadingIndicator />}
                          {!isAccepting && (
                            <div className="grid place-items-center">
                              <BaseButtons>
                                <BaseButton
                                  type="submit"
                                  color="contrast"
                                  label="Accept"
                                  small
                                  roundedFull
                                />
                              </BaseButtons>
                            </div>
                          )}
                        </Form>
                      </Formik>
                    </>
                  )}
                  {firstSquad && !secondSquad && !canAddSquads && (
                    <div className="text-gray-500 dark:text-slate-400">
                      <b>Waiting for Squad...</b>
                    </div>
                  )}
                  {firstSquad &&
                    secondSquad &&
                    secondSquad.members.includes(wallet.publicKey?.toBase58()) && (
                      <Link href={`/squads/${secondSquad.address}`}>
                        <MatchSquadComponent squad={secondSquad} />
                      </Link>
                    )}
                  {firstSquad &&
                    secondSquad &&
                    !secondSquad.members.includes(wallet.publicKey?.toBase58()) && (
                      <MatchSquadComponent squad={secondSquad} />
                    )}
                </div>
              </div>
              {!matchComplete && matchInProgress && isOwner && (
                <div className="grid place-items-center">
                  <div className="text-gray-500 dark:text-slate-400">
                    <small>Fill in the information from the match when available:</small>
                  </div>
                  <Formik
                    initialValues={{
                      squad1FirstGame: null,
                      squad2FirstGame: null,
                      squad1SecondGame: null,
                      squad2SecondGame: null,
                      squad1ThirdGame: null,
                      squad2ThirdGame: null,
                    }}
                    onSubmit={(values) => completeMatchAction(values)}
                  >
                    {({ values }) => (
                      <Form>
                        <div className="grid place-items-center mb-3 text-gray-500 dark:text-slate-400">
                          <b>First Game</b>
                        </div>
                        <FormField isBorderless>
                          <Field type="number" name="squad1FirstGame" />
                          <Field type="number" name="squad2FirstGame" />
                        </FormField>
                        {values.squad1FirstGame && values.squad2FirstGame && (
                          <>
                            <div className="grid place-items-center mb-3 text-gray-500 dark:text-slate-400">
                              <b>Second Game</b>
                            </div>
                            <FormField isBorderless>
                              <Field type="number" name="squad1SecondGame" />
                              <Field type="number" name="squad2SecondGame" />
                            </FormField>
                          </>
                        )}
                        {values.squad1SecondGame && values.squad2SecondGame && (
                          <>
                            <div className="grid place-items-center mb-3 text-gray-500 dark:text-slate-400">
                              <b>Third Game</b>
                            </div>
                            <FormField isBorderless>
                              <Field type="number" name="squad1ThirdGame" />
                              <Field type="number" name="squad2ThirdGame" />
                            </FormField>
                          </>
                        )}

                        {values.squad1ThirdGame && values.squad2ThirdGame && isCompleting && (
                          <LoadingIndicator />
                        )}
                        {values.squad1ThirdGame && values.squad2ThirdGame && !isCompleting && (
                          <div className="grid place-items-center">
                            <BaseButtons>
                              <BaseButton
                                type="submit"
                                color="contrast"
                                label="Submit Results"
                                small
                                roundedFull
                              />
                            </BaseButtons>
                          </div>
                        )}
                      </Form>
                    )}
                  </Formik>
                </div>
              )}
              {!matchComplete && matchInProgress && !isOwner && (
                <div className="grid place-items-center mb-6">
                  <div className="text-gray-500 dark:text-slate-400">
                    <b>Waiting for Results...</b>
                  </div>
                </div>
              )}
              {matchComplete && (
                <div className="grid place-items-center mb-6">
                  <div className="text-gray-500 dark:text-slate-400">
                    <b>Match Summary Coming Soon...</b>
                  </div>
                </div>
              )}
            </CardBox>
          </div>
          <div className="xl:col-span-1">
            <SectionTitleLineWithButton icon={mdiTennisBall} title="Details" excludeButton />
            <CardBox flex="flex-row">
              <div className="flex items-center justify-between">
                <div>
                  <b>Address</b>
                  <div className="text-gray-500 dark:text-slate-400">
                    <small>Public address of the Promise.</small>
                  </div>
                </div>
                <AddressComponent address={match.address} />
              </div>

              <BaseDivider />

              {match.promiseeWager && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <b>Wager</b>
                      <div className="text-gray-500 dark:text-slate-400">
                        <small>The amount required to participate in match.</small>
                      </div>
                    </div>
                    <p>{match.promiseeWager} SOL</p>
                  </div>

                  <BaseDivider />
                </>
              )}

              {match.endDate && (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <b>End Date</b>
                      <div className="text-gray-500 dark:text-slate-400">
                        <small>The date the match ends.</small>
                      </div>
                    </div>
                    <p>{match.endDate.toDateString()}</p>
                  </div>

                  <BaseDivider />
                </>
              )}

              <div className="flex items-center justify-between">
                <p>
                  <b>State</b>
                </p>
                <p>{stateToString(match.state)}</p>
              </div>

              <BaseDivider />

              <div className="flex items-center justify-between">
                <p>
                  <b>Created</b>
                </p>
                <p>{match.createdAt.toDateString()}</p>
              </div>

              <BaseDivider />

              <div className="flex items-center justify-between">
                <div>
                  <b>Last updated</b>
                  <div className="text-gray-500 dark:text-slate-400">
                    <small>Last date the match was updated.</small>
                  </div>
                </div>
                <p>{match.updatedAt.toDateString()}</p>
              </div>
            </CardBox>
          </div>
        </div>
      </SectionMain>
    </>
  )
}

MatchDetails.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default MatchDetails
