import {
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import TablePagination from '@components/tables/TablePagination'
import { GET, POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { query } from '@pages/api/database/query'
import { SettingsData } from '@pages/api/v3/settings'
import axios from 'axios'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'

export default function MonthlySubscriptionsForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const { mutate: distributeMonthlyPacks } = mutation<void, void>({
    mutationFn: () =>
      axios({
        method: POST,
        url: '/api/v3/monthly-subscriptions/distribute',
      }),
  })

  const rowsPerPage: number = 10 as const
  const [tablePage, setTablePage] = useState<number>(1)

  const LOADING_TABLE_DATA = {
    settings: Array.from({ length: 10 }, (_, index) => ({
      uid: index,
      username: 'username',
      subscription: 0,
    })),
  }

  const { payload, isLoading, refetch } = query<{
    settings: SettingsData[]
    total: number
  }>({
    queryKey: 'subscriptions',
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/settings',
        params: {
          offset: (tablePage - 1) * rowsPerPage,
          limit: rowsPerPage,
        },
      }),
  })

  useEffect(() => {
    refetch()
  }, [tablePage, rowsPerPage])

  const { isSubmitting, isValid } = useFormik<{}>({
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {},
    onSubmit: async ({}, { setSubmitting }) => {
      try {
        setSubmitting(true)
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

      <TableContainer>
        <Table size="md">
          <Thead>
            <Tr>
              <Th>Username</Th>
              <Th>Subscription</Th>
              <Th></Th>
            </Tr>
          </Thead>
          <Tbody>
            {(isLoading ? LOADING_TABLE_DATA : payload)?.settings.map(
              (setting) => (
                <Tr key={setting.uid}>
                  <Td>
                    <Skeleton isLoaded={!isLoading}>
                      {setting.username}
                    </Skeleton>
                  </Td>
                  <Td>
                    <Skeleton isLoaded={!isLoading}>
                      {setting.subscription}
                    </Skeleton>
                  </Td>
                  <Td className="flex justify-end items-center">
                    <Skeleton isLoaded={!isLoading}>
                      <Menu>
                        <MenuButton>Actions</MenuButton>
                        <MenuList>
                          <MenuItem>Update</MenuItem>
                          <MenuItem>Delete</MenuItem>
                        </MenuList>
                      </Menu>
                    </Skeleton>
                  </Td>
                </Tr>
              )
            )}
          </Tbody>
        </Table>
        <TablePagination
          totalRows={payload?.total}
          rowsPerPage={rowsPerPage}
          onChange={handlePageChange}
        />
      </TableContainer>
    </div>
  )
}
