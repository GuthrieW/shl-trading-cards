import { PageWrapper } from '@components/common/PageWrapper'
import { useSession } from 'contexts/AuthContext'
import { Button, useDisclosure } from '@chakra-ui/react'
import BinderDetailPage from '@components/binder/BinderDetails'
import { GetServerSideProps } from 'next'
import BinderHeader from '@components/binder/BinderHeader'

export default ({ bid }: { bid: string }) => {
  return (
    <PageWrapper>
      <BinderHeader bid={bid} />
      <div className="p-3"></div>
      <BinderDetailPage bid={bid} />
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { bid } = query

  return {
    props: {
      bid,
    },
  }
}
