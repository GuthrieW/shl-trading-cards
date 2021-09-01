import React from 'react'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from '@material-ui/styles'
// import { ThemeProvider } from 'styled-components'
import { SWRConfig } from 'swr'
import SEO from '../next-seo.config'
import { AppProps } from 'next/app'
import DefaultLayout from '@layouts/default-layout'
import { createTheme } from '@material-ui/core'

const theme = createTheme({
  palette: {
    type: 'dark',
  },
})

export default function MyApp({ Component, pageProps }: AppProps): JSX.Element {
  return (
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((result) => result.json()),
      }}
    >
      <ThemeProvider theme={theme}>
        <DefaultLayout>
          <DefaultSeo {...SEO} />
          <Component {...pageProps} />
        </DefaultLayout>
      </ThemeProvider>
    </SWRConfig>
  )
}
