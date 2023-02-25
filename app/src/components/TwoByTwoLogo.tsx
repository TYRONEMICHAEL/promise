import Image from 'next/image'

type Props = {
  className?: string
}

export default function TwoByTwoLogo({ className = '' }: Props) {
  return (
    <Image src='./logo.png' alt='logo' width={50} height={25} className={className} />
  )
}
