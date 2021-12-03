import styled from 'styled-components'
import { Box, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'

export const SidebarItem = styled(ListItem)`
  height: 48px;
  width: 32px;
`

export const SidebarIcon = styled(ListItemIcon)`
  display: flex;
  align-items: center;
  width: 32px;
  height: 32px;
`

export const SidebarText = styled(ListItemText)`
  @media only screen and (max-width: 768px) {
    visibility: hidden;
  }

  @media only screen and (min-width: 768px) {
    visibility: visible;
    width: 90px;
  }
`

export const StyledSidebar = styled(Box)`
  @media only screen and (max-width: 768px) {
    width: 64px;
  }

  @media only screen and (min-width: 768px) {
    width: 190px;
  }
  border-right: 1px solid rgba(0, 0, 0, 0.12);
  height: 100vh;
`
