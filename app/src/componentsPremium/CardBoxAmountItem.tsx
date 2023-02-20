import { ColorKey, TrendType } from '../interfaces'
import BaseDivider from '../components/BaseDivider'
import IconRounded from '../components/IconRounded'
// import PillTagTrend from '../PillTagTrend'

type Props = {
  title: string
  value: string
  trend?: string
  trendType?: TrendType
  icon?: string
  iconType?: ColorKey
  divider?: boolean
}

const CardBoxAmountItem = (props: Props) => {
  return (
    <>
      {!!props.trend && (
        <div className="mb-3">
          {/* <PillTagTrend label={props.trend} type={props.trendType} small /> */}
        </div>
      )}

      <div className={props.icon ? 'flex justify-between items-center' : ''}>
        <div className="space-y-3">
          <h4 className="text-gray-500 dark:text-gray-400">{props.title}</h4>
          <h3 className="text-xl">{props.value}</h3>
        </div>
        {!!props.icon && <IconRounded icon={props.icon} color={props.iconType} bg />}
      </div>
      {props.divider && <BaseDivider />}
    </>
  )
}

export default CardBoxAmountItem
