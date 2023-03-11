import { mdiLoading, mdiWallet } from '@mdi/js'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import { useEffect } from 'react'
import { useAppDispatch } from '../../../stores/hooks'
import { setConnected } from '../../../stores/mainSlice'
import { getWalletPublicKey } from '../../../utils/wallet'
import BaseButton from '../../BaseButton'
import { setConnection, setWallet } from '../../../services/account'

export default function WalletNavBarButton() {
  const dispatch = useAppDispatch()
  const wallet = useWallet()
  const { connection } = useConnection()
  const { setVisible } = useWalletModal()

  useEffect(() => {
    dispatch(setConnected({ isConnected: wallet.connected }))

    setConnection(connection)
    setWallet(wallet)
  }, [dispatch, wallet, connection])

  const connect = () => {
    setVisible(true)
  }

  const disconnect = () => {
    wallet.disconnect()
  }

  return (
    <div className="block lg:flex items-center relative cursor-pointer">
      {!wallet.connected && !wallet.connecting && (
        <BaseButton
          onClick={connect}
          color="contrast"
          label="Connect"
          icon={mdiWallet}
          small
        />
      )}
      {!wallet.connected && wallet.connecting && (
        <BaseButton
          onClick={connect}
          color="contrast"
          label="Connecting"
          icon={mdiLoading}
          small
        />
      )}
      {wallet.connected && (
        <BaseButton
          onClick={disconnect}
          color="contrast"
          label={getWalletPublicKey(wallet)}
          icon={mdiWallet}
          small
        />
      )}
    </div>
  )
}
