import SectionTitle from './SectionTitle'
import WalletNavBarButton from './navbar/items/WalletNavBarButton'

export const RequiresWallet = () => {
  return (
    <div className="grid place-items-center">
      <SectionTitle>Uh Oh! You require a Wallet.</SectionTitle>
      <WalletNavBarButton />
    </div>
  )
}
