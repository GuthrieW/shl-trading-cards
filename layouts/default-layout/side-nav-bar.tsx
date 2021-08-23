import React from 'react'
import {
  Drawer,
  MenuItem,
  List,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import Link from 'next/link'
import navigationOptions from './navigation-options'
import ToolbarLinkLogo from './toolbar-link-logo'

const SideNavBar = ({ value, updateTabValue }) => (
  <Drawer variant={'permanent'} anchor={'left'}>
    <ToolbarLinkLogo />
    <List>
      {navigationOptions.map((navigationOption) => (
        <Link href={navigationOption.href}>
          <MenuItem
            onClick={() => updateTabValue(navigationOption.tab)}
            selected={value === navigationOption.tab}
            button
          >
            <ListItemIcon>
              <navigationOption.icon />
            </ListItemIcon>
            <ListItemText primary={navigationOption.label} />
          </MenuItem>
        </Link>
      ))}
    </List>
  </Drawer>
)

export default SideNavBar
