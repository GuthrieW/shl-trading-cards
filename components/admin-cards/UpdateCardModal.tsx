import React from 'react'
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { PATCH } from '@constants/http-methods'

const updateValidationSchema = Yup.object({}).shape({})

type UpdateFormValues = Yup.InferType<typeof updateValidationSchema>

export default function UpdateCardModal({
  card,
  isOpen,
  onClose,
}: {
  card: Card
  isOpen: boolean
  onClose: () => void
}) {
  const { mutate: updateCard } = mutation<
    void,
    { cardID: number; cardUpdates: Partial<Card> }
  >({
    mutationFn: ({ cardID, cardUpdates }) =>
      axios({
        method: PATCH,
        url: 'api/v3/card',
        data: { cardID, cardUpdates },
      }),
  })

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    isValid,
    handleSubmit,
  } = useFormik({
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {},
    onSubmit: async ({}, { setSubmitting }) => {
      try {
        setSubmitting(true)
        const valuesToUpdate = Object.entries(values).filter(
          ([key, value]) => value === card[key]
        )
        console.log('card', card)
        console.log('values', values)
        console.log('valuesToUpdate', valuesToUpdate)
        // updateCard({ cardID: card.cardID, cardUpdates: { ...card, ...values } })
      } catch (error) {
        console.error(error)
        const errorMessage: string =
          'message' in error
            ? error.message
            : 'Error updating card, please message caltroit_red_flames on Discord'
      }
    },
    validationSchema: updateValidationSchema,
  })

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update Card</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}></form>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
            <Button colorScheme="red">Submit Update</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}
