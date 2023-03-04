/* eslint-disable @next/next/no-img-element */
/* ...next/image is useless with svgs */

import { CreditCardType } from '../interfaces'
import VisaBlue from '../../assets/visa-blue.svg'
import McLight from '../../assets/mc-light-bg.svg'

type Props = {
  cardType: CreditCardType
  className?: string
}

const CreditCardLogo = ({ cardType, className }: Props) => {
  return (
    <div
      className={`flex items-center justify-center h-12 w-20 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
    >
      {cardType === 'mc' && (
        <img src={McLight.src} className="dark:grayscale h-8 md:h-10" alt="MasterCard" />
      )}
      {cardType === 'visa' && (
        <img src={VisaBlue.src} className="dark:grayscale dark:invert" alt="Visa" />
      )}
    </div>
  )
}

export default CreditCardLogo
