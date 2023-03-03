import {
    mdiBallotOutline,
    mdiCash
} from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
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
import { createMatchForWallet } from '../../services/matches'
import { useAppDispatch } from '../../stores/hooks'
import { pushMessage } from '../../stores/snackBarSlice'
import { DatePickerField } from '../../components/DatePickerField'
  
  const CreateMatch = () => {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { connection } = useConnection()
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
  
    const createMatch = async ({ wager, endDate }) => {
      setIsCreating(true)
      createMatchForWallet(
        connection,
        wallet,
        {
            amountInSol: wager,
            endDate: new Date(endDate)
        }
      )
        .then(match => {
          const message = createSnackbarMessage(`Successfully created match (${match.id})`, true)
          dispatch(pushMessage(message))
        })
        .catch(() => {
          const message = createSnackbarMessage("Failed to create match", false)
          dispatch(pushMessage(message))
        })
        .finally(() => {
          setIsCreating(false)
          router.push('/matches')
        })
    }
  
    return (
      <>
        <Head>
          <title>{getPageTitle('Create Match')}</title>
        </Head>
  
        <SectionMain>
          <SectionTitleLineWithButton icon={mdiBallotOutline} title="Create" main excludeButton/>
  
          <CardBox>
            <Formik
              initialValues={{
                wager: 0,
                endDate: "2022/02/01"
              }}
              onSubmit={(values) => createMatch(values)}
            >
              <Form>
                <FormField label="Details" icons={[mdiCash]}>
                  <Field name="wager" type="number" placeholder="Wager" />
                </FormField>
  
                <BaseDivider />
  
                <FormField>
                    <DatePickerField name="endDate" dateFormat="yyyy/mm/dd" />
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
  
  CreateMatch.getLayout = function getLayout(page: ReactElement) {
    return <LayoutApp>{page}</LayoutApp>
  }
  
  export default CreateMatch
  