export type UserPayloadObject = {
  isConnected: boolean 
}

export type MenuAsideItem = {
  label: string
  icon?: string
  href?: string
  target?: string
  color?: ColorButtonKey
  isLogout?: boolean
  menu?: MenuAsideItem[]
}

export type MenuNavBarItem = {
  label?: string
  icon?: string
  href?: string
  target?: string
  isDivider?: boolean
  isLogout?: boolean
  isDesktopNoLabel?: boolean
  isToggleLightDark?: boolean
  isCurrentUser?: boolean
  isConnect?: boolean
  menu?: MenuNavBarItem[]
}

export type ColorKey = 'white' | 'light' | 'contrast' | 'success' | 'danger' | 'warning' | 'info'

export type ColorButtonKey =
  | 'white'
  | 'whiteDark'
  | 'lightDark'
  | 'contrast'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'void'

export type BgKey = 'purplePink' | 'pinkRed'

export type TrendType = 'up' | 'down' | 'success' | 'danger' | 'warning' | 'info'

export type TransactionType = 'withdraw' | 'deposit' | 'invoice' | 'payment'

export type Transaction = {
  id: number
  amount: number
  account: string
  name: string
  date: string
  type: TransactionType
  business: string
}

export type Client = {
  id: number
  avatar: string
  login: string
  name: string
  company: string
  city: string
  progress: number
  created: string
  created_mm_dd_yyyy: string
}

export type StyleKey = 'white' | 'basic'

export type UserForm = {
  name: string
  email: string
}

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