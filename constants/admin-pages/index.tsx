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
  requiredPermissions: number[]
}

const adminPages: AdminPage[] = [
  // {
  //   name: 'Edit Cards',
  //   href: 'edit-cards',
  //   icon: <ListAltOutlined />,
  //   requiredPermissions: [],
  // },
  {
    name: 'Request Cards',
    href: 'request-card-creation',
    icon: <AddBoxOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Claim Cards',
    href: 'claim-card-creation',
    icon: <GetAppOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Submit Cards',
    href: 'submit-cards',
    icon: <PublishOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Process Cards',
    href: 'process-cards',
    icon: <CheckBoxOutlined />,
    requiredPermissions: [],
  },
  // {
  //   name: 'Edit Sets',
  //   href: 'edit-sets',
  //   icon: <ListAltOutlined />,
  //   requiredPermissions: [],
  // },
]

export default adminPages
