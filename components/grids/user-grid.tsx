import UserCard from '@components/cards/user-card'
import SearchBar from '@components/inputs/search-bar'
import { useResponsive } from '@hooks/useResponsive'
import getUidFromSession from '@utils/get-uid-from-session'
import { useEffect, useMemo, useState } from 'react'
import CommunityTable from '@components/tables/community-table'
import useGetAllUsersWithCards from '@pages/api/queries/use-get-all-users-with-cards'
import GridPagination from './grid-pagination'

export type UserGridProps = {}

const UserGrid = ({}: UserGridProps) => {
  const { isMobile, isTablet } = useResponsive()
  const [searchString, setSearchString] = useState<string>('')
  const [currentPage, setCurrentPage] = useState<number>(0)

  const { users, maxPages, isLoading, refetch } = useGetAllUsersWithCards({
    name: searchString,
    page: currentPage,
  })

  useEffect(() => refetch(), [currentPage, searchString])
  useEffect(() => updateCurrentPage(0), [searchString])

  const updateCurrentPage = (pageNumber: number) => setCurrentPage(pageNumber)

  return (
    <div className="w-full h-full mx-2">
      <div className="flex justify-start w-64">
        <SearchBar onChange={(event) => setSearchString(event.target.value)} />
      </div>
      <GridPagination
        updateCurrentPage={updateCurrentPage}
        currentPage={currentPage}
        maxPages={maxPages}
      />
      <div
        className={`grid ${
          isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-5'
        }`}
      >
        {isLoading && users.length !== 0 ? (
          <p>Loading...</p>
        ) : (
          <>
            {users.map((user) => (
              <UserCard user={user} />
            ))}
          </>
        )}
      </div>
    </div>
  )
}

export default UserGrid
