// import { mdiDotsVertical } from '@mdi/js'
import { SampleProduct } from '../interfaces'
// import { buttonMenuOptions } from '../../src/sampleButtonMenuOptions'
import BaseButtons from '../components/BaseButtons'
import CardBox from '../components/CardBox'
import PillTag from '../components/PillTag'
import UserAvatar from '../components/UserAvatar'

type Props = {
  product: SampleProduct
}

const CardBoxProduct = ({ product }: Props) => {
  return (
    <CardBox className="mb-6 last:mb-0" is-hoverable>
      <div className="flex items-center justify-between flex-col md:flex-row">
        <div className="flex items-center justify-start flex-col md:flex-row">
          <UserAvatar className="w-12 h-12 md:mr-6" api="bottts" username={product.name} />
          <div className="text-center md:text-left">
            <h4 className="text-xl">{product.name}</h4>
            <p className="text-gray-500">{product.date}</p>
          </div>
        </div>

        <div className="flex items-center justify-end flex-col md:flex-row">
          <BaseButtons class-addon="mr-1.5 last:mr-0 mb-3">
            <PillTag color="success" label={product.adjective} small />
            <PillTag color="info" label={product.material} small />
            <PillTag color="warning" label={product.product} small />
          </BaseButtons>
          <h4 className="text-xl md:mx-6">${product.price}</h4>
          {/* <ButtonMenu options={buttonMenuOptions} icon={mdiDotsVertical} small /> */}
        </div>
      </div>
    </CardBox>
  )
}

export default CardBoxProduct
