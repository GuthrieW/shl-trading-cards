import { ChevronDownIcon } from '@chakra-ui/icons'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import SortIcon from '@components/table/SortIcon'
import Td from '@components/table/Td'
import TablePagination from '@components/tables/TablePagination'
import { GET } from '@constants/http-methods'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'

type ColumnName = keyof Readonly<Card>

const ROWS_PER_PAGE: number = 10 as const

const LOADING_TABLE_DATA = {
  rows: Array.from({ length: 10 }, (_, index) => ({
    cardID: index,
    teamID: 0,
    playerID: 0,
    author_userID: 0,
    card_rarity: 'card_rarity',
    sub_type: 'sub_type',
    player_name: 'player_name',
    pullable: 1,
    approved: 1,
    image_url: 'image_url',
    position: 'position',
    overall: 0,
    skating: 0,
    shooting: 0,
    hands: 0,
    checking: 0,
    defense: 0,
    high_shots: 0,
    low_shots: 0,
    quickness: 0,
    control: 0,
    conditioning: 0,
    season: 0,
    author_paid: 1,
  })),
} as const

export default () => {
  const [viewSkaters, setViewSkaters] = useState<boolean>(true)
  const [sortColumn, setSortColumn] = useState<ColumnName>('player_name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC')
  const [tablePage, setTablePage] = useState<number>(1)
  const cancelRef = useRef()

  const updateModal = useDisclosure()
  const removeAuthorModal = useDisclosure()
  const removeImageModal = useDisclosure()
  const deleteModal = useDisclosure()

  const { isCheckingAuthentication } = useRedirectIfNotAuthenticated()
  const { isCheckingAuthorization } = useRedirectIfNotAuthorized({
    roles: ['TRADING_CARD_ADMIN', 'TRADING_CARD_TEAM'],
  })

  const { payload, isLoading, refetch } = query<ListResponse<Card>>({
    queryKey: [
      'cards',
      String(viewSkaters),
      sortColumn,
      sortDirection,
      String(tablePage),
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/cards',
        params: {
          offset: (tablePage - 1) * ROWS_PER_PAGE,
          limit: ROWS_PER_PAGE,
          viewSkaters,
          sortColumn,
          sortDirection,
        },
      }),
  })

  useEffect(() => {
    refetch()
  }, [viewSkaters, sortColumn, sortDirection, tablePage])

  const handleSortChange = (columnName: ColumnName) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortColumn(columnName)
      setSortDirection('ASC')
    }
  }

  const handlePageChange = (newPage) => {
    setTablePage(newPage)
  }

  const handleUpdateCard = (cardID: number) => {
    updateModal.onOpen()
    console.log(cardID)
  }

  const handleRemoveCardAuthor = (cardID: number) => {
    console.log(cardID)
  }

  const handleRemoveCardImage = (cardID: number) => {
    console.log(cardID)
  }

  const handleDeleteCard = (cardID: number) => {
    console.log(cardID)
  }

  return (
    <PageWrapper
      loading={isCheckingAuthentication || isCheckingAuthorization}
      className="h-full flex flex-col justify-center items-center w-11/12 md:w-3/4"
    >
      <div className="rounded border border-1 border-inherit mt-4">
        <TableContainer>
          <FormControl className="flex items-center m-2">
            <FormLabel className="mb-0">Toggle Goaltenders:</FormLabel>
            <Switch
              onChange={() => {
                setViewSkaters((currentValue) => !currentValue)
              }}
            />
          </FormControl>

          <Table className="mt-4" size="md">
            <Thead>
              <Tr>
                <Th></Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('player_name')}
                >
                  Name&nbsp;
                  {sortColumn === 'player_name' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('cardID')}
                >
                  Card ID&nbsp;
                  {sortColumn === 'cardID' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('playerID')}
                >
                  Player ID&nbsp;
                  {sortColumn === 'playerID' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('teamID')}
                >
                  Team ID&nbsp;
                  {sortColumn === 'teamID' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('author_userID')}
                >
                  Author ID&nbsp;
                  {sortColumn === 'author_userID' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('pullable')}
                >
                  Pullable&nbsp;
                  {sortColumn === 'pullable' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('approved')}
                >
                  Approved&nbsp;
                  {sortColumn === 'approved' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('author_paid')}
                >
                  Paid&nbsp;
                  {sortColumn === 'author_paid' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th>Image URL</Th>
                <Th>Rarity</Th>
                <Th>Sub Type</Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('season')}
                >
                  Season&nbsp;
                  {sortColumn === 'season' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th>Position</Th>
                <Th
                  className="cursor-pointer"
                  onClick={() => handleSortChange('overall')}
                >
                  OVR&nbsp;
                  {sortColumn === 'overall' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() =>
                    handleSortChange(viewSkaters ? 'skating' : 'high_shots')
                  }
                >
                  {viewSkaters ? 'SKT' : 'HSHT'}&nbsp;
                  {viewSkaters && sortColumn === 'skating' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                  {!viewSkaters && sortColumn === 'high_shots' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() =>
                    handleSortChange(viewSkaters ? 'shooting' : 'low_shots')
                  }
                >
                  {viewSkaters ? 'SHT' : 'LSHT'}&nbsp;
                  {viewSkaters && sortColumn === 'shooting' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                  {!viewSkaters && sortColumn === 'low_shots' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() =>
                    handleSortChange(viewSkaters ? 'hands' : 'quickness')
                  }
                >
                  {viewSkaters ? 'HND' : 'QUI'}&nbsp;
                  {viewSkaters && sortColumn === 'hands' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                  {!viewSkaters && sortColumn === 'quickness' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() =>
                    handleSortChange(viewSkaters ? 'checking' : 'control')
                  }
                >
                  {viewSkaters ? 'CHK' : 'CTL'}&nbsp;
                  {viewSkaters && sortColumn === 'checking' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                  {!viewSkaters && sortColumn === 'control' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
                <Th
                  className="cursor-pointer"
                  onClick={() =>
                    handleSortChange(viewSkaters ? 'defense' : 'conditioning')
                  }
                >
                  {viewSkaters ? 'DEF' : 'CND'}&nbsp;
                  {viewSkaters && sortColumn === 'defense' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                  {!viewSkaters && sortColumn === 'conditioning' && (
                    <SortIcon sortDirection={sortDirection} />
                  )}
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {(isLoading ? LOADING_TABLE_DATA : payload)?.rows.map((card) => (
                <Tr key={card.cardID}>
                  <Td isLoading={isLoading}>
                    <Menu>
                      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                        Actions
                      </MenuButton>
                      <MenuList>
                        <MenuItem onClick={() => handleUpdateCard(card.cardID)}>
                          Update
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleRemoveCardAuthor(card.cardID)}
                        >
                          Remove Author
                        </MenuItem>
                        <MenuItem
                          onClick={() => handleRemoveCardImage(card.cardID)}
                        >
                          Remove Image
                        </MenuItem>
                        <MenuItem onClick={() => handleDeleteCard(card.cardID)}>
                          Delete
                        </MenuItem>
                      </MenuList>
                    </Menu>
                  </Td>
                  <Td isLoading={isLoading}>{card.player_name}</Td>
                  <Td isLoading={isLoading}>{card.cardID}</Td>
                  <Td isLoading={isLoading}>{card.playerID}</Td>
                  <Td isLoading={isLoading}>{card.teamID}</Td>
                  <Td isLoading={isLoading}>{card.author_userID}</Td>
                  <Td isLoading={isLoading}>{card.pullable}</Td>
                  <Td isLoading={isLoading}>{card.approved}</Td>
                  <Td isLoading={isLoading}>{card.author_paid}</Td>
                  <Td isLoading={isLoading}>{card.image_url}</Td>
                  <Td isLoading={isLoading}>{card.card_rarity}</Td>
                  <Td isLoading={isLoading}>{card.sub_type}</Td>
                  <Td isLoading={isLoading}>{card.season}</Td>
                  <Td isLoading={isLoading}>{card.position}</Td>
                  <Td isLoading={isLoading}>{card.overall}</Td>
                  <Td isLoading={isLoading}>
                    {viewSkaters ? card.skating : card.high_shots}
                  </Td>
                  <Td isLoading={isLoading}>
                    {viewSkaters ? card.shooting : card.low_shots}
                  </Td>
                  <Td isLoading={isLoading}>
                    {viewSkaters ? card.hands : card.quickness}
                  </Td>
                  <Td isLoading={isLoading}>
                    {viewSkaters ? card.checking : card.control}
                  </Td>
                  <Td isLoading={isLoading}>
                    {viewSkaters ? card.defense : card.conditioning}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        <TablePagination
          totalRows={payload?.total}
          rowsPerPage={ROWS_PER_PAGE}
          onPageChange={handlePageChange}
        />
      </div>
    </PageWrapper>
  )
}
