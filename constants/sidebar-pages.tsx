import React from 'react'
import {
  AddShoppingCartOutlined,
  AddToPhotosOutlined,
  CompareArrowsOutlined,
  FileCopy,
  EmojiPeopleOutlined,
  HomeOutlined,
  SettingsOutlined,
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
  {
    name: 'Pack Shop',
    href: '/pack-shop',
    icon: <AddShoppingCartOutlined />,
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

export default pages
