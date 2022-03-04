import React from 'react'
import {
  AddBoxOutlined,
  ListAltOutlined,
  ImageSearchOutlined,
} from '@mui/icons-material'

type TradeHubPage = {
  name: string
  href: string
  icon: any
  requiredPermissions: number[]
}

const tradeHubPages: TradeHubPage[] = [
  {
    name: 'Create Trade',
    href: 'create-trade',
    icon: <AddBoxOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Card Search',
    href: 'card-search',
    icon: <ImageSearchOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'View Trades',
    href: 'view-trades',
    icon: <ListAltOutlined />,
    requiredPermissions: [],
  },
]

export default tradeHubPages
