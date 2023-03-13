import { mdiBallotOutline, mdiCash, mdiInformation } from '@mdi/js'
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import * as Yup from 'yup'
import BaseButton from '../../components/BaseButton'
import BaseButtons from '../../components/BaseButtons'
import CardBox from '../../components/CardBox'
import { DatePickerField } from '../../components/DatePickerField'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import FormField from '../../components/FormField'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import { useSquads } from '../../hooks/squads'
import { SnackBarPushedMessage } from '../../interfaces'
import { MatchDetails, MatchMetadata } from '../../interfaces/matches'
import LayoutApp from '../../layouts/App'
import { createMatch } from '../../services/matches'
import { useAppDispatch } from '../../stores/hooks'
import { pushMessage } from '../../stores/snackBarSlice'
import { catchAll } from '../../utils/helpers'
import { getSquadName } from '../../utils/names'

const CreateMatch = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [squads] = useSquads()
  const [isCreating, setIsCreating] = useState(false)

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

  const createMatchAction = async ({ wager, hasEndDate, endDate, squad, description }) => {
    const metadata: MatchMetadata = description ? {
      description
    } : null

    const selectedSquad = squads.find((s) => s.address == squad)
    setIsCreating(true)
    createMatch(
      new MatchDetails(wager * LAMPORTS_PER_SOL, hasEndDate ? new Date(endDate) : null, metadata),
      selectedSquad
    )
      .then((match) => {
        const message = createSnackbarMessage(`Successfully created match (${match.id})`, true)
        dispatch(pushMessage(message))
        router.push(`/matches/${match.address}`)
      })
      .catch(catchAll(dispatch, 'Failed to create match'))
      .finally(() => {
        setIsCreating(false)
      })
  }

  const createInitialValues = {
    wager: '',
    hasEndDate: false,
    endDate: new Date(),
    squad: '',
    description: '',
  }

  const createSchema = Yup.object().shape({
    wager: Yup.number().moreThan(0, 'Wager needs to be more than 0').required('Wager is required'),
  })

  return (
    <>
      <Head>
        <title>{getPageTitle('Create Match')}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton icon={mdiBallotOutline} title="Create" main excludeButton />
        <Formik
          initialValues={createInitialValues}
          validationSchema={createSchema}
          onSubmit={(values) => createMatchAction(values)}
        >
          {({ values, errors, touched }) => (
            <Form>
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <CardBox>
                    <FormField
                      label="Details"
                      help="The wager that each squad will have to wage in order to participate."
                      icons={[mdiCash]}
                      error={errors.wager && touched.wager ? errors.wager : null}
                    >
                      <Field name="wager" type="number" placeholder="Wager (SOL)" />
                    </FormField>

                    <FormField
                      label="Description (optional)"
                      help="Optionally add a description to the match."
                      icons={[mdiInformation]}
                      hasTextareaHeight
                    >
                      <Field name="description" type="text" placeholder="Matches description" />
                    </FormField>

                    <FormField>
                      <FormCheckRadioGroup>
                        <FormCheckRadio type="checkbox" label="Has end date?">
                          <Field type="checkbox" name="hasEndDate" />
                        </FormCheckRadio>
                      </FormCheckRadioGroup>
                    </FormField>

                    {values.hasEndDate && (
                      <FormField help="Date the match ends.">
                        <DatePickerField name="endDate" />
                      </FormField>
                    )}
                  </CardBox>
                </div>

                <div>
                  <CardBox>
                    <FormField
                      label="Add Squad"
                      help="Optionally add a squad to the match."
                      labelFor="squad"
                    >
                      <Field name="squad" component="select">
                        <option value="">None</option>
                        {squads.map((squad) => {
                          return (
                            <option key={squad.address} value={squad.address}>
                              {getSquadName(new PublicKey(squad.address))}
                            </option>
                          )
                        })}
                      </Field>
                    </FormField>
                  </CardBox>
                </div>
              </div>

              {isCreating && <LoadingIndicator />}
              {!isCreating && (
                <>
                  <BaseButtons>
                    <BaseButton type="submit" color="contrast" label="Submit" small roundedFull />
                    <BaseButton
                      type="reset"
                      color="contrast"
                      outline
                      label="Reset"
                      small
                      roundedFull
                    />
                  </BaseButtons>
                </>
              )}
            </Form>
          )}
        </Formik>
      </SectionMain>
    </>
  )
}

CreateMatch.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default CreateMatch
