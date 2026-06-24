import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Heading,
  Input,
  Grid,
  VStack,
  HStack,
  Text,
  Button,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  useColorModeValue,
  useBreakpointValue,
  Flex,
  Wrap,
} from '@chakra-ui/react'
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd'
import { useSession } from 'contexts/AuthContext'
import { GET, POST } from '@constants/http-methods'
import { query } from '@pages/api/database/query'
import { ListResponse, SortDirection } from '@pages/api/v3'
import {
  OwnedCard,
  OwnedCardSortOption,
  OwnedCardSortValue,
} from '@pages/api/v3/collection/uid'
import { GameLineup } from '@pages/api/v3/lineups/getLineupCollection'
import axios from 'axios'
import PositionBlock from './PositionBlock'
import PlayerCardComponent from './PlayerCardComponent'
import { useDebounce } from 'use-debounce'
import { mutation } from '@pages/api/database/mutation'
import { useQueryClient } from 'react-query'
import { LineupPosition } from './types'
import FilterDropdown from '@components/common/FilterDropdown'
import { Team, Rarities, SubType } from '@pages/api/v3'
import { toggleOnfilters } from '@utils/toggle-on-filters'
import ActiveFilters from '@components/common/ActiveFilters'
import RadioGroupSelector from '@components/common/RadioGroupSelector'
import { LEAGUE_OPTIONS } from 'lib/constants'

const ROWS_PER_PAGE: number = 15 as const

const LineupDetails: React.FC = () => {
  const { session, loggedIn } = useSession()
  const router = useRouter()
  const { lineupId } = router.query
  const toast = useToast()
  const queryClient = useQueryClient()
  const [lineupName, setLineupName] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPosition, setSelectedPosition] = useState<string>('all')
  const [availablePlayers, setAvailablePlayers] = useState<Card[]>([])
  const [tablePage, setTablePage] = useState(1)
  const [isEditMode, setIsEditMode] = useState(false)

  // New filtering states from collect page
  const [teams, setTeams] = useState<string[]>([])
  const [teamLeagueID, setTeamLeagueID] = useState<{ [key: string]: string }>(
    {}
  )
  const [rarities, setRarities] = useState<string[]>([])
  const [subType, setSubType] = useState<string[]>([])
  const [leagueID, setLeagueID] = useState<string[]>(['0']) // Default to SHL league

  const [debouncedSearchTerm] = useDebounce(searchTerm, 300)

  // Responsive layout for position blocks
  const isMobileLayout = useBreakpointValue({ base: true, md: false })

  // Data fetching queries from collect page
  const { payload: teamData, isLoading: teamDataIsLoading } = query<Team[]>({
    queryKey: ['teamData', leagueID.join(',')],
    queryFn: () =>
      axios({
        method: GET,
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

  // Check if we're in edit mode and fetch existing lineup data
  useEffect(() => {
    if (lineupId && typeof lineupId === 'string') {
      setIsEditMode(true)
      const fetchExistingLineup = async () => {
        try {
          const response = await axios({
            method: GET,
            url: `/api/v3/lineups/getLineupCollection`,
            params: {
              uid: session?.userId,
              lineupId: lineupId,
            },
            headers: {
              Authorization: `Bearer ${session?.token}`,
            },
          })

          const lineupData = response.data?.payload?.rows?.[0]
          if (lineupData) {
            setLineupName(lineupData.lineupTitle || '')
            // Set positions with existing lineup data
            setPositions([
              {
                id: 'center',
                name: 'Center',
                position: 'C',
                positionGroup: 'F',
                card: lineupData.c_playerName
                  ? {
                      cardID: lineupData.c_cardID || 0,
                      teamID: 0, // Default value
                      playerID: 0, // Default value
                      author_userID: 0,
                      card_rarity: lineupData.c_card_rarity,
                      sub_type: '',
                      player_name: lineupData.c_playerName,
                      render_name: undefined,
                      pullable: 1,
                      approved: 1,
                      image_url: lineupData.c_image_url,
                      position: lineupData.c_position,
                      overall: lineupData.c_overall,
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
                      author_paid: 0,
                      packID: undefined,
                      quantity: 1,
                      totalCardQuantity: undefined,
                      date_approved: null,
                      author_username: undefined,
                      total: undefined,
                      leagueID: 0,
                    }
                  : null,
              },
              {
                id: 'left-wing',
                name: 'Left Wing',
                position: 'LW',
                positionGroup: 'F',
                card: lineupData.lw_playerName
                  ? {
                      cardID: lineupData.lw_cardID || 0,
                      teamID: 0, // Default value
                      playerID: 0, // Default value
                      author_userID: 0,
                      card_rarity: lineupData.lw_card_rarity,
                      sub_type: '',
                      player_name: lineupData.lw_playerName,
                      render_name: undefined,
                      pullable: 1,
                      approved: 1,
                      image_url: lineupData.lw_image_url,
                      position: lineupData.lw_position,
                      overall: lineupData.lw_overall,
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
                      author_paid: 0,
                      packID: undefined,
                      quantity: 1,
                      totalCardQuantity: undefined,
                      date_approved: null,
                      author_username: undefined,
                      total: undefined,
                      leagueID: 0,
                    }
                  : null,
              },
              {
                id: 'right-wing',
                name: 'Right Wing',
                position: 'RW',
                positionGroup: 'F',
                card: lineupData.rw_playerName
                  ? {
                      cardID: lineupData.rw_cardID || 0,
                      teamID: 0, // Default value
                      playerID: 0, // Default value
                      author_userID: 0,
                      card_rarity: lineupData.rw_card_rarity,
                      sub_type: '',
                      player_name: lineupData.rw_playerName,
                      render_name: undefined,
                      pullable: 1,
                      approved: 1,
                      image_url: lineupData.rw_image_url,
                      position: lineupData.rw_position,
                      overall: lineupData.rw_overall,
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
                      author_paid: 0,
                      packID: undefined,
                      quantity: 1,
                      totalCardQuantity: undefined,
                      date_approved: null,
                      author_username: undefined,
                      total: undefined,
                      leagueID: 0,
                    }
                  : null,
              },
              {
                id: 'left-defense',
                name: 'Left Defense',
                position: 'LD',
                positionGroup: 'D',
                card: lineupData.ld_playerName
                  ? {
                      cardID: lineupData.ld_cardID || 0,
                      teamID: 0, // Default value
                      playerID: 0, // Default value
                      author_userID: 0,
                      card_rarity: lineupData.ld_card_rarity,
                      sub_type: '',
                      player_name: lineupData.ld_playerName,
                      render_name: undefined,
                      pullable: 1,
                      approved: 1,
                      image_url: lineupData.ld_image_url,
                      position: lineupData.ld_position,
                      overall: lineupData.ld_overall,
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
                      author_paid: 0,
                      packID: undefined,
                      quantity: 1,
                      totalCardQuantity: undefined,
                      date_approved: null,
                      author_username: undefined,
                      total: undefined,
                      leagueID: 0,
                    }
                  : null,
              },
              {
                id: 'right-defense',
                name: 'Right Defense',
                position: 'RD',
                positionGroup: 'D',
                card: lineupData.rd_playerName
                  ? {
                      cardID: lineupData.rd_cardID || 0,
                      teamID: 0, // Default value
                      playerID: 0, // Default value
                      author_userID: 0,
                      card_rarity: lineupData.rd_card_rarity,
                      sub_type: '',
                      player_name: lineupData.rd_playerName,
                      render_name: undefined,
                      pullable: 1,
                      approved: 1,
                      image_url: lineupData.rd_image_url,
                      position: lineupData.rd_position,
                      overall: lineupData.rd_overall,
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
                      author_paid: 0,
                      packID: undefined,
                      quantity: 1,
                      totalCardQuantity: undefined,
                      date_approved: null,
                      author_username: undefined,
                      total: undefined,
                      leagueID: 0,
                    }
                  : null,
              },
              {
                id: 'goalie',
                name: 'Goalie',
                position: 'G',
                positionGroup: 'G',
                card: lineupData.g_playerName
                  ? {
                      cardID: lineupData.g_cardID || 0,
                      teamID: 0, // Default value
                      playerID: 0, // Default value
                      author_userID: 0,
                      card_rarity: lineupData.g_card_rarity,
                      sub_type: '',
                      player_name: lineupData.g_playerName,
                      render_name: undefined,
                      pullable: 1,
                      approved: 1,
                      image_url: lineupData.g_image_url,
                      position: lineupData.g_position,
                      overall: lineupData.g_overall,
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
                      author_paid: 0,
                      packID: undefined,
                      quantity: 1,
                      totalCardQuantity: undefined,
                      date_approved: null,
                      author_username: undefined,
                      total: undefined,
                      leagueID: 0,
                    }
                  : null,
              },
            ])
          }
        } catch (error) {
          console.error('Error fetching lineup:', error)
          toast({
            title: 'Error loading lineup',
            description: 'Failed to load existing lineup data',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      }

      fetchExistingLineup()
    }
  }, [lineupId, session?.token, session?.userId])
  const [positions, setPositions] = useState<LineupPosition[]>([
    {
      id: 'center',
      name: 'Center',
      position: 'C',
      positionGroup: 'F',
      card: null,
    },
    {
      id: 'left-wing',
      name: 'Left Wing',
      position: 'LW',
      positionGroup: 'F',
      card: null,
    },
    {
      id: 'right-wing',
      name: 'Right Wing',
      position: 'RW',
      positionGroup: 'F',
      card: null,
    },
    {
      id: 'left-defense',
      name: 'Left Defense',
      position: 'LD',
      positionGroup: 'D',
      card: null,
    },
    {
      id: 'right-defense',
      name: 'Right Defense',
      position: 'RD',
      positionGroup: 'D',
      card: null,
    },
    {
      id: 'goalie',
      name: 'Goalie',
      position: 'G',
      positionGroup: 'G',
      card: null,
    },
  ])

  const positionFilters = selectedPosition === 'all' ? '' : selectedPosition

  // Get user's card collection
  const {
    payload: userCards,
    isLoading,
    refetch,
  } = query<ListResponse<OwnedCard>>({
    queryKey: [
      'collection',
      session?.userId,
      debouncedSearchTerm || '',
      JSON.stringify(teams),
      JSON.stringify(rarities),
      JSON.stringify(subType),
      String(tablePage),
      'overall', // sortColumn - could be made dynamic
      'DESC', // sortDirection - could be made dynamic
      'false', // showNotOwnedCards
      '', // otherUID
      JSON.stringify(leagueID),
      JSON.stringify(teamLeagueID),
      positionFilters,
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid`,
        params: {
          uid: session?.userId,
          playerName:
            debouncedSearchTerm.length >= 1 ? debouncedSearchTerm : '',
          teams: JSON.stringify(teams),
          rarities: JSON.stringify(rarities),
          subType: JSON.stringify(subType),
          limit: ROWS_PER_PAGE,
          offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
          showNotOwnedCards: false,
          otherUID: '',
          leagueID: JSON.stringify(leagueID),
          teamLeagueID: JSON.stringify(teamLeagueID),
          position: positionFilters,
        },
      }),
  })

  // Transform to Card format
  const userCollection: Card[] = (userCards?.rows || [])
    .filter((card) => card.quantity > 0)
    .map((card) => ({
      cardID: card.cardID,
      teamID: card.teamID,
      playerID: card.playerID,
      author_userID: 0, // Default value since not available in OwnedCard
      card_rarity: card.card_rarity,
      sub_type: '', // Default value since not available in OwnedCard
      player_name: card.player_name,
      render_name: undefined, // Default value since not available in OwnedCard
      pullable: 1, // Default value since not available in OwnedCard
      approved: 1, // Default value since not available in OwnedCard
      image_url: card.image_url,
      position: card.position,
      overall: card.overall,
      skating: card.skating,
      shooting: card.shooting,
      hands: card.hands,
      checking: card.checking,
      defense: card.defense,
      high_shots: card.high_shots,
      low_shots: card.low_shots,
      quickness: card.quickness,
      control: card.control,
      conditioning: card.conditioning,
      season: card.season,
      author_paid: 0, // Default value since not available in OwnedCard
      packID: undefined, // Default value since not available in OwnedCard
      quantity: card.quantity,
      totalCardQuantity: undefined, // Default value since not available in OwnedCard
      date_approved: null, // Default value since not available in OwnedCard
      author_username: undefined, // Default value since not available in OwnedCard
      total: undefined, // Default value since not available in OwnedCard
      leagueID: card.leagueID,
    }))

  // Update availablePlayers when userCards change
  useEffect(() => {
    setAvailablePlayers(userCollection)
  }, [userCards?.rows])

  // Refetch data when filters change (from collect page)
  useEffect(() => {
    refetch()
  }, [
    debouncedSearchTerm,
    teams,
    rarities,
    subType,
    tablePage,
    leagueID,
    teamLeagueID,
  ])

  // Toggle functions from collect page
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

  // Save lineup button click
  const handleSaveLineup = async () => {
    if (!lineupName.trim()) {
      toast({
        title: 'Lineup name required',
        description: 'Please enter a lineup name',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    const filledPositions = positions.filter((pos) => pos.card !== null)
    if (filledPositions.length === 0) {
      toast({
        title: 'No players added',
        description: 'Please add at least one player to your lineup',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    if (!session?.userId) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in to save a lineup',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      const centerCard = positions.find((pos) => pos.id === 'center')?.card
      const leftWingCard = positions.find((pos) => pos.id === 'left-wing')?.card
      const rightWingCard = positions.find((pos) => pos.id === 'right-wing')
        ?.card
      const leftDefenseCard = positions.find((pos) => pos.id === 'left-defense')
        ?.card
      const rightDefenseCard = positions.find(
        (pos) => pos.id === 'right-defense'
      )?.card
      const goalieCard = positions.find((pos) => pos.id === 'goalie')?.card

      const lineupData = {
        userID: session.userId,
        lineupTitle: lineupName,
        centerCardID: centerCard?.cardID || null,
        leftWingCardID: leftWingCard?.cardID || null,
        rightWingCardID: rightWingCard?.cardID || null,
        leftDefenseCardID: leftDefenseCard?.cardID || null,
        rightDefenseCardID: rightDefenseCard?.cardID || null,
        goalieCardID: goalieCard?.cardID || null,
      }

      // Add lineupId for update mode
      if (isEditMode && lineupId) {
        ;(lineupData as any).lineupID = lineupId
      }

      await saveLineup(lineupData as any)
    } catch (error) {
      console.error('Error saving lineup:', error)
      toast({
        title: 'Save failed',
        description: 'Failed to save lineup. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  // Save lineup to backend
  const { mutateAsync: saveLineup, isLoading: isSavingLineup } = mutation<
    void,
    { lineupData }
  >({
    mutationFn: async (lineupData) => {
      return axios({
        method: POST,
        url: '/api/v3/lineups/saveLineup',
        data: lineupData,
        headers: {
          Authorization: `Bearer ${session?.token}`,
        },
      })
    },
    onSuccess: () => {
      toast({
        title: 'Lineup saved successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      queryClient.invalidateQueries(['collection', session?.userId])
      queryClient.invalidateQueries(['lineups', session?.userId])

      // Only clear form and reset positions if creating new lineup
      if (!isEditMode) {
        setLineupName('')
        setPositions((prev) => prev.map((pos) => ({ ...pos, card: null })))
      }
    },
    onError: (error: any) => {
      toast({
        title: 'Error saving lineup',
        description: error.response?.data?.message || error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    },
  })

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result

    if (!destination) {
      return
    }

    // If dropped back to card slider
    if (destination.droppableId === 'card-slider') {
      // Find the card being moved back
      const movedCard = availablePlayers.find(
        (c) => c.cardID.toString() === draggableId
      )
      if (movedCard) {
        // Add card back to available players if not already there
        setAvailablePlayers((prev) => {
          const exists = prev.some((p) => p.cardID.toString() === draggableId)
          if (!exists) {
            return [...prev, movedCard]
          }
          return prev
        })
      }

      // Remove card from any position it might be in
      setPositions((prev) =>
        prev.map((pos) =>
          pos.card?.cardID.toString() === draggableId
            ? { ...pos, card: null }
            : pos
        )
      )
      return
    }

    // If dropped into a position
    const positionId = destination.droppableId
    const card = availablePlayers.find(
      (c) => c.cardID.toString() === draggableId
    )

    if (!card) return

    // Find the target position
    const targetPosition = positions.find((pos) => pos.id === positionId)
    if (!targetPosition) return

    // Check if the player's position group matches the target position group
    if (card.position !== targetPosition.positionGroup) {
      toast({
        title: 'Invalid position',
        description: `${card.player_name} (${card.position}) cannot be placed in ${targetPosition.name}. Position groups don't match.`,
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    // Remove card from available players
    setAvailablePlayers((prev) =>
      prev.filter((p) => p.cardID.toString() !== draggableId)
    )

    // Update the position with the card
    setPositions((prev) =>
      prev.map((pos) => (pos.id === positionId ? { ...pos, card } : pos))
    )
  }

  const handleClearPositions = () => {
    // Get all currently placed cards
    const placedCards = positions
      .filter((pos) => pos.card !== null)
      .map((pos) => pos.card!)

    // Add all placed cards back to available players
    setAvailablePlayers((prev) => {
      const existingIds = new Set(prev.map((p) => p.cardID.toString()))
      const newCards = placedCards.filter(
        (card) => !existingIds.has(card.cardID.toString())
      )
      return [...prev, ...newCards]
    })

    // Clear all positions
    setPositions((prev) => prev.map((pos) => ({ ...pos, card: null })))
  }

  const handlePageChange = (newPage: number) => {
    setTablePage(newPage)
  }

  const totalPages = userCards?.total
    ? Math.ceil(userCards.total / ROWS_PER_PAGE)
    : 1

  const isFiltered = () => {
    return (
      searchTerm.length > 0 || positionFilters !== '' || rarities.length > 0
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <VStack spacing={6} align="stretch" p={4}>
        {!loggedIn && (
          <Alert status="warning" bg="yellow.800" color="white">
            <AlertIcon color="yellow.500" />
            Please log in to view your card collection and create lineups.
          </Alert>
        )}

        {!isLoading &&
          loggedIn &&
          availablePlayers.length === 0 &&
          !isFiltered() && (
            <Alert status="info" bg="blue.900" color="white">
              <AlertIcon color="blue.300" />
              You don't have any cards in your collection yet. Start collecting
              cards to create lineups!
            </Alert>
          )}

        {loggedIn && (availablePlayers.length > 0 || isFiltered()) && (
          <>
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              gap={{ base: 4, lg: 0 }}
              align={{ base: 'stretch', lg: 'center' }}
              justify="space-between"
            >
              <Box flex="1">
                <Heading size="sm" mb={3}>
                  Lineup Name
                </Heading>
                <Input
                  placeholder="Choose a team name for your lineup..."
                  value={lineupName}
                  onChange={(e) => setLineupName(e.target.value)}
                  size="lg"
                  maxWidth={{ base: '100%', sm: '600px' }}
                  maxLength={100}
                />
              </Box>

              <HStack
                spacing={3}
                mt={{ base: 4, sm: 0 }}
                justify={'flex-end'}
                w={{ base: '100%', sm: 'auto' }}
              >
                <Button
                  variant="outline"
                  colorScheme="white"
                  onClick={() => window.history.back()}
                >
                  Back
                </Button>
                <Button
                  variant="outline"
                  colorScheme="red"
                  onClick={handleClearPositions}
                >
                  Clear All
                </Button>
                <Button
                  colorScheme="blue"
                  onClick={handleSaveLineup}
                  isDisabled={positions.some((pos) => pos.card === null)}
                >
                  Save Lineup
                </Button>
              </HStack>
            </Flex>

            {/* 2 Column Layout */}
            <Flex
              direction={{ base: 'column', lg: 'row' }}
              gap={6}
              align="stretch"
            >
              {/* Left Column - Position Grid */}
              <Box flex="1">
                <HStack justify="space-between" align="center" mb={3}>
                  <Heading size="sm">Lineup Positions</Heading>
                </HStack>
                <VStack spacing={4} align="center">
                  {isMobileLayout ? (
                    // Mobile layout: 2x2x2
                    <Grid templateColumns="repeat(2, 1fr)" gap={4} w="100%">
                      <PositionBlock position={positions[1]} /> {/* Left Wing */}
                      <PositionBlock position={positions[0]} /> {/* Center */}
                      <PositionBlock position={positions[2]} /> {/* Right Wing */}
                      <PositionBlock position={positions[3]} /> {/* Left Defense */}
                      <PositionBlock position={positions[4]} /> {/* Right Defense */}
                      <PositionBlock position={positions[5]} /> {/* Goalie */}
                    </Grid>
                  ) : (
                    // Desktop layout: 3x2x1
                    <>
                      <HStack 
                        spacing={{ base: 2, sm: 4 }} 
                        justify="center"
                        wrap={{ base: 'wrap', sm: 'nowrap' }}
                      >
                        <PositionBlock position={positions[1]} /> {/* Left Wing */}
                        <PositionBlock position={positions[0]} /> {/* Center */}
                        <PositionBlock position={positions[2]} /> {/* Right Wing */}
                      </HStack>

                      <HStack 
                        spacing={{ base: 2, sm: 4 }} 
                        justify="center"
                        wrap={{ base: 'wrap', sm: 'nowrap' }}
                      >
                        <PositionBlock position={positions[3]} />
                        <PositionBlock position={positions[4]} />
                      </HStack>

                      <HStack spacing={{ base: 2, sm: 4 }} justify="center">
                        <PositionBlock position={positions[5]} /> {/* Goalie */}
                      </HStack>
                    </>
                  )}
                </VStack>
              </Box>

              {/* Right Column - Player Card Slider */}
              <Box flex="1">
                <HStack justify="space-between" align="center" mb={3}>
                  <Heading size="sm">Search Your Cards</Heading>
                  <Badge colorScheme="blue" fontSize="sm">
                    {userCards?.total || 0} cards
                  </Badge>
                </HStack>

                {/* Search and Filter Controls */}
                <VStack spacing={3} mb={4}>
                  <Input
                    placeholder="Search players by name or team..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="lg"
                  />

                  <HStack spacing={2} mb={4}>
                    <Button
                      size="sm"
                      variant={selectedPosition === 'all' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedPosition('all')}
                      minW={{ base: '80px', sm: 'auto' }}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPosition === 'F' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedPosition('F')}
                      minW={{ base: '80px', sm: 'auto' }}
                    >
                      Forwards (F)
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPosition === 'D' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedPosition('D')}
                      minW={{ base: '80px', sm: 'auto' }}
                    >
                      Defense (D)
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPosition === 'G' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedPosition('G')}
                      minW={{ base: '80px', sm: 'auto' }}
                    >
                      Goalie
                    </Button>
                  </HStack>
                </VStack>

                <HStack spacing={2} mb={4}>
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
                </HStack>

                <Droppable droppableId="card-slider" direction="vertical">
                  {(provided, snapshot) => (
                    <VStack
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      spacing={3}
                      overflowY="auto"
                      p={2}
                      bg={useColorModeValue('white', 'gray.800')}
                      borderRadius="md"
                      minH="400px"
                      maxH="800px"
                      justifyContent={isLoading ? 'center' : 'flex-start'}
                      border="2px solid"
                      borderColor={
                        snapshot.isDraggingOver
                          ? useColorModeValue('blue.400', 'blue.400')
                          : useColorModeValue('gray.300', 'gray.600')
                      }
                      className="player-slider"
                    >
                      {isLoading ? (
                        <Box textAlign="center" py={8}>
                          <Spinner size="xl" color="blue.500" />
                          <Text mt={4} color="gray.300">
                            Loading your card collection...
                          </Text>
                        </Box>
                      ) : (
                        <>
                          <Grid
                            templateColumns={{
                              base: 'repeat(auto-fit, minmax(140px, 1fr))',
                              sm: 'repeat(auto-fit, minmax(160px, 1fr))',
                              md: 'repeat(auto-fit, minmax(170px, 1fr))',
                            }}
                            gap={{ base: 2, sm: 3 }}
                            w="100%"
                          >
                            {availablePlayers.map((card, index) => (
                              <Draggable
                                key={card.cardID.toString()}
                                draggableId={card.cardID.toString()}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <Box
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    padding="10px"
                                  >
                                    <PlayerCardComponent
                                      card={card}
                                      isDragging={snapshot.isDragging}
                                    />
                                  </Box>
                                )}
                              </Draggable>
                            ))}
                          </Grid>
                          {provided.placeholder}
                        </>
                      )}
                    </VStack>
                  )}
                </Droppable>

                {/* Pagination */}
                {totalPages > 1 && (
                  <HStack justify="center" mt={4} spacing={2}>
                    <Button
                      size="sm"
                      onClick={() => handlePageChange(tablePage - 1)}
                      isDisabled={tablePage <= 1}
                    >
                      Previous
                    </Button>
                    <Text color="gray.300" fontSize="sm">
                      Page {tablePage} of {totalPages}
                    </Text>
                    <Button
                      size="sm"
                      onClick={() => handlePageChange(tablePage + 1)}
                      isDisabled={tablePage >= totalPages}
                    >
                      Next
                    </Button>
                  </HStack>
                )}
              </Box>
            </Flex>
          </>
        )}
      </VStack>
    </DragDropContext>
  )
}

export default LineupDetails
