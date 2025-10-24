import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Badge,
  Box,
  FormControl,
  FormLabel,
  Input,
  Progress,
  Select,
  SimpleGrid,
  Spinner,
  Switch,
  VStack,
} from '@chakra-ui/react'
import DisplayCollection from '@components/collection/DisplayCollection'
import { PageWrapper } from '@components/common/PageWrapper'
import CardLightBoxModal from '@components/modals/CardLightBoxModal'
import TablePagination from '@components/table/TablePagination'
import { GetServerSideProps } from 'next'
import { GET } from '@constants/http-methods'
import { query, indexAxios } from '@pages/api/database/query'
import { ListResponse, SortDirection, SubType } from '@pages/api/v3'
import {
  OwnedCard,
  OwnedCardSortOption,
  OwnedCardSortValue,
} from '@pages/api/v3/collection/uid'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { pluralizeName } from 'lib/pluralize-name'
import { Fragment, useEffect, useState } from 'react'
import DisplayPacks from '@components/collection/DisplayPacks'
import { toggleOnfilters } from '@utils/toggle-on-filters'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import { useDebounce } from 'use-debounce'
import ImageWithFallback from '@components/images/ImageWithFallback'
import { Team, Rarities } from '@pages/api/v3'
import FilterDropdown from '@components/common/FilterDropdown'
import RadioGroupSelector from '@components/common/RadioGroupSelector'
import { LEAGUE_OPTIONS } from 'lib/constants'
import ActiveFilters from '@components/common/ActiveFilters'

const SORT_OPTIONS: OwnedCardSortOption[] = [
  {
    value: 'overall',
    label: 'Overall',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(Descending)' : '(Ascending)',
  },
  {
    value: 'player_name',
    label: 'Player Name',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(A-Z)' : '(Z-A)',
  },
  {
    value: 'teamID',
    label: 'Team Name',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(A-Z)' : '(Z-A)',
  },
  {
    value: 'quantity',
    label: 'Cards Owned',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(Most to Least)' : '(Least to Most)',
  },
  {
    value: 'season',
    label: 'Draft Season',
    sortLabel: (direction: SortDirection) =>
      direction === 'DESC' ? '(S1->Present)' : '(Present->S1)',
  },
] as const

const ROWS_PER_PAGE: number = 12 as const

const LOADING_GRID_DATA: { rows: OwnedCard[] } = {
  rows: Array.from({ length: ROWS_PER_PAGE }, (_, index) => ({
    quantity: 1,
    cardID: index,
    teamID: 1,
    teamName: 'name',
    teamNickName: 'nickName',
    player_name: 'player_name',
    position: 'F',
    season: 1,
    card_rarity: 'Bronze',
    image_url: 'image_url',
    overall: 1,
    skating: 1,
    shooting: 1,
    hands: 1,
    checking: 1,
    defense: 1,
    high_shots: 1,
    low_shots: 1,
    quickness: 1,
    control: 1,
    conditioning: 1,
    playerID: 1,
    leagueID: 0,
  })),
} as const

export default ({ uid }: { uid: string }) => {
  const [totalCards, setTotalCards] = useState<number>(0)
  const [totalOwnedCards, setTotalOwnedCards] = useState<number>(0)
  const { session } = useSession()
  const [showNotOwnedCards, setShowNotOwnedCards] = useState<boolean>(false)
  const [playerName, setPlayerName] = useState<string>('')
  const [teams, setTeams] = useState<string[]>([])
  const [teamLeagueID, setTeamLeagueID] = useState<{ [key: string]: string }>(
    {}
  )
  const [rarities, setRarities] = useState<string[]>([])
  const [subType, setSubType] = useState<string[]>([])
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [sortColumn, setSortColumn] = useState<OwnedCardSortValue>(
    SORT_OPTIONS[0].value
  )
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [tablePage, setTablePage] = useState<number>(1)
  const [otherUID, setOtherUID] = useState<string>('')
  const [leagueID, setLeagueID] = useState<string[]>(['0'])
  const [debouncedPlayerName] = useDebounce(playerName, 500)

  const [loggedInUID] = useCookie(config.userIDCookieName)

  const clearAllFilters = () => {
    setTeams([])
    setRarities([])
    setSubType([])
  }

  const setFilteredUID = (value: boolean) => {
    if (value) {
      setOtherUID(loggedInUID)
    } else {
      setOtherUID('')
    }
  }

  const { payload: teamData, isLoading: teamDataIsLoading } = query<Team[]>({
    queryKey: ['teamData', leagueID.join(',')],
    queryFn: () =>
      indexAxios({
        method: 'GET',
        url: `/api/v2/teams?league=${leagueID}&SeasonID=83`,
      }),
  })

  const { payload: rarityData, isLoading: rarityDataisLoading } = query<
    Rarities[]
  >({
    queryKey: ['rarityData', leagueID.join(',')],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/cards/rarity-map?leagueID=${leagueID}`,
      }),
  })

  const { payload: subTypeData, isLoading: subTypeDataIsLoading } = query<
    SubType[]
  >({
    queryKey: ['subTypeData', leagueID.join(','), JSON.stringify(rarities)],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/cards/sub-rarity-map?leagueID=${leagueID}&rarities=${JSON.stringify(
          rarities
        )}`,
      }),
  })

  const { payload: user, isLoading: userIsLoading } = query<UserData>({
    queryKey: ['collectionUser', session?.token, uid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/user/${uid}`,
      }),
  })

  const { payload, isLoading, refetch } = query<ListResponse<OwnedCard>>({
    queryKey: [
      'collection',
      uid,
      debouncedPlayerName,
      JSON.stringify(teams),
      JSON.stringify(rarities),
      JSON.stringify(subType),
      String(tablePage),
      sortColumn,
      sortDirection,
      String(showNotOwnedCards),
      otherUID,
      JSON.stringify(leagueID),
      JSON.stringify(teamLeagueID),
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid`,
        params: {
          uid,
          playerName:
            debouncedPlayerName.length >= 1 ? debouncedPlayerName : '',
          teams: JSON.stringify(teams),
          rarities: JSON.stringify(rarities),
          subType: JSON.stringify(subType),
          limit: ROWS_PER_PAGE,
          offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
          sortColumn,
          sortDirection,
          showNotOwnedCards,
          otherUID: otherUID,
          leagueID: JSON.stringify(leagueID),
          teamLeagueID: JSON.stringify(teamLeagueID),
        },
      }),
  })

  useEffect(() => {
    if (payload) {
      setTotalCards(payload.total)
      setTotalOwnedCards(payload.totalOwned)
    }
    if (subTypeData && subTypeData.length === 0 && subType.length > 0) {
      setSubType([])
    }
    refetch()
  }, [
    uid,
    playerName,
    teams,
    rarities,
    sortColumn,
    sortDirection,
    tablePage,
    showNotOwnedCards,
    otherUID,
    payload,
    subTypeData,
    subType,
  ])

  const toggleTeam = (teamKey: string) => {
    setTeams((currentValue) => toggleOnfilters(currentValue, teamKey))

    setTeamLeagueID((prev) => {
      const updated = { ...prev }
      if (updated[teamKey]) {
        delete updated[teamKey]
      } else {
        const [leagueStr, idStr] = teamKey.split('-')
        const team = teamData?.find(
          (t) => t.league === Number(leagueStr) && t.id === Number(idStr)
        )
        if (team) {
          updated[teamKey] = String(team.league)
        }
      }
      return updated
    })
  }

  const toggleRarity = (rarity: string) => {
    setRarities((currentValue) => toggleOnfilters(currentValue, rarity))
  }

  const toggleSubType = (subType: string) => {
    setSubType((currentValue) => toggleOnfilters(currentValue, subType))
  }

  return (
    <PageWrapper>
      <div className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
        {userIsLoading ? (
          <Spinner />
        ) : (
          <div>{pluralizeName(user?.username)}&nbsp;Collection</div>
        )}
      </div>
      <div className="mb-3" />
      {payload && payload.totalOwned !== null && (
        <DisplayCollection uid={uid} />
      )}
      <div className="mb-3" />
      {payload && payload.totalOwned !== null && <DisplayPacks userID={uid} />}
      <div className="mb-3" />

      <div className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl mb-6">
        Filters
      </div>

      <Accordion allowToggle defaultIndex={[0]}>
        <AccordionItem className="overflow-visible">
          <AccordionButton
            className="flex w-full items-center justify-between gap-2 md:gap-4 px-0"
            onClick={(e) => {
              if (
                !e.currentTarget.contains(e.target as Node) ||
                ((e.target as Element).closest &&
                  (e.target as Element).closest('.accordion-toggle-icon'))
              ) {
              } else {
                e.preventDefault()
              }
            }}
          >
            <div className="flex w-full items-center gap-2 md:gap-3 min-w-0">
              <div className="flex-1 min-w-0">
                <Input
                  className="w-full bg-secondary border-grey100 text-sm md:text-base"
                  placeholder="Search By Player Name"
                  size="lg"
                  onChange={(event) => setPlayerName(event.target.value)}
                />
              </div>

              <div
                className="hidden sm:flex items-center justify-end space-x-2 flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <FormLabel className="mb-0 whitespace-nowrap text-xs md:text-sm font-medium">
                  Show Unowned
                </FormLabel>
                <Switch
                  isChecked={showNotOwnedCards}
                  onChange={() => setShowNotOwnedCards(!showNotOwnedCards)}
                  size="md"
                />
              </div>
            </div>

            <AccordionIcon
              fontSize="40px"
              className="accordion-toggle-icon cursor-pointer flex-shrink-0 ml-2"
            />
          </AccordionButton>

          <div className="sm:hidden px-4 py-3 border-b border-grey100 flex items-center justify-between">
            <FormLabel className="mb-0 text-xs font-medium">
              Show Unowned
            </FormLabel>
            <Switch
              isChecked={showNotOwnedCards}
              onChange={() => setShowNotOwnedCards(!showNotOwnedCards)}
              size="md"
            />
          </div>
          {loggedInUID && loggedInUID !== uid && (
            <div className="sm:hidden px-4 py-3 border-b border-grey100 flex items-center justify-between">
              <FormLabel className="mb-0 text-xs font-medium">
                Filter Out Your Cards
              </FormLabel>
              <Switch
                onChange={(e) => setFilteredUID(e.target.checked)}
                size="md"
              />
            </div>
          )}
          <AccordionPanel pb={4} className="overflow-visible">
            <VStack spacing={4} align="stretch" className="px-4">
              <div className="flex flex-col gap-4 md:flex-row md:justify-between w-full">
                <div className="flex-[4]">
                  <FormControl>
                    <FormLabel>Sort</FormLabel>
                    <Select
                      className="cursor-pointer w-full sm:w-auto border-grey800 border-1 rounded px-2 !bg-secondary"
                      onChange={(event) => {
                        const [sortColumn, sortDirection] =
                          event.target.value.split(':') as [
                            OwnedCardSortValue,
                            SortDirection,
                          ]
                        setSortColumn(sortColumn)
                        setSortDirection(sortDirection)
                      }}
                    >
                      {SORT_OPTIONS.map((option, index) => (
                        <Fragment key={`${option.value}-${index}`}>
                          <option
                            className="!bg-secondary"
                            value={`${option.value}:DESC`}
                          >
                            {option.label}&nbsp;{option.sortLabel('DESC')}
                          </option>
                          <option
                            className="!bg-secondary"
                            value={`${option.value}:ASC`}
                          >
                            {option.label}&nbsp;{option.sortLabel('ASC')}
                          </option>
                        </Fragment>
                      ))}
                    </Select>
                  </FormControl>
                </div>
                <div className="flex-[1]">
                  <RadioGroupSelector
                    value={leagueID}
                    options={LEAGUE_OPTIONS}
                    allValues={['0', '1', '2']}
                    onChange={(value) => {
                      setLeagueID(Array.isArray(value) ? value : [value])
                      clearAllFilters()
                    }}
                  />
                </div>
              </div>
              <div className="text-sm md:text-lg">Card Filters</div>
              <div className="flex flex-col sm:flex-row justify-start gap-4 relative z-20">
                <FilterDropdown
                  label="Teams"
                  selectedValues={teams}
                  options={teamData || []}
                  isLoading={teamDataIsLoading}
                  onToggle={toggleTeam}
                  onDeselectAll={() => {
                    setTeams([])
                    setTeamLeagueID({})
                  }}
                  getOptionId={(team) => `${team.league}-${team.id}`}
                  getOptionValue={(team) => `${team.league}-${team.id}`}
                  getOptionLabel={(team) => team.name}
                />

                <FilterDropdown
                  label="Rarities"
                  selectedValues={rarities}
                  options={rarityData || []}
                  isLoading={rarityDataisLoading}
                  onToggle={toggleRarity}
                  onDeselectAll={() => setRarities([])}
                  getOptionId={(rarity) => rarity.card_rarity}
                  getOptionValue={(rarity) => rarity.card_rarity}
                  getOptionLabel={(rarity) => rarity.card_rarity}
                />

                <FilterDropdown
                  label="Sub Types"
                  selectedValues={subType}
                  options={subTypeData || []}
                  isLoading={subTypeDataIsLoading}
                  onToggle={toggleSubType}
                  onDeselectAll={() => setSubType([])}
                  getOptionId={(subType) => subType.sub_type}
                  getOptionValue={(subType) => subType.sub_type}
                  getOptionLabel={(subType) => subType.sub_type}
                />
              </div>

              {loggedInUID && loggedInUID !== uid && (
                <FormControl className="hidden sm:flex flex-row justify-between items-center bg-secondary border-2 px-4 py-3.5 rounded-lg relative z-0">
                  <FormLabel className="text-primary flex items-center !mb-0">
                    Filter Out Your Cards
                  </FormLabel>
                  <Switch
                    className="flex items-center"
                    placeholder="User ID"
                    onChange={(e) => setFilteredUID(e.target.checked)}
                    size="lg"
                  />
                </FormControl>
              )}

              {showNotOwnedCards && (
                <div className="relative z-0">
                  Owned Cards: {totalOwnedCards} / {totalCards} (
                  {((totalOwnedCards / totalCards) * 100).toFixed(2)}%)
                </div>
              )}

              <ActiveFilters
                teams={teams}
                rarities={rarities}
                subTypes={subType}
                teamData={teamData}
                rarityData={rarityData}
                subTypeData={subTypeData}
                onToggleTeam={toggleTeam}
                onToggleRarity={toggleRarity}
                onToggleSubType={toggleSubType}
                onClearAll={clearAllFilters}
              />
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>

      <SimpleGrid
        columns={{ base: 2, sm: 3, md: 4, lg: 6 }}
        spacing={4}
        className="mt-6 px-4 relative z-0"
      >
        {isLoading
          ? LOADING_GRID_DATA.rows.map((_, index) => (
              <div
                key={`loading-${index}`}
                className="m-4 flex flex-col relative max-w-xs sm:max-w-sm z-0"
              >
                <div className="relative aspect-[3/4]">
                  <ImageWithFallback
                    src="/cardback.png"
                    alt="Loading card"
                    priority
                    fill
                    sizes="(max-width: 768px) 100vw, 256px"
                    style={{
                      objectFit: 'contain',
                      width: '100%',
                      height: '100%',
                    }}
                  />
                </div>
                <div className="mt-2">
                  <Progress size="xs" isIndeterminate />
                </div>
              </div>
            ))
          : payload?.rows.map((card, index) => (
              <div
                key={`${card.cardID}-${index}`}
                onClick={() => {
                  setSelectedCard(card)
                  setLightBoxIsOpen(true)
                }}
                className="m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl max-w-xs sm:max-w-sm aspect-[3/4]"
              >
                <ImageWithFallback
                  className={`cursor-pointer ${
                    card.quantity === 0 ? 'grayscale' : ''
                  }`}
                  src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                  alt={`${card.player_name} Card`}
                  loading="lazy"
                  fill
                  sizes="(max-width: 768px) 100vw, 256px"
                  style={{
                    objectFit: 'contain',
                    width: '100%',
                    height: '100%',
                  }}
                />
                <Badge className="z-30 absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform -translate-x-1/4 -translate-y-3/4 bg-neutral-800 rounded-full">
                  {`${card.card_rarity} - ${card.quantity}`}
                </Badge>
                {lightBoxIsOpen && (
                  <CardLightBoxModal
                    cardName={selectedCard.player_name}
                    cardImage={selectedCard.image_url}
                    owned={selectedCard.quantity}
                    rarity={selectedCard.card_rarity}
                    playerID={selectedCard.playerID}
                    leagueID={selectedCard.leagueID}
                    cardID={selectedCard.cardID}
                    userID={uid}
                    setShowModal={() => setLightBoxIsOpen(false)}
                  />
                )}
              </div>
            ))}
      </SimpleGrid>
      <TablePagination
        totalRows={payload?.total}
        rowsPerPage={ROWS_PER_PAGE}
        onPageChange={(newPage) => setTablePage(newPage)}
      />
    </PageWrapper>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const { uid } = query

  return {
    props: {
      uid,
    },
  }
}
