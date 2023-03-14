import { mdiHome } from '@mdi/js'
import BaseButton from './BaseButton'
import SectionTitle from './SectionTitle'
import WalletNavBarButton from './navbar/items/WalletNavBarButton'

export const RequiresWallet = () => {
  return (
    <div className="grid place-items-center gap-3">
      <SectionTitle>Uh Oh! You require a Wallet.</SectionTitle>
      <WalletNavBarButton />
      <BaseButton
            href="/"
            label="Home"
            icon={mdiHome}
            color="contrast"
            small
          />
    </div>
  )
}
