import React from 'react'
import Router from 'next/router'

type NavLinkProps = {
  text: string
  href?: string
}

const NavLink = ({ text, href }: NavLinkProps) => {
  const handleNavigation = (href: string) => {
    Router.push(href)
  }

  return (
    <div
      onClick={() => handleNavigation(href)}
      className={`flex items-center mx-2 text-gray-100 cursor-pointer h-full border-b-4 border-neutral-800 ${
        href ? 'hover:border-b-4 hover:border-b-white' : ''
      }`}
    >
      <span>{text}</span>
    </div>
  )
}
export default NavLink
