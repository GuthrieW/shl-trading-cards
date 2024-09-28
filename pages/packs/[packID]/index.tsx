import React from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  SimpleGrid,
  Spinner,
  Text,
  Card,
  CardBody,
  Image,
  VStack,
  HStack,
} from '@chakra-ui/react'
import { query } from '@pages/api/database/query'
import { GET } from '@constants/http-methods'
import axios from 'axios'
import { LatestCards, UserLatestPack } from '@pages/api/v3'
import { PageWrapper } from '@components/common/PageWrapper'
import { UserData } from '@pages/api/v3/user'
import { formatDateTime } from '@utils/formatDateTime'
import PackOpen from '@components/collection/PackOpen'
import GetUsername from '@components/common/GetUsername'

interface PackPageProps {
  customImageLoader?: (src: string) => string
  imageWidth?: number
  imageHeight?: number
}

const PackPage: React.FC<PackPageProps> = ({
  customImageLoader = (src: string) =>
    `https://simulationhockey.com/tradingcards/${src}.png`,
  imageWidth = 200,
  imageHeight = 300,
}) => {
  const router = useRouter()
  const packID = router.query.packID as string | undefined

  const { payload: cards, isLoading } = query<LatestCards[]>({
    queryKey: ['latest-cards', packID],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid/latest-cards?packID=${packID}`,
      }),
    enabled: !!packID,
  })

  const { payload: packs, isLoading: packsLoading } = query<UserLatestPack[]>({
    queryKey: ['latest-packs', packID],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid/latest-packs?packID=${packID}`,
      }),
    enabled: !!packID,
  })
  if (!packID) {
    return <div>Invalid Pack ID</div>
  }

  if (isLoading || packsLoading ) {
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
                <div className="text-xs sm:text-lg">Opened By: <GetUsername userID={packs?.[0]?.userID} /> </div>
                <div className="text-xs sm:text-lg">Pack #: {packID}</div>
              </div>
              <div className="font-bold">
                <div className="text-xs sm:text-lg">Bought On: {formatDateTime(pack.purchaseDate)}</div>
                <div className="text-xs sm:text-lg">Opened On: {formatDateTime(pack.openDate)}</div>
              </div>
            </HStack>
          </VStack>
        </div>
        {cards && cards.length > 0 ? (
          <PackOpen packID={packID} />
        ) : (
          <div className="text-base sm:text-lg">No cards available for this pack.</div>
        )}
      </Box>
    </PageWrapper>
  )
}

export default PackPage
