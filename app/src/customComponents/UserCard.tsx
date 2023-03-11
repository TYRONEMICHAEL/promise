import { mdiCheckDecagram } from '@mdi/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { Field, Form, Formik } from 'formik'
import { colorsOutline } from '../colors'
import CardBox from '../components/CardBox'
import FormCheckRadio from '../components/FormCheckRadio'
import { LoadingIndicator } from '../components/LoadingIndicator'
import PillTag from '../components/PillTag'
import { useMatches } from '../hooks/matches'
import { getUsername } from '../utils/names'
import { UserAvatarType } from './UserAvatar'
import UserAvatarCurrentUser from './UserAvatarCurrentUser'

const UserCard = ({ avatar }: { avatar: UserAvatarType }) => {
  const wallet = useWallet()
  const [yourMatches, isLoadingMatches] = useMatches(true)


  const username = wallet && wallet.publicKey ? getUsername(wallet.publicKey) : "Unknown"

  return (
    <CardBox flex="flex-row" className="items-center mt-20 lg:mt-0 flex-1">
      <div className="flex flex-col lg:flex-row items-center justify-around lg:justify-center">
        <UserAvatarCurrentUser className='mb-4 -mt-20 lg:mb-0 lg:mt-0' avatar={avatar} username={username} />
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
            Howdy, <b>{username}</b>!
          </h1>
          {isLoadingMatches && <LoadingIndicator /> }
          {!isLoadingMatches &&
          <><p>
              You have a current score of <b className={colorsOutline['success']}>4.5</b> after playing <b>{yourMatches.length}</b> matches.
            </p><div className="flex justify-center md:block">
                <PillTag label="Silver" color="white" icon={mdiCheckDecagram} />
              </div></>
          }
        </div>
      </div>
    </CardBox>
  )
}

export default UserCard
