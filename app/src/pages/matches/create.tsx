import { mdiBallotOutline, mdiCash } from '@mdi/js'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import * as Yup from 'yup'
import BaseButton from '../../components/BaseButton'
import BaseButtons from '../../components/BaseButtons'
import BaseDivider from '../../components/BaseDivider'
import CardBox from '../../components/CardBox'
import { DatePickerField } from '../../components/DatePickerField'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import FormField from '../../components/FormField'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import { SnackBarPushedMessage } from '../../interfaces'
import { MatchDetails } from '../../interfaces/matches'
import LayoutApp from '../../layouts/App'
import { createMatch } from '../../services/matches'
import { useAppDispatch } from '../../stores/hooks'
import { pushMessage } from '../../stores/snackBarSlice'

const CreateMatch = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
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

  const createMatchAction = async ({ wager, hasEndDate, endDate }) => {
    setIsCreating(true)
    createMatch(new MatchDetails(wager * LAMPORTS_PER_SOL, hasEndDate ? new Date(endDate) : null))
      .then((match) => {
        const message = createSnackbarMessage(`Successfully created match (${match.id})`, true)
        dispatch(pushMessage(message))
      })
      .catch(() => {
        const message = createSnackbarMessage('Failed to create match', false)
        dispatch(pushMessage(message))
      })
      .finally(() => {
        setIsCreating(false)
        router.push('/matches')
      })
  }

  const createInitialValues = {
    wager: '',
    hasEndDate: false,
    endDate: new Date().toLocaleDateString(),
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
        <CardBox>
          <Formik
            initialValues={createInitialValues}
            validationSchema={createSchema}
            onSubmit={(values) => createMatchAction(values)}
          >
            {({ values, errors, touched }) => (
              <Form>
                <FormField
                  label="Details"
                  help="The wager that each squad will have to wage in order to participate."
                  icons={[mdiCash]}
                  error={errors.wager && touched.wager ? errors.wager : null}
                >
                  <Field name="wager" type="number" placeholder="Wager (SOL)" />
                </FormField>

                <BaseDivider />

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

                <BaseDivider />

                {isCreating && <LoadingIndicator />}
                {!isCreating && (
                  <>
                    <BaseButtons>
                      <BaseButton type="submit" color="info" label="Submit" />
                      <BaseButton type="reset" color="info" outline label="Reset" />
                    </BaseButtons>
                  </>
                )}
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

CreateMatch.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default CreateMatch
