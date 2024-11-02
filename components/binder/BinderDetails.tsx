import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'
import {
  Box,
  Image,
  SimpleGrid,
  Skeleton,
  Text,
  Button,
  Checkbox,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useToast,
} from '@chakra-ui/react'
import { useSession } from 'contexts/AuthContext'
import TablePagination from '@components/table/TablePagination'
import { binderCards } from '@pages/api/v3'
import axios from 'axios'
import UpdateBinder from './UpdateBinder'
import { BINDER_CONSTANTS } from 'lib/constants'
import CardLightBoxModal from '@components/modals/CardLightBoxModal'

const BinderDetailPage = ({
  bid,
  userID,
}: {
  bid: string
  userID: number | null
}) => {
  const router = useRouter()
  const { session } = useSession()
  const { updateBinder } = router.query as { updateBinder?: boolean }
  const [currentPage, setCurrentPage] = useState(1)
  const [isDeleteConfirmed, setIsDeleteConfirmed] = useState(false)
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()
  const {
    isOpen: isUpdateOpen,
    onOpen: onUpdateOpen,
    onClose: onUpdateClose,
  } = useDisclosure()
  const toast = useToast()
  const [lightBoxIsOpen, setLightBoxIsOpen] = useState<boolean>(false)
  const [selectedCard, setSelectedCard] = useState<binderCards | null>(null)

  useEffect(() => {
    if (updateBinder) {
      onUpdateOpen()
    }
  }, [updateBinder, onUpdateOpen])

  const { data: binderData, isLoading: binderLoading } = useQuery<
    binderCards[]
  >(
    ['binderData', bid],
    async () => {
      const response = await fetch(`/api/v3/binder/${bid}`)
      const data = await response.json()
      if (data.status === 'success') {
        return data.payload
      }
      throw new Error('Failed to fetch binder')
    },
    {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  )

  const handleDeleteBinder = async () => {
    if (isDeleteConfirmed) {
      await axios.delete(`/api/v3/binder/${bid}/delete`, {
        headers: { Authorization: `Bearer ${session?.token}` },
        data: {
          bid: bid,
        },
      })
      onDeleteClose()
      router.push(`/binder`)
      toast({
        title: 'Successfully Deleted Binder',
        status: 'success',
      })
    }
  }

  const fullBinderData: (binderCards | null)[] = Array.from(
    { length: BINDER_CONSTANTS.TOTAL_POSITIONS },
    () => null
  )
  if (binderData && Array.isArray(binderData)) {
    binderData.forEach((card: binderCards) => {
      if (
        card.position >= 1 &&
        card.position <= BINDER_CONSTANTS.TOTAL_POSITIONS
      ) {
        fullBinderData[card.position - 1] = card
      }
    })
  }

  const currentCards: (binderCards | null)[] = fullBinderData.slice(
    (currentPage - 1) * BINDER_CONSTANTS.ROWS_PER_PAGE,
    currentPage * BINDER_CONSTANTS.ROWS_PER_PAGE
  )
  const totalRows = fullBinderData.length
  return (
    <Box>
      {userID === Number(session?.userId) && (
        <Box display="flex" justifyContent="space-between" mb={4}>
          <Button colorScheme="blue" onClick={onUpdateOpen}>
            Update Binder
          </Button>
          <Button colorScheme="red" onClick={onDeleteOpen}>
            Delete Binder
          </Button>
        </Box>
      )}

      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
        {binderLoading
          ? Array.from({ length: BINDER_CONSTANTS.ROWS_PER_PAGE }).map(
              (_, index) => (
                <Box key={index} textAlign="center">
                  <Skeleton height="200px" width="full" />
                  <Skeleton height="20px" mt="2" />
                  <Skeleton height="20px" mt="1" />
                </Box>
              )
            )
          : currentCards.map((card, index) => (
              <Box
                key={index}
                tabIndex={0}
                role="button"
                aria-label={
                  card
                    ? `Card of ${card.player_name}, rarity ${card.card_rarity}`
                    : 'Card Placeholder'
                }
                onClick={() => {
                  if (!binderLoading && card) {
                    setSelectedCard(card)
                    setLightBoxIsOpen(true)
                  }
                }}
                className="m-4 relative transition ease-linear shadow-none hover:scale-105 hover:shadow-xl"
                textAlign="center"
              >
                {card ? (
                  <>
                    <Image
                      className="cursor-pointer select-none w-full max-w-xs sm:max-w-sm"
                      src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                      alt={card.player_name}
                    />
                    <Text>{card.player_name}</Text>
                    <Text>{card.card_rarity}</Text>
                  </>
                ) : (
                  <Image
                    className="cursor-pointer select-none w-full max-w-xs sm:max-w-sm"
                    src="/cardback.png"
                    alt="Card Placeholder"
                  />
                )}
              </Box>
            ))}
      </SimpleGrid>

      {!binderLoading && (
        <TablePagination
          totalRows={totalRows}
          rowsPerPage={BINDER_CONSTANTS.ROWS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Update Binder Modal */}
      {!binderLoading && userID === Number(session?.userId) && (
        <Modal isOpen={isUpdateOpen} onClose={onUpdateClose} size="full">
          <ModalOverlay />
          <ModalContent maxW="90vw" maxH="90vh">
            <ModalHeader className="bg-primary text-secondary">
              Update Binder
            </ModalHeader>
            <ModalBody className="bg-primary text-secondary" overflow="auto">
              <UpdateBinder
                bid={bid}
                currentCards={fullBinderData}
                onClose={onUpdateClose}
              />
            </ModalBody>
            <ModalFooter className="bg-primary text-secondary">
              <Button colorScheme="blue" onClick={onUpdateClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}

      {lightBoxIsOpen && (
        <CardLightBoxModal
          cardName={selectedCard.player_name}
          cardImage={selectedCard.image_url}
          owned={1}
          rarity={selectedCard.card_rarity}
          playerID={selectedCard.playerID}
          cardID={selectedCard.cardID}
          userID={String(selectedCard.userID)}
          setShowModal={() => setLightBoxIsOpen(false)}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader className="bg-primary text-secondary">
            Confirm Delete
          </ModalHeader>
          <ModalBody className="bg-primary text-secondary">
            <Text>Are you sure you want to delete this binder?</Text>
            <Checkbox
              mt={4}
              isChecked={isDeleteConfirmed}
              onChange={() => setIsDeleteConfirmed(!isDeleteConfirmed)}
            >
              I acknowledge that this action cannot be undone.
            </Checkbox>
          </ModalBody>
          <ModalFooter className="bg-primary text-secondary">
            <Button colorScheme="blue" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteBinder}
              isDisabled={!isDeleteConfirmed}
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default BinderDetailPage
