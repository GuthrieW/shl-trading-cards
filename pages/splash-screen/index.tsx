import React from 'react'
import { Box, ButtonGroup, Button, Link } from '@material-ui/core'
import useStyles from './index.styles'
import { useAuthentication } from '@hooks/index'
import Loading from '@components/loading'

const SplashScreen = () => {
  const classes = useStyles()
  const [isLoading, username, userGroups] = useAuthentication() as [
    boolean,
    string,
    Array<Number>
  ]

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className={classes.splashScreenWrapper}>
        <Box className={classes.overlayContainer}>
          <img
            className={classes.tradingCardsLogo}
            src={
              'https://www.tailorbrands.com/wp-content/uploads/2020/07/mcdonalds-logo.jpg'
            }
          />
          <p className={classes.subtitle}>Welcome to SHL Trading Cards!</p>
          <Box className={classes.buttonContainer}>
            <ButtonGroup
              fullWidth
              orientation="vertical"
              size="large"
              aria-label="small outlined button group"
            >
              <Box m={2}>
                <Link href="#">
                  <Button variant="contained" color="primary" fullWidth>
                    Login
                  </Button>
                </Link>
              </Box>
              <Box m={2}>
                <Link href="#">About SHL Trading Cards</Link>
              </Box>
            </ButtonGroup>
          </Box>
        </Box>
        <Box>
          <div className={classes.gradient}></div>
          <video
            className={classes.splashScreenVideo}
            src=""
            autoPlay
            loop
            playsInline
            muted
          ></video>
        </Box>
      </div>
    </>
  )
}

export default SplashScreen
