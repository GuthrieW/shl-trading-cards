import React, { useState } from 'react'
import {
  Alert,
  AlertIcon,
  Button,
  FormLabel,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useToast,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { PATCH } from '@constants/http-methods'
import Input from '@components/forms/Input'
import Select from '@components/forms/Select'
import { rarityMap } from '@constants/rarity-map'
import positionMap from '@constants/position-map'
import { useQueryClient } from 'react-query'
import { errorToastOptions, successToastOptions } from '@utils/toast'

const updateValidationSchema = Yup.object({}).shape({
  cardID: Yup.number().integer().required('Card ID is required'),
  teamID: Yup.number().integer().required('Team ID is required'),
  playerID: Yup.number().integer().required('Player ID is required'),
  author_userID: Yup.number().integer().optional(),
  card_rarity: Yup.string().required('Rarity is required'),
  sub_type: Yup.string(),
  player_name: Yup.string().required('Player Name'),
  render_name: Yup.string().optional(),
  pullable: Yup.number()
    .integer()
    .min(0)
    .max(1)
    .required('Pullable is required'),
  approved: Yup.number()
    .integer()
    .min(0)
    .max(1)
    .required('Approved is required'),
  image_url: Yup.string().optional(),
  position: Yup.string()
    .matches(/(F|D|G)/)
    .required(),
  overall: Yup.number()
    .integer()
    .min(1)
    .max(99)
    .required('Overall is required'),
  skating: Yup.number().integer().min(1).max(20).optional(),
  shooting: Yup.number().integer().min(1).max(20).optional(),
  hands: Yup.number().integer().min(1).max(20).optional(),
  checking: Yup.number().integer().min(1).max(20).optional(),
  defense: Yup.number().integer().min(1).max(20).optional(),
  high_shots: Yup.number().integer().min(1).max(20).optional(),
  low_shots: Yup.number().integer().min(1).max(20).optional(),
  quickness: Yup.number().integer().min(1).max(20).optional(),
  control: Yup.number().integer().min(1).max(20).optional(),
  conditioning: Yup.number().integer().min(1).max(20).optional(),
  season: Yup.number().integer().min(1).optional(),
  author_paid: Yup.number()
    .integer()
    .min(0)
    .max(1)
    .required('Author Paid is required'),
})

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
  const [formError, setFormError] = useState<string>('')
  const queryClient = useQueryClient()
  const toast = useToast()

  const { mutateAsync: updateCard } = mutation<
    void,
    { cardID: number; card: Partial<Card> }
  >({
    mutationFn: ({ cardID, card }) =>
      axios({
        method: PATCH,
        url: `/api/v3/cards/${cardID}`,
        data: { card },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['cards'])
      onClose()
    },
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
  } = useFormik<UpdateFormValues>({
    enableReinitialize: true,
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {
      cardID: card.cardID ?? undefined,
      teamID: card.teamID ?? undefined,
      playerID: card.playerID ?? undefined,
      author_userID: card.author_userID ?? undefined,
      card_rarity: card.card_rarity ?? undefined,
      sub_type: card.sub_type ?? undefined,
      player_name: card.player_name ?? undefined,
      render_name: card.render_name ?? undefined,
      pullable: card.pullable ?? undefined,
      approved: card.approved ?? undefined,
      image_url: card.image_url ?? undefined,
      position: card.position ?? undefined,
      overall: card.overall ?? undefined,
      skating: card.skating ?? undefined,
      shooting: card.shooting ?? undefined,
      hands: card.hands ?? undefined,
      checking: card.checking ?? undefined,
      defense: card.defense ?? undefined,
      high_shots: card.high_shots ?? undefined,
      low_shots: card.low_shots ?? undefined,
      quickness: card.quickness ?? undefined,
      control: card.control ?? undefined,
      conditioning: card.conditioning ?? undefined,
      season: card.season ?? undefined,
      author_paid: card.author_paid ?? undefined,
    },
    onSubmit: async (cardUpdates: Card, { setSubmitting }) => {
      try {
        await updateValidationSchema.validate(cardUpdates)
      } catch (error) {
        console.error(error)
        setFormError(String(error))
        return
      }

      try {
        setSubmitting(true)
        setFormError(null)

        await updateCard({ cardID: card.cardID, card: cardUpdates })
        toast({
          title: 'Sucessfully Updated Card',
          ...successToastOptions,
        })
      } catch (error) {
        console.error(error)
        toast({
          title: 'Error Updating Card',
          ...errorToastOptions,
        })
        const errorMessage: string =
          'message' in error
            ? error.message
            : 'Error updating card, please message caltroit_red_flames on Discord'
        setFormError(errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <Modal size="6xl" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent className="!bg-primary !text-secondary">
        <ModalHeader fontSize="xx-large">
          Update Card #{card.cardID}
        </ModalHeader>
        <ModalCloseButton />
        {formError && (
          <Alert className="text-white" status="error">
            <AlertIcon />
            {formError}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <ModalBody className="flex flex-row">
            <Stack className="mx-2">
              <FormLabel fontSize="x-large">Player Data</FormLabel>
              <Input
                label="Player Name"
                value={values.player_name}
                disabled={isSubmitting}
                type="string"
                name="player_name"
                isInvalid={!!errors.player_name && touched.player_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Render Name"
                value={values.render_name}
                disabled={isSubmitting}
                type="string"
                name="render_name"
                isInvalid={!!errors.render_name && touched.render_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Player ID"
                value={values.playerID}
                disabled={isSubmitting}
                type="number"
                name="playerID"
                isInvalid={!!errors.playerID && touched.playerID}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Team ID"
                value={values.teamID}
                disabled={isSubmitting}
                type="number"
                name="teamID"
                isInvalid={!!errors.teamID && touched.teamID}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Select
                name="position"
                disabled={isSubmitting}
                value={values.position}
                label="Position"
                options={Object.values(positionMap).map((position) => ({
                  id: position.value,
                  name: position.label,
                }))}
                placeholder="Select Position"
                isInvalid={!!errors.position && touched.position}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Season"
                value={values.season}
                disabled={isSubmitting}
                type="number"
                name="season"
                isInvalid={!!errors.season && touched.season}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Stack>
            <Stack className="mx-2">
              <FormLabel fontSize="x-large">Card Data</FormLabel>
              <Input
                label="Card ID"
                value={values.cardID}
                disabled={true}
                type="number"
                name="cardID"
                isInvalid={!!errors.cardID && touched.cardID}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Author ID"
                value={values.author_userID}
                disabled={isSubmitting}
                type="number"
                name="author_userID"
                isInvalid={!!errors.author_userID && touched.author_userID}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Select
                name="card_rarity"
                disabled={isSubmitting}
                value={values.card_rarity}
                label="Rarity"
                options={Object.values(rarityMap).map((rarity) => ({
                  id: rarity.value,
                  name: rarity.label,
                }))}
                placeholder="Select Rarity"
                isInvalid={!!errors.card_rarity && touched.card_rarity}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Sub Rarity"
                value={values.sub_type}
                disabled={isSubmitting}
                type="string"
                name="sub_type"
                isInvalid={!!errors.sub_type && touched.sub_type}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Approved"
                value={values.approved}
                disabled={isSubmitting}
                type="number"
                name="approved"
                isInvalid={!!errors.approved && touched.approved}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Pullable"
                value={values.pullable}
                disabled={isSubmitting}
                type="number"
                name="pullable"
                isInvalid={!!errors.pullable && touched.pullable}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                label="Author Paid"
                value={values.author_paid}
                disabled={isSubmitting}
                type="number"
                name="author_paid"
                isInvalid={!!errors.author_paid && touched.author_paid}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Input
                disabled={true}
                label="Image URL"
                value={values.image_url}
                type="string"
                name="image_url"
                isInvalid={!!errors.image_url && touched.image_url}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Stack>
            <Stack className="mx-2">
              <FormLabel fontSize="x-large">Player Attributes</FormLabel>
              <Input
                label="Overall"
                value={values.overall}
                disabled={isSubmitting}
                type="number"
                name="overall"
                isInvalid={!!errors.overall && touched.overall}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {values.position === 'F' || values.position === 'D' ? (
                <>
                  <Input
                    label="Skating"
                    value={values.skating}
                    disabled={isSubmitting}
                    type="number"
                    name="skating"
                    isInvalid={!!errors.skating && touched.skating}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Shooting"
                    value={values.shooting}
                    disabled={isSubmitting}
                    type="number"
                    name="shooting"
                    isInvalid={!!errors.shooting && touched.shooting}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Hands"
                    value={values.hands}
                    disabled={isSubmitting}
                    type="number"
                    name="hands"
                    isInvalid={!!errors.hands && touched.hands}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Checking"
                    value={values.checking}
                    disabled={isSubmitting}
                    type="number"
                    name="checking"
                    isInvalid={!!errors.checking && touched.checking}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Defense"
                    value={values.defense}
                    disabled={isSubmitting}
                    type="number"
                    name="defense"
                    isInvalid={!!errors.defense && touched.defense}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </>
              ) : (
                <>
                  <Input
                    label="High Shots"
                    value={values.high_shots}
                    disabled={isSubmitting}
                    type="number"
                    name="high_shots"
                    isInvalid={!!errors.high_shots && touched.high_shots}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Low Shots"
                    value={values.low_shots}
                    disabled={isSubmitting}
                    type="number"
                    name="low_shots"
                    isInvalid={!!errors.low_shots && touched.low_shots}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Quickness"
                    value={values.quickness}
                    disabled={isSubmitting}
                    type="number"
                    name="quickness"
                    isInvalid={!!errors.quickness && touched.quickness}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Control"
                    value={values.control}
                    disabled={isSubmitting}
                    type="number"
                    name="control"
                    isInvalid={!!errors.control && touched.control}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <Input
                    label="Conditioning"
                    value={values.conditioning}
                    disabled={isSubmitting}
                    type="number"
                    name="conditioning"
                    isInvalid={!!errors.conditioning && touched.conditioning}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </>
              )}
            </Stack>
            {card.image_url && (
              <Stack className="flex justify-center items-center">
                <Image
                  className={`cursor-pointer`}
                  src={`https://simulationhockey.com/tradingcards/${card.image_url}`}
                  fallback={
                    <div className="relative z-10">
                      <Image src="/cardback.png" />
                      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-20"></div>
                    </div>
                  }
                  alt={`${card.player_name} Card`}
                />
              </Stack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button mr={3} onClick={onClose}>
              Close
            </Button>
            <Button
              colorScheme="green"
              type="submit"
              disabled={!isValid || isSubmitting}
              isLoading={isSubmitting}
              loadingText="Submitting..."
            >
              Submit Update
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
