import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import CardBox from '../components/CardBox'
import PillTag from '../components/PillTag'

type Props = {
  date: string
  amount: number
}

const CardBoxBillingItem = ({ date, amount }: Props) => {
  return (
    <CardBox className="mb-6">
      <div className="md:flex md:justify-between md:items-center">
        <BaseButtons type="justify-center md:justify-start">
          <BaseButton label="View invoice" color="lightDark" small />
          <BaseButton label="PDF" color="lightDark" small />
        </BaseButtons>
        <div className="mt-6 md:mt-0 flex justify-between md:justify-end items-center">
          <p className="text-gray-500 mr-6">{date}</p>
          <PillTag color="info" label="Paid" className="mr-6" />
          <h2 className="text-2xl font-semibold">${amount}</h2>
        </div>
      </div>
    </CardBox>
  )
}

export default CardBoxBillingItem
