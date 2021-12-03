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
    window.addEventListener('message', (event) => {
      if (event.origin === 'https://simulationhockey.com') {
        const { uid, username } = event.data
        sessionStorage.setItem('uid', uid)
        sessionStorage.setItem('username', username)
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
              <iframe
                src={'https://simulationhockey.com/userinfo.php'}
                title={'user-info-authentication'}
                style={{
                  width: '0px',
                  height: '0px',
                  border: '0',
                  position: 'absolute',
                }}
              />
              <DefaultSeo {...SEO} />
              <Component {...pageProps} />
            </Layout>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </SWRConfig>
  )
}
