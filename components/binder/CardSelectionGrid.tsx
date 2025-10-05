import React, { Fragment, useState } from 'react'
import {
  SimpleGrid,
  Box,
  Badge,
  Input,
  Select,
  Flex,
  useBreakpointValue,
  FormControl,
  Progress,
} from '@chakra-ui/react'
import {
  binderCards,
  ListResponse,
  SortDirection,
  SubType,
} from '@pages/api/v3'
import axios from 'axios'
import { query, indexAxios } from '@pages/api/database/query'
import { GET } from '@constants/http-methods'
import {
  TradeCard,
  TradeCardSortOption,
  TradeCardSortValue,
} from '@pages/api/v3/trades/collection/[uid]'
import config from 'lib/config'
import TablePagination from '@components/table/TablePagination'
import { useCookie } from '@hooks/useCookie'
import { toggleOnfilters } from '@utils/toggle-on-filters'
import { useDebounce } from 'use-debounce'
import ImageWithFallback from '@components/images/ImageWithFallback'
import { Team, Rarities } from '@pages/api/v3'
import FilterDropdown from '@components/common/FilterDropdown'
import RadioGroupSelector from '@components/common/RadioGroupSelector'
import { LEAGUE_OPTIONS } from 'lib/constants'

interface CardSelectionGridProps {
  handleCardSelect: (card: TradeCard) => void
  displayCards: binderCards[]
}

const SORT_OPTIONS: TradeCardSortOption[] = [
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
] as const

const CardSelectionGrid: React.FC<CardSelectionGridProps> = React.memo(
  ({ handleCardSelect, displayCards }) => {
    const [playerName, setPlayerName] = useState<string>('')
    const [teams, setTeams] = useState<string[]>([])
    const [rarities, setRarities] = useState<string[]>([])
    const [leagueID, setLeagueID] = useState<string>('0')
    const [sortColumn, setSortColumn] = useState<TradeCardSortValue>(
      SORT_OPTIONS[0].value
    )
    const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
    const [tablePage, setTablePage] = useState<number>(1)
    const [uid] = useCookie(config.userIDCookieName)
    const [subType, setSubType] = useState<string[]>([])
    const [debouncedPlayerName] = useDebounce(playerName, 500)

    const ROWS_PER_PAGE =
      useBreakpointValue({
        base: 4,
        md: 5,
      }) || 5
    const LOADING_GRID_DATA: { rows: TradeCard[] } = {
      rows: Array.from({ length: ROWS_PER_PAGE }, (_, index) => ({
        cardID: index,
        ownedCardID: 1,
        teamName: 'name',
        teamNickName: 'nickName',
        teamID: 1,
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
        playerID: 0,
        total: 0,
      })),
    } as const

    const {
      payload: selectedUserCards,
      isLoading: selectedUserCardsIsLoading,
    } = query<ListResponse<TradeCard>>({
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
        leagueID,
      ],
      queryFn: () =>
        axios({
          url: `/api/v3/trades/collection/${uid}`,
          method: GET,
          params: {
            playerName:
              debouncedPlayerName.length >= 1 ? debouncedPlayerName : '',
            teams: JSON.stringify(teams),
            rarities: JSON.stringify(rarities),
            subType: JSON.stringify(subType),
            limit: ROWS_PER_PAGE,
            offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
            sortColumn,
            sortDirection,
            leagueID,
          },
        }),
      enabled: !!uid,
    })

    const { payload: teamData, isLoading: teamDataIsLoading } = query<Team[]>({
      queryKey: ['teamData', leagueID],
      queryFn: () =>
        indexAxios({
          method: 'GET',
          url: `/api/v1/teams?league=${leagueID}`,
        }),
    })

    const { payload: rarityData, isLoading: rarityDataisLoading } = query<
      Rarities[]
    >({
      queryKey: ['rarityData', leagueID],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/cards/rarity-map?leagueID=${leagueID}`,
        }),
    })

    const { payload: subTypeData, isLoading: subTypeDataIsLoading } = query<
      SubType[]
    >({
      queryKey: ['subTypeData', leagueID, JSON.stringify(rarities)],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/cards/sub-rarity-map?leagueID=${leagueID}&rarities=${JSON.stringify(
            rarities
          )}`,
        }),
    })

    const toggleTeam = (team: string) => {
      setTeams((currentValue) => toggleOnfilters(currentValue, team))
    }

    const toggleRarity = (rarity: string) => {
      setRarities((currentValue) => toggleOnfilters(currentValue, rarity))
    }

    const toggleSubType = (subType: string) => {
      setSubType((currentValue) => toggleOnfilters(currentValue, subType))
    }

    return (
      <>
        <Flex direction="column" mb={4}>
          <FormControl mb={2}>
            <Input
              placeholder="Player Name Search"
              onChange={(e) => {
                // Reset page when searching
                setTablePage(1)
                setPlayerName(e.target.value)
              }}
              className="w-full !bg-secondary"
            />
          </FormControl>
          <RadioGroupSelector
            value={leagueID}
            options={LEAGUE_OPTIONS}
            onChange={(value) => {
              setLeagueID(value)
              setTeams([])
              setRarities([])
            }}
          />
          <Flex
            mb={4}
            mt={4}
            justifyContent="space-between"
            alignItems="center"
          >
            <Box flex={1} mr={2}>
              <FilterDropdown<Team>
                label="Teams"
                selectedValues={teams}
                options={teamData || []}
                isLoading={teamDataIsLoading}
                onToggle={toggleTeam}
                onDeselectAll={() => setTeams([])}
                getOptionId={(team) => String(team.id)}
                getOptionValue={(team) => String(team.id)}
                getOptionLabel={(team) => team.name}
              />
            </Box>
            <Box flex={1} mr={2}>
              <FilterDropdown<Rarities>
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
            </Box>

            <Box flex={{ base: '1 1 100%', sm: 1 }} className="w-full">
              <FilterDropdown<SubType>
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
            </Box>
          </Flex>
          <Box flex={1} mr={2} className="p-2">
            <Select
              className="w-full !bg-secondary hover:!bg-highlighted/40"
              onChange={(event) => {
                setTablePage(1)
                const [sortColumn, sortDirection] = event.target.value.split(
                  ':'
                ) as [TradeCardSortValue, SortDirection]
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
          </Box>
        </Flex>
        <SimpleGrid
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 bg-primary"
          columns={{ base: 2, lg: 5 }}
        >
          {selectedUserCardsIsLoading
            ? LOADING_GRID_DATA.rows.map((_, index) => (
                <div
                  key={`loading-${index}`}
                  className="m-4 flex flex-col relative max-w-xs sm:max-w-sm"
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
            : selectedUserCards?.rows.map((card, index) => {
                const isInDisplayCards = displayCards.some(
                  (displayCard) =>
                    displayCard?.ownedCardID === card?.ownedCardID
                )

                return (
                  <div
                    tabIndex={0}
                    role="button"
                    key={`${card.cardID}-${index}`}
                    className={`m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl max-w-xs sm:max-w-sm aspect-[3/4] ${
                      isInDisplayCards
                        ? 'grayscale cursor-default'
                        : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isInDisplayCards) {
                        handleCardSelect(card)
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        handleCardSelect(card)
                      }
                    }}
                  >
                    <ImageWithFallback
                      className={`cursor-pointer`}
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
                    <Badge className="z-30 absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary transform -translate-x-1/4 -translate-y-3/4 bg-neutral-800 rounded-full">
                      {card.card_rarity}
                    </Badge>
                  </div>
                )
              })}
        </SimpleGrid>
        <TablePagination
          totalRows={selectedUserCards?.total}
          rowsPerPage={ROWS_PER_PAGE}
          onPageChange={(newPage) => setTablePage(newPage)}
        />
      </>
    )
  }
)

export default CardSelectionGrid
