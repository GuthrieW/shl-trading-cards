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
    name: 'Edit Card',
    href: 'edit-cards',
    icon: <ListAltOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Edit User',
    href: 'edit-users',
    icon: <AccountBoxOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Process Card',
    href: 'process-cards',
    icon: <CheckBoxOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Submit Card',
    href: 'submit-cards',
    icon: <PublishOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Claim Card',
    href: 'claim-card-creation',
    icon: <GetAppOutlined />,
    requiredPermissions: [],
  },
  {
    name: 'Request Card ',
    href: 'request-card-creation',
    icon: <AddBoxOutlined />,
    requiredPermissions: [],
  },
]

export default adminPagesNew
