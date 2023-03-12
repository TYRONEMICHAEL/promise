/* eslint-disable @next/next/no-img-element */
// Why disabled:
// avatars.dicebear.com provides svg avatars
// next/image needs dangerouslyAllowSVG option for that

import React, { ReactNode } from 'react'
import { Squad } from '../interfaces/squads'
import { getUsername } from '../utils/names'
import { PublicKey } from '@solana/web3.js'

type Props = {
  squad: Squad
  className?: string
  children?: ReactNode
}

export const MembersAvatar = ({ squad, className = '', children }: Props) => {
  const members = squad.members.map((member) => getUsername(new PublicKey(member)))
  return (
    <div className={className}>
      <div className="flex items-center justify-center">
        {members.map((member) => {
          return (
            <img
              key={member}
              src={`https://avatars.dicebear.com/api/avataaars/${member.replace(
                /[^a-z0-9]+/i,
                '-'
              )}.svg`}
              alt={member}
              className="rounded-full block w-1/2 bg-gray-100 dark:bg-slate-900 -mr-6 border-solid border-l border-gray-700"
            />
          )
        })}
      </div>

      {children}
    </div>
  )
}
