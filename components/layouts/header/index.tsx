import getUidFromSession from '@utils/get-uid-from-session'
import isAdmin from '@utils/is-admin'
import isAdminOrCardTeam from '@utils/is-admin-or-card-team'
import Router from 'next/router'
import React, { useState } from 'react'
import { HamburgerCollapse } from 'react-animated-burgers'
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
    id: 'community',
    headerText: 'Community',
    href: '/community',
    admin: false,
    cardTeam: false,
    hide: false,
  },
  {
    id: 'collection',
    headerText: 'Collection',
    href: `/collection?uid=${getUidFromSession()}`,
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
    id: 'open-packs',
    headerText: 'Open Packs',
    href: '/open-packs',
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
    id: 'issue-packs',
    headerText: 'Issue Packs',
    href: '/issue-packs',
    admin: true,
  },
  {
    id: 'all-cards',
    headerText: 'All Cards',
    href: '/all-cards',
    admin: false,
  },
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
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const userIsAdmin = isAdmin(user)
  const userIsAdminOrCardTeam = isAdminOrCardTeam(user)

  return (
    <div className="relative justify-between top-0 w-full h-16 flex flex-row bg-neutral-800">
      <div className="flex w-full flex-row-reverse sm:flex-row items-center justify-between sm:justify-start relative ">
        <div className="flex sm:hidden h-full">
          <NavLink onClick={() => setShowAdminLinks(!showAdminLinks)}>
            {user.username}
          </NavLink>
        </div>
        <img
          src={IceLevelLogo}
          onClick={() => Router.push('/home')}
          className="h-16 cursor-pointer "
        />
        <div className="hidden sm:flex h-full w-full">
          {headersLinks.map((header, index) => (
            <React.Fragment key={index}>
              {!header.hide && (
                <NavLink onClick={() => Router.push(header.href)}>
                  {header.headerText}
                </NavLink>
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="flex sm:hidden h-full">
          <HamburgerCollapse
            isActive={showMenu}
            toggleButton={() => setShowMenu(!showMenu)}
            barColor="#fff"
            buttonWidth={30}
          />
        </div>

        <div
          className={`absolute ${
            showMenu ? 'flex' : 'hidden'
          } flex-col sm:hidden left-0 top-16 w-full z-50`}
        >
          {headersLinks.map((header, index) => (
            <React.Fragment key={index}>
              {!header.hide && (
                <div className="w-full bg-neutral-800 h-12 animate-slide-in-top">
                  <NavLink
                    onClick={() => {
                      Router.push(header.href)
                      setShowMenu(false)
                    }}
                  >
                    {header.headerText}
                  </NavLink>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      <ul className="hidden bg-neutral-800 rounded-sm sm:flex align-center">
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
