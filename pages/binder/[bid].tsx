import { PageWrapper } from '@components/common/PageWrapper'
import { useQuery } from 'react-query'
import BinderDetailPage from '@components/binder/BinderDetails'
import { GetServerSideProps } from 'next'
import BinderHeader from '@components/binder/BinderHeader'
import { GET } from '@constants/http-methods'
import axios from 'axios'
import { binders } from '@pages/api/v3'
import { Skeleton, Box, Breadcrumb, BreadcrumbItem, BreadcrumbLink } from '@chakra-ui/react'
import { ChevronRightIcon } from '@chakra-ui/icons'

export default ({ bid }: { bid: string }) => {
  const { data, isLoading } = useQuery<{ status: string; payload: binders[] }>({
    queryKey: ['users-binders', bid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder?bid=${bid}`,
      }).then((response) => response.data),
    enabled: !!bid,
  });

  const userID = data?.payload?.[0]?.userID ?? null;

  return (
    <PageWrapper>
      <Breadcrumb
        spacing="4px"
        separator={<ChevronRightIcon color="gray.500" />}
      >
        <BreadcrumbItem>
          <BreadcrumbLink href="/binder">Binders</BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem isCurrentPage>
          <BreadcrumbLink href="#">Current Binder</BreadcrumbLink>
        </BreadcrumbItem>
      </Breadcrumb>
      {isLoading ? (
        <>
          <Skeleton height="40px" mb="4" />
          <Skeleton height="20px" width="80%" mb="4" />
          <Skeleton height="20px" width="60%" mb="4" />
          <Box p="3">
            <Skeleton height="200px" />
          </Box>
        </>
      ) : (
        <>
          <BinderHeader 
            bid={bid} 
            binderData={data?.payload?.[0]} 
          />
          <div className="p-3"></div>
          <BinderDetailPage 
            bid={bid} 
            userID={userID} 
          />
        </>
      )}
    </PageWrapper>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { bid } = query;

  return {
    props: {
      bid,
    },
  };
}
