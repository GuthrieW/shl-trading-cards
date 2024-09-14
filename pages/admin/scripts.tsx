import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
} from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { useRedirectIfNotAuthenticated } from '@hooks/useRedirectIfNotAuthenticated'
import { useRedirectIfNotAuthorized } from '@hooks/useRedirectIfNotAuthorized'
import axios from 'axios'
import { useFormik } from 'formik'
import { useState } from 'react'
import { useMutation } from 'react-query'
import * as Yup from 'yup'

type ScriptData = {
  id: string
  name: string
  form: React.ReactNode
}

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

export default () => {
  const [formError, setFormError] = useState<string>('')
  const { mutate: addCardsToUsers } = useMutation((newCardsJson: any) =>
    axios({ method: POST, url: '/api/v3/', data: newCardsJson })
  )

  const { mutate: distributeMonthlyPacks } = useMutation(() =>
    axios({ method: POST, url: '' })
  )

  const { mutate: requestBaseCards } = useMutation((season: number) =>
    axios({ method: POST, url: '', data: season })
  )

  const { mutate: deleteDuplicateCards } = useMutation(() =>
    axios({ method: POST, url: '' })
  )

  useRedirectIfNotAuthenticated()
  useRedirectIfNotAuthorized({ roles: ['TRADING_CARD_ADMIN'] })

  const AddCardsToUsersForm = () => {
    const {
      values,
      errors,
      touched,
      isSubmitting,
      handleChange,
      handleBlur,
      isValid,
      handleSubmit,
    } = useFormik<AddCardsToUsersValues>({
      validateOnBlur: true,
      validateOnChange: true,
      initialValues: {
        newCards: '',
      },
      onSubmit: async (
        { newCards }: { newCards: string },
        { setSubmitting }
      ) => {
        try {
          setSubmitting(true)
          const newCardsJson = JSON.parse(newCards)
          addCardsToUsers(newCardsJson)
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
        <FormControl isInvalid={!!errors.newCards && touched.newCards}>
          <FormLabel>New Cards Data</FormLabel>
          <Textarea
            isRequired
            onChange={handleChange}
            onBlur={handleBlur}
            name="newCards"
            value={values.newCards}
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
      </div>
    )
  }

  const RequestBaseCards = () => {
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
            requestBaseCards(season)
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

  const DeleteDuplicateCards = () => {
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

  const scripts: ScriptData[] = [
    {
      id: 'add-cards-to-users',
      name: 'Add Cards to Users',
      form: <AddCardsToUsersForm />,
    },
    {
      id: 'monthly-subscriptions',
      name: 'Distribute Monthly Subscription',
      form: <MonthlySubscriptionsForm />,
    },
    {
      id: 'request-base-cards',
      name: 'Request Base Cards',
      form: <RequestBaseCards />,
    },
    {
      id: 'delete-duplicates',
      name: 'Delete Duplicate Cards',
      form: <DeleteDuplicateCards />,
    },
  ]

  return (
    <>
      <Select placeholder="Select a script">
        {scripts.map((script) => (
          <option value={script.id}>{script.name}</option>
        ))}
      </Select>
      {formError && (
        <div className="text-red dark:text-redDark">{formError}</div>
      )}
    </>
  )
}
