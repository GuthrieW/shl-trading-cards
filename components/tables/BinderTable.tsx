import React, { useState, useMemo } from 'react'
import axios from 'axios'
import {
  Skeleton,
  SkeletonText,
  Box,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Link,
  Button,
  useDisclosure,
  Heading,
  Divider,
  useBreakpointValue,
} from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { binders } from '@pages/api/v3'
import { query } from '@pages/api/database/query'
import { useRouter } from 'next/router'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import CreateBinder from '@components/modals/CreateBinder'
import { useSession } from 'contexts/AuthContext'
import TablePagination from '@components/table/TablePagination'
import { BINDER_CONSTANTS } from 'lib/constants'
import UsersBinder from '@components/binder/UsersBinder'
import { Header } from '@components/common/Header'
import UsersBindersCarousel from '@components/carousel/UsersBindersCarousel'

const BinderTables = () => {
  const { loggedIn } = useSession()
  const router = useRouter()
  const [uid] = useCookie(config.userIDCookieName)
  const [currentPage, setCurrentPage] = useState(1)

  const { payload: binders, isLoading } = query<binders[]>({
    queryKey: ['users-binders'],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder`,
      }),
  })
  const isMobile = useBreakpointValue({ base: true, md: false })

  const { payload: Userbinders, isLoading: UserBinderisLoading } = query<
    binders[]
  >({
    queryKey: ['users-binders', uid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/binder`,
        params: {
          userID: uid,
        },
      }),
  })
  const userBinders =
    binders?.filter((binder) => binder.userID === Number(uid)) || []
  const reachedLimit = useMemo(
    () => userBinders.length >= 5,
    [userBinders.length]
  )

  const currentBinders = useMemo(() => {
    const indexOfLastItem = currentPage * BINDER_CONSTANTS.ROWS_PER_PAGE
    const indexOfFirstItem = indexOfLastItem - BINDER_CONSTANTS.ROWS_PER_PAGE
    return binders?.slice(indexOfFirstItem, indexOfLastItem) || []
  }, [binders, currentPage, BINDER_CONSTANTS.ROWS_PER_PAGE])

  return (
    <div className="w-full p-4 min-h-[400px]">
      {isLoading ? (
        <>
          <div className="flex justify-end"></div>
          <div className="space-y-4">
            <div className="border rounded-lg overflow-hidden bg-table-header">
              <div className="grid grid-cols-4 gap-4 p-4">
                {Array.from({ length: 10 }).map((_, index) => (
                  <Skeleton key={index} height="24px" />
                ))}
              </div>
              {Array.from({ length: 10 }).map((_, index) => (
                <Box key={index} p="4" borderTop="1px" borderColor="gray.200">
                  <SkeletonText noOfLines={1} spacing="4" />
                </Box>
              ))}
            </div>
            <div className="flex justify-center pt-4"></div>
          </div>
        </>
      ) : (
        <>
          {loggedIn && (
            <Box className="rounded-lg">
              <Heading className="text-secondary text-center">
                Your Binders
              </Heading>
              {!UserBinderisLoading &&
                (isMobile ? (
                  <UsersBindersCarousel
                    binderData={Userbinders}
                    reachedLimit={reachedLimit}
                  />
                ) : (
                  <UsersBinder
                    binderData={Userbinders}
                    reachedLimit={reachedLimit}
                  />
                ))}
            </Box>
          )}

          <Box className="rounded-lg overflow-hidden border mt-4">
            <TableContainer>
              <Table variant="simple">
                <Thead className="bg-table-header">
                  <Tr>
                    <Th
                      className="!text-table-header font-semibold py-4"
                      borderBottom="1px solid"
                    >
                      Name
                    </Th>
                    <Th
                      className="!text-table-header font-semibold py-4"
                      borderBottom="1px solid"
                    >
                      User
                    </Th>
                    <Th
                      className="!text-table-header font-semibold py-4 hidden md:table-cell"
                      borderBottom="1px solid"
                    >
                      Description
                    </Th>
                  </Tr>
                </Thead>
                <Tbody className="bg-table-row">
                  {currentBinders.map((binder) => (
                    <Tr
                      key={binder.binderID}
                      className="transition-colors duration-150"
                    >
                      <Td className="text-table-row py-4">
                        <Link
                          className="!hover:no-underline ml-2 block pb-2 text-left !text-link"
                          onClick={() =>
                            router.push(`/binder/${binder.binderID}`)
                          }
                          target="_blank"
                        >
                          {binder.binder_name}
                        </Link>
                      </Td>
                      <Td className="text-table-row py-4">{binder.username}</Td>
                      <Td className="text-table-row py-4 max-w-md truncate hidden md:table-cell">
                        {binder.binder_desc}
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </TableContainer>
            {!isLoading && (
              <TablePagination
                totalRows={binders?.length}
                rowsPerPage={BINDER_CONSTANTS.ROWS_PER_PAGE}
                onPageChange={setCurrentPage}
              />
            )}
          </Box>
        </>
      )}
    </div>
  )
}

export default BinderTables
