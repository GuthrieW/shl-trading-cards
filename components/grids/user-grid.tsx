import UserCard from '@components/cards/user-card'
import SearchBar from '@components/inputs/search-bar'
import { useResponsive } from '@hooks/useResponsive'
import getUidFromSession from '@utils/get-uid-from-session'
import { useMemo, useState } from 'react'

export type UserGridProps = {
  gridData: User[]
}

const UserGrid = ({ gridData }: UserGridProps) => {
  const { isMobile, isTablet } = useResponsive()
  const [searchString, setSearchString] = useState<string>('')

  const users: User[] = useMemo(
    () =>
      gridData
        .filter((user) =>
          user.username.toLowerCase().includes(searchString.toLowerCase())
        )
        .filter((user) => user.uid !== getUidFromSession())
        .sort((a, b) =>
          a.username.toLowerCase().localeCompare(b.username.toLowerCase())
        ),
    [searchString]
  )

  return (
    <div className="w-full h-full">
      <div className="flex justify-start w-64">
        <SearchBar onChange={(event) => setSearchString(event.target.value)} />
      </div>
      <div
        className={`grid ${
          isMobile ? 'grid-cols-2' : isTablet ? 'grid-cols-3' : 'grid-cols-5'
        }`}
      >
        {users.map((user) => (
          <UserCard user={user} />
        ))}
      </div>
    </div>
  )
}

export default UserGrid
