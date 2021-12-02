import React from 'react'
import Sidebar from '@components/sidebar'
import styled from 'styled-components'

const SidebarDiv = styled.div`
  display: flex;
  height: 100%;
`

const ChildrenDiv = styled.div`
  width: 100%;
`

const Layout = ({ children }) => (
  <SidebarDiv>
    <Sidebar />
    <ChildrenDiv>{children}</ChildrenDiv>
  </SidebarDiv>
)

export default Layout
