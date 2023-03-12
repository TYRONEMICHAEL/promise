import { mdiBallotOutline, mdiWallet } from '@mdi/js'
import { PublicKey } from '@solana/web3.js'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import * as Yup from 'yup'
import BaseButton from '../../components/BaseButton'
import BaseButtons from '../../components/BaseButtons'
import BaseDivider from '../../components/BaseDivider'
import CardBox from '../../components/CardBox'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import FormField from '../../components/FormField'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import { SnackBarPushedMessage } from '../../interfaces'
import LayoutApp from '../../layouts/App'
import { createSquad } from '../../services/squads'
import { useAppDispatch } from '../../stores/hooks'
import { pushMessage } from '../../stores/snackBarSlice'

const CreateSquad = () => {
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

  const createSquadAction = async ({ partner, requireBothApproval }) => {
    const threshold = requireBothApproval ? 2 : 1
    setIsCreating(true)
    createSquad(partner, threshold)
      .then(() => {
        const message = createSnackbarMessage(`Successfully created squad`, true)
        dispatch(pushMessage(message))
      })
      .catch(() => {
        const message = createSnackbarMessage(`Failed to create squad`, false)
        dispatch(pushMessage(message))
      })
      .finally(() => {
        setIsCreating(false)
        router.push('/squads')
      })
  }

  const createInitialValues = {
    partner: '',
    requireBothApproval: true,
  }

  const createSchema = Yup.object().shape({
    partner: Yup.string()
      .test(
        'is-public-key',
        () => "Your partner's wallet address needs to be a valid wallet address",
        (value) => {
          try {
            return new PublicKey(value) != null
          } catch {
            return false
          }
        }
      ),
  })

  return (
    <>
      <Head>
        <title>{getPageTitle('Create Squad')}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton icon={mdiBallotOutline} title="Create" main excludeButton />

        <CardBox>
          <Formik
            initialValues={createInitialValues}
            validationSchema={createSchema}
            onSubmit={(values) => createSquadAction(values)}
          >
            {({ errors, touched }) => (
              <Form>
                <FormField
                  label="Partner"
                  icons={[mdiWallet]}
                  error={errors.partner && touched.partner ? errors.partner : null}
                >
                  <Field name="partner" placeholder="Address" />
                </FormField>

                <FormField>
                  <FormCheckRadioGroup>
                    <FormCheckRadio type="checkbox" label="Require you and your partner to approve matches?">
                      <Field type="checkbox" name="requireBothApproval" />
                    </FormCheckRadio>
                  </FormCheckRadioGroup>
                </FormField>

                <BaseDivider />

                {isCreating && <LoadingIndicator />}
                {!isCreating && (
                  <>
                    <BaseButtons>
                      <BaseButton type="submit" color="info" label="Create" />
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

CreateSquad.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default CreateSquad
