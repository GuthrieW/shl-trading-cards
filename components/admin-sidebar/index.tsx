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
  selectedItem: string
}

const AdminSidebar = ({ pages, onItemClick, selectedItem }: SidebarProps) => {
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
            <div
              style={{
                backgroundColor:
                  selectedItem === page.href ? 'rgba(0, 0, 0, 0.08)' : 'white',
              }}
            >
              <SidebarItem
                button
                onClick={() => onItemClick(page.href)}
                key={page.name}
                disabled={selectedItem === page.href}
              >
                {page.icon ? <SidebarIcon>{page.icon}</SidebarIcon> : null}
                <SidebarText primary={page.name} />
              </SidebarItem>
            </div>
          )
        })}
      </List>
    </StyledSidebar>
  )
}

export default AdminSidebar
