import React from 'react'
import { List } from '@mui/material'
import {
  SidebarItem,
  SidebarIcon,
  StyledSidebar,
  SidebarText,
} from '@components/sidebar/styled'
import { useGetCurrentUser } from '@pages/api/queries/index'
import { getUidFromSession, isAdmin } from '@utils/index'

type SidebarProps = {
  pages: any[]
  onItemClick: any
  selectedItem: string
}

const AdminSidebar = ({ pages, onItemClick, selectedItem }: SidebarProps) => {
  const { user, isLoading, isError } = useGetCurrentUser({
    uid: getUidFromSession(),
  })

  return (
    <StyledSidebar>
      <List>
        {pages.map((page) => {
          if (page.admin && !isAdmin(user)) {
            return null
          }

          return (
            <div
              key={page.href}
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
