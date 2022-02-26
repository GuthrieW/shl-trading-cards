import React from 'react'
import {
  AddShoppingCartOutlined,
  CompareArrowsOutlined,
  FileCopy,
  EmojiPeopleOutlined,
  HomeOutlined,
  SettingsOutlined,
  SportsHockeyOutlined,
} from '@material-ui/icons'

const pages = [
  {
    name: 'Home',
    href: '/home',
    icon: <HomeOutlined />,
    admin: false,
    cardTeam: false,
  },
  {
    name: 'Collection',
    href: '/collection',
    icon: <FileCopy />,
    admin: false,
    cardTeam: false,
  },
  {
    name: 'Community',
    href: '/community',
    icon: <EmojiPeopleOutlined />,
    admin: false,
    cardTeam: false,
  },
  {
    name: 'Pack Shop',
    href: '/pack-shop',
    icon: <AddShoppingCartOutlined />,
    admin: false,
    cardTeam: false,
  },
  {
    name: 'Trade Hub',
    href: '/trade-hub',
    icon: <CompareArrowsOutlined />,
    admin: true,
    cardTeam: false,
  },
  {
    name: 'Ultimate Team',
    href: '/ultimate-team',
    icon: <SportsHockeyOutlined />,
    admin: true,
    cardTeam: false,
  },
  {
    name: 'Admin',
    href: '/admin-dashboard',
    icon: <SettingsOutlined />,
    admin: true,
    cardTeam: true,
  },
]

export default pages
