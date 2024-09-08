import { PageWrapper } from '@components/common/PageWrapper'
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
  const userId = req?.headers.cookie.replace('userid=', '')

  if (userId) {
    // await queryClient.prefetchQuery({
    //   queryKey: [],
    //   queryFn: () => query(`api/v3/user/userId`)
    // })
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
  }

  return { props: {} }
}
