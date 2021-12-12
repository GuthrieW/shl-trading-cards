import React from 'react'
import { List } from '@material-ui/core'
import {
  SidebarItem,
  SidebarIcon,
  StyledSidebar,
  SidebarText,
} from '@components/sidebar/styled'
import { useGetUser } from '@pages/api/queries/index'
import { getUidFromSession, hasRequiredPermisson } from '@utils/index'
import { groups } from '@utils/user-groups'

type SidebarProps = {
  pages: any[]
  onItemClick: any
  selectedItem: string
}

const AdminSidebar = ({ pages, onItemClick, selectedItem }: SidebarProps) => {
  const { user, isLoading, isError } = useGetUser({
    uid: getUidFromSession(),
  })

  return (
    <StyledSidebar>
      <List>
        {pages.map((page) => {
          if (
            page.admin &&
            !hasRequiredPermisson([groups.TradingCardAdmin.id], user)
          ) {
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
