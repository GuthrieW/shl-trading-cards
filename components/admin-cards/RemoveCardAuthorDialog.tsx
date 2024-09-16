import React, { useRef } from 'react'
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
} from '@chakra-ui/react'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { DELETE } from '@constants/http-methods'

export default function RemoveCardAuthorDialog({
  cardID,
  isOpen,
  onClose,
}: {
  cardID: number
  isOpen: boolean
  onClose: () => void
}) {
  const cancelRef = useRef(null)
  const { mutate: removeCardAuthor } = mutation<void, { cardID: number }>({
    mutationFn: ({ cardID }) =>
      axios({
        method: DELETE,
        url: 'api/v3/card/author',
        data: { cardID },
      }),
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
            Remove Author From Card
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody>
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>
          <AlertDialogFooter>
            <Button ref={cancelRef} onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={() => {
                removeCardAuthor({ cardID })
                onClose()
              }}
              ml={3}
            >
              Remove Author
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
