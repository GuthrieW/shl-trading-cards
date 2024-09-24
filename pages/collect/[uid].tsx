import { CheckIcon } from '@chakra-ui/icons'
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
  Spinner,
  Switch,
  Text,
  VStack,
} from '@chakra-ui/react'
import DisplayCollection from '@components/collection/DisplayCollection'
import { PageWrapper } from '@components/common/PageWrapper'
import CardLightBoxModal from '@components/modals/card-lightbox-modal'
import TablePagination from '@components/table/TablePagination'
import { GET } from '@constants/http-methods'
import rarityMap from '@constants/rarity-map'
import { shlTeamsMap } from '@constants/teams-map'
import { query } from '@pages/api/database/query'
import {
  ListResponse,
  SiteUniqueCards,
  SortDirection,
  UserUniqueCollection,
} from '@pages/api/v3'
import {
  OwnedCard,
  OwnedCardSortOption,
  OwnedCardSortValue,
} from '@pages/api/v3/collection/uid'
import { UserData } from '@pages/api/v3/user'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { pluralizeName } from 'lib/pluralize-name'
import { useRouter } from 'next/router'
import { Fragment, useEffect, useState } from 'react'
import DisplayPacks from '@components/collection/DisplayPacks'

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
  })),
} as const

export default () => {
  const router = useRouter()
  const [totalCards, setTotalCards] = useState<number>(0)
  const [totalOwnedCards, setTotalOwnedCards] = useState<number>(0)
  const { session } = useSession()
  const [showNotOwnedCards, setShowNotOwnedCards] = useState<boolean>(false)
  const [playerName, setPlayerName] = useState<string>('')
  const [teams, setTeams] = useState<string[]>([])
  const [rarities, setRarities] = useState<string[]>([])
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<CollectionCard | null>(null)
  const [sortColumn, setSortColumn] = useState<OwnedCardSortValue>(
    SORT_OPTIONS[0].value
  )
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [tablePage, setTablePage] = useState<number>(1)

  const uid = router.query.uid as string

  const { payload: user, isLoading: userIsLoading } = query<UserData>({
    queryKey: ['collectionUser', session?.token],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/user/${uid}`,
      }),
  })

  const { payload: userUniqueCards, isLoading: userUniqueCardsIsLoading } =
    query<UserUniqueCollection[]>({
      queryKey: ['user-unique-cards', uid],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/collection/uid/user-unique-cards?userID=${uid}`,
        }),
    })

  const { payload: siteUniqueCards, isLoading: siteUniqueCardsIsLoading } =
    query<SiteUniqueCards[]>({
      queryKey: ['unique-cards'],
      queryFn: () =>
        axios({
          method: GET,
          url: `/api/v3/collection/unique-cards`,
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
      String(showNotOwnedCards),
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid?uid=${uid}`,
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
    if (payload) {
      setTotalCards(payload.total)
      setTotalOwnedCards(payload.totalOwned)
    }
  }, [payload])

  useEffect(() => {
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
  ])

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
  const getActiveFilters = () => {
    const activeFilters = []
    if (teams.length > 0) {
      activeFilters.push(
        `Teams: ${teams.map((id) => shlTeamsMap[id].label).join(', ')}`
      )
    }
    if (rarities.length > 0) {
      activeFilters.push(
        `Rarities: ${rarities.map((r) => rarityMap[r]?.label || r).join(', ')}`
      )
    }
    return activeFilters.join(' | ')
  }

  console.log(payload)

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
        <DisplayCollection
          siteUniqueCards={siteUniqueCards}
          userUniqueCards={userUniqueCards}
          isLoading={userUniqueCardsIsLoading || siteUniqueCardsIsLoading}
        />
      )}
      <div className="mb-3" />
      {payload && payload.totalOwned !== null && (
      <DisplayPacks userID={uid} />
      )}
      <div className="mb-3" />

      <div className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl mb-6">
        Filters
      </div>
      <VStack spacing={4} align="stretch" className="px-4">
        <FormControl>
          <Input
            className="w-full bg-secondary border-grey100"
            placeholder="Search By Player Name"
            size="lg"
            onChange={(event) => setPlayerName(event.target.value)}
          />
        </FormControl>
        <div className="flex flex-col sm:flex-row justify-start items-stretch gap-4">
          <FormControl className="w-full sm:w-auto">
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
          <FormControl className="w-full sm:w-auto">
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
        </div>
        <FormControl className="flex flex-row justify-start items-center">
          <FormLabel className="flex items-center mr-4">
            Show Unowned Cards
          </FormLabel>
          <Switch
            className="flex items-center"
            onChange={() => setShowNotOwnedCards(!showNotOwnedCards)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Sort</FormLabel>
          <Select
            className="cursor-pointer w-full sm:w-auto border-grey800 border-1 rounded px-2 !bg-secondary"
            onChange={(event) => {
              const [sortColumn, sortDirection] = event.target.value.split(
                ':'
              ) as [OwnedCardSortValue, SortDirection]
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
                <option className="!bg-secondary" value={`${option.value}:ASC`}>
                  {option.label}&nbsp;{option.sortLabel('ASC')}
                </option>
              </Fragment>
            ))}
          </Select>
        </FormControl>
      </VStack>

      {showNotOwnedCards && (
        <div>
          Owned Cards: {totalOwnedCards} / {totalCards} (
          {((totalOwnedCards / totalCards) * 100).toFixed(2)}%)
        </div>
      )}
      {getActiveFilters() && (
        <div className="text-sm">Active Filters: {getActiveFilters()}</div>
      )}

      <SimpleGrid
        columns={{ base: 2, sm: 3, md: 4, lg: 6 }}
        spacing={4}
        className="mt-6 px-4"
      >
        {(isLoading ? LOADING_GRID_DATA : payload)?.rows.map((card, index) => (
          <div
            key={`${card.cardID}-${index}`}
            onClick={() => {
              setSelectedCard(card)
              setLightBoxIsOpen(true)
            }}
            className="m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
          >
            <Image
              className={`cursor-pointer ${
                card.quantity === 0 ? 'grayscale' : ''
              }`}
              src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
              fallback={
                <div className="relative z-10">
                  <Image src="/cardback.png" />
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                </div>
              }
            />
            {!isLoading && (
              <Badge className="z-30 absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform -translate-x-1/4 -translate-y-3/4 bg-neutral-800 rounded-full">
                {`${card.card_rarity} - ${card.quantity}`}
              </Badge>
            )}
            {lightBoxIsOpen && (
              <CardLightBoxModal
                cardName={selectedCard.player_name}
                cardImage={selectedCard.image_url}
                owned={selectedCard.quantity}
                playerID={selectedCard.playerID}
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
