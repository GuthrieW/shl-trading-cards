import isAdminOrCardTeam from '@utils/is-admin-or-card-team'
import Router from 'next/router'
import React from 'react'
import IceLevelLogo from '../../../public/images/ice-level.svg'
import NavLink from '../nav-link'

type HeaderProps = {
  user: User
}

type HeaderLink = {
  id: string
  headerText: string
  href: string
  admin: boolean
  cardTeam: boolean
  hide: boolean
}

const headers: HeaderLink[] = [
  {
    id: 'home',
    headerText: 'Home',
    href: '/home',
    admin: false,
    cardTeam: false,
    hide: false,
  },
  {
    id: 'collections',
    headerText: 'Collections',
    href: '/collections',
    admin: false,
    cardTeam: false,
    hide: false,
  },
  {
    id: 'pack-shop',
    headerText: 'Pack Shop',
    href: '/pack-shop',
    admin: false,
    cardTeam: false,
    hide: false,
  },
  {
    id: 'trade-hub',
    headerText: 'Trade Hub',
    href: '/trade-hub',
    admin: false,
    cardTeam: false,
    hide: true,
  },
  {
    id: 'ultimate-team',
    headerText: 'Ultimate Team',
    href: '/ultimate-team',
    admin: false,
    cardTeam: false,
    hide: true,
  },
]

const Header = ({ user }: HeaderProps) => {
  return (
    <div className="relative justify-between top-0 w-full h-16 flex flex-row bg-neutral-800 ">
      <div className="flex items-center">
        <img
          src={IceLevelLogo}
          onClick={() => Router.push('/home')}
          className="h-16 cursor-pointer"
        />
        {headers.map((header) => (
          <>
            {!header.hide ? (
              <NavLink text={header.headerText} href={header.href} />
            ) : null}
          </>
        ))}
      </div>
      <div className="mx-4 flex items-center">
        {isAdminOrCardTeam(user) ? (
          <NavLink text={user.username} href={'/admin'} />
        ) : (
          <NavLink text={user.username} />
        )}
      </div>
    </div>
  )
}

export default Header
