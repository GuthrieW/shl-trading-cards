import { CheckIcon, ChevronDownIcon } from '@chakra-ui/icons'
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Switch,
  Table,
  TableContainer,
  Tbody,
  Th,
  Thead,
  Tr,
  useDisclosure,
} from '@chakra-ui/react'
import DeleteCardDialog from '@components/admin-cards/DeleteCardDialog'
import RemoveCardAuthorDialog from '@components/admin-cards/RemoveCardAuthorDialog'
import RemoveCardImageDialog from '@components/admin-cards/RemoveCardImageDialog'
import UpdateCardModal from '@components/admin-cards/UpdateCardModal'
import { PermissionGuard } from '@components/auth/PermissionGuard'
import { RoleGuard } from '@components/auth/RoleGuard'
import { PageWrapper } from '@components/common/PageWrapper'
import SortIcon from '@components/table/SortIcon'
import Td from '@components/table/Td'
import TablePagination from '@components/table/TablePagination'
import { GET } from '@constants/http-methods'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import axios from 'axios'
import { useState } from 'react'
import { cardService } from 'services/cardService'
import { allTeamsMaps } from '@constants/teams-map'
import rarityMap from '@constants/rarity-map'
import { useCookie } from '@hooks/useCookie'
import filterTeamsByLeague from 'utils/filterTeamsByLeague'
import config from 'lib/config'
import SubmitImageModal from '@components/admin-cards/SubmitImageModal'
import ClaimCardDialog from '@components/admin-cards/ClaimCardDialog'
import ProcessImageDialog from '@components/admin-cards/ProcessImageDialog'

type ColumnName = keyof Readonly<Card>

const ROWS_PER_PAGE: number = 10 as const

const LOADING_TABLE_DATA: { rows: Card[] } = {
  rows: Array.from({ length: ROWS_PER_PAGE }, (_, index) => ({
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
  const [viewNeedsAuthor, setViewNeedsAuthor] = useState<boolean>(false)
  const [viewNeedsImage, setviewNeedsImage] = useState<boolean>(false)
  const [viewNeedsApproval, setviewNeedsApproval] = useState<boolean>(false)
  const [viewNeedsAuthorPaid, setviewNeedsAuthorPaid] = useState<boolean>(false)
  const [viewDone, setViewDone] = useState<boolean>(false)

  const [playerName, setPlayerName] = useState<string>(null)
  const [teams, setTeams] = useState<string[]>([])
  const [rarities, setRarities] = useState<string[]>([])
  const [leagues, setLeague] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<ColumnName>('player_name')
  const [sortDirection, setSortDirection] = useState<SortDirection>('ASC')
  const [tablePage, setTablePage] = useState<number>(1)
  const [selectedCard, setSelectedCard] = useState<Card>(null)

  const claimCardDialog = useDisclosure()
  const updateModal = useDisclosure()
  const removeAuthorDialog = useDisclosure()
  const removeImageDialog = useDisclosure()
  const submitImageModal = useDisclosure()
  const processImageDialog = useDisclosure()
  const deleteDialog = useDisclosure()

  const [uid] = useCookie(config.userIDCookieName)

  const { isCheckingAuthentication } = useRedirectIfNotAuthenticated()
  const { isCheckingAuthorization } = useRedirectIfNotAuthorized({
    roles: ['TRADING_CARD_ADMIN', 'TRADING_CARD_TEAM'],
  })

  const { payload, isLoading } = query<ListResponse<Card>>({
    queryKey: [
      'cards',
      playerName,
      JSON.stringify(teams),
      JSON.stringify(rarities),
      JSON.stringify(leagues),
      String(viewSkaters),
      String(viewNeedsAuthor),
      String(viewNeedsImage),
      String(viewNeedsApproval),
      String(viewNeedsAuthorPaid),
      String(viewDone),
      sortColumn,
      sortDirection,
      String(tablePage),
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: '/api/v3/cards',
        params: {
          limit: ROWS_PER_PAGE,
          offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
          playerName,
          teams: JSON.stringify(teams),
          rarities: JSON.stringify(rarities),
          leagues: JSON.stringify(leagues),
          viewSkaters,
          viewNeedsAuthor,
          viewNeedsImage,
          viewNeedsApproval,
          viewNeedsAuthorPaid,
          viewDone,
          sortColumn,
          sortDirection,
        },
      }),
  })

  const handleSortChange = (columnName: ColumnName) => {
    if (columnName === sortColumn) {
      setSortDirection(sortDirection === 'ASC' ? 'DESC' : 'ASC')
    } else {
      setSortColumn(columnName)
      setSortDirection('ASC')
    }
  }

  const toggleTeam = (team: string) => {
    setTeams((currentValue) => {
      const teamIndex: number = currentValue.indexOf(team)
      teamIndex === -1
        ? currentValue.push(team)
        : currentValue.splice(teamIndex)
      return [...currentValue]
    })
  }

  const toggleLeague = (league: string) => {
    setLeague([league])
  }

  const toggleRarity = (rarity: string) => {
    setRarities((currentValue) => {
      const rarityIndex: number = currentValue.indexOf(rarity)
      rarityIndex === -1
        ? currentValue.push(rarity)
        : currentValue.splice(rarityIndex)
      return [...currentValue]
    })
  }

  return (
    <>
      <PageWrapper
        loading={isCheckingAuthentication || isCheckingAuthorization}
        className="h-full flex flex-col justify-center items-center w-11/12 md:w-3/4"
      >
        <p>Card Management</p>
        <div className="rounded border border-1 border-inherit mt-4">
          <FormControl>
            <Input
              className="w-full bg-secondary border-grey100"
              placeholder="Search By Player Name"
              size="lg"
              onChange={(event) => setPlayerName(event.target.value)}
            />
          </FormControl>
          <div className="m-2 flex flex-col gap-4 md:flex-row md:justify-between">
            <div className="flex flex-row space-x-2">
              <FormControl>
                <Menu closeOnSelect={false}>
                  <MenuButton className="w-full sm:w-auto border-grey800 border-1 rounded p-2 cursor-pointer bg-secondary ">
                    Teams&nbsp;{`(${teams.length})`}
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup type="checkbox">
                      <MenuItemOption
                        icon={null}
                        isChecked={false}
                        aria-checked={false}
                        closeOnSelect
                        onClick={() => setTeams([])}
                      >
                        Deselect All
                      </MenuItemOption>
                      {filterTeamsByLeague(allTeamsMaps, rarities).map(
                        ([key, value]) => {
                          const isChecked: boolean = teams.includes(
                            String(value.teamID)
                          )
                          return (
                            <MenuItemOption
                              icon={null}
                              isChecked={isChecked}
                              aria-checked={isChecked}
                              key={value.teamID}
                              value={String(value.teamID)}
                              onClick={() => toggleTeam(String(value.teamID))}
                            >
                              {value.label}
                              {isChecked && <CheckIcon className="mx-2" />}
                            </MenuItemOption>
                          )
                        }
                      )}
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </FormControl>
              <FormControl>
                <Menu closeOnSelect={false}>
                  <MenuButton className="w-full sm:w-auto border-grey800 border-1 rounded p-2 cursor-pointer bg-secondary">
                    Rarities&nbsp;{`(${rarities.length})`}
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup type="checkbox">
                      <MenuItemOption
                        icon={null}
                        isChecked={false}
                        aria-checked={false}
                        closeOnSelect
                        onClick={() => setRarities([])}
                      >
                        Deselect All
                      </MenuItemOption>
                      {Object.entries(rarityMap).map(([key, value]) => {
                        const isChecked: boolean = rarities.includes(
                          value.value
                        )

                        // Disable selection of any IIHF Awards and another rarity because trying to select different leagues teams at the same time with the same ID is hell
                        const isDisabled =
                          (value.value === 'IIHF Awards' &&
                            rarities.length > 0 &&
                            !rarities.includes('IIHF Awards')) ||
                          (rarities.includes('IIHF Awards') &&
                            value.value !== 'IIHF Awards')

                        return (
                          <MenuItemOption
                            icon={null}
                            isChecked={isChecked}
                            aria-checked={isChecked}
                            key={value.value}
                            value={value.value}
                            onClick={() =>
                              !isDisabled && toggleRarity(value.value)
                            }
                            isDisabled={isDisabled}
                          >
                            {value.label}
                            {isChecked && <CheckIcon className="mx-2" />}
                          </MenuItemOption>
                        )
                      })}
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </FormControl>
              <FormControl>
                <Menu closeOnSelect={false}>
                  <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                    <span className="pr-2">Statuses</span>
                  </MenuButton>
                  <MenuList>
                    <MenuOptionGroup type="checkbox">
                      <MenuItemOption
                        value="NeedsAuthor"
                        className="!bg-[transparent] hover:!bg-blue600 active:!bg-blue700"
                        onClick={() => setViewNeedsAuthor(!viewNeedsAuthor)}
                      >
                        Author Needed
                      </MenuItemOption>
                      <MenuItemOption
                        value="NeedsImage"
                        className="!bg-[transparent] hover:!bg-blue600 active:!bg-blue700"
                        onClick={() => setviewNeedsImage(!viewNeedsImage)}
                      >
                        Needs Image
                      </MenuItemOption>
                      <MenuItemOption
                        value="NeedsApproval"
                        className="!bg-[transparent] hover:!bg-blue600 active:!bg-blue700"
                        onClick={() => setviewNeedsApproval(!viewNeedsApproval)}
                      >
                        Needs Approval
                      </MenuItemOption>
                      <MenuItemOption
                        value="NeedsAuthorPaid"
                        className="!bg-[transparent] hover:!bg-blue600 active:!bg-blue700"
                        onClick={() =>
                          setviewNeedsAuthorPaid(!viewNeedsAuthorPaid)
                        }
                      >
                        Needs Author Paid
                      </MenuItemOption>
                      <MenuItemOption
                        value="Done"
                        className="!bg-[transparent] hover:!bg-blue600 active:!bg-blue700"
                        onClick={() => setViewDone(!viewDone)}
                      >
                        Completed
                      </MenuItemOption>
                    </MenuOptionGroup>
                  </MenuList>
                </Menu>
              </FormControl>
            </div>
            <div className="flex justify-end">
              <FormControl className="flex items-center m-2">
                <FormLabel className="mb-0">Toggle Goaltenders:</FormLabel>
                <Switch onChange={() => setViewSkaters(!viewSkaters)} />
              </FormControl>
            </div>
          </div>
          <TableContainer>
            <Table variant="cardtable" className="mt-4" size="md">
              <Thead>
                <Tr>
                  <Th
                    // position="sticky"
                    left="0"
                  ></Th>
                  <Th>Status</Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('player_name')}
                  >
                    <span className="flex items-center">
                      Name&nbsp;
                      {sortColumn === 'player_name' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('cardID')}
                  >
                    <span className="flex items-center">
                      Card ID&nbsp;
                      {sortColumn === 'cardID' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('playerID')}
                  >
                    <span className="flex items-center">
                      Player ID&nbsp;
                      {sortColumn === 'playerID' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('teamID')}
                  >
                    <span className="flex items-center">
                      Team ID&nbsp;
                      {sortColumn === 'teamID' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('author_userID')}
                  >
                    <span className="flex items-center">
                      Author ID&nbsp;
                      {sortColumn === 'author_userID' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('pullable')}
                  >
                    <span className="flex items-center">
                      Pullable&nbsp;
                      {sortColumn === 'pullable' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('approved')}
                  >
                    <span className="flex items-center">
                      Approved&nbsp;
                      {sortColumn === 'approved' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('author_paid')}
                  >
                    <span className="flex items-center">
                      Paid&nbsp;
                      {sortColumn === 'author_paid' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th>Image URL</Th>
                  <Th>Rarity</Th>
                  <Th>Sub Type</Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('season')}
                  >
                    <span className="flex items-center">
                      Season&nbsp;
                      {sortColumn === 'season' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th>Position</Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() => handleSortChange('overall')}
                  >
                    <span className="flex items-center">
                      OVR&nbsp;
                      {sortColumn === 'overall' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() =>
                      handleSortChange(viewSkaters ? 'skating' : 'high_shots')
                    }
                  >
                    <span className="flex items-center">
                      {viewSkaters ? 'SKT' : 'HSHT'}&nbsp;
                      {viewSkaters && sortColumn === 'skating' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                      {!viewSkaters && sortColumn === 'high_shots' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() =>
                      handleSortChange(viewSkaters ? 'shooting' : 'low_shots')
                    }
                  >
                    <span className="flex items-center">
                      {viewSkaters ? 'SHT' : 'LSHT'}&nbsp;
                      {viewSkaters && sortColumn === 'shooting' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                      {!viewSkaters && sortColumn === 'low_shots' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() =>
                      handleSortChange(viewSkaters ? 'hands' : 'quickness')
                    }
                  >
                    <span className="flex items-center">
                      {viewSkaters ? 'HND' : 'QUI'}&nbsp;
                      {viewSkaters && sortColumn === 'hands' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                      {!viewSkaters && sortColumn === 'quickness' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() =>
                      handleSortChange(viewSkaters ? 'checking' : 'control')
                    }
                  >
                    <span className="flex items-center">
                      {viewSkaters ? 'CHK' : 'CTL'}&nbsp;
                      {viewSkaters && sortColumn === 'checking' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                      {!viewSkaters && sortColumn === 'control' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                  <Th
                    className="cursor-pointer"
                    onClick={() =>
                      handleSortChange(viewSkaters ? 'defense' : 'conditioning')
                    }
                  >
                    <span className="flex items-center">
                      {viewSkaters ? 'DEF' : 'CND'}&nbsp;
                      {viewSkaters && sortColumn === 'defense' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                      {!viewSkaters && sortColumn === 'conditioning' && (
                        <SortIcon sortDirection={sortDirection} />
                      )}
                    </span>
                  </Th>
                </Tr>
              </Thead>
              <Tbody>
                {(isLoading ? LOADING_TABLE_DATA : payload)?.rows.map(
                  (card: Card) => (
                    <Tr key={card.cardID}>
                      <Td
                        isLoading={isLoading}
                        // position="sticky"
                        left="0"
                      >
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<ChevronDownIcon />}
                          >
                            Actions
                          </MenuButton>
                          <MenuList>
                            {!card.author_userID && (
                              <RoleGuard
                                userRoles={[
                                  'TRADING_CARD_ADMIN',
                                  'TRADING_CARD_TEAM',
                                ]}
                              >
                                <MenuItem
                                  onClick={() => {
                                    setSelectedCard(card)
                                    claimCardDialog.onOpen()
                                  }}
                                >
                                  Claim Card
                                </MenuItem>
                              </RoleGuard>
                            )}
                            {!card.image_url &&
                              String(card.author_userID) == uid && (
                                <RoleGuard
                                  userRoles={[
                                    'TRADING_CARD_ADMIN',
                                    'TRADING_CARD_TEAM',
                                  ]}
                                >
                                  <MenuItem
                                    onClick={() => {
                                      setSelectedCard(card)
                                      submitImageModal.onOpen()
                                    }}
                                  >
                                    Submit Image
                                  </MenuItem>
                                </RoleGuard>
                              )}
                            {card.image_url && !card.approved && (
                              <PermissionGuard
                                userPermissions={['canEditCards']}
                              >
                                <MenuItem
                                  onClick={() => {
                                    setSelectedCard(card)
                                    processImageDialog.onOpen()
                                  }}
                                >
                                  Process Image
                                </MenuItem>
                              </PermissionGuard>
                            )}
                            <PermissionGuard userPermissions={['canEditCards']}>
                              <MenuItem
                                onClick={() => {
                                  setSelectedCard(card)
                                  updateModal.onOpen()
                                }}
                              >
                                Update
                              </MenuItem>
                            </PermissionGuard>
                            {card.author_userID && (
                              <PermissionGuard
                                userPermissions={['canEditCards']}
                              >
                                <MenuItem
                                  onClick={() => {
                                    setSelectedCard(card)
                                    removeAuthorDialog.onOpen()
                                  }}
                                >
                                  Remove Author
                                </MenuItem>
                              </PermissionGuard>
                            )}
                            {card.image_url && (
                              <PermissionGuard
                                userPermissions={['canEditCards']}
                              >
                                <MenuItem
                                  onClick={() => {
                                    setSelectedCard(card)
                                    removeImageDialog.onOpen()
                                  }}
                                >
                                  Remove Image
                                </MenuItem>
                              </PermissionGuard>
                            )}
                            <RoleGuard userRoles={['TRADING_CARD_ADMIN']}>
                              <MenuItem
                                onClick={() => {
                                  setSelectedCard(card)
                                  deleteDialog.onOpen()
                                }}
                              >
                                Delete
                              </MenuItem>
                            </RoleGuard>
                          </MenuList>
                        </Menu>
                      </Td>
                      <Td isLoading={isLoading}>
                        {cardService.calculateStatus(card)}
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
                  )
                )}
              </Tbody>
            </Table>
          </TableContainer>
          <TablePagination
            totalRows={payload?.total}
            rowsPerPage={ROWS_PER_PAGE}
            onPageChange={(newPage) => setTablePage(newPage)}
          />
        </div>
      </PageWrapper>
      {selectedCard && (
        <>
          <ClaimCardDialog
            card={selectedCard}
            onClose={() => {
              claimCardDialog.onClose()
              setSelectedCard(null)
            }}
            isOpen={claimCardDialog.isOpen}
          />
          <SubmitImageModal
            card={selectedCard}
            onClose={() => {
              submitImageModal.onClose()
              setSelectedCard(null)
            }}
            isOpen={submitImageModal.isOpen}
          />
          <ProcessImageDialog
            card={selectedCard}
            onClose={() => {
              processImageDialog.onClose()
              setSelectedCard(null)
            }}
            isOpen={processImageDialog.isOpen}
          />
          <UpdateCardModal
            card={selectedCard}
            onClose={() => {
              updateModal.onClose()
              setSelectedCard(null)
            }}
            isOpen={updateModal.isOpen}
          />
          <RemoveCardAuthorDialog
            card={selectedCard}
            onClose={() => {
              removeAuthorDialog.onClose()
              setSelectedCard(null)
            }}
            isOpen={removeAuthorDialog.isOpen}
          />
          <RemoveCardImageDialog
            card={selectedCard}
            onClose={() => {
              removeImageDialog.onClose()
              setSelectedCard(null)
            }}
            isOpen={removeImageDialog.isOpen}
          />
          <DeleteCardDialog
            card={selectedCard}
            onClose={() => {
              deleteDialog.onClose()
              setSelectedCard(null)
            }}
            isOpen={deleteDialog.isOpen}
          />
        </>
      )}
    </>
  )
}
