import React from 'react'
import { List } from '@material-ui/core'
import { SidebarItem, SidebarIcon, StyledSidebar, SidebarText } from './styled'
import { useRouter } from 'next/router'
import useCurrentUser from '@hooks/use-current-user'
import hasRequiredPermisson from '@utils/has-required-permission'
import { groups } from '@utils/user-groups'

type SidebarProps = {
  pages: any[]
}

const Sidebar = ({ pages }: SidebarProps) => {
  const { currentUser, isLoading, isError } = useCurrentUser()
  const { asPath } = useRouter()

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
              component="a"
              button
              href={page.href}
              key={page.name}
              disabled={asPath.includes(page.href)}
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

export default Sidebar
