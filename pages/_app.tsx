import React, { useState } from 'react'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from '@material-ui/styles'
import { SWRConfig } from 'swr'
import SEO from '../next-seo.config'
import { AppProps } from 'next/app'
import DefaultLayout from '@layouts/default-layout'
import { createTheme } from '@material-ui/core'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'

const theme = createTheme({
  palette: {
    type: 'dark',
  },
})

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  const [queryClient] = useState(() => new QueryClient())

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
            <DefaultLayout>
              <DefaultSeo {...SEO} />
              <Component {...pageProps} />
            </DefaultLayout>
          </Hydrate>
        </QueryClientProvider>
      </ThemeProvider>
    </SWRConfig>
  )
}
