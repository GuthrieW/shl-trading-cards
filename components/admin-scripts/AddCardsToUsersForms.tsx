import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { ToastContext } from 'contexts/ToastContext'
import { useFormik } from 'formik'
import { Fragment, useContext, useState } from 'react'
import * as Yup from 'yup'

const addCardsToJsonValidationSchema = Yup.object({}).shape({
  userId: Yup.number().integer().required('User ID is required'),
  cardId: Yup.number().integer().required('Card ID is required'),
})

type AddCardsToJsonValues = Yup.InferType<typeof addCardsToJsonValidationSchema>

export default function AddCardsToUsersForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const [cardsToAdd, setCardsToAdd] = useState<Record<string, string[]>>({})
  const { addToast } = useContext(ToastContext)

  const { mutate: addCardsToUsers, isLoading: addCardsToUsersIsLoading } =
    mutation<void, Record<string, string[]>>({
      mutationFn: (newCardsJson: Record<string, string[]>) =>
        axios({
          method: POST,
          url: '/api/v3/collection/add-cards',
          data: newCardsJson,
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
  } = useFormik<AddCardsToJsonValues>({
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {
      userId: 0,
      cardId: 0,
    },
    onSubmit: async ({ userId, cardId }, { setSubmitting }) => {
      try {
        setSubmitting(true)
        onError(null)
        if (userId === 0) throw new Error('0 is not a valid User ID')
        if (cardId === 0) throw new Error('0 is not a valid Card ID')

        setCardsToAdd((oldState) => ({
          ...oldState,
          [userId]: [...(oldState[userId] ?? []), cardId],
        }))
      } catch (error) {
        console.error(error)
        const errorMessage: string =
          'message' in error
            ? error.message
            : 'Error submitting, please message caltroit_red_flames on Discord'
        onError(errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
    validationSchema: addCardsToJsonValidationSchema,
  })

  const deleteUserId = (userId: string) => {
    setCardsToAdd((currentState) => {
      const { [userId]: _, ...rest } = currentState
      return rest
    })
  }

  const deleteCardId = (userId: string, cardId: string) => {
    setCardsToAdd((currentState) => {
      if (currentState[userId].length === 1) {
        const { [userId]: _, ...rest } = currentState
        return rest
      }

      const indexToRemove: number = cardsToAdd[userId].indexOf(cardId)
      if (indexToRemove > -1) {
        currentState[userId].splice(indexToRemove, 1)
      }

      return { ...currentState }
    })
  }

  const handleSubmitNewCards = () => {
    if (Object.keys(cardsToAdd).length === 0) {
      addToast({
        title: 'Invalid Data',
        description: 'Please include at least one card in your request',
        status: 'warning',
      })
      return
    }
    addCardsToUsers(cardsToAdd)
  }

  return (
    <div>
      <div className="flex justify-end items-center">
        <Button
          onClick={handleSubmitNewCards}
          disabled={!isValid || isSubmitting || addCardsToUsersIsLoading}
          type="button"
          className="mt-4 mx-1"
          isLoading={isSubmitting || addCardsToUsersIsLoading}
          loadingText="Submitting..."
        >
          Add New Cards to Users
        </Button>
      </div>

      <form onSubmit={handleSubmit}>
        <FormControl isInvalid={!!errors.userId && touched.userId}>
          <FormLabel>User ID</FormLabel>
          <Input
            value={values.userId}
            disabled={isSubmitting || addCardsToUsersIsLoading}
            type="number"
            isRequired={true}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={(event) => event.target.select()}
            name="userId"
            className="font-mont"
          />
        </FormControl>
        <FormControl isInvalid={!!errors.cardId && touched.cardId}>
          <FormLabel>Card ID</FormLabel>
          <Input
            value={values.cardId}
            disabled={isSubmitting || addCardsToUsersIsLoading}
            type="number"
            isRequired={true}
            onBlur={handleBlur}
            onChange={handleChange}
            onFocus={(event) => event.target.select()}
            name="cardId"
            className="font-mont"
          />
        </FormControl>

        <Button
          disabled={!isValid || isSubmitting || addCardsToUsersIsLoading}
          type="submit"
          className="mt-6 mx-1"
          isLoading={isSubmitting || addCardsToUsersIsLoading}
        >
          Add Card
        </Button>
      </form>
      <div>
        {Object.entries(cardsToAdd).map(([userId, cardIds], userIdIndex) => (
          <Fragment key={userId}>
            {'{'}
            <br />
            &nbsp;&nbsp;userId:&nbsp;
            <Button onClick={() => deleteUserId(userId)}>{userId}</Button>,
            <br />
            &nbsp;&nbsp;cardIds:&nbsp;{'['}
            {cardIds?.map((cardId, cardIdIndex) => (
              <Fragment key={`${userId}-${cardId}-${cardIdIndex}`}>
                &nbsp;
                <Button onClick={() => deleteCardId(userId, cardId)}>
                  {cardId}
                </Button>
                <span>{cardIdIndex === cardIds.length - 1 ? '' : ','}</span>
              </Fragment>
            ))}
            &nbsp;{']'}
            <br />
            {userIdIndex === Object.keys(cardsToAdd).length - 1 ? '}' : '},'}
            &nbsp;
          </Fragment>
        ))}
      </div>
    </div>
  )
}
