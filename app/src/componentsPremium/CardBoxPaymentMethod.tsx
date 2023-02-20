import { mdiCreditCardCheck, mdiCreditCardEdit, mdiTrashCan } from '@mdi/js'
import { CreditCardType } from '../interfaces/premium'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import CardBox from '../components/CardBox'
import PillTag from '../components/PillTag'
import CreditCardLogo from './CreditCardLogo'

type Props = {
  cardType: CreditCardType
  cardNumber: string
  cardExpires: string
  cardOwner: string
  isPrimary?: boolean
}

const CardBoxPaymentMethod = ({
  cardType,
  cardNumber,
  cardExpires,
  cardOwner,
  isPrimary,
}: Props) => {
  const cardTypeNames = {
    mc: 'MasterCard',
    visa: 'Visa',
  }

  const cardTypeName = cardTypeNames[cardType]

  return (
    <CardBox className="mb-6">
      <div className="md:flex md:justify-between md:items-center">
        <div className="flex justify-start items-center mb-6 md:mb-0">
          <CreditCardLogo className="mr-6" cardType={cardType} />
          <div className="mr-6">
            <h2 className="text-xl font-semibold">
              {cardTypeName} {cardNumber}
            </h2>
            <p className="text-gray-500 text-sm uppercase">
              {cardExpires} {cardOwner}
            </p>
          </div>
          {isPrimary && <PillTag color="info" icon={mdiCreditCardCheck} label="Primary" small />}
        </div>
        <BaseButtons type="justify-end md:justify-start">
          <BaseButton icon={mdiCreditCardEdit} color="lightDark" />
          <BaseButton icon={mdiTrashCan} color="lightDark" />
        </BaseButtons>
      </div>
    </CardBox>
  )
}

export default CardBoxPaymentMethod
