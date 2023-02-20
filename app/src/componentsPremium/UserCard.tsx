import { mdiCheckDecagram } from '@mdi/js'
import { Field, Form, Formik } from 'formik'
import { useAppSelector } from '../stores/hooks'
import CardBox from '../components/CardBox'
import FormCheckRadio from '../components/FormCheckRadio'
import PillTag from '../components/PillTag'
import UserAvatarCurrentUser from '../components/UserAvatarCurrentUser'

const UserCard = () => {
  const userName = useAppSelector((state) => state.main.userName)

  return (
    <CardBox flex="flex-row" className="items-center">
      <div className="flex items-center justify-around lg:justify-center">
        <UserAvatarCurrentUser className="lg:mx-12" />
        <div className="space-y-3 text-center md:text-left lg:mx-12">
          <div className="flex justify-center md:block">
            <Formik initialValues={{ userSwitchVal: true }} onSubmit={() => null}>
              <Form>
                <FormCheckRadio
                  v-model="userSwitchVal"
                  type="switch"
                  label="Notifications"
                  input-value
                >
                  <Field type="checkbox" name="userSwitchVal" value={true} />
                </FormCheckRadio>
              </Form>
            </Formik>
          </div>
          <h1 className="text-2xl">
            Howdy, <b>{userName}</b>!
          </h1>
          <p>
            Last login <b>12 mins ago</b> from <b>127.0.0.1</b>
          </p>
          <div className="flex justify-center md:block">
            <PillTag label="Verified" color="info" icon={mdiCheckDecagram} />
          </div>
        </div>
      </div>
    </CardBox>
  )
}

export default UserCard
