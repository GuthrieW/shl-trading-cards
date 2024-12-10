import {
  Alert,
  AlertDialog,
  AlertDialogBody,
  AlertDialogCloseButton,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertIcon,
  Button,
} from '@chakra-ui/react'
import { DELETE } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { MonthlySettingsData } from '@pages/api/v3/settings/monthly'
import axios from 'axios'
import { useFormik } from 'formik'
import { useRef, useState } from 'react'
import { useQueryClient } from 'react-query'

export default function DeleteMonthlySubscriptionDialog({
  setting,
  isOpen,
  onClose,
}: {
  setting: MonthlySettingsData
  isOpen: boolean
  onClose: () => void
}) {
  const [formError, onFormError] = useState<string>(null)
  const cancelRef = useRef(null)
  const queryClient = useQueryClient()
  const { mutateAsync: deleteMonthlySubscription } = mutation<
    void,
    { uid: number }
  >({
    mutationFn: ({ uid }) =>
      axios({
        method: DELETE,
        url: `/api/v3/settings/monthly/${uid}`,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries(['monthly-subscriptions'])
      onClose()
    },
  })

  const { isSubmitting, isValid, handleSubmit } = useFormik({
    initialValues: {},
    onSubmit: async ({}, { setSubmitting }) => {
      try {
        setSubmitting(true)
        onFormError(null)
        await deleteMonthlySubscription({ uid: setting?.uid })
      } catch (error) {
        console.error(error)
        const errorMessage: string =
          'message' in error
            ? error.message
            : 'Error submitting, please message caltroit_red_flames on Discord'
        onFormError(errorMessage)
      } finally {
        setSubmitting(false)
      }
    },
  })

  return (
    <AlertDialog
      isOpen={isOpen}
      leastDestructiveRef={cancelRef}
      onClose={onClose}
    >
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader className="bg-primary text-secondary">
            Delete Subscription for {setting?.username}
          </AlertDialogHeader>
          <AlertDialogCloseButton />
          <AlertDialogBody className="bg-primary text-secondary">
            Are you sure? You can't undo this action afterwards.
          </AlertDialogBody>
          <AlertDialogFooter className="bg-primary text-secondary">
            <form onSubmit={handleSubmit}>
              <Button
                disabled={!isValid || isSubmitting}
                colorScheme="red"
                type="submit"
                ml={3}
              >
                Delete Card
              </Button>
            </form>
            {formError && (
              <Alert className="text-white" status="error">
                <AlertIcon /> {formError}
              </Alert>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  )
}
