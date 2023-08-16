import Router from 'next/router'
import React from 'react'
import IceLevelLogo from '../../public/images/ice-level.svg'
import NavLink from './nav-link'
import { HeaderLink } from '.'
import Image from 'next/image'

type HeaderProps = {
  numberOfPendingTrades: number
  headerItems: HeaderLink[]
  user: User
}

const Header = ({ numberOfPendingTrades, headerItems, user }: HeaderProps) => (
  <div className="relative top-0 h-16 w-full bg-neutral-800 text-gray-200">
    <div className="h-full w-full flex flex-row justify-between items-center mx-2">
      <div className="cursor-pointer">
        <Image
          src={IceLevelLogo}
          alt="Ice Level Logo"
          onClick={() => Router.push('/home')}
          width={96}
          height={72}
        />
      </div>
      <div className="flex flex-row justify-center items-center h-full">
        {headerItems.map(({ headerText, href }: HeaderLink) => (
          <NavLink key={href} onClick={() => Router.push(href)}>
            {`${headerText}${
              headerText === 'Trade Hub' ? ` (${numberOfPendingTrades})` : ''
            }`}
          </NavLink>
        ))}
      </div>
      <div className="flex items-center h-full mr-2">
        <span
          className="p-1 mr-2 cursor-pointer rounded hover:bg-neutral-700 hover:text-gray-300"
          onClick={() =>
            Router.push(
              `https://simulationhockey.com/member.php?action=profile&uid=${user.uid}`
            )
          }
        >
          {user.username}
        </span>
      </div>
    </div>
  </div>
)

export default Header
