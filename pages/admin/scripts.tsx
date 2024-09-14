import { CloseIcon } from '@chakra-ui/icons'
import {
  Button,
  Code,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  ListItem,
  Select,
  Textarea,
  UnorderedList,
} from '@chakra-ui/react'
import { PageWrapper } from '@components/common/PageWrapper'
import { POST } from '@constants/http-methods'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { ToastContext } from 'contexts/ToastContext'
import { useFormik } from 'formik'
import { Fragment, useContext, useState } from 'react'
import * as Yup from 'yup'

type ScriptId =
  | 'add-cards-to-users'
  | 'monthly-subscriptions'
  | 'request-base-cards'
  | 'delete-duplicates'

type ScriptData = {
  id: ScriptId
  name: string
}
const addCardsToJsonValidationSchema = Yup.object({}).shape({
  userId: Yup.number().integer().required('User ID is required'),
  cardId: Yup.number().integer().required('Card ID is required'),
})

type AddCardsToJsonValues = Yup.InferType<typeof addCardsToJsonValidationSchema>

const addCardsToUsersValidationSchema = Yup.object({}).shape({
  newCards: Yup.string().required('New cards data is required'),
})

type AddCardsToUsersValues = Yup.InferType<
  typeof addCardsToUsersValidationSchema
>

const requestCardsValidationSchema = Yup.object({}).shape({
  season: Yup.number().integer().required('Season number is required'),
})

type RequestBaseCardsValues = Yup.InferType<typeof requestCardsValidationSchema>

const scripts: ScriptData[] = [
  { id: 'add-cards-to-users', name: 'Add Cards to Users' },
  { id: 'monthly-subscriptions', name: 'Distribute Monthly Subscription' },
  { id: 'request-base-cards', name: 'Request Base Cards' },
  { id: 'delete-duplicates', name: 'Delete Duplicate Cards' },
] as const

export default () => {
  const [selectedScript, setSelectedScript] =
    useState<(typeof scripts)[number]['id']>()
  const [formError, setFormError] = useState<string>('')
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

  const { mutate: distributeMonthlyPacks } = mutation<void, void>({
    mutationFn: () =>
      axios({
        method: POST,
        url: '/api/v3/monthly-subscriptions/distribute',
      }),
  })

  const { mutate: requestBaseCards } = mutation<void, { season: number }>({
    mutationFn: ({ season }: { season: number }) =>
      axios({ method: POST, url: '/api/v3/cards/base-requests', data: season }),
  })

  const { mutate: deleteDuplicateCards } = mutation<void, void>({
    mutationFn: () =>
      axios({ method: POST, url: '/api/v3/cards/delete-duplicates' }),
  })

  // useRedirectIfNotAuthenticated()
  // useRedirectIfNotAuthorized({ roles: ['TRADING_CARD_ADMIN'] })

  const AddCardsToUsersForm = () => {
    const [cardsToAdd, setCardsToAdd] = useState<Record<string, string[]>>({})

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
          setFormError(errorMessage)
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
      <div className="flex flex-col justify-center">
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.userId && touched.userId}>
            <FormLabel>User ID</FormLabel>
            <Input
              value={values.userId}
              disabled={isSubmitting || addCardsToUsersIsLoading}
              type="number"
              isRequired={true}
              onChange={handleChange}
              onBlur={handleBlur}
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
              onChange={handleChange}
              onBlur={handleBlur}
              name="cardId"
              className="font-mont"
            />
          </FormControl>
          <Button
            onClick={handleSubmitNewCards}
            disabled={!isValid || isSubmitting || addCardsToUsersIsLoading}
            type="button"
            className="mt-6 mx-1"
            isLoading={isSubmitting || addCardsToUsersIsLoading}
            loadingText="Submitting..."
          >
            Submit New Cards
          </Button>
          <Button
            disabled={!isValid || isSubmitting || addCardsToUsersIsLoading}
            type="submit"
            className="mt-6 mx-1"
            isLoading={isSubmitting || addCardsToUsersIsLoading}
          >
            Add Card to JSON
          </Button>
        </form>
        <div>
          {Object.entries(cardsToAdd).map(([userId, cardIds], userIdIndex) => (
            <Fragment key={userId}>
              {'{'}
              <br />
              &nbsp;&nbsp;userId:{' '}
              <Button onClick={() => deleteUserId(userId)}>{userId}</Button>,
              cardIds:{' ['}
              {cardIds?.map((cardId, cardIdIndex) => (
                <Fragment key={`${userId}-${cardId}-${cardIdIndex}`}>
                  <Button onClick={() => deleteCardId(userId, cardId)}>
                    {cardId}
                  </Button>
                  <span>{cardIdIndex === cardIds.length - 1 ? '' : ','}</span>
                </Fragment>
              ))}
              {']'}
              <br />
              {userIdIndex === Object.keys(cardsToAdd).length - 1 ? '}' : '},'}
            </Fragment>
          ))}
        </div>
      </div>
    )
  }

  const MonthlySubscriptionsForm = () => {
    const { isSubmitting, isValid } = useFormik<AddCardsToUsersValues>({
      validateOnBlur: true,
      validateOnChange: true,
      initialValues: {},
      onSubmit: async ({}, { setSubmitting }) => {
        try {
          setSubmitting(true)
          distributeMonthlyPacks()
        } catch (error) {
          console.error(error)
          const errorMessage: string =
            'message' in error
              ? error.message
              : 'Error submitting, please message caltroit_red_flames on Discord'
          setFormError(errorMessage)
        } finally {
          setSubmitting(false)
        }
      },
    })

    return (
      <div>
        <Button
          disabled={!isValid || isSubmitting}
          type="submit"
          className="mt-6 mx-1"
          isLoading={isSubmitting}
          loadingText="Submitting..."
        >
          Submit
        </Button>
        <UnorderedList>
          <ListItem>Display currently subscribed users</ListItem>
          <ListItem>Add user</ListItem>
          <ListItem>Remove user</ListItem>
        </UnorderedList>
      </div>
    )
  }

  const RequestBaseCardsForm = () => {
    const { isSubmitting, handleChange, handleBlur, isValid, handleSubmit } =
      useFormik<RequestBaseCardsValues>({
        validateOnBlur: true,
        validateOnChange: true,
        initialValues: {
          season: 0,
        },
        onSubmit: async ({ season }, { setSubmitting }) => {
          try {
            setSubmitting(true)
            requestBaseCards({ season })
          } catch (error) {
            console.error(error)
            const errorMessage: string =
              'message' in error
                ? error.message
                : 'Error submitting, please message caltroit_red_flames on Discord'
            setFormError(errorMessage)
          } finally {
            setSubmitting(false)
          }
        },
        validationSchema: addCardsToUsersValidationSchema,
      })

    return (
      <form onSubmit={handleSubmit}>
        <FormControl>
          <FormLabel>Season</FormLabel>
          <Input
            type="number"
            isRequired={true}
            onChange={handleChange}
            onBlur={handleBlur}
            name="season"
            className="font-mont"
          />
        </FormControl>
        <Button
          disabled={!isValid || isSubmitting}
          type="submit"
          className="mt-6 mx-1"
          isLoading={isSubmitting}
          loadingText="Submitting..."
        >
          Submit
        </Button>
      </form>
    )
  }

  const DeleteDuplicateCardsForm = () => {
    const { isSubmitting, isValid } = useFormik<{}>({
      validateOnBlur: true,
      validateOnChange: true,
      initialValues: {},
      onSubmit: async ({}, { setSubmitting }) => {
        try {
          setSubmitting(true)
          deleteDuplicateCards()
        } catch (error) {
          console.error(error)
          const errorMessage: string =
            'message' in error
              ? error.message
              : 'Error submitting, please message caltroit_red_flames on Discord'
          setFormError(errorMessage)
        } finally {
          setSubmitting(false)
        }
      },
    })

    return (
      <div>
        <Button
          disabled={!isValid || isSubmitting}
          type="submit"
          className="mt-6 mx-1"
          isLoading={isSubmitting}
          loadingText="Submitting..."
        >
          Submit
        </Button>
      </div>
    )
  }

  return (
    <PageWrapper className="h-full flex flex-col justify-center items-center w-11/12 md:w-3/4">
      <Select
        placeholder="Select a script"
        onChange={(event) => setSelectedScript(event.target.value as ScriptId)}
      >
        {scripts.map((script) => (
          <option key={script.id} value={script.id}>
            {script.name}
          </option>
        ))}
      </Select>
      {formError && (
        <div className="text-red dark:text-redDark">{formError}</div>
      )}
      <div className="mt-6">
        {selectedScript === 'add-cards-to-users' && <AddCardsToUsersForm />}
        {selectedScript === 'delete-duplicates' && <DeleteDuplicateCardsForm />}
        {selectedScript === 'monthly-subscriptions' && (
          <MonthlySubscriptionsForm />
        )}
        {selectedScript === 'request-base-cards' && <RequestBaseCardsForm />}
      </div>
    </PageWrapper>
  )
}
