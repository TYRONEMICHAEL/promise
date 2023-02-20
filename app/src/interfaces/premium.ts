import type { BgKey, ColorButtonKey, ColorKey, MenuAsideItem } from '.'

export type SnackBarPushedMessage = {
  text: string
  color: ColorButtonKey
  lifetime: number
}

export type SnackBarMessage = SnackBarPushedMessage & {
  timestamp: number
}

export type CreditCardType = 'mc' | 'visa'

export type BgKeyPremium = BgKey | 'yellowRed' | 'redYellow'

export type SampleProduct = {
  name: string
  date: string
  adjective: string
  material: string
  price: string
  product: string
}

export type MenuAsideItemPremium = MenuAsideItem & {
  key?: string
  menuSecondary?: MenuAsideItem[]
  updateMark?: ColorKey
}

export type PricingItem = {
  title: string
  subTitle: string
  label: string
  labelType: ColorKey
  options: {
    main: string
    sub: string
  }[]
}
