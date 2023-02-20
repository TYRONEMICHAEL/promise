import Link from 'next/link'
import BaseIcon from '../components/BaseIcon'

type Props = {
  href: string
  label: string
  icon?: string
  small?: boolean
}

const ButtonTextLink = ({ href, icon, label, small }: Props) => {
  return (
    <Link
      href={href}
      className={`inline-flex items-center cursor-pointer ${small ? 'text-sm' : ''}`}
    >
      {!!icon && <BaseIcon path={icon} w="w-4" h="h-4" className={small ? 'mr-1' : 'mr-2'} />}
      <span>{label}</span>
    </Link>
  )
}

export default ButtonTextLink
