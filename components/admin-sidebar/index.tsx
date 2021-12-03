import React from 'react'
import { List } from '@material-ui/core'
import {
  SidebarItem,
  SidebarIcon,
  StyledSidebar,
  SidebarText,
} from '../sidebar/styled'
import useCurrentUser from '@hooks/use-current-user'
import hasRequiredPermisson from '@utils/has-required-permission'
import { groups } from '@utils/user-groups'

type SidebarProps = {
  pages: any[]
  onItemClick: any
}

const AdminSidebar = ({ pages, onItemClick }: SidebarProps) => {
  const { currentUser, isLoading, isError } = useCurrentUser()

  return (
    <StyledSidebar>
      <List>
        {pages.map((page) => {
          if (
            page.admin &&
            !hasRequiredPermisson([groups.Admin.id], currentUser)
          ) {
            return null
          }

          return (
            <SidebarItem
              button
              onClick={() => onItemClick(page.href)}
              key={page.name}
            >
              {page.icon ? <SidebarIcon>{page.icon}</SidebarIcon> : null}
              <SidebarText primary={page.name} />
            </SidebarItem>
          )
        })}
      </List>
    </StyledSidebar>
  )
}

export default AdminSidebar
