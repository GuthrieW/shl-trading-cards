import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {
  Skeleton,
  SkeletonText,
  Box,
  Card,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
} from '@chakra-ui/react'
import { PropagateLoader } from 'react-spinners'
import { GET } from '@constants/http-methods'
import { binders } from '@pages/api/v3'
import { query } from '@pages/api/database/query'
import { useRouter } from 'next/router'

const BinderTables = () => {
  const router = useRouter()
  const { payload: binders, isLoading } = query<binders[]>({
    queryKey: ['users-binders'],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder`,
      }),
  })

  return (
    <div className="w-full p-4 min-h-[400px]">
      {isLoading ? (
        <div className="space-y-4">
          <div className="border rounded-lg overflow-hidden bg-table-header">
            <div className="grid grid-cols-4 gap-4 p-4">
              {Array.from({ length: 10 }).map((_, index) => (
                <Skeleton key={index} height="24px" />
              ))}
            </div>
            {Array.from({ length: 10 }).map((_, index) => (
              <Box key={index} p="4" borderTop="1px" borderColor=")">
                <SkeletonText noOfLines={1} spacing="4" />
              </Box>
            ))}
          </div>
          <div className="flex justify-center pt-4"></div>
        </div>
      ) : binders ? (
        <Box className="rounded-lg overflow-hidden border">
          <TableContainer>
            <Table variant="simple">
              <Thead className="bg-table-header">
                <Tr>
                  <Th
                    className="text-table-header font-semibold py-4"
                    borderBottom="1px solid"
                  >
                    Name
                  </Th>
                  <Th
                    className="text-table-header font-semibold py-4"
                    borderBottom="1px solid"
                  >
                    User
                  </Th>
                  <Th
                    className="text-table-header font-semibold py-4"
                    borderBottom="1px solid"
                  >
                    Description
                  </Th>
                </Tr>
              </Thead>
              <Tbody className="bg-[var(--color-background-table-row)]">
                {binders.map((binder) => (
                  <Tr
                    key={binder.binderID}
                    className="transition-colors duration-150"
                  >
                    <Td className="text-table-row py-4">
                      <Link
                        className="!hover:no-underline ml-2 block pb-2 text-left !text-blue600 "
                        onClick={() =>
                          router.push(`/binder/${binder.binderID}`)
                        }
                        target="_blank"
                      >
                        {binder.binder_name}
                      </Link>
                    </Td>
                    <Td className="text-table-row py-4">{binder.username}</Td>
                    <Td className="text-table-row py-4 max-w-md truncate">
                      {binder.binder_desc}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Box>
      ) : null}
    </div>
  )
}

export default BinderTables
