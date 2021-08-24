import React from 'react'
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionProps,
} from '@material-ui/core'
import Link from 'next/link'
import navigationOptions from './navigation-options'

type BottomNavigationActionLinkProps = Omit<
  BottomNavigationActionProps,
  'href' | 'classes'
>

const BottomNavigationActionLink = React.forwardRef<
  BottomNavigationActionLinkProps,
  any
>(({ href, as, prefetch, ...props }, ref) => (
  <Link href={href} as={as} prefetch={prefetch} passHref>
    <Button ref={ref} {...props} />
  </Link>
))

const BottomNavBar = () => (
  <BottomNavigation showLabels>
    {navigationOptions.map((navigationOption) => (
      <BottomNavigationAction
        key={navigationOption.label}
        component={BottomNavigationActionLink}
        href={navigationOption.href}
        label={navigationOption.label}
        icon={navigationOption.icon}
      />
    ))}
  </BottomNavigation>
)

export default BottomNavBar
