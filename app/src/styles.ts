interface StyleObject {
  aside: string
  asideScrollbars: string
  asideBrand: string
  asideMenuItem: string
  asideMenuItemActive: string
  asideMenuItemActiveBg: string
  asideMenuItemInactive: string
  asideMenuDropdown: string
  navBarItemLabel: string
  navBarItemLabelHover: string
  navBarItemLabelActiveColor: string
  overlay: string
}

export const basic: StyleObject = {
  aside: 'bg-gray-800',
  asideScrollbars: 'aside-scrollbars-gray',
  asideBrand: 'bg-gray-900 text-white',
  asideMenuItem: 'text-gray-300 hover:text-white',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-gray-600/25',
  asideMenuItemInactive: 'text-gray-300',
  asideMenuDropdown: 'bg-gray-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-blue-500',
  navBarItemLabelActiveColor: 'text-blue-600',
  overlay: 'from-gray-700 via-gray-900 to-gray-700',
}

export const white: StyleObject = {
  aside: 'bg-white',
  asideScrollbars: 'aside-scrollbars-light',
  asideBrand: '',
  asideMenuItem: 'text-blue-600 hover:text-black dark:text-white',
  asideMenuItemActive: 'font-bold text-black dark:text-white',
  asideMenuItemActiveBg: 'bg-gray-100/75',
  asideMenuItemInactive: '',
  asideMenuDropdown: 'bg-gray-50',
  navBarItemLabel: 'text-blue-600',
  navBarItemLabelHover: 'hover:text-black',
  navBarItemLabelActiveColor: 'text-black',
  overlay: 'from-white via-gray-100 to-white',
}

export const slate: StyleObject = {
  aside: 'bg-slate-800',
  asideScrollbars: 'aside-scrollbars-[slate]',
  asideBrand: 'bg-slate-900 text-white',
  asideMenuItem: 'hover:bg-slate-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-slate-600/25',
  asideMenuItemInactive: 'text-slate-300',
  asideMenuDropdown: 'bg-slate-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-slate-500',
  navBarItemLabelActiveColor: 'text-slate-600',
  overlay: 'from-slate-700 via-slate-900 to-slate-700',
}

export const zinc: StyleObject = {
  aside: 'bg-zinc-800',
  asideScrollbars: 'aside-scrollbars-[zinc]',
  asideBrand: 'bg-zinc-900 text-white',
  asideMenuItem: 'hover:bg-zinc-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-zinc-600/25',
  asideMenuItemInactive: 'text-zinc-300',
  asideMenuDropdown: 'bg-zinc-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-zinc-500',
  navBarItemLabelActiveColor: 'text-zinc-600',
  overlay: 'from-zinc-700 via-zinc-900 to-zinc-700',
}

export const neutral: StyleObject = {
  aside: 'bg-neutral-800',
  asideScrollbars: 'aside-scrollbars-[neutral]',
  asideBrand: 'bg-neutral-900 text-white',
  asideMenuItem: 'hover:bg-neutral-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-neutral-600/25',
  asideMenuItemInactive: 'text-neutral-300',
  asideMenuDropdown: 'bg-neutral-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-neutral-500',
  navBarItemLabelActiveColor: 'text-neutral-600',
  overlay: 'from-neutral-700 via-neutral-900 to-neutral-700',
}

export const stone: StyleObject = {
  aside: 'bg-stone-800',
  asideScrollbars: 'aside-scrollbars-[stone]',
  asideBrand: 'bg-stone-900 text-white',
  asideMenuItem: 'hover:bg-stone-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-stone-600/25',
  asideMenuItemInactive: 'text-stone-300',
  asideMenuDropdown: 'bg-stone-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-stone-500',
  navBarItemLabelActiveColor: 'text-stone-600',
  overlay: 'from-stone-700 via-stone-900 to-stone-700',
}

export const emerald: StyleObject = {
  aside: 'bg-emerald-800',
  asideScrollbars: 'aside-scrollbars-[emerald]',
  asideBrand: 'bg-emerald-900 text-white',
  asideMenuItem: 'hover:bg-emerald-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-emerald-600/25',
  asideMenuItemInactive: 'text-emerald-300',
  asideMenuDropdown: 'bg-emerald-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-emerald-500',
  navBarItemLabelActiveColor: 'text-emerald-600',
  overlay: 'from-emerald-50 via-emerald-200 to-emerald-50',
}

export const teal: StyleObject = {
  aside: 'bg-teal-800',
  asideScrollbars: 'aside-scrollbars-[teal]',
  asideBrand: 'bg-teal-900 text-white',
  asideMenuItem: 'hover:bg-teal-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-teal-600/25',
  asideMenuItemInactive: 'text-teal-300',
  asideMenuDropdown: 'bg-teal-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-teal-500',
  navBarItemLabelActiveColor: 'text-teal-600',
  overlay: 'from-teal-50 via-teal-200 to-teal-50',
}

export const cyan: StyleObject = {
  aside: 'bg-cyan-800',
  asideScrollbars: 'aside-scrollbars-[cyan]',
  asideBrand: 'bg-cyan-900 text-white',
  asideMenuItem: 'hover:bg-cyan-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-cyan-600/25',
  asideMenuItemInactive: 'text-cyan-300',
  asideMenuDropdown: 'bg-cyan-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-cyan-500',
  navBarItemLabelActiveColor: 'text-cyan-600',
  overlay: 'from-cyan-50 via-cyan-200 to-cyan-50',
}

export const sky: StyleObject = {
  aside: 'bg-sky-800',
  asideScrollbars: 'aside-scrollbars-[sky]',
  asideBrand: 'bg-sky-900 text-white',
  asideMenuItem: 'hover:bg-sky-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-sky-600/25',
  asideMenuItemInactive: 'text-sky-300',
  asideMenuDropdown: 'bg-sky-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-sky-500',
  navBarItemLabelActiveColor: 'text-sky-600',
  overlay: 'from-sky-50 via-sky-200 to-sky-50',
}

export const blue: StyleObject = {
  aside: 'bg-blue-800',
  asideScrollbars: 'aside-scrollbars-[blue]',
  asideBrand: 'bg-blue-900 text-white',
  asideMenuItem: 'hover:bg-blue-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-blue-600/25',
  asideMenuItemInactive: 'text-blue-300',
  asideMenuDropdown: 'bg-blue-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-blue-500',
  navBarItemLabelActiveColor: 'text-blue-600',
  overlay: 'from-blue-50 via-blue-200 to-blue-50',
}

export const indigo: StyleObject = {
  aside: 'bg-indigo-800',
  asideScrollbars: 'aside-scrollbars-[indigo]',
  asideBrand: 'bg-indigo-900 text-white',
  asideMenuItem: 'hover:bg-indigo-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-indigo-600/25',
  asideMenuItemInactive: 'text-indigo-300',
  asideMenuDropdown: 'bg-indigo-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-indigo-500',
  navBarItemLabelActiveColor: 'text-indigo-600',
  overlay: 'from-indigo-50 via-indigo-200 to-indigo-50',
}

export const violet: StyleObject = {
  aside: 'bg-violet-800',
  asideScrollbars: 'aside-scrollbars-[violet]',
  asideBrand: 'bg-violet-900 text-white',
  asideMenuItem: 'hover:bg-violet-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-violet-600/25',
  asideMenuItemInactive: 'text-violet-300',
  asideMenuDropdown: 'bg-violet-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-violet-500',
  navBarItemLabelActiveColor: 'text-violet-600',
  overlay: 'from-violet-50 via-violet-200 to-violet-50',
}

export const purple: StyleObject = {
  aside: 'bg-purple-800',
  asideScrollbars: 'aside-scrollbars-[purple]',
  asideBrand: 'bg-purple-900 text-white',
  asideMenuItem: 'hover:bg-purple-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-purple-600/25',
  asideMenuItemInactive: 'text-purple-300',
  asideMenuDropdown: 'bg-purple-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-purple-500',
  navBarItemLabelActiveColor: 'text-purple-600',
  overlay: 'from-purple-50 via-purple-200 to-purple-50',
}

export const fuchsia: StyleObject = {
  aside: 'bg-fuchsia-800',
  asideScrollbars: 'aside-scrollbars-[fuchsia]',
  asideBrand: 'bg-fuchsia-900 text-white',
  asideMenuItem: 'hover:bg-fuchsia-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-fuchsia-600/25',
  asideMenuItemInactive: 'text-fuchsia-300',
  asideMenuDropdown: 'bg-fuchsia-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-fuchsia-500',
  navBarItemLabelActiveColor: 'text-fuchsia-600',
  overlay: 'from-fuchsia-50 via-fuchsia-200 to-fuchsia-50',
}

export const pink: StyleObject = {
  aside: 'bg-pink-800',
  asideScrollbars: 'aside-scrollbars-[pink]',
  asideBrand: 'bg-pink-900 text-white',
  asideMenuItem: 'hover:bg-pink-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-pink-600/25',
  asideMenuItemInactive: 'text-pink-300',
  asideMenuDropdown: 'bg-pink-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-pink-500',
  navBarItemLabelActiveColor: 'text-pink-600',
  overlay: 'from-pink-50 via-pink-200 to-pink-50',
}

export const rose: StyleObject = {
  aside: 'bg-rose-800',
  asideScrollbars: 'aside-scrollbars-[rose]',
  asideBrand: 'bg-rose-900 text-white',
  asideMenuItem: 'hover:bg-rose-600/50',
  asideMenuItemActive: 'font-bold text-white',
  asideMenuItemActiveBg: 'bg-rose-600/25',
  asideMenuItemInactive: 'text-rose-300',
  asideMenuDropdown: 'bg-rose-700/50',
  navBarItemLabel: 'text-black',
  navBarItemLabelHover: 'hover:text-rose-500',
  navBarItemLabelActiveColor: 'text-rose-600',
  overlay: 'from-rose-50 via-rose-200 to-rose-50',
}
