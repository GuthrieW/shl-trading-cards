import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useState } from 'react'
import * as Yup from 'yup'

const requestCardsValidationSchema = Yup.object({}).shape({
  season: Yup.number().integer().required('Season number is required'),
})

type RequestBaseCardsValues = Yup.InferType<typeof requestCardsValidationSchema>

export default function RequestBaseCardsForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const router = useRouter()
  const [skaterErrors, setSkaterErrors] = useState(null)
  const [goalieErrors, setGoalieErrors] = useState(null)

  const { mutateAsync: requestBaseCards } = mutation<void, { season: number }>({
    mutationFn: async ({ season }: { season: number }) => {
      const response = await axios({
        method: POST,
        url: '/api/v3/cards/base-requests',
        data: { season },
      })

      if (response.data.payload) {
        setSkaterErrors(response.data.payload.skaterErrors)
        setGoalieErrors(response.data.payload.goalieErrors)
      }
    },
  })

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
          onError(null)
          await requestBaseCards({ season })
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
      validationSchema: requestCardsValidationSchema,
    })

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex justify-end items-center">
          <Button
            disabled={
              !isValid ||
              isSubmitting || // disable this in dev
              router.pathname.includes('localhost') ||
              router.pathname.includes('cardsdev')
            }
            type="submit"
            className="mt-4 mx-1"
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Request Base Cards
          </Button>
        </div>

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
      </form>
      {skaterErrors && (
        <div>
          {JSON.stringify(skaterErrors)}
          <br />
        </div>
      )}
      {goalieErrors && (
        <div>
          {JSON.stringify(goalieErrors)}
          <br />
        </div>
      )}
    </div>
  )
}
