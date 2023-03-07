import {
  mdiAccountMultiple,
  mdiCheck,
  mdiClipboard,
  mdiContentCopy,
  mdiTableTennis,
  mdiWatch,
} from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { colorsText } from '../../colors'
import BaseButton from '../../components/BaseButton'
import BaseDivider from '../../components/BaseDivider'
import BaseIcon from '../../components/BaseIcon'
import CardBox from '../../components/CardBox'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'
import { useSquads } from '../../hooks/squads'
import { SnackBarPushedMessage } from '../../interfaces'
import { SquadTransaction, statusToString } from '../../interfaces/squads'
import LayoutApp from '../../layouts/App'
import { approveTransactionForSquad, getAuthorityKeyForSquad } from '../../services/squads'
import { useAppDispatch } from '../../stores/hooks'
import { pushMessage } from '../../stores/snackBarSlice'
import { nothing, truncate } from '../../utils/helpers'
import { AddressComponent } from '../../components/AddressComponent'

const SquadDetails = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const wallet = useWallet()
  const [isAccepting, setIsAccepting] = useState(false)
  const [squads, isLoadingSquads] = useSquads()

  const { address } = router.query
  const squad = squads.find((squad) => squad.address == address)

  const approveTransaction = async (transaction) => {
    setIsAccepting(true)
    approveTransactionForSquad(wallet, transaction)
      .then(() => {
        router.reload()
        dispatch(pushMessage(createSnackbarMessage('Successfully approved match', true)))
      })
      .catch(console.error)
      .finally(() => {
        setIsAccepting(false)
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

  const mustApproveTransaction = (transaction: SquadTransaction) => {
    const approvers = transaction.approved.map((approver) => approver.toBase58())
    return !approvers.includes(wallet?.publicKey?.toBase58())
  }

  return (
    <>
      <Head>
        <title>{getPageTitle(`Squad ${squad?.address}`)}</title>
      </Head>

      <SectionMain>
        {isLoadingSquads && <LoadingIndicator />}
        {!isLoadingSquads && squad && (
          <>
            <div className="grid lg:grid-cols-3 gap-6 mb-6">
              <CardBox
                flex="flex-row"
                className={squad.waitingTransactions.length > 0 ? 'col-span-2' : 'col-span-3'}
              >
                <SectionTitleLineWithButton
                  icon={mdiAccountMultiple}
                  title="Details"
                  excludeButton
                />

                <div className="flex items-center justify-between">
                  <p>
                    <b>Address</b>
                  </p>
                  <AddressComponent address={squad.address} />
                </div>

                <BaseDivider />

                <div className="flex items-center justify-between">
                  <p>
                    <b>Authority</b>
                  </p>
                  <AddressComponent
                    address={getAuthorityKeyForSquad(wallet, squad.address).toBase58()}
                  />
                </div>

                <BaseDivider />

                <div className="flex items-center justify-between">
                  <p>
                    <b>Creator</b>
                  </p>
                  <AddressComponent address={squad.createKey} />
                </div>

                <BaseDivider />

                <div className="flex items-center justify-between">
                  <p>
                    <b>Member</b>
                  </p>
                  <AddressComponent address={squad.members[0]} />
                </div>

                <BaseDivider />

                <div className="flex items-center justify-between">
                  <p>
                    <b>State</b>
                  </p>
                  <p>{statusToString(squad.status)}</p>
                </div>

                <BaseDivider />

                <div className="flex items-center justify-between">
                  <p>
                    <b>Number of approvers</b>
                  </p>
                  <p>{squad.numberOfApprovers}</p>
                </div>

                <BaseDivider />
              </CardBox>

              {squad.waitingTransactions.length > 0 && (
                <CardBox className="lg:col-span-1">
                  <SectionTitleLineWithButton
                    icon={mdiTableTennis}
                    title="Pending Matches"
                    excludeButton
                  />
                  {squad.waitingTransactions.map((transaction) => {
                    return (
                      <>
                        <div
                          key={transaction.publicKey.toBase58()}
                          className="flex items-center justify-between"
                        >
                          <p>{truncate(transaction.publicKey.toBase58())}...</p>
                          {isAccepting && mustApproveTransaction(transaction) && (
                            <LoadingIndicator />
                          )}
                          {!isAccepting && mustApproveTransaction(transaction) && (
                            <BaseButton
                              onClick={() => approveTransaction(transaction)}
                              label="Approve"
                              icon={mdiCheck}
                              color="contrast"
                              small
                            />
                          )}
                          {!mustApproveTransaction(transaction) && (
                            <BaseIcon
                              path={mdiWatch}
                              size="16"
                              w=""
                              h="h-16"
                              className={colorsText['info']}
                            />
                          )}
                        </div>
                        <BaseDivider />
                      </>
                    )
                  })}
                </CardBox>
              )}
            </div>
          </>
        )}
      </SectionMain>
    </>
  )
}

SquadDetails.getLayout = function getLayout(page: ReactElement) {
  return <LayoutApp>{page}</LayoutApp>
}

export default SquadDetails
