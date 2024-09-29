import React, { useRef, useState } from 'react'
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
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { POST } from '@constants/http-methods'
import { useFormik } from 'formik'
import { useQueryClient } from 'react-query'
import { useSession } from 'contexts/AuthContext'

export default function ClaimCardDialog({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const { session } = useSession()
  const [formError, onFormError] = useState<string>(null)
  const cancelRef = useRef(null)
  const queryClient = useQueryClient()
  const { mutateAsync: claimCard } = mutation<void, { cardID: number }>({
    mutationFn: ({ cardID }) =>
      axios({
        method: POST,
        url: `/api/v3/cards/${cardID}/claim`,
        headers: { Authorization: `Bearer ${session?.token}` },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['cards'])
      onClose()
    },
  })

  const { isSubmitting, isValid, handleSubmit } = useFormik({
    initialValues: {},
    onSubmit: async ({}, { setSubmitting }) => {
      try {
        setSubmitting(true)
        onFormError(null)
        await claimCard({ cardID: card.cardID })
      } catch (error) {
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
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Claim Card #{card.cardID} - {card.player_name}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <form onSubmit={handleSubmit}>
              <Button
                disabled={!isValid || isSubmitting}
                colorScheme="green"
                type="submit"
                ml={3}
              >
                Claim Card
              </Button>
            </form>
            {formError && (
              <Alert status="error">
                <AlertIcon /> {formError}
              </Alert>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}