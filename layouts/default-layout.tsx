import {
  createMuiTheme,
  ThemeProvider,
  AppBar,
  Toolbar,
  Typography,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  useMediaQuery,
  useTheme,
} from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import SplashScreen from '../pages/splash-screen'
import Link from 'next/link'
import Router from 'next/router'
import axios from 'axios'
import classes from '*.module.css'

const darkTheme = createMuiTheme({
  palette: {
    type: 'dark',
  },
})

const DefaultLayout = ({ children }) => {
  // const classes = useStyles()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios({
        headers: {},
      })

      false ? setIsLoggedIn(false) : setIsLoggedIn(true)

      setIsLoading(false)
    }

    fetchData()
  }, [])

  const handleSignOut = () => {
    Router.push({
      pathname: '/Authentication/Login',
    })
  }

  const theme = useTheme()
  const largeScreen = useMediaQuery(theme.breakpoints.up('lg'))

  if (isLoading) return null

  return (
    <ThemeProvider theme={darkTheme}>
      {!isLoggedIn && <SplashScreen />}
      {isLoggedIn && (
        <div className={classes.root}>
          <AppBar position="fixed" className={classes.appBar}>
            <Toolbar>
              <Link href="/">
                <div className={classes.headerLogoContainer}>
                  {!largeScreen}
                </div>
              </Link>
              <Typography variant="h6" noWrap>
                <Button onClick={handleSignOut}>Sign Out</Button>
              </Typography>
            </Toolbar>
          </AppBar>
          {largeScreen && (
            <div>
              <div> {children}</div>
            </div>
          )}
          {!largeScreen && (
            <div>
              <div> {children}</div>
            </div>
          )}
        </div>
      )}
    </ThemeProvider>
  )
}
