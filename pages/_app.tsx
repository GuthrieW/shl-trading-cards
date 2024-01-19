import React, { useState } from 'react'
import { Raleway, Montserrat } from 'next/font/google'
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'
import { AppProps } from 'next/app'
import { QueryCache, QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import '../styles/globals.css'
import { SessionProvider } from 'contexts/SessionContext'
import { useSession } from '@hooks/useSession'
import { CustomChakraProvider } from 'styles/CustomChakraProvider'
import { ToastProvider } from 'contexts/ToastContext'
import { Footer } from '@components/v3/layout/Footer'
import { Spinner } from '@chakra-ui/react'
import { ShlLogo } from '@components/v3/logo/ShlLogo'

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

const AppWrappers = ({ Component, pageProps }: AppProps) => {
  const { isLoggedIn, handleRefresh, isLoading } = useSession()

  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: async (error, query) => {
            // @ts-ignore
            if (error.status === 401) {
              await handleRefresh()
              if (isLoggedIn) {
                queryClient.refetchQueries(query.queryKey)
              }
            }
          },
        }),
      })
  )

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
                    className="z-50 h-16 w-full bg-grey900"
                    role="navigation"
                    aria-label="Main"
                  >
                    <ShlLogo />
                  </div>
                  <div className="m-auto w-full bg-grey100 pb-8 2xl:w-4/5 ">
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
