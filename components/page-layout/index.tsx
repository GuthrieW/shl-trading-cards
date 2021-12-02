import React from 'react'
import Sidebar from '@components/sidebar'
import { ChildrenDiv, SidebarDiv } from './styled'

const PageLayout = ({ children }) => (
  <SidebarDiv>
    <Sidebar />
    <ChildrenDiv>{children}</ChildrenDiv>
  </SidebarDiv>
)

export default PageLayout
