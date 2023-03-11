import { PublicKey } from "@solana/web3.js"
import { useEffect, useState } from "react"
import { solanaWalletCluster } from "../env"
import { canTopUp as accountCanTopUp, getBalanceForAccount, topUpAccount } from "../services/account"
import { nothing } from "../utils/helpers"
import SectionTitleLineWithButton from "./SectionTitleLineWithButton"
import { mdiWallet, mdiWalletPlus } from "@mdi/js"
import BaseButton from "./BaseButton"
import CardBox from "./CardBox"
import { LoadingIndicator } from "./LoadingIndicator"

type Props = {
    publicKey: PublicKey
  }
  
  export const SquadWalletSectionComponent = ({ publicKey }: Props) => {
    const [isLoadingBalance, setIsLoadingBalance] = useState(false)
    const [balance, setBalance] = useState(0)
    const canTopUp = accountCanTopUp()
  
    useEffect(() => {
      setIsLoadingBalance(true)
      getBalanceForAccount(publicKey)
        .then((balance) => {
          setBalance(balance)
        })
        .catch(nothing)
        .finally(() => {
          setIsLoadingBalance(false)
        })
    }, [setIsLoadingBalance, setBalance, publicKey])
  
    const topUp = async () => {
      setIsLoadingBalance(true)
      topUpAccount(publicKey, 2)
        .then((balance) => {
          setBalance(balance)
        })
        .catch(nothing)
        .finally(() => {
          setIsLoadingBalance(false)
        })
    }
  
    return (
      <div>
        <SectionTitleLineWithButton icon={mdiWallet} title="Wallet" excludeButton>
          {canTopUp && (
            <BaseButton
              onClick={topUp}
              label=""
              icon={mdiWalletPlus}
              color="contrast"
              roundedFull
              small
            />
          )}
        </SectionTitleLineWithButton>
        <CardBox>
          <div className="flex items-center justify-between">
            <p>
              <b>Balance</b>
            </p>
            <p>
              {isLoadingBalance && <LoadingIndicator />}
              {!isLoadingBalance && <>{balance} SOL</>}
            </p>
          </div>
        </CardBox>
      </div>
    )
  }