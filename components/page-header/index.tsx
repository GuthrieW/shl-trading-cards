import React from 'react'
import styled from 'styled-components'

type PageHeaderProps = {
  children: string
}

const StyledHeader = styled.h1`
  padding: 5px;
  margin: 0px;
`

const PageHeader = ({ children }: PageHeaderProps) => {
  return <StyledHeader>{children}</StyledHeader>
}

export default PageHeader
