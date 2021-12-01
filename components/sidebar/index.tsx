import React from 'react'
import { List } from '@material-ui/core'
import pages from './pages'
import { SidebarItem, SidebarIcon, StyledSidebar, SidebarText } from './styled'
import { useRouter } from 'next/router'

export type SidebarProps = {
  groups: number[]
}

const Sidebar = ({ groups }: SidebarProps) => {
  const isAdmin = true
  const { asPath } = useRouter()

  return (
    <StyledSidebar>
      <List>
        {pages.map((page) => {
          if (page.admin && !isAdmin) {
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
