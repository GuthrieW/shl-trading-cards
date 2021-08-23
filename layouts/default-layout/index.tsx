import React, { useState } from 'react'
import { AppBar, Toolbar } from '@material-ui/core'
import SplashScreen from '@pages/splash-screen'
import { useWindowDimensions } from '@hooks/index'
import SideNavBar from './side-nav-bar'
import BottomNavBar from './bottom-nav-bar'
import ToolbarLinkLogo from './toolbar-link-logo'

const [username, groups, isLoading] = ['caltroit_red_flames', [], false]

const DefaultLayout = ({ children }) => {
  const [navigationValue, setNavigationValue] = useState(0)

  const { isDesktop } = useWindowDimensions()

  if (!username) {
    return <SplashScreen />
  }

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>{!isDesktop && <ToolbarLinkLogo />}</Toolbar>
      </AppBar>
      {isDesktop && (
        <SideNavBar
          value={navigationValue}
          updateTabValue={setNavigationValue}
        />
      )}
      <main>
        <div>{children}</div>
      </main>
      {!isDesktop && (
        <BottomNavBar
          value={navigationValue}
          updateTabValue={setNavigationValue}
        />
      )}
    </div>
  )
}

export default DefaultLayout
