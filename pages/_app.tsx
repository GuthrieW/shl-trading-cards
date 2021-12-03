import React, { useEffect, useState } from 'react'
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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      console.log('we have a window')
      window.addEventListener('message', (event) => {
        console.log('we have a message')
        if (event.origin === 'https://simulationhockey.com/') {
          return
        }

        const { uid } = event.data
        console.log(event.data)
        sessionStorage.setItem('uid', uid)
      })
    }
  }, [])

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
              <iframe src="https://simulationhockey.com/userinfo.php" />
            </Layout>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </SWRConfig>
  )
}
