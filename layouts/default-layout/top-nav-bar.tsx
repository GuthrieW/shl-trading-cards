import React from 'react'
import { MenuItem, ListItemIcon, ListItemText } from '@material-ui/core'
import Link from 'next/link'
import navigationOptions from './navigation-options'

const TopNavBar = () => (
  <>
    {navigationOptions.map((navigationOption) => (
      <Link key={navigationOption.label} href={navigationOption.href}>
        <MenuItem button>
          <ListItemIcon>
            <navigationOption.icon />
          </ListItemIcon>
          <ListItemText primary={navigationOption.label} />
        </MenuItem>
      </Link>
    ))}
  </>
)

export default TopNavBar
