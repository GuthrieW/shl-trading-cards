import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useQuery } from 'react-query'
import { Input, Skeleton, SkeletonText, Box, Spinner } from '@chakra-ui/react'
import { PropagateLoader } from 'react-spinners'
import UserCard from '@components/cards/UserCard'
import TablePagination from '@components/table/TablePagination'
import { GET } from '@constants/http-methods'
import { ListResponse } from '@pages/api/v3'
import { UserData } from '@pages/api/v3/user'

const ROWS_PER_PAGE = 10

const UserTables: React.FC = () => {
  const [tablePage, setTablePage] = useState<number>(1)
  const [searchString, setSearchString] = useState<string>('')
  const [isSearching, setIsSearching] = useState<boolean>(false)

  const fetchUsers = async ({ queryKey }: any) => {
    const [_, search, page] = queryKey
    setIsSearching(true)
    try {
      const { data } = await axios({
        method: GET,
        url: '/api/v3/user/with-cards',
        params: {
          username: search,
          limit: ROWS_PER_PAGE,
          offset: (page - 1) * ROWS_PER_PAGE,
        },
      })
      return data.payload
    } finally {
      setIsSearching(false)
    }
  }

  const { data: users, isLoading } = useQuery<ListResponse<UserData>>(
    ['with-cards', searchString, tablePage],
    fetchUsers,
    {
      keepPreviousData: true,
      staleTime: 5000,
    }
  )

  useEffect(() => {
    setTablePage(1) // Reset to first page when search changes
  }, [searchString])

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(event.target.value)
  }

  const handlePageChange = (newPage: number) => {
    setTablePage(newPage)
  }

  return (
    <div className="w-full h-full mx-2">
      <div className="flex items-center mb-4">
      {isSearching && <Spinner size="sm" color="blue.500" className="ml-2" />}
        <Input
          className="w-full bg-secondary border-grey100"
          placeholder="Search Username"
          size="lg"
          value={searchString}
          onChange={handleSearchChange}
        />
        
      </div>
      {isLoading ? (
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {Array.from({ length: ROWS_PER_PAGE }).map((_, index) => (
              <Box key={index} p="6" boxShadow="lg" bg="white">
                <Skeleton height="150px" />
                <SkeletonText mt="4" noOfLines={2} spacing="4" />
              </Box>
            ))}
          </div>
          <div className="flex justify-center">
            <PropagateLoader />
          </div>
        </div>
      ) : users ? (
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {users.rows.map((user) => (
              <UserCard key={user.uid} user={user} />
            ))}
          </div>
          <TablePagination
            totalRows={users.total}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={handlePageChange}
          />
        </div>
      ) : null}
    </div>
  )
}

export default UserTables
