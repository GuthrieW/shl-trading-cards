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
    <StyledOverlay>
      <HomeContainer />
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            marginTop: '20px',
            color: 'white',
            textShadow: '0px 0px 10px #000000',
          }}
        >
          Welcome to SHL Trading Cards!
        </h1>
      </div>
    </StyledOverlay>
  )
}

export default Home
