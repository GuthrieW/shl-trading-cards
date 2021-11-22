import React from 'react'
import SplashScreen from '@pages/splash-screen'
import Sidebar from '@components/sidebar'

const [username, groups, isLoading] = ['caltroit_red_flames', [], false]

const DefaultLayout = ({ children }) => {
  if (!username) {
    return <SplashScreen />
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar groups={groups} />
      <div style={{ width: '100%' }}>{children}</div>
    </div>
  )
}

export default DefaultLayout
