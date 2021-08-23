import React from 'react'
import { DefaultSeo } from 'next-seo'
import { ThemeProvider } from '@material-ui/styles'
// import { ThemeProvider } from 'styled-components'
import { SWRConfig } from 'swr'
import SEO from '../next-seo.config'
import { AppProps } from 'next/app'
import DefaultLayout from '@layouts/default-layout'
import { createMuiTheme } from '@material-ui/core'

const theme = createMuiTheme({
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
          <style global jsx>{`
        body {
          font-family: 'Raleway, sans-serif;
          background-color: black;
        }

        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        `}</style>
        </DefaultLayout>
      </ThemeProvider>
    </SWRConfig>
  )
}
