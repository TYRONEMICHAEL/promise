import { mdiBallotOutline, mdiCash, mdiTicket } from '@mdi/js'
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
import { SnackBarPushedMessage } from '../../interfaces'
import LayoutApp from '../../layouts/App'
import {
  Match,
  acceptMatchForSquad,
  completeMatchForSquad,
  createMatchForWallet,
  getSquadsForMatch,
} from '../../services/matches'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { pushMessage } from '../../stores/snackBarSlice'
import { DatePickerField } from '../../components/DatePickerField'
import { getSquadsForWallet } from '../../services/squads'
import { setSquads } from '../../stores/mainSlice'

const MatchDetails = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { connection } = useConnection()
  const wallet = useWallet()
  const user = useAppSelector((state) => state.main)
  const [isAccepting, setIsAccepting] = useState(false)
  const [squadsInMatch, setSquadsInMatch] = useState([])

  // TODO load squads incase it hasn't been loaded

  const { address } = router.query
  const match = user.matches.find((match) => match.address == address)
  if (!match) {
    router.back()
  }

  useEffect(() => {
    setIsAccepting(true)
    getSquadsForMatch(connection, wallet, match)
      .then((squads) => setSquadsInMatch(squads))
      .finally(() => {
        setIsAccepting(false)
      })
  }, [connection, wallet, match, setIsAccepting, setSquadsInMatch])

  const acceptMatch = async ({ squad }) => {
    const s = user.squads.find((sq) => sq.address == squad)
    console.log(squad)
    console.log(user.squads)
    setIsAccepting(true)
    acceptMatchForSquad(connection, wallet, match, s)
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
        <title>{getPageTitle(`Match ${match.id}`)}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton
          icon={mdiBallotOutline}
          title={`Match ${match.id}`}
          main
          excludeButton
        />

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
              squad: user.squads.length > 0 ? user.squads[0] : '',
            }}
            onSubmit={(values) => acceptMatch(values)}
          >
            <Form>
              <FormField label="Squads" labelFor="squad">
                <Field name="squad" id="squad" component="select">
                  {user.squads.map((squad) => {
                    return (
                      <option key={squad.address} value={squad.address}>
                        {squad.name}
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
      </SectionMain>
    </>
  )
}

MatchDetails.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default MatchDetails
