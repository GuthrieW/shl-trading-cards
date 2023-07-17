import UserCard from '@components/cards/user-card'
import SearchBar from '@components/inputs/search-bar'
import { useResponsive } from '@hooks/useResponsive'
import { useEffect, useState } from 'react'
import useGetAllUsersWithCards from '@pages/api/queries/use-get-all-users-with-cards'
import GridPagination from './grid-pagination'
import { PropagateLoader } from 'react-spinners'

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
      {isLoading ? (
        <div className="flex justify-center">
          <PropagateLoader />
        </div>
      ) : (
        <div
          className={`grid ${
            isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-5'
          }`}
        >
          {users.map((user) => (
            <UserCard user={user} />
          ))}
        </div>
      )}
    </div>
  )
}

export default UserGrid
