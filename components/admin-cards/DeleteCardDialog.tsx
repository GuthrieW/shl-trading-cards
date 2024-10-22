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
} from '@chakra-ui/react'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { DELETE } from '@constants/http-methods'
import { useFormik } from 'formik'
import { useQueryClient } from 'react-query'

export default function DeleteCardDialog({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const [formError, onFormError] = useState<string>(null)
  const cancelRef = useRef(null)
  const queryClient = useQueryClient()
  const { mutateAsync: deleteCard } = mutation<void, { cardID: number }>({
    mutationFn: ({ cardID }) =>
      axios({
        method: DELETE,
        url: `/api/v3/cards/${cardID}`,
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
        await deleteCard({ cardID: card.cardID })
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
            Delete Card #{card.cardID}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>
          <AlertDialogFooter>
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
                Delete Card
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
