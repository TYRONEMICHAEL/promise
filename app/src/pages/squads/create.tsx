import {
  mdiAccount,
  mdiAccountGroup,
  mdiBallotOutline,
  mdiGithub,
  mdiMail,
  mdiPen,
  mdiUpload,
} from '@mdi/js'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { ReactElement, useState } from 'react'
import LayoutApp from '../../layouts/App'
import { getPageTitle } from '../../config'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import CardBox from '../../components/CardBox'
import { createSquadForWallet } from '../../services/squads'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormFilePicker from '../../components/FormFilePicker'
import { SnackBarPushedMessage } from '../../interfaces'
import { pushMessage } from '../../stores/snackBarSlice'
import { useAppDispatch } from '../../stores/hooks'

const CreateSquad = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const wallet = useWallet()
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

  const createSquad = async ({ name, description, members, includeSelfAsMember, threshold }) => {
    setIsCreating(true)
    createSquadForWallet(
      wallet,
      name,
      description,
      threshold,
      includeSelfAsMember,
      null,
      members.split(/\s+/)
    )
      .then(() => {
        const message = createSnackbarMessage(`Successfully created ${name}`, true)
        dispatch(pushMessage(message))
      })
      .catch(() => {
        const message = createSnackbarMessage(`Failed to create ${name}`, false)
        dispatch(pushMessage(message))
      })
      .finally(() => {
        setIsCreating(false)
        router.push('/squads')
      })
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Create Squad')}</title>
      </Head>

      <SectionMain>
        <SectionTitleLineWithButton icon={mdiBallotOutline} title="Create" main excludeButton/>

        <CardBox>
          <Formik
            initialValues={{
              name: '',
              description: '',
              members: '',
              includeSelfAsMember: true,
              threshold: 1,
            }}
            onSubmit={(values) => createSquad(values)}
          >
            <Form>
              <FormField label="Details" icons={[mdiAccountGroup]}>
                <Field name="name" placeholder="Name" />
              </FormField>

              <FormField hasTextareaHeight>
                <Field name="description" as="textarea" placeholder="Description" />
              </FormField>

              <FormField>
                {/* TODO */}
                <FormFilePicker label="Upload icon" color="info" icon={mdiUpload} />
              </FormField>

              <BaseDivider />

              <FormField label="Members" hasTextareaHeight>
                <Field name="members" as="textarea" placeholder="List of members" />
              </FormField>
              <FormField help="Number of members required to approve">
                <Field name="threshold" type="number" placeholder="Number of approvers" min="0" />
              </FormField>
              <FormField>
                <FormCheckRadioGroup>
                  <FormCheckRadio type="switch" label="Include self as member">
                    <Field name="includeSelfAsMember" type="checkbox" />
                  </FormCheckRadio>
                </FormCheckRadioGroup>
              </FormField>

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
