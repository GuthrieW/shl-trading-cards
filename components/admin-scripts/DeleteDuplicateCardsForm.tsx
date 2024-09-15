import { Button } from '@chakra-ui/react'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { useFormik } from 'formik'

export default function DeleteDuplicateCardsForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const { mutate: deleteDuplicateCards } = mutation<void, void>({
    mutationFn: () =>
      axios({ method: POST, url: '/api/v3/cards/delete-duplicates' }),
  })

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
        onError(errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
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
          Delete Duplicate Cards
        </Button>
      </div>
    </div>
  )
}
