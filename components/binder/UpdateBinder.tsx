import { ChevronDownIcon, CheckIcon } from '@chakra-ui/icons'
import {
  SimpleGrid,
  Box,
  Badge,
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
    setDisplayCards([...currentCards])
  }, [currentCards])

  const updateBinder = useMutation(
    async (updates: {
      cards: { binderID: string; ownedCardID: string; position: number }[]
    }) => {
      const response = await axios.put(
        `/api/v3/binder/${bid}/update`,
        { cards: updates.cards },
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

  const handleCardSelect = (card: binderCards) => {
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
    onDrawerClose()
    setSelectedPosition(null)
  }

  const handleSave = () => {
    const cardsToUpdate = displayCards
      .filter((card): card is binderCards => card !== null)
      .map((card) => ({
        binderID: bid,
        ownedCardID: String(card.ownedCardID),
        position: card.position,
      }))

    updateBinder.mutate({ cards: cardsToUpdate })
  }

  const handleCancel = () => {
    setDisplayCards([...currentCards])
    setHasChanges(false)
    onClose()
  }
  return (
    <Box>
      <Flex justifyContent="flex-end" mb={4}>
        <ButtonGroup>
          <Button
            colorScheme="green"
            onClick={handleSave}
            isDisabled={!hasChanges}
          >
            Save Changes
          </Button>
          <Button onClick={handleCancel}>Cancel</Button>
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
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader className="bg-primary text-secondary">
            {selectedPosition !== null
              ? `Select Card for Position ${selectedPosition}`
              : 'Select Card'}
          </DrawerHeader>
          <DrawerBody className="bg-primary text-secondary">
            <CardSelectionGrid
              handleCardSelect={handleCardSelect}
              displayCards={displayCards}
              selectedPosition={selectedPosition}
              bid={bid}
            />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}

export default UpdateBinder
