import React, { ReactNode } from 'react'
import UserAvatar, { UserAvatarType } from './UserAvatar'

type Props = {
  className?: string
  children?: ReactNode
  avatar: UserAvatarType
  username: string
}

export default function UserAvatarCurrentUser({ className = '', children, avatar, username }: Props) {
  return (
    <UserAvatar username={username} avatar={avatar} className={className}>
      {children}
    </UserAvatar>
  )
}
