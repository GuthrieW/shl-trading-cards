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
  // {
  //   name: 'Pack Shop',
  //   href: '/pack-shop',
  //   icon: <AddShoppingCartOutlined />,
  //   admin: false,
  // },
  {
    name: 'Trade Hub',
    href: '/trade-hub',
    icon: <CompareArrowsOutlined />,
    admin: false,
  },
  // {
  //   name: 'Ultimate Team',
  //   href: '/ultimate-team',
  //   icon: <SportsHockeyOutlined />,
  //   admin: true,
  // },
  {
    name: 'Admin',
    href: '/admin-dashboard',
    icon: <SettingsOutlined />,
    admin: true,
  },
]

export default pages
