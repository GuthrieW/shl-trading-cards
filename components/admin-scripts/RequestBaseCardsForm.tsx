import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { useFormik } from 'formik'
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
  const { mutate: requestBaseCards } = mutation<void, { season: number }>({
    mutationFn: ({ season }: { season: number }) =>
      axios({ method: POST, url: '/api/v3/cards/base-requests', data: season }),
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
          requestBaseCards({ season })
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
      <div className="flex justify-end items-center">
        <Button
          disabled={!isValid || isSubmitting}
          type="submit"
          className="mt-4 mx-1"
          isLoading={isSubmitting}
          loadingText="Submitting..."
        >
          Request Base Cards
        </Button>
      </div>

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
      </form>
    </div>
  )
}
