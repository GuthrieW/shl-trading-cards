import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import SortIcon from '@components/table/SortIcon'
import Td from '@components/table/Td'
import TablePagination from '@components/tables/TablePagination'
import { GET, POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { query } from '@pages/api/database/query'
import { SortDirection } from '@pages/api/v3'
import { SettingsData } from '@pages/api/v3/settings'
import axios from 'axios'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'

type ColumnName = 'subscription' | 'username'

const ROWS_PER_PAGE: number = 10 as const

const LOADING_TABLE_DATA = {
  rows: Array.from({ length: 10 }, (_, index) => ({
    uid: index,
    username: 'username',
    subscription: 0,
  })),
} as const

export default function MonthlySubscriptionsForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const [sortColumn, setSortColumn] = useState<ColumnName>('username')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC')
  const [tablePage, setTablePage] = useState<number>(1)

  const { mutate: distributeMonthlyPacks } = mutation<void, void>({
    mutationFn: () =>
      axios({
        method: POST,
        url: '/api/v3/monthly-subscriptions/distribute',
      }),
  })

  const { payload, isLoading, refetch } = query<{
    rows: SettingsData[]
    total: number
  }>({
    queryKey: ['subscriptions', String(tablePage), sortColumn, sortDirection],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/settings',
        params: {
          offset: (tablePage - 1) * ROWS_PER_PAGE,
          limit: ROWS_PER_PAGE,
          sortColumn,
          sortDirection,
        },
      }),
  })

  useEffect(() => {
    refetch()
  }, [tablePage, sortColumn, sortDirection])

  const { isSubmitting, isValid } = useFormik<{}>({
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {},
    onSubmit: async ({}, { setSubmitting }) => {
      try {
        setSubmitting(true)
        onError(null)
        distributeMonthlyPacks()
      } catch (error) {
        console.error(error)
        const errorMessage: string =
          'message' in error
            ? error.message
            : 'Error submitting, please message caltroit_red_flames on Discord'
        onError(errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
  })

  const handleSortChange = (columnName: ColumnName) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC')
      return
    } else {
      setSortColumn(columnName)
      setSortDirection('ASC')
    }
  }

  const handlePageChange = (newPage) => {
    setTablePage(newPage)
  }

  return (
    <div>
      <div className="flex justify-end items-center">
        <Button
          disabled={!isValid || isSubmitting || isLoading}
          type="submit"
          className="mt-4 mx-1"
          isLoading={isSubmitting}
          loadingText="Submitting..."
        >
          Distribute Subscription Packs
        </Button>
      </div>

      <div className="rounded border border-1 border-inherit mt-4">
        <TableContainer>
          <Table className="mt-4" size="md" layout="fixed">
            <Thead>
              <Tr>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('username')}
                >
                  Username
                  {sortColumn === 'username' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('subscription')}
                >
                  Subscription
                  {sortColumn === 'subscription' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {(isLoading ? LOADING_TABLE_DATA : payload)?.rows.map(
                (setting) => (
                  <Tr key={setting.uid}>
                    <Td isLoading={isLoading}>{setting.username}</Td>
                    <Td isLoading={isLoading}>{setting.subscription}</Td>
                    <Td
                      isLoading={isLoading}
                      className="flex justify-end items-center"
                    >
                      <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                          Actions
                        </MenuButton>
                        <MenuList>
                          <MenuItem>Update</MenuItem>
                          <MenuItem>Delete</MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                )
              )}
            </Tbody>
          </Table>
        </TableContainer>
        <TablePagination
          totalRows={payload?.total}
          rowsPerPage={ROWS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  )
}
