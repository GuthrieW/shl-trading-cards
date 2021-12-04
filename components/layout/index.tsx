import React from 'react'
import Sidebar from '@components/sidebar'
import styled from 'styled-components'
import pages from '@constants/sidebar-pages'

const SidebarDiv = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`

const ChildrenDiv = styled.div`
  width: 100%;
`

const Layout = ({ children }) => (
  <SidebarDiv>
    <Sidebar pages={pages} />
    <ChildrenDiv>{children}</ChildrenDiv>
  </SidebarDiv>
)

export default Layout
