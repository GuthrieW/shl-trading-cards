import React from 'react'
import styled from 'styled-components'
import { PageHeader } from '@components/index'

const StyledVideo = styled.video`
  width: 100%;
  height: 100%;
  z-index: -1;
`

const HomeContainer = () => (
  <StyledVideo autoPlay loop playsInline muted>
    <source src={'/videos/background-video.mp4'} type={'video/mp4'} />
  </StyledVideo>
)

const Home = () => {
  return (
    <>
      <HomeContainer />
      <div
        style={{
          zIndex: 1,
        }}
      >
        <PageHeader>Home</PageHeader>
      </div>
    </>
  )
}

export default Home
