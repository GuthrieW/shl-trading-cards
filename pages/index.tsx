import { PageWrapper } from '@components/common/PageWrapper'
import config from 'lib/config'
import { NextPageContext } from 'next'
import { dehydrate, QueryClient } from 'react-query'

export default function index() {
  return (
    <PageWrapper>
      <p>Home Page</p>
    </PageWrapper>
  )
}

export async function getServerSideProps({ req }: NextPageContext) {
  const queryClient = new QueryClient()
  const userId = req?.headers.cookie.replace(`${config.userIDCookieName}=`, '')

  if (userId) {
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
  }

  return { props: {} }
}
