import { CheckIcon } from '@chakra-ui/icons'
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react'
import TablePagination from '@components/table/TablePagination'
import { GET, POST } from '@constants/http-methods'
import rarityMap from '@constants/rarity-map'
import { shlTeamsMap } from '@constants/teams-map'
import { useCookie } from '@hooks/useCookie'
import { mutation } from '@pages/api/database/mutation'
import { query } from '@pages/api/database/query'
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
import { Fragment, useContext, useEffect, useState } from 'react'
import { useQueryClient } from 'react-query'

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

const ROWS_PER_PAGE: number = 5 as const

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
  })),
} as const

export default function NewTrade({
  loggedInUser,
  tradePartnerUid,
  cardID,
}: {
  loggedInUser: UserData
  tradePartnerUid: string
  cardID?: number
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
  const [cardAdded, setCardAdded] = useState(false);

  const [uid] = useCookie(config.userIDCookieName)

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

  const { payload: selectedUserCards, isLoading: selectedUserCardsIsLoading } =
    query<ListResponse<TradeCard>>({
      queryKey: [
        'collection',
        selectedUserId,
        playerName,
        JSON.stringify(teams),
        JSON.stringify(rarities),
        String(tablePage),
        sortColumn,
        sortDirection,
      ],
      queryFn: () =>
        axios({
          url: `/api/v3/trades/collection/${selectedUserId}`,
          method: GET,
          params: {
            playerName,
            teams: JSON.stringify(teams),
            rarities: JSON.stringify(rarities),
            limit: ROWS_PER_PAGE,
            offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
            sortColumn,
            sortDirection,
          },
        }),
      enabled: !!selectedUserId,
    })
    const {
      payload: showSelectedCard,
      isLoading: showSelectedCardLoading
    } = query<ListResponse<TradeCard>>({
      queryKey: ['check-card', tradePartnerUid, String(cardID)],
      queryFn: () =>
        axios({
          method: 'GET',
          url: `/api/v3/trades/collection/check-card?uid=${tradePartnerUid}&cardID=${cardID}`,
        }),
      enabled: !!tradePartnerUid && !!cardID,
    });
    useEffect(() => {
      if (!showSelectedCardLoading && showSelectedCard && !cardAdded) {
        if (showSelectedCard.rows.length > 0) {
          const cardToAdd = showSelectedCard.rows[0];
          addCardToTrade(cardToAdd, false);
          setCardAdded(true);
        } else {
          toast({
            title: 'Card Not Found',
            description: "The specified card could not be found in the collection.",
            status: 'warning',
          });
        }
      }
    }, [showSelectedCard, showSelectedCardLoading, loggedInUser.uid, tradePartnerUid, cardAdded]);

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

  const openDrawer = (newSelecedUser: string) => {
    if (selectedUserId !== newSelecedUser) setSelectedUserId(newSelecedUser)
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
      router.push('/trade', undefined, { shallow: false });
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
      <div className="flex flex-col mt-2">
        <div className="flex justify-end">
          <Button
            className="disabled:bg-primary"
            disabled={
              isSubmittingTrade ||
              loggedInUserCardsToTrade.length === 0 ||
              partnerUserCardsToTrade.length === 0
            }
            onClick={handleSubmitTrade}
          >
            Submit Trade
          </Button>
        </div>
        <div className="flex flex-row mt-2">
          <div className="w-1/2 border-r">
            <div className="flex justify-start">
              <Button
                onClick={() => {
                  if (isSubmittingTrade) {
                    return
                  }
                  openDrawer(uid)
                }}
              >
                Open My Cards
              </Button>
            </div>
            <SimpleGrid columns={3} className="m-2">
              {Object.entries(loggedInUserCardsToTrade).map(
                ([cardID, card]) => (
                  <div className="m-2" key={card.ownedCardID}>
                    <Image
                      className="cursor-pointer"
                      onClick={() => {
                        if (isSubmittingTrade) {
                          return
                        }
                        removeCardFromTrade(card, true)
                      }}
                      src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                      fallback={
                        <div className="relative z-10">
                          <Image src="/cardback.png" />
                          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                        </div>
                      }
                    />
                    <Badge className="z-30 absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform -translate-x-1/4 -translate-y-3/4 bg-neutral-800 rounded-full">
                      {card.card_rarity}
                    </Badge>
                  </div>
                )
              )}
            </SimpleGrid>
          </div>
          <div className="w-1/2">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  if (isSubmittingTrade) {
                    return
                  }
                  openDrawer(tradePartnerUid)
                }}
              >
                Open&nbsp;{pluralizeName(tradePartnerUser?.username)}&nbsp;Cards
              </Button>
            </div>
            <SimpleGrid columns={3} className="m-2">
              {Object.entries(partnerUserCardsToTrade).map(([key, card]) => (
                <div className="m-2" key={card.ownedCardID}>
                  <Image
                    className="cursor-pointer"
                    onClick={() => {
                      removeCardFromTrade(card, false)
                    }}
                    src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                    fallback={
                      <div className="relative z-10">
                        <Image src="/cardback.png" />
                        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                      </div>
                    }
                  />
                  <Badge className="z-30 absolute top-0 left-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform -translate-x-1/4 -translate-y-3/4 bg-neutral-800 rounded-full">
                    {card.card_rarity}
                  </Badge>
                </div>
              ))}
            </SimpleGrid>
          </div>
        </div>
      </div>
      <Drawer placement="bottom" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent overflow='scroll'>
          <DrawerCloseButton />
          <DrawerHeader className="flex flex-row justify-between items-center bg-primary">
            <span>{pluralizeName(selectedUser?.username)}&nbsp;Cards</span>
          </DrawerHeader>
          <DrawerBody className="bg-primary">
            <div className="flex flex-row justify-between bg-primary">
              <div className="flex flex-row justify-start items-end">
                <FormControl className="mx-2 w-auto">
                  <FormLabel className="!text-secondary">Player Name</FormLabel>
                  <Input
                    className="min-w-80"
                    onChange={(event) => setPlayerName(event.target.value)}
                  />
                </FormControl>
                <FormControl className="mx-2 w-auto cursor-pointer">
                  <Menu closeOnSelect={false}>
                    <MenuButton className="border border-1 rounded p-1.5 cursor-pointer !bg-secondary">
                      Teams&nbsp;{`(${teams.length})`}
                    </MenuButton>
                    <MenuList>
                      <MenuOptionGroup type="checkbox">
                        <MenuItemOption
                          icon={null}
                          isChecked={false}
                          aria-checked={false}
                          closeOnSelect
                          className="!bg-secondary"
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
                              className="!bg-secondary"
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
                <FormControl className="border border-1 rounded mx-2 w-auto flex flex-row items-center !bg-secondary">
                  <Menu closeOnSelect={false}>
                    <MenuButton className="p-1.5 !bg-secondary">
                      Rarities&nbsp;{`(${rarities.length})`}
                    </MenuButton>
                    <MenuList>
                      <MenuOptionGroup type="checkbox">
                        <MenuItemOption
                          icon={null}
                          isChecked={false}
                          aria-checked={false}
                          closeOnSelect
                          className="!bg-secondary"
                          onClick={() => setRarities([])}
                        >
                          Deselect All
                        </MenuItemOption>
                        {Object.entries(rarityMap).map(([key, value]) => {
                          const isChecked: boolean = rarities.includes(
                            value.value
                          )
                          return (
                            <MenuItemOption
                              icon={null}
                              isChecked={isChecked}
                              aria-checked={isChecked}
                              key={value.value}
                              value={value.value}
                              className="!bg-secondary"
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
              <div>
                <FormControl className="mx-2">
                  <FormLabel>Sort</FormLabel>
                  <Select
                    className="cursor-pointer w-full sm:w-auto border-grey800 border-1 rounded px-2 !bg-secondary"
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
                </FormControl>
              </div>
            </div>
            <SimpleGrid className="m-2 bg-primary" columns={ROWS_PER_PAGE}>
              {(selectedUserCardsIsLoading
                ? LOADING_GRID_DATA
                : selectedUserCards
              )?.rows.map((card, index) => {
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
                    key={`${card.cardID}-${index}`}
                    className="m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                  >
                    <Image
                      className={`cursor-pointer ${
                        isInTrade ? 'grayscale' : ''
                      }`}
                      onClick={() => {
                        if (isInTrade) {
                          return
                        }
                        addCardToTrade(card, isLoggedInUser)
                      }}
                      src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                      fallback={
                        <div className="relative z-10">
                          <Image src="/cardback.png" />
                          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                        </div>
                      }
                    />
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
