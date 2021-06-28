import React, { useState } from 'react'

import {
  createMuiTheme,
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  BottomNavigationActionProps,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import SidebarNav from '@components/sidebar-nav'
import SplashScreen from '@pages/splash-screen'
import useAuthentication from '@hooks/use-authentication'
import Link from 'next/link'
import Router from 'next/router'
import MyCardsIcon from '@public/icons/my-cards-icon'
import OpenPacksIcon from '@public/icons/open-packs-icon'
import CommunityIcon from '@public/icons/community-icon'
import useStyles from './index.styles'

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

const DefaultLayout = ({ children }) => {
  const classes = useStyles()
  const [navigationValue, setNavigationValue] = useState(0)
  const [isLoading, username, userGroups] = useAuthentication() as [
    boolean,
    string,
    Array<Number>
  ]

  const handleSignOut = () => {
    Router.push({
      pathname: '/splash-screen',
    })
  }
  const updateNavigationDisplay = (newNavigationValue) => {
    setNavigationValue(newNavigationValue)
  }

  const theme = useTheme()
  const largeScreen = useMediaQuery(theme.breakpoints.up('lg'))

  if (isLoading) return null

  return (
    <ThemeProvider theme={theme}>
      {!username && <SplashScreen />}
      {username && (
        <>
          <div className={classes.root}>
            <AppBar position="fixed" className={classes.appBar}>
              <Toolbar>
                <Link href="/">
                  <div className={classes.headerLogoContainer}>
                    {!largeScreen && (
                      <img
                        className={classes.headerLogo}
                        src={'../public/images/Dotts-Logo-White.png'}
                      />
                    )}
                  </div>
                </Link>
                <Typography variant="h6" noWrap>
                  <Button onClick={handleSignOut}>Sign Out</Button>
                </Typography>
              </Toolbar>
            </AppBar>
            {largeScreen && (
              <SidebarNav
                value={navigationValue}
                updateTabValue={updateNavigationDisplay}
              />
            )}
            <main>
              <div>{children}</div>
            </main>
            {!largeScreen && (
              <>
                <BottomNavigation
                  className={classes.footer}
                  value={navigationValue}
                  onChange={updateNavigationDisplay}
                  showLabels
                >
                  <BottomNavigationAction
                    component={BottomNavigationActionLink}
                    href={`/collection/${username}`}
                    label="My Cards"
                    icon={<MyCardsIcon />}
                  />
                  <BottomNavigationAction
                    component={BottomNavigationActionLink}
                    href={'/open-packs'}
                    label="Open Packs"
                    icon={<OpenPacksIcon />}
                  />
                  <BottomNavigationAction
                    component={BottomNavigationActionLink}
                    href={'/community'}
                    label="Community"
                    icon={<CommunityIcon />}
                  />
                </BottomNavigation>
              </>
            )}
          </div>
        </>
      )}
    </ThemeProvider>
  )
}

// export const getLayout = (page) => <DefaultLayout>{page}</DefaultLayout>

export default DefaultLayout
