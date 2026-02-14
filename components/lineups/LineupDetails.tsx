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
import { ListResponse } from '@pages/api/v3'
import {
  OwnedCard,
} from '@pages/api/v3/collection/uid'
import axios from 'axios'
import PositionBlock from './PositionBlock'
import PlayerCardComponent from './PlayerCardComponent'
import { useDebounce } from 'use-debounce'
import { mutation } from '@pages/api/database/mutation'
import { useQueryClient } from 'react-query'
import { PlayerCard, LineupPosition } from './types'

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
  const [selectedRarity, setSelectedRarity] = useState<string>('all')
  const [availablePlayers, setAvailablePlayers] = useState<PlayerCard[]>([])
  const [tablePage, setTablePage] = useState(1)
  const [isEditMode, setIsEditMode] = useState(false)

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

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
                      id: lineupData.c_cardID?.toString() || '',
                      playerName: lineupData.c_playerName,
                      team: lineupData.c_team,
                      overall: lineupData.c_overall,
                      position: lineupData.c_position,
                      imageUrl: lineupData.c_image_url,
                      cardID: lineupData.c_cardID,
                      rarity: lineupData.c_card_rarity,
                      quantity: 1,
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
                      id: lineupData.lw_cardID?.toString() || '',
                      playerName: lineupData.lw_playerName,
                      team: lineupData.lw_team,
                      overall: lineupData.lw_overall,
                      position: lineupData.lw_position,
                      imageUrl: lineupData.lw_image_url,
                      cardID: lineupData.lw_cardID,
                      rarity: lineupData.lw_card_rarity,
                      quantity: 1,
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
                      id: lineupData.rw_cardID?.toString() || '',
                      playerName: lineupData.rw_playerName,
                      team: lineupData.rw_team,
                      overall: lineupData.rw_overall,
                      position: lineupData.rw_position,
                      imageUrl: lineupData.rw_image_url,
                      cardID: lineupData.rw_cardID,
                      rarity: lineupData.rw_card_rarity,
                      quantity: 1,
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
                      id: lineupData.ld_cardID?.toString() || '',
                      playerName: lineupData.ld_playerName,
                      team: lineupData.ld_team,
                      overall: lineupData.ld_overall,
                      position: lineupData.ld_position,
                      imageUrl: lineupData.ld_image_url,
                      cardID: lineupData.ld_cardID,
                      rarity: lineupData.ld_card_rarity,
                      quantity: 1,
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
                      id: lineupData.rd_cardID?.toString() || '',
                      playerName: lineupData.rd_playerName,
                      team: lineupData.rd_team,
                      overall: lineupData.rd_overall,
                      position: lineupData.rd_position,
                      imageUrl: lineupData.rd_image_url,
                      cardID: lineupData.rd_cardID,
                      rarity: lineupData.rd_card_rarity,
                      quantity: 1,
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
                      id: lineupData.g_cardID?.toString() || '',
                      playerName: lineupData.g_playerName,
                      team: lineupData.g_team,
                      overall: lineupData.g_overall,
                      position: lineupData.g_position,
                      imageUrl: lineupData.g_image_url,
                      cardID: lineupData.g_cardID,
                      rarity: lineupData.g_card_rarity,
                      quantity: 1,
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
  const rarityFilters = selectedRarity === 'all' ? [] : [selectedRarity]

  // Get user's card collection
  const {
    payload: userCards,
    isLoading,
    refetch,
  } = query<ListResponse<OwnedCard>>({
    queryKey: [
      'collection',
      session?.userId,
      searchTerm,
      JSON.stringify(rarityFilters),
      positionFilters,
      String(tablePage),
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/collection/uid`,
        params: {
          uid: session?.userId,
          playerName: searchTerm,
          rarities: JSON.stringify(rarityFilters),
          position: positionFilters,
          limit: ROWS_PER_PAGE,
          offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
          showNotOwnedCards: false,
        },
      }),
  })

  // Transform to PlayerCard format
  const userCollection: PlayerCard[] = (userCards?.rows || [])
    .filter((card) => card.quantity > 0)
    .map((card) => ({
      id: card.cardID.toString(),
      playerName: card.player_name,
      team: card.teamName,
      overall: card.overall,
      position: card.position,
      imageUrl: card.image_url,
      cardID: card.cardID,
      rarity: card.card_rarity,
      quantity: card.quantity,
    }))

  // Update availablePlayers when userCards change
  useEffect(() => {
    setAvailablePlayers(userCollection)
  }, [userCards?.rows])

  // Save lineup button click
  const handleSaveLineup = async () => {
    if (!lineupName.trim()) {
      alert('Please enter a lineup name')
      return
    }

    const filledPositions = positions.filter((pos) => pos.card !== null)
    if (filledPositions.length === 0) {
      alert('Please add at least one player to your lineup')
      return
    }

    if (!session?.userId) {
      alert('You must be logged in to save a lineup')
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
        (lineupData as any).lineupID = lineupId
      }
      
      await saveLineup(lineupData as any)

    } catch (error) {
      console.error('Error saving lineup:', error)
      alert('Failed to save lineup. Please try again.')
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
      const movedCard = availablePlayers.find((c) => c.id === draggableId)
      if (movedCard) {
        // Add card back to available players if not already there
        setAvailablePlayers((prev) => {
          const exists = prev.some((p) => p.id === draggableId)
          if (!exists) {
            return [...prev, movedCard]
          }
          return prev
        })
      }

      // Remove card from any position it might be in
      setPositions((prev) =>
        prev.map((pos) =>
          pos.card?.id === draggableId ? { ...pos, card: null } : pos
        )
      )
      return
    }

    // If dropped into a position
    const positionId = destination.droppableId
    const card = availablePlayers.find((c) => c.id === draggableId)

    if (!card) return

    // Find the target position
    const targetPosition = positions.find((pos) => pos.id === positionId)
    if (!targetPosition) return

    // Check if the player's position group matches the target position group
    if (card.position !== targetPosition.positionGroup) {
      alert(
        `${card.playerName} (${card.position}) cannot be placed in ${targetPosition.name}. Position groups don't match.`
      )
      return
    }

    // Remove card from available players
    setAvailablePlayers((prev) => prev.filter((p) => p.id !== draggableId))

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
      const existingIds = new Set(prev.map((p) => p.id))
      const newCards = placedCards.filter((card) => !existingIds.has(card.id))
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
      searchTerm.length > 0 ||
      positionFilters !== '' ||
      rarityFilters.length > 0
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
            <HStack justify="space-between" align="center">
              <Box flex="1">
                <Heading size="sm" mb={3}>
                  Lineup Name
                </Heading>
                <Input
                  placeholder="Choose a team name for your lineup..."
                  value={lineupName}
                  onChange={(e) => setLineupName(e.target.value)}
                  size="lg"
                  maxWidth="600px"
                />
              </Box>

              <HStack spacing={3}>
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
            </HStack>

            {/* 2 Column Layout */}
            <HStack spacing={6} align="stretch">
              {/* Left Column - Position Grid */}
              <Box flex="1">
                <HStack justify="space-between" align="center" mb={3}>
                  <Heading size="sm">Lineup Positions</Heading>
                </HStack>
                <VStack spacing={4} align="center">
                  {/* Top Row - Forwards (3) */}
                  <HStack spacing={4} justify="center">
                    <PositionBlock position={positions[1]} /> {/* Left Wing */}
                    <PositionBlock position={positions[0]} /> {/* Center */}
                    <PositionBlock position={positions[2]} /> {/* Right Wing */}
                  </HStack>

                  {/* Middle Row - Defense (2) */}
                  <HStack spacing={4} justify="center">
                    <PositionBlock position={positions[3]} />{' '}
                    {/* Left Defense */}
                    <PositionBlock position={positions[4]} />{' '}
                    {/* Right Defense */}
                  </HStack>

                  {/* Bottom Row - Goalie (1) */}
                  <HStack spacing={4} justify="center">
                    <PositionBlock position={positions[5]} /> {/* Goalie */}
                  </HStack>
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

                  <HStack spacing={2} wrap="wrap">
                    <Button
                      size="sm"
                      variant={selectedPosition === 'all' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedPosition('all')}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPosition === 'F' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedPosition('F')}
                    >
                      Forwards (F)
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPosition === 'D' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedPosition('D')}
                    >
                      Defense (D)
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedPosition === 'G' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedPosition('G')}
                    >
                      Goalie
                    </Button>
                  </HStack>
                </VStack>

                {/* Rarity Filters */}
                <VStack spacing={3} mb={4}>
                  <HStack spacing={2} wrap="wrap">
                    <Button
                      size="sm"
                      variant={selectedRarity === 'all' ? 'solid' : 'outline'}
                      colorScheme="blue"
                      onClick={() => setSelectedRarity('all')}
                    >
                      All
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedRarity === 'Bronze' ? 'solid' : 'outline'
                      }
                      colorScheme="orange"
                      onClick={() => setSelectedRarity('Bronze')}
                    >
                      Bronze
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedRarity === 'Silver' ? 'solid' : 'outline'
                      }
                      colorScheme="gray"
                      color={
                        selectedRarity === 'Silver' ? 'gray.800' : 'silver.400'
                      }
                      onClick={() => setSelectedRarity('Silver')}
                    >
                      Silver
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedRarity === 'Gold' ? 'solid' : 'outline'}
                      colorScheme="yellow"
                      onClick={() => setSelectedRarity('Gold')}
                    >
                      Gold
                    </Button>
                    <Button
                      size="sm"
                      variant={selectedRarity === 'Ruby' ? 'solid' : 'outline'}
                      colorScheme="red"
                      onClick={() => setSelectedRarity('Ruby')}
                    >
                      Ruby
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedRarity === 'Diamond' ? 'solid' : 'outline'
                      }
                      colorScheme="cyan"
                      onClick={() => setSelectedRarity('Diamond')}
                    >
                      Diamond
                    </Button>
                    <Button
                      size="sm"
                      variant={
                        selectedRarity === 'Special' ? 'solid' : 'outline'
                      }
                      colorScheme="purple"
                      onClick={() => setSelectedRarity('Special')}
                    >
                      Special
                    </Button>
                  </HStack>
                </VStack>

                <Droppable droppableId="card-slider" direction="vertical">
                  {(provided, snapshot) => (
                    <VStack
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      spacing={3}
                      overflowY="auto"
                      p={2}
                      bg="gray.800"
                      borderRadius="md"
                      minH="400px"
                      maxH="800px"
                      justifyContent={isLoading ? 'center' : 'flex-start'}
                      border="2px solid"
                      borderColor={
                        snapshot.isDraggingOver ? 'blue.400' : 'gray.600'
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
                            templateColumns="repeat(auto-fit, minmax(170px, 1fr))"
                            gap={3}
                            w="100%"
                          >
                            {availablePlayers.map((card, index) => (
                              <Draggable
                                key={card.id}
                                draggableId={card.id}
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
            </HStack>
          </>
        )}
      </VStack>
    </DragDropContext>
  )
}

export default LineupDetails
