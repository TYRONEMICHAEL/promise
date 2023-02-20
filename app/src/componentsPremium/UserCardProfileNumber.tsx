import NumberDynamic from '../components/NumberDynamic'

type Props = {
  number: number
  label: string
  className?: string
}

const UserCardProfileNumber = ({ number, label, className }: Props) => {
  return (
    <div className={`text-center ${className}`}>
      <h2 className="text-xl font-medium">
        <NumberDynamic value={number} />
      </h2>
      <p className="text-xs uppercase">{label}</p>
    </div>
  )
}

export default UserCardProfileNumber
