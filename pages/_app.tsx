import React, { useEffect } from 'react'
import { CssBaseline } from '@material-ui/core'
import DefaultLayout from '@layouts/default-layout'

const App = ({ Component, pageProps }) => {
  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector('#jss-server-side')
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles)
    }
  }, [])

  const getLayout =
    Component.layout || ((page) => <DefaultLayout children={page} />)

  return getLayout(
    <>
      <CssBaseline />
      <Component {...pageProps} />
    </>
  )
}

App.getLayout = App

export default App
