import React from 'react'
import {
  Drawer,
  List,
  Divider,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core'
import Link from 'next/link'
import useStyles from './index.styles'
import MyCardsIcon from '@public/icons/my-cards-icon'
import OpenPacksIcon from '@public/icons/open-packs-icon'
import CommunityIcon from '@public/icons/community-icon'
import useAuthentication from '@hooks/use-authentication'

const SidebarNav = ({ value, updateTabValue }) => {
  const classes = useStyles()
  const [isLoading, username, userGroups] = useAuthentication() as [
    boolean,
    string,
    Array<Number>
  ]

  return (
    <Drawer className={classes.drawer} variant={'permanent'} anchor={'left'}>
      <Link href={'/'}>
        <img className={classes.sidebarLogo} src={''} />
      </Link>
      <Divider />
      <List>
        <Link href={`/collection/${username}`}>
          <MenuItem
            onClick={() => updateTabValue(1)}
            selected={value === 1}
            button
          >
            <ListItemIcon>
              <MyCardsIcon />
            </ListItemIcon>
            <ListItemText primary={'My Cards'} />
          </MenuItem>
        </Link>
        <Link href={'/open-packs'}>
          <MenuItem
            onClick={() => updateTabValue(2)}
            selected={value === 2}
            button
          >
            <ListItemIcon>
              <OpenPacksIcon />
            </ListItemIcon>
            <ListItemText primary={'Open Packs'} />
          </MenuItem>
        </Link>
        <Link href={'/community'}>
          <MenuItem
            onClick={() => updateTabValue(3)}
            selected={value === 3}
            button
          >
            <ListItemIcon>
              <CommunityIcon />
            </ListItemIcon>
            <ListItemText primary={'Community'} />
          </MenuItem>
        </Link>
      </List>
    </Drawer>
  )
}

export default SidebarNav
