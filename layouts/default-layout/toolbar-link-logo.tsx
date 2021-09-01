import React from 'react'
import styled from 'styled-components'
import Link from 'next/link'

const ToolbarLinkLogo = () => (
  <Link href="/">
    <ToolbarLogo src={'https://pbs.twimg.com/media/E60yXz0VkAI--E7.png'} />
  </Link>
)

const ToolbarLogo = styled.img`
  max-width: 64px;
  max-height: 64px;
  margin-top: 5px;
  margin-bottom: 5px;
`

export default ToolbarLinkLogo
