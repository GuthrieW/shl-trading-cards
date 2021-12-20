import React from 'react'
import {
  AddBoxOutlined,
  CheckBoxOutlined,
  GetAppOutlined,
  ListAltOutlined,
  PublishOutlined,
} from '@material-ui/icons'

type AdminPage = {
  name: string
  href: string
  icon: any
  admin: boolean
}

const adminPages: AdminPage[] = [
  {
    name: 'Edit Cards',
    href: 'edit-cards',
    icon: <ListAltOutlined />,
    admin: true,
  },
  {
    name: 'Request Cards',
    href: 'request-card-creation',
    icon: <AddBoxOutlined />,
    admin: true,
  },
  {
    name: 'Claim Cards',
    href: 'claim-card-creation',
    icon: <GetAppOutlined />,
    admin: false,
  },
  {
    name: 'Submit Cards',
    href: 'submit-cards',
    icon: <PublishOutlined />,
    admin: false,
  },
  {
    name: 'Process Cards',
    href: 'process-cards',
    icon: <CheckBoxOutlined />,
    admin: true,
  },
  {
    name: 'Edit Sets',
    href: 'edit-sets',
    icon: <ListAltOutlined />,
    admin: true,
  },
]

export default adminPages
