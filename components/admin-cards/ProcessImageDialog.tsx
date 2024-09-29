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
  Button,
  Image,
} from '@chakra-ui/react'
import { warningToast } from '@utils/toasts'

export default function ProcessImageDialog({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
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
      warningToast({ title: 'Already processing card' })
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
      warningToast({ title: 'Already processing card' })
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
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Process Image #{card.cardID}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            <Image
              className="cursor-pointer"
              src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
              fallback={
                <div className="relative z-10">
                  <Image src="/cardback.png" />
                  <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                </div>
              }
            />
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            {formError && (
              <Alert status="error">
                <AlertIcon /> {formError}
              </Alert>
            )}
            <Button
              disabled={false}
              className="text-red-500 background-transparent font-bold uppercase px-6 py-3 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 hover:bg-red-100 rounded hover:shadow-lg"
              onClick={handleDeny}
            >
              Deny Card
            </Button>
            <Button
              disabled={false}
              className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
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
