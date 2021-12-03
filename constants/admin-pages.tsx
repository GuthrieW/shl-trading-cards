import React from 'react'

import { SelectedAdminPage } from '@pages/admin-dashboard'
import {
  AccountBoxOutlined,
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

const adminPagesNew: AdminPage[] = [
  {
    name: 'Edit Cards',
    href: 'edit-cards',
    icon: <ListAltOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Edit Users',
    href: 'edit-users',
    icon: <AccountBoxOutlined />,
    requiredPermissions: [],
  },

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
]

export default adminPagesNew
