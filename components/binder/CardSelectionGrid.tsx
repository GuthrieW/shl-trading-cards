import React, { Fragment, useEffect, useState } from 'react'
import {
  SimpleGrid,
  Box,
  Image,
  Badge,
  Input,
  Select,
  Flex,
  Skeleton,
  Button,
  useBreakpointValue,
  FormControl,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from '@chakra-ui/react'
import { binderCards, ListResponse, SortDirection } from '@pages/api/v3'
import { useSession } from 'contexts/AuthContext'
import axios from 'axios'
import { query } from '@pages/api/database/query'
import { GET } from '@constants/http-methods'
import {
  TradeCard,
  TradeCardSortOption,
  TradeCardSortValue,
} from '@pages/api/v3/trades/collection/[uid]'
import config from 'lib/config'
import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons'
import TablePagination from '@components/table/TablePagination'
import rarityMap from '@constants/rarity-map'
import { allTeamsMaps } from '@constants/teams-map'
import filterTeamsByLeague from '@utils/filterTeamsByLeague'
import { useCookie } from '@hooks/useCookie'

interface CardSelectionGridProps {
  handleCardSelect: (card: binderCards) => void
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
    const [leagues, setLeague] = useState<string[]>([])
    const [sortColumn, setSortColumn] = useState<TradeCardSortValue>(
      SORT_OPTIONS[0].value
    )
    const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
    const [tablePage, setTablePage] = useState<number>(1)
    const [uid] = useCookie(config.userIDCookieName)

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
      })),
    } as const

    const {
      payload: selectedUserCards,
      isLoading: selectedUserCardsIsLoading,
    } = query<ListResponse<TradeCard>>({
      queryKey: [
        'collection',
        uid,
        playerName,
        JSON.stringify(teams),
        JSON.stringify(rarities),
        JSON.stringify(leagues),
        String(tablePage),
        sortColumn,
        sortDirection,
      ],
      queryFn: () =>
        axios({
          url: `/api/v3/trades/collection/${uid}`,
          method: GET,
          params: {
            playerName,
            teams: JSON.stringify(teams),
            rarities: JSON.stringify(rarities),
            leagues: JSON.stringify(leagues),
            limit: ROWS_PER_PAGE,
            offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
            sortColumn,
            sortDirection,
          },
        }),
      enabled: !!uid,
    })

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
          <Flex justifyContent="space-between" alignItems="center">
            <Box flex={1} mr={2}>
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  className="w-full !bg-secondary !text-secondary text-center hover:!bg-blue600"
                >
                  Teams ({teams.length})
                </MenuButton>
                <MenuList>
                  <MenuOptionGroup type="checkbox">
                    <MenuItemOption
                      icon={null}
                      isChecked={false}
                      aria-checked={false}
                      closeOnSelect
                      className="!bg-secondary hover:!bg-blue600"
                      onClick={() => {
                        setTablePage(1)
                        setTeams([])
                      }}
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
                            onClick={() => {
                              setTablePage(1)
                              toggleTeam(String(value.teamID))
                            }}
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
            </Box>
            <Box flex={1} mr={2}>
              <Menu closeOnSelect={false}>
                <MenuButton
                  as={Button}
                  rightIcon={<ChevronDownIcon />}
                  className="w-full !bg-secondary !text-secondary text-center hover:!bg-blue600"
                >
                  Rarity ({rarities.length})
                </MenuButton>
                <MenuList>
                  <MenuOptionGroup type="checkbox">
                    <MenuItemOption
                      icon={null}
                      isChecked={false}
                      aria-checked={false}
                      closeOnSelect
                      className="!bg-secondary hover:!bg-blue600"
                      onClick={() => {
                        setTablePage(1)
                        setRarities([])
                      }}
                    >
                      Deselect All
                    </MenuItemOption>
                    {Object.entries(rarityMap).map(([key, value]) => {
                      const isChecked: boolean = rarities.includes(value.value)

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
                          onClick={() => {
                            if (!isDisabled) {
                              setTablePage(1)
                              toggleRarity(value.value)
                            }
                          }}
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
            </Box>
          </Flex>
          <Box flex={1} mr={2} className="p-2">
            <Select
              className="w-full !bg-secondary hover:!bg-blue600"
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
          {(selectedUserCardsIsLoading
                ? LOADING_GRID_DATA
                : selectedUserCards
              )?.rows.map((card, index) => {
                const isInDisplayCards = displayCards.some(
                  (displayCard) =>
                    displayCard?.ownedCardID === card?.ownedCardID
                )

                return (
                  <div
                    key={`${card.cardID}-${index}`}
                    className={`m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl ${
                      isInDisplayCards
                        ? 'grayscale cursor-default'
                        : 'cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isInDisplayCards) {
                        handleCardSelect(card)
                      }
                    }}
                  >
                    <Image
                      className={`cursor-pointer`}
                      src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                      fallback={
                        <div className="relative z-10">
                          <Image src="/cardback.png" />
                          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                        </div>
                      }
                      alt={`${card.player_name} Card`}
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
