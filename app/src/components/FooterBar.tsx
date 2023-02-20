import React, { ReactNode } from 'react'
import { containerMaxW } from '../config'
import PadelLogo from './PadelLogo'

type Props = {
  children?: ReactNode
}

export default function FooterBar({ children }: Props) {
  const year = new Date().getFullYear()

  return (
    <footer className={`py-2 px-6 ${containerMaxW}`}>
      <div className="block md:flex items-center justify-between">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <b>
            &copy;{year},{` `}
            <a href="https://github.com/TYRONEMICHAEL/promise" rel="noreferrer" target="_blank">
              Padel2x2
            </a>
            .
          </b>
          {` `}
          {children}
        </div>
        <div className="md:py-2">
          <a href="https://github.com/TYRONEMICHAEL/promise" rel="noreferrer" target="_blank">
            <PadelLogo className="w-auto h-8 md:h-6 mx-auto" />
          </a>
        </div>
      </div>
    </footer>
  )
}
