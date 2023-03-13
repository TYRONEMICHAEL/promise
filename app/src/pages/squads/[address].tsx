import { mdiAccountMultiple, mdiCheck, mdiTableTennis, mdiTimelapse } from '@mdi/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useEffect, useState } from 'react'
import { colorsText } from '../../colors'
import { AddressComponent } from '../../components/AddressComponent'
import BaseButton from '../../components/BaseButton'
import BaseDivider from '../../components/BaseDivider'
import BaseIcon from '../../components/BaseIcon'
import CardBox from '../../components/CardBox'
import { LoadingIndicator } from '../../components/LoadingIndicator'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { SquadWalletSectionComponent } from '../../components/SquadWalletSectionComponent'
import { getPageTitle } from '../../config'
import SquadCard from '../../customComponents/SquadCard'
import { UserAvatarType } from '../../customComponents/UserAvatar'
import { useSquads } from '../../hooks/squads'
import { SnackBarPushedMessage } from '../../interfaces'
import { SquadTransaction, statusToString } from '../../interfaces/squads'
import LayoutApp from '../../layouts/App'
import { getMatchesForSquad } from '../../services/matches'
import { approveTransactionForSquad, getAuthorityKeyForSquad } from '../../services/squads'
import { useAppDispatch } from '../../stores/hooks'
import { pushMessage } from '../../stores/snackBarSlice'
import { catchAll, truncate } from '../../utils/helpers'
import { getUsername } from '../../utils/names'

const SquadDetails = () => {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const wallet = useWallet()
  const [isAccepting, setIsAccepting] = useState(false)
  const [squads, isLoadingSquads] = useSquads()
  const [isLoadingMatches, setIsLoadingMatches] = useState(false)
  const [matches, setMatches] = useState([])

  const { address } = router.query
  const squad = squads.find((squad) => squad.address == address)
  const member = squad?.members.find((member) => member !== wallet.publicKey?.toBase58())

  useEffect(() => {
    if (!squad) return
    setIsLoadingMatches(true)
    getMatchesForSquad(squad)
      .then(setMatches)
      .catch(catchAll(dispatch))
      .finally(() => {
        setIsLoadingMatches(false)
      })
  }, [dispatch, setIsLoadingMatches, setMatches, squad])

  const approveTransaction = async (transaction) => {
    setIsAccepting(true)
    approveTransactionForSquad(squad, transaction)
      .then(() => {
        router.reload()
        dispatch(pushMessage(createSnackbarMessage('Successfully approved match', true)))
      })
      .catch(catchAll(dispatch, 'Failed to approve match'))
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
              <div className="lg:col-span-1 col-span-3 mt-6">
                <SquadCard squad={squad} avatar={UserAvatarType.bot} />
                <div className="text-gray-500 dark:text-slate-400 grid place-items-center py-3">
                  <small>Powered by Squads Protocol.</small>
                </div>
              </div>
              <div className="lg:col-span-2 col-span-3">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="lg:col-span-1 col-span-2">
                    <SquadWalletSectionComponent
                      publicKey={getAuthorityKeyForSquad(squad.address)}
                    />
                  </div>
                  <div className="lg:col-span-1 col-span-2">
                    <SectionTitleLineWithButton
                      icon={mdiTableTennis}
                      title="Matches"
                      excludeButton
                    />
                    <CardBox>
                      <div className="flex items-center justify-between">
                        <div>
                          <b>Number of Matches</b>
                        </div>
                        {isLoadingMatches && <LoadingIndicator />}
                        {!isLoadingMatches && <>{matches.length}</>}
                      </div>
                    </CardBox>
                  </div>
                </div>
                {squad.waitingTransactions.length > 0 && (
                  <>
                    <SectionTitleLineWithButton
                      icon={mdiTableTennis}
                      title="Pending Matches"
                      excludeButton
                    />
                    <CardBox flex="flex-row">
                      {squad.waitingTransactions.map((transaction, index) => {
                        return (
                          <div key={transaction.publicKey.toBase58()}>
                            <div className="flex items-center justify-between">
                              <p>{truncate(transaction.publicKey.toBase58())}...</p>
                              {isAccepting && mustApproveTransaction(transaction) && (
                                <LoadingIndicator />
                              )}
                              {!isAccepting && mustApproveTransaction(transaction) && (
                                <BaseButton
                                  onClick={() => approveTransaction(transaction)}
                                  label="Approve"
                                  icon={mdiCheck}
                                  iconSize={12}
                                  color="contrast"
                                  small
                                  roundedFull
                                />
                              )}
                              {!mustApproveTransaction(transaction) && (
                                <BaseIcon path={mdiTimelapse} className={colorsText['info']} />
                              )}
                            </div>
                            {index < squad.waitingTransactions.length - 1 && <BaseDivider />}
                          </div>
                        )
                      })}
                    </CardBox>
                  </>
                )}
                <SectionTitleLineWithButton
                  icon={mdiAccountMultiple}
                  title="Details"
                  excludeButton
                />
                <CardBox flex="flex-row">
                  <div className="flex items-center justify-between">
                    <div>
                      <b>Address</b>
                      <div className="text-gray-500 dark:text-slate-400">
                        <small>Public address of the multisig account.</small>
                      </div>
                    </div>
                    <AddressComponent address={squad.address} />
                  </div>

                  <BaseDivider />

                  <div className="flex items-center justify-between">
                    <div>
                      <b>Wallet</b>
                      <div className="text-gray-500 dark:text-slate-400">
                        <small>Public address of the vault account.</small>
                      </div>
                      <div className="text-gray-500 dark:text-slate-400">
                        <small>
                          <b>Use this address to transfer SOL.</b>
                        </small>
                      </div>
                    </div>
                    <AddressComponent address={getAuthorityKeyForSquad(squad.address).toBase58()} />
                  </div>

                  <BaseDivider />

                  <div className="flex items-center justify-between">
                    <div>
                      <b>Partner</b>
                      {squad.numberOfApprovers > 1 && (
                        <div className="text-gray-500 dark:text-slate-400">
                          <small>Transactions require approval from your partner.</small>
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <b>{getUsername(new PublicKey(member))}</b>
                      <small>
                        <AddressComponent address={member} size={12} />
                      </small>
                    </div>
                  </div>

                  <BaseDivider />

                  <div className="flex items-center justify-between">
                    <div>
                      <b>State</b>
                    </div>
                    <div>{statusToString(squad.status)}</div>
                  </div>
                </CardBox>
              </div>
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
