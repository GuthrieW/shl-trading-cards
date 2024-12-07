import {
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from '@chakra-ui/react'
import Input from '@components/forms/Input'
import { PATCH } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'
import { MonthlySettingsData } from '@pages/api/v3/settings/monthly'
import { successToastOptions } from '@utils/toast'
import axios from 'axios'
import { useFormik } from 'formik'
import { pluralizeName } from 'lib/pluralize-name'
import { useState } from 'react'
import { useQueryClient } from 'react-query'
import * as Yup from 'yup'

const updateValidationSchema = Yup.object({}).shape({
  uid: Yup.number()
    .integer()
    .required('Whatever you did to make this happen, stop it.'),
  username: Yup.string().required(
    'Whatever you did to make this happen, stop it.'
  ),
  subscription: Yup.number()
    .integer()
    .min(0)
    .max(1)
    .required('Subscription amount is required, 0 or 1'),
})

type UpdateFormValues = Yup.InferType<typeof updateValidationSchema>

export default function UpdateMonthlySubscriptionModal({
  setting,
  isOpen,
  onClose,
}: {
  setting: MonthlySettingsData
  isOpen: boolean
  onClose: () => void
}) {
  const toast = useToast()
  const [formError, setFormError] = useState<string>('')
  const queryClient = useQueryClient()

  const { mutateAsync: updateMonthlySubscription } = mutation<
    void,
    {
      uid: number
      subscription: number
    }
  >({
    mutationFn: ({ uid, subscription }) =>
      axios({
        method: PATCH,
        url: `/api/v3/settings/monthly/${uid}`,
        data: { subscription },
      }),
    onSuccess: () => {
      toast({ title: 'Subscription Updated', ...successToastOptions })
      queryClient.invalidateQueries('monthly-subscriptions')
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
      uid: setting?.uid,
      username: setting?.username,
      subscription: setting?.subscription,
    },
    validationSchema: updateValidationSchema,
    onSubmit: async (
      subscriptionUpdates: MonthlySettingsData,
      { setSubmitting }
    ) => {
      try {
        await updateValidationSchema.validate(subscriptionUpdates)
      } catch (error) {
        console.error(error)
        setFormError(String(error))
        return
      }

      try {
        setSubmitting(true)
        setFormError(null)

        await updateMonthlySubscription({
          uid: setting?.uid,
          subscription: subscriptionUpdates.subscription,
        })
      } catch (error) {
        console.error(error)
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          Update {pluralizeName(setting?.username)} Subscription
        </ModalHeader>
        {formError && (
          <Alert status="error">
            <AlertIcon />
            {formError}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Input
              label="User ID"
              value={values.uid}
              disabled={true}
              type="number"
              name="uid"
              isInvalid={!!errors.uid && touched.uid}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Username"
              value={values.username}
              disabled={true}
              type="string"
              name="username"
              isInvalid={!!errors.username && touched.username}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            <Input
              label="Subscription"
              value={values.subscription}
              disabled={isSubmitting}
              type="number"
              name="subscription"
              isInvalid={!!errors.subscription && touched.subscription}
              onChange={handleChange}
              onBlur={handleBlur}
            />
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
