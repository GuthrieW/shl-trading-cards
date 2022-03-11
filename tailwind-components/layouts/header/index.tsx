import Router from 'next/router'
import React from 'react'
import IceLevelLogo from '../../../public/images/ice-level.svg'

type HeaderData = {
  id: string
  headerText: string
  href: string
  admin: boolean
  cardTeam: boolean
  hide: boolean
}

const headers: HeaderData[] = [
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
  {
    id: 'admin-dashboard',
    headerText: 'Admin',
    href: '/admin-dashboard',
    admin: true,
    cardTeam: true,
    hide: true,
  },
]

const Header = () => {
  const handleNavigation = (href: string) => {
    Router.push(href)
  }
  return (
    <div className="relative top-0 w-full h-16 flex flex-row items-center bg-gray-600 ">
      <div className="flex justify-between items-center">
        <img
          src={IceLevelLogo}
          onClick={() => handleNavigation('/home')}
          className=" h-16"
        />
        {headers.map((header) => (
          <>
            {!header.hide ? (
              <span
                className="mx-2 text-gray-100 cursor-pointer"
                key={header.id}
                onClick={() => handleNavigation(header.href)}
              >
                {header.headerText}
              </span>
            ) : null}
          </>
        ))}
      </div>
    </div>
  )
}

export default Header
