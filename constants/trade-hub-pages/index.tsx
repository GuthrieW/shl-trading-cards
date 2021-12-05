import React from 'react'
import {
  AddBoxOutlined,
  GetAppOutlined,
  ListAltOutlined,
} from '@material-ui/icons'

type TradeHubPage = {
  name: string
  href: string
  icon: any
  requiredPermissions: number[]
}

const tradeHubPages: TradeHubPage[] = [
  {
    name: 'Card Search',
    href: 'card-search',
    icon: <ListAltOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Create Trade',
    href: 'create-trade',
    icon: <AddBoxOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'View Trades',
    href: 'view-trades',
    icon: <GetAppOutlined />,
    requiredPermissions: [],
  },
]

export default tradeHubPages
