import UserCard from '@components/cards/user-card'
import { useEffect, useState } from 'react'
import useGetAllUsersWithCards from '@pages/api/queries/use-get-all-users-with-cards'
import Pagination from '@components/tables/pagination'
import { PropagateLoader } from 'react-spinners'
import TablePagination from '@components/table/TablePagination'
import { Input } from '@chakra-ui/react'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse } from '@pages/api/v3'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'

export type UserGridProps = {}
const ROWS_PER_PAGE: number = 10 as const

const UserTables = ({}: UserGridProps) => {
  const [tablePage, setTablePage] = useState<number>(1)
  const [searchString, setSearchString] = useState<string>('')

  const {
    payload: users,
    isLoading,
    refetch,
  } = query<ListResponse<UserData>>({
    queryKey: ['with-cards', searchString, String(tablePage),],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/user/with-cards',
        params: {
            username: searchString,
            limit: ROWS_PER_PAGE,
            offset: (tablePage - 1) * ROWS_PER_PAGE, 
        }
      }),
  })

  useEffect(() => {
    refetch();
  }, [tablePage]);

  return (
    <div className="w-full h-full mx-2">
      <Input
        className="w-full bg-secondary border-grey100"
        placeholder="Search Username"
        size="lg"
        onChange={(event) => setSearchString(event.target.value)}
      />
      {isLoading ? (
        <div className="flex justify-center">
          <PropagateLoader />
        </div>
      ) : (
        <>
          <div className="flex justify-start w-64"></div>
          <TablePagination
            totalRows={users.total}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={(newPage) => setTablePage(newPage)}
          />
          <div className={`grid ${'grid-cols-5'}`}>
            {users.rows.map((user) => (
              <UserCard key={user.uid} user={user} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default UserTables
