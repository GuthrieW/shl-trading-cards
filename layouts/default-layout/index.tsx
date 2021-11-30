import React from 'react'
import Sidebar from '@components/sidebar'

const [username, groups, isLoading] = ['caltroit_red_flames', [], false]

const DefaultLayout = ({ children }) => {
  if (!username) {
    return null
  }

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar groups={groups} />
      <div style={{ width: '100%' }}>{children}</div>
    </div>
  )
}

export default DefaultLayout
