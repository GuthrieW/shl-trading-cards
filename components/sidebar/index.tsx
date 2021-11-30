import React from 'react'
import { Drawer, List } from '@material-ui/core'
import {
  AddToPhotosOutlined,
  CompareArrowsOutlined,
  FileCopy,
  EmojiPeopleOutlined,
  HomeOutlined,
  SettingsOutlined,
} from '@material-ui/icons'
import { SidebarItem, SidebarIcon, StyledSidebar, SidebarText } from './styled'
import { useRouter } from 'next/router'

export type SidebarProps = {
  groups: number[]
}

const pages = [
  {
    name: 'Home',
    href: '/home',
    icon: <HomeOutlined />,
    admin: false,
  },
  {
    name: 'Collection',
    href: '/collection',
    icon: <FileCopy />,
    admin: false,
  },
  {
    name: 'Community',
    href: '/community',
    icon: <EmojiPeopleOutlined />,
    admin: false,
  },
  {
    name: 'Open Packs',
    href: '/open-packs',
    icon: <AddToPhotosOutlined />,
    admin: false,
  },
  {
    name: 'Trade Hub',
    href: '/trade-hub',
    icon: <CompareArrowsOutlined />,
    admin: false,
  },
  {
    name: 'Admin',
    href: 'admin-dashboard',
    icon: <SettingsOutlined />,
    admin: true,
  },
]

const Sidebar = ({ groups }: SidebarProps) => {
  const isAdmin = true
  const { asPath } = useRouter()

  return (
    <StyledSidebar>
      <List>
        {pages.map((page) => {
          if (page.admin && !isAdmin) {
            return null
          }

          return (
            <SidebarItem
              component="a"
              button
              href={page.href}
              key={page.name}
              disabled={asPath.includes(page.href)}
            >
              <SidebarIcon>{page.icon}</SidebarIcon>
              <SidebarText primary={page.name} />
            </SidebarItem>
          )
        })}
      </List>
    </StyledSidebar>
  )
}

export default Sidebar
