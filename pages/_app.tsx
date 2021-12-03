import React, { useState } from 'react'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from '@material-ui/styles'
import { SWRConfig } from 'swr'
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

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())

  if (typeof window !== 'undefined') {
    console.log('we have a window')
    if (!sessionStorage.getItem('uid')) {
      console.log('no user id in sessionStorage')
      window.open(
        'https://simulationhockey.com/userinfo.php',
        'user-authentication-window'
      )
    }

    window.addEventListener('message', (event) => {
      console.log('we have a message')
      if (event.origin === 'https://simulationhockey.com') {
        console.log('data', event.data)
        const { uid } = event.data
        sessionStorage.setItem('uid', uid)
      }
    })
  }

  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((result) => result.json()),
      }}
    >
      <ThemeProvider theme={theme}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Layout>
              <DefaultSeo {...SEO} />
              <Component {...pageProps} />
            </Layout>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </SWRConfig>
  )
}
