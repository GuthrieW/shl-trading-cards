import { Button } from '@chakra-ui/react'
import { DELETE } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import axios from 'axios'
import { useFormik } from 'formik'

export default function DeleteDuplicateCardsForm({
  onError,
}: {
  onError: (errorMessage) => void
}) {
  const { mutateAsync: deleteDuplicateCards } = mutation<void, void>({
    mutationFn: () =>
      axios({ method: DELETE, url: '/api/v3/cards/delete-duplicates' }),
  })

  const { isSubmitting, isValid, handleSubmit } = useFormik<{}>({
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {},
    onSubmit: async ({}, { setSubmitting }) => {
      try {
        setSubmitting(true)
        onError(null)
        await deleteDuplicateCards()
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
        <form onSubmit={handleSubmit}>
          <Button
            disabled={!isValid || isSubmitting}
            type="submit"
            className="mt-4 mx-1"
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Delete Duplicate Cards
          </Button>
        </form>
      </div>
    </div>
  )
}
