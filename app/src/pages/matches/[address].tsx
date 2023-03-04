import { mdiBallotOutline, mdiTicket } from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import BaseButton from '../../components/BaseButton'
import BaseButtons from '../../components/BaseButtons'
import BaseDivider from '../../components/BaseDivider'
import CardBox from '../../components/CardBox'
import FormField from '../../components/FormField'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import { useSquads } from '../../hooks/squads'
import { SnackBarPushedMessage } from '../../interfaces'
import LayoutApp from '../../layouts/App'
import {
  acceptMatchForSquad,
  completeMatchForSquad,
  getSquadsForMatch,
} from '../../services/matches'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useMatches } from '../../hooks/matches'

const MatchDetails = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { connection } = useConnection()
  const wallet = useWallet()
  const user = useAppSelector((state) => state.main)
  const [isAccepting, setIsAccepting] = useState(false)
  const [squadsInMatch, setSquadsInMatch] = useState([])
  const [squads] = useSquads()
  // TODO add match filter
  const [matches, isLoadingMatches] = useMatches(false)

  const { address } = router.query
  const match = matches.find((match) => match.address == address)

  useEffect(() => {
    if (match) {
      setIsAccepting(true)
      getSquadsForMatch(connection, wallet, match)
        .then((squads) => setSquadsInMatch(squads))
        .finally(() => {
          setIsAccepting(false)
        })
    }
  }, [connection, wallet, match, setIsAccepting, setSquadsInMatch])

  const acceptMatch = async ({ squad }) => {
    console.log(squad)
    console.log(squads)
    const selected = squads.find((sq) => sq.address == squad)
    console.log(selected)
    setIsAccepting(true)
    acceptMatchForSquad(connection, wallet, match, squads[0])
      .then((status) => {
        console.log(status)
      })
      .finally(() => {
        setIsAccepting(false)
      })
  }

  const completeMatch = async (squad) => {
    completeMatchForSquad(connection, wallet, match, squad).then((success) => {
      console.log(success)
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
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title={`Match ${match?.address}`}
          main
          excludeButton
        />
        {isLoadingMatches && <LoadingIndicator />}
        {!isLoadingMatches && match && (
          <>
            {squadsInMatch.map((squad) => {
              return (
                <>
                  <h3 key={squad.address}>{squad.address}</h3>

                  <BaseButton
                    onClick={() => completeMatch(squad)}
                    label="Complete"
                    icon={mdiTicket}
                    color="success"
                    roundedFull
                    small
                  />
                </>
              )
            })}

            <CardBox>
              <Formik
                initialValues={{
                  squad: '',
                }}
                onSubmit={(values) => acceptMatch(values)}
              >
                <Form>
                  <FormField label="Squads" labelFor="squad">
                    <Field name="squad" id="squad" component="select">
                      {squads
                        .filter(
                          (squad) => !squadsInMatch.map((s) => s.address).includes(squad.address)
                        )
                        .map((squad) => {
                          return (
                            <option key={squad.address} value={squad.address}>
                              {squad.address}
                            </option>
                          )
                        })}
                    </Field>
                  </FormField>

                  <BaseDivider />

                  {isAccepting && <LoadingIndicator />}
                  {!isAccepting && (
                    <>
                      <BaseButtons>
                        <BaseButton type="submit" color="info" label="Accept" />
                      </BaseButtons>
                    </>
                  )}
                </Form>
              </Formik>
            </CardBox>
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
