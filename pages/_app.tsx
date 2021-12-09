import React, { useEffect, useState } from 'react'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from '@material-ui/styles'
import SEO from '../next-seo.config'
import { AppProps } from 'next/app'
import Layout from '@components/layout'
import { createTheme } from '@material-ui/core'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'

const theme = createTheme({
  palette: {
    type: 'light',
  },
})

const AuthModal = () => (
  <iframe
    style={{
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '100vh',
    }}
    name={'user-authentication-window'}
    src={'https://simulationhockey.com/userinfo.php'}
  />
)

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())
  const [showModal, setShowModal] = useState<boolean>(false)

  useEffect(() => {
    const windowExists = typeof window !== 'undefined'
    const eventHandler = (event) => {
      if (windowExists) {
        if (event.origin === 'https://simulationhockey.com') {
          setShowModal(false)
          const { type, uid } = event.data
          if (type == 'uid') {
            sessionStorage.setItem('uid', uid)
          }
        }
      }
    }

    if (windowExists) {
      if (!sessionStorage.getItem('uid')) {
        setShowModal(true)
      }
      window.addEventListener('message', eventHandler)
    }

    return () => {
      if (windowExists) {
        window.removeEventListener('message', eventHandler)
      }
    }
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Layout>
            <DefaultSeo {...SEO} />
            {showModal && <AuthModal />}
            <Component {...pageProps} />
            <style global jsx>{`
              body {
                font-family: 'Raleway', sans-serif;
                background-color: '#E9ECEF';
              }
              * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
              }
            `}</style>
          </Layout>
        </Hydrate>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
