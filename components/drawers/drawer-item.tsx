import React from 'react'

export type DrawerItemProps = {
  icon: JSX.Element
  text: string
  onClick: () => void
}

const DrawerItem = ({ icon, text, onClick }: DrawerItemProps) => (
  <li
    className="h-8 flex flex-row items-center rounded cursor-pointer hover:text-gray-400 hover:bg-neutral-700"
    onClick={onClick}
  >
    <div className="ml-2 h-6 w-5 rounded flex items-center">{icon}</div>
    <span className="mx-2 h-6 flex items-center text-sm">{text}</span>
  </li>
)

export default DrawerItem
