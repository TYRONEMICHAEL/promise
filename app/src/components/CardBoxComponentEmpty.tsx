import React, { ReactNode } from 'react'

type Props = {
  message?: string
  children?: ReactNode
}

export default function CardBoxComponentEmpty({ message = null, children }: Props) {
  const hasMessage = message !== null && message.length > 0
  return (
    <div className="text-center py-24 text-gray-500 dark:text-slate-400">
      {hasMessage && <p>{message}</p>}
      {!hasMessage && <p>Nothing&apos;s here…</p>}
      {children && <div className="py-6">{children}</div>}
    </div>
  )
}
