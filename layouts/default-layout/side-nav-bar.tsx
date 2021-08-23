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

const SideNavBar = ({ value, updateTabValue }) => (
  <Drawer variant={'permanent'} anchor={'left'}>
    <List>
      {navigationOptions.map((navigationOption) => (
        <>
          <Link href={navigationOption.href}></Link>
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
        </>
      ))}
    </List>
  </Drawer>
)

export default SideNavBar
