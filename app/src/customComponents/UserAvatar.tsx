/* eslint-disable @next/next/no-img-element */
// Why disabled:
// avatars.dicebear.com provides svg avatars
// next/image needs dangerouslyAllowSVG option for that

import React, { ReactNode } from 'react'

export enum UserAvatarType {
  avatar = 'avataaars',
  bot = 'bottts',
}

type Props = {
  username: string
  avatar: UserAvatarType,
  api?: string
  className?: string
  children?: ReactNode
}

export default function UserAvatar({
  username,
  avatar,
  className = '',
  children,
}: Props) {

  return (
    <div className={className}>
      <img
        src={`https://avatars.dicebear.com/api/${avatar}/${username.replace(/[^a-z0-9]+/i, '-')}.svg`}
        alt={username}
        className="rounded-full block h-auto w-full max-w-full bg-gray-100 dark:bg-slate-800"
      />
      {children}
    </div>
  )
}
