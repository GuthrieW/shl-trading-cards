import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { useRef, useState } from 'react'
import { useQueryClient } from 'react-query'
import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Box,
  Button,
  Flex,
  Image,
  useToast,
} from '@chakra-ui/react'
import { warningToastOptions } from '@utils/toast'

export default function ProcessImageDialog({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const toast = useToast()
  const [formError, setFormError] = useState<string>(null)
  const cancelRef = useRef(null)
  const queryClient = useQueryClient()
  const { mutateAsync: approveImage, isLoading: approveIsLoading } = mutation<
    void,
    { cardID: number }
  >({
    mutationFn: ({ cardID }) =>
      axios({
        method: POST,
        url: `/api/v3/cards/${cardID}/approve`,
      }),
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries(['cards'])
    },
  })

  const { mutateAsync: denyImage, isLoading: denyIsLoading } = mutation<
    void,
    { cardID: number }
  >({
    mutationFn: ({ cardID }) =>
      axios({
        method: POST,
        url: `/api/v3/cards/${cardID}/deny`,
      }),
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries(['cards'])
    },
  })

  const handleApprove = async () => {
    if (approveIsLoading || denyIsLoading) {
      toast({ title: 'Already processing card', ...warningToastOptions })
      return
    }

    try {
      await approveImage({ cardID: card.cardID })
    } catch (error) {
      console.error(error)
      const errorMessage: string =
        'message' in error
          ? error.message
          : 'Error approving image, please message caltroit_red_flames on Discord'
      setFormError(errorMessage)
    }
  }

  const handleDeny = async () => {
    if (approveIsLoading || denyIsLoading) {
      toast({ title: 'Already processing card', ...warningToastOptions })
      return
    }

    try {
      await denyImage({ cardID: card.cardID })
    } catch (error) {
      console.error(error)
      const errorMessage: string =
        'message' in error
          ? error.message
          : 'Error denying image, please message caltroit_red_flames on Discord'
      setFormError(errorMessage)
    }
  }

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
      size={{ base: 'xs', sm: 'md', md: 'lg', lg: 'lg' }}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader
            fontSize="lg"
            fontWeight="bold"
            className="!bg-primary !div-secondary"
          >
            Process Image #{card.cardID}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody className="!bg-primary !div-secondary">
            <Image
              className="cursor-pointer select-none w-full max-w-xs sm:max-w-sm"
              src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
              fallback={
                <Box className="relative z-10">
                  <Image src="/cardback.png" />
                  <Box className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></Box>
                </Box>
              }
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="flex space-x-2">
                <span className="font-medium">Player:</span>
                <span>{card.player_name}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-medium">Rarity:</span>
                <span>{card.card_rarity}</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="flex space-x-2">
                <span className="font-medium">Position:</span>
                <span>{card.position}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-medium">Overall:</span>
                <span>{card.overall}</span>
              </div>
              <div className="flex space-x-2">
                <span className="font-medium">Season:</span>
                <span>{card.season}</span>
              </div>
            </div>
            {card.position === 'Goalie' ? (
              <div className="grid grid-cols-3 gap-5">
                <div className="flex space-x-2">
                  <span className="font-medium">High:</span>
                  <span>{card.high_shots}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-medium">Low:</span>
                  <span>{card.low_shots}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-medium">Quick:</span>
                  <span>{card.quickness}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-medium">Control:</span>
                  <span>{card.control}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-medium">Cond:</span>
                  <span>{card.conditioning}</span>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                <div className="flex space-x-2">
                  <span className="font-medium">Skating:</span>
                  <span>{card.skating}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-medium">Shooting:</span>
                  <span>{card.shooting}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-medium">Hands:</span>
                  <span>{card.hands}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-medium">Check:</span>
                  <span>{card.checking}</span>
                </div>
                <div className="flex space-x-2">
                  <span className="font-medium">Defense:</span>
                  <span>{card.defense}</span>
                </div>
              </div>
            )}
          </AlertDialogBody>
          <AlertDialogFooter className="!bg-primary !div-secondary">
            {formError && (
              <Alert status="error">
                <AlertIcon /> {formError}
              </Alert>
            )}
            <Button
              disabled={false}
              colorScheme="red"
              className=" background-transparent font-bold uppercase px-6 py-3 div-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
              onClick={handleDeny}
            >
              Deny Card
            </Button>
            <Button
              disabled={false}
              colorScheme="green"
              className="bg-emerald-500 div-white active:bg-emerald-600 font-bold uppercase div-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={handleApprove}
            >
              Accept Card
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
