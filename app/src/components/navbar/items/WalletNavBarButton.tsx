import { mdiLoading, mdiOpenInNew, mdiWallet } from '@mdi/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import BaseButton from '../../BaseButton'
import { useEffect } from 'react'
import { useAppDispatch } from '../../../stores/hooks'
import { setConnected } from '../../../stores/mainSlice'
import { getWalletPublicKey } from '../../../utils/wallet'

export default function WalletNavBarButton() {
  const dispatch = useAppDispatch()
  const wallet = useWallet()
  const { setVisible } = useWalletModal()

  useEffect(() => {
    dispatch(setConnected({ isConnected: wallet.connected }))
  }, [dispatch, wallet])

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
