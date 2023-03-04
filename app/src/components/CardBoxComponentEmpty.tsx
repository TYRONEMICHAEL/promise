import React from 'react'

type Props = {
  message?: string
}

export default function CardBoxComponentEmpty({ message = null }: Props) {
  const hasMessage = message !== null && message.length > 0
  return (
    <div className="text-center py-24 text-gray-500 dark:text-slate-400">
      {hasMessage && <p>{message}</p>}
      {!hasMessage && <p>Nothing&apos;s here…</p>}
    </div>
  )
}
