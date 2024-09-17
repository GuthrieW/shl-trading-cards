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

export default function RemoveCardImageDialog({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const { mutate: deleteCardImage } = mutation<void, { cardID: number }>({
    mutationFn: ({ cardID }) =>
      axios({
        method: DELETE,
        url: 'api/v3/card/image',
        data: { cardID },
      }),
  })
  const cancelRef = useRef(null)

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize="lg" fontWeight="bold">
            Remove Image From Card #{card.cardID}
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
                deleteCardImage({ cardID: card.cardID })
                onClose()
              }}
              ml={3}
            >
              Remove Image
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
