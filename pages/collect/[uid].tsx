import { Image, Select, SimpleGrid } from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import TablePagination from '@components/table/TablePagination'
import { GET } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import axios from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'

type SortValue = keyof Card
type SortOption = { value: SortValue; label: string }

const SORT_OPTIONS: SortOption[] = [
  { value: 'overall', label: 'Overall' },
  { value: 'player_name', label: 'Player Name' },
  { value: 'teamID', label: 'Team Name' }, // join on mybb_teams to be able to sort on this
  { value: 'overall', label: 'Overall' },
  { value: 'overall', label: 'Overall' },
  { value: 'overall', label: 'Overall' },
  { value: 'overall', label: 'Overall' },
  { value: 'overall', label: 'Overall' },
] as const

const ROWS_PER_PAGE: number = 10 as const

const LOADING_GRID_DATA: { rows: {}[] } = { rows: [] }

export default () => {
  const router = useRouter()
  const [sortColumn, setSortColumn] = useState<SortValue>(SORT_OPTIONS[0].value)
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')

  const uid = router.query.uid as string
  const { payload, isLoading, refetch } = query<ListResponse<Card>>({
    queryKey: ['collection'],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/colleciton/${uid}`,
      }),
  })

  useEffect(() => {
    refetch()
  }, [])

  return (
    <PageWrapper>
      <p>Collect Home</p>
      <div>
        <Select
          onChange={(event) => {
            const [sortColumn, sortDirection] = event.target.value.split(
              ':'
            ) as [SortValue, SortDirection]
            setSortColumn(sortColumn)
            setSortDirection(sortDirection)
          }}
        >
          {SORT_OPTIONS.map((option) => (
            <>
              <option value={`${option.value}:DESC`}>
                {option.label} {'(Descending)'}
              </option>
              <option value={`${option.value}:ASC}`}>
                {option.label} {'(Ascending)'}
              </option>
            </>
          ))}
        </Select>
        <SimpleGrid columns={{ sm: 2, md: 3, lg: 5 }}>
          {payload.rows.map((card) => (
            <Image
              src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
            />
          ))}
        </SimpleGrid>
        <TablePagination totalRows={0} rowsPerPage={0} onPageChange={null} />
      </div>
    </PageWrapper>
  )
}
