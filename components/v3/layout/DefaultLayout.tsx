import { Spinner } from '@chakra-ui/react'
import { NextSeo } from 'next-seo'
import { HTMLAttributes, ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

export const DefaultLayout = ({
  children,
  loading,
  className,
  title,
}: {
  children: ReactNode
  title?: string
  loading?: boolean
  className?: HTMLAttributes<HTMLDivElement>['className']
}) => {
  return (
    <>
      {title && <NextSeo title={title} />}
      <Header />
      <div className="mx-auto w-full bg-grey100 pb-20 2xl:w-4/5">
        {loading ? (
          <div className="m-auto flex h-[calc(100vh-10rem)] w-full items-center justify-center">
            <Spinner size="xl" thickness="4px" />
          </div>
        ) : (
          <div className="min-h-[calc(100vh-10rem)] px-[2.5%] pt-4 2xl:px-16">
            <div className={className}>{children}</div>
          </div>
        )}
      </div>
      <Footer />
    </>
  )
}
