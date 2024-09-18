import {
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
} from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import TablePagination from '@components/table/TablePagination'
import { GET } from '@constants/http-methods'
import rarityMap from '@constants/rarity-map'
import { shlTeamsMap } from '@constants/teams-map'
import { useCookie } from '@hooks/useCookie'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import { OwnedCard } from '@pages/api/v3/collection/[uid]'
import axios from 'axios'
import config from 'lib/config'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'

type SortValue = keyof Card
type SortOption = { value: SortValue; label: string }

const SORT_OPTIONS: SortOption[] = [
  { value: 'overall', label: 'Overall' },
  { value: 'player_name', label: 'Player Name' },
  { value: 'teamID', label: 'Team Name' },
] as const

const ROWS_PER_PAGE: number = 15 as const

const LOADING_GRID_DATA: { rows: {}[] } = { rows: [] }

export default () => {
  const router = useRouter()
  const [playerName, setPlayerName] = useState<string>('')
  const [teams, setTeams] = useState<string[]>([])
  const [rarities, setRarities] = useState<string[]>([])

  const [sortColumn, setSortColumn] = useState<SortValue>(SORT_OPTIONS[0].value)
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [tablePage, setTablePage] = useState<number>(1)

  const [loggedInUid] = useCookie(config.userIDCookieName)
  const uid = router.query.uid as string
  console.log('uid', uid)

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
          offset: (tablePage - 1) * ROWS_PER_PAGE,
          sortColumn,
          sortDirection,
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
      {uid && loggedInUid && loggedInUid === uid ? (
        <p>My Collection</p>
      ) : (
        <p>{uid}'s Collection</p>
      )}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row justify-start items-end w-1/2">
          <FormControl className="mx-2 w-auto">
            <FormLabel>Player Name</FormLabel>
            <Input onChange={(event) => setPlayerName(event.target.value)} />
          </FormControl>
          <FormControl className="mx-2 w-auto">
            <Menu closeOnSelect={false}>
              <MenuButton className="border border-1 rounded p-1.5">
                Teams&nbsp;{`(${teams.length})`}
              </MenuButton>
              <MenuList>
                <MenuOptionGroup type="checkbox">
                  {Object.entries(shlTeamsMap).map(([key, value]) => (
                    <MenuItemOption
                      isChecked={teams.includes(String(value.teamID))}
                      key={value.teamID}
                      value={String(value.teamID)}
                      onClick={() => toggleTeam(String(value.teamID))}
                    >
                      {value.label}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </FormControl>
          <FormControl className="mx-2 w-auto">
            <Menu closeOnSelect={false}>
              <MenuButton className="border border-1 rounded p-1.5">
                Rarities&nbsp;{`(${rarities.length})`}
              </MenuButton>
              <MenuList>
                <MenuOptionGroup type="checkbox">
                  {Object.entries(rarityMap).map(([key, value]) => (
                    <MenuItemOption
                      isChecked={rarities.includes(value.value)}
                      key={value.value}
                      value={value.value}
                      onClick={() => toggleRarity(value.value)}
                    >
                      {value.label}
                    </MenuItemOption>
                  ))}
                </MenuOptionGroup>
              </MenuList>
            </Menu>
          </FormControl>
        </div>

        <div>
          <FormControl className="mx-2">
            <FormLabel>Sort:</FormLabel>
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
                  <option value={`${option.value}:ASC}`}>
                    {option.label} {'(Ascending)'}
                  </option>
                </Fragment>
              ))}
            </Select>
          </FormControl>
        </div>
      </div>

      <SimpleGrid columns={{ sm: 2, md: 3, lg: 5 }}>
        {payload?.rows.map((card, index) => (
          <div
            key={`${card.cardID}-${index}`}
            className="m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
          >
            <Image
              src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
            />
            <Badge className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 sm:translate-x-1/2 -translate-y-1/2 bg-neutral-800 rounded-full">
              {card.quantity}
            </Badge>
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
