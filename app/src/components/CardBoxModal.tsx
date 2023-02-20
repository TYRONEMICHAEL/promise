import { mdiClose } from '@mdi/js'
import { ReactNode, useState } from 'react'
import type { ColorButtonKey } from '../interfaces'
import BaseButton from '../components/BaseButton'
import BaseButtons from '../components/BaseButtons'
import CardBox from '../components/CardBox'
import CardBoxComponentTitle from '../components/CardBoxComponentTitle'
import OverlayLayer from '../components/OverlayLayer'

type Props = {
  title: string
  buttonColor: ColorButtonKey
  buttonLabel: string
  isActive: boolean
  hasShake?: boolean
  children: ReactNode
  onConfirm: () => void
  onCancel?: () => void
}

const CardBoxModal = ({
  title,
  buttonColor,
  buttonLabel,
  isActive,
  hasShake,
  children,
  onConfirm,
  onCancel,
}: Props) => {
  const [hasScaleAddon, setHasScaleAddon] = useState(false)

  if (!isActive) {
    return null
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      setHasScaleAddon(true)
      setTimeout(() => {
        setHasScaleAddon(false)
      }, 300)
    }
  }

  const footer = (
    <BaseButtons>
      <BaseButton label={buttonLabel} color={buttonColor} onClick={onConfirm} />
      {!!onCancel && <BaseButton label="Cancel" color={buttonColor} outline onClick={onCancel} />}
    </BaseButtons>
  )

  return (
    <OverlayLayer
      onClick={handleCancel}
      className={`${onCancel ? 'cursor-pointer' : ''} animate-fade-in-fast`}
    >
      <CardBox
        className={`transition-transform shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50 animate-fade-in-fast ${
          hasScaleAddon ? 'scale-105' : 'scale-100'
        } ${hasShake ? 'animate-shake' : ''}`}
        isModal
        footer={footer}
      >
        <CardBoxComponentTitle title={title}>
          {!!onCancel && (
            <BaseButton icon={mdiClose} color="whiteDark" onClick={onCancel} small roundedFull />
          )}
        </CardBoxComponentTitle>

        <div className="space-y-3">{children}</div>
      </CardBox>
    </OverlayLayer>
  )
}

export default CardBoxModal
