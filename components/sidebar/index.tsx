import React from 'react'
import { List } from '@mui/material'
import { SidebarItem, SidebarIcon, StyledSidebar, SidebarText } from './styled'
import { useRouter } from 'next/router'
import { useGetCurrentUser } from '@pages/api/queries/index'
import { getUidFromSession, isAdminOrCardTeam, isAdmin } from '@utils/index'

type SidebarProps = {
  pages: any[]
}

const Sidebar = ({ pages }: SidebarProps) => {
  const { asPath } = useRouter()
  const { user, isLoading, isError } = useGetCurrentUser({
    uid: getUidFromSession(),
  })

  return (
    <StyledSidebar>
      <List>
        {pages.map((page) => {
          if (
            ((page.admin && page.cardTeam) || page.cardTeam) &&
            !isAdminOrCardTeam(user)
          ) {
            return null
          } else if (page.admin && !isAdmin(user)) {
            return null
          }

          return (
            <div
              key={page.name}
              style={{
                backgroundColor: asPath.includes(page.href)
                  ? 'rgba(0, 0, 0, 0.08)'
                  : 'white',
              }}
            >
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
            </div>
          )
        })}
      </List>
    </StyledSidebar>
  )
}

export default Sidebar
