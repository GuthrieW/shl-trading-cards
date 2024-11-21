import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons'
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
  Image,
  Text,
  Button,
  ButtonGroup,
} from '@chakra-ui/react'
import { binderCards } from '@pages/api/v3'
import axios from 'axios'
import { useState, useEffect } from 'react'
import { useQueryClient, useMutation } from 'react-query'
import CardSelectionGrid from './CardSelectionGrid'
import { useSession } from 'contexts/AuthContext'
import { TradeCard } from '@pages/api/v3/trades/collection/[uid]'

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
          >
            {card ? (
              <>
                <Image
                  className="select-none w-full max-w-xs sm:max-w-sm"
                  src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                  alt={card.player_name}
                />
                <Text>{card.player_name}</Text>
                <Text>{card.card_rarity}</Text>
                <Box position="absolute" top={2} right={2}>
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    gap={2}
                    flexDirection={{ base: 'column', md: 'row' }}
                  >
                    <Button
                      size={{ base: 'xs', md: 'sm' }}
                      colorScheme="blue"
                      onClick={() => {
                        setSelectedPosition(index + 1)
                        onOpen()
                      }}
                    >
                      Replace
                    </Button>
                    <Button
                      size={{ base: 'xs', md: 'sm' }}
                      colorScheme="red"
                      onClick={() => handleRemoveCard(index + 1)}
                    >
                      Remove
                    </Button>
                  </Flex>
                </Box>
              </>
            ) : (
              <Box
                onClick={() => {
                  setSelectedPosition(index + 1)
                  onOpen()
                }}
              >
                <Image
                  className="select-none w-full max-w-xs sm:max-w-sm"
                  src="/cardback.png"
                  alt="Card Placeholder"
                />
                <Box position="absolute" top={2} right={2}>
                  <Button size="sm" colorScheme="blue">
                    Add Card
                  </Button>
                </Box>
              </Box>
            )}
          </Box>
        ))}
      </SimpleGrid>

      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={onDrawerClose}
        size="md"
      >
        <DrawerOverlay />
        <DrawerContent overflowY="scroll">
          <DrawerHeader
            top="0"
            zIndex="1"
            className="bg-primary text-secondary text-center md:text-lg sm:text-sm"
          >
            {selectedPosition !== null
              ? `Select Card for Position ${selectedPosition}`
              : 'Select Card'}
            <DrawerCloseButton />
          </DrawerHeader>
          <DrawerBody
            className="bg-primary text-secondary"
            maxHeight="calc(100vh - 4rem)"
          >
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
