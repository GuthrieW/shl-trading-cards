import React from 'react'
import { Link } from 'components/common/Link'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { UserCollection } from '@pages/api/v3'
import axios from 'axios'
import { Box, Stack, Skeleton, SkeletonText, Img } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import TradingCard from '@components/images/trading-card'

interface BackOfCardProps {
  cardID: string
  userID: string
  isOwned: boolean
}

export const BackOfCard: React.FC<BackOfCardProps> = ({
  cardID,
  userID,
  isOwned,
}) => {
  const { payload: packs, isLoading } = query<UserCollection[]>({
    queryKey: ['packs-from-cards', cardID, userID, String(isOwned)],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/cards/packs-from-cards?userID=${userID}&cardID=${cardID}&isOwned=${isOwned}`,
      }),
    enabled: !!cardID && !!userID,
  })

  if (isLoading) {
    return (
      <Stack spacing={4} mt={5}>
        {Array.from({ length: 3 }).map((_, index) => (
          <Box
            key={index}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
          >
            <Skeleton height="20px" mb="4" />
            <SkeletonText mt="4" noOfLines={2} spacing="4" />
          </Box>
        ))}
      </Stack>
    )
  }

  return (
    <Stack spacing={4} mt={5}>
      {isOwned ? (
        packs?.map((pack) => (
          <Box
            key={pack.packID}
            p={5}
            shadow="md"
            borderWidth="1px"
            borderRadius="md"
            textAlign="center"
          >
            <div className="text-lg">Pack #{pack.packID}</div>
            <Link
              href={`/packs/${pack.packID}`}
              className="text-blue600"
              as="a"
              target="_blank"
            >
              View Pack #{pack.packID}
            </Link>
          </Box>
        ))
      ) : (
        <TradingCard
          className={`${!isOwned ? 'grayscale' : ''}`}
          source={`/cardback.png`}
          playerName={'backOfCard'}
          rarity={''}
        />
      )}
    </Stack>
  )
}
