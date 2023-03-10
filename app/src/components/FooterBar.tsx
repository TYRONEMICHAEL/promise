import React, { ReactNode } from 'react'
import { containerMaxW, githubUrl } from '../config'

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
            <a href={githubUrl} rel="noreferrer" target="_blank">
              two x two
            </a>
            . Powered by the&nbsp;
            <a href={githubUrl} rel="noreferrer" target="_blank">
              Promise Protocol
            </a>
          </b>
          {` `}
          {children}
        </div>
      </div>
    </footer>
  )
}
