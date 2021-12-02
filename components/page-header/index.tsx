import React from 'react'

type PageHeaderProps = {
  children: string
}

const PageHeader = ({ children }: PageHeaderProps) => {
  return <h1>{children}</h1>
}

export default PageHeader
