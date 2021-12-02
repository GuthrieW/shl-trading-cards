import React from 'react'
import { List } from '@material-ui/core'
import pages from './pages'
import { SidebarItem, SidebarIcon, StyledSidebar, SidebarText } from './styled'
import { useRouter } from 'next/router'
import useCurrentUser from '@hooks/use-current-user'
import hasRequiredPermisson from '@utils/has-required-permission'
import { groups } from '@utils/user-groups'

const Sidebar = () => {
  const { currentUser, isLoading, isError } = useCurrentUser()
  const { asPath } = useRouter()

  return (
    <StyledSidebar>
      <List>
        {pages.map((page) => {
          if (page.admin && hasRequiredPermisson([groups.Admin], currentUser)) {
            return null
          }

          return (
            <SidebarItem
              component="a"
              button
              href={page.href}
              key={page.name}
              disabled={asPath.includes(page.href)}
            >
              <SidebarIcon>{page.icon}</SidebarIcon>
              <SidebarText primary={page.name} />
            </SidebarItem>
          )
        })}
      </List>
    </StyledSidebar>
  )
}

export default Sidebar
