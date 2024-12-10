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
  useToast,
} from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { useSession } from 'contexts/AuthContext'
import { useFormik } from 'formik'
import { useRef, useState } from 'react'
import { useQueryClient } from 'react-query'
import { errorToastOptions, successToastOptions } from '@utils/toast'

export default function MisprintDialog({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const [formError, onFormError] = useState<string>(null)
  const { session } = useSession()
  const cancelRef = useRef(null)
  const queryClient = useQueryClient()
  const toast = useToast()

  const { mutateAsync: misprintCard } = mutation<void, { cardID: number }>({
    mutationFn: ({ cardID }) =>
      axios({
        headers: { Authorization: `Bearer ${session?.token}` },
        method: POST,
        url: `/api/v3/cards/${cardID}/misprint`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['cards'])
      toast({
        title: 'Succesfully set card as misprint',
        ...successToastOptions,
      })
      onClose()
    },
  })

  const { isSubmitting, isValid, handleSubmit } = useFormik({
    initialValues: {},
    onSubmit: async ({}, { setSubmitting }) => {
      try {
        setSubmitting(true)
        onFormError(null)
        await misprintCard({ cardID: card.cardID })
      } catch (error) {
        toast({
          title: 'Issue setting card as misprint',
          ...errorToastOptions,
        })
        console.error(error)
        const errorMessage: string =
          'message' in error
            ? error.message
            : 'Error submitting, please message caltroit_red_flames on Discord'
        onFormError(errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader className="bg-primary text-secondary">
            Set Card as Misprint #{card.cardID}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody className="bg-primary text-secondary">
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>
          <AlertDialogFooter className="bg-primary text-secondary">
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <form onSubmit={handleSubmit}>
              <Button
                disabled={!isValid || isSubmitting}
                colorScheme="red"
                type="submit"
                ml={3}
              >
                Misprint Card
              </Button>
            </form>
            {formError && (
              <Alert className="text-white" status="error">
                <AlertIcon /> {formError}
              </Alert>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
