import { mdiOpenInNew } from '@mdi/js'
import { useWallet } from '@solana/wallet-adapter-react'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'
import BaseButton from '../../BaseButton'
import { useEffect } from 'react'
import { useAppDispatch } from '../../../stores/hooks'
import { setConnected } from '../../../stores/mainSlice'

export default function WalletNavBarButton() {
  const dispatch = useAppDispatch()
  const {
    connected: isConnected,
    connecting: isConnecting,
    publicKey,
    disconnect: disconnectWallet,
  } = useWallet()
  const { setVisible } = useWalletModal()

  useEffect(() => {
    dispatch(setConnected({ isConnected }))
  }, [dispatch, isConnected])

  const connect = () => {
    setVisible(true)
  }

  const disconnect = () => {
    disconnectWallet()
  }

  const formattedPublicKey = publicKey?.toString()
  const truncatedPublicKey = `${formattedPublicKey?.substring(
    0,
    Math.min(formattedPublicKey.length, 6)
  )}...`

  return (
    <div className="block lg:flex items-center relative cursor-pointer">
      {!isConnected && !isConnecting && (
        <BaseButton
          onClick={connect}
          color="contrast"
          label="Connect"
          icon={mdiOpenInNew}
          outline={false}
          small={true}
          roundedFull={false}
          disabled={false}
        />
      )}
      {!isConnected && isConnecting && (
        <BaseButton
          onClick={connect}
          color="contrast"
          label="Connecting"
          icon={mdiOpenInNew}
          outline={false}
          small={true}
          roundedFull={false}
          disabled={true}
        />
      )}
      {isConnected && publicKey && (
        <BaseButton
          onClick={disconnect}
          color="contrast"
          label={truncatedPublicKey}
          icon={mdiOpenInNew}
          outline={false}
          small={true}
          roundedFull={false}
          disabled={false}
        />
      )}
    </div>
  )
}
