import {
  mdiAccount,
  mdiCreditCardOutline,
  mdiCheckDecagram,
  mdiPencil,
  mdiAccountCircle,
  mdiDomain,
  mdiMapMarker,
  mdiAccountCreditCard,
  mdiInformation,
  mdiCreditCard,
  mdiPlusCircle,
  mdiCloudLock,
  mdiUpload,
  mdiMail,
  mdiAsterisk,
  mdiFormTextboxPassword,
} from '@mdi/js'
import { Formik, Form, Field } from 'formik'
import Head from 'next/head'
import { ReactElement } from 'react'
import BaseButton from '../../components/BaseButton'
import BaseButtons from '../../components/BaseButtons'
import BaseDivider from '../../components/BaseDivider'
import BaseIcon from '../../components/BaseIcon'
import CardBox from '../../components/CardBox'
import CardBoxComponentBody from '../../components/CardBoxComponentBody'
import CardBoxComponentFooter from '../../components/CardBoxComponentFooter'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormField from '../../components/FormField'
import FormFilePicker from '../../components/FormFilePicker'
import LayoutAuthenticated from '../../layouts/Authenticated'
import NotificationBar from '../../components/NotificationBar'
import PillTag from '../../components/PillTag'
import PillTagPlain from '../../components/PillTagPlain'
import CardBoxBillingItem from '../../componentsPremium/CardBoxBillingItem'
import CardBoxPaymentMethod from '../../componentsPremium/CardBoxPaymentMethod'
import SectionBannerProfile from '../../componentsPremium/SectionBannerProfile'
import UserAvatarCurrentUserWithUpload from '../../componentsPremium/UserAvatarCurrentUserWithUpload'
import UserCardProfileNumber from '../../componentsPremium/UserCardProfileNumber'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { UserForm } from '../../interfaces'
import { CreditCardType } from '../../interfaces/premium'
import { getPageTitle } from '../../config'
import { useAppSelector } from '../../stores/hooks'

type BillingHistoryItem = {
  id: number
  amount: number
  date: string
}

type PaymentMethod = {
  id: number
  cardType: CreditCardType
  cardNumber: string
  cardExpires: string
  cardOwner: string
  isPrimary?: boolean
}

const ProfilePage = () => {
  const userName = useAppSelector((state) => state.main.userName)
  const userEmail = useAppSelector((state) => state.main.userEmail)

  const userForm: UserForm = {
    name: userName,
    email: userEmail,
  }

  const date = new Date()

  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }

  const firstDayOfNextMonth = new Date(
    date.getFullYear(),
    date.getMonth() + 1,
    1
  ).toLocaleDateString('en-US', dateOptions)

  const firstDayOfThisMonth = new Date(date.getFullYear(), date.getMonth(), 1).toLocaleDateString(
    'en-US',
    dateOptions
  )

  const billingHistory: BillingHistoryItem[] = [
    {
      id: 1,
      amount: 24.99,
      date: firstDayOfThisMonth,
    },
    {
      id: 2,
      amount: 24.99,
      date: new Date(date.getFullYear(), date.getMonth() - 1, 1).toLocaleDateString(
        'en-US',
        dateOptions
      ),
    },
    {
      id: 3,
      amount: 24.99,
      date: new Date(date.getFullYear(), date.getMonth() - 2, 1).toLocaleDateString(
        'en-US',
        dateOptions
      ),
    },
  ]

  const paymentMethods: PaymentMethod[] = [
    {
      id: 1,
      cardType: 'mc',
      cardNumber: '4575',
      cardExpires: '04/24',
      cardOwner: 'john doe',
      isPrimary: true,
    },
    {
      id: 2,
      cardType: 'visa',
      cardNumber: '0785',
      cardExpires: '06/26',
      cardOwner: 'john doe',
      isPrimary: false,
    },
  ]

  return (
    <>
      <Head>
        <title>{getPageTitle('Profile')}</title>
      </Head>
      
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiAccount} title="Profile" main>
          <BaseButton
            href="https://justboil.me/tailwind-admin-templates/react-dashboard/"
            label="Buy dashboard"
            icon={mdiCreditCardOutline}
            color="contrast"
            roundedFull
            small
          />
        </SectionTitleLineWithButton>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
          <CardBox flex="flex-row" className="items-center">
            <div className="flex justify-start items-start">
              <UserAvatarCurrentUserWithUpload className="w-24 h-24 md:w-36 md:h-36 mr-6" />
              <div className="flex-1">
                <div className="flex justify-between items-center">
                  <div className="flex justify-start items-center mb-3">
                    <h1 className="text-2xl mr-1.5">{userName}</h1>
                    <BaseIcon path={mdiCheckDecagram} size={22} className="text-blue-400" />
                  </div>
                  <BaseButton icon={mdiPencil} color="lightDark" small roundedFull />
                </div>

                <BaseButtons className="text-gray-500">
                  <PillTagPlain label="Developer" icon={mdiAccountCircle} />
                  <PillTagPlain label="Kiehn-Green" icon={mdiDomain} />
                  <PillTagPlain label="Emelyside" icon={mdiMapMarker} />
                </BaseButtons>
                <BaseButtons className="mt-6" classAddon="mr-9 last:mr-0 mb-3">
                  <UserCardProfileNumber number={499} label="Likes" />
                  <UserCardProfileNumber number={128} label="Posts" />
                  <UserCardProfileNumber number={256} label="Media" />
                  <UserCardProfileNumber number={384} label="Links" />
                  <UserCardProfileNumber number={512} label="Files" />
                </BaseButtons>
              </div>
            </div>
          </CardBox>

          <SectionBannerProfile />
        </div>

        <SectionTitleLineWithButton icon={mdiAccountCreditCard} title="Billing overview" />

        <CardBox className="mb-6">
          <NotificationBar
            color="info"
            icon={mdiInformation}
            button={<BaseButton label="See details" small roundedFull />}
          >
            <b>Payment date</b> is approaching soon.
          </NotificationBar>
          <div className="md:flex md:justify-between md:items-center">
            <div className="md:flex md:items-center">
              <div className="mb-6 text-center md:mr-6 md:mb-0 md:text-left">
                <p className="text-gray-500">Next payment on</p>
                <h1 className="text-xl font-semibold">{firstDayOfNextMonth}</h1>
              </div>
              <div className="mb-6 text-center md:mb-0 md:text-left">
                <p className="text-gray-500">Last billed on</p>
                <h1 className="text-xl">{firstDayOfThisMonth}</h1>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500">Amount due</p>
              <h1 className="text-2xl font-semibold">$24.99</h1>
            </div>
          </div>
        </CardBox>

        {billingHistory.map((billingHistoryItem) => (
          <CardBoxBillingItem
            key={billingHistoryItem.id}
            amount={billingHistoryItem.amount}
            date={billingHistoryItem.date}
          />
        ))}

        <SectionTitleLineWithButton icon={mdiCreditCard} title="Payment methods">
          <BaseButton label="Add card" color="info" icon={mdiPlusCircle} small />
        </SectionTitleLineWithButton>

        {paymentMethods.map((paymentMethod) => (
          <CardBoxPaymentMethod
            key={paymentMethod.id}
            cardType={paymentMethod.cardType}
            cardNumber={paymentMethod.cardNumber}
            cardExpires={paymentMethod.cardExpires}
            cardOwner={paymentMethod.cardOwner}
            isPrimary={paymentMethod.isPrimary}
          />
        ))}

        <SectionTitleLineWithButton icon={mdiCloudLock} title="Security options" />

        <CardBox className="mb-6">
          <div className="flex items-center justify-between">
            <p>
              Last login <b>{firstDayOfThisMonth}</b> from IP
              <b>192.168.100.99</b>
            </p>
            <BaseButton label="Manage sessions" color="lightDark" small />
          </div>

          <BaseDivider />

          <Formik
            initialValues={{
              isApiEnabled: ['1'],
            }}
            onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
          >
            {(formikProps) => (
              <div className="flex items-center justify-between">
                <p className="mr-3 leading-none">
                  API status <b>{formikProps.values.isApiEnabled.length ? 'enabled' : 'disabled'}</b>
                </p>
                <Form>
                  <FormCheckRadio type="switch">
                    <Field type="checkbox" name="isApiEnabled" value={'1'} />
                  </FormCheckRadio>
                </Form>
              </div>
            )}
          </Formik>

          <BaseDivider />

          <Formik
            initialValues={{
              is2faEnabled: ['1'],
            }}
            onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
          >
            {(formikProps) => (
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-start">
                  <p className="mr-3 leading-none">2-factor authentication</p>
                  <PillTag
                    color={formikProps.values.is2faEnabled.length ? 'info' : 'danger'}
                    label={formikProps.values.is2faEnabled.length ? 'enabled' : 'disabled'}
                    small
                  />
                </div>
                <Form>
                  <FormCheckRadio type="switch">
                    <Field type="checkbox" name="is2faEnabled" value={'1'} />
                  </FormCheckRadio>
                </Form>
              </div>
            )}
          </Formik>

          <BaseDivider />

          <div className="flex items-center justify-between">
            <p>
              Password changed
              <b>long time ago</b>
            </p>
            <BaseButton label="Change password" color="lightDark" small />
          </div>
        </CardBox>

        <SectionTitleLineWithButton icon={mdiAccount} title="Manage profile" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <CardBox className="mb-6">
              <FormField label="Avatar" help="Max 500kb">
                <FormFilePicker label="Upload" color="info" icon={mdiUpload} />
              </FormField>
            </CardBox>

            <CardBox className="flex-1" hasComponentLayout>
              <Formik
                initialValues={userForm}
                onSubmit={(values: UserForm) => alert(JSON.stringify(values, null, 2))}
              >
                <Form className="flex flex-col flex-1">
                  <CardBoxComponentBody>
                    <FormField
                      label="Name"
                      help="Required. Your name"
                      labelFor="name"
                      icons={[mdiAccount]}
                    >
                      <Field name="name" id="name" placeholder="Name" />
                    </FormField>
                    <FormField
                      label="E-mail"
                      help="Required. Your e-mail"
                      labelFor="email"
                      icons={[mdiMail]}
                    >
                      <Field name="email" id="email" placeholder="E-mail" />
                    </FormField>
                  </CardBoxComponentBody>
                  <CardBoxComponentFooter>
                    <BaseButtons>
                      <BaseButton color="info" type="submit" label="Submit" />
                      <BaseButton color="info" label="Options" outline />
                    </BaseButtons>
                  </CardBoxComponentFooter>
                </Form>
              </Formik>
            </CardBox>
          </div>

          <CardBox hasComponentLayout>
            <Formik
              initialValues={{
                currentPassword: '',
                newPassword: '',
                newPasswordConfirmation: '',
              }}
              onSubmit={(values) => alert(JSON.stringify(values, null, 2))}
            >
              <Form className="flex flex-col flex-1">
                <CardBoxComponentBody>
                  <FormField
                    label="Current password"
                    help="Required. Your current password"
                    labelFor="currentPassword"
                    icons={[mdiAsterisk]}
                  >
                    <Field
                      name="currentPassword"
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                    />
                  </FormField>

                  <BaseDivider />

                  <FormField
                    label="New password"
                    help="Required. New password"
                    labelFor="newPassword"
                    icons={[mdiFormTextboxPassword]}
                  >
                    <Field
                      name="newPassword"
                      id="newPassword"
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormField>

                  <FormField
                    label="Confirm password"
                    help="Required. New password one more time"
                    labelFor="newPasswordConfirmation"
                    icons={[mdiFormTextboxPassword]}
                  >
                    <Field
                      name="newPasswordConfirmation"
                      id="newPasswordConfirmation"
                      type="password"
                      autoComplete="new-password"
                    />
                  </FormField>
                </CardBoxComponentBody>

                <CardBoxComponentFooter>
                  <BaseButtons>
                    <BaseButton color="info" type="submit" label="Submit" />
                    <BaseButton color="info" label="Options" outline />
                  </BaseButtons>
                </CardBoxComponentFooter>
              </Form>
            </Formik>
          </CardBox>
        </div>
      </SectionMain>
    </>
  )
}

ProfilePage.getLayout = function getLayout(page: ReactElement) {
  return <LayoutAuthenticated>{page}</LayoutAuthenticated>
}

export default ProfilePage
