import React, { useEffect, useState } from 'react'
import { Raleway, Montserrat } from 'next/font/google'
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'
import { AppProps } from 'next/app'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { SessionProvider, useSession } from 'contexts/AuthContext'
import { CustomChakraProvider } from 'styles/CustomChakraProvider'
import { ToastProvider } from 'contexts/ToastContext'
import { IceLevelLogo } from '@components/common/IceLevelLogo'
import { Footer } from '@components/common/Footer'
import { Spinner } from '@chakra-ui/react'
import '../styles/globals.css'

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
          <CustomChakraProvider>
            <ToastProvider>
              {isLoading ? (
                <>
                  <div
                    className="z-50 h-16 w-full bg-primary dark:bg-primaryDark"
                    role="navigation"
                    aria-label="Main"
                  >
                    <div className="relative mx-auto flex h-full w-full items-center justify-between px-[5%] sm:w-11/12 sm:justify-start sm:p-0 lg:w-3/4">
                      <IceLevelLogo className="relative top-[5%] h-[90%] sm:top-[2.5%]" />
                    </div>
                  </div>
                  <div className="m-auto w-full bg-secondary pb-8 dark:bg-secondaryDark 2xl:w-4/5 ">
                    <div className="m-auto flex h-[calc(100vh-10rem)] w-full items-center justify-center">
                      <Spinner size="xl" thickness="4px" />
                    </div>
                  </div>
                  <Footer />
                </>
              ) : (
                <Component {...pageProps} />
              )}
            </ToastProvider>
          </CustomChakraProvider>
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
