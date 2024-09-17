import {
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  FormControl,
  FormLabel,
  Input,
  Link,
  Textarea,
  useDisclosure,
} from '@chakra-ui/react'
import { useFormik } from 'formik'
import React, { useContext, useState } from 'react'
import * as Yup from 'yup'
import { ToastContext } from 'contexts/ToastContext'
import { useCookie } from '@hooks/useCookie'
import config from 'lib/config'
import axios from 'axios'
import { POST } from '@constants/http-methods'
import { mutation } from '@pages/api/database/mutation'

type DrawerId = 'bug' | 'feature'

type DrawerData = {
  id: DrawerId
  header: 'Report a Bug' | 'Suggest a Feature'
  form: React.ReactNode
}

const bugValidationSchema = Yup.object({}).shape({
  description: Yup.string().required('Description is required'),
  reproductionSteps: Yup.string().notRequired(),
  operatingSystem: Yup.string().notRequired(),
  browser: Yup.string().notRequired(),
  device: Yup.string().notRequired(),
})
type BugFormValues = Yup.InferType<typeof bugValidationSchema>

const featureValidationSchema = Yup.object({}).shape({
  description: Yup.string().required('Description is required'),
  desiredFunctionality: Yup.string().notRequired(),
})
type FeatureFormValues = Yup.InferType<typeof featureValidationSchema>

type GithubIssueData = { title: string; body: string; label: 'bug' | 'story' }

export const Footer = () => {
  const { isOpen, onClose, onOpen } = useDisclosure()
  const [drawerId, setDrawerId] = useState<DrawerId>(null)
  const [formError, setFormError] = useState<string>('')
  const { addToast } = useContext(ToastContext)
  const [uid] = useCookie(config.userIDCookieName)

  const { mutate: createGithubIssue } = mutation<void, GithubIssueData>({
    mutationFn: (requestData: GithubIssueData) =>
      axios({
        method: POST,
        url: 'api/v3/github/issue',
        data: requestData,
      }),
    onSuccess: ({ data }) => {
      addToast({
        title: 'Ticket Submitted',
        description: data?.payload?.newIssueUrl ?? null,
        status: 'success',
      })
      onClose()
    },
  })

  const openDrawer = (source: DrawerId) => {
    setDrawerId(source)
    onOpen()
  }

  const submitGithubIssue = async (
    issueData: BugFormValues | FeatureFormValues
  ) => {
    const bugCreator: string = uid ? `by ${uid}` : ' anonymously'

    const requestData: GithubIssueData = {
      title: '',
      body: '',
      label: null,
    }

    if ('reproductionSteps' in issueData) {
      requestData.title = `Bug Report (Submitted ${bugCreator})`
      requestData.label = 'bug'
      requestData.body = `## Description
${issueData.description}
    
## Reproduction Steps
${issueData.reproductionSteps}
    
## Operating System
${issueData.operatingSystem}
    
## Browser
${issueData.browser}
    
## Device
${issueData.device}`
    } else if ('desiredFunctionality' in issueData) {
      requestData.title = `Feature Request (Submitted ${bugCreator})`
      requestData.label = 'story'
      requestData.body = `## Description
${issueData.description}
    
## Desired Functionality
${issueData.desiredFunctionality}`
    }

    createGithubIssue(requestData)
  }

  const BugForm = () => {
    const {
      values,
      errors,
      touched,
      isSubmitting,
      handleChange,
      handleBlur,
      isValid,
      handleSubmit,
    } = useFormik<BugFormValues>({
      validateOnBlur: true,
      validateOnChange: true,
      initialValues: {
        description: '',
        reproductionSteps: '',
        operatingSystem: '',
        browser: '',
        device: '',
      },
      onSubmit: async (
        { description, reproductionSteps, operatingSystem, browser, device },
        { setSubmitting }
      ) => {
        try {
          setSubmitting(true)
          setFormError(null)
          await submitGithubIssue({
            description,
            reproductionSteps,
            operatingSystem,
            browser,
            device,
          })
          onClose()
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
      validationSchema: bugValidationSchema,
    })

    return (
      <div>
        {formError && (
          <div className="text-red dark:text-redDark">{formError}</div>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.description && touched.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              isRequired
              onChange={handleChange}
              onBlur={handleBlur}
              name="description"
              value={values.description}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Reproduction Steps</FormLabel>
            <Textarea
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="reproductionSteps"
              value={values.reproductionSteps}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Operating System</FormLabel>
            <Input
              type="text"
              placeholder="Windows/Mac/Linux/Other"
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="operatingSystem"
              value={values.operatingSystem}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Browser</FormLabel>
            <Input
              type="text"
              placeholder="Chrome/Edge/Firefox/Safari/Other"
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="browser"
              value={values.browser}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Device</FormLabel>
            <Input
              type="text"
              placeholder="Desktop/Tablet/Mobile/Other"
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="device"
              value={values.device}
              className="font-mont"
            />
          </FormControl>
          <Button
            disabled={!isValid}
            type="submit"
            className="mt-6"
            isLoading={isSubmitting}
            loadingText="Submitting..."
          >
            Submit
          </Button>
          <Button
            type="button"
            onClick={onClose}
            className="mt-6 mx-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </form>
      </div>
    )
  }

  const bugDrawerData: DrawerData = {
    id: 'bug',
    header: 'Report a Bug',
    form: <BugForm />,
  } as const

  const FeatureForm = () => {
    const {
      values,
      errors,
      touched,
      isSubmitting,
      handleChange,
      handleBlur,
      isValid,
      handleSubmit,
    } = useFormik<FeatureFormValues>({
      validateOnBlur: true,
      validateOnChange: true,
      initialValues: {
        description: '',
        desiredFunctionality: '',
      },
      onSubmit: async (
        { description, desiredFunctionality },
        { setSubmitting }
      ) => {
        try {
          setSubmitting(true)
          await submitGithubIssue({ description, desiredFunctionality })
          onClose()
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
      validationSchema: featureValidationSchema,
    })

    return (
      <div>
        {formError && (
          <div className="text-red dark:text-redDark">{formError}</div>
        )}
        <form onSubmit={handleSubmit}>
          <FormControl isInvalid={!!errors.description && touched.description}>
            <FormLabel>Description</FormLabel>
            <Textarea
              isRequired
              onChange={handleChange}
              onBlur={handleBlur}
              name="description"
              value={values.description}
              className="font-mont"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Desired Functionality</FormLabel>
            <Textarea
              isRequired={false}
              onChange={handleChange}
              onBlur={handleBlur}
              name="desiredFunctionality"
              value={values.desiredFunctionality}
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
          <Button
            type="button"
            onClick={onClose}
            className="mt-6 mx-1"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </form>
      </div>
    )
  }

  const featureDrawerData: DrawerData = {
    id: 'feature',
    header: 'Suggest a Feature',
    form: <FeatureForm />,
  } as const

  return (
    <>
      <footer className="absolute bottom-0 flex h-16 w-full items-center justify-center bg-primary text-secondaryText dark:bg-primaryDark dark:text-secondaryTextDark">
        <div className="font-mont text-xs">
          &copy;&nbsp;{new Date().getFullYear()}&nbsp;|&nbsp;
          <span className="hidden sm:inline">
            {'Made with ♥︎ by the SHL Dev Team'}&nbsp;|&nbsp;
          </span>
          <Link href="https://simulationhockey.com/index.php" isExternal>
            Visit Forum
          </Link>
          &nbsp;|&nbsp;
          <Link onClick={() => openDrawer('bug')}>{bugDrawerData.header}</Link>
          &nbsp;|&nbsp;
          <Link onClick={() => openDrawer('feature')}>
            {featureDrawerData.header}
          </Link>
        </div>
      </footer>
      <Drawer placement="bottom" isOpen={isOpen} onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>
            {drawerId === 'bug' && bugDrawerData.header}
            {drawerId === 'feature' && featureDrawerData.header}
          </DrawerHeader>
          <DrawerBody>
            {drawerId === 'bug' && bugDrawerData.form}
            {drawerId === 'feature' && featureDrawerData.form}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  )
}
