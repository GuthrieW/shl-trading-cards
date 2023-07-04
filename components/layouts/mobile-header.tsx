import { useState } from 'react'
import { MenuIcon } from '@heroicons/react/outline'
import Drawer from '@components/drawers/drawer'
import IconButton from '@components/buttons/icon-button'
import { HeaderLink } from '.'
import DrawerItem from '@components/drawers/drawer-item'
import Router from 'next/router'
import IceLevelLogo from '../../public/images/ice-level.svg'
import Image from 'next/image'

export type MobileHeaderProps = {
  headerItems: HeaderLink[]
  user: User
}

const MobileHeader = ({ headerItems, user }: MobileHeaderProps) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false)

  return (
    <>
      <div className="relative top-0 h-16 w-full bg-neutral-800 text-gray-200">
        <div className="h-full w-full flex flex-row justify-between items-center mx-2">
          <IconButton
            className="h-8 w-8 outline-0"
            disabled={false}
            onClick={() => setDrawerIsOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <div className="cursor-pointer">
            <Image
              src={IceLevelLogo}
              alt="Ice Level Logo"
              onClick={() => Router.push('/home')}
              width={96}
              height={72}
            />
          </div>
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
      <Drawer isOpen={drawerIsOpen} closeDrawer={() => setDrawerIsOpen(false)}>
        {headerItems.map(({ icon, headerText, href }: HeaderLink) => (
          <DrawerItem
            icon={icon}
            text={headerText}
            onClick={() => {
              Router.push(href)
              setDrawerIsOpen(false)
            }}
          />
        ))}
      </Drawer>
    </>
  )
}

export default MobileHeader
