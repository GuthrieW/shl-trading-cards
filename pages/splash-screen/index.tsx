import React from 'react'
import { Box, ButtonGroup, Button, Link } from '@material-ui/core'

const SplashScreen = () => {
  return (
    <>
      <div>
        <Box>
          <p>Welcome to SHL Trading Cards!</p>
          <Box>
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
          <div></div>
          <video src="" autoPlay loop playsInline muted></video>
        </Box>
      </div>
    </>
  )
}

export default SplashScreen
