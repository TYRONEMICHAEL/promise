import { mdiCheck, mdiChevronDown, mdiChevronUp } from '@mdi/js'
import { useState } from 'react'
import type { PricingItem } from '../interfaces/premium'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import BaseIcon from '../components/BaseIcon'
import CardBox from '../components/CardBox'
import CardBoxComponentBody from '../components/CardBoxComponentBody'
import CardBoxComponentFooter from '../components/CardBoxComponentFooter'
import PillTag from '../components/PillTag'

type Props = {
  item: PricingItem
  price: string
  period: string
  className?: string
  isMain?: boolean
}

const CardBoxPricing = ({ item, price, period, className, isMain }: Props) => {
  const isCollapsible = !isMain

  const [isCollapsed, setIsCollapsed] = useState(true)

  return (
    <CardBox
      className={`${isMain ? 'shadow-2xl' : 'lg:my-12'} ${className}`}
      rounded="rounded-2xl"
      hasComponentLayout
    >
      <header
        className="p-6 border-gray-50 dark:border-slate-800 border-b"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center justify-start">
              <h3 className="text-4xl">$</h3>
              <h1 className="text-5xl font-black">{price}</h1>
              <h1 className="text-xl text-gray-500 dark:text-gray-400">/{period}</h1>
            </div>
            <PillTag label={item.label} color={item.labelType} className="mt-3" small />
          </div>

          <div className="flex items-center justify-between">
            <div className="text-right">
              <h1 className="text-2xl">{item.title}</h1>
              <h1 className="text-lg text-gray-500 dark:text-gray-400">{item.subTitle}</h1>
            </div>
            {isCollapsible && (
              <BaseIcon
                path={isCollapsible && isCollapsed ? mdiChevronUp : mdiChevronDown}
                size="48"
                w="w-16"
                h="h-16"
                className="ml-6 lg:hidden"
              />
            )}
          </div>
        </div>
      </header>

      <CardBoxComponentBody className={isCollapsible && isCollapsed ? 'hidden lg:block' : ''}>
        <div className="space-y-6">
          {item.options.map((option) => (
            <div key={option.main} className="flex items-center">
              <BaseIcon path={mdiCheck} size="24" w="w-8" h="h-8" />
              <span className="text-lg ml-3">
                <b>{option.main}</b> {option.sub}
              </span>
            </div>
          ))}
        </div>
      </CardBoxComponentBody>

      <CardBoxComponentFooter className={isCollapsible && isCollapsed ? 'hidden lg:block' : ''}>
        <BaseButtons>
          <BaseButton className="flex-1" color="info" label="Subscribe" outline={!isMain} />
        </BaseButtons>
      </CardBoxComponentFooter>
    </CardBox>
  )
}

export default CardBoxPricing
