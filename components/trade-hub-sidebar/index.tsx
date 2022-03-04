import React from 'react'
import { List } from '@mui/material'
import {
  SidebarItem,
  SidebarIcon,
  StyledSidebar,
  SidebarText,
} from '@components/sidebar/styled'

type TradeHubSidebarProps = {
  pages: any[]
  onItemClick: any
  selectedItem: string
}

const TradeHubSidebar = ({
  pages,
  onItemClick,
  selectedItem,
}: TradeHubSidebarProps) => (
  <StyledSidebar>
    <List>
      {pages.map((page) => (
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
      ))}
    </List>
  </StyledSidebar>
)

export default TradeHubSidebar
