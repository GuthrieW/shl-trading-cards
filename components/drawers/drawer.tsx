import IconButton from '@components/buttons/icon-button'
import { XMarkIcon } from '@heroicons/react/20/solid'
import { useClickListener } from '@hooks/useClickListener'
import { useRef } from 'react'
import IceLevelLogo from '../../public/images/ice-level.svg'
import Router from 'next/router'
import Image from 'next/image'

export type DrawerProps = {
  title?: string
  isOpen: boolean
  closeDrawer: () => void
  children: JSX.Element[] | JSX.Element
}

const Drawer = ({ children, title, isOpen, closeDrawer }: DrawerProps) => {
  const drawerRef = useRef(null)
  useClickListener(drawerRef, closeDrawer)

  return (
    <ul
      ref={drawerRef}
      className={`z-10 absolute top-0 left-0 text-lg p-4 w-60 h-screen bg-neutral-800 ease-in duration-200 transform text-gray-200 ${
        isOpen ? '' : '-translate-x-60'
      }`}
    >
      <div className="flex flex-row justify-between items-center mb-2">
        {title ? (
          <p>{title}</p>
        ) : (
          <Image
            className="cursor-pointer"
            src={IceLevelLogo}
            alt="Ice Level Logo"
            onClick={() => Router.push('/home')}
            width={96}
            height={72}
          />
        )}
        <IconButton disabled={false} onClick={() => closeDrawer()}>
          <XMarkIcon />
        </IconButton>
      </div>
      {children}
    </ul>
  )
}

export default Drawer
