import { useSession } from '@hooks/useSession'
import { useFormik } from 'formik'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import * as Yup from 'yup'

const validationSchema = Yup.object({}).shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required'),
})

type FormValues = Yup.InferType<typeof validationSchema>

export default () => {
  const router = useRouter()
  const [loginError, setLoginError] = useState('')
  const [revealPassword, setRevealPassword] = useState(false)
  const { isLoggedIn, handleLogin } = useSession()

  useEffect(() => {
    if (isLoggedIn) {
      router.replace('/')
    }
  }, [isLoggedIn, router])

  const {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    isValid,
    handleSubmit,
  } = useFormik<FormValues>({
    validateOnBlur: true,
    validateOnChange: true,
    initialValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ username, password }, { setSubmitting }) => {
      setSubmitting(true)
      try {
        await handleLogin(username, password)
        router.push('/')
        setSubmitting(false)
      } catch (error) {
        const errorMessage =
          'errorMessage' in error
            ? error.errorMessage
            : 'message' in error
              ? error.message
              : "We're having issues, please try again later"
        setLoginError(errorMessage)
        setSubmitting(false)
      }
    },
    validationSchema,
  })

  return (
    <>
      <NextSeo title="Log in" openGraph={{ title: 'Log in' }} />
    </>
  )
}
