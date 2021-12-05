import React from 'react'
import styled from 'styled-components'

const StyledVideo = styled.video`
  z-index: -5;
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
`

const StyledOverlay = styled.div`
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
`

const HomeContainer = () => (
  <StyledVideo autoPlay loop playsInline muted>
    <source src={'/videos/home-background.mp4'} type={'video/mp4'} />
  </StyledVideo>
)

const Home = () => {
  return (
    <>
      <StyledOverlay>
        <HomeContainer />
      </StyledOverlay>

      <div
        style={{
          zIndex: 1,
        }}
      ></div>
    </>
  )
}

export default Home
