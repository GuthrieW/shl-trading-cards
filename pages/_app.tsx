import React, { useEffect, useState } from 'react'
import { Raleway, Montserrat } from '@next/font/google'
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'
import { AppProps } from 'next/app'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { SessionProvider, useSession } from 'contexts/AuthContext'
import { CustomChakraProvider } from 'styles/CustomChakraProvider'
import { IceLevelLogo } from '@components/common/IceLevelLogo'
import { ThemeProvider } from 'next-themes'
import { Footer } from '@components/common/Footer'
import { Spinner, ToastProvider } from '@chakra-ui/react'
import '../styles/globals.css'
import '../styles/style.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal'],
  variable: '--font-montserrat',
})

const raleway = Raleway({
  subsets: ['latin'],
  weight: 'variable',
  style: ['normal'],
  variable: '--font-raleway',
})

const AppWrappers = ({ Component, pageProps }: AppProps): JSX.Element => {
  const { loggedIn, handleRefresh, isLoading } = useSession()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: async (error: object, query) => {
            if ('status' in error && error.status === 401) {
              await handleRefresh()
              if (loggedIn) {
                queryClient.refetchQueries(query.queryKey)
              }
            }
          },
        }),
      })
  )

  useEffect(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.body.classList.add('dark')
      document.documentElement.classList.add('dark')
    } else {
      document.body.classList.add('light')
      document.documentElement.classList.add('light')
    }
  }, [])

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <main
          className={`${montserrat.variable} ${raleway.variable} relative min-h-screen font-raleway`}
        >
          <DefaultSeo {...SEO} />
          <ThemeProvider
            attribute="class"
            storageKey="index-theme"
            themes={['light', 'dark']}
            value={{
              light: 'index-theme-light',
              dark: 'index-theme-dark',
            }}
            enableColorScheme={false}
          >
            <CustomChakraProvider>
              {isLoading ? (
                <>
                  <div className="m-auto w-full pb-8 2xl:w-4/5">
                    <div className="m-auto flex h-[calc(100vh-10rem)] w-full items-center justify-center">
                      <Spinner size="xl" thickness="4px" />
                    </div>
                  </div>
                  <Footer />
                </>
              ) : (
                <Component {...pageProps} />
              )}
            </CustomChakraProvider>
          </ThemeProvider>
        </main>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default function App(props: AppProps) {
  return (
    <SessionProvider>
      <AppWrappers {...props} />
    </SessionProvider>
  )
}
