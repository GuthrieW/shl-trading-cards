import React from 'react'
import Sidebar from '@components/sidebar'
import { ChildrenDiv, SidebarDiv } from './styled'

const [username, groups, isLoading] = ['caltroit_red_flames', [], false]

const PageLayout = ({ children }) => {
  if (!username) {
    return null
  }

  return (
    <SidebarDiv>
      <Sidebar groups={groups} />
      <ChildrenDiv>{children}</ChildrenDiv>
    </SidebarDiv>
  )
}

export default PageLayout
