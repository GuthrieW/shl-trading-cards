import React, { useState } from 'react'
import { useQuery } from 'react-query'
import {
  Box,
  Text,
  SimpleGrid,
  Skeleton,
} from '@chakra-ui/react'
import { binders } from '@pages/api/v3'
import { GET } from '@constants/http-methods'
import axios from 'axios'

const BinderHeader = ({ bid }: { bid: string }) => {
  const { data, isLoading } = useQuery<{ status: string; payload: binders[] }>({
    queryKey: ['users-binders', bid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder?bid=${bid}`,
      }).then((response) => response.data),
    enabled: !!bid,
  })

  return (
    <>
      {isLoading && (
        <Box className="border-b-8 border-b-blue700 bg-secondary p-4 flex justify-between items-center">
          <Skeleton height="20px" width="60%" mb={2} />
          <Skeleton height="16px" width="40%" />
        </Box>
      )}
      <Box className="border-b-8 border-b-blue700 bg-secondary p-4">
        <SimpleGrid columns={2} spacing={4}>
          <Text className="text-lg font-bold">
            {data?.payload?.[0]?.binder_name}
          </Text>
          <Text className="text-lg font-bold text-right">
            By: {data?.payload?.[0]?.username}
          </Text>
        </SimpleGrid>
        <Text className="mt-2 text-secondary">
          {data?.payload?.[0]?.binder_desc}
        </Text>

      </Box>
    </>
  )
}

export default BinderHeader
