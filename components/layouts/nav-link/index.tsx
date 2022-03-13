import React, { MouseEventHandler } from 'react'
import { useRouter } from 'next/router'

type NavLinkProps = {
  children: any
  onClick?: MouseEventHandler
}

const NavLink = ({ children, onClick }: NavLinkProps) => (
  <div
    onClick={onClick}
    className={`flex items-center mx-2 text-gray-100 cursor-pointer h-full border-b-4 border-neutral-800 ${
      onClick ? 'hover:border-b-4 hover:border-b-white' : ''
    }`}
  >
    {children}
  </div>
)

export default NavLink
