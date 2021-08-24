import React, { useState } from 'react'
import { AppBar, Toolbar } from '@material-ui/core'
import SplashScreen from '@pages/splash-screen'
import { useWindowDimensions } from '@hooks/index'
import TopNavBar from './top-nav-bar'
import BottomNavBar from './bottom-nav-bar'
import ToolbarLinkLogo from './toolbar-link-logo'

const [username, groups, isLoading] = ['caltroit_red_flames', [], false]

const DefaultLayout = ({ children }) => {
  if (!username) {
    return <SplashScreen />
  }

  return (
    <div>
      <AppBar position="sticky">
        <Toolbar>
          <ToolbarLinkLogo />
          <TopNavBar />
        </Toolbar>
      </AppBar>
      <main>{children}</main>
    </div>
  )
}

export default DefaultLayout
