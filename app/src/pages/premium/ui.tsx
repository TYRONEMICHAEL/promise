import { mdiMessageBadge } from '@mdi/js'
import { Field, Form, Formik } from 'formik'
import Head from 'next/head'
import { ReactElement, useState } from 'react'
import BaseButton from '../../components/BaseButton'
import BaseButtons from '../../components/BaseButtons'
import CardBox from '../../components/CardBox'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import FormField from '../../components/FormField'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitle from '../../components/SectionTitle'
import type { SnackBarPushedMessage } from '../../interfaces/premium'
import { useAppDispatch } from '../../stores/hooks'
import { pushMessage } from '../../stores/snackBarSlice'
import CardBoxComponentTitle from '../../components/CardBoxComponentTitle'
import CardBoxModal from '../../componentsPremium/CardBoxModal'
import { getPageTitle } from '../../config'

const PremiumUiPage = () => {
  const snackBarColorOptions = ['contrast', 'info', 'success', 'warning', 'danger']

  const snackBarForm: SnackBarPushedMessage = {
    text: 'Hello! This is demo message...',
    lifetime: 3000,
    color: 'info',
  }

  const dispatch = useAppDispatch()

  const handleFormSubmit = (message: SnackBarPushedMessage) => {
    dispatch(pushMessage(message))
  }

  const [isModalDangerActive, setIsModalDangerActive] = useState(false)
  const [isModalInfoActive, setIsModalInfoActive] = useState(false)

  return (
    <>
      <Head>
        <title>{getPageTitle('UI advanced')}</title>
      </Head>

      <SectionTitle>SnackBar Toasts</SectionTitle>

      <SectionMain>
        <CardBox className="md:w-7/12 lg:w-5/12 xl:w-4/12 md:mx-auto">
          <Formik initialValues={snackBarForm} onSubmit={handleFormSubmit}>
            {(formikProps) => (
              <Form>
                <FormField label="SnackBar text" help="Message text">
                  <Field name="text" placeholder="Message" />
                </FormField>
                <FormField
                  label="SnackBar lifetime (ms)"
                  help="Lifetime value in milliseconds. Use `0` for infinite."
                >
                  <Field name="lifetime" placeholder="3000" type="number" min="0" />
                </FormField>
                <FormField label="SnackBar color">
                  <FormCheckRadioGroup isColumn>
                    {snackBarColorOptions.map((color) => (
                      <FormCheckRadio key={color} type="radio" label={color} className="capitalize">
                        <Field type="radio" name="color" value={color} />
                      </FormCheckRadio>
                    ))}
                  </FormCheckRadioGroup>
                </FormField>

                <BaseButtons>
                  <BaseButton
                    className="flex-1"
                    type="submit"
                    label="Push"
                    icon={mdiMessageBadge}
                    color={formikProps.values.color}
                  />
                </BaseButtons>
              </Form>
            )}
          </Formik>
        </CardBox>
      </SectionMain>

      <SectionTitle>Modal specialities</SectionTitle>

      <CardBoxModal
        title="Error (shaking)"
        buttonColor="danger"
        buttonLabel="Done"
        hasShake
        isActive={isModalDangerActive}
        onConfirm={() => setIsModalDangerActive(false)}
      >
        <p>
          <b>Click on overlay</b> to see close action
        </p>
        <p>This is sample modal</p>
      </CardBoxModal>

      <CardBoxModal
        title="Closes only on `Done` click"
        buttonColor="info"
        buttonLabel="Done"
        isActive={isModalInfoActive}
        onConfirm={() => setIsModalInfoActive(false)}
      >
        <p>
          <b>Click on overlay</b> to see close action
        </p>
        <p>This is sample modal</p>
      </CardBoxModal>

      <SectionMain>
        <div className="space-y-12">
          <CardBox
            className="cursor-pointer shadow-2xl md:w-7/12 lg:w-5/12 xl:w-4/12 md:mx-auto"
            footer={<BaseButton label="Done" color="danger" />}
            onClick={() => setIsModalDangerActive(true)}
            isHoverable
          >
            <CardBoxComponentTitle title="Error (shaking)" />

            <div className="space-y-3">
              <p>Click to see in action</p>
            </div>
          </CardBox>

          <CardBox
            className="cursor-pointer shadow-2xl md:w-7/12 lg:w-5/12 xl:w-4/12 md:mx-auto"
            footer={<BaseButton label="Done" color="info" />}
            onClick={() => setIsModalInfoActive(true)}
            isHoverable
          >
            <CardBoxComponentTitle title="Closes only on `Done` click" />

            <div className="space-y-3">
              <p>Click to see in action</p>
            </div>
          </CardBox>
        </div>
      </SectionMain>
    </>
  )
}

PremiumUiPage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default PremiumUiPage
