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
  Image,
  useToast,
} from '@chakra-ui/react'
import {
  warningToastOptions,
  errorToastOptions,
  successToastOptions,
} from '@utils/toast'
import { CardInfo } from '@components/common/CardInfo'
import GetUsername from '@components/common/GetUsername'

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
      toast({
        title: 'Approved Card Image',
        ...successToastOptions,
      })
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
      toast({
        title: 'Denied Card Image, talk with the card author',
        ...errorToastOptions,
      })
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
            Process Image #{card.cardID} &nbsp;
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody className="!bg-primary !div-secondary">
            <div className="text-secondary">
              Author: &nbsp;
              <GetUsername userID={card.author_userID} />
            </div>
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
            <CardInfo card={card} />
          </AlertDialogBody>
          <AlertDialogFooter className="!bg-primary !div-secondary">
            {formError && (
              <Alert className="text-white" status="error">
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
