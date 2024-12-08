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
import { DELETE } from '@constants/http-methods'
import { useFormik } from 'formik'
import { useQueryClient } from 'react-query'
import { errorToastOptions, successToastOptions } from '@utils/toast'

export default function RemoveCardAuthorDialog({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const [formError, onFormError] = useState<string>(null)
  const queryClient = useQueryClient()
  const cancelRef = useRef(null)
  const toast = useToast()
  const { mutateAsync: removeCardAuthor } = mutation<void, { cardID: number }>({
    mutationFn: ({ cardID }) =>
      axios({
        method: DELETE,
        url: `/api/v3/cards/${cardID}/author`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['cards'])
      toast({
        title: 'Succesfully removed card author',
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
        await removeCardAuthor({ cardID: card.cardID })
      } catch (error) {
        toast({
          title: 'Issue removing card author',
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
          <AlertDialogHeader
            className="bg-primary text-secondary"
            fontSize="lg"
            fontWeight="bold"
          >
            Remove Author From Card #{card.cardID}
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
                Remove Author
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
