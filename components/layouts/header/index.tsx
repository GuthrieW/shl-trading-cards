import isAdmin from '@utils/is-admin'
import isAdminOrCardTeam from '@utils/is-admin-or-card-team'
import Router from 'next/router'
import React, { useState } from 'react'
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

type AdminLink = {
  id: string
  headerText: string
  href: string
  admin: boolean
}

const headersLinks: HeaderLink[] = [
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

const adminLinks: AdminLink[] = [
  {
    id: 'edit-cards',
    headerText: 'Edit Cards',
    href: '/edit-cards',
    admin: true,
  },
  {
    id: 'request-cards',
    headerText: 'Request Cards',
    href: '/request-cards',
    admin: true,
  },
  {
    id: 'claim-cards',
    headerText: 'Claim Cards',
    href: '/claim-cards',
    admin: false,
  },
  {
    id: 'submit-cards',
    headerText: 'Submit Cards',
    href: '/submit-cards',
    admin: false,
  },
  {
    id: 'process-cards',
    headerText: 'Process Cards',
    href: '/process-cards',
    admin: true,
  },
]

const Header = ({ user }: HeaderProps) => {
  const [showAdminLinks, setShowAdminLinks] = useState<boolean>(false)
  const userIsAdmin = isAdmin(user)
  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  return (
    <div className="relative justify-between top-0 w-full h-16 flex flex-row bg-neutral-800">
      <div className="flex items-center">
        <img
          src={IceLevelLogo}
          onClick={() => Router.push('/home')}
          className="h-16 cursor-pointer"
        />
        {headersLinks.map((header, index) => (
          <React.Fragment key={index}>
            {!header.hide ? (
              <NavLink onClick={() => Router.push(header.href)}>
                {header.headerText}
              </NavLink>
            ) : null}
          </React.Fragment>
        ))}
      </div>
      <ul className="bg-neutral-800 rounded-sm">
        <li className="bg-neutral-800">
          <NavLink onClick={() => setShowAdminLinks(!showAdminLinks)}>
            {user.username}
          </NavLink>
        </li>
        {showAdminLinks &&
          userIsAdminOrCardTeam &&
          adminLinks.map((adminLink, index) => (
            <li className="bg-neutral-800" key={index}>
              <NavLink onClick={() => Router.push('/admin' + adminLink.href)}>
                {adminLink.headerText}
              </NavLink>
            </li>
          ))}
      </ul>
    </div>
  )
}

export default Header
