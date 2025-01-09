import React from 'react'
import { Box, Spinner, VStack, HStack, Link } from '@chakra-ui/react'
import { query } from '@pages/api/database/query'
import { GET } from '@constants/http-methods'
import axios from 'axios'
import { UserPacks } from '@pages/api/v3'
import { PageWrapper } from '@components/common/PageWrapper'
import { formatDateTime } from '@utils/formatDateTime'
import PackOpen from '@components/collection/PackOpen'
import GetUsername from '@components/common/GetUsername'
import { GetServerSideProps } from 'next'

export default ({ packID }: { packID: string }) => {
  const { payload: packs, isLoading: packsLoading } = query<UserPacks[]>({
    queryKey: ['latest-packs', packID],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid/latest-packs?packID=${packID}`,
      }),
    enabled: !!packID,
  })

  if (packsLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Spinner size="xl" />
      </Box>
    )
  }

  const pack = packs?.[0]
  return (
    <PageWrapper>
      <Box p={6}>
        <div className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg sm:text-xl font-bold text-secondaryText mb-6">
          <VStack spacing={4} align="start">
            <HStack justify="space-between" width="100%">
              <div className="font-bold">
                <div className="text-xs sm:text-lg">
                  Opened by:{' '}
                  <Link
                    className="!text-link"
                    href={`/collect/${packs?.[0]?.userID}`}
                    target="_blank"
                  >
                    <GetUsername userID={packs?.[0]?.userID} />
                  </Link>{' '}
                </div>
                <div className="text-xs sm:text-lg">
                  Pack Type: {packs?.[0]?.packType}
                </div>
              </div>
              <div className="font-bold">
                <div className="text-xs sm:text-lg">
                  Bought On: {formatDateTime(pack.purchaseDate)}
                </div>
                <div className="text-xs sm:text-lg">
                  Opened On: {formatDateTime(pack.openDate)}
                </div>
              </div>
            </HStack>
          </VStack>
        </div>
        {packs && packs[0].opened === 1 ? (
          <PackOpen packID={packID} />
        ) : (
          <div className="text-base sm:text-lg">
            No cards available for this pack.
          </div>
        )}
      </Box>
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { packID } = query

  return {
    props: {
      packID,
    },
  }
}
