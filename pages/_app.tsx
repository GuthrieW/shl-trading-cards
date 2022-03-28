import React, { useEffect, useState } from 'react'
import { DefaultSeo } from 'next-seo'
import SEO from '../next-seo.config'
import { AppProps } from 'next/app'
import { DefaultLayout } from '@components/index'
import { QueryClient, QueryClientProvider } from 'react-query'
import { Hydrate } from 'react-query/hydration'
import { ToastContainer } from 'react-toastify'
import AES from 'crypto-js/aes'
import 'react-toastify/dist/ReactToastify.css'
import '../styles/globals.css'

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
  const [showModal, setShowModal] = useState<boolean>(false)

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  })

  useEffect(() => {
    const windowExists = typeof window !== 'undefined'
    const eventHandler = (event) => {
      if (windowExists) {
        if (event.origin === 'https://simulationhockey.com') {
          setShowModal(false)
          const { type, uid } = event.data
          if (type == 'uid') {
            sessionStorage.setItem(
              'token',
              AES.encrypt(
                uid.toString(),
                process.env.NEXT_PUBLIC_TOKEN_KEY
              ).toString()
            )
          }
        }
      }
    }

    if (windowExists) {
      if (!sessionStorage.getItem('token')) {
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
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        {showModal && <AuthModal />}
        {!showModal && (
          <DefaultLayout>
            <ToastContainer
              position="bottom-left"
              autoClose={5000}
              hideProgressBar={true}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss={false}
              draggable={false}
              pauseOnHover={false}
            />
            <DefaultSeo {...SEO} />
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
          </DefaultLayout>
        )}
      </Hydrate>
    </QueryClientProvider>
  )
}
