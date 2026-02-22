import React, { useState } from 'react'
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Heading,
  Badge,
  IconButton,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
  HStack,
  Input,
  VStack,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Text,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  useColorModeValue,
} from '@chakra-ui/react'
import { EditIcon, DeleteIcon, AddIcon, DownloadIcon } from '@chakra-ui/icons'
import {
  downloadDataAsJson,
  getOverallColor,
  getRarityBoxShadow,
  getRarityTextColor,
} from './utils'
import { useSession } from 'contexts/AuthContext'
import { indexAxios, query } from '@pages/api/database/query'
import { ListResponse } from '@pages/api/v3'
import { GameLineup } from '@pages/api/v3/lineups/getLineupCollection'
import { Team } from '@pages/api/v3'
import axios from 'axios'
import { DELETE, GET } from '@constants/http-methods'
import { useDebounce } from 'use-debounce'
import { LineupCard, Lineup } from './types'

const PlayerCell: React.FC<{ player: LineupCard; teams?: Team[] }> = ({
  player,
  teams,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  // Get team abbreviation if teams data is available
  const getTeamDisplay = (teamID: number) => {
    if (!teams) return teamID.toString()
    const team = teams.find((t) => t.id === teamID)
    return team ? team.abbreviation : teamID.toString()
  }

  return (
    <Popover
      isOpen={isOpen}
      onOpen={onOpen}
      onClose={onClose}
      placement="top"
      trigger="hover"
      openDelay={100}
      closeDelay={100}
    >
      <PopoverTrigger>
        <Box
          cursor="pointer"
          transition="hover 0.2s"
          w="100%"
          overflow="hidden"
        >
          <Box
            fontWeight="bold"
            fontSize="sm"
            color={getRarityTextColor(player.card_rarity)}
            noOfLines={2}
          >
            {player.playerName}
          </Box>
          <Box
            fontSize="xs"
            color={useColorModeValue('gray.600', 'gray.400')}
            noOfLines={1}
            isTruncated
          >
            {getTeamDisplay(player.teamID)}
          </Box>
          <Badge
            colorScheme={getOverallColor(player.overall)}
            fontSize="xs"
            mt={1}
            display="inline-block"
          >
            OVR {player.overall}
          </Badge>
        </Box>
      </PopoverTrigger>
      <PopoverContent
        border="none"
        boxShadow={getRarityBoxShadow(player.card_rarity)}
      >
        <PopoverBody p={0}>
          {player.image_url && (
            <Image
              src={`https://simulationhockey.com/tradingcards/${player.image_url}`}
              alt={player.playerName}
              objectFit="cover"
              borderRadius="md"
              fallbackSrc="/base-pack-cover.png"
            />
          )}
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
}

const ROWS_PER_PAGE: number = 10 as const

const LineupList: React.FC = () => {
  const { session, loggedIn } = useSession()
  const toast = useToast()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()
  const [lineupToDelete, setLineupToDelete] = React.useState<Lineup | null>(
    null
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [tablePage, setTablePage] = useState(1)
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const [leagueID, setLeagueID] = useState<string[]>(['0'])

  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Get teams data for abbreviations
  const { payload: teamsData } = query<Team[]>({
    queryKey: ['teams'],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v2/teams?league=1&SeasonID=83`,
      }),
  })

  // Get user's lineups from API
  const {
    payload: lineupsResponse,
    isLoading,
    refetch,
  } = query<ListResponse<GameLineup>>({
    queryKey: [
      'lineups',
      session?.userId,
      typeof debouncedSearchTerm === 'string' ? debouncedSearchTerm : '',
      String(tablePage),
    ],
    queryFn: () =>
      axios({
        method: GET,
        url: `/api/v3/lineups/getLineupCollection`,
        params: {
          uid: session?.userId,
          lineupTitle: searchTerm,
          limit: ROWS_PER_PAGE,
          offset: Math.max((tablePage - 1) * ROWS_PER_PAGE, 0),
        },
      }),
    enabled: !!session?.userId && loggedIn,
  })

  const { payload: teamData, isLoading: teamDataIsLoading } = query<Team[]>({
    queryKey: ['teamData', leagueID.join(',')],
    queryFn: () =>
      indexAxios({
        method: 'GET',
        url: `/api/v2/teams?league=${leagueID}&SeasonID=83`,
      }),
  })

  // Transform API data to component format
  const lineups: Lineup[] = (lineupsResponse?.rows || []).map((gameLineup) => ({
    id: gameLineup.lineupID,
    name: gameLineup.lineupTitle,
    center: {
      playerName: gameLineup.c_playerName,
      teamID: gameLineup.c_team,
      playerID: gameLineup.c_playerID,
      cardID: gameLineup.c_cardID,
      overall: gameLineup.c_overall,
      position: gameLineup.c_position,
      image_url: gameLineup.c_image_url,
      card_rarity: gameLineup.c_card_rarity,
      sub_type: gameLineup.c_sub_type,
      render_name: gameLineup.c_render_name,
      skating: gameLineup.c_skating,
      shooting: gameLineup.c_shooting,
      hands: gameLineup.c_hands,
      checking: gameLineup.c_checking,
      defense: gameLineup.c_defense,
      high_shots: gameLineup.c_high_shots,
      low_shots: gameLineup.c_low_shots,
      quickness: gameLineup.c_quickness,
      control: gameLineup.c_control,
      conditioning: gameLineup.c_conditioning,
      season: gameLineup.c_season,
      leagueID: gameLineup.c_leagueID,
    },
    leftWing: {
      playerName: gameLineup.lw_playerName,
      teamID: gameLineup.lw_team,
      playerID: gameLineup.lw_playerID,
      cardID: gameLineup.lw_cardID,
      overall: gameLineup.lw_overall,
      position: gameLineup.lw_position,
      image_url: gameLineup.lw_image_url,
      card_rarity: gameLineup.lw_card_rarity,
      sub_type: gameLineup.lw_sub_type,
      render_name: gameLineup.lw_render_name,
      skating: gameLineup.lw_skating,
      shooting: gameLineup.lw_shooting,
      hands: gameLineup.lw_hands,
      checking: gameLineup.lw_checking,
      defense: gameLineup.lw_defense,
      high_shots: gameLineup.lw_high_shots,
      low_shots: gameLineup.lw_low_shots,
      quickness: gameLineup.lw_quickness,
      control: gameLineup.lw_control,
      conditioning: gameLineup.lw_conditioning,
      season: gameLineup.lw_season,
      leagueID: gameLineup.lw_leagueID,
    },
    rightWing: {
      playerName: gameLineup.rw_playerName,
      teamID: gameLineup.rw_team,
      playerID: gameLineup.rw_playerID,
      cardID: gameLineup.rw_cardID,
      overall: gameLineup.rw_overall,
      position: gameLineup.rw_position,
      image_url: gameLineup.rw_image_url,
      card_rarity: gameLineup.rw_card_rarity,
      sub_type: gameLineup.rw_sub_type,
      render_name: gameLineup.rw_render_name,
      skating: gameLineup.rw_skating,
      shooting: gameLineup.rw_shooting,
      hands: gameLineup.rw_hands,
      checking: gameLineup.rw_checking,
      defense: gameLineup.rw_defense,
      high_shots: gameLineup.rw_high_shots,
      low_shots: gameLineup.rw_low_shots,
      quickness: gameLineup.rw_quickness,
      control: gameLineup.rw_control,
      conditioning: gameLineup.rw_conditioning,
      season: gameLineup.rw_season,
      leagueID: gameLineup.rw_leagueID,
    },
    leftDefense: {
      playerName: gameLineup.ld_playerName,
      teamID: gameLineup.ld_team,
      playerID: gameLineup.ld_playerID,
      cardID: gameLineup.ld_cardID,
      overall: gameLineup.ld_overall,
      position: gameLineup.ld_position,
      image_url: gameLineup.ld_image_url,
      card_rarity: gameLineup.ld_card_rarity,
      sub_type: gameLineup.ld_sub_type,
      render_name: gameLineup.ld_render_name,
      skating: gameLineup.ld_skating,
      shooting: gameLineup.ld_shooting,
      hands: gameLineup.ld_hands,
      checking: gameLineup.ld_checking,
      defense: gameLineup.ld_defense,
      high_shots: gameLineup.ld_high_shots,
      low_shots: gameLineup.ld_low_shots,
      quickness: gameLineup.ld_quickness,
      control: gameLineup.ld_control,
      conditioning: gameLineup.ld_conditioning,
      season: gameLineup.ld_season,
      leagueID: gameLineup.ld_leagueID,
    },
    rightDefense: {
      playerName: gameLineup.rd_playerName,
      teamID: gameLineup.rd_team,
      playerID: gameLineup.rd_playerID,
      cardID: gameLineup.rd_cardID,
      overall: gameLineup.rd_overall,
      position: gameLineup.rd_position,
      image_url: gameLineup.rd_image_url,
      card_rarity: gameLineup.rd_card_rarity,
      sub_type: gameLineup.rd_sub_type,
      render_name: gameLineup.rd_render_name,
      skating: gameLineup.rd_skating,
      shooting: gameLineup.rd_shooting,
      hands: gameLineup.rd_hands,
      checking: gameLineup.rd_checking,
      defense: gameLineup.rd_defense,
      high_shots: gameLineup.rd_high_shots,
      low_shots: gameLineup.rd_low_shots,
      quickness: gameLineup.rd_quickness,
      control: gameLineup.rd_control,
      conditioning: gameLineup.rd_conditioning,
      season: gameLineup.rd_season,
      leagueID: gameLineup.rd_leagueID,
    },
    goalie: {
      playerName: gameLineup.g_playerName,
      teamID: gameLineup.g_team,
      playerID: gameLineup.g_playerID,
      cardID: gameLineup.g_cardID,
      overall: gameLineup.g_overall,
      position: gameLineup.g_position,
      image_url: gameLineup.g_image_url,
      card_rarity: gameLineup.g_card_rarity,
      sub_type: gameLineup.g_sub_type,
      render_name: gameLineup.g_render_name,
      skating: gameLineup.g_skating,
      shooting: gameLineup.g_shooting,
      hands: gameLineup.g_hands,
      checking: gameLineup.g_checking,
      defense: gameLineup.g_defense,
      high_shots: gameLineup.g_high_shots,
      low_shots: gameLineup.g_low_shots,
      quickness: gameLineup.g_quickness,
      control: gameLineup.g_control,
      conditioning: gameLineup.g_conditioning,
      season: gameLineup.g_season,
      leagueID: gameLineup.g_leagueID,
    },
  }))

  const handlePageChange = (newPage: number) => {
    setTablePage(newPage)
  }

  const totalPages = lineupsResponse?.total
    ? Math.ceil(lineupsResponse.total / ROWS_PER_PAGE)
    : 1

  const handleCreateLineup = () => {
    window.location.href = '/lineups/create'
  }

  const handleEditLineup = (lineupId: number) => {
    window.location.href = `/lineups/${lineupId}/edit`
  }

  const handleDeleteLineup = (lineup: Lineup) => {
    setLineupToDelete(lineup)
    onDeleteOpen()
  }

  const confirmDeleteLineup = async () => {
    if (lineupToDelete) {
      try {
        await axios({
          method: DELETE,
          url: '/api/v3/lineups/deleteLineup',
          data: { lineupID: lineupToDelete.id },
          headers: {
            Authorization: `Bearer ${session?.token}`,
          },
        })

        toast({
          title: 'Lineup deleted',
          description: `"${lineupToDelete.name}" has been deleted.`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        refetch()
        onDeleteClose()
      } catch (error: any) {
        console.error('Error deleting lineup:', error)
        toast({
          title: 'Error deleting lineup',
          description:
            error.response?.data?.message || 'Failed to delete lineup',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
  }

  const handleExportLineup = (lineup: Lineup) => {
    const exportData = {
      id: lineup.id,
      name: lineup.name,
      positions: {
        center: lineup.center,
        leftWing: lineup.leftWing,
        rightWing: lineup.rightWing,
        leftDefense: lineup.leftDefense,
        rightDefense: lineup.rightDefense,
        goalie: lineup.goalie,
      },
      exportedAt: new Date().toISOString(),
    }

    downloadDataAsJson(
      exportData,
      `${lineup.name.replace(/\s+/g, '_')}_lineup.json`
    )
  }

  return (
    <Box p={4}>
      {!loggedIn && (
        <Alert status="warning" bg="yellow.800" color="white">
          <AlertIcon color="yellow.500" />
          Please log in to view your card collection and create lineups.
        </Alert>
      )}

      {loggedIn && (
        <HStack justify="space-between" align="center" mb={10}>
          <Heading size="lg">Your Lineups</Heading>
          <Button
            leftIcon={<AddIcon />}
            colorScheme="blue"
            onClick={handleCreateLineup}
          >
            Create New Lineup
          </Button>
        </HStack>
      )}

      {loggedIn && isLoading && (
        <Box textAlign="center" py={8}>
          <Spinner size="xl" color="blue.500" />
        </Box>
      )}

      {loggedIn && !isLoading && (
        <TableContainer>
          <Table
            variant="simple"
            size="sm"
            sx={{
              '& td, & th': {
                borderColor: useColorModeValue('gray.400', 'gray.600'),
              },
            }}
          >
            <Thead>
              <Tr>
                <Th fontWeight="bold" fontSize="md">
                  Name
                </Th>
                <Th fontWeight="bold" fontSize="md">
                  Left Wing
                </Th>
                <Th fontWeight="bold" fontSize="md">
                  Center
                </Th>
                <Th fontWeight="bold" fontSize="md">
                  Right Wing
                </Th>
                <Th fontWeight="bold" fontSize="md">
                  Left Defense
                </Th>
                <Th fontWeight="bold" fontSize="md">
                  Right Defense
                </Th>
                <Th fontWeight="bold" fontSize="md">
                  Goalie
                </Th>
                <Th fontWeight="bold" fontSize="md">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {lineups.map((lineup) => (
                <Tr key={lineup.id}>
                  <Td fontWeight="bold" color="blue.600" maxW="200px" p={2}>
                    <Button
                      variant="link"
                      colorScheme="blue"
                      onClick={() => handleEditLineup(lineup.id)}
                      fontSize="md"
                      fontWeight="bold"
                      _hover={{ textDecoration: 'underline' }}
                      noOfLines={2}
                      h="auto"
                      textAlign="left"
                      maxW="200px"
                    >
                      {lineup.name}
                    </Button>
                  </Td>
                  <Td maxW="150px" p={2} overflow="hidden">
                    <PlayerCell player={lineup.leftWing} teams={teamsData} />
                  </Td>
                  <Td maxW="150px" p={2} overflow="hidden">
                    <PlayerCell player={lineup.center} teams={teamsData} />
                  </Td>
                  <Td maxW="150px" p={2} overflow="hidden">
                    <PlayerCell player={lineup.rightWing} teams={teamsData} />
                  </Td>
                  <Td maxW="150px" p={2} overflow="hidden">
                    <PlayerCell player={lineup.leftDefense} teams={teamsData} />
                  </Td>
                  <Td maxW="150px" p={2} overflow="hidden">
                    <PlayerCell
                      player={lineup.rightDefense}
                      teams={teamsData}
                    />
                  </Td>
                  <Td maxW="150px" p={2} overflow="hidden">
                    <PlayerCell player={lineup.goalie} teams={teamsData} />
                  </Td>
                  <Td>
                    <Box display="flex" gap={2}>
                      <IconButton
                        aria-label="Export lineup"
                        icon={<DownloadIcon />}
                        size="sm"
                        colorScheme="green"
                        onClick={() => handleExportLineup(lineup)}
                      />
                      <IconButton
                        aria-label="Edit lineup"
                        icon={<EditIcon />}
                        size="sm"
                        colorScheme="blue"
                        onClick={() => handleEditLineup(lineup.id)}
                      />
                      <IconButton
                        aria-label="Delete lineup"
                        icon={<DeleteIcon />}
                        size="sm"
                        colorScheme="red"
                        onClick={() => handleDeleteLineup(lineup)}
                      />
                    </Box>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>

          {lineups.length === 0 && (
            <Box
              textAlign="center"
              py={8}
              color={useColorModeValue('gray.500', 'gray.400')}
            >
              {searchTerm
                ? 'No lineups found matching your search.'
                : "You haven't created any lineups yet."}
            </Box>
          )}
        </TableContainer>
      )}

      {loggedIn && !isLoading && totalPages > 1 && (
        <HStack justify="center" mt={4} spacing={2}>
          <Button
            size="sm"
            onClick={() => handlePageChange(tablePage - 1)}
            isDisabled={tablePage <= 1}
          >
            Previous
          </Button>
          <Text color={useColorModeValue('gray.500', 'gray.300')} fontSize="sm">
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

      <AlertDialog
        isOpen={isDeleteOpen}
        leastDestructiveRef={cancelRef}
        onClose={onDeleteClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent bg="gray.900">
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Delete Lineup
            </AlertDialogHeader>

            <AlertDialogBody>
              Are you sure you want to delete "{lineupToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onDeleteClose}>
                Cancel
              </Button>
              <Button colorScheme="red" onClick={confirmDeleteLineup} ml={3}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Box>
  )
}

export default LineupList
