import {
  SimpleGrid,
  Box,
  useDisclosure,
  useToast,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  Flex,
  Text,
  Button,
  ButtonGroup,
  useBreakpointValue,
} from '@chakra-ui/react'
import { binderCards } from '@pages/api/v3'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import CardSelectionGrid from './CardSelectionGrid'
import { useSession } from 'contexts/AuthContext'
import { TradeCard } from '@pages/api/v3/trades/collection/[uid]'
import Image from 'next/image'

interface UpdateBinderProps {
  bid: string
  currentCards: (binderCards | null)[]
  onClose: () => void
}

const UpdateBinder = ({ bid, currentCards, onClose }: UpdateBinderProps) => {
  const { isOpen, onOpen, onClose: onDrawerClose } = useDisclosure()
  const [displayCards, setDisplayCards] = useState<(binderCards | null)[]>([])
  const [selectedPosition, setSelectedPosition] = useState<number | null>(null)
  const [hasChanges, setHasChanges] = useState(false)
  const toast = useToast()
  const queryClient = useQueryClient()
  const { session } = useSession()

  const isMobile = useBreakpointValue({ base: true, md: false })

  useEffect(() => {
    const savedCards = localStorage.getItem(`binder-${bid}`)
    if (savedCards) {
      setDisplayCards(JSON.parse(savedCards))
    } else {
      setDisplayCards([...currentCards])
    }
  }, [currentCards, bid])

  useEffect(() => {
    localStorage.setItem(`binder-${bid}`, JSON.stringify(displayCards))
  }, [displayCards, bid])

  const resetBinder = () => {
    localStorage.removeItem(`binder-${bid}`)
    setDisplayCards([...currentCards])
    setHasChanges(false)
  }

  const updateBinder = useMutation(
    async (updates: {
      cards: { binderID: string; ownedCardID: string; position: number }[]
      removedPositions: number[]
    }) => {
      const response = await axios.put(
        `/api/v3/binder/${bid}/update`,
        {
          cards: updates.cards,
          removedPositions: updates.removedPositions,
        },
        {
          headers: { Authorization: `Bearer ${session?.token}` },
        }
      )

      return response.data
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['binderData', bid])
        toast({
          title: 'Binder updated',
          status: 'success',
          duration: 3000,
        })
        setHasChanges(false)
        onClose()
      },
    }
  )

  const handleRemoveCard = (position: number) => {
    const updatedCards = [...displayCards]
    updatedCards[position - 1] = null
    setDisplayCards(updatedCards)
    setHasChanges(true)
  }

  const handleCardSelect = (card: TradeCard) => {
    if (selectedPosition === null) return

    const updatedCards = [...displayCards]
    const newCard: binderCards = {
      ...card,
      position: selectedPosition,
      binderID: Number(bid),
      playerID: 0,
      season: 0,
    }

    updatedCards[selectedPosition - 1] = newCard

    setDisplayCards(updatedCards)
    setHasChanges(true)
    setSelectedPosition(selectedPosition + 1)
  }

  const handleSave = () => {
    const removedPositions = displayCards
      .map((card, index) => (card === null ? index + 1 : null))
      .filter((pos): pos is number => pos !== null)

    const cardsToUpdate = displayCards
      .filter((card): card is binderCards => card !== null)
      .map((card) => ({
        binderID: bid,
        ownedCardID: String(card.ownedCardID),
        position: card.position,
      }))

    updateBinder.mutate({
      cards: cardsToUpdate,
      removedPositions: removedPositions,
    })
    localStorage.removeItem(`binder-${bid}`)
  }

  const hasSelectedCards = () => {
    return displayCards.some((card) => card !== null)
  }

  return (
    <Box>
      {!hasSelectedCards() && (
        <Text className="text-red200 text-sm md:text-base lg:text-lg pb-2">
          Must have at least 1 card in your binder
        </Text>
      )}
      <Flex className="flex flex-wrap flex-row-reverse gap-2 items-center pb-2">
        <ButtonGroup>
          <Button colorScheme="red" onClick={resetBinder}>
            Reset Binder
          </Button>
          <Button
            colorScheme="green"
            onClick={handleSave}
            isDisabled={!hasChanges || !hasSelectedCards()}
          >
            Save Changes
          </Button>
        </ButtonGroup>
      </Flex>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
        {displayCards.map((card, index) => (
          <Box
            key={index}
            draggable
            position="relative"
            cursor="move"
            _hover={{ opacity: 0.8 }}
            h={{ base: 'auto', md: '40vh', lg: '50vh' }}
            border="2px"
            borderColor="gray.200"
            borderRadius="lg"
            p={2}
            className="bg-secondary"
            shadow="md"
          >
            {card ? (
              <Flex direction={{ base: 'column', md: 'column' }} h="full">
                <Box
                  position="relative"
                  w="full"
                  h={{ base: '30vh', md: 'full' }}
                  mb={{ base: 2, md: 0 }}
                >
                  <Image
                    className="select-none rounded-lg"
                    src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                    alt={card.player_name}
                    loading="lazy"
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                  {!isMobile && (
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      zIndex={10}
                      className="bg-primary"
                      p={1}
                      borderRadius="md"
                      shadow="sm"
                    >
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        gap={2}
                        flexDirection="row"
                      >
                        <Button
                          size="sm"
                          colorScheme="blue"
                          onClick={() => {
                            setSelectedPosition(index + 1)
                            onOpen()
                          }}
                        >
                          Replace
                        </Button>
                        <Button
                          size="sm"
                          colorScheme="red"
                          onClick={() => handleRemoveCard(index + 1)}
                        >
                          Remove
                        </Button>
                      </Flex>
                    </Box>
                  )}
                </Box>
                {isMobile && (
                  <Flex
                    className="bg-primary"
                    p={1}
                    borderRadius="md"
                    shadow="sm"
                    gap={2}
                    justifyContent="center"
                  >
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedPosition(index + 1)
                        onOpen()
                      }}
                      className="!text-xs"
                    >
                      Replace
                    </Button>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleRemoveCard(index + 1)}
                      className="!text-xs"
                    >
                      Remove
                    </Button>
                  </Flex>
                )}
              </Flex>
            ) : (
              <Flex direction={{ base: 'column', md: 'column' }} h="full">
                <Box
                  position="relative"
                  w="full"
                  h={{ base: '30vh', md: 'full' }}
                  mb={{ base: 2, md: 0 }}
                  onClick={() => {
                    setSelectedPosition(index + 1)
                    onOpen()
                  }}
                >
                  <Image
                    className="select-none rounded-lg"
                    src="/cardback.png"
                    alt="Card Placeholder"
                    loading="lazy"
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    style={{ objectFit: 'contain' }}
                  />
                  {!isMobile && (
                    <Box
                      position="absolute"
                      top={2}
                      right={2}
                      className="bg-primary"
                      p={1}
                      borderRadius="md"
                      shadow="sm"
                    >
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => {
                          setSelectedPosition(index + 1)
                          onOpen()
                        }}
                      >
                        Add Card
                      </Button>
                    </Box>
                  )}
                </Box>
                {isMobile && (
                  <Flex
                    className="bg-primary"
                    p={1}
                    borderRadius="md"
                    shadow="sm"
                    justifyContent="center"
                  >
                    <Button
                      size="sm"
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedPosition(index + 1)
                        onOpen()
                      }}
                    >
                      Add Card
                    </Button>
                  </Flex>
                )}
              </Flex>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <Drawer
        placement={isMobile ? 'right' : 'bottom'}
        isOpen={isOpen}
        onClose={onDrawerClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent overflow="hidden" overflowY="scroll">
          <DrawerCloseButton className="bg-primary" />
          <DrawerHeader className="border-b-8 border-b-blue700 bg-secondary p-4 text-lg font-bold text-secondaryText sm:text-xl">
            {selectedPosition !== null
              ? `Select Card for Position ${selectedPosition}`
              : 'Select Card'}
          </DrawerHeader>
          <DrawerBody className="bg-primary text-secondary">
            <CardSelectionGrid
              handleCardSelect={handleCardSelect}
              displayCards={displayCards}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default UpdateBinder
