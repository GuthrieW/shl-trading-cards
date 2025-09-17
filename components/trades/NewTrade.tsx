import {
  Badge,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  Image,
  Input,
  Select,
  SimpleGrid,
  useDisclosure,
  useBreakpointValue,
  useToast,
  Flex,
  Box,
  Divider,
  VStack,
  Stack,
  FormLabel,
  Switch,
  Progress,
  HStack,
} from '@chakra-ui/react'
import TablePagination from '@components/table/TablePagination'
import { GET, POST } from '@constants/http-methods'
import { useCookie } from '@hooks/useCookie'
import { mutation } from '@pages/api/database/mutation'
import { query, indexAxios } from '@pages/api/database/query'
import { TradeAsset } from '@pages/api/mutations/use-create-trade'
import { ListResponse, SortDirection } from '@pages/api/v3'
import {
  TradeCard,
  TradeCardSortOption,
  TradeCardSortValue,
} from '@pages/api/v3/trades/collection/[uid]'
import { UserData } from '@pages/api/v3/user'
import {
  errorToastOptions,
  successToastOptions,
  warningToastOptions,
} from '@utils/toast'
import axios from 'axios'
import config from 'lib/config'
import { pluralizeName } from 'lib/pluralize-name'
import { useRouter } from 'next/router'
import React from 'react'
import { Fragment, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'
import RemoveButton from './RemoveButton'
import { useDebounce } from 'use-debounce'
import ImageWithFallback from '@components/images/ImageWithFallback'
import { Team, Rarities } from '@pages/api/v3'
import FilterDropdown from '@components/common/FilterDropdown'
import RadioGroupSelector from '@components/common/RadioGroupSelector'
import { LEAGUE_OPTIONS } from 'lib/constants'

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

export default function NewTrade({
  loggedInUser,
  tradePartnerUid,
  cardID,
  resetTradeCards,
  setResetTradeCards,
}: {
  loggedInUser: UserData
  tradePartnerUid: string
  cardID?: number
  resetTradeCards: boolean
  setResetTradeCards: (value: boolean) => void
}) {
  const toast = useToast()
  const queryClient = useQueryClient()
  const router = useRouter()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedUserId, setSelectedUserId] = useState<string>('')
  const [playerName, setPlayerName] = useState<string>('')
  const [teams, setTeams] = useState<string[]>([])
  const [rarities, setRarities] = useState<string[]>([])
  const [sortColumn, setSortColumn] = useState<TradeCardSortValue>(
    SORT_OPTIONS[0].value
  )
  const [sortDirection, setSortDirection] = useState<SortDirection>('DESC')
  const [tablePage, setTablePage] = useState<number>(1)
  const [loggedInUserCardsToTrade, setloggedInUserCardsToTrade] = useState<
    TradeCard[]
  >([])
  const [partnerUserCardsToTrade, setPartnerUserCardsToTrade] = useState<
    TradeCard[]
  >([])
  const [cardAdded, setCardAdded] = useState(false)
  const [otherUID, setOtherUID] = useState<string>('')
  const [removeSingles, setRemoveSingles] = useState<boolean>(false)
  const [debouncedPlayerName] = useDebounce(playerName, 500)
  const [leagueID, setLeagueID] = useState<string>('0')

  const [uid] = useCookie(config.userIDCookieName)

  useEffect(() => {
    if (resetTradeCards) {
      setloggedInUserCardsToTrade([])
      setPartnerUserCardsToTrade([])
      setResetTradeCards(false)
      setOtherUID('')
    }
  }, [resetTradeCards, setResetTradeCards])

  const ROWS_PER_PAGE =
    useBreakpointValue({
      base: 4,
      md: 5,
    }) || 5

  const isMobile = useBreakpointValue({ base: true, md: false })

  const LOADING_GRID_DATA: { rows: TradeCard[] } = {
    rows: Array.from({ length: ROWS_PER_PAGE }, (_, index) => ({
      cardID: index,
      ownedCardID: 1,
      teamID: 1,
      player_name: 'player_name',
      card_rarity: 'Bronze',
      image_url: 'image_url',
      overall: 1,
      total: 0,
    })),
  } as const

  if (tradePartnerUid === uid) {
    toast({
      title: 'Ineligible Trade Partner',
      description: 'You cannot trade with yourself',
      ...warningToastOptions,
    })
    router.replace('/trade')
    return
  }

  const { payload: tradePartnerUser } = query<UserData>({
    queryKey: ['user', tradePartnerUid],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/user/${tradePartnerUid}`,
      }),
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

  const { payload: selectedUserCards, isLoading: selectedUserCardsIsLoading } =
    query<ListResponse<TradeCard>>({
      queryKey: [
        'collection',
        selectedUserId,
        debouncedPlayerName,
        JSON.stringify(teams),
        JSON.stringify(rarities),
        String(tablePage),
        sortColumn,
        sortDirection,
        otherUID,
        String(removeSingles),
        leagueID,
      ],
      queryFn: () =>
        axios({
          url: `/api/v3/trades/collection/${selectedUserId}`,
          method: GET,
          params: {
            playerName:
              debouncedPlayerName.length >= 1 ? debouncedPlayerName : '',
            teams: JSON.stringify(teams),
            rarities: JSON.stringify(rarities),
            limit: ROWS_PER_PAGE,
            offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
            sortColumn,
            sortDirection,
            otherUID: otherUID,
            removeSingles: removeSingles,
            leagueID,
          },
        }),
      enabled: !!selectedUserId,
    })
  const { payload: showSelectedCard, isLoading: showSelectedCardLoading } =
    query<ListResponse<TradeCard>>({
      queryKey: ['check-card', tradePartnerUid, String(cardID)],
      queryFn: () =>
        axios({
          method: 'GET',
          url: `/api/v3/trades/collection/check-card?uid=${tradePartnerUid}&cardID=${cardID}`,
        }),
      enabled: !!tradePartnerUid && !!cardID,
    })
  useEffect(() => {
    if (!showSelectedCardLoading && showSelectedCard && !cardAdded) {
      if (showSelectedCard.rows.length > 0) {
        const cardToAdd = showSelectedCard.rows[0]
        addCardToTrade(cardToAdd, false)
        setCardAdded(true)
      } else {
        toast({
          title: 'Card Not Found',
          description:
            'The specified card could not be found in the collection.',
          status: 'warning',
        })
      }
    }
  }, [
    showSelectedCard,
    showSelectedCardLoading,
    loggedInUser.uid,
    tradePartnerUid,
    cardAdded,
  ])

  const { mutateAsync: submitTrade, isLoading: isSubmittingTrade } = mutation<
    void,
    { initiatorId: string; recipientId: string; tradeAssets: TradeAsset[] }
  >({
    mutationFn: ({ initiatorId, recipientId, tradeAssets }) =>
      axios({
        method: POST,
        url: '/api/v3/trades',
        data: { initiatorId, recipientId, tradeAssets },
      }),
  })

  const toggleTeam = (team: string) => {
    setTeams((currentValue) => {
      const teamIndex: number = currentValue.indexOf(team)
      if (teamIndex === -1) {
        return [...currentValue, team]
      } else {
        return [
          ...currentValue.slice(0, teamIndex),
          ...currentValue.slice(teamIndex + 1),
        ]
      }
    })
  }

  const setFilteredUID = (value: boolean) => {
    if (value) {
      if (String(selectedUser?.uid) === uid) {
        setOtherUID(tradePartnerUid)
      } else {
        setOtherUID(uid)
      }
    } else {
      setOtherUID('')
    }
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

  const openDrawer = (newSelecedUser: string) => {
    if (selectedUserId !== newSelecedUser) setSelectedUserId(newSelecedUser)
    setPlayerName('')
    setTeams([])
    setRarities([])
    setOtherUID('')
    onOpen()
  }

  const addCardToTrade = (
    tradeCardData: TradeCard,
    isLoggedInUser: boolean
  ) => {
    const [cardsToTrade, setCardsToTrade] = isLoggedInUser
      ? [loggedInUserCardsToTrade, setloggedInUserCardsToTrade]
      : [partnerUserCardsToTrade, setPartnerUserCardsToTrade]

    setCardsToTrade([...cardsToTrade, tradeCardData])
  }

  const removeCardFromTrade = (
    tradeCardData: TradeCard,
    isLoggedInUser: boolean
  ) => {
    const [cardsToTrade, setCardsToTrade] = isLoggedInUser
      ? [loggedInUserCardsToTrade, setloggedInUserCardsToTrade]
      : [partnerUserCardsToTrade, setPartnerUserCardsToTrade]

    setCardsToTrade(
      cardsToTrade.filter(
        (card: TradeCard) => card.ownedCardID !== tradeCardData.ownedCardID
      )
    )
    toast({
      title: 'Removed Card From Trade',
      ...successToastOptions,
    })
  }
  const handleResetTradeCards = () => {
    setResetTradeCards(true)
  }

  const handleSubmitTrade = async () => {
    try {
      await submitTrade({
        initiatorId: uid,
        recipientId: tradePartnerUid,
        tradeAssets: [
          ...loggedInUserCardsToTrade.map(
            (card): TradeAsset => ({
              ownedCardId: String(card.ownedCardID),
              toId: tradePartnerUid,
              fromId: uid,
            })
          ),
          ...partnerUserCardsToTrade.map(
            (card): TradeAsset => ({
              ownedCardId: String(card.ownedCardID),
              toId: uid,
              fromId: tradePartnerUid,
            })
          ),
        ],
      })
      queryClient.invalidateQueries(['trades'])
      toast({
        title: 'Trade Created',
        description: 'congrats!',
        ...successToastOptions,
      })
      router.push('/trade', undefined, { shallow: false })
    } catch (error) {
      toast({
        title: 'Error Creating Trade',
        description: error,
        ...errorToastOptions,
      })
    }
  }
  const selectedUser: UserData =
    selectedUserId === uid ? loggedInUser : tradePartnerUser

  const waitForSelectedUserCards = () => {
    return new Promise<void>((resolve) => {
      const checkInterval = setInterval(() => {
        if (selectedUserCards && !selectedUserCardsIsLoading) {
          clearInterval(checkInterval)
          resolve()
        }
      }, 100)
    })
  }

  return (
    <>
      <Box>
        <div className="mb-3"></div>
        <Stack
          direction={['column', 'column', 'row']}
          spacing={[4, 4, 2]}
          mb={4}
          alignItems={['stretch', 'stretch', 'center']}
          justifyContent="space-between"
        >
          <Flex
            direction={['column', 'column', 'row']}
            width={['100%', '100%', 'auto']}
          >
            <Button
              onClick={() => openDrawer(uid)}
              mb={[2, 2, 0]}
              mr={[0, 0, 2]}
              isDisabled={isSubmittingTrade}
              width={['100%', '100%', 'auto']}
            >
              Open My Cards
            </Button>
            <Button
              onClick={() => openDrawer(tradePartnerUid)}
              isDisabled={isSubmittingTrade}
              width={['100%', '100%', 'auto']}
            >
              Open {pluralizeName(tradePartnerUser?.username)} Cards
            </Button>
          </Flex>
          <HStack>
            <Button
              colorScheme="green"
              isDisabled={
                isSubmittingTrade ||
                loggedInUserCardsToTrade.length === 0 ||
                partnerUserCardsToTrade.length === 0
              }
              onClick={handleSubmitTrade}
              order={[2, 2, 2]}
              width={['100%', '100%', 'auto']}
            >
              Submit Trade
            </Button>
            <Button
              colorScheme="red"
              onClick={handleResetTradeCards}
              width={['100%', '100%', 'auto']}
            >
              Reset Trade
            </Button>
          </HStack>
        </Stack>

        <VStack spacing={4} align="stretch">
          <Box>
            <Box fontWeight="bold" mb={2}>
              Your Cards to Trade
            </Box>
            <SimpleGrid columns={[2, 3, 4]} spacing={2}>
              {Object.entries(loggedInUserCardsToTrade).map(
                ([cardID, card]) => (
                  <Box key={card.ownedCardID} position="relative">
                    <Image
                      src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                      fallback={
                        <Box position="relative">
                          <Image src="/cardback.png" />
                          <Box
                            position="absolute"
                            top={0}
                            left={0}
                            w="100%"
                            h="100%"
                            bg="black"
                            opacity={0.5}
                            zIndex={2}
                          />
                        </Box>
                      }
                      onClick={() => !isSubmittingTrade}
                      cursor={isSubmittingTrade ? 'not-allowed' : 'pointer'}
                    />
                    <RemoveButton
                      onClick={removeCardFromTrade}
                      isLoggedInUser={true}
                      card={card}
                      rightSide={isMobile ? 2 : 10}
                      size={isMobile ? 'xs' : 'sm'}
                    />
                    <Badge
                      position="absolute"
                      top={-1}
                      left={-1}
                      zIndex={3}
                      colorScheme="gray"
                      borderRadius="full"
                      px={2}
                    >
                      {card.card_rarity}
                    </Badge>
                  </Box>
                )
              )}
            </SimpleGrid>
          </Box>

          <Divider />

          <Box>
            <Box fontWeight="bold" mb={2}>
              {pluralizeName(tradePartnerUser?.username)} Cards to Trade
            </Box>
            <SimpleGrid columns={[2, 3, 4]} spacing={2}>
              {Object.entries(partnerUserCardsToTrade).map(([key, card]) => (
                <Box key={card.ownedCardID} position="relative">
                  <Image
                    src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                    fallback={
                      <Box position="relative">
                        <Image src="/cardback.png" />
                        <Box
                          position="absolute"
                          top={0}
                          left={0}
                          w="100%"
                          h="100%"
                          bg="black"
                          opacity={0.5}
                          zIndex={2}
                        />
                      </Box>
                    }
                    onClick={() => !isSubmittingTrade}
                    cursor={isSubmittingTrade ? 'not-allowed' : 'pointer'}
                  />
                  <RemoveButton
                    onClick={removeCardFromTrade}
                    isLoggedInUser={false}
                    card={card}
                    rightSide={isMobile ? 2 : 10}
                    size={isMobile ? 'xs' : 'sm'}
                  />
                  <Badge
                    position="absolute"
                    top={-1}
                    left={-1}
                    zIndex={3}
                    colorScheme="gray"
                    borderRadius="full"
                    px={2}
                  >
                    {card.card_rarity}
                  </Badge>
                </Box>
              ))}
            </SimpleGrid>
          </Box>
        </VStack>
      </Box>
      <Drawer
        placement={isMobile ? 'right' : 'bottom'}
        onClose={onClose}
        isOpen={isOpen}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent overflow="hidden" overflowY="scroll">
          <DrawerCloseButton className="bg-primary" />
          <DrawerHeader className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
            <span>{pluralizeName(selectedUser?.username)} Cards</span>
          </DrawerHeader>
          <DrawerBody className="bg-primary p-4">
            <Flex direction="column" mb={4}>
              <FormControl mb={2}>
                <Input
                  placeholder="Player Name Search"
                  onChange={(event) => setPlayerName(event.target.value)}
                  className="w-full !bg-secondary"
                />
              </FormControl>
              <Flex justifyContent="space-between" alignItems="center">
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
              </Flex>
              <Box flex={1} mr={2} className="p-2">
                <Select
                  className="w-full !bg-secondary hover:!bg-highlighted/40"
                  onChange={(event) => {
                    const [sortColumn, sortDirection] =
                      event.target.value.split(':') as [
                        TradeCardSortValue,
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
              </Box>
              <RadioGroupSelector
                value={leagueID}
                options={LEAGUE_OPTIONS}
                onChange={(value) => {
                  setLeagueID(value)
                  setTeams([])
                  setRarities([])
                }}
              />
              <FormControl className="flex flex-row justify-start items-center">
                <FormLabel className="flex items-center mr-4">
                  Hide My Cards / Partner's Cards
                </FormLabel>
                <Switch
                  className="flex items-center"
                  placeholder="User ID"
                  onChange={(e) => setFilteredUID(e.target.checked)}
                />
              </FormControl>
              <FormControl className="flex flex-row justify-start items-center">
                <FormLabel className="flex items-center mr-4">
                  Show only Duplicates
                </FormLabel>
                <Switch
                  className="flex items-center"
                  onChange={(e) => setRemoveSingles(e.target.checked)}
                />
              </FormControl>
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
                    const isLoggedInUser: boolean =
                      selectedUserId === String(loggedInUser?.uid)
                    const selectedUserAssets: TradeCard[] = isLoggedInUser
                      ? loggedInUserCardsToTrade
                      : partnerUserCardsToTrade

                    const isInTrade: boolean = selectedUserAssets.some(
                      (asset) => asset.ownedCardID === card.ownedCardID
                    )

                    return (
                      <div
                        tabIndex={0}
                        role="button"
                        key={`${card.cardID}-${index}`}
                        className="m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            if (!isInTrade) {
                              e.preventDefault()
                              addCardToTrade(card, isLoggedInUser)
                              toast({
                                title: 'Added card to trade',
                                description: '',
                                ...successToastOptions,
                              })
                            }
                          }
                        }}
                      >
                        <Image
                          className={`cursor-pointer ${
                            isInTrade ? 'grayscale' : ''
                          }`}
                          onClick={() => {
                            if (!isInTrade) {
                              addCardToTrade(card, isLoggedInUser)
                              toast({
                                title: 'Added card to trade',
                                description: '',
                                ...successToastOptions,
                              })
                            }
                          }}
                          src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                        />
                        {isInTrade && (
                          <RemoveButton
                            onClick={removeCardFromTrade}
                            isLoggedInUser={isLoggedInUser}
                            card={card}
                            rightSide={4}
                            size={isMobile ? 'xs' : 'sm'}
                          />
                        )}
                        {!selectedUserCardsIsLoading && (
                          <Badge className="z-30 absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-primary transform -translate-x-1/4 -translate-y-3/4 bg-neutral-800 rounded-full">
                            {card.card_rarity}
                          </Badge>
                        )}
                      </div>
                    )
                  })}
            </SimpleGrid>
            <TablePagination
              totalRows={selectedUserCards?.total}
              rowsPerPage={ROWS_PER_PAGE}
              onPageChange={(newPage) => setTablePage(newPage)}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
