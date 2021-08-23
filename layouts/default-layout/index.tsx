import React, { useState } from 'react'
import { AppBar, Toolbar } from '@material-ui/core'
import SplashScreen from '@pages/splash-screen'
import { useWindowDimensions } from '@hooks/index'
import Link from 'next/link'
import styled from 'styled-components'
import SideNavBar from './side-nav-bar'
import BottomNavBar from './bottom-nav-bar'

const [username, groups, isLoading] = ['caltroit_red_flames', [], false]

const DefaultLayout = ({ children }) => {
  const [navigationValue, setNavigationValue] = useState(0)

  const { isDesktop } = useWindowDimensions()

  if (!username) {
    return <SplashScreen />
  }

  return (
    <div>
      <HeaderBar position="fixed">
        <Toolbar>
          <Link href="/">
            <ToolbarLogo
              src={'https://simulationhockey.com/images/darklogo.png'}
            />
          </Link>
        </Toolbar>
      </HeaderBar>
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

const ToolbarLogo = styled.img`
  margin-top: 5px;
  position: fixed;
  z-index: 2;
`

const HeaderBar = styled(AppBar)`
  z-index: 1;
`

export default DefaultLayout
