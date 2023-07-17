import React, { MouseEventHandler } from 'react'

type NavLinkProps = {
  children: any
  onClick?: MouseEventHandler
}

const NavLink = ({ children, onClick }: NavLinkProps) => (
  <div
    onClick={onClick}
    className={`h-8 flex items-center rounded mx-1 text-gray-200 cursor-pointer ${
      onClick ? 'hover:bg-neutral-700 hover:text-gray-300' : ''
    }`}
  >
    <span className="p-1 flex items-center">{children}</span>
  </div>
)

export default NavLink
