import { CheckIcon } from '@chakra-ui/icons'
import {
  Avatar,
  Badge,
  FormControl,
  FormLabel,
  Image,
  Input,
  Menu,
  MenuButton,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Select,
  SimpleGrid,
  Switch,
} from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import TablePagination from '@components/table/TablePagination'
import { GET } from '@constants/http-methods'
import rarityMap from '@constants/rarity-map'
import { shlTeamsMap } from '@constants/teams-map'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import { OwnedCard } from '@pages/api/v3/collection/[uid]'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

type SortValue = keyof Card
type SortOption = { value: SortValue; label: string }

const SORT_OPTIONS: SortOption[] = [
  { value: 'overall', label: 'Overall' },
  { value: 'player_name', label: 'Player Name' },
  { value: 'teamID', label: 'Team Name' },
] as const

const ROWS_PER_PAGE: number = 12 as const

const LOADING_GRID_DATA: { rows: OwnedCard[] } = {
  rows: Array.from({ length: ROWS_PER_PAGE }, (_, index) => ({
    quantity: 1,
    cardID: index,
    Name: 'name',
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
  })),
} as const

export default () => {
  const router = useRouter()
  const { session } = useSession()
  const [showNotOwnedCards, setShowNotOwnedCards] = useState<boolean>(false)
  const [playerName, setPlayerName] = useState<string>('')
  const [teams, setTeams] = useState<string[]>([])
  const [rarities, setRarities] = useState<string[]>([])

  const [sortColumn, setSortColumn] = useState<SortValue>(SORT_OPTIONS[0].value)
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [tablePage, setTablePage] = useState<number>(1)

  const uid = router.query.uid as string

  const { payload: user } = query<UserData>({
    queryKey: ['collectionUser', session?.token],
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
      playerName,
      JSON.stringify(teams),
      JSON.stringify(rarities),
      String(tablePage),
      sortColumn,
      sortDirection,
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/${uid}`,
        params: {
          playerName,
          teams: JSON.stringify(teams),
          rarities: JSON.stringify(rarities),
          limit: ROWS_PER_PAGE,
          offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
          sortColumn,
          sortDirection,
          showNotOwnedCards,
        },
      }),
  })

  useEffect(() => {
    refetch()
  }, [uid, playerName, teams, rarities, sortColumn, sortDirection, tablePage])

  const toggleTeam = (team: string) => {
    setTeams((currentValue) => {
      const teamIndex: number = currentValue.indexOf(team)
      teamIndex === -1
        ? currentValue.push(team)
        : currentValue.splice(teamIndex)
      return [...currentValue]
    })
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
    <PageWrapper>
      <span>
        {user?.username}
        {user?.username.endsWith('s') ? "'" : "'s"}&nbsp;Collection
      </span>
      {/* <div className="flex h-full items-center space-x-1">
        <span className="hidden sm:inline">
          Collection Owner: {user?.username}
        </span>
        <Avatar size="sm" name={user?.username} src={user?.avatar} />
      </div> */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-start items-end">
          <FormControl className="mx-2 w-auto">
            <FormLabel>Player Name</FormLabel>
            <Input
              className="min-w-80"
              onChange={(event) => setPlayerName(event.target.value)}
            />
          </FormControl>
          <FormControl className="mx-2 w-auto cursor-pointer">
            <Menu closeOnSelect={false}>
              <MenuButton className="border border-1 rounded p-1.5 cursor-pointer">
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
                  {Object.entries(shlTeamsMap).map(([key, value]) => {
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
                  })}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </FormControl>
          <FormControl className="border border-1 rounded mx-2 w-auto flex flex-row items-center">
            <Menu closeOnSelect={false}>
              <MenuButton className="p-1.5">
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
                    const isChecked: boolean = rarities.includes(value.value)
                    return (
                      <MenuItemOption
                        icon={null}
                        isChecked={isChecked}
                        aria-checked={isChecked}
                        key={value.value}
                        value={value.value}
                        onClick={() => toggleRarity(value.value)}
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
          <FormControl className="m-2 flex flex-row justify-start items-center">
            <FormLabel className="flex items-center">
              Show Unowned Cards
            </FormLabel>
            <Switch
              disabled={true}
              className="flex items-center"
              onChange={() => setShowNotOwnedCards(!showNotOwnedCards)}
            />
          </FormControl>
        </div>
        <div>
          <FormControl className="mx-2">
            <FormLabel>Sort</FormLabel>
            <Select
              className="cursor-pointer"
              onChange={(event) => {
                const [sortColumn, sortDirection] = event.target.value.split(
                  ':'
                ) as [SortValue, SortDirection]
                setSortColumn(sortColumn)
                setSortDirection(sortDirection)
              }}
            >
              {SORT_OPTIONS.map((option, index) => (
                <Fragment key={`${option.value}-${index}`}>
                  <option value={`${option.value}:DESC`}>
                    {option.label} {'(Descending)'}
                  </option>
                  <option value={`${option.value}:ASC`}>
                    {option.label} {'(Ascending)'}
                  </option>
                </Fragment>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>
      <SimpleGrid columns={{ sm: 2, md: 3, lg: 6 }}>
        {(isLoading ? LOADING_GRID_DATA : payload)?.rows.map((card, index) => (
          <div
            key={`${card.cardID}-${index}`}
            className="m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
          >
            <Image
              src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
              fallback={
                <div className="relative z-10">
                  <Image src="/images/cardback.png" />
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                </div>
              }
            />
            {!isLoading && (
              <Badge className="z-30 absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform -translate-x-1/4 -translate-y-3/4 bg-neutral-800 rounded-full">
                {`${card.card_rarity} - ${card.quantity}`}
              </Badge>
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
